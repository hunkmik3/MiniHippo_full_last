# Vercel Deployment Setup

## Vấn đề: Giao diện bị lỗi khi deploy

Nguyên nhân chính là **Root Directory** chưa được cấu hình đúng trong Vercel.

## Giải pháp:

### Bước 1: Cấu hình Root Directory trong Vercel Dashboard

1. Vào **Vercel Dashboard** → Chọn project của bạn
2. Vào **Settings** → **General**
3. Tìm phần **Root Directory**
4. Đặt giá trị: `minihippofuill/aptiskey.com`
5. Click **Save**

### Bước 2: Redeploy

Sau khi cấu hình Root Directory:
1. Vào **Deployments**
2. Click vào deployment mới nhất
3. Click **Redeploy** (hoặc đợi Vercel tự động deploy lại)

### Bước 3: Kiểm tra

Sau khi deploy xong, kiểm tra:
- ✅ CSS files load đúng (không bị 404)
- ✅ JavaScript files load đúng
- ✅ Giao diện hiển thị giống như local
- ✅ Footer và buttons hiển thị đúng

## Lưu ý:

- **Root Directory** phải là `minihippofuill/aptiskey.com` (không có dấu `/` ở đầu)
- Sau khi thay đổi Root Directory, Vercel sẽ tự động trigger một deployment mới
- Nếu vẫn có vấn đề, kiểm tra lại đường dẫn CSS/JS trong browser console (F12)

## Đã sửa:

✅ Sửa tất cả đường dẫn CDN từ relative (`../cdn.jsdelivr.net`) sang absolute (`https://cdn.jsdelivr.net`)
✅ Sửa đường dẫn Bootstrap CSS và JS
✅ Sửa đường dẫn Bootstrap Icons
✅ Sửa đường dẫn SortableJS
✅ Sửa đường dẫn jQuery
✅ Xóa các script ads không cần thiết

