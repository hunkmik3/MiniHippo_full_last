// Vercel Serverless Function to list lessons
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get Supabase configuration
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ 
        error: 'Supabase configuration missing' 
      });
    }

    // Get part filter from query
    const part = req.query.part;

    // Build query
    let queryUrl = `${supabaseUrl}/rest/v1/lessons?select=*&order=created_at.desc`;
    if (part) {
      queryUrl += `&part=eq.${part}`;
    }

    // Fetch lessons from database
    const response = await fetch(queryUrl, {
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      // If table doesn't exist yet, return empty array
      if (response.status === 404 || response.status === 400) {
        return res.status(200).json({
          success: true,
          lessons: []
        });
      }
      return res.status(500).json({ error: 'Failed to fetch lessons' });
    }

    const lessons = await response.json();

    return res.status(200).json({
      success: true,
      lessons: lessons || []
    });

  } catch (error) {
    console.error('List lessons error:', error);
    // Return empty array on error instead of failing
    return res.status(200).json({
      success: true,
      lessons: []
    });
  }
}

