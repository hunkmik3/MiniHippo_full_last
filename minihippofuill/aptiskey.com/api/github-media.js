import { buildGithubHeaders } from './_utils/supabase.js';

const SITE_PREFIX = 'minihippofuill/aptiskey.com/';
const ALLOWED_PREFIXES = [
  `${SITE_PREFIX}audio/`,
  `${SITE_PREFIX}images/`,
  `${SITE_PREFIX}video/`
];

const MIME_BY_EXT = {
  mp3: 'audio/mpeg',
  m4a: 'audio/mp4',
  aac: 'audio/aac',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  oga: 'audio/ogg',
  opus: 'audio/ogg',
  webm: 'audio/webm',
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  m4v: 'video/mp4',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml'
};

function normalizePath(value) {
  return String(value || '')
    .trim()
    .replace(/^\/+/, '')
    .replace(/\\/g, '/');
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

function resolveRequestTarget(query) {
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

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  if (!owner || !repo) {
    return res.status(500).json({ error: 'Thiếu cấu hình GitHub media.' });
  }

  const target = resolveRequestTarget(req.query || {});
  if (!target?.path || target.owner !== owner || target.repo !== repo || hasPathTraversal(target.path)) {
    return res.status(400).json({ error: 'Media URL không hợp lệ.' });
  }

  if (!ALLOWED_PREFIXES.some((prefix) => target.path.startsWith(prefix))) {
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

    const contentType = inferContentType(target.path, upstream.headers.get('content-type'));
    res.setHeader('Content-Type', contentType);
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
