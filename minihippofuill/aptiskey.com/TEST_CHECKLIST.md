# Test Checklist - Sau Khi Deploy

## ✅ Bước 1: Test Login (2 phút)

1. Mở URL Vercel của bạn: `https://your-project.vercel.app`
2. Bạn sẽ tự động được redirect đến `/login.html`
3. Đăng nhập với admin account:
   - **Email**: Email bạn đã tạo trong Supabase
   - **Password**: Password bạn đã tạo
4. **Kết quả mong đợi**: 
   - ✅ Nếu thành công → Redirect về `/home.html`
   - ❌ Nếu lỗi → Kiểm tra console (F12) để xem lỗi gì

**Nếu lỗi "Invalid email or password":**
- Kiểm tra user đã được tạo trong Supabase Auth chưa
- Kiểm tra "Auto Confirm User" đã bật chưa
- Thử reset password trong Supabase

**Nếu lỗi "Supabase configuration missing":**
- Kiểm tra environment variables trong Vercel đã được set chưa
- Kiểm tra SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY

---

## ✅ Bước 2: Test Admin Page (1 phút)

1. Sau khi login thành công, vào `/admin_upload.html`
2. **Kết quả mong đợi**:
   - ✅ Nếu là admin → Thấy trang admin upload
   - ❌ Nếu không phải admin → Hiện lỗi "Admin access required"
   - ❌ Nếu chưa login → Redirect về `/login.html`

**Nếu lỗi "Admin access required":**
- Kiểm tra user có `role = 'admin'` trong Supabase `users` table chưa
- Thử logout và login lại

---

## ✅ Bước 3: Test Upload Lesson (5 phút)

1. Trong trang admin, chọn **Part 1** (hoặc bất kỳ part nào)
2. Click **Thêm bộ đề mới**
3. Điền thông tin test:
   - **Title**: "Test Lesson 1"
   - **Topic**: "Test Topic"
   - Thêm ít nhất 1 question với đầy đủ thông tin:
     - Question text
     - Options (nếu có)
     - Correct answer
4. Click **Lưu bộ đề**
5. Click **Upload to GitHub**
6. **Kết quả mong đợi**:
   - ✅ Nếu thành công → Hiện alert với commit URL
   - ❌ Nếu lỗi → Kiểm tra console (F12) để xem lỗi gì

**Nếu lỗi "GitHub configuration missing":**
- Kiểm tra GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO đã được set chưa
- Kiểm tra GitHub token có đúng scope `repo` không

**Nếu lỗi "Upload failed":**
- Kiểm tra GitHub token có còn valid không
- Kiểm tra repository name và owner có đúng không
- Kiểm tra branch name (main hoặc master)

---

## ✅ Bước 4: Test Lesson Display (2 phút)

1. Vào `/reading_question-2.html`
2. Scroll xuống phần **Part 1** (hoặc part bạn vừa upload)
3. **Kết quả mong đợi**:
   - ✅ Thấy bài học vừa upload hiển thị dưới button Part
   - ❌ Nếu không thấy → Kiểm tra:
     - Supabase `lessons` table có data chưa
     - API `/api/lessons/list?part=1` có trả về data không
     - Browser console có lỗi JavaScript không

4. Click vào bài học để test navigation
5. **Kết quả mong đợi**:
   - ✅ Redirect đến trang lesson tương ứng
   - ✅ Lesson hiển thị đúng với data đã upload

---

## ✅ Bước 5: Verify GitHub Commit (1 phút)

1. Mở GitHub repository: `https://github.com/hunkmik3/MiniHippo_full_last`
2. Vào file `js/reading_question/reading_question1.js` (hoặc part tương ứng)
3. **Kết quả mong đợi**:
   - ✅ Code đã được commit
   - ✅ Commit message đúng format
   - ✅ Code có format đúng

---

## ✅ Bước 6: Verify Vercel Auto-Deploy (1 phút)

1. Sau khi commit trên GitHub, đợi 1-2 phút
2. Vào Vercel Dashboard → Deployments
3. **Kết quả mong đợi**:
   - ✅ Thấy deployment mới được trigger tự động
   - ✅ Deployment thành công

---

## 🐛 Troubleshooting

### Lỗi khi login:
- Kiểm tra Supabase Auth có user chưa
- Kiểm tra environment variables
- Kiểm tra browser console (F12)

### Lỗi khi upload:
- Kiểm tra GitHub token
- Kiểm tra repository permissions
- Kiểm tra network tab trong browser console

### Lesson không hiển thị:
- Kiểm tra Supabase `lessons` table
- Kiểm tra API response
- Kiểm tra JavaScript console

---

## 🎉 Hoàn Thành!

Nếu tất cả các bước trên đều pass, hệ thống của bạn đã sẵn sàng sử dụng!

