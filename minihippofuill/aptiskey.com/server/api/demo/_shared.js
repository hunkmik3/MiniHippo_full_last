// ===================================================================
// Cổng API DEMO cho web bán khoá học (bài học thử Aptis).
// Khác hẳn API nội bộ dành cho học viên:
//   - KHÔNG cần tài khoản/đăng nhập
//   - CHỈ trả về các bộ đề nằm trong allowlist DEMO_SET_IDS
//     (không lộ toàn bộ ngân hàng đề)
//   - Chặn theo domain (DEMO_ALLOWED_ORIGINS) + API key (DEMO_API_KEY)
//   - CHỈ ĐỌC: không ghi bất cứ thứ gì vào database
//
// Biến môi trường cần cấu hình trên Vercel:
//   DEMO_API_KEY         khoá dev bên trung tâm gắn khi gọi
//   DEMO_SET_IDS         danh sách id bộ đề được phép demo, cách nhau dấu phẩy
//   DEMO_ALLOWED_ORIGINS danh sách domain được gọi, cách nhau dấu phẩy
//                        (để trống = chỉ chặn bằng API key)
// ===================================================================

function parseList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function demoAllowedSetIds() {
  return parseList(process.env.DEMO_SET_IDS);
}

export function isDemoSetAllowed(id) {
  const allowed = demoAllowedSetIds();
  return allowed.includes(String(id || '').trim());
}

// Allowlist riêng cho nhóm "học theo câu hỏi" (bảng lessons).
export function demoAllowedLessonIds() {
  return parseList(process.env.DEMO_LESSON_IDS);
}

export function isDemoLessonAllowed(id) {
  return demoAllowedLessonIds().includes(String(id || '').trim());
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
