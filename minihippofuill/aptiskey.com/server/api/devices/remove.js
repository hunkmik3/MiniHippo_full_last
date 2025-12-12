import { verifyAdminRequest } from '../_utils/auth.js';
import { parseJsonBody } from '../_utils/parseBody.js';
import { revokeDevice } from '../_utils/device.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res
      .status(adminCheck.status || 401)
      .json({ error: adminCheck.error || 'Unauthorized' });
  }

  let body;
  try {
    body = await parseJsonBody(req);
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Invalid JSON payload' });
  }

  const { userId, deviceRecordId } = body || {};
  if (!userId || !deviceRecordId) {
    return res.status(400).json({ error: 'Thiếu thông tin thiết bị cần xóa' });
  }

  try {
    await revokeDevice(userId, deviceRecordId);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('devices remove error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể xóa thiết bị'
    });
  }
}










