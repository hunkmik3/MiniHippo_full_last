import { selectFrom } from '../../_utils/supabase.js';
import { verifyAdminRequest, verifyUserRequest } from '../../_utils/auth.js';
import { contentToLegacySet, normalizeFlow, vstepSchemaErrorResponse } from '../_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const flow = typeof req.query.flow === 'string' && req.query.flow
    ? normalizeFlow(req.query.flow)
    : '';
  const status = typeof req.query.status === 'string' ? req.query.status.trim().toLowerCase() : '';

  try {
    let authResult = null;
    let assignments = [];
    if (status === 'published') {
      authResult = await verifyUserRequest(req, { requireDevice: true });
      if (!authResult.success) {
        return res.status(authResult.status || 401).json({ error: authResult.error || 'Unauthorized' });
      }

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
        if (flow === 'practice' && vstepStudent && vstepStudent.practice_access === false) {
          return res.status(403).json({ error: 'Tài khoản chưa được cấp quyền vào khu vực Ôn thi VSTEP' });
        }
        if (flow === 'lesson_exam') {
          // Học viên có assignment qua 2 cách:
          //   (a) user-level: vstep_assignments.user_id = HV (admin giao cá nhân)
          //   (b) class-level: vstep_assignments.class_id = lớp của HV (admin
          //       auto giao khi save bài cho lớp — không gắn user_id riêng)
          // Phải lấy CẢ HAI rồi dedup theo id, không thì class-level bị miss
          // → HV thấy mọi buổi đều "Chưa mở" mặc dù admin đã tạo bài.
          const userAssignments = await selectFrom('vstep_assignments', {
            filters: [
              { column: 'user_id', value: authResult.user.id },
              { column: 'status', value: 'active' }
            ],
            order: { column: 'due_at', asc: true }
          });
          const classId = vstepStudent?.class_id || authResult.user.assignedClassId;
          const classAssignments = classId
            ? await selectFrom('vstep_assignments', {
                filters: [
                  { column: 'class_id', value: classId },
                  { column: 'status', value: 'active' }
                ],
                order: { column: 'due_at', asc: true }
              })
            : [];
          // Dedup theo id (1 assignment có thể có cả user_id + class_id).
          const seen = new Set();
          assignments = [...(userAssignments || []), ...(classAssignments || [])]
            .filter(a => {
              if (!a?.id || seen.has(a.id)) return false;
              seen.add(a.id);
              return true;
            });
        }
      }
    } else {
      const adminCheck = await verifyAdminRequest(req);
      if (!adminCheck.success) {
        return res.status(adminCheck.status || 401).json({ error: adminCheck.error || 'Unauthorized' });
      }
    }

    const filters = [];
    if (flow) filters.push({ column: 'flow', value: flow });
    if (status) filters.push({ column: 'status', value: status });

    const contents = await selectFrom('vstep_contents', {
      filters,
      order: { column: 'created_at', asc: false }
    });

    let normalized = Array.isArray(contents) ? contents : [];
    const adminView = authResult?.user?.role === 'admin';
    if (status === 'published' && flow === 'lesson_exam' && !adminView) {
      const now = Date.now();
      const assignmentByContent = new Map(
        (Array.isArray(assignments) ? assignments : [])
          .filter(item => {
            const starts = item.available_from ? new Date(item.available_from).getTime() : null;
            return !Number.isFinite(starts) || starts <= now;
          })
          .map(item => [item.content_id, item])
      );
      normalized = normalized
        .filter(content => assignmentByContent.has(content.id))
        .map(content => ({
          ...content,
          assignment: assignmentByContent.get(content.id)
        }));
    }
    return res.status(200).json({
      contents: normalized,
      sets: normalized.map(contentToLegacySet),
      adminView
    });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep contents list error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể tải nội dung VSTEP',
      details: error?.details || null
    });
  }
}
