import { parseJsonBody } from '../../_utils/parseBody.js';
import { verifyAdminRequest } from '../../_utils/auth.js';
import { insertInto, updateTable } from '../../_utils/supabase.js';
import { vstepSchemaErrorResponse } from '../_utils.js';

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
    const classId = body?.classId || body?.class_id;
    const studentIds = Array.isArray(body?.studentIds) ? body.studentIds.filter(Boolean) : [];
    if (!classId || !studentIds.length) {
      return res.status(400).json({ error: 'Thiếu lớp hoặc danh sách học viên' });
    }

    const results = [];
    for (const studentId of studentIds) {
      try {
        const [membership] = await insertInto('vstep_class_students', [{
          class_id: classId,
          student_id: studentId,
          status: 'active'
        }]);
        await updateTable('vstep_students', [{ column: 'id', value: studentId }], { class_id: classId });
        results.push({ studentId, ok: true, membership });
      } catch (error) {
        results.push({ studentId, ok: false, error: error.message });
      }
    }

    return res.status(200).json({ success: true, results });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep classes assign error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể gán học viên vào lớp',
      details: error?.details || null
    });
  }
}
