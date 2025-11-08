// Vercel Serverless Function to create a new user (Admin only)
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check admin authentication
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify admin role
    const verifyResponse = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': process.env.SUPABASE_SERVICE_KEY
      }
    });

    if (!verifyResponse.ok) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const adminUser = await verifyResponse.json();
    
    // Check if user is admin
    const userResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/users?id=eq.${adminUser.id}&select=role`, {
      headers: {
        'apikey': process.env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const users = await userResponse.json();
    if (!users[0] || users[0].role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Get user data from request
    const { email, password, username, role = 'user', status = 'active' } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Create user with Supabase Auth
    const createUserResponse = await fetch(`${process.env.SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          username: username || email.split('@')[0]
        }
      })
    });

    if (!createUserResponse.ok) {
      const errorData = await createUserResponse.json();
      return res.status(400).json({ 
        error: 'Failed to create user',
        details: errorData.message || 'User might already exist'
      });
    }

    const authUser = await createUserResponse.json();

    // Insert user record into users table
    const insertResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'apikey': process.env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        id: authUser.id,
        email: email,
        username: username || email.split('@')[0],
        role: role,
        status: status
      })
    });

    if (!insertResponse.ok) {
      // User created in auth but failed to insert in users table
      console.error('Failed to insert user record:', await insertResponse.text());
    }

    const userRecord = await insertResponse.json();

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: userRecord[0]?.id || authUser.id,
        email: userRecord[0]?.email || email,
        username: userRecord[0]?.username || username,
        role: userRecord[0]?.role || role,
        status: userRecord[0]?.status || status
      }
    });

  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

