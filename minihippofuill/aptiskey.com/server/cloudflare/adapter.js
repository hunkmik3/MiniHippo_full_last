// ===================================================================
// Chạy các API kiểu Vercel (handler(req, res) như Node) trên Cloudflare Pages
// Functions. Một Function bắt mọi /api/* (functions/api/[[path]].js) gọi vào đây:
//   1. Tìm handler theo đường dẫn — giống cách Vercel định tuyến thư mục api/
//      (api/ask.js, api/<nhóm>/[action].js, api/vstep/[resource]/[action].js).
//   2. Dựng `req` (method, headers chữ thường, query gồm cả tham số đường dẫn,
//      body đã parse như Vercel) và `res` (status/setHeader/json/send/end).
//   3. Đổi kết quả thành Response của Cloudflare.
// Biến môi trường của Pages (context.env) được chép vào process.env vì code
// đọc process.env.* ở khắp nơi.
// ===================================================================
import ask from '../../api/ask.js';
import uploadAudio from '../../api/upload-audio.js';
import uploadSpeakingRecording from '../../api/upload-speaking-recording.js';
import uploadLesson from '../../api/upload-lesson.js';
import visitorCount from '../../api/visitor-count.js';
import authAction from '../../api/auth/[action].js';
import devicesAction from '../../api/devices/[action].js';
import lessonsAction from '../../api/lessons/[action].js';
import practiceResultsAction from '../../api/practice_results/[action].js';
import practiceSetsAction from '../../api/practice_sets/[action].js';
import usersAction from '../../api/users/[action].js';
import vstepAction from '../../api/vstep/[resource]/[action].js';

const SINGLE_FILE_ROUTES = {
  ask,
  'upload-audio': uploadAudio,
  'upload-speaking-recording': uploadSpeakingRecording,
  'upload-lesson': uploadLesson,
  'visitor-count': visitorCount
};

const ACTION_ROUTES = {
  auth: authAction,
  devices: devicesAction,
  lessons: lessonsAction,
  practice_results: practiceResultsAction,
  practice_sets: practiceSetsAction,
  users: usersAction
};

// segments: phần sau /api/ (đã tách theo '/'). Trả { handler, params } hoặc null.
export function resolveRoute(segments) {
  if (segments.length === 1 && SINGLE_FILE_ROUTES[segments[0]]) {
    return { handler: SINGLE_FILE_ROUTES[segments[0]], params: {} };
  }
  if (segments.length === 2 && ACTION_ROUTES[segments[0]]) {
    return { handler: ACTION_ROUTES[segments[0]], params: { action: segments[1] } };
  }
  if (segments.length === 3 && segments[0] === 'vstep') {
    return { handler: vstepAction, params: { resource: segments[1], action: segments[2] } };
  }
  return null;
}

function buildQuery(url, params) {
  const query = {};
  for (const [key, value] of url.searchParams) {
    if (key in query) query[key] = [].concat(query[key], value);
    else query[key] = value;
  }
  return { ...query, ...params };
}

// Giống Vercel: JSON → object, form → object, text → chuỗi, còn lại → Buffer.
async function readBody(request) {
  const method = request.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD') return undefined;
  const type = String(request.headers.get('content-type') || '').toLowerCase();
  if (type.includes('application/json')) {
    const text = await request.text();
    if (!text.trim()) return {};
    try { return JSON.parse(text); } catch { return text; }   // parseBody sẽ báo "Invalid JSON"
  }
  if (type.includes('application/x-www-form-urlencoded')) {
    return Object.fromEntries(new URLSearchParams(await request.text()));
  }
  if (type.startsWith('text/')) return request.text();
  const buffer = await request.arrayBuffer();
  return buffer.byteLength ? Buffer.from(buffer) : undefined;
}

