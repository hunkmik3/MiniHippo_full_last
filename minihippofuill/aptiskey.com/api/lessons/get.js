// Vercel Serverless Function to get a single lesson by ID
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get lesson ID from query
    const lessonId = req.query.id;

    if (!lessonId) {
      return res.status(400).json({ 
        error: 'Lesson ID is required' 
      });
    }

    // Get Supabase configuration
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ 
        error: 'Supabase configuration missing' 
      });
    }

    // Fetch lesson from database
    const response = await fetch(
      `${supabaseUrl}/rest/v1/lessons?id=eq.${lessonId}&select=*`,
      {
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ 
        error: 'Failed to fetch lesson',
        details: errorData.message || 'Unknown error'
      });
    }

    const lessons = await response.json();

    if (!lessons || lessons.length === 0) {
      return res.status(404).json({ 
        error: 'Lesson not found' 
      });
    }

    return res.status(200).json({
      success: true,
      lesson: lessons[0]
    });

  } catch (error) {
    console.error('Get lesson error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

