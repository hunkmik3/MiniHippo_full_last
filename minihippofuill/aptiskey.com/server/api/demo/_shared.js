// ===================================================================
// Cổng API DEMO cho web bán khoá học (bài học thử Aptis).
// Khác hẳn API nội bộ dành cho học viên:
//   - KHÔNG cần tài khoản/đăng nhập
//   - Trả được MỌI bài học Aptis / bộ đề VSTEP ôn thi, nhưng CHỈ nội dung bài
//     học (xem "RANH GIỚI NỘI DUNG" bên dưới) — không lộ dữ liệu nội bộ
//   - Chặn theo domain (DEMO_ALLOWED_ORIGINS) + API key (DEMO_API_KEY)
//   - CHỈ ĐỌC: không ghi bất cứ thứ gì vào database
//
// Biến môi trường cần cấu hình trên Vercel:
//   DEMO_API_KEY         khoá dev bên trung tâm gắn khi gọi
//   DEMO_ALLOWED_ORIGINS danh sách domain được gọi, cách nhau dấu phẩy
//                        (để trống = chỉ chặn bằng API key)
// ===================================================================

function parseList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

// Cache ngắn hạn trong bộ nhớ của instance serverless. Endpoint catalog được web
// bán khoá gọi mỗi lần có khách vào trang -> không cache thì mỗi lượt xem là 1
// lần đọc DB (Supabase free đã 2 lần bị khoá vì hết băng thông).
// Chỉ cache DỮ LIỆU, và chỉ gọi sau khi demoGuard đã kiểm tra key -> không lộ
// dữ liệu cho request không có key.
const memoStore = new Map();

export async function cached(cacheKey, ttlMs, loader) {
  const now = Date.now();
  const hit = memoStore.get(cacheKey);
  if (hit && hit.expiresAt > now) return hit.value;
  const value = await loader();
  memoStore.set(cacheKey, { value, expiresAt: now + ttlMs });
  return value;
}

// ===================================================================
// RANH GIỚI NỘI DUNG — API trả được chi tiết của MỌI bài học, nhưng chỉ đúng
// những gì catalog liệt kê. Không có ranh giới này, lấy chi tiết theo id tuỳ ý
// sẽ đọc được cả dữ liệu nội bộ cùng bảng:
//   practice_sets còn chứa homework_class (lớp học + lịch buổi), session_content
//   (nội dung buổi học Lớp Học), key_reading/key_listening (module Lớp Học), vstep.
// ===================================================================

// Loại practice_sets là BÀI HỌC Aptis (khớp catalog "học theo bộ đề/câu hỏi").
export const APTIS_SET_TYPES = ['reading', 'listening', 'speaking', 'speaking_cauhoi'];

// Part của bảng lessons là BÀI HỌC Aptis (khớp catalog "học theo câu hỏi" + Writing).
export const APTIS_LESSON_PARTS = [
  '1', '2', '4', '5',
  'listening_1_13', 'listening_14', 'listening_15', 'listening_16_17',
  'writing'
];

// Loại logic giống practice_sets/list: ưu tiên marker trong data, rồi mới tới cột type.
// Nhận cả dòng có cột `logical` (catalog chọn cột nhẹ) lẫn dòng đầy đủ có `data`.
export function logicalSetType(row) {
  const marker = String(row?.logical ?? row?.data?.__practice_type ?? '').trim().toLowerCase();
  return marker || String(row?.type || '').toLowerCase();
}

export function isAptisLessonSet(row) {
  return APTIS_SET_TYPES.includes(logicalSetType(row));
}

export function isAptisLessonPart(part) {
  return APTIS_LESSON_PARTS.includes(String(part ?? ''));
}

// VSTEP: chỉ khu Ôn thi đã xuất bản — đúng những gì học viên đang thấy.
// Bài nháp và khu Học tập (bài giao theo lớp) không đưa ra ngoài.
export function isPublicVstepContent(row) {
  return row?.flow === 'practice' && row?.status === 'published';
}

// Cache chi tiết từng bài: lấy bài "học theo câu hỏi" phải gọi GitHub + chạy
// sandbox, lấy bộ đề thì tốn băng thông Supabase -> giữ 5 phút.
export const CONTENT_TTL_MS = 5 * 60 * 1000;

// So sánh tiêu đề giống UI Mini Hippo: "ĐỀ 2" đứng trước "ĐỀ 10".
export function byTitle(a, b) {
  return String(a?.title || '').localeCompare(String(b?.title || ''), 'vi', {
    numeric: true,
    sensitivity: 'base'
  });
}

function applyCors(req, res) {
  const allowedOrigins = parseList(process.env.DEMO_ALLOWED_ORIGINS);
  const origin = String(req.headers?.origin || '');

  if (allowedOrigins.includes('*')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Demo-Key');
  res.setHeader('Access-Control-Max-Age', '86400');

  return { origin, allowedOrigins };
}

// Trả về { done: true } nghĩa là đã gửi response (preflight/lỗi) → handler dừng.
export function demoGuard(req, res) {
  const { origin, allowedOrigins } = applyCors(req, res);

  // Preflight của trình duyệt.
  if (String(req.method || '').toUpperCase() === 'OPTIONS') {
    res.status(204).end();
    return { done: true };
  }

  if (String(req.method || '').toUpperCase() !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return { done: true };
  }

  // Chặn domain: chỉ áp dụng khi request đến từ trình duyệt (có Origin).
  // Gọi server-to-server không có Origin thì vẫn phải qua API key bên dưới.
  if (
    allowedOrigins.length &&
    !allowedOrigins.includes('*') &&
    origin &&
    !allowedOrigins.includes(origin)
  ) {
    res.status(403).json({ error: 'Domain này không được phép dùng API demo.' });
    return { done: true };
  }

  const expectedKey = String(process.env.DEMO_API_KEY || '').trim();
  if (!expectedKey) {
    res.status(503).json({ error: 'Máy chủ chưa cấu hình DEMO_API_KEY.' });
    return { done: true };
  }

  const providedKey = String(
    req.headers?.['x-demo-key'] || req.query?.key || ''
  ).trim();
  if (providedKey !== expectedKey) {
    res.status(401).json({ error: 'Thiếu hoặc sai API key demo.' });
    return { done: true };
  }

  return { done: false };
}

// Chuẩn hoá kỹ năng của bộ đề Aptis: cột type của DB đã là reading/listening/
// writing/speaking, nhưng vẫn ưu tiên marker logic trong data nếu có.
export function resolveSkill(set) {
  const logical = String(set?.data?.__practice_type || '').toLowerCase();
  if (['reading', 'listening', 'writing', 'speaking'].includes(logical)) {
    return logical;
  }
  return String(set?.type || '').toLowerCase();
}
