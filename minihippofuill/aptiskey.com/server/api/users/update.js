import { parseJsonBody } from '../_utils/parseBody.js';
import { verifyAdminRequest } from '../_utils/auth.js';
import { updateTable } from '../_utils/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT' && req.method !== 'PATCH') {
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

  const {
    id,
    email,
    username,
    status,
    role,
    accountCode,
    fullName,
    phone,
    deviceLimit,
    expiresAt,
    notes
  } = body || {};

  if (!id) {
    return res.status(400).json({ error: 'Thiếu user id' });
  }

  const payload = {};
  if (email) payload.email = email.trim();
  if (username) payload.username = username.trim();
  if (status) payload.status = status;
  if (role) payload.role = role;
  if (typeof accountCode !== 'undefined') {
    payload.account_code = accountCode ? accountCode.trim() : null;
  }
  if (typeof fullName !== 'undefined') {
    payload.full_name = fullName ? fullName.trim() : null;
  }
  if (typeof phone !== 'undefined') {
    payload.phone_number = phone ? phone.trim() : null;
  }
  if (typeof deviceLimit !== 'undefined') {
    payload.device_limit = Number(deviceLimit) || 1;
  }
  if (typeof expiresAt !== 'undefined') {
    payload.expires_at = expiresAt || null;
  }
  if (typeof notes !== 'undefined') {
    payload.notes = notes || null;
  }

  if (!Object.keys(payload).length) {
    return res.status(400).json({ error: 'Không có dữ liệu cần cập nhật' });
  }

  try {
    const updated = await updateTable(
      'users',
      [{ column: 'id', value: id }],
      payload
    );
    return res.status(200).json({ success: true, user: Array.isArray(updated) ? updated[0] : updated });
  } catch (error) {
    console.error('User update error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể cập nhật người dùng'
    });
  }
}






