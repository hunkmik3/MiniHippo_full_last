import parseBody from '../../_utils/parseBody.js';
import { verifyAdminRequest } from '../../_utils/auth.js';
import { deleteFrom } from '../../_utils/supabase.js';
import { vstepSchemaErrorResponse } from '../_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res.status(adminCheck.status || 401).json({ error: adminCheck.error || 'Unauthorized' });
  }

  let ids = [];
  if (req.query.id) {
    ids = [req.query.id];
  } else {
    try {
      const body = await parseBody(req);
      ids = Array.isArray(body?.ids) ? body.ids : body?.id ? [body.id] : [];
    } catch {}
  }
  if (!ids.length) return res.status(400).json({ error: 'Thiếu id kết quả VSTEP' });

  try {
    for (const id of ids) {
      await deleteFrom('vstep_results', [{ column: 'id', value: id }]);
    }
    return res.status(200).json({ success: true, deleted: ids.length });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep results delete error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể xoá kết quả VSTEP',
      details: error?.details || null
    });
  }
}
