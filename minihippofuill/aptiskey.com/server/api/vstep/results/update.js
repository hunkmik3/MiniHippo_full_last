import parseBody from '../../_utils/parseBody.js';
import { verifyAdminRequest } from '../../_utils/auth.js';
import { selectFrom, updateTable } from '../../_utils/supabase.js';
import { vstepSchemaErrorResponse } from '../_utils.js';

export default async function handler(req, res) {
  const method = String(req.method || '').toUpperCase();
  if (method !== 'PATCH' && method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res.status(adminCheck.status || 401).json({ error: adminCheck.error || 'Unauthorized' });
  }

  try {
    const body = await parseBody(req);
    const id = body?.id || req.query.id;
    if (!id) return res.status(400).json({ error: 'Thiếu id kết quả VSTEP' });

    const existing = await selectFrom('vstep_results', {
      filters: [{ column: 'id', value: id }],
      single: true
    });
    if (!existing) return res.status(404).json({ error: 'Không tìm thấy kết quả VSTEP' });

    const payload = { updated_at: new Date().toISOString() };
    if (body.totalScore !== undefined) payload.total_score = Number(body.totalScore) || 0;
    if (body.maxScore !== undefined) payload.max_score = Number(body.maxScore) || 0;
    if (body.partScores !== undefined) payload.part_scores = body.partScores || null;
    if (body.durationSeconds !== undefined) payload.duration_seconds = body.durationSeconds === null ? null : Math.max(0, Math.round(Number(body.durationSeconds) || 0));
    if (body.manualScore !== undefined) {
      payload.manual_score = body.manualScore === null || body.manualScore === ''
        ? null
        : Number(body.manualScore) || 0;
      payload.graded_by = adminCheck.user.id;
      payload.graded_at = new Date().toISOString();
    }
    if (body.manualFeedback !== undefined) {
      payload.manual_feedback = body.manualFeedback || null;
      payload.graded_by = adminCheck.user.id;
      payload.graded_at = new Date().toISOString();
    }
    if (body.metadata !== undefined) payload.metadata = body.metadata || null;
    if (body.metadataPatch && typeof body.metadataPatch === 'object') {
      payload.metadata = {
        ...(existing.metadata && typeof existing.metadata === 'object' ? existing.metadata : {}),
        ...body.metadataPatch,
        admin_graded_by: adminCheck.user.id,
        admin_graded_at: new Date().toISOString()
      };
    }

    const result = await updateTable('vstep_results', [{ column: 'id', value: id }], payload);
    const record = Array.isArray(result) ? result[0] : result;
    return res.status(200).json({ success: true, result: record });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep results update error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể cập nhật kết quả VSTEP',
      details: error?.details || null
    });
  }
}
