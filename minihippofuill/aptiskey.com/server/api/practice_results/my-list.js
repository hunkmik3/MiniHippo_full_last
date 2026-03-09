import { verifyUserRequest } from '../_utils/auth.js';
import { selectFrom } from '../_utils/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authResult = await verifyUserRequest(req, { requireDevice: false });
  if (!authResult.success) {
    return res
      .status(authResult.status || 401)
      .json({ error: authResult.error || 'Unauthorized' });
  }

  const { type, mode, limit = 100 } = req.query || {};

  try {
    const filters = [{ column: 'user_id', value: authResult.user.id }];
    if (type) {
      filters.push({ column: 'practice_type', value: type });
    }
    if (mode) {
      filters.push({ column: 'practice_mode', value: mode });
    }

    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 300);

    const results = await selectFrom('practice_results', {
      filters,
      order: { column: 'submitted_at', asc: false },
      limit: parsedLimit
    });

    return res.status(200).json({ results });
  } catch (error) {
    console.error('practice_results my-list error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể tải lịch sử bài học'
    });
  }
}

