// ===================================================================
// NHÓM (Ôn thi + Lớp học VSTEP) — admin tạo nhóm, thêm học viên, giao bài
// kèm lịch mở + deadline RIÊNG cho từng nhóm.
//   - Nhóm ôn  (khu Ôn thi):  giao BỘ ĐỀ   (vstep_contents.flow = 'practice')
//   - Nhóm học (khu Lớp học): giao BÀI HỌC (vstep_contents.flow = 'lesson_exam')
//
// Dùng lại bảng của khu Học tập, phân biệt bằng dấu schedule.kind:
//   vstep_classes        schedule = { kind: 'onthi_group' | 'lophoc_group' }
//   vstep_class_students thành viên (mỗi học viên chỉ ở 1 nhóm trong mỗi khu)
//   vstep_assignments    class_id = nhóm, content_id = bài, KHÔNG gắn học viên;
//                        available_from = mở từ, due_at = deadline
// (Cột schedule_type có CHECK chỉ nhận 246/357 nên không dùng làm dấu được.)
//
// Quy tắc cho học viên:
//   Ôn thi   — có nhóm: chỉ thấy bộ đề nhóm được giao, lịch theo nhóm;
//              chưa nhóm: thấy mọi bộ đề, không có deadline.
//   Lớp học  — có nhóm: chỉ thấy bài nhóm được giao (làm lại được, nộp sau
//              deadline ghi nhận "trễ"); chưa nhóm: giữ luồng lớp/buổi cũ.
// ===================================================================
import { deleteFrom, selectFrom, upsertInto } from '../_utils/supabase.js';

export const ONTHI_GROUP_KIND = 'onthi_group';
export const LOPHOC_GROUP_KIND = 'lophoc_group';
export const GROUP_KIND_BY_PROGRAM = { onthi: ONTHI_GROUP_KIND, lophoc: LOPHOC_GROUP_KIND };
// Loại bài mỗi kiểu nhóm được giao.
export const FLOW_BY_GROUP_KIND = { [ONTHI_GROUP_KIND]: 'practice', [LOPHOC_GROUP_KIND]: 'lesson_exam' };

export function groupKindOf(row) {
  const kind = String(row?.schedule?.kind || '');
  return FLOW_BY_GROUP_KIND[kind] ? kind : '';
}

export function isOnthiGroup(row) {
  return groupKindOf(row) === ONTHI_GROUP_KIND;
}

// Nhóm ôn / nhóm học (không phải lớp lịch 246/357 của khu Học tập).
export function isStudyGroup(row) {
  return Boolean(groupKindOf(row));
}

function inFilter(column, ids) {
  return { column, operator: 'in', value: `(${ids.join(',')})` };
}

// Trường lịch trong data.onthi bị thay bằng lịch của nhóm ôn.
const SCHEDULE_FIELDS = ['examDate', 'accessFrom', 'accessUntil', 'deadlineAt'];

// Nhóm (theo kiểu) đang hoạt động của học viên + bài được giao (Map content_id -> assignment).
// null = học viên chưa ở nhóm nào của kiểu này.
export async function loadGroupContext(userId, kind) {
  if (!userId || !FLOW_BY_GROUP_KIND[kind]) return null;
  const memberships = await selectFrom('vstep_class_students', {
    columns: 'class_id',
    filters: [
      { column: 'user_id', value: userId },
      { column: 'status', value: 'active' }
    ]
  });
  const classIds = [...new Set((Array.isArray(memberships) ? memberships : []).map((m) => m.class_id).filter(Boolean))];
  if (!classIds.length) return null;

  const groups = await selectFrom('vstep_classes', {
    columns: 'id,title,band,status,schedule',
    filters: [
      inFilter('id', classIds),
      { column: 'schedule->>kind', value: kind },
      { column: 'status', value: 'active' }
    ]
  });
  const group = (Array.isArray(groups) ? groups : [])[0];
  if (!group) return null;

  const assignments = await selectFrom('vstep_assignments', {
    columns: 'id,content_id,available_from,due_at,status',
    filters: [
      { column: 'class_id', value: group.id },
      { column: 'status', value: 'active' }
    ]
  });
  const byContent = new Map((Array.isArray(assignments) ? assignments : []).map((a) => [a.content_id, a]));
  return { group, byContent };
}

