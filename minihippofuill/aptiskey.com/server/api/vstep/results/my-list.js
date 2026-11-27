import { verifyUserRequest } from '../../_utils/auth.js';
import { selectFrom } from '../../_utils/supabase.js';
import { normalizeFlow, vstepSchemaErrorResponse } from '../_utils.js';

const SUMMARY_METADATA_KEYS = ['vstep_content_id', 'vstep_set_id', 'tab_exit_count', 'assignment_submitted_overdue', 'assignment_due_at'];
const SUMMARY_COLUMNS = [
  'id', 'content_id', 'assignment_id', 'flow', 'content_title', 'total_score', 'max_score',
  'manual_score', 'submitted_at',
  ...SUMMARY_METADATA_KEYS.map((key) => `md_${key}:metadata->${key}`)
].join(',');

function summaryRow(row) {
  const metadata = {};
  const out = {};
  Object.entries(row).forEach(([key, value]) => {
    if (key.startsWith('md_')) {
      if (value !== null && value !== undefined) metadata[key.slice(3)] = value;
    } else {
      out[key] = value;
    }
  });
  return { ...out, metadata };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authResult = await verifyUserRequest(req, { requireDevice: true });
  if (!authResult.success) {
    return res.status(authResult.status || 401).json({ error: authResult.error || 'Unauthorized' });
  }

  try {
    const filters = [{ column: 'user_id', value: authResult.user.id }];
    if (req.query.flow) filters.push({ column: 'flow', value: normalizeFlow(req.query.flow) });
    if (req.query.contentId) filters.push({ column: 'content_id', value: req.query.contentId });
    const parsedLimit = Math.min(Math.max(parseInt(req.query.limit, 10) || 200, 1), 300);

    // view=summary: trang tiến độ chỉ cần điểm + vài trường metadata (không kéo
    // bài viết / ghi âm / đáp án) → nhẹ hơn nhiều.
    const summaryView = req.query.view === 'summary';
    const results = await selectFrom('vstep_results', {
      columns: summaryView ? SUMMARY_COLUMNS : '*',
      filters,
      order: { column: 'submitted_at', asc: false },
      limit: parsedLimit
    });
    const list = Array.isArray(results) ? results : [];

    return res.status(200).json({ results: summaryView ? list.map(summaryRow) : list });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep results my-list error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể tải kết quả VSTEP của học viên',
      details: error?.details || null
    });
  }
}
