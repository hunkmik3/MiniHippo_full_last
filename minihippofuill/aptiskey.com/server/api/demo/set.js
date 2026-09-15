// GET /api/demo/set?id=<uuid>&key=...  → nội dung đầy đủ của 1 bộ đề học thử
//
// Trả về đúng shape mà trang thi đang dùng ({ set }) để giao diện demo tái dùng
// được nguyên engine của trang thi thật, không phải viết lại UI.
//
// LƯU Ý BẢO MẬT: bài học thử chấm tại chỗ trên trình duyệt nên payload buộc
// phải kèm đáp án — người dùng kỹ thuật có thể xem được trong tab Network.
// Chấp nhận được vì đây là đề demo công khai (nằm trong allowlist DEMO_SET_IDS),
// KHÔNG dùng đề thật của học viên.

import { selectFrom } from '../_utils/supabase.js';
import { demoGuard, isDemoSetAllowed, resolveSkill } from './_shared.js';

export default async function handler(req, res) {
  if (demoGuard(req, res).done) return;

  const id = String(req.query?.id || '').trim();
  if (!id) {
    return res.status(400).json({ error: 'Thiếu tham số id' });
  }

  // Chặn TRƯỚC khi query: id không nằm trong allowlist thì không đọc database.
  if (!isDemoSetAllowed(id)) {
    return res.status(403).json({ error: 'Bộ đề này không mở cho bài học thử.' });
  }

  try {
    const set = await selectFrom('practice_sets', {
      filters: [{ column: 'id', value: id }],
      single: true
    });

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
    return res.status(500).json({ error: 'Không tải được bài học thử.' });
  }
}
