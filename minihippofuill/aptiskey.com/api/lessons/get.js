import { selectFrom } from '../_utils/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const id = req.query.id;
  if (!id) {
    return res.status(400).json({ error: 'Thiếu tham số id' });
  }

  try {
    const lesson = await selectFrom('lessons', {
      filters: [{ column: 'id', value: id }],
      single: true
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Không tìm thấy bài học' });
    }

    return res.status(200).json({ lesson });
  } catch (error) {
    console.error('Lessons get error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể tải bài học'
    });
  }
}

