// Vercel Serverless Function for user logout
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get token from header or body
    const token = req.headers.authorization?.replace('Bearer ', '') || req.body?.token;
    const refreshToken = req.body?.refreshToken;

    if (!token) {
      // If no token, just return success (client-side cleanup)
      return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    }

    // Get Supabase configuration
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (supabaseUrl && supabaseServiceKey && refreshToken) {
      // Revoke refresh token with Supabase (optional)
      try {
        await fetch(`${supabaseUrl}/auth/v1/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'apikey': supabaseServiceKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            refresh_token: refreshToken
          })
        });
      } catch (error) {
        // Ignore errors, token might already be invalid
        console.log('Token revocation error (ignored):', error.message);
      }
    }

    // Return success
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    // Still return success even if there's an error
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  }
}

