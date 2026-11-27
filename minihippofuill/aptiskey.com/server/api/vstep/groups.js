// API admin cho NHÓM ÔN (khu Ôn thi) và NHÓM HỌC (khu Lớp học) VSTEP — xem _onthi_groups.js.
// program = 'onthi' (mặc định, giao bộ đề) | 'lophoc' (giao bài học).
//   GET  /api/vstep/groups/list?program=...   nhóm + thành viên + bài đã giao
//   POST /api/vstep/groups/save               { id?, program, title, band, notes }
//   POST /api/vstep/groups/delete             { id }
//   POST /api/vstep/groups/members            { groupId, studentIds, action: 'add'|'remove' }
//   POST /api/vstep/groups/assign             { groupId, contentIds, availableFrom, dueAt, closeAt, keepEmpty? }
//        keepEmpty = true (sửa hàng loạt): ô để trống giữ nguyên giá trị cũ của từng bài.
//   POST /api/vstep/groups/unassign           { groupId, contentId | contentIds }
import { parseJsonBody } from '../_utils/parseBody.js';
import { verifyAdminRequest } from '../_utils/auth.js';
import { deleteFrom, insertInto, selectFrom, updateTable, upsertInto } from '../_utils/supabase.js';
import { vstepSchemaErrorResponse } from './_utils.js';
import {
  FLOW_BY_GROUP_KIND,
  GROUP_KIND_BY_PROGRAM,
  addStudentsToGroup,
  findStudyGroup,
  groupKindOf,
  isMissingCloseAtError,
  selectGroupAssignments
} from './_onthi_groups.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_BATCH = 500;

function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

function uuidList(value) {
  const list = [...new Set((Array.isArray(value) ? value : []).map((v) => String(v || '').trim()).filter(Boolean))];
  if (!list.length || list.length > MAX_BATCH || !list.every((id) => UUID_RE.test(id))) return null;
  return list;
}

function inFilter(column, ids) {
  return { column, operator: 'in', value: `(${ids.join(',')})` };
}

// Mốc thời gian ISO hoặc null; undefined = không hợp lệ.
function parseInstant(value) {
  if (value === null || value === undefined || value === '') return null;
  const time = Date.parse(String(value));
  return Number.isFinite(time) ? new Date(time).toISOString() : undefined;
}

async function withAdmin(req, res, method, run) {
  if (req.method !== method) return res.status(405).json({ error: 'Method not allowed' });
  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res.status(adminCheck.status || 401).json({ error: adminCheck.error || 'Unauthorized' });
  }
  try {
    const body = method === 'POST' ? (await parseJsonBody(req)) || {} : {};
    return await run(body, adminCheck.user);
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep groups error:', error);
    return res.status(error.status || 500).json({ error: error.message || 'Không thể xử lý nhóm ôn' });
  }
}

function kindOfProgram(program) {
  return GROUP_KIND_BY_PROGRAM[String(program || 'onthi').toLowerCase()] || null;
}

const findGroup = findStudyGroup;

export async function listGroups(req, res) {
  return withAdmin(req, res, 'GET', async () => {
    const kind = kindOfProgram(req.query?.program);
    if (!kind) return badRequest(res, 'program không hợp lệ (onthi | lophoc).');
    const groups = await selectFrom('vstep_classes', {
      columns: 'id,title,band,notes,status,created_at,updated_at',
      filters: [
        { column: 'schedule->>kind', value: kind },
        { column: 'status', value: 'active' }
      ],
      order: { column: 'created_at', asc: true }
    });
    const list = Array.isArray(groups) ? groups : [];
    const ids = list.map((g) => g.id);
    const [members, assignments] = ids.length
      ? await Promise.all([
        selectFrom('vstep_class_students', {
          columns: 'id,class_id,student_id,user_id',
          filters: [inFilter('class_id', ids), { column: 'status', value: 'active' }]
        }),
        selectGroupAssignments({
          filters: [inFilter('class_id', ids), { column: 'status', value: 'active' }],
          order: { column: 'due_at', asc: true }
        })
      ])
      : [[], []];
    return res.status(200).json({
      groups: list,
      members: Array.isArray(members) ? members : [],
      assignments: Array.isArray(assignments) ? assignments : []
    });
  });
}

