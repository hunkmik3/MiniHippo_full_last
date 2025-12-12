import parseBody from '../_utils/parseBody.js';
import { insertInto } from '../_utils/supabase.js';
import { verifyUserRequest } from '../_utils/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authResult = await verifyUserRequest(req, { requireDevice: true });
  if (!authResult.success) {
    return res
      .status(authResult.status || 401)
      .json({ error: authResult.error || 'Unauthorized' });
  }

  let body;
  try {
    body = await parseBody(req);
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Invalid JSON payload' });
  }

  const {
    practiceType,
    mode = 'set',
    setId,
    setTitle,
    totalScore,
    maxScore,
    durationSeconds,
    partScores,
    metadata
  } = body || {};

  if (!practiceType) {
    return res.status(400).json({ error: 'Thiếu loại bài luyện tập' });
  }

  const numericTotal = Number(totalScore) || 0;
  const numericMax = Number(maxScore) || 0;
  const numericDuration =
    typeof durationSeconds === 'number' && durationSeconds >= 0
      ? Math.round(durationSeconds)
      : null;

  try {
    const [record] = await insertInto('practice_results', [
      {
        user_id: authResult.user.id,
        practice_type: practiceType,
        practice_mode: mode,
        set_id: setId || null,
        set_title: setTitle || null,
        total_score: numericTotal,
        max_score: numericMax,
        part_scores: partScores || null,
        duration_seconds: numericDuration,
        device_id: req.headers['x-device-id'] || req.headers['X-Device-Id'] || null,
        metadata: metadata || null
      }
    ]);

    return res.status(200).json({
      success: true,
      result: record
    });
  } catch (error) {
    console.error('practice_results submit error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể lưu kết quả luyện tập'
    });
  }
}










