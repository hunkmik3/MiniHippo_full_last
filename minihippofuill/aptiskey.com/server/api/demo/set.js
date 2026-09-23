// GET /api/practice_sets/demo-set?id=<uuid>&key=...
//   → nội dung đầy đủ của 1 bộ đề Aptis (Reading / Listening / Speaking)
//
// Trả được MỌI bộ đề là bài học Aptis (đúng những gì catalog liệt kê). Dữ liệu
// nội bộ cùng bảng (lớp học, nội dung buổi học, bộ Key của Lớp Học...) trả 404
// như thể không tồn tại.
//
// Trả nguyên data của bộ đề như trang thi đang dùng (gồm cả đáp án).

import { selectFrom } from '../_utils/supabase.js';
import {
  demoGuard,
  resolveSkill,
  isAptisLessonSet,
  cached,
  CONTENT_TTL_MS
} from './_shared.js';

async function loadSet(id) {
  const set = await selectFrom('practice_sets', {
    filters: [{ column: 'id', value: id }],
    single: true
  });
  if (!set || !isAptisLessonSet(set)) return null;
  return set;
}

export default async function handler(req, res) {
  if (demoGuard(req, res).done) return;

  const id = String(req.query?.id || '').trim();
  if (!id) {
    return res.status(400).json({ error: 'Thiếu tham số id' });
  }

  try {
    const set = await cached(`set:${id}`, CONTENT_TTL_MS, () => loadSet(id));
    if (!set) {
      return res.status(404).json({ error: 'Không tìm thấy bộ đề' });
    }

    return res.status(200).json({
      set,
      skill: resolveSkill(set),
      demo: true
    });
  } catch (error) {
    console.error('demo set error:', error);
    return res.status(500).json({ error: 'Không tải được bộ đề.' });
  }
}
