export function isMissingVstepTableError(error) {
  const text = [
    error?.message,
    error?.details?.message,
    error?.details?.details,
    error?.details?.hint,
    error?.details?.error
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return (
    text.includes('vstep_') &&
    (
      text.includes('does not exist') ||
      text.includes('schema cache') ||
      text.includes('could not find') ||
      text.includes('relation')
    )
  );
}

export function vstepSchemaErrorResponse(error) {
  if (!isMissingVstepTableError(error)) return null;
  return {
    status: 500,
    body: {
      error: 'Database chưa có bảng VSTEP riêng. Hãy chạy SUPABASE_VSTEP_TABLES.sql trong Supabase SQL Editor.',
      code: 'MISSING_VSTEP_SCHEMA',
      details: error?.details || null
    }
  };
}

export function normalizeFlow(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return normalized === 'lesson_exam' ? 'lesson_exam' : 'practice';
}

export function normalizeContentKind(value, flow = 'practice') {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'lesson' || normalized === 'assigned_exam' || normalized === 'mock_test') {
    return normalized;
  }
  return flow === 'lesson_exam' ? 'assigned_exam' : 'mock_test';
}

export function normalizeStatus(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'published' || normalized === 'archived') return normalized;
  return 'draft';
}

export function contentToLegacySet(content) {
  if (!content) return null;
  const data = content.data && typeof content.data === 'object' ? { ...content.data } : {};
  data.__practice_type = 'vstep';
  data.vstep_module = true;
  data.vstep_flow = content.flow || data.vstep_flow || 'practice';
  data.vstep_content_kind = content.content_kind || data.vstep_content_kind || 'mock_test';
  data.status = content.status || data.status || 'draft';
  return {
    id: content.id,
    type: 'vstep',
    title: content.title,
    description: content.description || '',
    duration_minutes: content.duration_minutes || 177,
    data,
    created_at: content.created_at,
    updated_at: content.updated_at,
    flow: content.flow,
    content_kind: content.content_kind,
    status: content.status,
    assignment: content.assignment || null
  };
}

export function legacyPayloadToContentPayload(body = {}, adminUser = null) {
  const data = body.data && typeof body.data === 'object' ? { ...body.data } : {};
  const flow = normalizeFlow(body.flow || data.vstep_flow);
  const contentKind = normalizeContentKind(body.contentKind || body.content_kind || data.vstep_content_kind, flow);
  const status = normalizeStatus(body.status || data.status);
  data.__practice_type = 'vstep';
  data.vstep_module = true;
  data.vstep_flow = flow;
  data.vstep_content_kind = contentKind;
  data.status = status;

  return {
    flow,
    content_kind: contentKind,
    title: String(body.title || '').trim(),
    description: body.description || '',
    status,
    duration_minutes: Number(body.duration_minutes) || 177,
    data,
    created_by: adminUser?.id || null
  };
}
