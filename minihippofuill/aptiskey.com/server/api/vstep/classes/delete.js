import { parseJsonBody } from '../../_utils/parseBody.js';
import { verifyAdminRequest } from '../../_utils/auth.js';
import { deleteFrom, selectFrom } from '../../_utils/supabase.js';
import { vstepSchemaErrorResponse } from '../_utils.js';

// DELETE /api/vstep/classes/delete?id=<classId>
// Hoặc POST với body { id }. Xoá lớp + cascade dọn membership + assignments
// (vstep_class_students & vstep_assignments khoá ngoại đến vstep_classes có
// ON DELETE CASCADE nếu schema chuẩn; nếu chưa thì dọn tay ở đây).
export default async function handler(req, res) {
  const method = String(req.method || '').toUpperCase();
  if (method !== 'DELETE' && method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res.status(adminCheck.status || 401).json({ error: adminCheck.error || 'Unauthorized' });
  }

  try {
    let body = {};
    if (method === 'POST') {
      body = await parseJsonBody(req).catch(() => ({}));
    }
    const id = body?.id || req.query.id;
    if (!id) return res.status(400).json({ error: 'Thiếu id lớp VSTEP' });

    const existing = await selectFrom('vstep_classes', {
      filters: [{ column: 'id', value: id }],
      single: true
    });
    if (!existing) return res.status(404).json({ error: 'Không tìm thấy lớp VSTEP' });

    // Dọn tay membership + assignments để chắc chắn không để lại record mồ côi
    // nếu FK cascade chưa được setup ở schema. Idempotent — không throw nếu rỗng.
    try {
      await deleteFrom('vstep_class_students', [{ column: 'class_id', value: id }]);
    } catch (cleanupError) {
      console.warn('Failed to cleanup vstep_class_students:', cleanupError.message);
    }
    try {
      await deleteFrom('vstep_assignments', [{ column: 'class_id', value: id }]);
    } catch (cleanupError) {
      console.warn('Failed to cleanup vstep_assignments:', cleanupError.message);
    }

    // Nullify học viên đang assigned_class_id trỏ về lớp này.
    try {
      const students = await selectFrom('vstep_students', {
        filters: [{ column: 'class_id', value: id }]
      });
      if (Array.isArray(students) && students.length) {
        // Không có updateMany helper — gọi từng row.
        const { updateTable } = await import('../../_utils/supabase.js');
        for (const s of students) {
          try {
            await updateTable('vstep_students', [{ column: 'id', value: s.id }], { class_id: null });
          } catch (e) {
            console.warn(`Failed to detach student ${s.id}:`, e.message);
          }
        }
      }
    } catch (cleanupError) {
      console.warn('Failed to detach students from class:', cleanupError.message);
    }

    await deleteFrom('vstep_classes', [{ column: 'id', value: id }]);

    return res.status(200).json({ success: true });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep classes delete error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể xoá lớp VSTEP',
      details: error?.details || null
    });
  }
}
