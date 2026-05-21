import parseBody from '../../_utils/parseBody.js';
import { verifyUserRequest } from '../../_utils/auth.js';
import { insertInto, selectFrom, updateTable } from '../../_utils/supabase.js';
import { normalizeContentKind, normalizeFlow, vstepSchemaErrorResponse } from '../_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authResult = await verifyUserRequest(req, { requireDevice: true });
  if (!authResult.success) {
    return res.status(authResult.status || 401).json({ error: authResult.error || 'Unauthorized' });
  }

  try {
    const body = await parseBody(req);
    const contentId = body?.contentId || body?.setId || body?.vstepContentId;
    if (!contentId) {
      return res.status(400).json({ error: 'Thiếu id nội dung VSTEP' });
    }

    const content = await selectFrom('vstep_contents', {
      filters: [{ column: 'id', value: contentId }],
      single: true
    });
    if (!content) {
      return res.status(404).json({ error: 'Không tìm thấy nội dung VSTEP' });
    }

    const student = await selectFrom('vstep_students', {
      filters: [{ column: 'user_id', value: authResult.user.id }],
      single: true
    });

    const flow = normalizeFlow(content.flow || body?.flow || body?.metadata?.vstep_flow);
    const contentKind = normalizeContentKind(content.content_kind || body?.contentKind || body?.metadata?.vstep_content_kind, flow);
    const adminView = authResult.user.role === 'admin';
    if (!adminView) {
      const userCourse = String(authResult.user.course || authResult.user.learningProgram || '').toLowerCase();
      if (!student && !userCourse.includes('vstep')) {
        return res.status(403).json({ error: 'Tài khoản chưa được cấp quyền VSTEP' });
      }
      if (student?.status && student.status !== 'active') {
        return res.status(403).json({ error: 'Tài khoản VSTEP đang bị khóa' });
      }
      if (student?.expires_at) {
        const expires = new Date(student.expires_at).getTime();
        if (Number.isFinite(expires) && expires < Date.now()) {
          return res.status(403).json({ error: 'Tài khoản VSTEP đã hết hạn sử dụng' });
        }
      }
      if (flow === 'practice' && student && student.practice_access === false) {
        return res.status(403).json({ error: 'Tài khoản chưa được cấp quyền vào khu vực Ôn thi VSTEP' });
      }
    }

    let assignment = null;
    const assignmentId = body?.assignmentId || body?.assignment_id || null;
    if (flow === 'lesson_exam' && !assignmentId && !adminView) {
      return res.status(400).json({ error: 'Thiếu thông tin bài được giao VSTEP' });
    }
    if (assignmentId) {
      assignment = await selectFrom('vstep_assignments', {
        filters: [{ column: 'id', value: assignmentId }],
        single: true
      });
      if (!assignment) {
        return res.status(404).json({ error: 'Không tìm thấy bài được giao VSTEP' });
      }
      if (!adminView && assignment.user_id && assignment.user_id !== authResult.user.id) {
        return res.status(403).json({ error: 'Bài được giao không thuộc tài khoản này' });
      }
      if (assignment.content_id && assignment.content_id !== content.id) {
        return res.status(400).json({ error: 'Bài được giao không khớp nội dung VSTEP' });
      }
      if (!adminView && assignment.status && assignment.status !== 'active') {
        return res.status(403).json({ error: 'Bài được giao đã đóng hoặc bị khóa' });
      }
    }

    const metadata = body?.metadata && typeof body.metadata === 'object' ? { ...body.metadata } : {};
    metadata.module = 'vstep';
    metadata.vstep_flow = flow;
    metadata.vstep_content_kind = contentKind;
    metadata.vstep_content_id = content.id;
    metadata.vstep_set_id = content.id;
    metadata.vstep_set_title = content.title;
    if (adminView) metadata.admin_preview = true;
    if (assignment) {
      const dueAt = assignment.due_at ? new Date(assignment.due_at).getTime() : null;
      metadata.assignment_id = assignment.id;
      metadata.assignment_due_at = assignment.due_at || null;
      metadata.assignment_submitted_overdue = Number.isFinite(dueAt) ? dueAt < Date.now() : false;
    }

    const [record] = await insertInto('vstep_results', [{
      student_id: student?.id || null,
      user_id: authResult.user.id,
      content_id: content.id,
      assignment_id: assignment?.id || null,
      flow,
      content_kind: contentKind,
      content_title: content.title,
      total_score: Number(body?.totalScore) || 0,
      max_score: Number(body?.maxScore) || 0,
      part_scores: body?.partScores || null,
      duration_seconds: typeof body?.durationSeconds === 'number' && body.durationSeconds >= 0
        ? Math.round(body.durationSeconds)
        : null,
      device_id: req.headers['x-device-id'] || req.headers['X-Device-Id'] || null,
      metadata
    }]);

    if (assignment?.id) {
      await updateTable('vstep_assignments', [{ column: 'id', value: assignment.id }], {
        status: 'closed',
        updated_at: new Date().toISOString()
      }).catch(error => {
        console.warn('Không thể đóng assignment VSTEP sau khi nộp:', error.message);
      });
    }

    return res.status(200).json({ success: true, result: record });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep results submit error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể lưu kết quả VSTEP',
      details: error?.details || null
    });
  }
}
