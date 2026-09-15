// GET /api/demo/sets?key=...        → danh sách bộ đề được phép học thử
// GET /api/demo/sets?key=...&skill=reading  → lọc theo kỹ năng
//
// Chỉ trả metadata gọn (id/tên/kỹ năng/thời lượng) để web bán khoá dựng menu
// chọn bài; KHÔNG kèm nội dung đề và KHÔNG kèm đáp án.

import { selectFrom } from '../_utils/supabase.js';
import { demoGuard, demoAllowedSetIds, resolveSkill } from './_shared.js';

export default async function handler(req, res) {
  if (demoGuard(req, res).done) return;

  const allowedIds = demoAllowedSetIds();
  if (!allowedIds.length) {
    return res.status(200).json({ sets: [], note: 'Chưa cấu hình DEMO_SET_IDS.' });
  }

  const skillFilter = String(req.query?.skill || '').trim().toLowerCase();

  try {
    const rows = await selectFrom('practice_sets', {
      order: { column: 'created_at', asc: false }
    });

    const sets = (Array.isArray(rows) ? rows : [])
      .filter((set) => allowedIds.includes(String(set.id)))
      .map((set) => ({
        id: set.id,
        title: set.title,
        description: set.description,
        skill: resolveSkill(set),
        durationMinutes: set.duration_minutes || null
      }))
      .filter((set) => !skillFilter || set.skill === skillFilter);

    return res.status(200).json({ sets });
  } catch (error) {
    console.error('demo sets error:', error);
    return res.status(500).json({ error: 'Không tải được danh sách bài học thử.' });
  }
}
