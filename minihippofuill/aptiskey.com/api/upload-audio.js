import parseBody from './_utils/parseBody.js';
import { buildGithubHeaders, putGithubContent } from './_utils/supabase.js';
import { isR2Configured, normalizeR2Key, putR2Object } from './_utils/r2.js';
import { verifyAdminRequest, verifyUserRequest } from './_utils/auth.js';

const MAX_AUDIO_BYTES = 12 * 1024 * 1024; // 12MB
const SITE_PREFIX = 'minihippofuill/aptiskey.com/';
const ALLOWED_MEDIA_PREFIXES = [
  `${SITE_PREFIX}audio/`,
  `${SITE_PREFIX}images/`,
  `${SITE_PREFIX}video/`
];
const MIME_BY_EXT = {
  aac: 'audio/aac',
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  m4a: 'audio/mp4',
  m4v: 'video/mp4',
  mov: 'video/quicktime',
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
  oga: 'audio/ogg',
  ogg: 'audio/ogg',
  opus: 'audio/ogg',
  png: 'image/png',
  svg: 'image/svg+xml',
  wav: 'audio/wav',
  webm: 'audio/webm',
  webp: 'image/webp'
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
  const headers = {
    ...buildGithubHeaders(),
    Accept: '*/*'
  };
  if (req.headers.range) {
    headers.Range = req.headers.range;
  }

  try {
    const upstream = await fetch(rawUrl, { headers });

    if (!upstream.ok && upstream.status !== 206) {
      const message = await upstream.text().catch(() => '');
      return res.status(upstream.status).send(message || 'Không tải được media.');
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
  const speakingSubmissionUpload = isSpeakingSubmissionPath(normalizedInputPath);

  if (speakingSubmissionUpload) {
    const userCheck = await verifyUserRequest(req, { requireDevice: true });
    if (!userCheck.success) {
      return res
        .status(userCheck.status)
        .json({ error: userCheck.error || 'Unauthorized' });
    }
  } else {
    const adminCheck = await verifyAdminRequest(req);
    if (!adminCheck.success) {
      return res
        .status(adminCheck.status)
        .json({ error: adminCheck.error || 'Unauthorized' });
    }
  }

  const approxBytes = Math.floor((content.length * 3) / 4);
  if (approxBytes <= 0 || approxBytes > MAX_AUDIO_BYTES) {
    return res
      .status(400)
      .json({ error: `File audio vượt giới hạn cho phép (${MAX_AUDIO_BYTES / (1024 * 1024)}MB).` });
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

    const proxiedMediaUrl = `/api/github-media?path=${encodeURIComponent(normalizedPath)}`;

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
