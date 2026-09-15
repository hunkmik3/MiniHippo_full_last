// GET /api/demo/lesson?id=<lesson_id>&key=...
//   → nội dung bài "học theo câu hỏi" ĐÃ ĐƯỢC CHUYỂN SANG JSON
//
// Bài loại này lưu trên GitHub dưới dạng file JavaScript (IIFE khai báo biến
// rồi tự render ra DOM), mỗi loại part một cấu trúc khác nhau. Endpoint này
// chạy file đó trong sandbox và bóc ra dữ liệu thuần để dev bên ngoài dùng
// được như JSON bình thường, không phải tự xử lý định dạng cũ.

import { selectFrom, fetchGithubContent } from '../_utils/supabase.js';
import { demoGuard, isDemoLessonAllowed } from './_shared.js';
import { extractLessonData } from '../_utils/lessonData.js';

const GITHUB_SITE_PREFIX = 'minihippofuill/aptiskey.com/';

function buildGithubPathCandidates(filePath) {
  const normalized = String(filePath || '').trim().replace(/^\/+/, '').replace(/\\/g, '/');
  if (!normalized) return [];
  if (normalized.startsWith(GITHUB_SITE_PREFIX)) return [normalized];
  return [normalized, `${GITHUB_SITE_PREFIX}${normalized}`];
}

export default async function handler(req, res) {
  if (demoGuard(req, res).done) return;

  const id = String(req.query?.id || '').trim();
  if (!id) return res.status(400).json({ error: 'Thiếu tham số id' });

  // Chặn trước khi đọc database.
  if (!isDemoLessonAllowed(id)) {
    return res.status(403).json({ error: 'Bài học này không mở cho bài học thử.' });
  }

  try {
    const lesson = await selectFrom('lessons', {
      filters: [{ column: 'id', value: id }],
      single: true
    });
    if (!lesson) return res.status(404).json({ error: 'Không tìm thấy bài học' });

    // fetchGithubContent trả về JSON của GitHub API ({content: base64}),
    // không phải nội dung file -> phải giải mã base64 mới có mã nguồn.
    let source = null;
    let lastError = null;
    for (const path of buildGithubPathCandidates(lesson.file_path)) {
      try {
        const payload = await fetchGithubContent(path);
        if (payload && payload.content) {
          source = Buffer.from(payload.content, 'base64').toString('utf8');
          break;
        }
      } catch (error) {
        lastError = error;
      }
    }
    if (!source) {
      console.error('demo lesson: không tải được file', lesson.file_path, lastError);
      return res.status(502).json({ error: 'Không tải được nội dung bài học.' });
    }

    const extracted = extractLessonData(source);
    if (!extracted.variables.length) {
      return res.status(422).json({
        error: 'Không bóc được dữ liệu từ bài học này.',
        ...(extracted.warning ? { detail: extracted.warning } : {})
      });
    }

    return res.status(200).json({
      lesson: {
        id: lesson.id,
        part: lesson.part,
        title: lesson.title,
        topic: lesson.topic,
        numSets: lesson.num_sets || null
      },
      data: extracted.data,
      variables: extracted.variables,
      demo: true
    });
  } catch (error) {
    console.error('demo lesson error:', error);
    return res.status(500).json({ error: 'Không tải được bài học thử.' });
  }
}