export async function saveGroup(req, res) {
  return withAdmin(req, res, 'POST', async (body, admin) => {
    const title = String(body.title || '').trim();
    if (!title) return badRequest(res, 'Nhập tên nhóm ôn.');
    if (title.length > 120) return badRequest(res, 'Tên nhóm tối đa 120 ký tự.');
    const band = String(body.band || 'B1').toUpperCase() === 'B2' ? 'B2' : 'B1';
    const notes = String(body.notes || '').trim().slice(0, 1000) || null;

    if (body.id) {
      const group = await findGroup(body.id);
      if (!group) return res.status(404).json({ error: 'Không tìm thấy nhóm ôn.' });
      const [updated] = await updateTable('vstep_classes', [{ column: 'id', value: group.id }], {
        title, band, notes, updated_at: new Date().toISOString()
      });
      return res.status(200).json({ group: updated || { ...group, title, band, notes } });
    }

    const kind = kindOfProgram(body.program);
    if (!kind) return badRequest(res, 'program không hợp lệ (onthi | lophoc).');
    const [created] = await insertInto('vstep_classes', [{
      title,
      band,
      notes,
      status: 'active',
      schedule: { kind },
      created_by: admin?.id || null
    }]);
    return res.status(200).json({ group: created });
  });
}

export async function deleteGroup(req, res) {
  return withAdmin(req, res, 'POST', async (body) => {
    const group = await findGroup(body.id);
    if (!group) return res.status(404).json({ error: 'Không tìm thấy nhóm ôn.' });
    // FK ON DELETE CASCADE xoá luôn thành viên + bộ đề đã giao của nhóm.
    await deleteFrom('vstep_classes', [{ column: 'id', value: group.id }]);
    return res.status(200).json({ success: true });
  });
}

export async function updateMembers(req, res) {
  return withAdmin(req, res, 'POST', async (body) => {
    const group = await findGroup(body.groupId);
    if (!group) return res.status(404).json({ error: 'Không tìm thấy nhóm ôn.' });
    const studentIds = uuidList(body.studentIds);
    if (!studentIds) return badRequest(res, 'Danh sách học viên không hợp lệ.');

    if (body.action === 'remove') {
      await deleteFrom('vstep_class_students', [
        { column: 'class_id', value: group.id },
        inFilter('student_id', studentIds)
      ]);
      return res.status(200).json({ success: true, removed: studentIds.length });
    }

    const students = await selectFrom('vstep_students', {
      columns: 'id,user_id',
      filters: [inFilter('id', studentIds)]
    });
    const found = Array.isArray(students) ? students : [];
    if (!found.length) return badRequest(res, 'Không tìm thấy học viên.');
    const { moved } = await addStudentsToGroup(group, found);

    return res.status(200).json({
      success: true,
      added: found.length,
      moved,
      notFound: studentIds.length - found.length
    });
  });
}

const CLOSE_AT_SQL_HINT = 'Database chưa có cột "Mở đến" (close_at). Chạy file SUPABASE_VSTEP_CLOSE_AT.sql trong Supabase SQL Editor rồi thử lại.';

function checkOrder(fromIso, dueIso, closeIso) {
  const t = (v) => (v ? Date.parse(v) : null);
  const from = t(fromIso);
  const due = t(dueIso);
  const close = t(closeIso);
  if (from !== null && due !== null && from >= due) return '"Mở từ" phải trước deadline.';
  if (close !== null && due !== null && close < due) return '"Mở đến" phải sau (hoặc bằng) deadline.';
  if (close !== null && from !== null && close <= from) return '"Mở đến" phải sau "Mở từ".';
  return '';
}

