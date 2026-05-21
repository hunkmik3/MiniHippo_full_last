import { verifyAdminRequest, verifyUserRequest } from '../../_utils/auth.js';
import { selectFrom } from '../../_utils/supabase.js';
import { vstepSchemaErrorResponse } from '../_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminMode = req.query.admin === '1' || req.query.admin === 'true';
  const authResult = adminMode
    ? await verifyAdminRequest(req)
    : await verifyUserRequest(req, { requireDevice: true });
  if (!authResult.success) {
    return res.status(authResult.status || 401).json({ error: authResult.error || 'Unauthorized' });
  }

  try {
    const filters = [];
    if (req.query.contentId) filters.push({ column: 'content_id', value: req.query.contentId });
    if (req.query.classId) filters.push({ column: 'class_id', value: req.query.classId });
    if (req.query.studentId) filters.push({ column: 'student_id', value: req.query.studentId });
    if (req.query.status) filters.push({ column: 'status', value: req.query.status });
    if (!adminMode) filters.push({ column: 'user_id', value: authResult.user.id });

    const assignments = await selectFrom('vstep_assignments', {
      filters,
      order: { column: 'due_at', asc: true }
    });

    return res.status(200).json({ assignments: Array.isArray(assignments) ? assignments : [] });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep assignments list error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể tải danh sách bài giao VSTEP',
      details: error?.details || null
    });
  }
}
