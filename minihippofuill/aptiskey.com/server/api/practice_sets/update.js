import { parseJsonBody } from '../_utils/parseBody.js';
import { verifyAdminRequest } from '../_utils/auth.js';
import { updateTable } from '../_utils/supabase.js';

const TYPE_FALLBACKS = ['writing', 'reading', 'listening'];

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function isTypeConstraintError(error) {
  const details = error?.details || {};
  const text = [
    error?.message,
    details?.message,
    details?.details,
    details?.hint,
    details?.error
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return (
    details?.code === '22P02' ||
    details?.code === '23514' ||
    text.includes('invalid input value for enum') ||
    text.includes('violates check constraint') ||
    text.includes('constraint') ||
    text.includes('practice_sets_type')
  );
}

function extractSupabaseError(error) {
  const details = error?.details || {};
  return (
    details?.message ||
    details?.details ||
    details?.error ||
    details?.hint ||
    error?.message ||
    'Không thể cập nhật bộ đề'
  );
}

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res
      .status(adminCheck.status)
      .json({ error: adminCheck.error || 'Unauthorized' });
  }

  const id = req.query.id;
  if (!id) {
    return res.status(400).json({ error: 'Thiếu tham số id' });
  }

  try {
    const body = await parseJsonBody(req);
    const payload = { ...body, updated_at: new Date().toISOString() };
    delete payload.id;

    const requestedType =
      typeof payload.type === 'string' ? payload.type.toLowerCase() : null;

    let result;
    try {
      result = await updateTable('practice_sets', [{ column: 'id', value: id }], payload);
    } catch (error) {
      if (requestedType === 'speaking' && isTypeConstraintError(error)) {
        let fallbackResult = null;
        let lastError = error;
        for (const fallbackType of TYPE_FALLBACKS) {
          try {
            fallbackResult = await updateTable('practice_sets', [{ column: 'id', value: id }], {
              ...payload,
              type: fallbackType,
              data: isPlainObject(payload.data)
                ? {
                    ...payload.data,
                    __practice_type: 'speaking',
                    __storage_type: fallbackType
                  }
                : payload.data
            });
            break;
          } catch (fallbackError) {
            lastError = fallbackError;
          }
        }
        if (!fallbackResult) {
          throw lastError;
        }
        result = fallbackResult;
      } else {
        throw error;
      }
    }

    const record = Array.isArray(result) ? result[0] : result;

    return res.status(200).json({
      success: true,
      set: record
    });
  } catch (error) {
    console.error('Practice set update error:', error);
    return res.status(error.status || 500).json({
      error: extractSupabaseError(error),
      details: error?.details || null
    });
  }
}
