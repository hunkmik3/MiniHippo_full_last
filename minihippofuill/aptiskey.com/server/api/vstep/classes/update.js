import { parseJsonBody } from '../../_utils/parseBody.js';
import { verifyAdminRequest } from '../../_utils/auth.js';
import { selectFrom, updateTable } from '../../_utils/supabase.js';
import {
  buildVstepSessions,
  computeVstepExpiresAt,
  defaultNumSessionsForBand,
  normalizeScheduleType,
  normalizeVstepBand,
  vstepSchemaErrorResponse
} from '../_utils.js';

function parseJsonValue(value, fallback) {
  if (value && typeof value === 'object') return value;
  if (typeof value !== 'string' || !value.trim()) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeSessionsArray(value) {
  if (!Array.isArray(value)) return null;
  return value
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null;
      const number = Number(entry.number);
      if (!Number.isFinite(number) || number <= 0) return null;
      return {
        number: Math.floor(number),
        date: entry.date ? String(entry.date) : null,
        deadline: entry.deadline ? String(entry.deadline) : null,
        day_name: entry.day_name || entry.dayName || ''
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.number - b.number);
}

export default async function handler(req, res) {
  const method = String(req.method || '').toUpperCase();
  if (method !== 'PATCH' && method !== 'PUT' && method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res.status(adminCheck.status || 401).json({ error: adminCheck.error || 'Unauthorized' });
  }

  try {
    const body = await parseJsonBody(req);
    const id = body?.id || req.query.id;
    if (!id) return res.status(400).json({ error: 'Thiếu id lớp VSTEP' });

    const existing = await selectFrom('vstep_classes', {
      filters: [{ column: 'id', value: id }],
      single: true
    });
    if (!existing) return res.status(404).json({ error: 'Không tìm thấy lớp VSTEP' });

    const payload = { updated_at: new Date().toISOString() };
    if (body.title !== undefined) payload.title = String(body.title || '').trim() || existing.title;
    if (body.band !== undefined) payload.band = normalizeVstepBand(body.band);
    if (body.teacherName !== undefined || body.teacher_name !== undefined) {
      payload.teacher_name = String(body.teacherName || body.teacher_name || '').trim() || null;
    }
    if (body.teacherUserId !== undefined || body.teacher_user_id !== undefined) {
      payload.teacher_user_id = body.teacherUserId || body.teacher_user_id || null;
    }
    if (body.holidays !== undefined) payload.holidays = parseJsonValue(body.holidays, []);
    if (body.status !== undefined) payload.status = String(body.status || 'active');
    if (body.notes !== undefined) payload.notes = body.notes || null;

    // Quyết định regenerate sessions[] hay không.
    // - Nếu admin truyền sessions trực tiếp → dùng nguyên (đây là path
    //   chỉnh deadline tay cho từng buổi).
    // - Nếu admin đổi schedule_type / start_time / num_sessions / starts_at
    //   → regenerate toàn bộ.
    const explicitSessions = normalizeSessionsArray(body.sessions);

    const newScheduleType = body.scheduleType ?? body.schedule_type;
    const newStartTime = body.startTime ?? body.start_time;
    const newNumSessions = body.numSessions ?? body.num_sessions;
    const newStartsAt = body.startsAt ?? body.starts_at;

    const scheduleChanged = newScheduleType !== undefined
      || newStartTime !== undefined
      || newNumSessions !== undefined
      || newStartsAt !== undefined;

    if (explicitSessions) {
      payload.sessions = explicitSessions;
    } else if (scheduleChanged) {
      const scheduleType = normalizeScheduleType(newScheduleType ?? existing.schedule_type) || '246';
      const startTime = String(newStartTime ?? existing.start_time ?? '18:00').trim() || '18:00';
      const band = payload.band || existing.band || 'B1';
      const numSessions = Number.isFinite(Number(newNumSessions)) && Number(newNumSessions) > 0
        ? Math.floor(Number(newNumSessions))
        : Number(existing.num_sessions) || defaultNumSessionsForBand(band);
      const startsAt = newStartsAt ?? existing.starts_at;

      payload.schedule_type = scheduleType;
      payload.start_time = startTime;
      payload.num_sessions = numSessions;
      if (newStartsAt !== undefined) payload.starts_at = startsAt;

      payload.sessions = startsAt
        ? buildVstepSessions({ scheduleType, firstDate: startsAt, startTime, numSessions })
        : [];

      // ends_at auto = starts_at + 6 tháng nếu admin không override.
      if (body.endsAt === undefined && body.ends_at === undefined && startsAt) {
        const ends = computeVstepExpiresAt(startsAt);
        if (ends) payload.ends_at = ends.toISOString();
      }
    }

    if (body.endsAt !== undefined || body.ends_at !== undefined) {
      payload.ends_at = body.endsAt || body.ends_at || null;
    }

    if (body.schedule !== undefined) {
      payload.schedule = parseJsonValue(body.schedule, existing.schedule || {});
    }

    if (Object.keys(payload).length <= 1) {
      return res.status(400).json({ error: 'Không có dữ liệu cần cập nhật' });
    }

    const result = await updateTable(
      'vstep_classes',
      [{ column: 'id', value: id }],
      payload
    );

    const record = Array.isArray(result) ? result[0] : result;
    return res.status(200).json({ success: true, class: record });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep classes update error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể cập nhật lớp VSTEP',
      details: error?.details || null
    });
  }
}
