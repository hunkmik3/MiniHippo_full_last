import { parseJsonBody } from '../_utils/parseBody.js';
import { verifyAdminRequest } from '../_utils/auth.js';
import { callSupabaseAuth, insertInto, selectFrom, updateTable } from '../_utils/supabase.js';
import { resolveDeviceLimit } from '../_utils/device.js';

const OPTIONAL_USER_COLUMNS = ['learning_program', 'started_on'];

function generatePassword() {
  const random = Math.random().toString(36).slice(-8);
  const fallback = Math.random().toString(36).slice(-10);
  return (random || fallback || 'MiniHippo123!').toUpperCase();
}

function normalizeLearningProgram(value) {
  if (typeof value !== 'string') return '';
  const normalized = value.trim().toLowerCase();
  if (normalized === 'class' || normalized === 'classroom') return 'classroom';
  if (normalized === 'aptis') return 'aptis';
  return '';
}

function normalizeCourse(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  const normalized = trimmed.toLowerCase();
  if (normalized === 'lớp học' || normalized === 'lop hoc') return 'Lớp học';
  if (normalized === 'lớp ôn thi' || normalized === 'lop on thi') return 'Lớp ôn thi';
  if (normalized === 'aptis') return 'Aptis';
  return trimmed;
}

function normalizeBand(value) {
  if (typeof value !== 'string') return '';
  const normalized = value.trim().toUpperCase();
  if (!normalized) return '';
  if (normalized === 'B1' || normalized === 'B2') return normalized;
  return null;
}

function getErrorText(error) {
  return [
    error?.message,
    error?.details?.message,
    error?.details?.detail,
    error?.details?.hint,
    error?.details?.error
  ]
    .filter(Boolean)
    .join(' ');
}

