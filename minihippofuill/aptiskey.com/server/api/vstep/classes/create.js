import { parseJsonBody } from '../../_utils/parseBody.js';
import { verifyAdminRequest } from '../../_utils/auth.js';
import { insertInto, selectFrom, updateTable } from '../../_utils/supabase.js';
import {
  buildVstepSessions,
  computeVstepExpiresAt,
  computeVstepExpiresAtDate,
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
    const title = String(body?.title || '').trim();
    if (!title) return res.status(400).json({ error: 'Tên lớp là bắt buộc' });

    const band = normalizeVstepBand(body?.band);

    // Lịch học có cấu trúc 246/357 + giờ học. Nếu admin không truyền,
    // mặc định lịch 246 giờ 18:00.
    const scheduleType = normalizeScheduleType(body?.scheduleType || body?.schedule_type) || '246';
    const startTime = String(body?.startTime || body?.start_time || '18:00').trim() || '18:00';

    // Số buổi cố định theo band (B1=18, B2=24). Admin có thể override nhưng
    // không khuyến khích.
    const numSessions = Number.isFinite(Number(body?.numSessions || body?.num_sessions))
      && Number(body?.numSessions || body?.num_sessions) > 0
      ? Math.floor(Number(body?.numSessions || body?.num_sessions))
      : defaultNumSessionsForBand(band);

    const startsAt = body?.startsAt || body?.starts_at || null;

    // ends_at auto = ngày khai giảng + 6 tháng (truy cập 6 tháng kể từ ngày
    // khai giảng). Admin có thể override bằng body.endsAt.
    const explicitEndsAt = body?.endsAt || body?.ends_at;
    const computedEndsAt = startsAt ? computeVstepExpiresAt(startsAt) : null;
    const endsAt = explicitEndsAt || (computedEndsAt ? computedEndsAt.toISOString() : null);

    // Sessions[] tự sinh theo lịch — admin chỉnh deadline tay sau qua endpoint update.
    const sessions = startsAt
      ? buildVstepSessions({
          scheduleType,
          firstDate: startsAt,
          startTime,
          numSessions
        })
      : [];

    // Legacy schedule jsonb vẫn giữ cho backward compat, lưu metadata mới
    // bên trong cho frontend cũ đọc được nếu cần.
    const legacyScheduleJson = parseJsonValue(body?.schedule, {
      schedule_type: scheduleType,
      start_time: startTime,
      num_sessions: numSessions
    });

    const [record] = await insertInto('vstep_classes', [{
      title,
      band,
      teacher_name: String(body?.teacherName || body?.teacher_name || '').trim() || null,
      teacher_user_id: body?.teacherUserId || body?.teacher_user_id || null,
      starts_at: startsAt,
      ends_at: endsAt,
      schedule: legacyScheduleJson,
      schedule_type: scheduleType,
      start_time: startTime,
      num_sessions: numSessions,
      sessions,
      holidays: parseJsonValue(body?.holidays, []),
      status: body?.status || 'active',
      notes: body?.notes || null,
      created_by: adminCheck.user.id
    }]);

    // Attach học viên vào lớp + auto-set expires_at theo ngày khai giảng lớp
    // nếu HV chưa có expires_at riêng. Vẫn cho admin override sau.
    const studentIds = Array.isArray(body?.studentIds) ? body.studentIds.filter(Boolean) : [];
    if (studentIds.length) {
      const computedExpires = startsAt ? computeVstepExpiresAtDate(startsAt) : null;
      await Promise.all(studentIds.map(async (studentId) => {
        try {
          await insertInto('vstep_class_students', [{
            class_id: record.id,
            student_id: studentId,
            status: 'active'
          }]);
          const updatePayload = { class_id: record.id };
          if (computedExpires) {
            updatePayload.started_on = startsAt && String(startsAt).slice(0, 10);
            updatePayload.expires_at = computedExpires;
          }
          await updateTable(
            'vstep_students',
            [{ column: 'id', value: studentId }],
            updatePayload
          );
        } catch (error) {
          console.warn('Failed to attach VSTEP student to class:', error.message);
        }
      }));
    }

    return res.status(200).json({ success: true, class: record });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep classes create error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể tạo lớp VSTEP',
      details: error?.details || null
    });
  }
}