function buildReq(request, url, params, body) {
  const headers = {};
  request.headers.forEach((value, key) => { headers[key.toLowerCase()] = value; });
  const clientIp = headers['cf-connecting-ip'];
  if (clientIp && !headers['x-forwarded-for']) headers['x-forwarded-for'] = clientIp;
  if (clientIp && !headers['x-real-ip']) headers['x-real-ip'] = clientIp;
  return {
    method: request.method.toUpperCase(),
    url: `${url.pathname}${url.search}`,
    headers,
    query: buildQuery(url, params),
    body,
    // Body đã đọc xong — parseBody dùng req.body, không chờ stream.
    readableEnded: true,
    complete: true,
    socket: { remoteAddress: clientIp || '' },
    on() { return this; },
    destroy() {}
  };
}

function buildRes() {
  const state = { status: 200, headers: new Headers(), body: undefined, ended: false };
  const res = {
    statusCode: 200,
    get headersSent() { return state.ended; },
    status(code) { state.status = Number(code) || 200; res.statusCode = state.status; return res; },
    setHeader(name, value) {
      const key = String(name).toLowerCase();
      if (key === 'set-cookie') {
        state.headers.delete('set-cookie');
        [].concat(value).forEach((v) => state.headers.append('set-cookie', String(v)));
      } else {
        state.headers.set(key, Array.isArray(value) ? value.join(', ') : String(value));
      }
      return res;
    },
    getHeader(name) { return state.headers.get(String(name).toLowerCase()) ?? undefined; },
    removeHeader(name) { state.headers.delete(String(name).toLowerCase()); return res; },
    writeHead(code, headers = {}) {
      res.status(code);
      Object.entries(headers || {}).forEach(([k, v]) => res.setHeader(k, v));
      return res;
    },
    json(payload) {
      if (!state.headers.has('content-type')) state.headers.set('content-type', 'application/json; charset=utf-8');
      state.body = JSON.stringify(payload);
      state.ended = true;
      return res;
    },
    send(payload) {
      if (payload !== null && typeof payload === 'object' && !(payload instanceof Uint8Array) && !(payload instanceof ArrayBuffer)) {
        return res.json(payload);
      }
      state.body = payload;
      state.ended = true;
      return res;
    },
    write(chunk) {
      state.body = state.body === undefined ? chunk : Buffer.concat([Buffer.from(state.body), Buffer.from(chunk)]);
      return true;
    },
    end(payload) {
      if (payload !== undefined) state.body = payload;
      state.ended = true;
      return res;
    },
    redirect(statusOrUrl, maybeUrl) {
      const status = typeof statusOrUrl === 'number' ? statusOrUrl : 307;
      const location = typeof statusOrUrl === 'number' ? maybeUrl : statusOrUrl;
      res.status(status).setHeader('location', location);
      return res.end();
    }
  };
  return { res, state };
}

function toResponse(state) {
  const noBody = state.status === 204 || state.status === 304;
  return new Response(noBody ? null : state.body ?? null, { status: state.status, headers: state.headers });
}

export async function handleNodeStyleRequest(context) {
  const { request, env } = context;
  // Biến môi trường Pages → process.env (code cũ đọc process.env.*).
  for (const [key, value] of Object.entries(env || {})) {
    if (typeof value === 'string') process.env[key] = value;
  }
  process.env.MINIHIPPO_RUNTIME = 'cloudflare';

  const url = new URL(request.url);
  const segments = url.pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  const route = resolveRoute(segments);
  if (!route) {
    return new Response(JSON.stringify({ error: 'Không tìm thấy API' }), {
      status: 404,
      headers: { 'content-type': 'application/json; charset=utf-8' }
    });
  }

  const body = await readBody(request);
  const req = buildReq(request, url, route.params, body);
  const { res, state } = buildRes();
  try {
    await route.handler(req, res);
  } catch (error) {
    console.error('API lỗi:', url.pathname, error);
    if (!state.ended) res.status(500).json({ error: error?.message || 'Lỗi máy chủ' });
  }
  if (!state.ended && state.body === undefined) {
    // Handler không trả gì (giống Vercel khi quên res.end) → 204 thay vì treo.
    state.status = state.status === 200 ? 204 : state.status;
  }
  return toResponse(state);
}
