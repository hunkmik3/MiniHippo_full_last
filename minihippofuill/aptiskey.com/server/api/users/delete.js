import { verifyAdminRequest } from '../_utils/auth.js';
import { callSupabaseAuth, deleteFrom } from '../_utils/supabase.js';
import parseBody from '../_utils/parseBody.js';

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

  let body = {};
  try {
    body = await parseBody(req);
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Invalid JSON payload' });
  }

  const id = req.query.id || body?.id;
  if (!id) {
    return res.status(400).json({ error: 'Thiếu tham số id' });
  }

  if (id === adminCheck.user.id) {
    return res.status(400).json({ error: 'Không thể tự xoá chính mình' });
  }

  try {
    await callSupabaseAuth(
      `admin/users/${id}`,
      {
      method: 'DELETE'
      },
      { useAnonKey: false }
    );
  } catch (error) {
    console.warn('Auth delete warning:', error.message);
  }

  try {
    await deleteFrom('users', [{ column: 'id', value: id }]);
  } catch (error) {
    console.warn('User table delete warning:', error.message);
  }

  return res.status(200).json({ success: true });
}
