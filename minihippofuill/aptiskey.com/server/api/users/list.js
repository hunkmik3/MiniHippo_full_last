import { verifyAdminRequest } from '../_utils/auth.js';
import { selectFrom } from '../_utils/supabase.js';

const CLASSROOM_COURSES = new Set(['lớp học', 'lớp ôn thi', 'lop hoc', 'lop on thi']);

function normalize(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function resolveLearningProgram(user = {}) {
  const directProgram =
    normalize(user.learning_program) ||
    normalize(user.learningProgram) ||
    normalize(user.program);

  if (directProgram === 'classroom' || directProgram === 'class') {
    return 'classroom';
  }
  if (directProgram === 'aptis') {
    return 'aptis';
  }

  const normalizedCourse = normalize(user.course);
  if (CLASSROOM_COURSES.has(normalizedCourse)) {
    return 'classroom';
  }

  return 'aptis';
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res
      .status(adminCheck.status)
      .json({ error: adminCheck.error || 'Unauthorized' });
  }

  try {
    const group =
      typeof req.query.group === 'string' ? req.query.group.trim().toLowerCase() : 'all';

    const users = await selectFrom('users', {
      order: { column: 'created_at', asc: false }
    });

    let deviceCounts = {};
    try {
      const deviceRows = await selectFrom('user_devices', {
        columns: 'user_id,status'
      });
      if (Array.isArray(deviceRows)) {
        deviceCounts = deviceRows.reduce((acc, device) => {
          if (device.status === 'revoked') {
            return acc;
          }
          acc[device.user_id] = (acc[device.user_id] || 0) + 1;
          return acc;
        }, {});
      }
    } catch (deviceError) {
      console.warn('Unable to load device counts:', deviceError);
    }

    const enrichedUsers = Array.isArray(users)
      ? users.map(user => ({
          ...user,
          learning_program: resolveLearningProgram(user),
          device_count: deviceCounts[user.id] || 0
        }))
      : [];

    const filteredUsers =
      group === 'classroom'
        ? enrichedUsers.filter(user => user.learning_program === 'classroom')
        : group === 'aptis'
          ? enrichedUsers.filter(user => user.learning_program === 'aptis')
          : enrichedUsers;

    return res.status(200).json({ users: filteredUsers });
  } catch (error) {
    console.error('Users list error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể tải người dùng'
    });
  }
}
