import { parseJsonBody } from '../../_utils/parseBody.js';
import { verifyUserRequest } from '../../_utils/auth.js';
import { selectFrom, updateTable } from '../../_utils/supabase.js';
import { hasConfiguredAIProvider } from '../../_utils/ai.js';
import { gradeWritingEssay } from '../../_utils/aiGrading.js';
import { vstepSchemaErrorResponse } from '../_utils.js';

// POST /api/vstep/ai/grade-writing
// Body: { resultId, partIndex } — chấm 1 bài writing trong kết quả đã nộp.
// Chấm AI kiểu LexiBot (logic chung ở _utils/aiGrading.js). Kết quả lưu vào
// vstep_results.metadata.ai_writing[partIndex] để HV/admin xem lại không tốn lượt chấm.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!hasConfiguredAIProvider()) {
    return res.status(503).json({ error: 'Chưa cấu hình AI provider trên server' });
  }

  const authResult = await verifyUserRequest(req);
  if (!authResult.success) {
    return res.status(authResult.status || 401).json({ error: authResult.error || 'Unauthorized' });
  }

  try {
    const body = await parseJsonBody(req);
    const resultId = body?.resultId;
    const partIndex = Number(body?.partIndex ?? 0);
    if (!resultId) return res.status(400).json({ error: 'Thiếu resultId' });
    if (!Number.isInteger(partIndex) || partIndex < 0 || partIndex > 3) {
      return res.status(400).json({ error: 'partIndex không hợp lệ' });
    }

    const result = await selectFrom('vstep_results', {
      filters: [{ column: 'id', value: resultId }],
      single: true
    });
    if (!result) return res.status(404).json({ error: 'Không tìm thấy kết quả' });

    // Chỉ chủ bài (HV) hoặc admin được chấm.
    const isAdmin = String(authResult.user?.role || '').toLowerCase() === 'admin';
    if (!isAdmin && result.user_id !== authResult.user.id) {
      return res.status(403).json({ error: 'Bạn không có quyền chấm bài này' });
    }

    const writingAnswers = result?.metadata?.writing_answers || [];
    const target = writingAnswers[partIndex];
    if (!target || !String(target.answer || '').trim()) {
      return res.status(400).json({ error: 'Bài writing này trống — không có gì để chấm' });
    }

    // Cache: đã chấm rồi (cùng bài) → trả lại luôn, không đốt thêm API.
    const existingAi = result?.metadata?.ai_writing?.[String(partIndex)];
    if (existingAi && !body?.force) {
      return res.status(200).json({ success: true, cached: true, grading: existingAi });
    }

    const band = String(result?.metadata?.vstep_band || body?.band || 'B1').toUpperCase() === 'B2' ? 'B2' : 'B1';
    const grading = await gradeWritingEssay({
      prompt: target.prompt,
      essay: target.answer,
      taskLabel: target.title || `Writing Part ${partIndex + 1}`,
      targetLabel: `VSTEP ${band} (bậc ${band === 'B2' ? '4' : '3'}/6)`,
      examType: 'vstep'
    });

    // Lưu vào metadata để xem lại (HV history + admin result detail).
    const metadata = { ...(result.metadata || {}) };
    metadata.ai_writing = { ...(metadata.ai_writing || {}), [String(partIndex)]: grading };
    await updateTable('vstep_results', [{ column: 'id', value: resultId }], { metadata });

    return res.status(200).json({ success: true, grading });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep ai grade-writing error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể chấm AI bài writing',
      details: error?.details || null
    });
  }
}
