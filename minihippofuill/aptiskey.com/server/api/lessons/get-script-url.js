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

  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!owner || !repo) {
    return res.status(500).json({
      error: 'Thiếu cấu hình GitHub. Vui lòng thiết lập GITHUB_OWNER và GITHUB_REPO.'
    });
  }

  try {
    let lastStatus = 404;
    let lastDetails = '';

    for (const githubPath of buildGithubPathCandidates(filePath)) {
      const scriptUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${githubPath}`;
      const headResponse = await fetch(scriptUrl, { method: 'HEAD' });
      if (headResponse.ok) {
        return res.status(200).json({ scriptUrl });
      }
      lastStatus = headResponse.status;
      lastDetails = await headResponse.text();
    }

    return res.status(lastStatus).json({
      error: 'Không thể truy cập file script trên GitHub',
      details: lastDetails
    });
  } catch (error) {
    console.error('Get script URL error:', error);
    return res.status(500).json({
      error: 'Không thể tạo URL script',
      details: error.message
    });
  }
}

