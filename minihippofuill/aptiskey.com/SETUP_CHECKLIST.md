# Setup Checklist - Mini Hippo Backend

## ✅ Bước 1: Setup Supabase (15 phút)

### 1.1 Tạo Supabase Project
- [ ] Vào https://supabase.com và đăng ký/đăng nhập
- [ ] Click "New Project"
- [ ] Điền thông tin:
  - Project name: `mini-hippo` (hoặc tên bạn muốn)
  - Database Password: Tạo password mạnh (lưu lại!)
  - Region: Chọn gần nhất
- [ ] Click "Create new project"
- [ ] Đợi project được tạo (2-3 phút)

### 1.2 Lấy API Keys
- [ ] Vào Project Settings → API
- [ ] Copy các thông tin sau:
  - [ ] **Project URL**: `https://xxxxx.supabase.co`
  - [ ] **anon/public key**: `eyJhbGc...` (dài)
  - [ ] **service_role key**: `eyJhbGc...` (dài, secret!)

### 1.3 Tạo Database Tables
- [ ] Vào SQL Editor trong Supabase Dashboard
- [ ] Click "New query"
- [ ] Copy toàn bộ nội dung file `supabase_setup.sql`
- [ ] Paste vào SQL Editor
- [ ] Click "Run" hoặc nhấn Ctrl+Enter
- [ ] Kiểm tra kết quả: Should see "Success. No rows returned"

### 1.4 Tạo Admin User
- [ ] Vào Authentication → Users
- [ ] Click "Add user" → "Create new user"
- [ ] Điền:
  - Email: `admin@minihippo.com` (hoặc email bạn muốn)
  - Password: Tạo password mạnh (lưu lại!)
  - Auto Confirm User: ✅ Bật
- [ ] Click "Create user"
- [ ] Vào Table Editor → `users` table
- [ ] Tìm user vừa tạo (theo email)
- [ ] Click vào row đó để edit
- [ ] Đổi `role` từ `user` thành `admin`
- [ ] Click "Save"

---

## ✅ Bước 2: Setup GitHub (10 phút)

### 2.1 Tạo Personal Access Token
- [ ] Vào GitHub.com → Settings (profile settings, không phải repo settings)
- [ ] Vào Developer settings → Personal access tokens → Tokens (classic)
- [ ] Click "Generate new token" → "Generate new token (classic)"
- [ ] Điền:
  - Note: `Mini Hippo Upload Token`
  - Expiration: `90 days` (hoặc No expiration nếu muốn)
  - Scopes: Chọn ✅ **repo** (full control of private repositories)
- [ ] Click "Generate token"
- [ ] **QUAN TRỌNG**: Copy token ngay (chỉ hiển thị 1 lần!)
- [ ] Lưu token vào nơi an toàn

### 2.2 Lấy Repository Info
- [ ] Mở repository của bạn trên GitHub
- [ ] Copy:
  - [ ] **Owner**: Username của bạn (ví dụ: `yourusername`)
  - [ ] **Repo name**: Tên repo (ví dụ: `mini-hippo`)

---

## ✅ Bước 3: Deploy lên Vercel (20 phút)

### 3.1 Connect Repository
- [ ] Vào https://vercel.com và đăng nhập với GitHub
- [ ] Click "Add New..." → "Project"
- [ ] Chọn repository của bạn
- [ ] Click "Import"

### 3.2 Configure Project
- [ ] Project Name: Giữ nguyên hoặc đổi tên
- [ ] Framework Preset: Không cần chọn (static site)
- [ ] Root Directory: `minihippofuill/aptiskey.com` (nếu code ở trong folder này)
- [ ] Build Command: Để trống
- [ ] Output Directory: Để trống hoặc `.`
- [ ] Install Command: Để trống

### 3.3 Add Environment Variables
- [ ] Scroll xuống phần "Environment Variables"
- [ ] Thêm từng biến sau:

**GitHub Variables:**
- [ ] Name: `GITHUB_TOKEN`
  - Value: Token bạn đã tạo ở bước 2.1
- [ ] Name: `GITHUB_OWNER`
  - Value: GitHub username của bạn
- [ ] Name: `GITHUB_REPO`
  - Value: Tên repository

**Supabase Variables:**
- [ ] Name: `SUPABASE_URL`
  - Value: Project URL từ bước 1.2
