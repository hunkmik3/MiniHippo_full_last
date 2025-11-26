import { parseJsonBody } from '../_utils/parseBody.js';
import { verifyAdminRequest } from '../_utils/auth.js';
import { insertInto } from '../_utils/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res
      .status(adminCheck.status)
      .json({ error: adminCheck.error || 'Unauthorized' });
  }

  try {
    const body = await parseJsonBody(req);
    const { title, type = 'reading', description, duration_minutes, data } =
      body || {};

    if (!title || !data) {
      return res.status(400).json({ error: 'Thiếu tiêu đề hoặc nội dung bộ đề' });
    }

    const result = await insertInto('practice_sets', {
        title,
        type,
        description: description || '',
        duration_minutes: duration_minutes || 35,
        data
    });

    // Supabase returns array when using Prefer: return=representation
    const record = Array.isArray(result) ? result[0] : result;

    return res.status(200).json({
      success: true,
      set: record
    });
  } catch (error) {
    console.error('Practice set create error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể lưu bộ đề'
    });
  }
}

