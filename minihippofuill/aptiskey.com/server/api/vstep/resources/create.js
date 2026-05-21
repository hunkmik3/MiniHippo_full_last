import parseBody from '../../_utils/parseBody.js';
import { verifyAdminRequest } from '../../_utils/auth.js';
import { insertInto } from '../../_utils/supabase.js';
import { vstepSchemaErrorResponse } from '../_utils.js';

const RESOURCE_TYPES = new Set(['audio', 'image', 'text', 'document', 'file']);

function normalizeResourceType(value) {
  const type = String(value || '').trim().toLowerCase();
  return RESOURCE_TYPES.has(type) ? type : 'file';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res.status(adminCheck.status || 401).json({ error: adminCheck.error || 'Unauthorized' });
  }

  try {
    const body = await parseBody(req);
    const title = String(body?.title || '').trim();
    const fileUrl = String(body?.fileUrl || body?.file_url || '').trim();
    const filePath = String(body?.filePath || body?.file_path || '').trim();
    if (!title) return res.status(400).json({ error: 'Vui lòng nhập tên tài nguyên' });
    if (!fileUrl && !filePath) return res.status(400).json({ error: 'Thiếu URL hoặc đường dẫn tài nguyên' });

    const [resource] = await insertInto('vstep_resources', [{
      resource_type: normalizeResourceType(body?.resourceType || body?.resource_type),
      title,
      description: body?.description || '',
      file_url: fileUrl || filePath,
      file_path: filePath || null,
      mime_type: body?.mimeType || body?.mime_type || null,
      metadata: body?.metadata && typeof body.metadata === 'object' ? body.metadata : {},
      created_by: adminCheck.user.id
    }]);

    return res.status(200).json({ success: true, resource });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep resources create error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể lưu tài nguyên VSTEP',
      details: error?.details || null
    });
  }
}
