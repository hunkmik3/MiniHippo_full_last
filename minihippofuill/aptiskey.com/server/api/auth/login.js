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

  const { email, password, deviceId, deviceName, deviceInfo, module: requestedModule } = body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Thiếu email hoặc mật khẩu' });
  }

  // Validate module access — admin có quyền tất cả; ngược lại check theo course.
  function canAccessModule(profile, mod) {
    if (!mod) return true; // không truyền module → bỏ qua check
    const role = String(profile?.role || '').toLowerCase();
    if (role === 'admin') return true;
    const course = String(profile?.course || '').trim().toLowerCase();
    const m = String(mod || '').toLowerCase();
    if (m === 'lop_hoc') return course === 'lớp học';
    if (m === 'aptis') return course === 'aptis' || course === 'lớp ôn thi';
    if (m === 'vstep') return false; // hiện tại chỉ admin
    return false;
  }
  function moduleLabel(mod) {
    if (mod === 'lop_hoc') return 'Lớp Học';
    if (mod === 'vstep') return 'VSTEP';
    if (mod === 'aptis') return 'Aptis';
    return String(mod || '');
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

    // Check module access — chỉ chặn nếu user truyền module và không có quyền.
    if (requestedModule && !canAccessModule(profile, requestedModule)) {
      return res.status(403).json({
        error: `Tài khoản này không có quyền truy cập module ${moduleLabel(requestedModule)}.`
      });
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
      phone: profile.phone_number || null,
      deviceLimit: resolveDeviceLimit(profile),
      expiresAt: profile.expires_at || null,
      startedOn: profile.started_on || null,
      notes: profile.notes || null,
      learningProgram: profile.learning_program || null,
      course: profile.course || null,
      band: profile.band || null,
      assignedClassId: profile.assigned_class_id || null
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
