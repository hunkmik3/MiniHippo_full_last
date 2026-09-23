// GET /api/lessons/demo-lesson?id=<lesson_id>&key=...
//   → nội dung bài "học theo câu hỏi" (Reading/Listening) hoặc bộ đề Writing,
//     ĐÃ ĐƯỢC CHUYỂN SANG JSON
//
// GET /api/lessons/demo-lesson?id=<lesson_id>&format=source&key=...
//   → MÃ NGUỒN GỐC của bài (file JavaScript trang học đang chạy). Dùng cho bộ
//     giao diện thật demo_export/: trang câu hỏi chạy đúng file bài như trên
//     Mini Hippo nên hiển thị giống hệt.
//
// Bài loại này lưu trên GitHub dưới dạng file JavaScript (IIFE khai báo biến
// rồi tự render ra DOM), mỗi loại part một cấu trúc khác nhau. Định dạng JSON
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

// URL raw GitHub của file bài — giống /api/lessons/get-script-url. Trang Listening
// dùng URL này để đổi đường dẫn audio tương đối sang URL đầy đủ.
function rawGithubUrl(githubPath) {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  if (!owner || !repo) return '';
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${githubPath}`;
}

function lessonMeta(lesson) {
  return {
    id: lesson.id,
    part: lesson.part,
    title: lesson.title,
    topic: lesson.topic,
    numSets: lesson.num_sets || null
  };
}

// Mã nguồn bài (dùng chung cho cả 2 định dạng). null = không có bài / không thuộc
// phạm vi Aptis. Lỗi tạm thời từ GitHub -> ném ra để KHÔNG bị cache.
async function loadLessonSource(id) {
  const lesson = await selectFrom('lessons', {
    filters: [{ column: 'id', value: id }],
    single: true
  });
  if (!lesson || !isAptisLessonPart(lesson.part)) return null;

  // fetchGithubContent trả về JSON của GitHub API ({content: base64}),
  // không phải nội dung file -> phải giải mã base64 mới có mã nguồn.
  let lastError = null;
  for (const githubPath of buildGithubPathCandidates(lesson.file_path)) {
    try {
      const payload = await fetchGithubContent(githubPath);
      if (payload && payload.content) {
        return {
          lesson,
          githubPath,
          source: Buffer.from(payload.content, 'base64').toString('utf8')
        };
      }
    } catch (error) {
      lastError = error;
    }
  }
  console.error('demo lesson: không tải được file', lesson.file_path, lastError);
  throw new Error('Không tải được nội dung bài học.');
}

const NOT_FOUND = { status: 404, body: { error: 'Không tìm thấy bài học' } };

// Trả { status, body } để cache được cả kết quả lỗi "không tìm thấy" lẫn thành công.
async function buildJson(id) {
  const loaded = await cached(`lesson-src:${id}`, CONTENT_TTL_MS, () => loadLessonSource(id));
  if (!loaded) return NOT_FOUND;

  const extracted = extractLessonData(loaded.source);
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
      lesson: lessonMeta(loaded.lesson),
      data: extracted.data,
      variables: extracted.variables,
      demo: true
    }
  };
}

async function buildSource(id) {
  const loaded = await cached(`lesson-src:${id}`, CONTENT_TTL_MS, () => loadLessonSource(id));
  if (!loaded) return NOT_FOUND;
  return {
    status: 200,
    body: {
      // file_path: trang câu hỏi dùng làm khoá để lấy lại mã nguồn ở bước sau.
      lesson: { ...lessonMeta(loaded.lesson), num_sets: loaded.lesson.num_sets || null, file_path: loaded.lesson.file_path },
      source: loaded.source,
      scriptUrl: rawGithubUrl(loaded.githubPath),
      demo: true
    }
  };
}

export default async function handler(req, res) {
  if (demoGuard(req, res).done) return;

  const id = String(req.query?.id || '').trim();
  if (!id) return res.status(400).json({ error: 'Thiếu tham số id' });
  const format = String(req.query?.format || '').trim().toLowerCase();

  try {
    const result = format === 'source'
      ? await buildSource(id)
      : await cached(`lesson:${id}`, CONTENT_TTL_MS, () => buildJson(id));
    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error('demo lesson error:', error);
    return res.status(502).json({ error: error.message || 'Không tải được bài học.' });
  }
}
