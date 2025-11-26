# Hướng Dẫn Commit và Push Code

## Cách 1: Sử dụng script tự động (Khuyến nghị)

### Windows (PowerShell):
```powershell
cd minihippofuill/aptiskey.com
.\git-commit-push.ps1 "Thêm chức năng quản lý bài học"
```

### Linux/Mac (Bash):
```bash
cd minihippofuill/aptiskey.com
chmod +x git-commit-push.sh
./git-commit-push.sh "Thêm chức năng quản lý bài học"
```

## Cách 2: Thủ công

```bash
# 1. Kiểm tra thay đổi
git status

# 2. Thêm tất cả file đã thay đổi
git add .

# 3. Commit với message
git commit -m "Thêm chức năng quản lý bài học"

# 4. Push lên remote
git push
```

## Các file đã thay đổi trong lần này:

- `admin_lessons.html` - Trang quản lý bài học
- `js/admin_lessons.js` - Logic quản lý bài học
- `api/lessons/get.js` - API lấy thông tin bài học
- `api/lessons/delete.js` - API xóa bài học
- `api/upload-lesson.js` - Cập nhật hỗ trợ tên file tùy chỉnh
- `js/admin_upload_v2.js` - Cập nhật upload với lesson ID
- `admin_upload.html` - Thêm nút quản lý bài học

## Lưu ý:

- Script sẽ tự động kiểm tra có thay đổi không trước khi commit
- Nếu không có thay đổi, script sẽ không làm gì
- Bạn có thể tùy chỉnh commit message khi chạy script

