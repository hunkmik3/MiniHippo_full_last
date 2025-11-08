// Vercel Serverless Function to upload lesson to GitHub
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filePath, content, message, append } = req.body;

    // Validate required fields
    if (!filePath || !content || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: filePath, content, message' 
      });
    }

    // Get environment variables
    const githubToken = process.env.GITHUB_TOKEN;
    const githubOwner = process.env.GITHUB_OWNER;
    const githubRepo = process.env.GITHUB_REPO;

    if (!githubToken || !githubOwner || !githubRepo) {
      return res.status(500).json({ 
        error: 'GitHub configuration missing. Please set GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO environment variables.' 
      });
    }

    // Validate file path (prevent directory traversal)
    const allowedPaths = [
      'js/reading_question/reading_question1.js',
      'js/reading_question/reading_question2.js',
      'js/reading_question/reading_question4.js',
      'js/reading_question/reading_question5.js'
    ];

    if (!allowedPaths.includes(filePath)) {
      return res.status(400).json({ 
        error: 'Invalid file path. Allowed paths: ' + allowedPaths.join(', ') 
      });
    }

    // Get current file SHA if it exists (for update)
    let sha = null;
    try {
      const getFileResponse = await fetch(
        `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${filePath}`,
        {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (getFileResponse.ok) {
        const fileData = await getFileResponse.json();
        sha = fileData.sha;
      }
    } catch (error) {
      // File doesn't exist, will create new one
      console.log('File does not exist, will create new file');
    }

    // Encode content to base64
    const encodedContent = Buffer.from(content).toString('base64');

    // Prepare request body
    const requestBody = {
      message: message,
      content: encodedContent,
      branch: 'main' // or 'master' depending on your default branch
    };

    // Add SHA if updating existing file
    if (sha) {
      requestBody.sha = sha;
    }

    // Commit file to GitHub
    const response = await fetch(
      `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GitHub API error:', errorData);
      return res.status(response.status).json({ 
        error: 'Failed to commit file to GitHub',
        details: errorData.message || 'Unknown error'
      });
    }

    const result = await response.json();

    // Extract metadata from JS code and save to Supabase
    try {
      const part = extractPartFromFilePath(filePath);
      const metadata = extractMetadataFromJS(content, part);
      
      if (metadata && part) {
        await saveLessonMetadata(part, filePath, metadata);
      }
    } catch (metadataError) {
      // Log error but don't fail the upload
      console.error('Failed to save metadata:', metadataError);
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'File committed successfully',
      commitUrl: result.commit.html_url,
      fileUrl: result.content.html_url,
      commitSha: result.commit.sha
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

// Helper function to extract part number from file path
function extractPartFromFilePath(filePath) {
  const partMap = {
    'reading_question1.js': 1,
    'reading_question2.js': 2,
    'reading_question4.js': 4,
    'reading_question5.js': 5
  };
  
  for (const [key, part] of Object.entries(partMap)) {
    if (filePath.includes(key)) {
      return part;
    }
  }
  return null;
}

// Helper function to extract metadata from JS code
function extractMetadataFromJS(jsCode, part) {
  try {
    // Extract number of sets
    let numSets = 0;
    const setsMatch = jsCode.match(/const\s+options\s*=\s*\[/);
    if (setsMatch) {
      // Count array elements (rough estimate)
      const arrayMatch = jsCode.match(/const\s+options\s*=\s*\[([^\]]*)\]/s);
      if (arrayMatch) {
        numSets = (arrayMatch[1].match(/options_\d+/g) || []).length;
      }
    }
    
    // Extract topics
    let topics = [];
    if (part === 5) {
      const topicMatch = jsCode.match(/const\s+topic_name\s*=\s*\{([^}]+)\}/s);
      if (topicMatch) {
        const topicLines = topicMatch[1].match(/topic_\d+:\s*"([^"]+)"/g) || [];
        topics = topicLines.map(line => line.match(/"([^"]+)"/)[1]);
      }
    }
    
    // Get first topic as title
    const title = topics.length > 0 ? topics[0] : `Part ${part} Lesson`;
    
    return {
      num_sets: numSets || 1,
      topics: topics,
      title: title
    };
  } catch (error) {
    console.error('Metadata extraction error:', error);
    return {
      num_sets: 1,
      topics: [],
      title: `Part ${part} Lesson`
    };
  }
}

// Helper function to save lesson metadata to Supabase
async function saveLessonMetadata(part, filePath, metadata) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return; // Supabase not configured, skip
  }
  
  // Check if lesson already exists
  const checkResponse = await fetch(
    `${supabaseUrl}/rest/v1/lessons?part=eq.${part}&file_path=eq.${filePath}&select=id`,
    {
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  const existing = await checkResponse.json();
  
  const lessonData = {
    part: part,
    file_path: filePath,
    title: metadata.title,
    topic: metadata.topics.join(', ') || metadata.title,
    num_sets: metadata.num_sets,
    updated_at: new Date().toISOString()
  };
  
  if (existing && existing.length > 0) {
    // Update existing record
    await fetch(
      `${supabaseUrl}/rest/v1/lessons?id=eq.${existing[0].id}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(lessonData)
      }
    );
  } else {
    // Insert new record
    lessonData.created_at = new Date().toISOString();
    await fetch(
      `${supabaseUrl}/rest/v1/lessons`,
      {
        method: 'POST',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(lessonData)
      }
    );
  }
}

