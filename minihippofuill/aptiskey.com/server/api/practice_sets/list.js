import { selectFrom } from '../_utils/supabase.js';

// fields=summary: chỉ tên + loại bộ đề (dựng dropdown), không kéo cột data chứa
// nguyên đề thi -> đỡ tốn băng thông Supabase.
const SUMMARY_COLUMNS = 'id,title,type,description,duration_minutes,created_at,updated_at,logical:data->>__practice_type';
// fields=session_meta: trang Lớp Học chỉ cần Key gắn theo buổi của session_content,
// không cần nội dung buổi. Trả lại trong `data` để code cũ đọc set.data.* như trước.
const SESSION_META_KEYS = ['session_key', 'key_set_id', 'key_type', 'key_title', '__practice_type'];
const SESSION_META_COLUMNS = `id,title,type,created_at,updated_at,${SESSION_META_KEYS.map((k) => `meta_${k}:data->>${k}`).join(',')}`;

function resolveLogicalType(set) {
  const marker = set?.logical ?? set?.data?.__practice_type;
  if (typeof marker === 'string' && marker.trim()) {
    return marker.trim().toLowerCase();
  }
  return typeof set?.type === 'string' ? set.type.toLowerCase() : '';
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const type = typeof req.query.type === 'string' ? req.query.type.trim().toLowerCase() : '';
  const fields = String(req.query.fields || '').trim().toLowerCase();
  const summary = fields === 'summary';
  const sessionMeta = fields === 'session_meta';
  // sessionKey (vd "B2-7"): buổi học chỉ cần đúng 1 session_content, khỏi tải cả loại.
  const sessionKey = typeof req.query.sessionKey === 'string' ? req.query.sessionKey.trim().toUpperCase() : '';

  if (type && !/^[a-z0-9_-]{1,40}$/.test(type)) {
    return res.status(400).json({ error: 'type không hợp lệ' });
  }
  if (sessionKey && !/^[A-Z0-9_-]{1,20}$/.test(sessionKey)) {
    return res.status(400).json({ error: 'sessionKey không hợp lệ' });
  }

  try {
    // Lọc theo loại NGAY Ở DATABASE (trước đây kéo cả bảng ~800KB mỗi lần rồi
    // mới lọc → hết hạn mức băng thông Supabase). Loại logic = data.__practice_type,
    // bộ cũ không có dấu này thì dùng cột type. resolveLogicalType bên dưới vẫn
    // lọc lại cho chắc.
    const rawSets = await selectFrom('practice_sets', {
      ...(summary ? { columns: SUMMARY_COLUMNS } : {}),
      ...(sessionMeta ? { columns: SESSION_META_COLUMNS } : {}),
      ...(type ? { or: `(data->>__practice_type.eq.${type},and(data->>__practice_type.is.null,type.eq.${type}))` } : {}),
      filters: sessionKey ? [{ column: 'data->>session_key', value: sessionKey }] : [],
      order: { column: 'created_at', asc: false }
    });

    const sets = sessionMeta && Array.isArray(rawSets)
      ? rawSets.map((row) => {
        const data = {};
        const rest = {};
        Object.entries(row).forEach(([key, value]) => {
          if (key.startsWith('meta_')) {
            if (value !== null && value !== undefined) data[key.slice(5)] = value;
          } else {
            rest[key] = value;
          }
        });
        return { ...rest, data };
      })
      : rawSets;
    const normalizedSets = Array.isArray(sets) ? sets : [];
    const filteredSets = (type
      ? normalizedSets.filter((set) => resolveLogicalType(set) === type)
      : normalizedSets
    ).map((set) => {
      if (!summary) return set;
      const { logical, ...rest } = set;
      return { ...rest, logical_type: resolveLogicalType(set) };
    });

    return res.status(200).json({ sets: filteredSets });
  } catch (error) {
    console.error('Practice sets list error:', error);
    return res.status(error.status || 500).json({
      error: error?.details?.message || error.message || 'Không thể tải bộ đề',
      details: error?.details || null
    });
  }
}
