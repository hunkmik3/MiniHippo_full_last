import { parseJsonBody } from '../../_utils/parseBody.js';
import { verifyAdminRequest } from '../../_utils/auth.js';
import { insertInto } from '../../_utils/supabase.js';
import { legacyPayloadToContentPayload, vstepSchemaErrorResponse } from '../_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res.status(adminCheck.status || 401).json({ error: adminCheck.error || 'Unauthorized' });
  }

  try {
    const body = await parseJsonBody(req);
    const payload = legacyPayloadToContentPayload(body, adminCheck.user);
    if (!payload.title || !payload.data) {
      return res.status(400).json({ error: 'Thiếu tiêu đề hoặc nội dung VSTEP' });
    }

    const result = await insertInto('vstep_contents', payload);
    const record = Array.isArray(result) ? result[0] : result;
    return res.status(200).json({ success: true, content: record, set: record });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep contents create error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể lưu nội dung VSTEP',
      details: error?.details || null
    });
  }
}
