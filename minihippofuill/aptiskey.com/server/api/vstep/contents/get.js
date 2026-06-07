import { selectFrom } from '../../_utils/supabase.js';
import { verifyUserRequest } from '../../_utils/auth.js';
import { contentToLegacySet, practiceAccessWindowStatus, vstepSchemaErrorResponse } from '../_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authResult = await verifyUserRequest(req, { requireDevice: true });
  if (!authResult.success) {
    return res.status(authResult.status || 401).json({ error: authResult.error || 'Unauthorized' });
  }

  const id = req.query.id;
  if (!id) return res.status(400).json({ error: 'Thiếu tham số id' });

  try {
    const content = await selectFrom('vstep_contents', {
      filters: [{ column: 'id', value: id }],
      single: true
    });

    if (!content) return res.status(404).json({ error: 'Không tìm thấy nội dung VSTEP' });

    const adminView = authResult.user.role === 'admin';
    if (!adminView) {
      const vstepStudent = await selectFrom('vstep_students', {
        filters: [{ column: 'user_id', value: authResult.user.id }],
        single: true
      });
      const userCourse = String(authResult.user.course || authResult.user.learningProgram || '').toLowerCase();
      if (!vstepStudent && !userCourse.includes('vstep')) {
        return res.status(403).json({ error: 'Tài khoản chưa được cấp quyền VSTEP' });
      }
      if (vstepStudent?.status && vstepStudent.status !== 'active') {
        return res.status(403).json({ error: 'Tài khoản VSTEP đang bị khóa' });
      }
      if (vstepStudent?.expires_at) {
        const expires = new Date(vstepStudent.expires_at).getTime();
        if (Number.isFinite(expires) && expires < Date.now()) {
          return res.status(403).json({ error: 'Tài khoản VSTEP đã hết hạn sử dụng' });
        }
      }
      if (content.flow === 'practice' && vstepStudent && vstepStudent.practice_access === false) {
        return res.status(403).json({ error: 'Tài khoản chưa được cấp quyền vào khu vực Ôn thi VSTEP' });
      }
      if (content.flow === 'practice') {
        const windowStatus = practiceAccessWindowStatus(content);
        if (!windowStatus.allowed) {
          return res.status(403).json({ error: windowStatus.reason || 'Đề ôn thi chưa nằm trong thời gian truy cập' });
        }
      }
      if (content.flow === 'lesson_exam') {
        const assignmentId = req.query.assignment || req.query.assignmentId || '';
        const filters = [
          { column: 'content_id', value: content.id },
          { column: 'user_id', value: authResult.user.id },
          { column: 'status', value: 'active' }
        ];
        const assignments = await selectFrom('vstep_assignments', { filters });
        const matching = (Array.isArray(assignments) ? assignments : [])
          .find(item => !assignmentId || String(item.id) === String(assignmentId));
        if (!matching) {
          return res.status(403).json({ error: 'Bài học/bài thi này chưa được giao cho tài khoản của bạn' });
        }
        content.assignment = matching;
      }
    }

    return res.status(200).json({
      content,
      set: contentToLegacySet(content),
      adminView
    });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep contents get error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể tải nội dung VSTEP',
      details: error?.details || null
    });
  }
}
