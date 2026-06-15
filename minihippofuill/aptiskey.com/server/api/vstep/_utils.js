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
  if (content.band) data.vstep_band = content.band;
  if (content.session_number) data.vstep_session_number = content.session_number;
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
    band: content.band || null,
    session_number: content.session_number || null,
    assignment: content.assignment || null
  };
}

export function getPracticeOnthiMeta(content) {
  const data = content?.data && typeof content.data === 'object' ? content.data : {};
  return data.onthi && typeof data.onthi === 'object' ? data.onthi : {};
}

function parseTime(value) {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : null;
}

export function practiceAccessWindowStatus(content, nowMs = Date.now()) {
  const flow = content?.flow || content?.data?.vstep_flow || 'practice';
  if (flow !== 'practice') return { allowed: true };
  const meta = getPracticeOnthiMeta(content);
  const accessFrom = parseTime(meta.accessFrom);
  const accessUntil = parseTime(meta.accessUntil || meta.deadlineAt);
  if (accessFrom && nowMs < accessFrom) {
    return {
      allowed: false,
      reason: `Đề ôn thi này sẽ mở từ ${new Date(accessFrom).toLocaleString('vi-VN')}.`
    };
  }
  if (accessUntil && nowMs > accessUntil) {
    return {
      allowed: false,
      reason: `Đề ôn thi này đã đóng truy cập từ ${new Date(accessUntil).toLocaleString('vi-VN')}.`
    };
  }
  return { allowed: true };
}

// ===========================================================
// Helpers cho lịch học VSTEP (246 / 357), số buổi cố định theo
// band (B1=18 / B2=24), auto-compute sessions[] + deadline.
// Logic chính clone từ admin Lớp Học (calculateDeadline) để
// giữ behavior đồng nhất giữa 2 module.
// ===========================================================

export const VSTEP_SCHEDULE_DAYS = {
  '246': [1, 3, 5],   // Thứ 2, 4, 6
  '357': [2, 4, 6]    // Thứ 3, 5, 7
};

export const VSTEP_BAND_SESSION_LIMITS = {
  B1: 18,
  B2: 24
};

export const VSTEP_DAY_NAMES = [
  'Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'
];

export function normalizeScheduleType(value) {
  const v = String(value || '').trim();
  return v === '246' || v === '357' ? v : '';
}

export function normalizeVstepBand(value) {
  const v = String(value || '').trim().toUpperCase();
  return v === 'B1' || v === 'B2' ? v : 'B1';
}

export function defaultNumSessionsForBand(band) {
  const b = normalizeVstepBand(band);
  return VSTEP_BAND_SESSION_LIMITS[b] || VSTEP_BAND_SESSION_LIMITS.B1;
}

