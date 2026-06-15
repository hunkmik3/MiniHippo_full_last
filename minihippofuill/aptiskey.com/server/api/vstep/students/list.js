import { verifyAdminRequest } from '../../_utils/auth.js';
import { selectFrom } from '../../_utils/supabase.js';
import { vstepSchemaErrorResponse } from '../_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res.status(adminCheck.status || 401).json({ error: adminCheck.error || 'Unauthorized' });
  }

  try {
    // Admin trang Ôn thi / Lớp Học truyền ?learning_program=... để chỉ thấy
    // HV của module mình. Để trống → trả tất cả (legacy / debug).
    const programRaw = String(req.query?.learning_program || req.query?.learningProgram || '').trim().toLowerCase();
    const programFilter = (programRaw === 'vstep_lophoc' || programRaw === 'vstep_onthi') ? programRaw : '';

    const allStudents = await selectFrom('vstep_students', {
      order: { column: 'created_at', asc: false }
    });
    let students = Array.isArray(allStudents) ? allStudents : [];

    if (programFilter && students.length) {
      // Ưu tiên column vstep_students.learning_program (sau migration). Nếu
      // tất cả row đều chưa có giá trị → fallback join với users.learning_program.
      const hasOwnColumn = students.some(s => s.learning_program);
      if (hasOwnColumn) {
        students = students.filter(s => String(s.learning_program || 'vstep_lophoc') === programFilter);
      } else {
        // Fallback: load users theo learning_program rồi filter vstep_students
        // theo user_id. PostgREST hỗ trợ filter trực tiếp; không cần in().
        const usersByProgram = await selectFrom('users', {
          filters: [{ column: 'learning_program', value: programFilter }]
        }).catch(() => []);
        const allowedUserIds = new Set((usersByProgram || []).map(u => u.id));
        students = students.filter(s => allowedUserIds.has(s.user_id));
      }
    }

    return res.status(200).json({ students });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep students list error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể tải học viên VSTEP',
      details: error?.details || null
    });
  }
}
