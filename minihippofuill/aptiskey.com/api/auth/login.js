// Vercel Serverless Function for user login
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
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

    // Import Supabase client (you'll need to install @supabase/supabase-js)
    // For now, we'll use fetch to call Supabase REST API
    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(401).json({ 
        error: 'Invalid email or password',
        details: errorData.message || 'Authentication failed'
      });
    }

    const authData = await response.json();

    // Get user info
    const userResponse = await fetch(`${supabaseUrl}/rest/v1/users?email=eq.${email}&select=*`, {
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

    // Return success with token and user info
    return res.status(200).json({
      success: true,
      token: authData.access_token,
      refreshToken: authData.refresh_token,
      user: {
        id: user?.id || authData.user?.id,
        email: user?.email || authData.user?.email,
        role: user?.role || 'user',
        status: user?.status || 'active'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

