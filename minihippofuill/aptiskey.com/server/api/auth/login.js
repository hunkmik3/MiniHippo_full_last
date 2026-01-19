import parseBody from '../_utils/parseBody.js';
import { selectFrom, updateTable } from '../_utils/supabase.js';
import { ensureDeviceAccess, resolveDeviceLimit } from '../_utils/device.js';

const SUPABASE_URL = process.env.SUPABASE_URL?.trim();
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY?.trim();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL?.trim();
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY?.trim();

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase vars');
    return res.status(500).json({ error: 'Supabase environment variables are missing' });
  }

  let body;
  try {
    body = await parseBody(req);
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Invalid request body' });
  }

  const { email, password, deviceId, deviceName, deviceInfo } = body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Thiếu email hoặc mật khẩu' });
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error_description || data.error || 'Đăng nhập thất bại'
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

    try {
      await updateTable(
        'users',
        [{ column: 'id', value: userId }],
        { last_login: new Date().toISOString() }
      );
    } catch (updateError) {
      console.warn('Failed to update last_login:', updateError);
    }

    const deviceIdentifier = deviceId || deviceInfo?.id;
    if (!deviceIdentifier) {
      return res.status(400).json({ error: 'Thiếu thông tin thiết bị' });
    }

    try {
      await ensureDeviceAccess({
        userId,
        deviceId: deviceIdentifier,
        deviceName: deviceName || deviceInfo?.name,
        userAgent: req.headers['user-agent'],
        deviceLimit: resolveDeviceLimit(profile)
      });
    } catch (deviceError) {
      return res.status(deviceError.status || 500).json({
        error: deviceError.message || 'Thiết bị không được phép đăng nhập'
      });
    }

    const userPayload = {
      id: profile.id || userId,
      email: profile.email || supabaseUser.email,
      username: profile.username || supabaseUser.user_metadata?.username || '',
      role: profile.role || 'user',
      status: profile.status || 'active',
      accountCode: profile.account_code || '',
      fullName: profile.full_name || '',
      deviceLimit: resolveDeviceLimit(profile),
      expiresAt: profile.expires_at || null
    };

    return res.status(200).json({
      success: true,
      token: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      user: userPayload
    });
  } catch (error) {
    console.error('Auth login error:', error);
    return res.status(500).json({
      error: 'Có lỗi xảy ra khi đăng nhập',
      details: error.message
    });
  }
}


