import { parseJsonBody } from '../_utils/parseBody.js';
import { verifyUserRequest } from '../_utils/auth.js';
import { selectFrom, updateTable } from '../_utils/supabase.js';
import { hasConfiguredAIProvider } from '../_utils/ai.js';
import { transcribeAudio, gradeSpeakingTranscript } from '../_utils/aiGrading.js';

// POST /api/practice_results/ai-grade-speaking
// Body: { resultId, answerKey } — chấm 1 câu speaking trong practice_results
// (module Aptis; metadata.speaking_answers = mảng {key, prompt, recording_url}).
// Flow: Whisper transcribe → AI chấm → lưu metadata.ai_speaking[answerKey].
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

    const speakingAnswers = Array.isArray(result?.metadata?.speaking_answers)
      ? result.metadata.speaking_answers
      : [];
    const target = speakingAnswers.find(item => String(item?.key || '') === answerKey);
    const recordingUrl = target?.recording_url || target?.recordingUrl || '';
    if (!recordingUrl) {
      return res.status(400).json({ error: 'Câu này không có file ghi âm để chấm' });
    }

    const existingAi = result?.metadata?.ai_speaking?.[answerKey];
    if (existingAi && !body?.force) {
      return res.status(200).json({ success: true, cached: true, grading: existingAi });
    }

    const transcript = await transcribeAudio(recordingUrl);
    if (!transcript) {
      return res.status(422).json({ error: 'Không nghe được nội dung trong file ghi âm (transcript trống)' });
    }

    const bandRaw = String(result?.metadata?.band || body?.band || '').toUpperCase();
    const targetLabel = /^(A2|B1|B2|C1)$/.test(bandRaw) ? `Aptis ${bandRaw}` : 'Aptis General (A2-B2)';
    const graded = await gradeSpeakingTranscript({
      transcript,
      prompt: target?.prompt || '',
      partLabel: `Speaking${target?.part ? ` Part ${target.part}` : ''} - câu ${answerKey}`,
      targetLabel,
      // Module Aptis → rubric British Council CEFR.
      examType: 'aptis'
    });
    const grading = { transcript, ...graded };

    const metadata = { ...(result.metadata || {}) };
    metadata.ai_speaking = { ...(metadata.ai_speaking || {}), [answerKey]: grading };
    await updateTable('practice_results', [{ column: 'id', value: resultId }], { metadata });

    return res.status(200).json({ success: true, grading });
  } catch (error) {
    console.error('practice ai-grade-speaking error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể chấm AI bài speaking',
      details: error?.details || null
    });
  }
}
