import { parseJsonBody } from '../../_utils/parseBody.js';
import { verifyAdminRequest } from '../../_utils/auth.js';
import { callSupabaseAuth, insertInto, selectFrom } from '../../_utils/supabase.js';
import { resolveDeviceLimit } from '../../_utils/device.js';
import { vstepSchemaErrorResponse } from '../_utils.js';

function generatePassword() {
  const random = Math.random().toString(36).slice(-8);
  const fallback = Math.random().toString(36).slice(-10);
  return (random || fallback || 'MiniHippo123!').toUpperCase();
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
      expires_at: body?.expiresAt || body?.expires_at || null,
      notes: body?.notes || null,
      learning_program: 'vstep',
      course: 'VSTEP',
      band: body?.band || null
    };

    await insertInto('users', [publicUserPayload]);

    const [student] = await insertInto('vstep_students', [{
      user_id: authUser.id,
      email,
      username,
      account_code: accountCode || null,
      full_name: body?.fullName || body?.full_name || null,
      phone_number: body?.phone || body?.phone_number || null,
      band: body?.band || null,
      practice_access: body?.practiceAccess === false || body?.practice_access === false ? false : true,
      status: body?.status || 'active',
      device_limit: publicUserPayload.device_limit,
      expires_at: publicUserPayload.expires_at,
      notes: body?.notes || null
    }]);

    return res.status(200).json({
      success: true,
      student,
      user: publicUserPayload,
      temporaryPassword: generated ? password : null
    });
  } catch (error) {
    if (authUser?.id) {
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
