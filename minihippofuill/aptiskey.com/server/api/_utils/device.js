import { insertInto, selectFrom, updateTable } from './supabase.js';

const DEFAULT_DEVICE_LIMIT = Number(process.env.USER_DEVICE_LIMIT || 2);

function normalizeDeviceName(name) {
  if (!name || typeof name !== 'string') {
    return 'Thiết bị chưa đặt tên';
  }
  return name.length > 120 ? `${name.slice(0, 117)}...` : name;
}

function normalizeUserAgent(agent) {
  if (!agent || typeof agent !== 'string') {
    return null;
  }
  return agent.length > 255 ? agent.slice(0, 255) : agent;
}

export function resolveDeviceLimit(profile) {
  const limit = Number(profile?.device_limit);
  if (Number.isFinite(limit) && limit > 0) {
    return limit;
  }
  return DEFAULT_DEVICE_LIMIT;
}

export async function ensureDeviceAccess({
  userId,
  deviceId,
  deviceName,
  userAgent,
  deviceLimit
}) {
  if (!userId || !deviceId) {
    const error = new Error('Thiếu thông tin thiết bị để xác thực');
    error.status = 400;
    throw error;
  }

  const normalizedName = normalizeDeviceName(deviceName);
  const normalizedAgent = normalizeUserAgent(userAgent);
  const now = new Date().toISOString();

  try {
    const existing = await selectFrom('user_devices', {
      filters: [
        { column: 'user_id', value: userId },
        { column: 'device_id', value: deviceId }
      ],
      single: true
    });

    if (existing) {
      await updateTable(
        'user_devices',
        [{ column: 'id', value: existing.id }],
        {
          last_seen: now,
          device_name: normalizedName,
          user_agent: normalizedAgent,
          status: 'active'
        }
      );
      return existing;
    }
  } catch (error) {
    if (error.status !== 406) {
      throw error;
    }
  }

  const limit = Number.isFinite(deviceLimit) && deviceLimit > 0 ? deviceLimit : DEFAULT_DEVICE_LIMIT;

  const activeDevices = await selectFrom('user_devices', {
    filters: [
      { column: 'user_id', value: userId },
      { column: 'status', operator: 'neq', value: 'revoked' }
    ]
  });

  if (Array.isArray(activeDevices) && activeDevices.length >= limit) {
    const error = new Error('Tài khoản đã đạt giới hạn thiết bị cho phép');
    error.status = 403;
    error.code = 'DEVICE_LIMIT';
    error.details = { limit };
    throw error;
  }

  await insertInto('user_devices', [
    {
      user_id: userId,
      device_id: deviceId,
      device_name: normalizedName,
      user_agent: normalizedAgent,
      last_seen: now,
      status: 'active'
    }
  ]);
}

export async function listUserDevices(userId) {
  if (!userId) {
    throw new Error('Thiếu userId');
  }
  return selectFrom('user_devices', {
    filters: [{ column: 'user_id', value: userId }],
    order: { column: 'last_seen', asc: false }
  });
}

export async function revokeDevice(userId, deviceRecordId) {
  if (!userId || !deviceRecordId) {
    throw new Error('Thiếu thông tin thiết bị để xóa');
  }

  await updateTable(
    'user_devices',
    [
      { column: 'user_id', value: userId },
      { column: 'id', value: deviceRecordId }
    ],
    {
      status: 'revoked'
    }
  );
}

export async function revokeAllDevices(userId) {
  if (!userId) {
    throw new Error('Thiếu userId');
  }

  await updateTable(
    'user_devices',
    [{ column: 'user_id', value: userId }],
    {
      status: 'revoked'
    }
  );
}





