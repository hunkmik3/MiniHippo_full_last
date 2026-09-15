import { insertInto } from './_utils/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await insertInto('visitor_logs', {
      path: req.headers['x-forwarded-path'] || req.url || '/',
      user_agent: req.headers['user-agent'] || '',
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.warn('visitor-count insert failed:', error.message);
  }

  return res.status(200).json({ success: true });
}

