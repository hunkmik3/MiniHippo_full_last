import { verifyAdminRequest } from '../_utils/auth.js';
import { selectFrom } from '../_utils/supabase.js';

// fields=summary: chỉ lấy cột nhẹ để dựng bảng danh sách. Bỏ các phần nặng trong
// metadata (result_rows_html, user_answers, auto_writing_feedback, speaking_answers,
// key_review...) — chiếm ~90% dung lượng mỗi bài. 1000 bài đầy đủ đã vượt giới hạn
// 4.5MB/response của Vercel. Cần xem chi tiết thì gọi lại với ids=... để lấy bản đầy đủ.
const SUMMARY_METADATA_KEYS = [
  'submission_kind',
  'session_number',
  'session',
  'session_type',
  'class_id',
  'class_title',
  'band',
  'total_questions',
  'total_correct'
];
const SUMMARY_COLUMNS = [
  'id',
  'user_id',
  'practice_type',
  'practice_mode',
  'set_id',
  'set_title',
  'total_score',
  'max_score',
  'duration_seconds',
  'submitted_at',
  // "->" (không phải "->>") để giữ nguyên kiểu gốc (số vẫn là số).
  ...SUMMARY_METADATA_KEYS.map((key) => `md_${key}:metadata->${key}`)
].join(',');

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_IDS = 50;

function toSummaryRow(row) {
  const result = { _summary: true, metadata: {} };
  Object.entries(row).forEach(([key, value]) => {
    if (!key.startsWith('md_')) {
      result[key] = value;
    } else if (value !== null && value !== undefined) {
      result.metadata[key.slice(3)] = value;
    }
  });
  return result;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res
      .status(adminCheck.status || 401)
      .json({ error: adminCheck.error || 'Unauthorized' });
  }

  const {
    userId,
    type,
    limit = 50,
    offset,
    mode,
    setId,
    classId,
    sessionNumber,
    submissionKind,
    fields,
    ids
  } = req.query || {};

  try {
    const filters = [];
    // ids=<uuid>,<uuid>: lấy bản đầy đủ của vài bài cụ thể (mở xem chi tiết).
    const idList = String(ids || '').split(',').map((id) => id.trim()).filter(Boolean);
    if (ids !== undefined) {
      if (!idList.length || idList.length > MAX_IDS || !idList.every((id) => UUID_RE.test(id))) {
        return res.status(400).json({ error: 'Tham số ids không hợp lệ' });
      }
      filters.push({ column: 'id', operator: 'in', value: `(${idList.join(',')})` });
    }
    if (userId) {
      filters.push({ column: 'user_id', value: userId });
    }
    if (type) {
      filters.push({ column: 'practice_type', value: type });
    }
    if (mode) {
      filters.push({ column: 'practice_mode', value: mode });
    }
    if (setId) {
      filters.push({ column: 'set_id', value: setId });
    }
    // Lớp lấy theo metadata.class_id: đúng cho cả bài BTVN lẫn bài Key
    // (bài Key có set_id là mã bộ đề Key, không phải mã lớp).
    if (classId) {
      filters.push({ column: 'metadata->>class_id', value: classId });
    }
    if (sessionNumber) {
      filters.push({ column: 'metadata->>session_number', value: sessionNumber });
    }
    if (submissionKind) {
      filters.push({ column: 'metadata->>submission_kind', value: submissionKind });
    }

    // Supabase trả tối đa 1000 dòng/lần → muốn nhiều hơn thì phân trang bằng offset.
    const parsedLimit = idList.length
      ? idList.length
      : Math.min(Math.max(parseInt(limit, 10) || 50, 1), 1000);
    const parsedOffset = Math.max(parseInt(offset, 10) || 0, 0);
    const summary = String(fields || '').trim().toLowerCase() === 'summary';

    const rows = await selectFrom('practice_results', {
      filters,
      ...(summary ? { columns: SUMMARY_COLUMNS } : {}),
      // Thêm id để thứ tự cố định khi phân trang (vài bài trùng submitted_at).
      order: [{ column: 'submitted_at', asc: false }, { column: 'id', asc: false }],
      limit: parsedLimit,
      offset: parsedOffset
    });

    const results = summary && Array.isArray(rows) ? rows.map(toSummaryRow) : rows;
    return res.status(200).json({ results });
  } catch (error) {
    console.error('practice_results list error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể tải kết quả luyện tập'
    });
  }
}
