import { selectFrom } from './supabase.js';
import { ensureDeviceAccess, resolveDeviceLimit } from './device.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

function buildUserPayload(profile, supabaseUser) {
  return {
    id: profile.id,
    email: profile.email || supabaseUser?.email || '',
    username: profile.username || supabaseUser?.user_metadata?.username || '',
    role: profile.role || 'user',
    status: profile.status || 'active',
    accountCode: profile.account_code || '',
    fullName: profile.full_name || '',
    deviceLimit: resolveDeviceLimit(profile),
    expiresAt: profile.expires_at || null
  };
}

export async function verifyAdminRequest(req) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return {
      success: false,
      status: 500,
      error: 'Supabase environment variables are missing'
    };
  }

  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      success: false,
      status: 401,
      error: 'Missing Authorization header'
    };
  }

  const token = authHeader.replace('Bearer ', '').trim();

  if (!token) {
    return {
      success: false,
      status: 401,
      error: 'Invalid token'
    };
  }

  try {
    // Verify token with Supabase
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error: data.error_description || data.error || 'Token không hợp lệ'
      };
    }

    // Get user profile from database
    const profile = await selectFrom('users', {
      filters: [{ column: 'id', value: data.id }],
      single: true
    });

    if (!profile) {
      return {
        success: false,
        status: 403,
        error: 'Tài khoản chưa được cấp quyền'
      };
    }

    if (profile.status && profile.status !== 'active') {
      return {
        success: false,
        status: 403,
        error: 'Tài khoản đang bị khóa'
      };
    }

    // Check if user is admin
    if (profile.role !== 'admin') {
      return {
        success: false,
        status: 403,
        error: 'Chỉ admin mới có quyền thực hiện thao tác này'
      };
    }

    const user = buildUserPayload(profile, data);

    const deviceId = req.headers['x-device-id'] || req.headers['X-Device-Id'];
    if (deviceId) {
      await ensureDeviceAccess({
        userId: user.id,
        deviceId,
        deviceName: req.headers['x-device-name'] || req.headers['X-Device-Name'],
        userAgent: req.headers['user-agent'],
        deviceLimit: user.deviceLimit
      });
    }

    return {
      success: true,
      user
    };
  } catch (error) {
    console.error('Auth verify error:', error);
    return {
      success: false,
      status: 500,
      error: 'Không thể xác thực người dùng',
      details: error.message
    };
  }
}

export async function verifyUserRequest(req, { requireDevice = false } = {}) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return {
      success: false,
      status: 500,
      error: 'Supabase environment variables are missing'
    };
  }

  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      success: false,
      status: 401,
      error: 'Missing Authorization header'
    };
  }

  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) {
    return {
      success: false,
      status: 401,
      error: 'Invalid token'
    };
  }

  const deviceId = req.headers['x-device-id'] || req.headers['X-Device-Id'];
  if (requireDevice && !deviceId) {
    return {
      success: false,
      status: 400,
      error: 'Thiếu thông tin thiết bị'
    };
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
      return {
        success: false,
        status: response.status,
        error: data.error_description || data.error || 'Token không hợp lệ'
      };
    }

    const profile = await selectFrom('users', {
      filters: [{ column: 'id', value: data.id }],
      single: true
    });

    if (!profile) {
      return {
        success: false,
        status: 403,
        error: 'Tài khoản chưa được cấp quyền'
      };
    }

    if (profile.status && profile.status !== 'active') {
      return {
        success: false,
        status: 403,
        error: 'Tài khoản đang bị khóa'
      };
    }

    const user = buildUserPayload(profile, data);

    if (deviceId) {
      await ensureDeviceAccess({
        userId: user.id,
        deviceId,
        deviceName: req.headers['x-device-name'] || req.headers['X-Device-Name'],
        userAgent: req.headers['user-agent'],
        deviceLimit: user.deviceLimit
      });
    }

    return {
      success: true,
      user
    };
  } catch (error) {
    console.error('verifyUserRequest error:', error);
    return {
      success: false,
      status: 500,
      error: 'Không thể xác thực người dùng',
      details: error.message
    };
  }
}
