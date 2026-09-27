// API admin cho NHÓM ÔN khu Ôn thi VSTEP (xem _onthi_groups.js).
//   GET  /api/vstep/groups/list               nhóm + thành viên + bộ đề đã giao
//   POST /api/vstep/groups/save               { id?, title, band, notes }
//   POST /api/vstep/groups/delete             { id }
//   POST /api/vstep/groups/members            { groupId, studentIds, action: 'add'|'remove' }
//   POST /api/vstep/groups/assign             { groupId, contentIds, availableFrom, dueAt }
//   POST /api/vstep/groups/unassign           { groupId, contentId }
import { parseJsonBody } from '../_utils/parseBody.js';
import { verifyAdminRequest } from '../_utils/auth.js';
import { deleteFrom, insertInto, selectFrom, updateTable, upsertInto } from '../_utils/supabase.js';
import { vstepSchemaErrorResponse } from './_utils.js';
import { ONTHI_GROUP_KIND } from './_onthi_groups.js';

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

async function findGroup(id) {
  if (!UUID_RE.test(String(id || ''))) return null;
  return selectFrom('vstep_classes', {
    filters: [
      { column: 'id', value: id },
      { column: 'schedule->>kind', value: ONTHI_GROUP_KIND }
    ],
    single: true
  });
}

export async function listGroups(req, res) {
  return withAdmin(req, res, 'GET', async () => {
    const groups = await selectFrom('vstep_classes', {
      columns: 'id,title,band,notes,status,created_at,updated_at',
      filters: [
        { column: 'schedule->>kind', value: ONTHI_GROUP_KIND },
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
        selectFrom('vstep_assignments', {
          columns: 'id,class_id,content_id,available_from,due_at',
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

    const [created] = await insertInto('vstep_classes', [{
      title,
      band,
      notes,
      status: 'active',
      schedule: { kind: ONTHI_GROUP_KIND },
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
    const foundIds = found.map((s) => s.id);

    // Mỗi học viên chỉ ở 1 nhóm ôn: rời nhóm ôn cũ (lớp khu Học tập giữ nguyên).
    const current = await selectFrom('vstep_class_students', {
      columns: 'id,class_id',
      filters: [inFilter('student_id', foundIds)]
    });
    const otherClassIds = [...new Set((current || []).map((m) => m.class_id).filter((id) => id !== group.id))];
    let moved = 0;
    if (otherClassIds.length) {
      const otherGroups = await selectFrom('vstep_classes', {
        columns: 'id',
        filters: [inFilter('id', otherClassIds), { column: 'schedule->>kind', value: ONTHI_GROUP_KIND }]
      });
      const otherGroupIds = new Set((otherGroups || []).map((g) => g.id));
      const toRemove = (current || []).filter((m) => otherGroupIds.has(m.class_id)).map((m) => m.id);
      if (toRemove.length) {
        await deleteFrom('vstep_class_students', [inFilter('id', toRemove)]);
        moved = toRemove.length;
      }
    }

    await upsertInto('vstep_class_students', found.map((s) => ({
      class_id: group.id,
      student_id: s.id,
      user_id: s.user_id || null,
      status: 'active',
      updated_at: new Date().toISOString()
    })), { onConflict: 'class_id,student_id' });

    return res.status(200).json({
      success: true,
      added: found.length,
      moved,
      notFound: studentIds.length - found.length
    });
  });
}

export async function assignContents(req, res) {
  return withAdmin(req, res, 'POST', async (body, admin) => {
    const group = await findGroup(body.groupId);
    if (!group) return res.status(404).json({ error: 'Không tìm thấy nhóm ôn.' });
    const contentIds = uuidList(body.contentIds);
    if (!contentIds) return badRequest(res, 'Chọn ít nhất 1 bộ đề.');
    const availableFrom = parseInstant(body.availableFrom);
    const dueAt = parseInstant(body.dueAt);
    if (availableFrom === undefined || dueAt === undefined) return badRequest(res, 'Ngày giờ không hợp lệ.');
    if (availableFrom && dueAt && Date.parse(availableFrom) >= Date.parse(dueAt)) {
      return badRequest(res, '"Mở từ" phải trước deadline.');
    }

    const contents = await selectFrom('vstep_contents', {
      columns: 'id,flow',
      filters: [inFilter('id', contentIds)]
    });
    const practiceIds = (contents || []).filter((c) => c.flow === 'practice').map((c) => c.id);
    if (!practiceIds.length) return badRequest(res, 'Bộ đề không thuộc khu Ôn thi.');

    const existing = await selectFrom('vstep_assignments', {
      columns: 'id,content_id',
      filters: [{ column: 'class_id', value: group.id }, inFilter('content_id', practiceIds)]
    });
    const existingByContent = new Map((existing || []).map((a) => [a.content_id, a.id]));
    const now = new Date().toISOString();
    const schedule = { available_from: availableFrom, due_at: dueAt, status: 'active', updated_at: now };

    const toUpdate = practiceIds.filter((id) => existingByContent.has(id)).map((id) => existingByContent.get(id));
    if (toUpdate.length) {
      await updateTable('vstep_assignments', [inFilter('id', toUpdate)], schedule);
    }
    const toInsert = practiceIds.filter((id) => !existingByContent.has(id));
    if (toInsert.length) {
      await insertInto('vstep_assignments', toInsert.map((contentId) => ({
        ...schedule,
        class_id: group.id,
        content_id: contentId,
        assigned_by: admin?.id || null
      })));
    }
    return res.status(200).json({ success: true, assigned: toInsert.length, updated: toUpdate.length });
  });
}

export async function unassignContent(req, res) {
  return withAdmin(req, res, 'POST', async (body) => {
    const group = await findGroup(body.groupId);
    if (!group) return res.status(404).json({ error: 'Không tìm thấy nhóm ôn.' });
    if (!UUID_RE.test(String(body.contentId || ''))) return badRequest(res, 'Thiếu bộ đề.');
    await deleteFrom('vstep_assignments', [
      { column: 'class_id', value: group.id },
      { column: 'content_id', value: body.contentId }
    ]);
    return res.status(200).json({ success: true });
  });
}
