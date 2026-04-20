import { parseJsonBody } from './_utils/parseBody.js';
import { putGithubContent } from './_utils/supabase.js';
import { verifyUserRequest } from './_utils/auth.js';

const MAX_AUDIO_BYTES = 12 * 1024 * 1024; // 12MB

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
    contentBase64,
    fileName,
    mimeType,
    speakingSetId,
    speakingPart,
    answerKey
  } = body || {};

  const base64 = stripDataUriPrefix(String(contentBase64 || '').trim());
  if (!base64) {
    return res.status(400).json({ error: 'Thiếu dữ liệu audio (contentBase64).' });
  }

  const approxBytes = Math.floor((base64.length * 3) / 4);
  if (approxBytes <= 0 || approxBytes > MAX_AUDIO_BYTES) {
    return res
      .status(400)
      .json({ error: `File audio vượt giới hạn cho phép (${MAX_AUDIO_BYTES / (1024 * 1024)}MB).` });
  }

  const extension = detectExtension(fileName, mimeType);
  const safeAnswerKey = sanitizeSegment(answerKey, 'answer');
  const safeSetId = sanitizeSegment(speakingSetId, 'set');
  const safePart = sanitizeSegment(speakingPart, 'part');
  const safeUser = sanitizeSegment(
    auth.user?.accountCode || auth.user?.username || auth.user?.id,
    'user'
  );
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
    const result = await putGithubContent(repoPath, {
      content: base64,
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
      mimeType: mimeType || null
    });
  } catch (error) {
    console.error('upload-speaking-recording error:', error);
    return res.status(error.status || 500).json({
      error: 'Không thể lưu file ghi âm.',
      details: error.message || null
    });
  }
}
