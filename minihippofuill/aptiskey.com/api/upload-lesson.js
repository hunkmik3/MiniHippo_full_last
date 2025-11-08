// Vercel Serverless Function to upload lesson to GitHub
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filePath, content, message, append, lessonId, title, topic } = req.body;

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
    // Allow both fixed paths and custom paths with lesson ID
    const allowedBasePaths = [
      'js/reading_question/reading_question1',
      'js/reading_question/reading_question2',
      'js/reading_question/reading_question4',
      'js/reading_question/reading_question5'
    ];
    
    // Check if file path matches allowed pattern
    const isValidPath = allowedBasePaths.some(basePath => {
      // Allow exact match (reading_question1.js)
      if (filePath === `${basePath}.js`) return true;
      // Allow custom paths with lesson ID (reading_question1_lesson_xxx.js)
      if (filePath.startsWith(`${basePath}_lesson_`) && filePath.endsWith('.js')) return true;
      return false;
    });
    
    if (!isValidPath) {
      return res.status(400).json({ 
        error: 'Invalid file path. Must be one of: ' + allowedBasePaths.map(p => `${p}.js`).join(', ') + ' or custom path with _lesson_ prefix'
      });
    }
    
    // Prevent directory traversal
    if (filePath.includes('..') || filePath.includes('//')) {
      return res.status(400).json({ 
        error: 'Invalid file path: directory traversal detected' 
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
        // Use provided title/topic if available, otherwise use extracted metadata
        const finalTitle = title || metadata.title;
        const finalTopic = topic || (metadata.topics && metadata.topics.length > 0 ? metadata.topics.join(', ') : '') || metadata.title;
        
        const result = await saveLessonMetadata(part, filePath, {
          ...metadata,
          title: finalTitle,
          topic: finalTopic
        }, lessonId);
        
        console.log('Metadata saved successfully:', result);
      } else {
        console.warn('Could not extract metadata: part=', part, 'metadata=', metadata);
      }
    } catch (metadataError) {
      // Log error but don't fail the upload
      console.error('Failed to save metadata:', metadataError);
      console.error('Error stack:', metadataError.stack);
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
    // Extract number of sets based on part
    let numSets = 0;
    let topics = [];
    let title = `Part ${part} Lesson`;
    
    switch(part) {
      case 1:
        // Part 1: Count questionsArrays or questions1_X
        const part1Match = jsCode.match(/const\s+questionsArrays\s*=\s*\[/);
        if (part1Match) {
          const arrayMatch = jsCode.match(/const\s+questionsArrays\s*=\s*\[([^\]]*)\]/s);
          if (arrayMatch) {
            numSets = (arrayMatch[1].match(/questions1_\d+/g) || []).length;
          }
        }
        // Try to extract title from comments
        const part1TitleMatch = jsCode.match(/\/\/\s*(.+?)\n/);
        if (part1TitleMatch) {
          title = part1TitleMatch[1].trim() || title;
        }
        break;
        
      case 2:
        // Part 2: Count questionSets or question2Content_X
        const part2Match = jsCode.match(/const\s+questionSets\s*=\s*\[/);
        if (part2Match) {
          const arrayMatch = jsCode.match(/const\s+questionSets\s*=\s*\[([^\]]*)\]/s);
          if (arrayMatch) {
            numSets = (arrayMatch[1].match(/question2Content_\d+/g) || []).length;
          }
        }
        // Extract topics from questheader1
        const questheaderMatch = jsCode.match(/const\s+questheader1\s*=\s*\{([^}]+)\}/s);
        if (questheaderMatch) {
          const topicLines = questheaderMatch[1].match(/question2Content_\d+:\s*"([^"]+)"/g) || [];
          topics = topicLines.map(line => {
            const match = line.match(/"([^"]+)"/);
            return match ? match[1] : '';
          }).filter(t => t);
        }
        if (topics.length > 0) {
          title = topics[0];
        }
        break;
        
      case 4:
        // Part 4: Count question4Content array
        const part4Match = jsCode.match(/const\s+question4Content\s*=\s*\[/);
        if (part4Match) {
          const arrayMatch = jsCode.match(/const\s+question4Content\s*=\s*\[([^\]]*)\]/s);
          if (arrayMatch) {
            numSets = (arrayMatch[1].match(/question4Content_\d+/g) || []).length;
          }
        }
        // Extract topics from question4Topic1
        const topic4Match = jsCode.match(/const\s+question4Topic1\s*=\s*\{([^}]+)\}/s);
        if (topic4Match) {
          const topicLines = topic4Match[1].match(/topic\d+:\s*"([^"]+)"/g) || [];
          topics = topicLines.map(line => {
            const match = line.match(/"([^"]+)"/);
            return match ? match[1] : '';
          }).filter(t => t);
        }
        if (topics.length > 0) {
          title = topics[0];
        }
        break;
        
      case 5:
        // Part 5: Count options array
        const part5Match = jsCode.match(/const\s+options\s*=\s*\[/);
        if (part5Match) {
          const arrayMatch = jsCode.match(/const\s+options\s*=\s*\[([^\]]*)\]/s);
          if (arrayMatch) {
            numSets = (arrayMatch[1].match(/options_\d+/g) || []).length;
          }
        }
        // Extract topics from topic_name
        const topic5Match = jsCode.match(/const\s+topic_name\s*=\s*\{([^}]+)\}/s);
        if (topic5Match) {
          const topicLines = topic5Match[1].match(/topic_\d+:\s*"([^"]+)"/g) || [];
          topics = topicLines.map(line => {
            const match = line.match(/"([^"]+)"/);
            return match ? match[1] : '';
          }).filter(t => t);
        }
        if (topics.length > 0) {
          title = topics[0];
        }
        break;
    }
    
    // Fallback: if numSets is still 0, try to count by pattern matching
    if (numSets === 0) {
      // Try to count any pattern like _X where X is a number
      const allMatches = jsCode.match(/_\d+\s*[,=]/g) || [];
      if (allMatches.length > 0) {
        // Get unique numbers
        const uniqueNumbers = new Set();
        allMatches.forEach(match => {
          const numMatch = match.match(/_(\d+)/);
          if (numMatch) {
            uniqueNumbers.add(numMatch[1]);
          }
        });
        numSets = uniqueNumbers.size;
      }
    }
    
    // Ensure at least 1 set
    if (numSets === 0) {
      numSets = 1;
    }
    
    return {
      num_sets: numSets,
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
async function saveLessonMetadata(part, filePath, metadata, lessonId) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase not configured, skipping metadata save');
    return null; // Supabase not configured, skip
  }
  
  const lessonData = {
    part: part,
    file_path: filePath,
    title: metadata.title || `Part ${part} Lesson`,
    topic: metadata.topic || (metadata.topics && metadata.topics.length > 0 ? metadata.topics.join(', ') : '') || metadata.title || `Part ${part} Lesson`,
    num_sets: metadata.num_sets || 1,
    updated_at: new Date().toISOString()
  };
  
  console.log('Saving lesson metadata:', lessonData);
  
  if (lessonId) {
    // Update existing record by ID
    const updateResponse = await fetch(
      `${supabaseUrl}/rest/v1/lessons?id=eq.${lessonId}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(lessonData)
      }
    );
    
    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.error('Failed to update lesson:', errorData);
      throw new Error(`Failed to update lesson: ${errorData.message || 'Unknown error'}`);
    }
    
    const updated = await updateResponse.json();
    console.log('Lesson updated:', updated);
    return updated;
  } else {
    // Always insert new record (don't check for existing)
    // This allows multiple lessons with different file paths
    lessonData.created_at = new Date().toISOString();
    
    const insertResponse = await fetch(
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
    
    if (!insertResponse.ok) {
      const errorData = await insertResponse.json();
      console.error('Failed to insert lesson:', errorData);
      console.error('Lesson data:', lessonData);
      throw new Error(`Failed to insert lesson: ${errorData.message || 'Unknown error'}`);
    }
    
    const inserted = await insertResponse.json();
    console.log('Lesson inserted:', inserted);
    return inserted;
  }
}

