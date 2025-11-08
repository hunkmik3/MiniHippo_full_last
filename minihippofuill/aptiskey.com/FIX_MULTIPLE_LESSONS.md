# Hướng Dẫn Sửa Lỗi: Chỉ Hiển Thị 1 Bài Học Cho Mỗi Part

## Vấn Đề
Khi upload nhiều bài học cho cùng một part, chỉ có 1 bài học được hiển thị trong database.

## Nguyên Nhân
Database có constraint `UNIQUE(part, file_path)` trong bảng `lessons`. Constraint này ngăn không cho tạo nhiều records với cùng `part` và `file_path`.

## Giải Pháp

### Cách 1: Xóa Constraint UNIQUE (Khuyến nghị)

1. Vào Supabase Dashboard → SQL Editor
2. Chạy script sau:

```sql
-- Xóa constraint UNIQUE
ALTER TABLE lessons DROP CONSTRAINT IF EXISTS lessons_part_file_path_key;
```

Hoặc chạy file `supabase_fix_unique_constraint.sql` đã được tạo sẵn.

### Cách 2: Kiểm Tra Tên Constraint

Nếu không biết tên constraint, chạy query sau để tìm:

```sql
SELECT constraint_name 
FROM information_schema.table_constraints 
WHERE table_name = 'lessons' 
  AND constraint_type = 'UNIQUE'
  AND table_schema = 'public';
```

Sau đó xóa constraint với tên tìm được:

```sql
ALTER TABLE lessons DROP CONSTRAINT <tên_constraint>;
```

## Sau Khi Sửa

1. Upload lại các bài học
2. Mỗi bài học sẽ có `file_path` unique (có timestamp)
3. Database sẽ cho phép nhiều bài học cho cùng một part

## Lưu Ý

- Code đã được cập nhật để tạo `file_path` unique với format: `reading_question1_lesson_<timestamp>.js`
- Nếu vẫn gặp lỗi, kiểm tra logs trong Vercel để xem chi tiết lỗi
- Có thể cần redeploy lại Vercel function sau khi sửa code

