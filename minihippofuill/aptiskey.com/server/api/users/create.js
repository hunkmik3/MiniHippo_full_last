import { parseJsonBody } from '../_utils/parseBody.js';
import { verifyAdminRequest } from '../_utils/auth.js';
import { callSupabaseAuth, insertInto, selectFrom, updateTable } from '../_utils/supabase.js';
import { resolveDeviceLimit } from '../_utils/device.js';

function generatePassword() {
  const random = Math.random().toString(36).slice(-8);
  const fallback = Math.random().toString(36).slice(-10);
  return (random || fallback || 'MiniHippo123!').toUpperCase();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminCheck = await verifyAdminRequest(req);
  if (!adminCheck.success) {
    return res
      .status(adminCheck.status)
      .json({ error: adminCheck.error || 'Unauthorized' });
  }

  try {
    const body = await parseJsonBody(req);
    const {
      email,
      password,
      username,
      role = 'user',
      status = 'active',
      accountCode,
      fullName,
      phone,
      deviceLimit,
      expiresAt,
      notes
    } = body || {};

    const trimmedAccountCode = accountCode?.trim();
    let resolvedEmail = email?.trim();
    if (!resolvedEmail && trimmedAccountCode) {
      resolvedEmail = `${trimmedAccountCode.toLowerCase()}@students.minihippo.local`;
    }

    if (!resolvedEmail) {
      return res.status(400).json({ error: 'Email hoặc mã tài khoản là bắt buộc' });
    }

    let resolvedPassword = password?.trim();
    let isGeneratedPassword = false;
    if (!resolvedPassword) {
      resolvedPassword = generatePassword();
      isGeneratedPassword = true;
    }

    const usernameFallback =
      username ||
      trimmedAccountCode ||
      resolvedEmail.split('@')[0] ||
      `user_${Date.now()}`;

    const existingUser = await selectFrom('users', {
      filters: [{ column: 'email', value: resolvedEmail }],
      single: true
    });
    if (existingUser) {
      return res.status(409).json({ error: 'Email đã tồn tại trong hệ thống' });
    }

    if (trimmedAccountCode) {
      const existingAccount = await selectFrom('users', {
        filters: [{ column: 'account_code', value: trimmedAccountCode }],
        single: true
      });
      if (existingAccount) {
        return res.status(409).json({ error: 'Mã tài khoản đã tồn tại' });
      }
    }

    const authUser = await callSupabaseAuth(
      'admin/users',
      {
        method: 'POST',
        body: JSON.stringify({
          email: resolvedEmail,
          password: resolvedPassword,
          email_confirm: true,
          user_metadata: { username: usernameFallback }
        })
      },
      { useAnonKey: false }
    );
    console.log('Supabase admin/users response:', authUser);

    let record;
    try {
      const [inserted] = await insertInto('users', [
      {
        id: authUser.id,
        email: resolvedEmail,
        username: usernameFallback,
        role,
        status,
        account_code: trimmedAccountCode || null,
        full_name: fullName || null,
        phone_number: phone || null,
        device_limit: Number(deviceLimit) || resolveDeviceLimit(),
        expires_at: expiresAt || null,
        notes: notes || null
      }
    ]);
      record = inserted;
    } catch (dbError) {
      const isDuplicateKey =
        dbError?.details?.code === '23505' ||
        dbError?.details?.message?.includes('duplicate key value') ||
        dbError?.message?.includes('duplicate key value');

      if (isDuplicateKey) {
        const detailMessage =
          dbError?.details?.detail ||
          dbError?.details?.message ||
          dbError?.message ||
          '';

        // Trùng username (thường là mã tài khoản) -> báo lỗi rõ ràng cho người dùng
        if (detailMessage.includes('(username)')) {
          return res.status(409).json({
            error: 'Mã tài khoản đã tồn tại, vui lòng chọn mã khác'
          });
        }

        // Trùng email ở DB (phòng khi vượt qua bước kiểm tra trước đó)
        if (detailMessage.includes('(email)')) {
          return res.status(409).json({
            error: 'Email đã tồn tại trong hệ thống'
          });
        }

        // Trường hợp trùng khóa nhưng đã có row với cùng id -> cố gắng cập nhật lại
        console.warn(
          `Duplicate key when inserting user ${authUser.id}, attempting to update existing row`
        );
        try {
          const [updated] = await updateTable(
            'users',
            [{ column: 'id', value: authUser.id }],
            {
              email: resolvedEmail,
              username: usernameFallback,
              role,
              status,
              account_code: trimmedAccountCode || null,
              full_name: fullName || null,
              phone_number: phone || null,
              device_limit: Number(deviceLimit) || resolveDeviceLimit(),
              expires_at: expiresAt || null,
              notes: notes || null
            }
          );

          if (updated) {
            record = updated;
            console.log(`Updated existing user ${authUser.id} after duplicate conflict`);
            return res.status(200).json({
              success: true,
              user: record,
              temporaryPassword: isGeneratedPassword ? resolvedPassword : null,
              note: 'Tài khoản đã tồn tại trước đó nên hệ thống cập nhật lại thông tin'
            });
          }
        } catch (updateError) {
          console.error('Failed to update existing user after duplicate conflict', updateError);
        }
      }

      // Nếu đến đây vẫn chưa xử lý được, rollback user auth để tránh tài khoản mồ côi
      if (authUser?.id) {
        try {
          await callSupabaseAuth(
            `admin/users/${authUser.id}`,
            { method: 'DELETE' },
            { useAnonKey: false }
          );
        } catch (cleanupError) {
          console.warn('Failed to rollback auth user:', cleanupError.message);
        }
      }
      throw dbError;
    }

    return res.status(201).json({
      success: true,
      user: record,
      temporaryPassword: isGeneratedPassword ? resolvedPassword : null
    });
  } catch (error) {
    console.error('User create error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể tạo người dùng',
      details: error.details || null
    });
  }
}
