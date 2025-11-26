import { fetchGithubContent } from '../_utils/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const filePath = req.query.filePath;
  if (!filePath) {
    return res.status(400).json({ error: 'Thiếu tham số filePath' });
  }

  try {
    const data = await fetchGithubContent(filePath);
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

