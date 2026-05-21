import { parseJsonBody } from '../../_utils/parseBody.js';
import { verifyAdminRequest } from '../../_utils/auth.js';
import { updateTable } from '../../_utils/supabase.js';
import { legacyPayloadToContentPayload, vstepSchemaErrorResponse } from '../_utils.js';

export default async function handler(req, res) {
  const method = String(req.method || '').toUpperCase();
  if (method !== 'PUT' && method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res.status(adminCheck.status || 401).json({ error: adminCheck.error || 'Unauthorized' });
  }

  try {
    const body = await parseJsonBody(req);
    const id = req.query.id || body?.id;
    if (!id) return res.status(400).json({ error: 'Thiếu tham số id' });

    const payload = {
      ...legacyPayloadToContentPayload(body, adminCheck.user),
      updated_at: new Date().toISOString()
    };
    delete payload.created_by;

    const result = await updateTable('vstep_contents', [{ column: 'id', value: id }], payload);
    const record = Array.isArray(result) ? result[0] : result;
    return res.status(200).json({ success: true, content: record, set: record });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep contents update error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể cập nhật nội dung VSTEP',
      details: error?.details || null
    });
  }
}
