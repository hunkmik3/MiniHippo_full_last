import { verifyAdminRequest } from '../_utils/auth.js';
import { selectFrom } from '../_utils/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res
      .status(adminCheck.status || 401)
      .json({ error: adminCheck.error || 'Unauthorized' });
  }

  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'Thiếu tham số userId' });
  }

  try {
    const devices = await selectFrom('user_devices', {
      filters: [{ column: 'user_id', value: userId }],
      order: { column: 'last_seen', asc: false }
    });

    return res.status(200).json({ devices });
  } catch (error) {
    console.error('devices list error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể tải danh sách thiết bị'
    });
  }
}






