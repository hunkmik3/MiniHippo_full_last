import { parseJsonBody } from '../../_utils/parseBody.js';
import { verifyAdminRequest } from '../../_utils/auth.js';
import { insertInto, selectFrom } from '../../_utils/supabase.js';
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
    const contentId = body?.contentId || body?.content_id;
    if (!contentId) return res.status(400).json({ error: 'Thiếu nội dung cần giao' });

    const classId = body?.classId || body?.class_id || null;
    let studentIds = Array.isArray(body?.studentIds) ? body.studentIds.filter(Boolean) : [];
    if (classId && !studentIds.length) {
      const memberships = await selectFrom('vstep_class_students', {
        filters: [
          { column: 'class_id', value: classId },
          { column: 'status', value: 'active' }
        ]
      });
      studentIds = (Array.isArray(memberships) ? memberships : []).map(item => item.student_id).filter(Boolean);
    }
    if (classId && !studentIds.length) {
      return res.status(400).json({ error: 'Lớp chưa có học viên active để giao bài' });
    }
    if (!studentIds.length && !classId) {
      return res.status(400).json({ error: 'Chọn lớp hoặc học viên để giao bài' });
    }

    const students = studentIds.length
      ? await Promise.all(studentIds.map(studentId => selectFrom('vstep_students', {
        filters: [{ column: 'id', value: studentId }],
        single: true
      })))
      : [];

    // Dedup: nếu đã có assignment cho (content_id, class_id, student_id) active
    // rồi thì SKIP — admin click save bài 2 lần / autoAssignContent chạy lại
    // không tạo duplicate. Vẫn cho phép update due_at qua endpoint update riêng.
    const existing = await selectFrom('vstep_assignments', {
      filters: [
        { column: 'content_id', value: contentId },
        { column: 'class_id', value: classId, operator: classId ? 'eq' : 'is' }
      ]
    });
    const existingByStudent = new Set(
      (Array.isArray(existing) ? existing : [])
        .filter(a => a.status !== 'archived')
        .map(a => a.student_id || '__noStudent__')
    );

    const payloads = students
      .filter(student => !existingByStudent.has(student?.id || '__noStudent__'))
      .map(student => ({
        content_id: contentId,
        class_id: classId,
        student_id: student?.id || null,
        user_id: student?.user_id || null,
        assigned_by: adminCheck.user.id,
        available_from: body?.availableFrom || body?.available_from || null,
        due_at: body?.dueAt || body?.due_at || null,
        status: body?.status || 'active',
        notes: body?.notes || null
      }));

    if (!payloads.length) {
      // Đã có assignment cho tất cả HV — trả về existing thay vì error.
      return res.status(200).json({
        success: true,
        assignments: Array.isArray(existing) ? existing : [],
        message: 'Tất cả HV đã có assignment cho bài này, không tạo thêm.'
      });
    }

    const records = await insertInto('vstep_assignments', payloads);
    return res.status(200).json({
      success: true,
      assignments: Array.isArray(records) ? records : []
    });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep assignments create error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể giao bài VSTEP',
      details: error?.details || null
    });
  }
}
