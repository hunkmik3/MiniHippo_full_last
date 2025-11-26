import { selectFrom } from '../_utils/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const type = req.query.type;

  try {
    const filters = type ? [{ column: 'type', value: type }] : [];
    const sets = await selectFrom('practice_sets', {
      filters,
      order: { column: 'created_at', asc: false }
    });

    return res.status(200).json({ sets });
  } catch (error) {
    console.error('Practice sets list error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể tải bộ đề'
    });
  }
}

