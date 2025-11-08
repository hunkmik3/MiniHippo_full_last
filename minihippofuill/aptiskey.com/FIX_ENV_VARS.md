# Fix: Supabase Configuration Missing

## 🔍 Vấn Đề

Lỗi "Supabase configuration missing" và 500 Internal Server Error xảy ra khi environment variables không được load đúng trong Vercel.

## ✅ Giải Pháp

### Bước 1: Kiểm Tra Environment Variables

1. Vào **Vercel Dashboard** → Chọn project của bạn
2. Vào **Settings** → **Environment Variables**
3. Kiểm tra có đủ 6 biến sau:
   - `GITHUB_TOKEN`
   - `GITHUB_OWNER`
   - `GITHUB_REPO`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`

### Bước 2: Kiểm Tra Environment Selection

**QUAN TRỌNG**: Mỗi biến phải được chọn cho **cả 3 environments**:

1. Click vào từng biến để edit
2. Kiểm tra phần **Environment** có được chọn:
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development**

3. Nếu chưa chọn đủ, click để chọn cả 3
4. Click **Save**

### Bước 3: Redeploy (BẮT BUỘC)

Sau khi thêm/sửa environment variables, **BẮT BUỘC** phải redeploy:

1. Vào **Deployments**
2. Click vào deployment mới nhất
3. Click **Redeploy** (hoặc click 3 chấm → Redeploy)
4. Chọn **Use existing Build Cache** (nếu có)
5. Click **Redeploy**
6. Đợi deployment hoàn thành (1-2 phút)

### Bước 4: Kiểm Tra Lại

1. Sau khi redeploy xong, refresh trang login
2. Thử đăng nhập lại
3. Nếu vẫn lỗi, kiểm tra:
   - Environment variables có đúng giá trị không
   - Có chọn đủ 3 environments không
   - Đã redeploy chưa

---

## 🐛 Troubleshooting

### Vẫn lỗi sau khi redeploy?

1. **Kiểm tra giá trị environment variables:**
   - `SUPABASE_URL` phải là: `https://bydmstfxyplrfmlfkddl.supabase.co`
   - `SUPABASE_SERVICE_KEY` phải là key dài (bắt đầu với `eyJhbGc...`)
   - Không có khoảng trắng thừa ở đầu/cuối

2. **Kiểm tra trong Vercel Logs:**
   - Vào **Deployments** → Click vào deployment mới nhất
   - Vào tab **Functions** → Click vào `api/auth/login`
   - Xem logs để thấy lỗi chi tiết

3. **Thử xóa và thêm lại environment variables:**
   - Xóa tất cả 6 biến
   - Thêm lại từng biến một
   - Đảm bảo chọn cả 3 environments
   - Save và redeploy

---

## 📝 Checklist

- [ ] Đã kiểm tra có đủ 6 environment variables
- [ ] Đã chọn cả 3 environments cho mỗi biến
- [ ] Đã click Save cho mỗi biến
- [ ] Đã redeploy sau khi thêm/sửa
- [ ] Đã đợi deployment hoàn thành
- [ ] Đã refresh trang và test lại

---

## ⚠️ Lưu Ý

- **Environment variables chỉ có hiệu lực sau khi redeploy**
- **Phải chọn đủ 3 environments** (Production, Preview, Development)
- **Kiểm tra không có khoảng trắng thừa** trong giá trị