function parseLocalDate(value) {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return new Date(value);
  // Chấp nhận 'YYYY-MM-DD' và 'YYYY-MM-DDTHH:mm[:ss]'
  const str = String(value).trim();
  if (!str) return null;
  // Nếu là datetime-local (có T), parse trực tiếp
  if (/^\d{4}-\d{2}-\d{2}T/.test(str)) {
    const date = new Date(str);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  // Nếu là date-only (YYYY-MM-DD), neo về 00:00 giờ local để khỏi shift ngày
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const date = new Date(`${str}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const fallback = new Date(str);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

function ymd(date) {
  if (!date) return '';
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');
}

// Sinh danh sách ngày học của N buổi đầu tiên theo lịch 246/357,
// bắt đầu từ firstDate. Mỗi entry: { number, date(YYYY-MM-DD), day_name }.
export function calculateVstepSessionDates(scheduleType, firstDate, numSessions) {
  const days = VSTEP_SCHEDULE_DAYS[normalizeScheduleType(scheduleType)] || VSTEP_SCHEDULE_DAYS['246'];
  const start = parseLocalDate(firstDate);
  if (!start) return [];

  const total = Number.isFinite(Number(numSessions)) && Number(numSessions) > 0
    ? Math.floor(Number(numSessions))
    : 18;

  const result = [];
  const cursor = new Date(start);
  const maxIterations = total * 7 + 14; // bound an toàn
  let iterations = 0;
  while (result.length < total && iterations < maxIterations) {
    if (days.includes(cursor.getDay())) {
      result.push({
        number: result.length + 1,
        date: ymd(cursor),
        day_name: VSTEP_DAY_NAMES[cursor.getDay()] || ''
      });
    }
    cursor.setDate(cursor.getDate() + 1);
    iterations += 1;
  }
  return result;
}

// Tính deadline cho 1 buổi học = giờ bắt đầu của BUỔI HỌC TIẾP THEO
// trong lịch 246/357. Vd lịch 246, buổi Thứ 2 → deadline 18h Thứ 4,
// buổi Thứ 6 → deadline 18h Thứ 2 tuần sau.
export function calculateVstepDeadline(sessionDate, scheduleType, startTime) {
  const start = parseLocalDate(sessionDate);
  if (!start) return null;
  const days = VSTEP_SCHEDULE_DAYS[normalizeScheduleType(scheduleType)] || VSTEP_SCHEDULE_DAYS['246'];
  const cursor = new Date(start);
  // Bước qua tối đa 8 ngày để tìm scheduled day tiếp theo
  for (let i = 0; i < 8; i += 1) {
    cursor.setDate(cursor.getDate() + 1);
    if (days.includes(cursor.getDay())) {
      const time = String(startTime || '18:00').split(':');
      const h = Number(time[0]) || 18;
      const m = Number(time[1]) || 0;
      cursor.setHours(h, m, 0, 0);
      return cursor;
    }
  }
  return null;
}

// Build sessions[] hoàn chỉnh: [{ number, date, deadline(ISO), day_name }, ...]
export function buildVstepSessions({ scheduleType, firstDate, startTime, numSessions }) {
  const dates = calculateVstepSessionDates(scheduleType, firstDate, numSessions);
  return dates.map((entry) => {
    const deadline = calculateVstepDeadline(entry.date, scheduleType, startTime);
    return {
      number: entry.number,
      date: entry.date,
      deadline: deadline ? deadline.toISOString() : null,
      day_name: entry.day_name
    };
  });
}

// expires_at = ngày khai giảng + 6 tháng (trả về Date hoặc null).
// Dùng setMonth — JS tự xử lý overflow (ví dụ 31/1 + 6 tháng = 31/7).
export function computeVstepExpiresAt(startedOn) {
  const start = parseLocalDate(startedOn);
  if (!start) return null;
  const result = new Date(start);
  result.setMonth(result.getMonth() + 6);
  return result;
}

// Trả về YYYY-MM-DD format cho expires_at (vstep_students.expires_at là timestamptz, vstep_classes.ends_at là timestamptz)
export function computeVstepExpiresAtDate(startedOn) {
  const d = computeVstepExpiresAt(startedOn);
  return d ? ymd(d) : null;
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

  // Shared blueprint pool: nội dung lesson_exam chỉ phụ thuộc band + session.
  // Mỗi lớp B1 dùng chung 18 content theo session_number, B2 dùng chung 24.
  // KHÔNG còn gắn vstep_class_id vào data — đã đổi từ per-class sang shared.
  const bandRaw = String(body.band || data.vstep_band || '').toUpperCase();
  const band = (bandRaw === 'B1' || bandRaw === 'B2') ? bandRaw : null;
  const sessionRaw = Number(body.session_number ?? body.sessionNumber ?? data.vstep_session_number);
  const sessionNumber = Number.isFinite(sessionRaw) && sessionRaw > 0 ? Math.floor(sessionRaw) : null;
  if (band) data.vstep_band = band;
  if (sessionNumber) data.vstep_session_number = sessionNumber;

  return {
    flow,
    content_kind: contentKind,
    title: String(body.title || '').trim(),
    description: body.description || '',
    status,
    duration_minutes: Number(body.duration_minutes) || 177,
    data,
    band,
    session_number: sessionNumber,
    created_by: adminUser?.id || null
  };
}

// Auto bind 18/24 content (theo band) vào lớp dưới dạng vstep_assignments.
// Idempotent — skip nếu lớp đã có assignment cho session_number đó.
// Gọi từ classes/create.js sau khi tạo lớp + (tùy chọn) classes/sync-assignments.js
// để admin re-sync sau khi cập nhật content blueprint.
export async function syncClassAssignmentsByBand(classRecord, adminId, deps) {
  const { selectFrom, insertInto } = deps;
  if (!classRecord?.id || !classRecord.band) {
    return { created: 0, skipped: 0, missing: [], reason: 'missing class id or band' };
  }
  const sessions = Array.isArray(classRecord.sessions) ? classRecord.sessions : [];
  if (!sessions.length) {
    return { created: 0, skipped: 0, missing: [], reason: 'class chưa có sessions[]' };
  }

  // Pool content lesson_exam của band này. Mỗi session_number = 1 content.
  const contents = await selectFrom('vstep_contents', {
    filters: [
      { column: 'flow', value: 'lesson_exam' },
      { column: 'band', value: classRecord.band }
    ]
  });
  const contentBySession = new Map();
  (Array.isArray(contents) ? contents : []).forEach(c => {
    if (c.session_number) contentBySession.set(Number(c.session_number), c);
  });

  // Skip session đã có assignment để idempotent.
  const existing = await selectFrom('vstep_assignments', {
    filters: [{ column: 'class_id', value: classRecord.id }]
  });
  const existingSessions = new Set(
    (Array.isArray(existing) ? existing : [])
      .map(a => Number(a.session_number))
      .filter(n => Number.isFinite(n))
  );

  let created = 0;
  let skipped = 0;
  const missing = [];
  for (const session of sessions) {
    const num = Number(session.number);
    if (!Number.isFinite(num) || num <= 0) continue;
    if (existingSessions.has(num)) { skipped += 1; continue; }
    const content = contentBySession.get(num);
    if (!content) { missing.push(num); continue; }
    try {
      await insertInto('vstep_assignments', [{
        content_id: content.id,
        class_id: classRecord.id,
        user_id: null,
        student_id: null,
        session_number: num,
        available_from: session.date || null,
        due_at: session.deadline || null,
        status: 'active',
        notes: `Auto-bind buổi ${num} (${classRecord.band})`,
        created_by: adminId || null
      }]);
      created += 1;
    } catch (error) {
      console.warn(`Auto-bind buổi ${num} thất bại:`, error.message);
    }
  }

  return { created, skipped, missing };
}
