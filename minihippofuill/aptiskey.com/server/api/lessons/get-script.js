import { fetchGithubContent } from '../_utils/supabase.js';

const GITHUB_SITE_PREFIX = 'minihippofuill/aptiskey.com/';

function buildGithubPathCandidates(filePath) {
  const normalizedPath = String(filePath || '')
    .trim()
    .replace(/^\/+/, '')
    .replace(/\\/g, '/');

  if (!normalizedPath) return [];
  if (normalizedPath.startsWith(GITHUB_SITE_PREFIX)) return [normalizedPath];

  return [
    normalizedPath,
    `${GITHUB_SITE_PREFIX}${normalizedPath}`
  ];
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const filePath = req.query.filePath;
  if (!filePath) {
    return res.status(400).json({ error: 'Thiếu tham số filePath' });
  }

  try {
    let data = null;
    let lastError = null;

    for (const githubPath of buildGithubPathCandidates(filePath)) {
      try {
        data = await fetchGithubContent(githubPath);
        break;
      } catch (error) {
        lastError = error;
      }
    }

    if (!data) {
      throw lastError || new Error('Không tìm thấy file script');
    }

    const content = Buffer.from(data.content, 'base64').toString('utf8');
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    return res.status(200).send(content);
  } catch (error) {
    console.error('Get script error:', error);
    return res.status(500).json({
      error: 'Không thể tải file script',
      details: error.details || error.message
    });
  }
}
