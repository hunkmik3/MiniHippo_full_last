import { parseJsonBody } from '../../_utils/parseBody.js';
import { verifyAdminRequest } from '../../_utils/auth.js';
import { callSupabaseAuth, insertInto, selectFrom, updateTable } from '../../_utils/supabase.js';
import { resolveDeviceLimit } from '../../_utils/device.js';
import { vstepSchemaErrorResponse } from '../_utils.js';

function generatePassword(seed) {
  const base = String(seed || Math.random().toString(36).slice(2, 10))
    .replace(/[^a-z0-9]/gi, '')
    .slice(-8);
  return `${base || 'VSTEP'}123`.toUpperCase();
}

function normalizeBand(value) {
  const band = String(value || '').trim().toUpperCase();
  return band === 'B1' || band === 'B2' ? band : null;
}

function clean(value) {
  return typeof value === 'string' ? value.trim() : value;
}

async function createOrUpdateStudent(row, batchId) {
  const accountCode = clean(row.accountCode || row.account_code || row.ma || row.code);
  let email = clean(row.email);
  if (!email && accountCode) email = `${String(accountCode).toLowerCase()}@vstep.minihippo.local`;
  if (!email) throw new Error('Thiếu email hoặc mã học viên');

  const fullName = clean(row.fullName || row.full_name || row.name || row.ho_ten);
  const phone = clean(row.phone || row.phone_number || row.sdt);
  const band = normalizeBand(row.band || row.level || row.lop);
  const password = clean(row.password) || generatePassword(accountCode || email);
  const expiresAt = clean(row.expiresAt || row.expires_at || row.expire_date) || null;

  // Cờ "dòng CSV CÓ cung cấp cột này hay không" — để khi RE-IMPORT thiếu cột thì
  // GIỮ giá trị cũ thay vì ghi đè/xoá (band, expires_at, device_limit, practice_access).
  const hasBand = String(row.band ?? row.level ?? row.lop ?? '').trim() !== '';
  const hasExpires = String(row.expiresAt ?? row.expires_at ?? row.expire_date ?? '').trim() !== '';
  const rawDeviceLimit = Number(row.deviceLimit ?? row.device_limit);
  const hasDeviceLimit = Number.isFinite(rawDeviceLimit) && rawDeviceLimit > 0;
  const hasPracticeAccess = row.practiceAccess !== undefined || row.practice_access !== undefined;
  const deviceLimit = hasDeviceLimit ? Math.round(rawDeviceLimit) : resolveDeviceLimit();
  const practiceAccess = hasPracticeAccess
    ? !(row.practiceAccess === false || row.practice_access === false
        || String(row.practiceAccess ?? row.practice_access).toLowerCase() === 'false')
    : true;

  const existingByEmail = await selectFrom('vstep_students', {
    filters: [{ column: 'email', value: email }],
    single: true
  });

  if (existingByEmail?.id) {
    // RE-IMPORT: chỉ ghi đè trường mà CSV thực sự cung cấp; còn lại giữ giá trị cũ.
    const resolvedBand = hasBand ? band : (existingByEmail.band ?? null);
    const resolvedExpires = hasExpires ? expiresAt : (existingByEmail.expires_at ?? null);
    const resolvedDeviceLimit = hasDeviceLimit ? deviceLimit : (existingByEmail.device_limit ?? resolveDeviceLimit());
    const resolvedPracticeAccess = hasPracticeAccess ? practiceAccess : (existingByEmail.practice_access ?? true);

    const payload = {
      account_code: accountCode || existingByEmail.account_code || null,
      full_name: fullName || existingByEmail.full_name || null,
      phone_number: phone || existingByEmail.phone_number || null,
      band: resolvedBand,
      practice_access: resolvedPracticeAccess,
      status: clean(row.status) || existingByEmail.status || 'active',
      device_limit: resolvedDeviceLimit,
      expires_at: resolvedExpires,
      notes: clean(row.notes) || existingByEmail.notes || null,
      last_import_batch: batchId,
      updated_at: new Date().toISOString()
    };
    const updated = await updateTable('vstep_students', [{ column: 'id', value: existingByEmail.id }], payload);
    if (existingByEmail.user_id) {
      await updateTable('users', [{ column: 'id', value: existingByEmail.user_id }], {
        account_code: payload.account_code,
        full_name: payload.full_name,
        phone_number: payload.phone_number,
        band: resolvedBand,
        status: payload.status,
        device_limit: resolvedDeviceLimit,
        expires_at: resolvedExpires,
        notes: payload.notes
      });
    }
    return { action: 'updated', student: Array.isArray(updated) ? updated[0] : updated, temporaryPassword: null };
  }

  // TẠO MỚI: auth user -> users -> vstep_students. Nếu lỗi giữa chừng thì XOÁ auth user
  // vừa tạo (cascade dọn users) để không để lại tài khoản mồ côi gây kẹt lần import sau.
  const username = clean(row.username || accountCode || email.split('@')[0]);
  let authUser = null;
  try {
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
      role: 'user',
      status: clean(row.status) || 'active',
      account_code: accountCode || null,
      full_name: fullName || null,
      phone_number: phone || null,
      device_limit: deviceLimit,
      expires_at: expiresAt,
      notes: clean(row.notes) || null,
      learning_program: 'vstep',
      course: 'VSTEP',
      band
    };

    await insertInto('users', [publicUserPayload]);

    const [student] = await insertInto('vstep_students', [{
      user_id: authUser.id,
      email,
      username,
      account_code: accountCode || null,
      full_name: fullName || null,
      phone_number: phone || null,
      band,
      practice_access: practiceAccess,
      status: publicUserPayload.status,
      device_limit: deviceLimit,
      expires_at: expiresAt,
      notes: publicUserPayload.notes,
      last_import_batch: batchId
    }]);

    return { action: 'created', student, temporaryPassword: password };
  } catch (error) {
    if (authUser?.id) {
      try {
        await callSupabaseAuth(`admin/users/${authUser.id}`, { method: 'DELETE' }, { useAnonKey: false });
      } catch (cleanupError) {
        console.warn('Failed to rollback VSTEP auth user (bulk import):', cleanupError.message);
      }
    }
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res.status(adminCheck.status || 401).json({ error: adminCheck.error || 'Unauthorized' });
  }

  try {
    const body = await parseJsonBody(req);
    const rows = Array.isArray(body?.students) ? body.students : [];
    if (!rows.length) return res.status(400).json({ error: 'Danh sách import đang trống' });
    if (rows.length > 500) return res.status(400).json({ error: 'Mỗi lần chỉ import tối đa 500 học viên' });

    const batchId = `vstep-import-${Date.now()}`;
    const results = [];
    for (let index = 0; index < rows.length; index += 1) {
      try {
        const result = await createOrUpdateStudent(rows[index], batchId);
        results.push({ row: index + 1, ok: true, ...result });
      } catch (error) {
        results.push({ row: index + 1, ok: false, error: error?.details?.message || error.message });
      }
    }

    return res.status(200).json({
      success: true,
      batchId,
      created: results.filter(item => item.ok && item.action === 'created').length,
      updated: results.filter(item => item.ok && item.action === 'updated').length,
      failed: results.filter(item => !item.ok).length,
      results
    });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep students bulk import error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể import học viên VSTEP',
      details: error?.details || null
    });
  }
}
