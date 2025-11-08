// Vercel Serverless Function to delete a lesson
export default async function handler(req, res) {
  // Only allow DELETE requests
  if (req.method !== 'DELETE') {
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

    // Delete lesson from database
    const response = await fetch(
      `${supabaseUrl}/rest/v1/lessons?id=eq.${lessonId}`,
      {
        method: 'DELETE',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ 
        error: 'Failed to delete lesson',
        details: errorData.message || 'Unknown error'
      });
    }

    const deleted = await response.json();

    return res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully',
      deleted: deleted
    });

  } catch (error) {
    console.error('Delete lesson error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

