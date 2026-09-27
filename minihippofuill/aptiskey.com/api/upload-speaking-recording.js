import { parseJsonBody } from './_utils/parseBody.js';
import { putGithubContent } from './_utils/supabase.js';
import { deleteR2Objects, getR2ObjectBuffer, isR2Configured, putR2Object } from './_utils/r2.js';
import { verifyUserRequest } from './_utils/auth.js';

const MAX_AUDIO_BYTES = 12 * 1024 * 1024; // 12MB
// Vercel chặn request > 4.5MB, base64 phình ~33% → bản ghi dài (vd VSTEP Part 3,
// 4 phút) phải gửi theo từng mảnh: action=chunk (mỗi mảnh ≤ 3MB) rồi action=complete.
const MAX_CHUNK_BYTES = 3 * 1024 * 1024;
const MAX_CHUNK_COUNT = 20;

function sanitizeSegment(value, fallback = 'unknown') {
  const text = String(value || '')
    .trim()
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return text || fallback;
}

function stripDataUriPrefix(value) {
  if (typeof value !== 'string') return '';
  const match = value.match(/^data:audio\/[a-z0-9.+-]+;base64,(.+)$/i);
  return match ? match[1] : value;
}

function detectExtension(fileName, mimeType) {
  const fromName = String(fileName || '').toLowerCase().trim();
  if (fromName.endsWith('.mp3')) return 'mp3';
  if (fromName.endsWith('.ogg')) return 'ogg';
  if (fromName.endsWith('.wav')) return 'wav';
  if (fromName.endsWith('.m4a')) return 'm4a';
  if (fromName.endsWith('.webm')) return 'webm';

  const normalizedMime = String(mimeType || '').toLowerCase();
  if (normalizedMime.includes('audio/mpeg')) return 'mp3';
  if (normalizedMime.includes('audio/ogg')) return 'ogg';
  if (normalizedMime.includes('audio/wav')) return 'wav';
  if (normalizedMime.includes('audio/mp4') || normalizedMime.includes('audio/x-m4a')) return 'm4a';
  return 'webm';
}

// Mảnh tạm tách theo từng học viên: không ai ghép được mảnh của người khác.
function chunkKey(userSegment, uploadId, index) {
  return `tmp/speaking_upload_chunks/${userSegment}/${uploadId}/${String(index).padStart(3, '0')}.part`;
}

function parseUploadId(value) {
  const text = String(value || '').trim();
  return /^[A-Za-z0-9._-]{8,100}$/.test(text) ? text : '';
}

function parseInteger(value, min, max) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : null;
}

