import { parseJsonBody } from '../../_utils/parseBody.js';
import { verifyAdminRequest } from '../../_utils/auth.js';
import { selectFrom, deleteFrom, callSupabaseAuth } from '../../_utils/supabase.js';
import { vstepSchemaErrorResponse } from '../_utils.js';

// DELETE /api/vstep/students/delete?id=<vstep_student_id>
// hoặc POST /api/vstep/students/delete body { ids: [id1, id2, ...] } cho bulk delete.
// Xoá HẲN khỏi DB: dọn cascade vstep_class_students, vstep_assignments,
// vstep_results, vstep_students, public.users, auth.users.
async function deleteSingleStudent(vstepStudentId) {
  const student = await selectFrom('vstep_students', {
    filters: [{ column: 'id', value: vstepStudentId }],
    single: true
  });
  if (!student) return { id: vstepStudentId, status: 'not_found' };

  const userId = student.user_id || null;

  // Dọn theo thứ tự FK an toàn — bảng phụ thuộc trước, bảng gốc sau.
  const cleanup = async (table, col, value) => {
    if (!value) return;
    try {
      await deleteFrom(table, [{ column: col, value }]);
    } catch (err) {
      console.warn(`vstep students delete: cleanup ${table}.${col} failed:`, err.message);
    }
  };

  // vstep_class_students: row bind HV vào lớp.
  await cleanup('vstep_class_students', 'student_id', student.id);
  if (userId) await cleanup('vstep_class_students', 'user_id', userId);

  // vstep_assignments: bài đã giao cho HV.
  await cleanup('vstep_assignments', 'student_id', student.id);
  if (userId) await cleanup('vstep_assignments', 'user_id', userId);

  // vstep_results: kết quả bài làm.
  await cleanup('vstep_results', 'student_id', student.id);
  if (userId) await cleanup('vstep_results', 'user_id', userId);

  // user_devices: device đã đăng nhập (nếu có).
  if (userId) await cleanup('user_devices', 'user_id', userId);

  // practice_results: kết quả luyện tập legacy nếu HV có (cùng user_id).
  if (userId) await cleanup('practice_results', 'user_id', userId);

  // vstep_students row gốc.
  await cleanup('vstep_students', 'id', student.id);

  // public.users (mirror profile).
  if (userId) await cleanup('users', 'id', userId);

  // auth.users (Supabase Auth) — xoá luôn để email/account_code có thể tái sử dụng.
  if (userId) {
    try {
      await callSupabaseAuth(`admin/users/${userId}`, { method: 'DELETE' }, { useAnonKey: false });
    } catch (err) {
      console.warn('vstep students delete: failed to remove auth user:', err.message);
    }
  }

  return { id: vstepStudentId, status: 'deleted', userId };
}

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
    let ids = [];
    if (method === 'DELETE') {
      const single = req.query?.id;
      if (single) ids = [single];
    } else {
      const body = await parseJsonBody(req).catch(() => ({}));
      if (Array.isArray(body?.ids)) ids = body.ids.filter(Boolean);
      else if (body?.id) ids = [body.id];
    }

    if (!ids.length) return res.status(400).json({ error: 'Thiếu id học viên cần xoá' });

    const results = [];
    for (const id of ids) {
      try {
        results.push(await deleteSingleStudent(id));
      } catch (err) {
        console.error(`vstep students delete failed for ${id}:`, err);
        results.push({ id, status: 'error', error: err.message });
      }
    }

    const deleted = results.filter(r => r.status === 'deleted').length;
    const notFound = results.filter(r => r.status === 'not_found').length;
    const errors = results.filter(r => r.status === 'error');

    return res.status(200).json({
      success: true,
      deleted,
      notFound,
      errors: errors.length ? errors : undefined,
      results
    });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep students delete error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể xoá học viên VSTEP',
      details: error?.details || null
    });
  }
}
