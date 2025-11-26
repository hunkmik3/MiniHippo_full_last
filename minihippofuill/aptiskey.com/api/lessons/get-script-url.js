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

  const normalizedPath = filePath.replace(/^\/+/, '');
  const scriptUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${normalizedPath}`;

  try {
    const headResponse = await fetch(scriptUrl, { method: 'HEAD' });
    if (!headResponse.ok) {
      return res.status(headResponse.status).json({
        error: 'Không thể truy cập file script trên GitHub',
        details: await headResponse.text()
      });
    }

    return res.status(200).json({ scriptUrl });
  } catch (error) {
    console.error('Get script URL error:', error);
    return res.status(500).json({
      error: 'Không thể tạo URL script',
      details: error.message
    });
  }
}


