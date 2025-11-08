// Vercel Serverless Function to list all users (Admin only)
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
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

    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    // Fetch users from database
    const listResponse = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/users?select=*&order=created_at.desc&limit=${limit}&offset=${offset}`,
      {
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!listResponse.ok) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    const usersList = await listResponse.json();

    // Get total count
    const countResponse = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/users?select=id&limit=1`,
      {
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'count=exact'
        }
      }
    );

    const totalCount = countResponse.headers.get('content-range')?.split('/')[1] || usersList.length;

    return res.status(200).json({
      success: true,
      users: usersList,
      pagination: {
        page: page,
        limit: limit,
        total: parseInt(totalCount),
        totalPages: Math.ceil(parseInt(totalCount) / limit)
      }
    });

  } catch (error) {
    console.error('List users error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