function escapeRegex(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isMissingColumnError(message) {
  const normalized = String(message || '').toLowerCase();
  return (
    normalized.includes('does not exist') ||
    normalized.includes('schema cache') ||
    normalized.includes('could not find') ||
    normalized.includes('unknown column')
  );
}

function errorMentionsColumn(message, column) {
  const escaped = escapeRegex(column);
  const pattern = new RegExp(`(?:column\\s+["']${escaped}["']|["']${escaped}["']\\s+column)`, 'i');
  return pattern.test(String(message || ''));
}

function buildMissingSchemaMessage(error) {
  const message = getErrorText(error);
  if (!isMissingColumnError(message)) return '';

  if (errorMentionsColumn(message, 'band')) {
    return 'Database chưa có cột "band" trong bảng users. Hãy chạy SQL: alter table public.users add column if not exists band text;';
  }
  if (errorMentionsColumn(message, 'course')) {
    return 'Database chưa có cột "course" trong bảng users. Hãy chạy SQL: alter table public.users add column if not exists course text;';
  }
  return '';
}

function stripUnsupportedColumns(payload, error) {
  const message = getErrorText(error);
  if (!isMissingColumnError(message)) {
    return null;
  }

  const nextPayload = { ...payload };
  const removed = [];

  OPTIONAL_USER_COLUMNS.forEach(column => {
    if (!Object.prototype.hasOwnProperty.call(nextPayload, column)) {
      return;
    }
    if (errorMentionsColumn(message, column)) {
      delete nextPayload[column];
      removed.push(column);
    }
  });

  if (!removed.length) {
    return null;
  }

  return { payload: nextPayload, removed };
}

async function insertUserRecord(payload) {
  let nextPayload = { ...payload };
  const removedColumns = new Set();

  while (true) {
    try {
      if (removedColumns.size) {
        console.warn(
          `users.create: retry insert without unsupported columns: ${Array.from(removedColumns).join(', ')}`
        );
      }
      return await insertInto('users', [nextPayload]);
    } catch (error) {
      const fallback = stripUnsupportedColumns(nextPayload, error);
      if (!fallback) {
        throw error;
      }
      fallback.removed.forEach(column => removedColumns.add(column));
      nextPayload = fallback.payload;
    }
  }
}

async function updateUserRecord(userId, payload) {
  let nextPayload = { ...payload };
  const removedColumns = new Set();

  while (true) {
    try {
      if (removedColumns.size) {
        console.warn(
          `users.create: retry update without unsupported columns: ${Array.from(removedColumns).join(', ')}`
        );
      }
      return await updateTable('users', [{ column: 'id', value: userId }], nextPayload);
    } catch (error) {
      const fallback = stripUnsupportedColumns(nextPayload, error);
      if (!fallback) {
        throw error;
      }
      fallback.removed.forEach(column => removedColumns.add(column));
      nextPayload = fallback.payload;
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res
      .status(adminCheck.status)
      .json({ error: adminCheck.error || 'Unauthorized' });
  }

  try {
    const body = await parseJsonBody(req);
    const {
      email,
      password,
      username,
      role = 'user',
      status = 'active',
      accountCode,
      fullName,
      phone,
      deviceLimit,
      expiresAt,
      notes,
      course,
      band,
      startedOn,
      learningProgram
    } = body || {};

    const trimmedAccountCode = accountCode?.trim();
    let resolvedEmail = email?.trim();
    if (!resolvedEmail && trimmedAccountCode) {
      resolvedEmail = `${trimmedAccountCode.toLowerCase()}@students.minihippo.local`;
    }

    if (!resolvedEmail) {
      return res.status(400).json({ error: 'Email hoặc mã tài khoản là bắt buộc' });
    }

    let resolvedPassword = password?.trim();
    let isGeneratedPassword = false;
    if (!resolvedPassword) {
      resolvedPassword = generatePassword();
      isGeneratedPassword = true;
    }

    const usernameFallback =
      username ||
      trimmedAccountCode ||
      resolvedEmail.split('@')[0] ||
      `user_${Date.now()}`;

    const resolvedLearningProgram = normalizeLearningProgram(learningProgram);
    const resolvedCourse = normalizeCourse(typeof course === 'string' ? course : '');
    const resolvedBand = normalizeBand(typeof band === 'string' ? band : '');
    const resolvedStartedOn = typeof startedOn === 'string' ? startedOn.trim() : startedOn;

    if (resolvedBand === null) {
      return res.status(400).json({ error: 'Band không hợp lệ. Chỉ chấp nhận B1 hoặc B2.' });
    }

    const effectiveCourse =
      resolvedCourse ||
      (resolvedLearningProgram === 'classroom' ? 'Lớp học' : '');

    if (effectiveCourse === 'Lớp học' && !resolvedBand) {
      return res.status(400).json({ error: 'Học viên lớp học bắt buộc phải có band (B1 hoặc B2).' });
    }

    const userPayload = {
      email: resolvedEmail,
      username: usernameFallback,
      role,
      status,
      account_code: trimmedAccountCode || null,
      full_name: fullName || null,
      phone_number: phone || null,
      device_limit: Number(deviceLimit) || resolveDeviceLimit(),
      expires_at: expiresAt || null,
      notes: notes || null
    };

    if (resolvedLearningProgram) {
      userPayload.learning_program = resolvedLearningProgram;
    }
    if (typeof course !== 'undefined') {
      userPayload.course = resolvedCourse || null;
    } else if (resolvedLearningProgram === 'aptis') {
      userPayload.course = 'Aptis';
    } else if (resolvedLearningProgram === 'classroom') {
      userPayload.course = effectiveCourse || 'Lớp học';
    }
    if (typeof band !== 'undefined' || userPayload.course === 'Lớp học') {
      userPayload.band = userPayload.course === 'Lớp ôn thi' ? null : (resolvedBand || null);
    }
    if (typeof startedOn !== 'undefined') {
      userPayload.started_on = resolvedStartedOn || null;
    }

    const existingUser = await selectFrom('users', {
      filters: [{ column: 'email', value: resolvedEmail }],
      single: true
    });
    if (existingUser) {
      return res.status(409).json({ error: 'Email đã tồn tại trong hệ thống' });
    }

    if (trimmedAccountCode) {
      const existingAccount = await selectFrom('users', {
        filters: [{ column: 'account_code', value: trimmedAccountCode }],
        single: true
      });
      if (existingAccount) {
        return res.status(409).json({ error: 'Mã tài khoản đã tồn tại' });
      }
    }

    const authUser = await callSupabaseAuth(
      'admin/users',
      {
        method: 'POST',
        body: JSON.stringify({
          email: resolvedEmail,
          password: resolvedPassword,
          email_confirm: true,
          user_metadata: { username: usernameFallback }
        })
      },
      { useAnonKey: false }
    );
    console.log('Supabase admin/users response:', authUser);
    userPayload.id = authUser.id;

    let record;
    try {
      const [inserted] = await insertUserRecord(userPayload);
      record = inserted;
    } catch (dbError) {
      const isDuplicateKey =
        dbError?.details?.code === '23505' ||
        dbError?.details?.message?.includes('duplicate key value') ||
        dbError?.message?.includes('duplicate key value');

      if (isDuplicateKey) {
        const detailMessage =
          dbError?.details?.detail ||
          dbError?.details?.message ||
          dbError?.message ||
          '';

        // Trùng username (thường là mã tài khoản) -> báo lỗi rõ ràng cho người dùng
        if (detailMessage.includes('(username)')) {
          return res.status(409).json({
            error: 'Mã tài khoản đã tồn tại, vui lòng chọn mã khác'
          });
        }

        // Trùng email ở DB (phòng khi vượt qua bước kiểm tra trước đó)
        if (detailMessage.includes('(email)')) {
          return res.status(409).json({
            error: 'Email đã tồn tại trong hệ thống'
          });
        }

        // Trường hợp trùng khóa nhưng đã có row với cùng id -> cố gắng cập nhật lại
        console.warn(
          `Duplicate key when inserting user ${authUser.id}, attempting to update existing row`
        );
        try {
          const payloadToUpdate = { ...userPayload };
          delete payloadToUpdate.id;

          const [updated] = await updateUserRecord(authUser.id, payloadToUpdate);

          if (updated) {
            record = updated;
            console.log(`Updated existing user ${authUser.id} after duplicate conflict`);
            return res.status(200).json({
              success: true,
              user: record,
              temporaryPassword: isGeneratedPassword ? resolvedPassword : null,
              note: 'Tài khoản đã tồn tại trước đó nên hệ thống cập nhật lại thông tin'
            });
          }
        } catch (updateError) {
          console.error('Failed to update existing user after duplicate conflict', updateError);
        }
      }

      // Nếu đến đây vẫn chưa xử lý được, rollback user auth để tránh tài khoản mồ côi
      if (authUser?.id) {
        try {
          await callSupabaseAuth(
            `admin/users/${authUser.id}`,
            { method: 'DELETE' },
            { useAnonKey: false }
          );
        } catch (cleanupError) {
          console.warn('Failed to rollback auth user:', cleanupError.message);
        }
      }
      throw dbError;
    }

    return res.status(201).json({
      success: true,
      user: record,
      temporaryPassword: isGeneratedPassword ? resolvedPassword : null
    });
  } catch (error) {
    console.error('User create error:', error);
    const schemaMessage = buildMissingSchemaMessage(error);
    if (schemaMessage) {
      return res.status(500).json({ error: schemaMessage });
    }
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể tạo người dùng',
      details: error.details || null
    });
  }
}
