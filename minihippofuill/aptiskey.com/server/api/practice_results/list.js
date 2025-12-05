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

  const { userId, type, limit = 50, mode } = req.query || {};

  try {
    const filters = [];
    if (userId) {
      filters.push({ column: 'user_id', value: userId });
    }
    if (type) {
      filters.push({ column: 'practice_type', value: type });
    }
    if (mode) {
      filters.push({ column: 'practice_mode', value: mode });
    }

    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);

    const results = await selectFrom('practice_results', {
      filters,
      order: { column: 'submitted_at', asc: false },
      limit: parsedLimit
    });

    return res.status(200).json({ results });
  } catch (error) {
    console.error('practice_results list error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể tải kết quả luyện tập'
    });
  }
}