- [ ] Name: `SUPABASE_ANON_KEY`
  - Value: anon/public key từ bước 1.2
- [ ] Name: `SUPABASE_SERVICE_KEY`
  - Value: service_role key từ bước 1.2

- [ ] Click "Deploy"

### 3.4 Wait for Deployment
- [ ] Đợi Vercel build và deploy (2-5 phút)
- [ ] Khi xong, bạn sẽ có URL: `https://your-project.vercel.app`

---

## ✅ Bước 4: Test Hệ Thống (15 phút)

### 4.1 Test Login
- [ ] Mở URL Vercel của bạn
- [ ] Bạn sẽ tự động được redirect đến `login.html`
- [ ] Đăng nhập với admin account đã tạo:
  - Email: Email bạn đã tạo ở bước 1.4
  - Password: Password bạn đã tạo
- [ ] Nếu thành công, sẽ redirect về `home.html`

### 4.2 Test Admin Upload
- [ ] Vào `admin_upload.html` (hoặc click link trong sidebar nếu có)
- [ ] Chọn Part 1 (hoặc bất kỳ part nào)
- [ ] Click "Thêm bộ đề mới"
- [ ] Điền thông tin test:
  - Title: "Test Lesson"
  - Thêm ít nhất 1 question với đầy đủ thông tin
- [ ] Click "Lưu bộ đề"
- [ ] Click "Upload to GitHub"
- [ ] Đợi upload (có thể mất 10-30 giây)
- [ ] Nếu thành công, sẽ hiện alert với commit URL
- [ ] Click "OK" và mở commit URL để verify

### 4.3 Test Lesson Display
- [ ] Vào `reading_question-2.html`
- [ ] Scroll xuống phần Part bạn vừa upload
- [ ] Bạn sẽ thấy bài học vừa upload hiển thị dưới button Part
- [ ] Click vào bài học để test navigation

### 4.4 Verify GitHub Commit
- [ ] Mở GitHub repository
- [ ] Vào file `js/reading_question/reading_question1.js` (hoặc part tương ứng)
- [ ] Kiểm tra code đã được commit chưa
- [ ] Kiểm tra commit message

### 4.5 Verify Vercel Auto-Deploy
- [ ] Sau khi commit trên GitHub, đợi 1-2 phút
- [ ] Vercel sẽ tự động detect commit mới và deploy lại
- [ ] Vào Vercel Dashboard → Deployments để xem

---

## ✅ Bước 5: Tạo User Accounts (Optional)

### 5.1 Tạo User qua Admin (Cần tạo admin_users.html)
Hoặc tạo trực tiếp trong Supabase:
- [ ] Vào Supabase → Authentication → Users
- [ ] Click "Add user" → "Create new user"
- [ ] Điền email và password
- [ ] Auto Confirm User: ✅ Bật
- [ ] Click "Create user"
- [ ] User sẽ tự động có role = 'user' (từ trigger)

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
- ✅ Thử reset password trong Supabase

### Lỗi "Admin access required"
- ✅ Kiểm tra user có role = 'admin' trong users table chưa
- ✅ Kiểm tra user đã đăng nhập chưa (có token trong localStorage)

### Lessons không hiển thị
- ✅ Kiểm tra Supabase lessons table có data chưa
- ✅ Kiểm tra API `/api/lessons/list?part=1` có trả về data không
- ✅ Mở Browser Console để xem lỗi JavaScript

### Upload thành công nhưng không commit vào GitHub
- ✅ Kiểm tra GitHub token có đúng scope `repo` không
- ✅ Kiểm tra repository name và owner có đúng không
- ✅ Kiểm tra branch name (main hoặc master)

---

## 📝 Notes

- **GitHub Token**: Có thể expire sau 90 days (nếu chọn), nhớ renew
- **Supabase Free Tier**: 500MB database, đủ cho hàng nghìn users và lessons
- **Vercel Free Tier**: Unlimited deployments, đủ cho production
- **Auto-deploy**: Vercel tự động deploy khi có commit mới trên GitHub

---

## 🎉 Hoàn thành!

Sau khi hoàn thành tất cả các bước trên, hệ thống của bạn đã sẵn sàng sử dụng!

**Next Steps:**
1. Tạo thêm user accounts cho người dùng
2. Upload các bài học thực tế
3. Customize UI/UX nếu cần
4. Monitor usage và performance

