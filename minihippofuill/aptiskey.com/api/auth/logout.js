import parseBody from '../_utils/parseBody.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: 'Supabase environment variables are missing' });
  }

  let body = {};

  try {
    body = await parseBody(req);
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Invalid payload' });
  }

  const token = body.token;

  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refresh_token: body.refreshToken
      })
    });

    if (!response.ok) {
      const data = await response.json();
      return res.status(response.status).json({
        error: data.error_description || data.error || 'Đăng xuất thất bại'
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Auth logout error:', error);
    return res.status(500).json({
      error: 'Có lỗi xảy ra khi đăng xuất',
      details: error.message
    });
  }
}


