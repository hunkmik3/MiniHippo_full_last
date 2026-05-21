import { parseJsonBody } from '../../_utils/parseBody.js';
import { verifyAdminRequest } from '../../_utils/auth.js';
import { selectFrom, updateTable } from '../../_utils/supabase.js';
import { vstepSchemaErrorResponse } from '../_utils.js';

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : value;
}

function normalizeBand(value) {
  const band = String(value || '').trim().toUpperCase();
  return band === 'B1' || band === 'B2' ? band : null;
}

export default async function handler(req, res) {
  const method = String(req.method || '').toUpperCase();
  if (method !== 'PATCH' && method !== 'POST' && method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res.status(adminCheck.status || 401).json({ error: adminCheck.error || 'Unauthorized' });
  }

  try {
    const body = await parseJsonBody(req);
    const id = body?.id || req.query.id;
    if (!id) return res.status(400).json({ error: 'Thiếu id học viên VSTEP' });

    const existing = await selectFrom('vstep_students', {
      filters: [{ column: 'id', value: id }],
      single: true
    });
    if (!existing) return res.status(404).json({ error: 'Không tìm thấy học viên VSTEP' });

    const payload = { updated_at: new Date().toISOString() };
    const publicUserPayload = {};

    if (body.accountCode !== undefined || body.account_code !== undefined) {
      payload.account_code = cleanText(body.accountCode ?? body.account_code) || null;
      publicUserPayload.account_code = payload.account_code;
    }
    if (body.fullName !== undefined || body.full_name !== undefined) {
      payload.full_name = cleanText(body.fullName ?? body.full_name) || null;
      publicUserPayload.full_name = payload.full_name;
    }
    if (body.phone !== undefined || body.phone_number !== undefined) {
      payload.phone_number = cleanText(body.phone ?? body.phone_number) || null;
      publicUserPayload.phone_number = payload.phone_number;
    }
    if (body.band !== undefined) {
      payload.band = normalizeBand(body.band);
      publicUserPayload.band = payload.band;
    }
    if (body.practiceAccess !== undefined || body.practice_access !== undefined) {
      payload.practice_access = Boolean(body.practiceAccess ?? body.practice_access);
    }
    if (body.status !== undefined) {
      payload.status = cleanText(body.status) || 'active';
      publicUserPayload.status = payload.status;
    }
    if (body.deviceLimit !== undefined || body.device_limit !== undefined) {
      const limit = Number(body.deviceLimit ?? body.device_limit);
      payload.device_limit = Number.isFinite(limit) && limit > 0 ? Math.round(limit) : existing.device_limit;
      publicUserPayload.device_limit = payload.device_limit;
    }
    if (body.expiresAt !== undefined || body.expires_at !== undefined) {
      payload.expires_at = cleanText(body.expiresAt ?? body.expires_at) || null;
      publicUserPayload.expires_at = payload.expires_at;
    }
    if (body.notes !== undefined) {
      payload.notes = cleanText(body.notes) || null;
      publicUserPayload.notes = payload.notes;
    }
    if (body.classId !== undefined || body.class_id !== undefined) {
      payload.class_id = cleanText(body.classId ?? body.class_id) || null;
      publicUserPayload.assigned_class_id = payload.class_id;
    }

    const updated = await updateTable('vstep_students', [{ column: 'id', value: id }], payload);
    if (existing.user_id && Object.keys(publicUserPayload).length) {
      await updateTable('users', [{ column: 'id', value: existing.user_id }], publicUserPayload);
    }

    return res.status(200).json({
      success: true,
      student: Array.isArray(updated) ? updated[0] : updated
    });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep students update error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể cập nhật học viên VSTEP',
      details: error?.details || null
    });
  }
}
