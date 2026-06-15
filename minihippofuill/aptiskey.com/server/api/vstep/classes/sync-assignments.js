import { parseJsonBody } from '../../_utils/parseBody.js';
import { verifyAdminRequest } from '../../_utils/auth.js';
import { insertInto, selectFrom } from '../../_utils/supabase.js';
import { syncClassAssignmentsByBand, vstepSchemaErrorResponse } from '../_utils.js';

// POST /api/vstep/classes/sync-assignments?id=<classId>
// Bind các session_number chưa có assignment với content shared pool theo band.
// Dùng khi admin vừa soạn xong content mới và muốn đẩy vào lớp đã tạo trước.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res.status(adminCheck.status || 401).json({ error: adminCheck.error || 'Unauthorized' });
  }

  try {
    const body = await parseJsonBody(req).catch(() => ({}));
    const id = body?.id || req.query.id;
    if (!id) return res.status(400).json({ error: 'Thiếu id lớp VSTEP' });

    const classRecord = await selectFrom('vstep_classes', {
      filters: [{ column: 'id', value: id }],
      single: true
    });
    if (!classRecord) return res.status(404).json({ error: 'Không tìm thấy lớp VSTEP' });

    const summary = await syncClassAssignmentsByBand(
      {
        id: classRecord.id,
        band: classRecord.band,
        sessions: Array.isArray(classRecord.sessions) ? classRecord.sessions : []
      },
      adminCheck.user.id,
      { selectFrom, insertInto }
    );

    return res.status(200).json({ success: true, summary });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep classes sync-assignments error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể đồng bộ assignment',
      details: error?.details || null
    });
  }
}
