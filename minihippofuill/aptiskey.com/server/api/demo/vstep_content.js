// GET /api/vstep/demo/content?id=<content_id>&key=...
//   → nội dung đầy đủ 1 bộ đề VSTEP (câu hỏi + đáp án) cho bài học thử
//
// Trả được MỌI bộ đề khu Ôn thi đã xuất bản (đúng những gì catalog liệt kê). Bài
// nháp và khu Học tập (bài giao theo lớp) trả 404 như thể không tồn tại.
// Kết quả cache 5 phút (bộ tổng hợp phải đọc thêm 4 bộ con).
//
// Bộ đề tổng hợp (data.combined_refs) chỉ chứa tham chiếu tới 4 bộ theo kỹ năng;
// endpoint này gộp sẵn 4 khối kỹ năng vào data giống /api/vstep/contents/get, để
// bên ngoài nhận về 1 đề hoàn chỉnh.

import { selectFrom } from '../_utils/supabase.js';
import { demoGuard, isPublicVstepContent, cached, CONTENT_TTL_MS } from './_shared.js';

const SKILLS = ['listening', 'reading', 'writing', 'speaking'];

async function mergeCombined(content) {
  const refs = content?.data?.combined_refs;
  if (!refs || typeof refs !== 'object') return content;

  content.data.durations = content.data.durations || {};
  // Mỗi bộ tham chiếu chỉ lấy ĐÚNG khối kỹ năng cần dùng (+ thời lượng), không kéo
  // nguyên cột data của cả 4 bộ -> đỡ băng thông.
  await Promise.all(SKILLS.map(async (skill) => {
    const refId = refs[skill];
    if (!refId) return;
    const src = await selectFrom('vstep_contents', {
      filters: [{ column: 'id', value: refId }],
      columns: `block:data->${skill},duration:data->durations->${skill}`,
      single: true
    });
    if (src && src.block) {
      content.data[skill] = src.block;
      if (src.duration != null) content.data.durations[skill] = src.duration;
    }
  }));
  return content;
}

async function loadContent(id) {
  const content = await selectFrom('vstep_contents', {
    filters: [{ column: 'id', value: id }],
    columns: 'id,title,description,duration_minutes,band,session_number,flow,status,content_kind,data',
    single: true
  });
  if (!content || !isPublicVstepContent(content)) return null;
  await mergeCombined(content);
  return content;
}

export default async function handler(req, res) {
  if (demoGuard(req, res).done) return;

  const id = String(req.query?.id || '').trim();
  if (!id) return res.status(400).json({ error: 'Thiếu tham số id' });

  try {
    const content = await cached(`vstep:${id}`, CONTENT_TTL_MS, () => loadContent(id));
    if (!content) return res.status(404).json({ error: 'Không tìm thấy bộ đề VSTEP' });

    return res.status(200).json({ content, demo: true });
  } catch (error) {
    console.error('demo vstep content error:', error);
    return res.status(500).json({ error: 'Không tải được bộ đề VSTEP.' });
  }
}
