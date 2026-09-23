// GET /api/lessons/demo-lessons?key=...            → mọi bài "học theo câu hỏi" + Writing
// GET /api/lessons/demo-lessons?key=...&part=1     → lọc theo part
//
// part hợp lệ: '1','2','4','5' (Reading) · 'listening_1_13','listening_14',
// 'listening_15','listening_16_17' (Listening) · 'writing' (Writing).
//
// Danh sách PHẲNG (không nhóm). Muốn cả cây nhóm sẵn như menu Mini Hippo thì dùng
// /api/lessons/demo-catalog. Chỉ metadata, không kèm nội dung.

import { selectFrom } from '../_utils/supabase.js';
import { demoGuard, isAptisLessonPart, cached } from './_shared.js';

export default async function handler(req, res) {
  if (demoGuard(req, res).done) return;

  const partFilter = String(req.query?.part || '').trim();

  try {
    const rows = await cached('aptis-lessons', 60 * 1000, () => selectFrom('lessons', {
      columns: 'id,part,title,topic,num_sets,created_at',
      order: { column: 'created_at', asc: false }
    }));

    const lessons = (Array.isArray(rows) ? rows : [])
      .filter((row) => isAptisLessonPart(row.part))
      .filter((row) => !partFilter || String(row.part) === partFilter)
      .map((row) => ({
        id: row.id,
        part: row.part,
        title: row.title,
        topic: row.topic,
        numSets: row.num_sets || null,
        detailUrl: `/api/lessons/demo-lesson?id=${row.id}`
      }));

    return res.status(200).json({ lessons });
  } catch (error) {
    console.error('demo lessons error:', error);
    return res.status(500).json({ error: 'Không tải được danh sách bài học.' });
  }
}
