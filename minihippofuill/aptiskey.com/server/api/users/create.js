import { parseJsonBody } from '../_utils/parseBody.js';
import { verifyAdminRequest } from '../_utils/auth.js';
import { callSupabaseAuth, insertInto } from '../_utils/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res
      .status(adminCheck.status)
      .json({ error: adminCheck.error || 'Unauthorized' });
  }

  try {
    const body = await parseJsonBody(req);
    const { email, password, username, role = 'user', status = 'active' } =
      body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email và mật khẩu là bắt buộc' });
    }

    const authUser = await callSupabaseAuth('admin/users', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: { username: username || email.split('@')[0] }
      })
    });

    const [record] = await insertInto('users', [
      {
        id: authUser.id,
        email,
        username: username || email.split('@')[0],
        role,
        status
      }
    ]);

    return res.status(201).json({
      success: true,
      user: record
    });
  } catch (error) {
    console.error('User create error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể tạo người dùng',
      details: error.details || null
    });
  }
}

