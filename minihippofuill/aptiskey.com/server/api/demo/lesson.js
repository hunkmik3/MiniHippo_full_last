// GET /api/lessons/demo-lesson?id=<lesson_id>&key=...
//   → nội dung bài "học theo câu hỏi" (Reading/Listening) hoặc bộ đề Writing,
//     ĐÃ ĐƯỢC CHUYỂN SANG JSON
//
// Bài loại này lưu trên GitHub dưới dạng file JavaScript (IIFE khai báo biến
// rồi tự render ra DOM), mỗi loại part một cấu trúc khác nhau. Endpoint này
// chạy file đó trong sandbox và bóc ra dữ liệu thuần để dev bên ngoài dùng
// được như JSON bình thường, không phải tự xử lý định dạng cũ.
//
// Trả được MỌI bài thuộc các part catalog liệt kê. Kết quả cache 5 phút vì mỗi
// lần bóc phải gọi GitHub API (có giới hạn lượt gọi) + chạy sandbox.

import { selectFrom, fetchGithubContent } from '../_utils/supabase.js';
import { demoGuard, isAptisLessonPart, cached, CONTENT_TTL_MS } from './_shared.js';
import { extractLessonData } from '../_utils/lessonData.js';

const GITHUB_SITE_PREFIX = 'minihippofuill/aptiskey.com/';

function buildGithubPathCandidates(filePath) {
  const normalized = String(filePath || '').trim().replace(/^\/+/, '').replace(/\\/g, '/');
  if (!normalized) return [];
  if (normalized.startsWith(GITHUB_SITE_PREFIX)) return [normalized];
  return [normalized, `${GITHUB_SITE_PREFIX}${normalized}`];
}

// Trả { status, body } để cache được cả kết quả lỗi "không tìm thấy" lẫn thành công.
async function loadLesson(id) {
  const lesson = await selectFrom('lessons', {
    filters: [{ column: 'id', value: id }],
    single: true
  });
  if (!lesson || !isAptisLessonPart(lesson.part)) {
    return { status: 404, body: { error: 'Không tìm thấy bài học' } };
  }

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
    // Lỗi tạm thời từ GitHub -> ném ra để KHÔNG bị cache.
    throw new Error('Không tải được nội dung bài học.');
  }

  const extracted = extractLessonData(source);
  if (!extracted.variables.length) {
    return {
      status: 422,
      body: {
        error: 'Không bóc được dữ liệu từ bài học này.',
        ...(extracted.warning ? { detail: extracted.warning } : {})
      }
    };
  }

  return {
    status: 200,
    body: {
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
    }
  };
}

export default async function handler(req, res) {
  if (demoGuard(req, res).done) return;

  const id = String(req.query?.id || '').trim();
  if (!id) return res.status(400).json({ error: 'Thiếu tham số id' });

  try {
    const result = await cached(`lesson:${id}`, CONTENT_TTL_MS, () => loadLesson(id));
    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error('demo lesson error:', error);
    return res.status(502).json({ error: error.message || 'Không tải được bài học.' });
  }
}
