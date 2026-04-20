import parseBody from '../_utils/parseBody.js';
import { insertInto, selectFrom } from '../_utils/supabase.js';
import { verifyUserRequest } from '../_utils/auth.js';
import { autoGradeWritingSubmission } from '../_utils/writingAutoGrade.js';

function parseSessionNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return null;
  return Math.trunc(number);
}

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

  const normalizedPracticeType = String(practiceType || '').trim().toLowerCase();
  let numericTotal = Number(totalScore) || 0;
  let numericMax = Number(maxScore) || 0;
  const numericDuration =
    typeof durationSeconds === 'number' && durationSeconds >= 0
      ? Math.round(durationSeconds)
      : null;
  let mergedMetadata = metadata && typeof metadata === 'object' ? { ...metadata } : metadata || null;

  // Map non-standard practice types to ones allowed by DB constraint.
  // DB only accepts: reading, listening, writing, speaking.
  // "homework" is a logical type used by Lớp Học module — persist the best
  // matching concrete type, plus tag metadata for admin filtering.
  const VALID_DB_TYPES = new Set(['reading', 'listening', 'writing', 'speaking']);
  let dbPracticeType = normalizedPracticeType;
  if (!VALID_DB_TYPES.has(dbPracticeType)) {
    // Prefer session_type in metadata if provided, else fall back to 'writing'.
    const hintedType = String(mergedMetadata?.session_type || '').trim().toLowerCase();
    dbPracticeType = VALID_DB_TYPES.has(hintedType) ? hintedType : 'writing';
    mergedMetadata = {
      ...(mergedMetadata && typeof mergedMetadata === 'object' ? mergedMetadata : {}),
      submission_kind: normalizedPracticeType,
      submitted_as: dbPracticeType
    };
  }

  try {
    if (normalizedPracticeType === 'homework') {
      const sessionNumber = parseSessionNumber(mergedMetadata?.session_number);
      if (!setId || !sessionNumber) {
        return res.status(400).json({
          error: 'Thiếu class id hoặc số buổi khi nộp BTVN'
        });
      }

      const classSet = await selectFrom('practice_sets', {
        filters: [{ column: 'id', value: setId }],
        single: true
      });

      if (!classSet) {
        return res.status(404).json({ error: 'Không tìm thấy lớp học tương ứng' });
      }

      const sessions = Array.isArray(classSet?.data?.sessions) ? classSet.data.sessions : [];
      const session = sessions.find((item) => parseSessionNumber(item?.number) === sessionNumber);
      if (!session) {
        return res.status(400).json({ error: `Không tìm thấy dữ liệu deadline cho buổi ${sessionNumber}` });
      }

      const deadline = new Date(session.deadline);
      if (!Number.isNaN(deadline.getTime()) && Date.now() > deadline.getTime()) {
        return res.status(403).json({
          error: `Buổi ${sessionNumber} đã quá deadline, không thể nộp bài`
        });
      }
    }

    if (normalizedPracticeType === 'writing') {
      const autoGrade = await autoGradeWritingSubmission({
        metadata: mergedMetadata || {},
        setTitle
      });

      // Writing auto-grading only provides correction hints. Official score and
      // band stay pending until admin review.
      numericTotal = 0;
      numericMax = 0;

      if (autoGrade?.metadataPatch && typeof autoGrade.metadataPatch === 'object') {
        mergedMetadata = {
          ...(mergedMetadata && typeof mergedMetadata === 'object' ? mergedMetadata : {}),
          ...autoGrade.metadataPatch
        };
      }
    }

    const [record] = await insertInto('practice_results', [
      {
        user_id: authResult.user.id,
        practice_type: dbPracticeType,
        practice_mode: mode,
        set_id: setId || null,
        set_title: setTitle || null,
        total_score: numericTotal,
        max_score: numericMax,
        part_scores: partScores || null,
        duration_seconds: numericDuration,
        device_id: req.headers['x-device-id'] || req.headers['X-Device-Id'] || null,
        metadata: mergedMetadata || null
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







