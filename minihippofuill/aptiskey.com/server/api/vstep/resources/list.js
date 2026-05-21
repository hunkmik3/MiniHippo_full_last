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
    if (req.query.type) filters.push({ column: 'resource_type', value: req.query.type });

    const resources = await selectFrom('vstep_resources', {
      filters,
      order: { column: 'created_at', asc: false },
      limit: Number(req.query.limit) || 200
    });

    return res.status(200).json({ resources: Array.isArray(resources) ? resources : [] });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep resources list error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể tải kho tài nguyên VSTEP',
      details: error?.details || null
    });
  }
}
