import { verifyAdminRequest } from '../_utils/auth.js';
import { deleteFrom } from '../_utils/supabase.js';
import parseBody from '../_utils/parseBody.js';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res
      .status(adminCheck.status)
      .json({ error: adminCheck.error || 'Unauthorized' });
  }

  let idsToDelete = [];
  
  // Try to get from query params first (single ID)
  if (req.query?.id) {
    idsToDelete = [req.query.id];
  } 
  // Then try body (for multiple IDs)
  else {
    try {
      const body = await parseBody(req);
      if (body?.ids && Array.isArray(body.ids)) {
        idsToDelete = body.ids;
      } else if (body?.id) {
        idsToDelete = [body.id];
      } else if (Array.isArray(body)) {
        idsToDelete = body;
      }
    } catch (error) {
      // Body parsing failed, might be empty - that's okay
    }
  }
  
  if (!idsToDelete.length) {
    return res.status(400).json({ error: 'Thiếu tham số id hoặc ids' });
  }

  try {
    // Delete multiple results
    for (const resultId of idsToDelete) {
      await deleteFrom('practice_results', [{ column: 'id', value: resultId }]);
    }
    
    return res.status(200).json({ 
      success: true, 
      deleted: idsToDelete.length 
    });
  } catch (error) {
    console.error('Practice result delete error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể xoá kết quả bài học'
    });
  }
}

