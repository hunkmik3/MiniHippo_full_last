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
    const students = await selectFrom('vstep_students', {
      order: { column: 'created_at', asc: false }
    });
    return res.status(200).json({ students: Array.isArray(students) ? students : [] });
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
