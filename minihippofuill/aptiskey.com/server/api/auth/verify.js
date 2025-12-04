import { selectFrom } from '../_utils/supabase.js';
import { ensureDeviceAccess, resolveDeviceLimit } from '../_utils/device.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: 'Supabase environment variables are missing' });
  }

  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const token = authHeader.replace('Bearer ', '').trim();

  if (!token) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error_description || data.error || 'Token không hợp lệ'
      });
    }

    const profile = await selectFrom('users', {
      filters: [{ column: 'id', value: data.id }],
      single: true
    });

    if (!profile) {
      return res.status(403).json({ error: 'Tài khoản chưa được cấp quyền' });
    }

    if (profile.status && profile.status !== 'active') {
      return res.status(403).json({ error: 'Tài khoản đang bị khóa' });
    }

    const userPayload = {
      id: profile.id,
      email: profile.email || data.email,
      username: profile.username || data.user_metadata?.username || '',
      role: profile.role || 'user',
      status: profile.status || 'active',
      accountCode: profile.account_code || '',
      fullName: profile.full_name || '',
      deviceLimit: resolveDeviceLimit(profile),
      expiresAt: profile.expires_at || null
    };

    const deviceId = req.headers['x-device-id'] || req.headers['X-Device-Id'];
    if (deviceId) {
      try {
        await ensureDeviceAccess({
          userId: userPayload.id,
          deviceId,
          deviceName: req.headers['x-device-name'] || req.headers['X-Device-Name'],
          userAgent: req.headers['user-agent'],
          deviceLimit: userPayload.deviceLimit
        });
      } catch (deviceError) {
        return res.status(deviceError.status || 500).json({
          error: deviceError.message || 'Thiết bị không được phép sử dụng tài khoản này'
        });
      }
    }

    return res.status(200).json({
      success: true,
      user: userPayload
    });
  } catch (error) {
    console.error('Auth verify error:', error);
    return res.status(500).json({
      error: 'Không thể xác thực người dùng',
      details: error.message
    });
  }
}


