import { parseJsonBody } from '../../_utils/parseBody.js';
import { verifyAdminRequest } from '../../_utils/auth.js';
import { insertInto, updateTable } from '../../_utils/supabase.js';
import { vstepSchemaErrorResponse } from '../_utils.js';

function normalizeBand(value) {
  const band = String(value || '').trim().toUpperCase();
  return band === 'B2' ? 'B2' : 'B1';
}

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

    const [record] = await insertInto('vstep_classes', [{
      title,
      band: normalizeBand(body?.band),
      teacher_name: String(body?.teacherName || body?.teacher_name || '').trim() || null,
      teacher_user_id: body?.teacherUserId || body?.teacher_user_id || null,
      starts_at: body?.startsAt || body?.starts_at || null,
      ends_at: body?.endsAt || body?.ends_at || null,
      schedule: parseJsonValue(body?.schedule, {}),
      holidays: parseJsonValue(body?.holidays, []),
      status: body?.status || 'active',
      notes: body?.notes || null,
      created_by: adminCheck.user.id
    }]);

    const studentIds = Array.isArray(body?.studentIds) ? body.studentIds.filter(Boolean) : [];
    if (studentIds.length) {
      await Promise.all(studentIds.map(studentId => insertInto('vstep_class_students', [{
        class_id: record.id,
        student_id: studentId,
        status: 'active'
      }]).then(() => updateTable('vstep_students', [{ column: 'id', value: studentId }], { class_id: record.id })).catch(error => {
        console.warn('Failed to attach VSTEP student to class:', error.message);
      })));
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
