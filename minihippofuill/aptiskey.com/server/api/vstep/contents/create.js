import { parseJsonBody } from '../../_utils/parseBody.js';
import { verifyAdminRequest } from '../../_utils/auth.js';
import { insertInto, selectFrom, updateTable } from '../../_utils/supabase.js';
import { legacyPayloadToContentPayload, vstepSchemaErrorResponse } from '../_utils.js';

// Pool dùng chung: mỗi (band, session_number) với flow='lesson_exam' chỉ 1 content
// (constraint idx_vstep_contents_band_session_unique). Tìm content đang tồn tại.
async function findExistingLessonExam(payload) {
  if (payload.flow !== 'lesson_exam' || !payload.band || !payload.session_number) return null;
  return selectFrom('vstep_contents', {
    filters: [
      { column: 'flow', value: 'lesson_exam' },
      { column: 'band', value: payload.band },
      { column: 'session_number', value: payload.session_number }
    ],
    single: true
  });
}

async function updateExisting(id, payload) {
  const updatePayload = { ...payload, updated_at: new Date().toISOString() };
  delete updatePayload.created_by; // giữ nguyên người tạo gốc
  const result = await updateTable('vstep_contents', [{ column: 'id', value: id }], updatePayload);
  return Array.isArray(result) ? result[0] : result;
}

function isDuplicateKeyError(error) {
  return (
    error?.details?.code === '23505' ||
    /duplicate key value/i.test(String(error?.details?.message || error?.message || ''))
  );
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res.status(adminCheck.status || 401).json({ error: adminCheck.error || 'Unauthorized' });
  }

  try {
    const body = await parseJsonBody(req);
    const payload = legacyPayloadToContentPayload(body, adminCheck.user);
    if (!payload.title || !payload.data) {
      return res.status(400).json({ error: 'Thiếu tiêu đề hoặc nội dung VSTEP' });
    }

    // UPSERT: nếu buổi (band+session) đã có content lesson_exam → cập nhật thay vì
    // insert (tránh lỗi "duplicate key ... idx_vstep_contents_band_session_unique").
    const existing = await findExistingLessonExam(payload);
    if (existing?.id) {
      const record = await updateExisting(existing.id, payload);
      return res.status(200).json({ success: true, content: record, set: record, updated: true });
    }

    let record;
    try {
      const result = await insertInto('vstep_contents', payload);
      record = Array.isArray(result) ? result[0] : result;
    } catch (insertError) {
      // Race: bản ghi vừa được tạo giữa lúc select và insert → tìm lại rồi update.
      if (isDuplicateKeyError(insertError)) {
        const raced = await findExistingLessonExam(payload);
        if (raced?.id) {
          record = await updateExisting(raced.id, payload);
          return res.status(200).json({ success: true, content: record, set: record, updated: true });
        }
      }
      throw insertError;
    }

    return res.status(200).json({ success: true, content: record, set: record });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep contents create error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể lưu nội dung VSTEP',
      details: error?.details || null
    });
  }
}
