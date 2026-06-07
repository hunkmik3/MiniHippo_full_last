import { verifyUserRequest } from '../../_utils/auth.js';
import { selectFrom } from '../../_utils/supabase.js';
import { normalizeFlow, vstepSchemaErrorResponse } from '../_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authResult = await verifyUserRequest(req, { requireDevice: true });
  if (!authResult.success) {
    return res.status(authResult.status || 401).json({ error: authResult.error || 'Unauthorized' });
  }

  try {
    const filters = [{ column: 'user_id', value: authResult.user.id }];
    if (req.query.flow) filters.push({ column: 'flow', value: normalizeFlow(req.query.flow) });
    if (req.query.contentId) filters.push({ column: 'content_id', value: req.query.contentId });
    const parsedLimit = Math.min(Math.max(parseInt(req.query.limit, 10) || 200, 1), 300);

    const results = await selectFrom('vstep_results', {
      filters,
      order: { column: 'submitted_at', asc: false },
      limit: parsedLimit
    });

    return res.status(200).json({ results: Array.isArray(results) ? results : [] });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep results my-list error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể tải kết quả VSTEP của học viên',
      details: error?.details || null
    });
  }
}
