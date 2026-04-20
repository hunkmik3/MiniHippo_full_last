import parseBody from '../_utils/parseBody.js';
import { selectFrom } from '../_utils/supabase.js';
import { resolveDeviceLimit } from '../_utils/device.js';

const SUPABASE_URL = process.env.SUPABASE_URL?.trim();
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY?.trim();

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
    return res.status(400).json({ error: error.message || 'Invalid request body' });
  }

  const refreshToken = String(body.refreshToken || body.refresh_token || '').trim();
  if (!refreshToken) {
    return res.status(400).json({ error: 'Thiếu refresh token' });
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error_description || data.error || 'Làm mới phiên đăng nhập thất bại'
      });
    }

    const supabaseUser = data.user;
    const userId = supabaseUser?.id;
    if (!userId) {
      return res.status(500).json({ error: 'Không lấy được thông tin tài khoản' });
    }

    const profile = await selectFrom('users', {
      filters: [{ column: 'id', value: userId }],
      single: true
    });

    if (!profile) {
      return res.status(403).json({ error: 'Tài khoản chưa được cấp quyền truy cập' });
    }

    if (profile.status && profile.status !== 'active') {
      return res.status(403).json({ error: 'Tài khoản đang bị khóa' });
    }

    const userPayload = {
      id: profile.id || userId,
      email: profile.email || supabaseUser.email,
      username: profile.username || supabaseUser.user_metadata?.username || '',
      role: profile.role || 'user',
      status: profile.status || 'active',
      accountCode: profile.account_code || '',
      fullName: profile.full_name || '',
      phone: profile.phone_number || null,
      deviceLimit: resolveDeviceLimit(profile),
      expiresAt: profile.expires_at || null,
      startedOn: profile.started_on || null,
      notes: profile.notes || null,
      learningProgram: profile.learning_program || null,
      course: profile.course || null,
      band: profile.band || null
    };

    return res.status(200).json({
      success: true,
      token: data.access_token,
      refreshToken: data.refresh_token || refreshToken,
      expiresIn: data.expires_in,
      user: userPayload
    });
  } catch (error) {
    console.error('Auth refresh error:', error);
    return res.status(500).json({
      error: 'Có lỗi xảy ra khi làm mới phiên đăng nhập',
      details: error.message
    });
  }
}
