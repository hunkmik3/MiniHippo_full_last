import { verifyAdminRequest } from '../_utils/auth.js';
import { selectFrom } from '../_utils/supabase.js';

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
          device_count: deviceCounts[user.id] || 0
        }))
      : [];

    return res.status(200).json({ users: enrichedUsers });
  } catch (error) {
    console.error('Users list error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể tải người dùng'
    });
  }
}

