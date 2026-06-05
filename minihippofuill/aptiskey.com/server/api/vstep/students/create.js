import { parseJsonBody } from '../../_utils/parseBody.js';
import { verifyAdminRequest } from '../../_utils/auth.js';
import { callSupabaseAuth, deleteFrom, insertInto, selectFrom, upsertInto } from '../../_utils/supabase.js';
import { resolveDeviceLimit } from '../../_utils/device.js';
import { computeVstepExpiresAtDate, vstepSchemaErrorResponse } from '../_utils.js';

function todayLocalYmd() {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0')
  ].join('-');
}

function generatePassword() {
  const random = Math.random().toString(36).slice(-8);
  const fallback = Math.random().toString(36).slice(-10);
  return (random || fallback || 'MiniHippo123!').toUpperCase();
}

// Band tùy chọn: rỗng -> null (cho phép), B1/B2 hợp lệ, còn lại -> báo lỗi rõ ràng.
function resolveBand(value) {
  const raw = value === undefined || value === null ? '' : String(value).trim();
  if (!raw) return { ok: true, band: null };
  const upper = raw.toUpperCase();
  if (upper === 'B1' || upper === 'B2') return { ok: true, band: upper };
  return { ok: false };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res.status(adminCheck.status || 401).json({ error: adminCheck.error || 'Unauthorized' });
  }

  let authUser = null;
  try {
    const body = await parseJsonBody(req);
    const accountCode = String(body?.accountCode || body?.account_code || '').trim();
    let email = String(body?.email || '').trim();
    if (!email && accountCode) {
      email = `${accountCode.toLowerCase()}@vstep.minihippo.local`;
    }
    if (!email) {
      return res.status(400).json({ error: 'Email hoặc mã học viên là bắt buộc' });
    }

    const password = String(body?.password || '').trim() || generatePassword();
    const generated = !String(body?.password || '').trim();
    const username = String(body?.username || accountCode || email.split('@')[0]).trim();

    const bandResult = resolveBand(body?.band);
    if (!bandResult.ok) {
      return res.status(400).json({ error: 'Band không hợp lệ. Chỉ chấp nhận B1 hoặc B2.' });
    }
    const band = bandResult.band;

    const existingStudent = await selectFrom('vstep_students', {
      filters: [{ column: 'email', value: email }],
      single: true
    });
    if (existingStudent) {
      return res.status(409).json({ error: 'Email học viên VSTEP đã tồn tại' });
    }
    if (accountCode) {
      const existingCode = await selectFrom('vstep_students', {
        filters: [{ column: 'account_code', value: accountCode }],
        single: true
      });
      if (existingCode) {
        return res.status(409).json({ error: 'Mã học viên VSTEP đã tồn tại' });
      }
    }

    authUser = await callSupabaseAuth(
      'admin/users',
      {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          email_confirm: true,
          user_metadata: { username }
        })
      },
      { useAnonKey: false }
    );

    // Auto-compute expires_at = started_on + 6 tháng. Admin có thể override
    // bằng body.expiresAt; nếu admin không truyền started_on thì dùng hôm nay.
    const startedOn = String(
      body?.startedOn || body?.started_on || todayLocalYmd()
    ).slice(0, 10);
    const autoExpiresAt = computeVstepExpiresAtDate(startedOn);
    const explicitExpiresAt = body?.expiresAt || body?.expires_at;
    const expiresAt = explicitExpiresAt || autoExpiresAt;

    const publicUserPayload = {
      id: authUser.id,
      email,
      username,
      role: body?.role || 'user',
      status: body?.status || 'active',
      account_code: accountCode || null,
      full_name: body?.fullName || body?.full_name || null,
      phone_number: body?.phone || body?.phone_number || null,
      device_limit: Number(body?.deviceLimit || body?.device_limit) || resolveDeviceLimit(),
      started_on: startedOn,
      expires_at: expiresAt,
      notes: body?.notes || null,
      learning_program: 'vstep',
      course: 'VSTEP',
      band
    };

    // Supabase Auth có trigger handle_new_user tự tạo row public.users khi
    // auth.users insert. Dùng upsert để merge thêm cột nghiệp vụ
    // (account_code, course, band, started_on, expires_at...) thay vì INSERT
    // (sẽ 409 vì id đã tồn tại).
    await upsertInto('users', [publicUserPayload]);

    const [student] = await insertInto('vstep_students', [{
      user_id: authUser.id,
      email,
      username,
      account_code: accountCode || null,
      full_name: body?.fullName || body?.full_name || null,
      phone_number: body?.phone || body?.phone_number || null,
      band,
      practice_access: body?.practiceAccess === false || body?.practice_access === false ? false : true,
      status: body?.status || 'active',
      device_limit: publicUserPayload.device_limit,
      started_on: startedOn,
      expires_at: expiresAt,
      notes: body?.notes || null
    }]);

    return res.status(200).json({
      success: true,
      student,
      user: publicUserPayload,
      temporaryPassword: generated ? password : null
    });
  } catch (error) {
    // Rollback DUAL: phải dọn cả public.users (nếu chèn được rồi mới fail
    // ở bước vstep_students) lẫn auth.users. Không có FK cascade giữa
    // public.users và auth.users nên rollback một bên sẽ để lại orphan
    // — lần tạo sau cùng email/id sẽ kẹt 409 duplicate key.
    if (authUser?.id) {
      try {
        await deleteFrom('users', [{ column: 'id', value: authUser.id }]);
      } catch (publicCleanupError) {
        console.warn('Failed to rollback public.users row:', publicCleanupError.message);
      }
      try {
        await callSupabaseAuth(`admin/users/${authUser.id}`, { method: 'DELETE' }, { useAnonKey: false });
      } catch (cleanupError) {
        console.warn('Failed to rollback VSTEP auth user:', cleanupError.message);
      }
    }
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep students create error:', error);
    return res.status(error.status || 500).json({
      error: error?.details?.message || error.message || 'Không thể tạo học viên VSTEP',
      details: error?.details || null
    });
  }
}
