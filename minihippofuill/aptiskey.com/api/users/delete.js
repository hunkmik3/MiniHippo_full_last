// Vercel Serverless Function to delete a user (Admin only)
export default async function handler(req, res) {
  // Only allow DELETE requests
  if (req.method !== 'DELETE') {
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

    // Get user ID from query or body
    const userId = req.query.id || req.body?.id;

    if (!userId) {
      return res.status(400).json({ 
        error: 'User ID is required' 
      });
    }

    // Prevent deleting yourself
    if (userId === adminUser.id) {
      return res.status(400).json({ 
        error: 'Cannot delete your own account' 
      });
    }

    // Delete user from auth (this will cascade delete from users table if foreign key is set)
    const deleteAuthResponse = await fetch(
      `${process.env.SUPABASE_URL}/auth/v1/admin/users/${userId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
          'apikey': process.env.SUPABASE_SERVICE_KEY
        }
      }
    );

    if (!deleteAuthResponse.ok && deleteAuthResponse.status !== 404) {
      // Also try deleting from users table directly
      const deleteUserResponse = await fetch(
        `${process.env.SUPABASE_URL}/rest/v1/users?id=eq.${userId}`,
        {
          method: 'DELETE',
          headers: {
            'apikey': process.env.SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!deleteUserResponse.ok) {
        return res.status(400).json({ 
          error: 'Failed to delete user',
          details: await deleteUserResponse.text()
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

