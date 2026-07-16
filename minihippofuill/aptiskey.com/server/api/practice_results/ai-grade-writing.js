import { parseJsonBody } from '../_utils/parseBody.js';
import { verifyUserRequest } from '../_utils/auth.js';
import { selectFrom, updateTable } from '../_utils/supabase.js';
import { hasConfiguredAIProvider } from '../_utils/ai.js';
import { gradeWritingEssay } from '../_utils/aiGrading.js';

// POST /api/practice_results/ai-grade-writing
// Body: { resultId, answerKey } — chấm 1 câu writing trong practice_results
// (module Aptis ôn thi + Lớp Học; metadata.user_answers keyed by part → items).
// Kết quả lưu metadata.ai_writing[answerKey] — chấm 1 lần, xem lại mãi.
function findWritingItem(userAnswers, answerKey) {
  if (!userAnswers || typeof userAnswers !== 'object') return null;
  for (const items of Object.values(userAnswers)) {
    if (!Array.isArray(items)) continue;
    const found = items.find(item => String(item?.key || '') === String(answerKey));
    if (found) return found;
  }
  return null;
}

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
    const answerKey = String(body?.answerKey || '').trim();
    if (!resultId) return res.status(400).json({ error: 'Thiếu resultId' });
    if (!answerKey) return res.status(400).json({ error: 'Thiếu answerKey' });

    const result = await selectFrom('practice_results', {
      filters: [{ column: 'id', value: resultId }],
      single: true
    });
    if (!result) return res.status(404).json({ error: 'Không tìm thấy kết quả' });

    const isAdmin = String(authResult.user?.role || '').toLowerCase() === 'admin';
    if (!isAdmin && result.user_id !== authResult.user.id) {
      return res.status(403).json({ error: 'Bạn không có quyền chấm bài này' });
    }

    const target = findWritingItem(result?.metadata?.user_answers, answerKey);
    if (!target || !String(target.answer || '').trim()) {
      return res.status(400).json({ error: 'Bài writing này trống — không có gì để chấm' });
    }

    const existingAi = result?.metadata?.ai_writing?.[answerKey];
    if (existingAi && !body?.force) {
      return res.status(200).json({ success: true, cached: true, grading: existingAi });
    }

    // Band mục tiêu Aptis: A2-B2 tuỳ metadata.band; fallback nhãn chung.
    const bandRaw = String(result?.metadata?.band || body?.band || '').toUpperCase();
    const targetLabel = /^(A2|B1|B2|C1)$/.test(bandRaw) ? `Aptis ${bandRaw}` : 'Aptis General (A2-B2)';

    const grading = await gradeWritingEssay({
      prompt: target.prompt,
      essay: target.answer,
      taskLabel: `Writing - câu ${answerKey}`,
      targetLabel,
      // Module Aptis (ôn thi + Lớp Học) → rubric British Council CEFR, KHÔNG dùng thang VSTEP.
      examType: 'aptis'
    });

    const metadata = { ...(result.metadata || {}) };
    metadata.ai_writing = { ...(metadata.ai_writing || {}), [answerKey]: grading };
    await updateTable('practice_results', [{ column: 'id', value: resultId }], { metadata });

    return res.status(200).json({ success: true, grading });
  } catch (error) {
    console.error('practice ai-grade-writing error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể chấm AI bài writing',
      details: error?.details || null
    });
  }
}
