// Vercel Serverless Function to update a user (Admin only)
export default async function handler(req, res) {
  // Only allow PUT requests
  if (req.method !== 'PUT') {
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
    const { id, email, username, role, status, password } = req.body;

    if (!id) {
      return res.status(400).json({ 
        error: 'User ID is required' 
      });
    }

    // Update user in users table
    const updateData = {};
    if (email !== undefined) updateData.email = email;
    if (username !== undefined) updateData.username = username;
    if (role !== undefined) updateData.role = role;
    if (status !== undefined) updateData.status = status;

    if (Object.keys(updateData).length > 0) {
      const updateResponse = await fetch(
        `${process.env.SUPABASE_URL}/rest/v1/users?id=eq.${id}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': process.env.SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(updateData)
        }
      );

      if (!updateResponse.ok) {
        return res.status(400).json({ 
          error: 'Failed to update user',
          details: await updateResponse.text()
        });
      }
    }

    // Update password if provided
    if (password) {
      const passwordResponse = await fetch(
        `${process.env.SUPABASE_URL}/auth/v1/admin/users/${id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
            'apikey': process.env.SUPABASE_SERVICE_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            password: password
          })
        }
      );

      if (!passwordResponse.ok) {
        console.error('Failed to update password:', await passwordResponse.text());
      }
    }

    // Get updated user
    const getUserResponse = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/users?id=eq.${id}&select=*`,
      {
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const updatedUsers = await getUserResponse.json();

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUsers[0]
    });

  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

