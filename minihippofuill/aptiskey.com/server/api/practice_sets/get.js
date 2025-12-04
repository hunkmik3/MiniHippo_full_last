import { selectFrom } from '../_utils/supabase.js';
import { verifyUserRequest } from '../_utils/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authResult = await verifyUserRequest(req);
  if (!authResult.success) {
    return res
      .status(authResult.status || 401)
      .json({ error: authResult.error || 'Unauthorized' });
  }

  const id = req.query.id;
  if (!id) {
    return res.status(400).json({ error: 'Thiếu tham số id' });
  }

  try {
    const set = await selectFrom('practice_sets', {
      filters: [{ column: 'id', value: id }],
      single: true
    });

    if (!set) {
      return res.status(404).json({ error: 'Không tìm thấy bộ đề' });
    }

    return res.status(200).json({ set });
  } catch (error) {
    console.error('Practice set get error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể tải bộ đề'
    });
  }
}

