import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const REPO_PREFIX = 'minihippofuill/aptiskey.com/';

const CONTENT_TYPES = {
  aac: 'audio/aac',
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
  wav: 'audio/wav',
  webm: 'video/webm',
  webp: 'image/webp'
};

let cachedClient = null;

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
  if (cachedClient) return cachedClient;

  cachedClient = new S3Client({
    endpoint: getEndpoint(),
    region: 'auto',
    credentials: {
      accessKeyId: cleanEnv(process.env.R2_ACCESS_KEY_ID),
      secretAccessKey: cleanEnv(process.env.R2_SECRET_ACCESS_KEY)
    }
  });

  return cachedClient;
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

  await getClient().send(
    new PutObjectCommand({
      Bucket: cleanEnv(process.env.R2_BUCKET),
      Key: key,
      Body: body,
      ContentType: resolvedContentType
    })
  );

  return {
    key,
    publicUrl: buildR2PublicUrl(key),
    sizeBytes: body.byteLength,
    contentType: resolvedContentType
  };
}
