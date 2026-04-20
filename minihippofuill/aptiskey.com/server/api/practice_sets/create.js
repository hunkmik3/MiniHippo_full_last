import { parseJsonBody } from '../_utils/parseBody.js';
import { verifyAdminRequest } from '../_utils/auth.js';
import { insertInto } from '../_utils/supabase.js';

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
    'Không thể lưu bộ đề'
  );
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res
      .status(adminCheck.status)
      .json({ error: adminCheck.error || 'Unauthorized' });
  }

  try {
    const body = await parseJsonBody(req);
    const {
      title,
      type = 'reading',
      description,
      duration_minutes,
      data
    } = body || {};

    if (!title || !data) {
      return res.status(400).json({ error: 'Thiếu tiêu đề hoặc nội dung bộ đề' });
    }

    const requestedType = String(type || 'reading').toLowerCase();
    const normalizedData = isPlainObject(data) ? { ...data } : data;

    const basePayload = {
      title,
      type: requestedType,
      description: description || '',
      duration_minutes: duration_minutes || 35,
      data: normalizedData
    };

    let result;
    try {
      result = await insertInto('practice_sets', basePayload);
    } catch (error) {
      const shouldTryTypeFallback =
        isTypeConstraintError(error) && !TYPE_FALLBACKS.includes(requestedType);

      if (!shouldTryTypeFallback) {
        throw error;
      }

      let fallbackResult = null;
      let lastError = error;
      for (const fallbackType of TYPE_FALLBACKS) {
        try {
          fallbackResult = await insertInto('practice_sets', {
            ...basePayload,
            type: fallbackType,
            data: isPlainObject(normalizedData)
              ? {
                  ...normalizedData,
                  __practice_type: requestedType,
                  __storage_type: fallbackType
                }
              : normalizedData
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
    }

    // Supabase returns array when using Prefer: return=representation
    const record = Array.isArray(result) ? result[0] : result;

    return res.status(200).json({
      success: true,
      set: record
    });
  } catch (error) {
    console.error('Practice set create error:', error);
    return res.status(error.status || 500).json({
      error: extractSupabaseError(error),
      details: error?.details || null
    });
  }
}
