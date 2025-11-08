// Vercel Serverless Function to verify authentication token
export default async function handler(req, res) {
  // Allow GET and POST requests
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get token from header or body
    const token = req.headers.authorization?.replace('Bearer ', '') || req.body?.token;

    if (!token) {
      return res.status(401).json({ 
        error: 'No token provided' 
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

    // Verify token with Supabase
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': supabaseServiceKey
      }
    });

    if (!response.ok) {
      return res.status(401).json({ 
        error: 'Invalid or expired token' 
      });
    }

    const userData = await response.json();

    // Get additional user info from users table
    const userResponse = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${userData.id}&select=*`, {
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json'
      }
    });

    let user = null;
    if (userResponse.ok) {
      const users = await userResponse.json();
      user = users[0] || null;
    }

    // Return user info
    return res.status(200).json({
      success: true,
      user: {
        id: user?.id || userData.id,
        email: user?.email || userData.email,
        role: user?.role || 'user',
        status: user?.status || 'active'
      }
    });

  } catch (error) {
    console.error('Verify error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

