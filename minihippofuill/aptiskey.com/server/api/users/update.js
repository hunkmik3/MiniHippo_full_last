import { parseJsonBody } from '../_utils/parseBody.js';
import { verifyAdminRequest } from '../_utils/auth.js';
import { updateTable } from '../_utils/supabase.js';

const OPTIONAL_USER_COLUMNS = ['learning_program', 'started_on'];

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

async function updateUserRecordWithFallback(userId, payload) {
  let nextPayload = { ...payload };
  const removedColumns = new Set();

  while (true) {
    try {
      if (removedColumns.size) {
        console.warn(
          `users.update: retry update without unsupported columns: ${Array.from(removedColumns).join(', ')}`
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
  if (req.method !== 'PUT' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res
      .status(adminCheck.status || 401)
      .json({ error: adminCheck.error || 'Unauthorized' });
  }

  let body;
  try {
    body = await parseJsonBody(req);
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Invalid JSON payload' });
  }

  const {
    id,
    email,
    username,
    status,
    role,
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

  if (!id) {
    return res.status(400).json({ error: 'Thiếu user id' });
  }

  const normalizedProgram =
    typeof learningProgram !== 'undefined' ? normalizeLearningProgram(learningProgram) : '';
  const resolvedCourse = typeof course === 'string' ? normalizeCourse(course) : '';
  let resolvedBand = '';
  if (typeof band === 'string') {
    resolvedBand = normalizeBand(band);
  } else if (typeof band !== 'undefined' && band !== null) {
    resolvedBand = null;
  }

  if (resolvedBand === null) {
    return res.status(400).json({ error: 'Band không hợp lệ. Chỉ chấp nhận B1 hoặc B2.' });
  }

  const effectiveCourse =
    typeof course !== 'undefined'
      ? resolvedCourse
      : normalizedProgram === 'classroom'
        ? 'Lớp học'
        : normalizedProgram === 'aptis'
          ? 'Aptis'
          : '';

  if (effectiveCourse === 'Lớp học' && !resolvedBand) {
    return res.status(400).json({
      error: 'Học viên lớp học bắt buộc phải có band (B1 hoặc B2) khi cập nhật.'
    });
  }

  const payload = {};
  if (email) payload.email = email.trim();
  if (username) payload.username = username.trim();
  if (status) payload.status = status;
  if (role) payload.role = role;
  if (typeof accountCode !== 'undefined') {
    payload.account_code = accountCode ? accountCode.trim() : null;
  }
  if (typeof fullName !== 'undefined') {
    payload.full_name = fullName ? fullName.trim() : null;
  }
  if (typeof phone !== 'undefined') {
    payload.phone_number = phone ? phone.trim() : null;
  }
  if (typeof deviceLimit !== 'undefined') {
    payload.device_limit = Number(deviceLimit) || 1;
  }
  if (typeof expiresAt !== 'undefined') {
    payload.expires_at = expiresAt || null;
  }
  if (typeof notes !== 'undefined') {
    payload.notes = notes || null;
  }
  if (typeof course !== 'undefined') {
    payload.course = resolvedCourse || null;
  } else if (normalizedProgram === 'aptis') {
    payload.course = 'Aptis';
  } else if (normalizedProgram === 'classroom') {
    payload.course = 'Lớp học';
  }
  if (typeof band !== 'undefined' || typeof course !== 'undefined' || payload.course === 'Lớp học') {
    payload.band =
      payload.course === 'Lớp ôn thi' || payload.course === 'Aptis'
        ? null
        : resolvedBand || null;
  }
  if (typeof startedOn !== 'undefined') {
    payload.started_on =
      typeof startedOn === 'string' ? startedOn.trim() || null : startedOn || null;
  }
  if (typeof learningProgram !== 'undefined') {
    payload.learning_program = normalizedProgram || null;
  }

  if (!Object.keys(payload).length) {
    return res.status(400).json({ error: 'Không có dữ liệu cần cập nhật' });
  }

  try {
    const updated = await updateUserRecordWithFallback(id, payload);
    return res.status(200).json({ success: true, user: Array.isArray(updated) ? updated[0] : updated });
  } catch (error) {
    console.error('User update error:', error);
    const schemaMessage = buildMissingSchemaMessage(error);
    if (schemaMessage) {
      return res.status(500).json({ error: schemaMessage });
    }
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể cập nhật người dùng'
    });
  }
}





