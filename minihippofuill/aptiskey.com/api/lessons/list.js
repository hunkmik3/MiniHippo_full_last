import { selectFrom } from '../_utils/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const part = req.query.part;

  if (!part) {
    return res.status(400).json({ error: 'Thiếu tham số part' });
  }

  try {
    const lessons = await selectFrom('lessons', {
      filters: [{ column: 'part', value: part }],
      order: { column: 'created_at', asc: false }
    });

    return res.status(200).json({ lessons });
  } catch (error) {
    console.error('Lessons list error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể tải danh sách bài học'
    });
  }
}

