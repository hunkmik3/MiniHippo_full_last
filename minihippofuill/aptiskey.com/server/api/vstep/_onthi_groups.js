// ===================================================================
// NHÓM ÔN (khu Ôn thi VSTEP) — admin tạo nhóm, thêm học viên, giao bộ đề
// kèm lịch mở + deadline RIÊNG cho từng nhóm (thay cho deadline đặt chung
// trong bộ đề trước đây).
//
// Dùng lại bảng của khu Học tập, phân biệt bằng dấu schedule.kind:
//   vstep_classes        schedule = { kind: 'onthi_group' }  (1 dòng / nhóm)
//   vstep_class_students thành viên (mỗi học viên chỉ ở 1 nhóm ôn)
//   vstep_assignments    class_id = nhóm, content_id = bộ đề,
//                        available_from = mở từ, due_at = deadline
// (Cột schedule_type có CHECK chỉ nhận 246/357 nên không dùng làm dấu được.)
//
// Quy tắc hiển thị cho học viên (flow practice):
//   - Có nhóm   → chỉ thấy bộ đề nhóm được giao, lịch theo nhóm.
//   - Chưa nhóm → thấy mọi bộ đề, KHÔNG có lịch/deadline.
// Lịch cũ lưu trong data.onthi của bộ đề không còn áp dụng cho học viên.
// ===================================================================
import { selectFrom } from '../_utils/supabase.js';

export const ONTHI_GROUP_KIND = 'onthi_group';

export function isOnthiGroup(row) {
  return String(row?.schedule?.kind || '') === ONTHI_GROUP_KIND;
}

// Các trường lịch trong data.onthi bị thay bằng lịch của nhóm.
const SCHEDULE_FIELDS = ['examDate', 'accessFrom', 'accessUntil', 'deadlineAt'];

// Nhóm ôn đang hoạt động của học viên + bài được giao (Map content_id -> assignment).
// null = học viên chưa ở nhóm ôn nào.
export async function loadOnthiGroupContext(userId) {
  if (!userId) return null;
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
      { column: 'id', operator: 'in', value: `(${classIds.join(',')})` },
      { column: 'schedule->>kind', value: ONTHI_GROUP_KIND },
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

// Bản sao content với data.onthi mang lịch của học viên này (không sửa object gốc).
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

// Học viên có nhóm chỉ được làm bộ đề nhóm được giao.
export function isVisibleForGroup(content, groupContext) {
  if (!groupContext) return true;
  return groupContext.byContent.has(content?.id);
}
