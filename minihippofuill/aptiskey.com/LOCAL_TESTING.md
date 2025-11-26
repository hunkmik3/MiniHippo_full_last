# Hướng Dẫn Test Local

## Bước 1: Cài đặt Vercel CLI

```bash
npm install -g vercel
```

Hoặc nếu dùng yarn:
```bash
yarn global add vercel
```

## Bước 2: Tạo file .env.local

Tạo file `.env.local` trong thư mục `aptiskey.com` với nội dung:

```env
GITHUB_TOKEN=your_github_token_here
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repo_name
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

**Lưu ý**: Thay thế các giá trị bằng thông tin thực tế của bạn.

## Bước 3: Chạy Vercel Dev Server

Mở terminal trong thư mục `aptiskey.com` và chạy:

```bash
vercel dev
```

Lần đầu tiên, Vercel sẽ hỏi:
- Set up and develop? → Chọn **Y**
- Which scope? → Chọn scope của bạn
- Link to existing project? → Chọn **N** (hoặc **Y** nếu đã có project)
- What's your project's name? → Nhập tên project
- In which directory is your code located? → Nhập `./` hoặc để mặc định

Sau đó server sẽ chạy tại: `http://localhost:3000`

## Bước 4: Test các tính năng

### Test Admin Upload:
1. Mở `http://localhost:3000/admin_upload.html`
2. Đăng nhập với admin account
3. Thử upload một bài học
4. Kiểm tra xem có upload được nhiều bài học trên cùng 1 part không

### Test Hiển thị Bài học:
1. Mở `http://localhost:3000/admin_lessons.html`
2. Click "Xem" trên một bài học
3. Kiểm tra xem bài học có hiển thị đúng không
4. Thử chọn bài học từ dropdown selector

### Test Dynamic Loading:
1. Mở `http://localhost:3000/reading_question1.html`
2. Kiểm tra xem có hiển thị lesson selector không
3. Chọn một lesson từ dropdown
4. Kiểm tra xem lesson có load đúng không

## Lưu ý quan trọng:

1. **GitHub Upload**: Khi test local, upload lên GitHub vẫn sẽ hoạt động (nếu có GITHUB_TOKEN). File sẽ được commit vào repo thật.

2. **Supabase**: Database sẽ dùng Supabase thật (không phải local). Đảm bảo SUPABASE_URL và keys đúng.

3. **File Path**: Khi upload, file sẽ được lưu vào GitHub repo thật. Nếu muốn test mà không commit, có thể tạm thời comment phần upload GitHub.

4. **Cache**: Nếu thấy code không update, thử:
   - Hard refresh browser (Ctrl+Shift+R hoặc Cmd+Shift+R)
   - Xóa cache browser
   - Restart Vercel dev server

## Troubleshooting:

### Lỗi "Cannot find module"
```bash
# Đảm bảo đang ở đúng thư mục
cd minihippofuill/aptiskey.com

# Chạy lại vercel dev
vercel dev
```

### Lỗi "Environment variables missing"
- Kiểm tra file `.env.local` có đúng format không
- Đảm bảo tất cả biến môi trường đã được set

### Lỗi API không hoạt động
- Kiểm tra console browser để xem lỗi cụ thể
- Kiểm tra terminal của Vercel dev để xem log
- Đảm bảo API routes đang chạy đúng

## So sánh Local vs Production:

| Tính năng | Local (vercel dev) | Production (Vercel) |
|-----------|-------------------|---------------------|
| API Routes | ✅ Hoạt động | ✅ Hoạt động |
| GitHub Upload | ✅ Hoạt động (real) | ✅ Hoạt động |
| Supabase | ✅ Hoạt động (real) | ✅ Hoạt động |
| Static Files | ✅ Hoạt động | ✅ Hoạt động |
| Hot Reload | ✅ Có | ❌ Không |

## Tips:

1. **Test nhanh**: Chỉ test UI và logic, không cần upload thật lên GitHub mỗi lần
2. **Mock data**: Có thể tạo file test data để test mà không cần database
3. **Console logs**: Dùng `console.log()` để debug, xem trong browser console hoặc Vercel terminal

