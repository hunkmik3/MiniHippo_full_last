# Quick Start - Setup Admin (5 phút)

## 🚀 Bắt Đầu Ngay

### Bước 1: Chạy SQL Script (2 phút)
1. Vào Supabase Dashboard → SQL Editor
2. Copy toàn bộ nội dung file `supabase_setup.sql`
3. Paste vào SQL Editor
4. Click **Run**

### Bước 2: Tạo Admin User (1 phút)
1. Vào Supabase → Authentication → Users
2. Click **Add user** → **Create new user**
3. Điền email và password (lưu lại!)
4. ✅ Bật **Auto Confirm User**
5. Click **Create user**
6. Vào Table Editor → `users` table
7. Tìm user vừa tạo, đổi `role` = `admin`

### Bước 3: Cấu Hình Vercel (2 phút)
1. Vào Vercel Dashboard → Settings → Environment Variables
2. Thêm 6 biến sau (thay thế bằng giá trị thực tế của bạn):

```
GITHUB_TOKEN=your_github_token_here
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repo_name
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

**Lưu ý**: Xem file `ADMIN_SETUP_GUIDE.md` để biết cách lấy các giá trị này.

3. Click **Save** cho mỗi biến
4. Vào Deployments → Redeploy

### Bước 4: Test (1 phút)
1. Mở URL Vercel của bạn
2. Đăng nhập với admin account
3. Vào `/admin_upload.html`
4. Test upload một bài học

---

## ✅ Xong!

Xem hướng dẫn chi tiết trong `ADMIN_SETUP_GUIDE.md`

