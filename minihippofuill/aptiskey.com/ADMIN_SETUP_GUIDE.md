# Hướng Dẫn Setup Admin - Mini Hippo

## 📋 Tổng Quan

Hệ thống admin cho phép:
- ✅ Upload bài học lên GitHub
- ✅ Quản lý người dùng
- ✅ Xem danh sách bài học đã upload

## 🚀 Bước 1: Chạy SQL Script trong Supabase

### 1.1 Mở Supabase SQL Editor
1. Vào Supabase Dashboard: https://supabase.com/dashboard
2. Chọn project của bạn
3. Vào **SQL Editor** (menu bên trái)
4. Click **New query**

### 1.2 Chạy SQL Script
1. Mở file `supabase_setup.sql` trong project
2. Copy **TOÀN BỘ** nội dung file
3. Paste vào SQL Editor trong Supabase
4. Click **Run** (hoặc nhấn `Ctrl+Enter`)
5. Kiểm tra kết quả: Should see "Success. No rows returned"

### 1.3 Kiểm Tra Tables Đã Tạo
1. Vào **Table Editor** (menu bên trái)
2. Kiểm tra có 2 tables:
   - ✅ `users` - Bảng người dùng
   - ✅ `lessons` - Bảng bài học

---

## 👤 Bước 2: Tạo Admin User

### 2.1 Tạo User trong Supabase Auth
1. Vào **Authentication** → **Users** (menu bên trái)
2. Click **Add user** → **Create new user**
3. Điền thông tin:
   - **Email**: `admin@minihippo.com` (hoặc email bạn muốn)
   - **Password**: Tạo password mạnh (lưu lại!)
   - **Auto Confirm User**: ✅ **Bật** (quan trọng!)
4. Click **Create user**

### 2.2 Set Role = 'admin'
1. Vào **Table Editor** → **users** table
2. Tìm user vừa tạo (theo email)
3. Click vào row đó để edit
4. Tìm cột `role`
5. Đổi từ `user` thành `admin`
6. Click **Save** (hoặc nhấn Enter)

**Lưu ý**: Nếu không thấy user trong `users` table, đợi vài giây rồi refresh lại (trigger tự động tạo record).

---

## ⚙️ Bước 3: Cấu Hình Environment Variables trong Vercel

### 3.1 Vào Vercel Dashboard
1. Vào https://vercel.com/dashboard
2. Chọn project của bạn
3. Vào **Settings** → **Environment Variables**

### 3.2 Thêm GitHub Variables
Thêm 3 biến sau:

**1. GITHUB_TOKEN**
- **Name**: `GITHUB_TOKEN`
- **Value**: Token bạn đã tạo trước đó (ghp_...)
- **Environment**: Production, Preview, Development (chọn cả 3)

**2. GITHUB_OWNER**
- **Name**: `GITHUB_OWNER`
- **Value**: `hunkmik3` (username GitHub của bạn)
- **Environment**: Production, Preview, Development

**3. GITHUB_REPO**
- **Name**: `GITHUB_REPO`
- **Value**: `MiniHippo_full_last` (tên repository)
- **Environment**: Production, Preview, Development

### 3.3 Thêm Supabase Variables
Thêm 3 biến sau:

**1. SUPABASE_URL**
- **Name**: `SUPABASE_URL`
- **Value**: `https://bydmstfxyplrfmlfkddl.supabase.co` (URL project của bạn)
- **Environment**: Production, Preview, Development

**2. SUPABASE_ANON_KEY**
- **Name**: `SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5ZG1zdGZ4eXBscmZtbGZrZGRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1ODU0NTUsImV4cCI6MjA3ODE2MTQ1NX0.jJ-JDueuwLS5tCDddY5S4JkgWLmDLGCw5b0BE77-F38`
- **Environment**: Production, Preview, Development

**3. SUPABASE_SERVICE_KEY**
- **Name**: `SUPABASE_SERVICE_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5ZG1zdGZ4eXBscmZtbGZrZGRsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjU4NTQ1NSwiZXhwIjoyMDc4MTYxNDU1fQ.c7z5GmBkv5-WZEwGiv8N727ri49rGqVU_LxN-JPbWGc`
- **Environment**: Production, Preview, Development

