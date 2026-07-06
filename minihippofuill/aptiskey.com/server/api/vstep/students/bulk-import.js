import { parseJsonBody } from '../../_utils/parseBody.js';
import { verifyAdminRequest } from '../../_utils/auth.js';
import { callSupabaseAuth, deleteFrom, insertInto, selectFrom, updateTable, upsertInto } from '../../_utils/supabase.js';
import { resolveDeviceLimit } from '../../_utils/device.js';
import {
  computeVstepExpiresAtDate,
  vstepSchemaErrorResponse,
  normalizeScheduleType,
  defaultNumSessionsForBand
} from '../_utils.js';

function todayLocalYmd() {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0')
  ].join('-');
}

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

// Trả về username chưa tồn tại trong public.users. Nếu base bị chiếm (orphan
// từ test cũ hoặc module khác đã dùng) → thêm suffix tăng dần để insert không
// đụng constraint UNIQUE. Account_code (mã hiển thị) vẫn giữ nguyên giá trị admin
// nhập — chỉ username (chìa khoá nội bộ) bị suffix.
async function resolveUniqueUsername(baseUsername) {
  if (!baseUsername) return baseUsername;
  const tryNames = [
    baseUsername,
    `${baseUsername}_vstep`,
    `${baseUsername}_${Date.now().toString(36)}`,
    `${baseUsername}_${Math.random().toString(36).slice(2, 8)}`
  ];
  for (const candidate of tryNames) {
    try {
      const exists = await selectFrom('users', {
        filters: [{ column: 'username', value: candidate }],
        single: true
      });
      if (!exists) return candidate;
    } catch (_) {
      // Nếu query lỗi (vd RLS) → cứ thử candidate này; nếu trùng thì sẽ catch ở
      // upsert sau, không phải killer ở đây.
      return candidate;
    }
  }
  // Fallback siêu hiếm: random hex dài.
  return `${baseUsername}_${Math.random().toString(36).slice(2)}`;
}

