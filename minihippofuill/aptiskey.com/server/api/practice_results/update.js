import parseBody from '../_utils/parseBody.js';
import { selectFrom, updateTable } from '../_utils/supabase.js';
import { verifyAdminRequest } from '../_utils/auth.js';

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

export default async function handler(req, res) {
  if (req.method !== 'PATCH' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res
      .status(adminCheck.status || 401)
      .json({ error: adminCheck.error || 'Unauthorized' });
  }

  let body;
  try {
    body = await parseBody(req);
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Invalid JSON payload' });
  }

  const {
    id,
    totalScore,
    maxScore,
    durationSeconds,
    partScores,
    metadata,
    metadataPatch
  } = body || {};

  if (!id) {
    return res.status(400).json({ error: 'Thiếu id kết quả bài học' });
  }

  try {
    const existing = await selectFrom('practice_results', {
      filters: [{ column: 'id', value: id }],
      single: true
    });

    if (!existing) {
      return res.status(404).json({ error: 'Không tìm thấy kết quả cần cập nhật' });
    }

    const payload = {};

    if (totalScore !== undefined) {
      const numeric = Number(totalScore);
      if (Number.isNaN(numeric)) {
        return res.status(400).json({ error: 'totalScore không hợp lệ' });
      }
      payload.total_score = numeric;
    }

    if (maxScore !== undefined) {
      const numeric = Number(maxScore);
      if (Number.isNaN(numeric)) {
        return res.status(400).json({ error: 'maxScore không hợp lệ' });
      }
      payload.max_score = numeric;
    }

    if (durationSeconds !== undefined) {
      if (durationSeconds === null) {
        payload.duration_seconds = null;
      } else {
        const numeric = Number(durationSeconds);
        if (Number.isNaN(numeric) || numeric < 0) {
          return res.status(400).json({ error: 'durationSeconds không hợp lệ' });
        }
        payload.duration_seconds = Math.round(numeric);
      }
    }

    if (partScores !== undefined) {
      if (partScores !== null && !isPlainObject(partScores)) {
        return res.status(400).json({ error: 'partScores phải là object hoặc null' });
      }
      payload.part_scores = partScores;
    }

    let mergedMetadata = undefined;
    if (metadata !== undefined) {
      if (metadata !== null && !isPlainObject(metadata)) {
        return res.status(400).json({ error: 'metadata phải là object hoặc null' });
      }
      mergedMetadata = metadata;
    }

    if (metadataPatch !== undefined) {
      if (!isPlainObject(metadataPatch)) {
        return res.status(400).json({ error: 'metadataPatch phải là object' });
      }
      const baseMetadata = isPlainObject(mergedMetadata)
        ? mergedMetadata
        : (isPlainObject(existing.metadata) ? existing.metadata : {});
      mergedMetadata = {
        ...baseMetadata,
        ...metadataPatch,
        admin_graded_by: adminCheck.user.id,
        admin_graded_at: new Date().toISOString()
      };
    }

    if (mergedMetadata !== undefined) {
      payload.metadata = mergedMetadata;
    }

    if (!Object.keys(payload).length) {
      return res.status(400).json({ error: 'Không có dữ liệu để cập nhật' });
    }

    const updated = await updateTable('practice_results', [{ column: 'id', value: id }], payload);
    const record = Array.isArray(updated) ? updated[0] : updated;

    return res.status(200).json({
      success: true,
      result: record || null
    });
  } catch (error) {
    console.error('practice_results update error:', error);
    const rawMessage = error?.message || '';
    if (/record\s+"new"\s+has\s+no\s+field\s+"updated_at"/i.test(rawMessage)) {
      return res.status(500).json({
        error: 'Schema Supabase đang thiếu cột updated_at trên practice_results. Vui lòng chạy SUPABASE_PRACTICE_TABLES.sql để đồng bộ schema.',
        code: 'MISSING_UPDATED_AT_COLUMN'
      });
    }
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể cập nhật kết quả luyện tập'
    });
  }
}
