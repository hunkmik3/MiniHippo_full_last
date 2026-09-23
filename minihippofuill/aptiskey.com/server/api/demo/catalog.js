// GET /api/lessons/demo-catalog?key=...            → toàn bộ cây nội dung Aptis
// GET /api/lessons/demo-catalog?key=...&skill=reading → chỉ 1 kỹ năng
//
// Web bán khoá cần 1 lần gọi là có đủ cây như menu trên Mini Hippo, thay vì gọi
// riêng từng part (part 1, 2, 4, 5...):
//
//   kỹ năng -> chế độ học (câu hỏi / bộ đề) -> nhóm (Part 1, Part 2 & 3...) -> bài
//
// Catalog chỉ chứa METADATA (id, tên, số bộ...) để dựng menu cho nhẹ. Mỗi bài có
// detailUrl -> gọi tiếp để lấy NỘI DUNG ĐẦY ĐỦ của bài đó.
//
// Chỉ chọn cột nhẹ, KHÔNG lấy cột `data` (chứa nguyên đề thi) để tiết kiệm băng
// thông Supabase.

import { selectFrom } from '../_utils/supabase.js';
import { demoGuard, cached, byTitle, logicalSetType } from './_shared.js';

// Cấu trúc bám đúng menu + nhãn cột đang hiển thị trên Mini Hippo
// (reading_question.html, listening_question.html, *_bode.html).
// source 'lesson' = bảng lessons (lọc theo part)
// source 'set'    = bảng practice_sets (lọc theo loại logic)
const CATALOG = [
  {
    skill: 'reading',
    label: 'Reading',
    modes: [
      {
        mode: 'by_question',
        label: 'Học theo câu hỏi',
        groups: [
          { key: '1', label: 'Part 1', source: 'lesson', part: '1' },
          { key: '2', label: 'Part 2 & 3', source: 'lesson', part: '2' },
          { key: '4', label: 'Part 4', source: 'lesson', part: '4' },
          { key: '5', label: 'Part 5', source: 'lesson', part: '5' }
        ]
      },
      {
        mode: 'by_set',
        label: 'Học theo bộ đề',
        groups: [{ key: 'reading', label: 'Bộ đề Reading', source: 'set', type: 'reading' }]
      }
    ]
  },
  {
    skill: 'listening',
    label: 'Listening',
    modes: [
      {
        mode: 'by_question',
        label: 'Học theo câu hỏi',
        groups: [
          { key: 'listening_1_13', label: 'Question 1 - 13', source: 'lesson', part: 'listening_1_13' },
          { key: 'listening_14', label: 'Question 14', source: 'lesson', part: 'listening_14' },
          { key: 'listening_15', label: 'Question 15', source: 'lesson', part: 'listening_15' },
          { key: 'listening_16_17', label: 'Question 16 & 17', source: 'lesson', part: 'listening_16_17' }
        ]
      },
      {
        mode: 'by_set',
        label: 'Học theo bộ đề',
        groups: [{ key: 'listening', label: 'Bộ đề Listening', source: 'set', type: 'listening' }]
      }
    ]
  },
  {
    skill: 'writing',
    label: 'Writing',
    // Writing trên Mini Hippo chỉ có "học theo bộ đề", nội dung nằm ở bảng lessons.
    modes: [
      {
        mode: 'by_set',
        label: 'Học theo bộ đề',
        groups: [{ key: 'writing', label: 'Bộ đề Writing', source: 'lesson', part: 'writing' }]
      }
    ]
  },
  {
    skill: 'speaking',
    label: 'Speaking',
    modes: [
      {
        mode: 'by_question',
        label: 'Học theo câu hỏi',
        groups: [{ key: 'speaking_cauhoi', label: 'Câu hỏi Speaking', source: 'set', type: 'speaking_cauhoi' }]
      },
      {
        mode: 'by_set',
        label: 'Học theo bộ đề',
        groups: [{ key: 'speaking', label: 'Bộ đề Speaking', source: 'set', type: 'speaking' }]
      }
    ]
  }
];

async function loadSources() {
  const [lessons, sets] = await Promise.all([
    selectFrom('lessons', {
      columns: 'id,part,title,topic,num_sets,created_at',
      order: { column: 'created_at', asc: false }
    }),
    selectFrom('practice_sets', {
      // logical:data->>__practice_type chỉ bóc đúng 1 trường nhỏ, không kéo cả data.
      columns: 'id,title,type,description,duration_minutes,created_at,logical:data->>__practice_type',
      order: { column: 'created_at', asc: false }
    })
  ]);
  return {
    lessons: Array.isArray(lessons) ? lessons : [],
    sets: Array.isArray(sets) ? sets : []
  };
}

function lessonItem(row) {
  return {
    id: row.id,
    title: row.title,
    topic: row.topic || null,
    numSets: row.num_sets || null,
    source: 'lesson',
    detailUrl: `/api/lessons/demo-lesson?id=${row.id}`
  };
}

function setItem(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    durationMinutes: row.duration_minutes || null,
    source: 'set',
    detailUrl: `/api/practice_sets/demo-set?id=${row.id}`
  };
}

export default async function handler(req, res) {
  if (demoGuard(req, res).done) return;

  const skillFilter = String(req.query?.skill || '').trim().toLowerCase();

  try {
    const { lessons, sets } = await cached('aptis-catalog', 60 * 1000, loadSources);

    const skills = CATALOG
      .filter((skill) => !skillFilter || skill.skill === skillFilter)
      .map((skill) => ({
        skill: skill.skill,
        label: skill.label,
        modes: skill.modes.map((mode) => ({
          mode: mode.mode,
          label: mode.label,
          groups: mode.groups.map((group) => {
            // Bài học theo câu hỏi giữ thứ tự như lessons/list (mới nhất trước);
            // bộ đề xếp theo tên giống trang *_bode.html.
            const items = group.source === 'lesson'
              ? lessons
                .filter((row) => String(row.part) === group.part)
                .map(lessonItem)
              : sets
                .filter((row) => logicalSetType(row) === group.type)
                .map(setItem)
                .sort(byTitle);
            return {
              key: group.key,
              label: group.label,
              count: items.length,
              items
            };
          })
        }))
      }));

    return res.status(200).json({ skills, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('demo catalog error:', error);
    return res.status(500).json({ error: 'Không tải được danh mục bài học.' });
  }
}