function normalizeRepoPath(relativePath) {
  let path = String(relativePath || '')
    .trim()
    .replace(/^\/+/, '')
    .replace(/\\/g, '/');
  if (!path.startsWith('minihippofuill/aptiskey.com/')) {
    path = `minihippofuill/aptiskey.com/${path}`;
  }
  return path;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await verifyUserRequest(req, { requireDevice: true });
  if (!auth.success) {
    return res.status(auth.status || 401).json({ error: auth.error || 'Unauthorized' });
  }

  let body = {};
  try {
    body = await parseJsonBody(req);
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Invalid JSON payload' });
  }

  const {
    action,
    contentBase64,
    fileName,
    mimeType,
    speakingSetId,
    speakingPart,
    answerKey
  } = body || {};

  const safeUser = sanitizeSegment(
    auth.user?.accountCode || auth.user?.username || auth.user?.id,
    'user'
  );
  const chunkOwner = sanitizeSegment(auth.user?.id, safeUser);

  // ── Upload theo mảnh: lưu từng mảnh vào R2 (thư mục tạm của học viên) ──
  if (action === 'chunk') {
    const uploadId = parseUploadId(body.uploadId);
    const chunkCount = parseInteger(body.chunkCount, 1, MAX_CHUNK_COUNT);
    const chunkIndex = chunkCount ? parseInteger(body.chunkIndex, 0, chunkCount - 1) : null;
    const chunkBase64 = stripDataUriPrefix(String(contentBase64 || '').trim());
    const chunkBytes = Math.floor((chunkBase64.length * 3) / 4);
    if (!uploadId || chunkCount === null || chunkIndex === null || chunkBytes <= 0 || chunkBytes > MAX_CHUNK_BYTES) {
      return res.status(400).json({ error: 'Thông tin mảnh ghi âm không hợp lệ.' });
    }
    if (!isR2Configured()) {
      return res.status(501).json({ error: 'Máy chủ chưa cấu hình R2, không nhận được file ghi âm lớn.' });
    }
    try {
      await putR2Object(chunkKey(chunkOwner, uploadId, chunkIndex), {
        content: chunkBase64,
        contentType: 'application/octet-stream',
        encoding: 'base64'
      });
      return res.status(200).json({ success: true, uploadId, chunkIndex, chunkCount });
    } catch (error) {
      console.error('upload-speaking-recording chunk error:', error);
      return res.status(error.status || 500).json({ error: 'Không thể lưu mảnh file ghi âm.', details: error.message || null });
    }
  }

  let audioContent = null; // base64 (gửi 1 lần) hoặc Buffer (ghép từ các mảnh)
  let approxBytes = 0;
  let chunkKeys = [];

  if (action === 'complete') {
    const uploadId = parseUploadId(body.uploadId);
    const chunkCount = parseInteger(body.chunkCount, 1, MAX_CHUNK_COUNT);
    const sizeBytes = parseInteger(body.sizeBytes, 1, MAX_AUDIO_BYTES);
    if (!uploadId || chunkCount === null || sizeBytes === null) {
      return res.status(400).json({ error: 'Thông tin ghép file ghi âm không hợp lệ.' });
    }
    if (!isR2Configured()) {
      return res.status(501).json({ error: 'Máy chủ chưa cấu hình R2, không nhận được file ghi âm lớn.' });
    }
    chunkKeys = Array.from({ length: chunkCount }, (_, index) => chunkKey(chunkOwner, uploadId, index));
    try {
      const buffers = [];
      for (const key of chunkKeys) buffers.push(await getR2ObjectBuffer(key));
      audioContent = Buffer.concat(buffers);
    } catch (error) {
      console.error('upload-speaking-recording complete read error:', error);
      return res.status(400).json({ error: 'Thiếu mảnh file ghi âm, vui lòng thử lại.', details: error.message || null });
    }
    if (audioContent.length !== sizeBytes) {
      return res.status(400).json({ error: 'Dung lượng file ghi âm sau khi ghép không khớp, vui lòng thử lại.' });
    }
    approxBytes = audioContent.length;
  } else {
    const base64 = stripDataUriPrefix(String(contentBase64 || '').trim());
    if (!base64) {
      return res.status(400).json({ error: 'Thiếu dữ liệu audio (contentBase64).' });
    }
    approxBytes = Math.floor((base64.length * 3) / 4);
    if (approxBytes <= 0 || approxBytes > MAX_AUDIO_BYTES) {
      return res
        .status(400)
        .json({ error: `File audio vượt giới hạn cho phép (${MAX_AUDIO_BYTES / (1024 * 1024)}MB).` });
    }
    audioContent = base64;
  }

  const extension = detectExtension(fileName, mimeType);
  const safeAnswerKey = sanitizeSegment(answerKey, 'answer');
  const safeSetId = sanitizeSegment(speakingSetId, 'set');
  const safePart = sanitizeSegment(speakingPart, 'part');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dateFolder = stamp.slice(0, 10);

  const relativePath = [
    'audio',
    'speaking_submissions',
    dateFolder,
    safeUser,
    `${safeSetId}_${safePart}_${safeAnswerKey}_${stamp}.${extension}`
  ].join('/');

  const repoPath = normalizeRepoPath(relativePath);

  try {
    if (isR2Configured()) {
      const uploaded = await putR2Object(relativePath, Buffer.isBuffer(audioContent)
        ? { content: audioContent, contentType: mimeType || undefined }
        : { content: audioContent, contentType: mimeType || undefined, encoding: 'base64' });

      if (chunkKeys.length) {
        deleteR2Objects(chunkKeys).catch((cleanupError) => {
          console.warn('Cleanup speaking chunks failed:', cleanupError);
        });
      }

      return res.status(200).json({
        success: true,
        rawUrl: uploaded.publicUrl,
        fileUrl: uploaded.publicUrl,
        filePath: uploaded.key,
        sizeBytes: uploaded.sizeBytes,
        mimeType: mimeType || uploaded.contentType || null,
        storage: 'r2'
      });
    }

    const result = await putGithubContent(repoPath, {
      content: Buffer.isBuffer(audioContent) ? audioContent.toString('base64') : audioContent,
      message: `Upload speaking recording ${safeUser} ${safeSetId} ${safeAnswerKey}`,
      encoding: 'base64'
    });

    const githubContent = result && result.content ? result.content : null;
    const rawUrl =
      githubContent?.download_url ||
      githubContent?.html_url?.replace('/blob/', '/raw/') ||
      '';

    if (!rawUrl) {
      throw new Error('Không thể lấy URL của file ghi âm sau khi upload.');
    }

    return res.status(200).json({
      success: true,
      rawUrl,
      fileUrl: githubContent?.html_url || null,
      filePath: relativePath,
      sizeBytes: approxBytes,
      mimeType: mimeType || null,
      storage: 'github'
    });
  } catch (error) {
    console.error('upload-speaking-recording error:', error);
    return res.status(error.status || 500).json({
      error: 'Không thể lưu file ghi âm.',
      details: error.message || null
    });
  }
}