async function createOrUpdateStudent(row, batchId, defaultLearningProgram = 'vstep_lophoc') {
  const accountCode = clean(row.accountCode || row.account_code || row.ma || row.code);
  let email = clean(row.email);
  if (!email && accountCode) email = `${String(accountCode).toLowerCase()}@vstep.minihippo.local`;
  if (!email) throw new Error('Thiếu email hoặc mã học viên');

  const fullName = clean(row.fullName || row.full_name || row.name || row.ho_ten);
  const phone = clean(row.phone || row.phone_number || row.sdt);
  const band = normalizeBand(row.band || row.level || row.lop);
  const password = clean(row.password) || generatePassword(accountCode || email);

  // Auto-compute expires_at = started_on + 6 tháng. Nếu CSV cung cấp started_on
  // thì dùng, không thì lấy hôm nay (ngày import) làm started_on mặc định.
  const startedOnRaw = clean(row.startedOn || row.started_on || row.start_date || row.ngay_khai_giang) || '';
  const hasStartedOn = String(startedOnRaw || '').trim() !== '';
  const startedOn = hasStartedOn ? String(startedOnRaw).slice(0, 10) : todayLocalYmd();

  const explicitExpiresRaw = clean(row.expiresAt || row.expires_at || row.expire_date) || '';
  const expiresAt = explicitExpiresRaw || computeVstepExpiresAtDate(startedOn);

  // Cờ "dòng CSV CÓ cung cấp cột này hay không" — để khi RE-IMPORT thiếu cột thì
  // GIỮ giá trị cũ thay vì ghi đè/xoá (band, expires_at, device_limit, practice_access).
  const hasBand = String(row.band ?? row.level ?? row.lop ?? '').trim() !== '';
  const hasExpires = String(row.expiresAt ?? row.expires_at ?? row.expire_date ?? '').trim() !== '';
  const rawDeviceLimit = Number(row.deviceLimit ?? row.device_limit ?? row.devicelimit);
  const hasDeviceLimit = Number.isFinite(rawDeviceLimit) && rawDeviceLimit > 0;
  const hasPracticeAccess = row.practiceAccess !== undefined || row.practice_access !== undefined || row.practiceaccess !== undefined;
  const deviceLimit = hasDeviceLimit ? Math.round(rawDeviceLimit) : resolveDeviceLimit();
  const practiceAccess = hasPracticeAccess
    ? !(row.practiceAccess === false || row.practice_access === false
        || String(row.practiceAccess ?? row.practice_access).toLowerCase() === 'false')
    : true;

  // learning_program ưu tiên: row.learningProgram > defaultLearningProgram.
  // Chấp nhận giá trị 'vstep_onthi' hoặc fallback 'vstep_lophoc'.
  // Accept cả lowercase variants (parser CSV có thể strip camelCase).
  const rowProgramRaw = String(
    row.learningProgram || row.learning_program || row.learningprogram || row.module || ''
  ).trim().toLowerCase();
  const learningProgram = (rowProgramRaw === 'vstep_onthi' || rowProgramRaw === 'vstep_lophoc')
    ? rowProgramRaw
    : (defaultLearningProgram === 'vstep_onthi' ? 'vstep_onthi' : 'vstep_lophoc');

  // Match theo email TRƯỚC, fallback sang account_code (do account_code cũng có
  // UNIQUE constraint — nếu admin đổi email nhưng giữ mã thì coi như cùng HV).
  const existingByEmail = await selectFrom('vstep_students', {
    filters: [{ column: 'email', value: email }],
    single: true
  });
  let existingByAccountCode = null;
  if (accountCode && !existingByEmail) {
    existingByAccountCode = await selectFrom('vstep_students', {
      filters: [{ column: 'account_code', value: accountCode }],
      single: true
    });
  }
  // Nếu cả email và account_code đều khớp nhưng trỏ về 2 row khác nhau → conflict thật.
  if (existingByEmail && accountCode) {
    const byCode = await selectFrom('vstep_students', {
      filters: [{ column: 'account_code', value: accountCode }],
      single: true
    });
    if (byCode && byCode.id !== existingByEmail.id) {
      throw new Error(`Mã ${accountCode} đã dùng cho HV khác (${byCode.email}). Đổi mã hoặc xoá HV cũ.`);
    }
  }
  const existingMatch = existingByEmail || existingByAccountCode;

  if (existingMatch?.id) {
    // ===== UPDATE branch (re-import: match by email hoặc by account_code) =====
    // Khi match qua account_code mà email khác → đồng bộ email payload sang HV cũ
    // (admin có thể đang đổi email cho HV đã tồn tại).
    const resolvedBand = hasBand ? band : (existingMatch.band ?? null);
    const resolvedExpires = hasExpires ? expiresAt : (existingMatch.expires_at ?? null);
    const resolvedDeviceLimit = hasDeviceLimit ? deviceLimit : (existingMatch.device_limit ?? resolveDeviceLimit());
    const resolvedPracticeAccess = hasPracticeAccess ? practiceAccess : (existingMatch.practice_access ?? true);

    // Khi RE-IMPORT: nếu admin chỉ định learning_program khác → MOVE HV sang
    // module mới. Nếu không chỉ định (default) → GIỮ NGUYÊN module cũ.
    const resolvedProgram = rowProgramRaw
      ? learningProgram
      : (existingMatch.learning_program || learningProgram);

    const payload = {
      account_code: accountCode || existingMatch.account_code || null,
      full_name: fullName || existingMatch.full_name || null,
      phone_number: phone || existingMatch.phone_number || null,
      band: resolvedBand,
      learning_program: resolvedProgram,
      practice_access: resolvedPracticeAccess,
      status: clean(row.status) || existingMatch.status || 'active',
      device_limit: resolvedDeviceLimit,
      expires_at: resolvedExpires,
      notes: clean(row.notes) || existingMatch.notes || null,
      last_import_batch: batchId,
      updated_at: new Date().toISOString()
    };
    const updated = await updateTable('vstep_students', [{ column: 'id', value: existingMatch.id }], payload);
    if (existingMatch.user_id) {
      await updateTable('users', [{ column: 'id', value: existingMatch.user_id }], {
        account_code: payload.account_code,
        full_name: payload.full_name,
        phone_number: payload.phone_number,
        learning_program: resolvedProgram,
        course: 'VSTEP',
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
  // Username PHẢI UNIQUE trên public.users — nếu trùng (do orphan cũ, module khác đã chiếm,
  // hay case mismatch khiến diagnostic SQL không tìm thấy) → tự suffix để insert không kẹt.
  const baseUsername = clean(row.username || accountCode || email.split('@')[0]);
  const username = await resolveUniqueUsername(baseUsername);
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
      started_on: startedOn,
      expires_at: expiresAt,
      notes: clean(row.notes) || null,
      learning_program: learningProgram,
      course: 'VSTEP',
      band
    };

    // Upsert vì Supabase Auth trigger handle_new_user đã tạo public.users
    // ngay khi auth user insert — xem comment ở students/create.js.
    await upsertInto('users', [publicUserPayload]);

    const [student] = await insertInto('vstep_students', [{
      user_id: authUser.id,
      email,
      username,
      account_code: accountCode || null,
      full_name: fullName || null,
      phone_number: phone || null,
      band,
      learning_program: learningProgram,
      practice_access: practiceAccess,
      status: publicUserPayload.status,
      device_limit: deviceLimit,
      started_on: startedOn,
      expires_at: expiresAt,
      notes: publicUserPayload.notes,
      last_import_batch: batchId
    }]);

    return { action: 'created', student, temporaryPassword: password };
  } catch (error) {
    // Dọn cả public.users + auth.users để tránh orphan gây 409 ở lần
    // import sau (xem comment ở students/create.js).
    if (authUser?.id) {
      try {
        await deleteFrom('users', [{ column: 'id', value: authUser.id }]);
      } catch (publicCleanupError) {
        console.warn('Failed to rollback public.users row (bulk import):', publicCleanupError.message);
      }
      try {
        await callSupabaseAuth(`admin/users/${authUser.id}`, { method: 'DELETE' }, { useAnonKey: false });
      } catch (cleanupError) {
        console.warn('Failed to rollback VSTEP auth user (bulk import):', cleanupError.message);
      }
    }
    throw error;
  }
}

// ===== Auto gom HV vào lớp theo cột "tên lớp" + "ca học" trong file import =====
// Feedback KH: import đông HV rồi phải tích tay từng em vào lớp rất khó kiểm soát.
// File import thêm cột className (tên lớp) + scheduleType (246/357) → tự tìm lớp
// theo tên (tạo mới nếu chưa có) rồi add HV vào. classCache dùng chung 1 batch
// để 500 row cùng lớp không tạo trùng.
async function attachToClassByName(student, className, scheduleType, band, adminId, classCache) {
  if (!student?.id || !className) return null;
  const cacheKey = className.toLowerCase();
  let klass = classCache.get(cacheKey);

  if (!klass) {
    klass = await selectFrom('vstep_classes', {
      filters: [
        { column: 'title', value: className, operator: 'ilike' },
        { column: 'status', value: 'active' }
      ],
      single: true
    }).catch(() => null);

    if (!klass) {
      const resolvedBand = normalizeBand(band) || 'B1';
      const [created] = await insertInto('vstep_classes', [{
        title: className,
        band: resolvedBand,
        schedule_type: normalizeScheduleType(scheduleType) || null,
        num_sessions: defaultNumSessionsForBand(resolvedBand),
        sessions: [],
        status: 'active',
        created_by: adminId || null
      }]);
      klass = created;
    }
    if (klass) classCache.set(cacheKey, klass);
  }
  if (!klass?.id) return null;

  // Membership idempotent: UNIQUE (class_id, student_id) — check trước, catch duplicate sau.
  const existing = await selectFrom('vstep_class_students', {
    filters: [
      { column: 'class_id', value: klass.id },
      { column: 'student_id', value: student.id }
    ],
    single: true
  }).catch(() => null);
  if (!existing) {
    try {
      await insertInto('vstep_class_students', [{
        class_id: klass.id,
        student_id: student.id,
        status: 'active'
      }]);
    } catch (err) {
      const msg = String(err?.message || '');
      if (!/duplicate|unique/i.test(msg)) throw err;
    }
  }
  await updateTable('vstep_students', [{ column: 'id', value: student.id }], { class_id: klass.id });
  return { classId: klass.id, classTitle: klass.title };
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

    // Admin chỉ định module mặc định (vstep_lophoc / vstep_onthi) qua body.
    // Mỗi row CSV vẫn override được bằng cột learningProgram nếu cần.
    const bodyProgram = String(body?.learningProgram || body?.learning_program || '').trim().toLowerCase();
    const defaultProgram = bodyProgram === 'vstep_onthi' ? 'vstep_onthi' : 'vstep_lophoc';

    const batchId = `vstep-import-${Date.now()}`;
    const classCache = new Map();
    const results = [];
    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      try {
        const result = await createOrUpdateStudent(row, batchId, defaultProgram);
        // Gán lớp nếu row có cột tên lớp — lỗi gán lớp KHÔNG fail cả row
        // (HV đã tạo xong), chỉ ghi chú lại để admin biết.
        const className = clean(row.className || row.class_name || row.ten_lop || row.tenlop || row.classname || '');
        const scheduleType = row.scheduleType || row.schedule_type || row.ca_hoc || row.cahoc || row.scheduletype || '';
        let classAssigned = null;
        let classError = null;
        if (className && result?.student?.id) {
          try {
            classAssigned = await attachToClassByName(
              result.student, String(className), scheduleType,
              row.band || row.level, adminCheck.user.id, classCache
            );
          } catch (err) {
            classError = err?.message || 'Không thể gán lớp';
            console.warn(`bulk-import: gán lớp fail cho row ${index + 1}:`, classError);
          }
        }
        results.push({ row: index + 1, ok: true, ...result, classAssigned, classError });
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
      classAssignedCount: results.filter(item => item.classAssigned).length,
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
