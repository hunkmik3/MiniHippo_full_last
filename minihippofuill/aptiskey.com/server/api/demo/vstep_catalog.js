// GET /api/vstep/demo/catalog?key=...               → toàn bộ cây ôn thi VSTEP
// GET /api/vstep/demo/catalog?key=...&skill=reading   → chỉ 1 nhóm
//
// Cây bám đúng sidebar khu Ôn thi VSTEP của Mini Hippo:
//   FULL TEST (bộ đề tổng hợp 4 kỹ năng) -> Listening -> Reading -> Writing -> Speaking
//
// Chỉ lấy nội dung khu ÔN THI đã xuất bản (flow=practice, status=published) — đúng
// những gì học viên ôn thi đang thấy. Khu "Học tập" (lesson_exam) là bài giao theo
// lớp nên không đưa ra ngoài.
//
// Catalog chỉ chứa METADATA để dựng menu cho nhẹ. Mỗi bộ đề có detailUrl -> gọi
// /api/vstep/demo/content để lấy NỘI DUNG ĐẦY ĐỦ.
// KHÔNG lấy cột `data` (trung bình 13 KB, tối đa 152 KB mỗi dòng).

import { selectFrom } from '../_utils/supabase.js';
import { demoGuard, cached, byTitle } from './_shared.js';

const GROUPS = [
  { key: 'full_test', label: 'Full Test (bộ đề tổng hợp)' },
  { key: 'listening', label: 'Listening' },
  { key: 'reading', label: 'Reading' },
  { key: 'writing', label: 'Writing' },
  { key: 'speaking', label: 'Speaking' }
];

async function loadContents() {
  const rows = await selectFrom('vstep_contents', {
    filters: [
      { column: 'flow', value: 'practice' },
      { column: 'status', value: 'published' }
    ],
    // Chỉ bóc vài trường nhỏ trong data: kỹ năng, lịch ôn thi, tham chiếu bộ tổng hợp.
    columns: 'id,title,description,duration_minutes,band,session_number,created_at,'
      + 'skill:data->>vstep_practice_skill,onthi:data->onthi,combined:data->combined_refs',
    order: { column: 'created_at', asc: false }
  });
  return Array.isArray(rows) ? rows : [];
}

// Thứ tự giống trang ôn thi: theo onthi.order rồi theo tên.
function byOrderThenTitle(a, b) {
  const oa = Number(a.order) || 999;
  const ob = Number(b.order) || 999;
  return oa - ob || byTitle(a, b);
}

function toItem(row) {
  const onthi = row.onthi && typeof row.onthi === 'object' ? row.onthi : {};
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    durationMinutes: row.duration_minutes || null,
    band: row.band || null,
    sessionNumber: row.session_number || null,
    combined: Boolean(row.combined),
    // Lịch ôn thi do admin cấu hình (có thể trống).
    track: onthi.track || null,
    order: onthi.order || null,
    accessFrom: onthi.accessFrom || null,
    accessUntil: onthi.accessUntil || null,
    deadlineAt: onthi.deadlineAt || null,
    detailUrl: `/api/vstep/demo/content?id=${row.id}`
  };
}

export default async function handler(req, res) {
  if (demoGuard(req, res).done) return;

  const skillFilter = String(req.query?.skill || '').trim().toLowerCase();

  try {
    const rows = await cached('vstep-catalog', 60 * 1000, loadContents);

    const groups = GROUPS
      .filter((group) => !skillFilter || group.key === skillFilter)
      .map((group) => {
        const items = rows
          .filter((row) => {
            const skill = String(row.skill || '').toLowerCase();
            // Full test: chỉ bộ tổng hợp thật (có combined_refs). Mấy bộ mock cũ
            // không có kỹ năng cũng đang bị ẩn khỏi trang học viên -> ẩn theo.
            if (group.key === 'full_test') return Boolean(row.combined);
            return skill === group.key;
          })
          .map(toItem)
          .sort(byOrderThenTitle);
        return {
          key: group.key,
          label: group.label,
          count: items.length,
          items
        };
      });

    return res.status(200).json({ groups, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('demo vstep catalog error:', error);
    return res.status(500).json({ error: 'Không tải được danh mục VSTEP.' });
  }
}
