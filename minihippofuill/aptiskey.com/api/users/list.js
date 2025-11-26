import { verifyAdminRequest } from '../_utils/auth.js';
import { selectFrom } from '../_utils/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res
      .status(adminCheck.status)
      .json({ error: adminCheck.error || 'Unauthorized' });
  }

  try {
    const users = await selectFrom('users', { order: { column: 'created_at', asc: false } });
    return res.status(200).json({ users });
  } catch (error) {
    console.error('Users list error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể tải người dùng'
    });
  }
}