### 3.4 Redeploy
Sau khi thêm tất cả environment variables:
1. Vào **Deployments**
2. Click vào deployment mới nhất
3. Click **Redeploy** (hoặc đợi Vercel tự động deploy lại khi có commit mới)

---

## 🧪 Bước 4: Test Hệ Thống

### 4.1 Test Login
1. Mở URL Vercel của bạn (ví dụ: `https://your-project.vercel.app`)
2. Bạn sẽ tự động được redirect đến `/login.html`
3. Đăng nhập với admin account:
   - **Email**: Email bạn đã tạo ở bước 2.1
   - **Password**: Password bạn đã tạo
4. Nếu thành công, sẽ redirect về `/home.html`

### 4.2 Test Admin Page
1. Vào `/admin_upload.html` (hoặc click link trong sidebar nếu có)
2. Nếu chưa đăng nhập, sẽ redirect về `/login.html`
3. Nếu đã đăng nhập nhưng không phải admin, sẽ hiện lỗi "Admin access required"
4. Nếu là admin, sẽ thấy trang admin upload

### 4.3 Test Upload Lesson
1. Trong trang admin, chọn **Part 1** (hoặc bất kỳ part nào)
2. Click **Thêm bộ đề mới**
3. Điền thông tin test:
   - **Title**: "Test Lesson 1"
   - **Topic**: "Test Topic"
   - Thêm ít nhất 1 question với đầy đủ thông tin
4. Click **Lưu bộ đề**
5. Click **Upload to GitHub**
6. Đợi upload (có thể mất 10-30 giây)
7. Nếu thành công, sẽ hiện alert với commit URL
8. Click **OK** và mở commit URL để verify

### 4.4 Test Lesson Display
1. Vào `/reading_question-2.html`
2. Scroll xuống phần **Part 1** (hoặc part bạn vừa upload)
3. Bạn sẽ thấy bài học vừa upload hiển thị dưới button Part
4. Click vào bài học để test navigation

---

## ✅ Checklist Hoàn Thành

- [ ] Đã chạy SQL script trong Supabase
- [ ] Đã tạo admin user trong Supabase Auth
- [ ] Đã set role = 'admin' cho user
- [ ] Đã thêm tất cả environment variables trong Vercel
- [ ] Đã redeploy Vercel
- [ ] Đã test login thành công
- [ ] Đã test admin page truy cập được
- [ ] Đã test upload lesson thành công
- [ ] Đã test lesson hiển thị trên frontend

---

## 🐛 Troubleshooting

### Lỗi "GitHub configuration missing"
- ✅ Kiểm tra environment variables trong Vercel đã được set chưa
- ✅ Kiểm tra tên biến có đúng không (GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO)
- ✅ Redeploy sau khi thêm environment variables

### Lỗi "Supabase configuration missing"
- ✅ Kiểm tra SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY
- ✅ Kiểm tra keys có copy đầy đủ không (không bị cắt)

### Lỗi "Invalid email or password"
- ✅ Kiểm tra user đã được tạo trong Supabase Auth chưa
- ✅ Kiểm tra password có đúng không
- ✅ Kiểm tra "Auto Confirm User" đã bật chưa

### Lỗi "Admin access required"
- ✅ Kiểm tra user có role = 'admin' trong users table chưa
- ✅ Kiểm tra user đã đăng nhập chưa (có token trong localStorage)
- ✅ Thử logout và login lại

### Upload thành công nhưng không commit vào GitHub
- ✅ Kiểm tra GitHub token có đúng scope `repo` không
- ✅ Kiểm tra repository name và owner có đúng không
- ✅ Kiểm tra branch name (main hoặc master)

---

## 🎉 Hoàn Thành!

Sau khi hoàn thành tất cả các bước trên, hệ thống admin của bạn đã sẵn sàng sử dụng!

**Next Steps:**
1. Tạo thêm user accounts cho người dùng
2. Upload các bài học thực tế
3. Monitor usage và performance

