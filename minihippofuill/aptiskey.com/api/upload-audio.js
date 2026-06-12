import parseBody from './_utils/parseBody.js';
import { buildGithubHeaders, putGithubContent } from './_utils/supabase.js';
import {
  createR2PutUploadUrl,
  deleteR2Objects,
  getR2ObjectBuffer,
  isR2Configured,
  normalizeR2Key,
  putR2Object
} from './_utils/r2.js';
import { verifyAdminRequest, verifyUserRequest } from './_utils/auth.js';

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50MB
const MAX_CHUNK_UPLOAD_BYTES = 3 * 1024 * 1024; // Keep JSON payload below Vercel's 4.5MB cap.
const MAX_CHUNK_COUNT = 100;
const SITE_PREFIX = 'minihippofuill/aptiskey.com/';
const ALLOWED_MEDIA_PREFIXES = [
  `${SITE_PREFIX}audio/`,
  `${SITE_PREFIX}documents/`,
  `${SITE_PREFIX}images/`,
  `${SITE_PREFIX}video/`
];
const MIME_BY_EXT = {
  aac: 'audio/aac',
  csv: 'text/csv',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  m4a: 'audio/mp4',
  m4v: 'video/mp4',
  mov: 'video/quicktime',
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
  pdf: 'application/pdf',
  oga: 'audio/ogg',
  ogg: 'audio/ogg',
  opus: 'audio/ogg',
  png: 'image/png',
  svg: 'image/svg+xml',
  txt: 'text/plain',
  wav: 'audio/wav',
  webm: 'audio/webm',
  webp: 'image/webp',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

function normalizePath(value) {
  return String(value || '')
    .trim()
    .replace(/^\/+/, '')
    .replace(/\\/g, '/');
}

function isSpeakingSubmissionPath(path) {
  return (
    path.startsWith('audio/speaking_submissions/') ||
    path.startsWith('minihippofuill/aptiskey.com/audio/speaking_submissions/')
  );
}

function hasPathTraversal(value) {
  return normalizePath(value)
    .split('/')
    .some((part) => part === '..');
}

function encodePath(path) {
  return path
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
}

function inferContentType(path, fallback) {
  const ext = normalizePath(path).split('.').pop()?.toLowerCase();
  return MIME_BY_EXT[ext] || fallback || 'application/octet-stream';
}

function sanitizeUploadId(value) {
  const text = String(value || '').trim();
  if (!/^[A-Za-z0-9._-]{8,100}$/.test(text)) {
    throw new Error('uploadId không hợp lệ');
  }
  return text;
}

function parseChunkIndex(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : -1;
}

function parseChunkCount(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 && parsed <= MAX_CHUNK_COUNT ? parsed : -1;
}

function tempChunkPath(uploadId, chunkIndex) {
  return `tmp/vstep_upload_chunks/${uploadId}/${String(chunkIndex).padStart(5, '0')}.part`;
}

async function verifyUploadRequest(req, normalizedInputPath) {
  if (isSpeakingSubmissionPath(normalizedInputPath)) {
    return verifyUserRequest(req, { requireDevice: true });
  }

  return verifyAdminRequest(req);
}

function parseGithubMediaUrl(value) {
  if (!value) return null;

  try {
    const url = new URL(value);
    const parts = url.pathname.split('/').filter(Boolean);

    if (url.hostname === 'raw.githubusercontent.com' && parts.length >= 4) {
      return {
        owner: parts[0],
        repo: parts[1],
        branch: parts[2],
        path: decodeURIComponent(parts.slice(3).join('/'))
      };
    }

    if (url.hostname === 'github.com' && parts.length >= 5 && ['blob', 'raw'].includes(parts[2])) {
      return {
        owner: parts[0],
        repo: parts[1],
        branch: parts[3],
        path: decodeURIComponent(parts.slice(4).join('/'))
      };
    }
  } catch (_) {
    return null;
  }

  return null;
}

function resolveGithubMediaTarget(query) {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const defaultBranch = process.env.GITHUB_BRANCH || 'main';

  const urlTarget = parseGithubMediaUrl(query.url);
  if (urlTarget) {
    return {
      owner: urlTarget.owner,
      repo: urlTarget.repo,
      branch: urlTarget.branch || defaultBranch,
      path: normalizePath(urlTarget.path)
    };
  }

  const rawPath = normalizePath(query.path);
  if (!rawPath) return null;

  return {
    owner,
    repo,
    branch: query.branch || defaultBranch,
    path: rawPath.startsWith(SITE_PREFIX) ? rawPath : `${SITE_PREFIX}${rawPath}`
  };
}

async function handleGithubMedia(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  if (!owner || !repo) {
    return res.status(500).json({ error: 'Thiếu cấu hình GitHub media.' });
  }

  const target = resolveGithubMediaTarget(req.query || {});
  if (!target?.path || target.owner !== owner || target.repo !== repo || hasPathTraversal(target.path)) {
    return res.status(400).json({ error: 'Media URL không hợp lệ.' });
  }

  if (!ALLOWED_MEDIA_PREFIXES.some((prefix) => target.path.startsWith(prefix))) {
    return res.status(403).json({ error: 'Media path không được phép.' });
  }

  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(target.branch)}/${encodePath(target.path)}`;
  const baseHeaders = { Accept: '*/*' };
  if (req.headers.range) {
    baseHeaders.Range = req.headers.range;
  }

  // Media sống trên raw.githubusercontent.com. Với repo PUBLIC thì không cần token —
  // và một GITHUB_TOKEN hết hạn hoặc dính khoảng trắng sẽ khiến GitHub trả 404 cho
  // file vốn có thật. Vì vậy fetch KHÔNG token trước, hỏng mới thử lại VỚI token
  // (chỉ cần cho repo private). Như vậy token lỗi không còn làm chết audio.
  const fetchRaw = async (withAuth) => {
    const headers = { ...baseHeaders };
    if (withAuth) {
      try {
        const auth = buildGithubHeaders();
        if (auth.Authorization) headers.Authorization = String(auth.Authorization).trim();
      } catch {
        return null;
      }
    }
    return fetch(rawUrl, { headers });
  };

  try {
    let upstream = await fetchRaw(false);
    if (!upstream || (!upstream.ok && upstream.status !== 206)) {
      const authed = await fetchRaw(true);
      if (authed) upstream = authed;
    }

    if (!upstream || (!upstream.ok && upstream.status !== 206)) {
      const message = upstream ? await upstream.text().catch(() => '') : '';
      return res.status(upstream?.status || 502).send(message || 'Không tải được media.');
    }

    res.setHeader('Content-Type', inferContentType(target.path, upstream.headers.get('content-type')));
    res.setHeader('Cache-Control', 'private, max-age=3600');
    res.setHeader('Accept-Ranges', upstream.headers.get('accept-ranges') || 'bytes');

    ['content-length', 'content-range', 'etag', 'last-modified'].forEach((name) => {
      const value = upstream.headers.get(name);
      if (value) res.setHeader(name, value);
    });

    res.status(upstream.status);
    if (req.method === 'HEAD') return res.end();

    const buffer = Buffer.from(await upstream.arrayBuffer());
    return res.end(buffer);
  } catch (error) {
    console.error('GitHub media proxy error:', error);
    return res.status(500).json({ error: 'Không tải được media từ GitHub.' });
  }
}

async function handleCreateR2Upload(req, res, body) {
  const { filePath, contentType, mimeType, sizeBytes } = body || {};

  if (!filePath || typeof filePath !== 'string') {
    return res.status(400).json({ error: 'filePath phải là chuỗi không rỗng' });
  }

  const parsedSize = Number(sizeBytes);
  if (!Number.isFinite(parsedSize) || parsedSize <= 0) {
    return res.status(400).json({ error: 'sizeBytes không hợp lệ' });
  }

  if (parsedSize > MAX_UPLOAD_BYTES) {
    return res
      .status(400)
      .json({ error: `File upload vượt giới hạn cho phép (${MAX_UPLOAD_BYTES / (1024 * 1024)}MB).` });
  }

  const normalizedInputPath = normalizePath(filePath);
  const authCheck = await verifyUploadRequest(req, normalizedInputPath);
  if (!authCheck.success) {
    return res
      .status(authCheck.status)
      .json({ error: authCheck.error || 'Unauthorized' });
  }

  if (!isR2Configured()) {
    return res.status(501).json({
      error: 'R2 chưa được cấu hình, không thể upload trực tiếp file lớn.',
      code: 'r2_not_configured'
    });
  }

  let r2Key;
  try {
    r2Key = normalizeR2Key(normalizedInputPath);
  } catch (error) {
    return res.status(400).json({ error: error.message || 'filePath không hợp lệ' });
  }

  try {
    const signed = await createR2PutUploadUrl(r2Key, {
      contentType: contentType || mimeType || inferContentType(r2Key)
    });

    return res.status(200).json({
      success: true,
      uploadUrl: signed.uploadUrl,
      rawUrl: signed.publicUrl,
      publicUrl: signed.publicUrl,
      fileUrl: signed.publicUrl,
      filePath: signed.key,
      storage: 'r2',
      contentType: signed.contentType,
      expiresIn: signed.expiresIn
    });
  } catch (error) {
    console.error('Create R2 upload URL error:', error);
    return res.status(error.status || 500).json({
      error: 'Không thể tạo link upload R2.',
      details: error.message || null
    });
  }
}

async function handleUploadR2Chunk(req, res, body) {
  const { filePath, uploadId, chunkIndex, chunkCount, content, sizeBytes } = body || {};

  if (!filePath || typeof filePath !== 'string') {
    return res.status(400).json({ error: 'filePath phải là chuỗi không rỗng' });
  }

  if (typeof content !== 'string' || !content) {
    return res.status(400).json({ error: 'content chunk phải là chuỗi base64 không rỗng' });
  }

  const parsedSize = Number(sizeBytes);
  if (!Number.isFinite(parsedSize) || parsedSize <= 0 || parsedSize > MAX_UPLOAD_BYTES) {
    return res
      .status(400)
      .json({ error: `File upload vượt giới hạn cho phép (${MAX_UPLOAD_BYTES / (1024 * 1024)}MB).` });
  }

  let safeUploadId;
  try {
    safeUploadId = sanitizeUploadId(uploadId);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  const index = parseChunkIndex(chunkIndex);
  const count = parseChunkCount(chunkCount);
  if (index < 0 || count < 1 || index >= count) {
    return res.status(400).json({ error: 'Thông tin chunk không hợp lệ' });
  }

  const approxBytes = Math.floor((content.length * 3) / 4);
  if (approxBytes <= 0 || approxBytes > MAX_CHUNK_UPLOAD_BYTES) {
    return res
      .status(400)
      .json({ error: `Chunk upload vượt giới hạn cho phép (${MAX_CHUNK_UPLOAD_BYTES / (1024 * 1024)}MB).` });
  }

  const normalizedInputPath = normalizePath(filePath);
  const authCheck = await verifyUploadRequest(req, normalizedInputPath);
  if (!authCheck.success) {
    return res
      .status(authCheck.status)
      .json({ error: authCheck.error || 'Unauthorized' });
  }

  if (!isR2Configured()) {
    return res.status(501).json({
      error: 'R2 chưa được cấu hình, không thể upload trực tiếp file lớn.',
      code: 'r2_not_configured'
    });
  }

  try {
    await putR2Object(tempChunkPath(safeUploadId, index), {
      content,
      contentType: 'application/octet-stream',
      encoding: 'base64'
    });

    return res.status(200).json({
      success: true,
      uploadId: safeUploadId,
      chunkIndex: index,
      chunkCount: count
    });
  } catch (error) {
    console.error('Upload R2 chunk error:', error);
    return res.status(error.status || 500).json({
      error: 'Không thể upload chunk lên R2.',
      details: error.message || null
    });
  }
}

async function handleCompleteR2ChunkUpload(req, res, body) {
  const { filePath, uploadId, chunkCount, contentType, mimeType, sizeBytes } = body || {};

  if (!filePath || typeof filePath !== 'string') {
    return res.status(400).json({ error: 'filePath phải là chuỗi không rỗng' });
  }

  const parsedSize = Number(sizeBytes);
  if (!Number.isFinite(parsedSize) || parsedSize <= 0 || parsedSize > MAX_UPLOAD_BYTES) {
    return res
      .status(400)
      .json({ error: `File upload vượt giới hạn cho phép (${MAX_UPLOAD_BYTES / (1024 * 1024)}MB).` });
  }

  let safeUploadId;
  try {
    safeUploadId = sanitizeUploadId(uploadId);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  const count = parseChunkCount(chunkCount);
  if (count < 1) {
    return res.status(400).json({ error: 'chunkCount không hợp lệ' });
  }

  const normalizedInputPath = normalizePath(filePath);
  const authCheck = await verifyUploadRequest(req, normalizedInputPath);
  if (!authCheck.success) {
    return res
      .status(authCheck.status)
      .json({ error: authCheck.error || 'Unauthorized' });
  }

  if (!isR2Configured()) {
    return res.status(501).json({
      error: 'R2 chưa được cấu hình, không thể upload trực tiếp file lớn.',
      code: 'r2_not_configured'
    });
  }

  let r2Key;
  try {
    r2Key = normalizeR2Key(normalizedInputPath);
  } catch (error) {
    return res.status(400).json({ error: error.message || 'filePath không hợp lệ' });
  }

  const chunkPaths = Array.from({ length: count }, (_, index) => tempChunkPath(safeUploadId, index));

  try {
    const buffers = [];
    let totalBytes = 0;
    for (const chunkPath of chunkPaths) {
      const chunk = await getR2ObjectBuffer(chunkPath);
      totalBytes += chunk.byteLength;
      if (totalBytes > MAX_UPLOAD_BYTES) {
        throw new Error(`File upload vượt giới hạn cho phép (${MAX_UPLOAD_BYTES / (1024 * 1024)}MB).`);
      }
      buffers.push(chunk);
    }

    if (totalBytes !== parsedSize) {
      throw new Error('Dung lượng file sau khi ghép chunk không khớp.');
    }

    const uploaded = await putR2Object(r2Key, {
      content: Buffer.concat(buffers, totalBytes),
      contentType: contentType || mimeType || inferContentType(r2Key)
    });

    deleteR2Objects(chunkPaths).catch((cleanupError) => {
      console.warn('Cleanup R2 chunks failed:', cleanupError);
    });

    return res.status(200).json({
      success: true,
      rawUrl: uploaded.publicUrl,
      fileUrl: uploaded.publicUrl,
      filePath: uploaded.key,
      storage: 'r2',
      sizeBytes: uploaded.sizeBytes,
      contentType: uploaded.contentType
    });
  } catch (error) {
    console.error('Complete R2 chunk upload error:', error);
    return res.status(error.status || 500).json({
      error: 'Không thể ghép file upload.',
      details: error.message || null
    });
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET' || req.method === 'HEAD') {
    return handleGithubMedia(req, res);
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body;

  try {
    body = await parseBody(req);
  } catch (error) {
    console.error('Parse body error:', error);
    return res.status(400).json({ error: error.message || 'Invalid JSON payload' });
  }

  if (body?.action === 'create-r2-upload' || body?.action === 'r2-presign') {
    return handleCreateR2Upload(req, res, body);
  }

  if (body?.action === 'upload-r2-chunk') {
    return handleUploadR2Chunk(req, res, body);
  }

  if (body?.action === 'complete-r2-chunk-upload') {
    return handleCompleteR2ChunkUpload(req, res, body);
  }

  const { filePath, content, message } = body || {};

  if (!filePath || !content) {
    return res.status(400).json({ error: 'Thiếu filePath hoặc content' });
  }

  // Validate file path
  if (typeof filePath !== 'string' || filePath.length === 0) {
    return res.status(400).json({ error: 'filePath phải là chuỗi không rỗng' });
  }

  // Validate content (base64)
  if (typeof content !== 'string' || content.length === 0) {
    return res.status(400).json({ error: 'content phải là chuỗi base64 không rỗng' });
  }

  const normalizedInputPath = normalizePath(filePath);
  const authCheck = await verifyUploadRequest(req, normalizedInputPath);
  if (!authCheck.success) {
    return res
      .status(authCheck.status)
      .json({ error: authCheck.error || 'Unauthorized' });
  }

  const approxBytes = Math.floor((content.length * 3) / 4);
  if (approxBytes <= 0 || approxBytes > MAX_UPLOAD_BYTES) {
    return res
      .status(400)
      .json({ error: `File upload vượt giới hạn cho phép (${MAX_UPLOAD_BYTES / (1024 * 1024)}MB).` });
  }

  let r2Key;
  try {
    r2Key = normalizeR2Key(normalizedInputPath);
  } catch (error) {
    return res.status(400).json({ error: error.message || 'filePath không hợp lệ' });
  }

  // Normalize file path - remove leading slashes and ensure proper GitHub format
  let normalizedPath = normalizedInputPath;
  
  // Ensure path starts with minihippofuill/aptiskey.com/ if not already
  if (!normalizedPath.startsWith('minihippofuill/aptiskey.com/')) {
    normalizedPath = `minihippofuill/aptiskey.com/${normalizedPath}`;
  }

  try {
    if (isR2Configured()) {
      console.log('Uploading media to R2:', r2Key);
      const uploaded = await putR2Object(r2Key, {
        content,
        encoding: 'base64'
      });

      return res.status(200).json({
        success: true,
        rawUrl: uploaded.publicUrl,
        fileUrl: uploaded.publicUrl,
        filePath: uploaded.key,
        storage: 'r2',
        sizeBytes: uploaded.sizeBytes,
        contentType: uploaded.contentType
      });
    }

    console.log('Uploading audio to:', normalizedPath);
    const result = await putGithubContent(normalizedPath, {
      content,
      message: message || `Upload audio ${normalizedPath}`,
      encoding: 'base64'
    });

    if (!result || !result.content) {
      throw new Error('GitHub API không trả về dữ liệu hợp lệ');
    }

    const githubContent = result.content;
    // GitHub API returns download_url for raw content
    const rawUrl = githubContent.download_url || githubContent.html_url?.replace('/blob/', '/raw/');

    if (!rawUrl) {
      throw new Error('Không thể lấy URL của file đã upload');
    }

    const proxiedMediaUrl = `/api/upload-audio?path=${encodeURIComponent(normalizedPath)}`;

    return res.status(200).json({
      success: true,
      rawUrl: proxiedMediaUrl,
      githubRawUrl: rawUrl,
      fileUrl: githubContent.html_url,
      filePath: normalizedPath,
      storage: 'github',
      sha: githubContent.sha
    });
  } catch (error) {
    console.error('Upload audio error:', error);
    const errorMessage = error.details || error.message || 'Unknown error';
    return res.status(error.status || 500).json({
      error: 'Không thể upload audio',
      details: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)
    });
  }
}
