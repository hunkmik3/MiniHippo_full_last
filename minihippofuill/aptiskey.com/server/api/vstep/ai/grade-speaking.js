import { parseJsonBody } from '../../_utils/parseBody.js';
import { verifyUserRequest } from '../../_utils/auth.js';
import { selectFrom, updateTable } from '../../_utils/supabase.js';
import { hasConfiguredAIProvider } from '../../_utils/ai.js';
import { transcribeAudio, gradeSpeakingTranscript } from '../../_utils/aiGrading.js';
import { vstepSchemaErrorResponse } from '../_utils.js';

// POST /api/vstep/ai/grade-speaking
// Body: { resultId, partKey } — partKey vd 'part1'/'part2'/'part3'.
// Flow: tải file ghi âm → Whisper transcribe → AI chấm transcript (logic chung
// ở _utils/aiGrading.js) → lưu vstep_results.metadata.ai_speaking[partKey].
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
    const partKey = String(body?.partKey || '').trim();
    if (!resultId) return res.status(400).json({ error: 'Thiếu resultId' });
    if (!/^part[1-3]$/.test(partKey)) return res.status(400).json({ error: 'partKey không hợp lệ (part1/part2/part3)' });

    const result = await selectFrom('vstep_results', {
      filters: [{ column: 'id', value: resultId }],
      single: true
    });
    if (!result) return res.status(404).json({ error: 'Không tìm thấy kết quả' });

    const isAdmin = String(authResult.user?.role || '').toLowerCase() === 'admin';
    if (!isAdmin && result.user_id !== authResult.user.id) {
      return res.status(403).json({ error: 'Bạn không có quyền chấm bài này' });
    }

    const speakingAnswers = result?.metadata?.speaking_answers || {};
    const recordingUrl = speakingAnswers?.[partKey]?.recordingUrl || '';
    if (!recordingUrl) {
      return res.status(400).json({ error: 'Part này không có file ghi âm để chấm' });
    }

    // Cache: đã chấm rồi → trả lại, trừ khi force.
    const existingAi = result?.metadata?.ai_speaking?.[partKey];
    if (existingAi && !body?.force) {
      return res.status(200).json({ success: true, cached: true, grading: existingAi });
    }

    // 1. Speech-to-text.
    const transcript = await transcribeAudio(recordingUrl);
    if (!transcript) {
      return res.status(422).json({ error: 'Không nghe được nội dung trong file ghi âm (transcript trống)' });
    }

    // 2. AI chấm transcript.
    const band = String(result?.metadata?.vstep_band || body?.band || 'B1').toUpperCase() === 'B2' ? 'B2' : 'B1';
    const partNumber = Number(partKey.replace('part', ''));
    const promptsArr = Array.isArray(result?.metadata?.speaking_prompts) ? result.metadata.speaking_prompts : [];
    const speakingPrompt = body?.prompt || promptsArr[partNumber - 1] || '';
    const graded = await gradeSpeakingTranscript({
      transcript,
      prompt: speakingPrompt,
      partLabel: `Speaking ${partKey.toUpperCase()}`,
      targetLabel: `VSTEP ${band}`,
      examType: 'vstep'
    });
    const grading = { transcript, ...graded };

    const metadata = { ...(result.metadata || {}) };
    metadata.ai_speaking = { ...(metadata.ai_speaking || {}), [partKey]: grading };
    await updateTable('vstep_results', [{ column: 'id', value: resultId }], { metadata });

    return res.status(200).json({ success: true, grading });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep ai grade-speaking error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể chấm AI bài speaking',
      details: error?.details || null
    });
  }
}
