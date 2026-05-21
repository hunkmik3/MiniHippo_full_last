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
    const filters = [];
    if (req.query.band) filters.push({ column: 'band', value: String(req.query.band).toUpperCase() });
    if (req.query.status) filters.push({ column: 'status', value: String(req.query.status).toLowerCase() });

    const classes = await selectFrom('vstep_classes', {
      filters,
      order: { column: 'created_at', asc: false }
    });
    const memberships = await selectFrom('vstep_class_students', {
      order: { column: 'created_at', asc: false }
    });

    return res.status(200).json({
      classes: Array.isArray(classes) ? classes : [],
      memberships: Array.isArray(memberships) ? memberships : []
    });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep classes list error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể tải lớp VSTEP',
      details: error?.details || null
    });
  }
}
