import { verifyAdminRequest } from '../_utils/auth.js';
import { deleteFrom } from '../_utils/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
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
    await deleteFrom('practice_sets', [{ column: 'id', value: id }]);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Practice set delete error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể xoá bộ đề'
    });
  }
}