export function loadOnthiGroupContext(userId) {
  return loadGroupContext(userId, ONTHI_GROUP_KIND);
}

export function loadLophocGroupContext(userId) {
  return loadGroupContext(userId, LOPHOC_GROUP_KIND);
}

// Ôn thi: bản sao content với data.onthi mang lịch của học viên này (không sửa gốc).
// Deadline đóng bài giống trước đây: không có "đóng truy cập" riêng → đóng khi hết deadline.
export function applyOnthiSchedule(content, groupContext) {
  if (!content || content.flow !== 'practice') return content;
  const data = content.data && typeof content.data === 'object' ? content.data : {};
  const onthi = data.onthi && typeof data.onthi === 'object' ? { ...data.onthi } : {};
  SCHEDULE_FIELDS.forEach((field) => { onthi[field] = null; });
  const assignment = groupContext?.byContent?.get(content.id) || null;
  if (assignment) {
    onthi.accessFrom = assignment.available_from || null;
    onthi.deadlineAt = assignment.due_at || null;
    onthi.groupId = groupContext.group.id;
    onthi.groupTitle = groupContext.group.title || '';
  }
  return { ...content, data: { ...data, onthi } };
}

// Lớp học: gắn lịch của nhóm vào bài. Đặt tên group_assignment (KHÔNG phải
// "assignment") để trang thi không gửi kèm khi nộp — nộp bài sẽ đóng
// assignment, mà assignment này là của cả nhóm.
export function attachGroupAssignment(content, groupContext) {
  const assignment = groupContext?.byContent?.get(content?.id) || null;
  if (!assignment) return content;
  return {
    ...content,
    group_assignment: {
      available_from: assignment.available_from || null,
      due_at: assignment.due_at || null,
      group_id: groupContext.group.id,
      group_title: groupContext.group.title || ''
    }
  };
}

// Học viên có nhóm chỉ được làm bài nhóm được giao.
export function isVisibleForGroup(content, groupContext) {
  if (!groupContext) return true;
  return groupContext.byContent.has(content?.id);
}

// Thêm học viên (dòng vstep_students: cần id + user_id) vào nhóm. Mỗi học viên
// chỉ ở 1 nhóm của CÙNG kiểu → rời nhóm cũ cùng kiểu; lớp 246/357 và nhóm của
// khu kia giữ nguyên. Trả về số học viên được chuyển từ nhóm khác.
export async function addStudentsToGroup(group, students) {
  const kind = groupKindOf(group);
  const list = (Array.isArray(students) ? students : []).filter((s) => s?.id);
  if (!kind || !list.length) return { added: 0, moved: 0 };
  const studentIds = list.map((s) => s.id);

  const current = await selectFrom('vstep_class_students', {
    columns: 'id,class_id',
    filters: [inFilter('student_id', studentIds)]
  });
  const otherClassIds = [...new Set((current || []).map((m) => m.class_id).filter((id) => id !== group.id))];
  let moved = 0;
  if (otherClassIds.length) {
    const sameKindGroups = await selectFrom('vstep_classes', {
      columns: 'id',
      filters: [inFilter('id', otherClassIds), { column: 'schedule->>kind', value: kind }]
    });
    const sameKindIds = new Set((sameKindGroups || []).map((g) => g.id));
    const toRemove = (current || []).filter((m) => sameKindIds.has(m.class_id)).map((m) => m.id);
    if (toRemove.length) {
      await deleteFrom('vstep_class_students', [inFilter('id', toRemove)]);
      moved = toRemove.length;
    }
  }

  await upsertInto('vstep_class_students', list.map((s) => ({
    class_id: group.id,
    student_id: s.id,
    user_id: s.user_id || null,
    status: 'active',
    updated_at: new Date().toISOString()
  })), { onConflict: 'class_id,student_id' });

  return { added: list.length, moved };
}

// Tìm nhóm (bất kỳ kiểu) theo id; null nếu không phải nhóm ôn/nhóm học.
export async function findStudyGroup(id) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id || ''))) return null;
  const group = await selectFrom('vstep_classes', {
    filters: [{ column: 'id', value: id }],
    single: true
  });
  return isStudyGroup(group) ? group : null;
}
