// GET /api/demo/lessons?key=...            → danh sách bài "học theo câu hỏi"
// GET /api/demo/lessons?key=...&part=1     → lọc theo part
//
// part hợp lệ: '1','2','4','5' (Reading) · 'listening_1_13','listening_14',
// 'listening_15','listening_16_17' (Listening) · 'writing' (Writing).
//
// Chỉ trả các bài nằm trong allowlist DEMO_LESSON_IDS. Không kèm nội dung.

import { selectFrom } from '../_utils/supabase.js';
import { demoGuard, demoAllowedLessonIds } from './_shared.js';

export default async function handler(req, res) {
  if (demoGuard(req, res).done) return;

  const allowedIds = demoAllowedLessonIds();
  if (!allowedIds.length) {
    return res.status(200).json({ lessons: [], note: 'Chưa cấu hình DEMO_LESSON_IDS.' });
  }

  const partFilter = String(req.query?.part || '').trim();

  try {
    const rows = await selectFrom('lessons', {
      order: { column: 'created_at', asc: false }
    });

    const lessons = (Array.isArray(rows) ? rows : [])
      .filter((row) => allowedIds.includes(String(row.id)))
      .filter((row) => !partFilter || String(row.part) === partFilter)
      .map((row) => ({
        id: row.id,
        part: row.part,
        title: row.title,
        topic: row.topic,
        numSets: row.num_sets || null
      }));

    return res.status(200).json({ lessons });
  } catch (error) {
    console.error('demo lessons error:', error);
    return res.status(500).json({ error: 'Không tải được danh sách bài học thử.' });
  }
}
