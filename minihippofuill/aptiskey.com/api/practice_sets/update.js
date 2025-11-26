import { parseJsonBody } from '../_utils/parseBody.js';
import { verifyAdminRequest } from '../_utils/auth.js';
import { updateTable } from '../_utils/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res
      .status(adminCheck.status)
      .json({ error: adminCheck.error || 'Unauthorized' });
  }

  const id = req.query.id;
  if (!id) {
    return res.status(400).json({ error: 'Thiếu tham số id' });
  }

  try {
    const body = await parseJsonBody(req);
    const payload = { ...body, updated_at: new Date().toISOString() };
    delete payload.id;

    const [record] = await updateTable('practice_sets', [{ column: 'id', value: id }], payload);

    return res.status(200).json({
      success: true,
      set: record
    });
  } catch (error) {
    console.error('Practice set update error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể cập nhật bộ đề'
    });
  }
}