export async function assignContents(req, res) {
  return withAdmin(req, res, 'POST', async (body, admin) => {
    const group = await findGroup(body.groupId);
    if (!group) return res.status(404).json({ error: 'Không tìm thấy nhóm ôn.' });
    const contentIds = uuidList(body.contentIds);
    if (!contentIds) return badRequest(res, 'Chọn ít nhất 1 bộ đề.');
    const availableFrom = parseInstant(body.availableFrom);
    const dueAt = parseInstant(body.dueAt);
    const closeAt = parseInstant(body.closeAt);
    if (availableFrom === undefined || dueAt === undefined || closeAt === undefined) {
      return badRequest(res, 'Ngày giờ không hợp lệ.');
    }
    const keepEmpty = body.keepEmpty === true;

    // Nhóm ôn chỉ nhận bộ đề Ôn thi, nhóm học chỉ nhận bài học Lớp học.
    const flow = FLOW_BY_GROUP_KIND[groupKindOf(group)];
    const contents = await selectFrom('vstep_contents', {
      columns: 'id,flow',
      filters: [inFilter('id', contentIds)]
    });
    const practiceIds = (contents || []).filter((c) => c.flow === flow).map((c) => c.id);
    if (!practiceIds.length) {
      return badRequest(res, flow === 'practice' ? 'Bộ đề không thuộc khu Ôn thi.' : 'Bài không thuộc khu Lớp học.');
    }

    const existing = await selectGroupAssignments({
      filters: [{ column: 'class_id', value: group.id }, inFilter('content_id', practiceIds)]
    });
    const existingByContent = new Map((existing || []).map((a) => [a.content_id, a]));
    const now = new Date().toISOString();

    // Lịch cuối cùng của từng bài (sửa hàng loạt: ô trống = giữ giá trị cũ của bài đó).
    const scheduleFor = (old) => {
      const pick = (value, key) => (keepEmpty && value === null ? (old?.[key] ?? null) : value);
      return {
        available_from: pick(availableFrom, 'available_from'),
        due_at: pick(dueAt, 'due_at'),
        close_at: pick(closeAt, 'close_at')
      };
    };
    for (const id of practiceIds) {
      const sched = scheduleFor(existingByContent.get(id));
      const problem = checkOrder(sched.available_from, sched.due_at, sched.close_at);
      if (problem) return badRequest(res, problem);
    }

    // Bài đã giao: ghi lịch mới của TẤT CẢ trong 1 request (upsert theo id) — sửa hàng
    // loạt nhiều bài có lịch cũ khác nhau không vượt giới hạn 50 subrequest của Cloudflare.
    const updateRows = practiceIds.filter((cid) => existingByContent.has(cid)).map((cid) => {
      const old = existingByContent.get(cid);
      return { id: old.id, class_id: group.id, content_id: cid, ...scheduleFor(old), status: 'active', updated_at: now };
    });
    const toInsert = practiceIds.filter((id) => !existingByContent.has(id));
    const withoutCloseAt = (row) => {
      const { close_at: _ignored, ...rest } = row;
      return rest;
    };

    const write = async (useCloseAt) => {
      if (updateRows.length) {
        await upsertInto('vstep_assignments', useCloseAt ? updateRows : updateRows.map(withoutCloseAt), { onConflict: 'id' });
      }
      if (toInsert.length) {
        const sched = scheduleFor(null);
        const row = { ...sched, status: 'active', updated_at: now, class_id: group.id, assigned_by: admin?.id || null };
        await insertInto('vstep_assignments', toInsert.map((contentId) => ({
          ...(useCloseAt ? row : withoutCloseAt(row)),
          content_id: contentId
        })));
      }
    };
    try {
      await write(true);
    } catch (error) {
      if (!isMissingCloseAtError(error)) throw error;
      // Chưa chạy SQL thêm cột: vẫn lưu Mở từ / Deadline; chỉ báo lỗi nếu admin có nhập "Mở đến".
      if (closeAt) return badRequest(res, CLOSE_AT_SQL_HINT);
      await write(false);
    }
    return res.status(200).json({
      success: true,
      assigned: toInsert.length,
      updated: practiceIds.length - toInsert.length
    });
  });
}

export async function unassignContent(req, res) {
  return withAdmin(req, res, 'POST', async (body) => {
    const group = await findGroup(body.groupId);
    if (!group) return res.status(404).json({ error: 'Không tìm thấy nhóm ôn.' });
    const contentIds = Array.isArray(body.contentIds) ? uuidList(body.contentIds) : uuidList([body.contentId]);
    if (!contentIds) return badRequest(res, 'Thiếu bộ đề.');
    await deleteFrom('vstep_assignments', [
      { column: 'class_id', value: group.id },
      inFilter('content_id', contentIds)
    ]);
    return res.status(200).json({ success: true, removed: contentIds.length });
  });
}
