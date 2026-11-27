// R2 qua S3 API bằng aws4fetch (vài KB, chỉ dùng fetch + Web Crypto) — chạy được
// cả trên Node (máy local) lẫn Cloudflare Workers/Pages (@aws-sdk quá nặng ở đó).
import { AwsClient } from 'aws4fetch';

const REPO_PREFIX = 'minihippofuill/aptiskey.com/';

const CONTENT_TYPES = {
  aac: 'audio/aac',
  csv: 'text/csv',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  m4a: 'audio/mp4',
  m4v: 'video/x-m4v',
  mov: 'video/quicktime',
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
  ogg: 'audio/ogg',
  pdf: 'application/pdf',
  png: 'image/png',
  svg: 'image/svg+xml',
  txt: 'text/plain',
  wav: 'audio/wav',
  webm: 'video/webm',
  webp: 'image/webp',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

let cachedClient = null;
let cachedClientKey = '';

function cleanEnv(value) {
  return String(value || '').trim();
}

function getEndpoint() {
  const endpoint = cleanEnv(process.env.R2_ENDPOINT);
  if (endpoint) return endpoint.replace(/\/+$/, '');

  const accountId = cleanEnv(process.env.R2_ACCOUNT_ID);
  return accountId ? `https://${accountId}.r2.cloudflarestorage.com` : '';
}

export function isR2Configured() {
  return Boolean(
    getEndpoint() &&
      cleanEnv(process.env.R2_ACCESS_KEY_ID) &&
      cleanEnv(process.env.R2_SECRET_ACCESS_KEY) &&
      cleanEnv(process.env.R2_BUCKET) &&
      cleanEnv(process.env.R2_PUBLIC_BASE_URL)
  );
}

export function normalizeR2Key(value) {
  let key = String(value || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\/+/, '');

  if (key.startsWith(REPO_PREFIX)) {
    key = key.slice(REPO_PREFIX.length);
  }

  key = key
    .split('/')
    .filter((segment) => segment && segment !== '.')
    .join('/');

  if (!key || key.includes('..')) {
    throw new Error('Đường dẫn R2 không hợp lệ');
  }

  return key;
}

export function getContentTypeForPath(filePath, fallback = 'application/octet-stream') {
  const normalizedPath = String(filePath || '').toLowerCase();
  const extension = String(filePath || '')
    .split('?')[0]
    .split('#')[0]
    .split('.')
    .pop()
    ?.toLowerCase();

  if (extension === 'webm' && /(^|\/)audio\//.test(normalizedPath)) {
    return 'audio/webm';
  }

  return CONTENT_TYPES[extension] || fallback;
}

export function buildR2PublicUrl(key) {
  const baseUrl = cleanEnv(process.env.R2_PUBLIC_BASE_URL).replace(/\/+$/, '');
  const encodedKey = normalizeR2Key(key)
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `${baseUrl}/${encodedKey}`;
}

function getClient() {
  const accessKeyId = cleanEnv(process.env.R2_ACCESS_KEY_ID);
  const secretAccessKey = cleanEnv(process.env.R2_SECRET_ACCESS_KEY);
  const clientKey = `${accessKeyId}:${secretAccessKey}`;
  if (cachedClient && cachedClientKey === clientKey) return cachedClient;

  cachedClient = new AwsClient({ accessKeyId, secretAccessKey, service: 's3', region: 'auto' });
  cachedClientKey = clientKey;
  return cachedClient;
}

function objectUrl(key) {
  const encodedKey = key.split('/').map((segment) => encodeURIComponent(segment)).join('/');
  return `${getEndpoint()}/${encodeURIComponent(cleanEnv(process.env.R2_BUCKET))}/${encodedKey}`;
}

async function r2Fetch(key, init, action) {
  const response = await getClient().fetch(objectUrl(key), init);
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    const error = new Error(`R2 ${action} lỗi (HTTP ${response.status})${detail ? `: ${detail.slice(0, 200)}` : ''}`);
    error.status = response.status === 404 ? 404 : 502;
    throw error;
  }
  return response;
}

function toBody(content, encoding) {
  if (Buffer.isBuffer(content)) return content;

  if (encoding === 'base64') {
    const raw = String(content || '').replace(/^data:[^;]+;base64,/i, '');
    return Buffer.from(raw, 'base64');
  }

  return Buffer.from(String(content || ''), encoding || 'utf8');
}

export async function putR2Object(
  filePath,
  { content, contentType, encoding = 'utf8' } = {}
) {
  if (!isR2Configured()) {
    throw new Error('Missing R2 environment variables');
  }

  const key = normalizeR2Key(filePath);
  const body = toBody(content, encoding);
  const resolvedContentType = contentType || getContentTypeForPath(key);

  await r2Fetch(key, {
    method: 'PUT',
    body,
    headers: { 'Content-Type': resolvedContentType }
  }, 'PUT');

  return {
    key,
    publicUrl: buildR2PublicUrl(key),
    sizeBytes: body.byteLength,
    contentType: resolvedContentType
  };
}

export async function createR2PutUploadUrl(
  filePath,
  { contentType, expiresIn = 900 } = {}
) {
  if (!isR2Configured()) {
    throw new Error('Missing R2 environment variables');
  }

  const key = normalizeR2Key(filePath);
  const resolvedContentType = contentType || getContentTypeForPath(key);
  // Link PUT ký sẵn (giống getSignedUrl cũ): ký kèm Content-Type nên trình duyệt
  // phải gửi đúng Content-Type này (admin_vstep.js đã gửi ticket.contentType).
  const url = new URL(objectUrl(key));
  url.searchParams.set('X-Amz-Expires', String(expiresIn));
  const signed = await getClient().sign(url.toString(), {
    method: 'PUT',
    headers: { 'Content-Type': resolvedContentType },
    aws: { signQuery: true }
  });
  const uploadUrl = signed.url;

  return {
    key,
    uploadUrl,
    publicUrl: buildR2PublicUrl(key),
    contentType: resolvedContentType,
    expiresIn
  };
}

export async function getR2ObjectBuffer(filePath) {
  if (!isR2Configured()) {
    throw new Error('Missing R2 environment variables');
  }

  const key = normalizeR2Key(filePath);
  const response = await r2Fetch(key, { method: 'GET' }, 'GET');
  return Buffer.from(await response.arrayBuffer());
}

export async function deleteR2Objects(filePaths = []) {
  if (!isR2Configured()) {
    throw new Error('Missing R2 environment variables');
  }

  const keys = filePaths.map((filePath) => normalizeR2Key(filePath)).filter(Boolean);
  if (!keys.length) return { deleted: 0 };

  // Xoá từng object (số lượng nhỏ: các mảnh upload tạm) — không cần DeleteObjects XML.
  await Promise.all(keys.map((key) => r2Fetch(key, { method: 'DELETE' }, 'DELETE')));
  return { deleted: keys.length };
}
