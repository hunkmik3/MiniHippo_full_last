// GET /api/practice_sets/demo-sets?key=...               → mọi bộ đề Aptis
// GET /api/practice_sets/demo-sets?key=...&skill=reading   → lọc theo kỹ năng
//
// Danh sách PHẲNG (không nhóm). Muốn cả cây nhóm sẵn như menu Mini Hippo thì dùng
// /api/lessons/demo-catalog.
//
// Chỉ metadata, chỉ bộ đề là bài học Aptis (không lẫn lớp học / nội dung buổi học).

import { selectFrom } from '../_utils/supabase.js';
import {
  demoGuard,
  resolveSkill,
  isAptisLessonSet,
  logicalSetType,
  cached,
  byTitle
} from './_shared.js';

export default async function handler(req, res) {
  if (demoGuard(req, res).done) return;

  const skillFilter = String(req.query?.skill || '').trim().toLowerCase();

  try {
    const rows = await cached('aptis-sets', 60 * 1000, () => selectFrom('practice_sets', {
      // Không lấy cột data (chứa nguyên đề) -> chỉ bóc marker loại.
      columns: 'id,title,type,description,duration_minutes,created_at,logical:data->>__practice_type',
      order: { column: 'created_at', asc: false }
    }));

    const sets = (Array.isArray(rows) ? rows : [])
      .filter(isAptisLessonSet)
      .map((set) => ({
        id: set.id,
        title: set.title,
        description: set.description,
        skill: resolveSkill({ type: set.type, data: { __practice_type: set.logical } }),
        type: logicalSetType(set),
        durationMinutes: set.duration_minutes || null,
        detailUrl: `/api/practice_sets/demo-set?id=${set.id}`
      }))
      .filter((set) => !skillFilter || set.skill === skillFilter || set.type === skillFilter)
      .sort(byTitle);

    return res.status(200).json({ sets });
  } catch (error) {
    console.error('demo sets error:', error);
    return res.status(500).json({ error: 'Không tải được danh sách bộ đề.' });
  }
}
