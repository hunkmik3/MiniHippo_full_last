# Migration Guide: Part Column từ INTEGER sang TEXT

## Tổng quan
Để hỗ trợ cả Reading parts (1, 2, 4, 5) và Listening parts (listening_1_13, listening_14, etc.), cột `part` trong database cần được đổi từ `INTEGER` sang `TEXT`.

## Các thay đổi đã thực hiện

### 1. Code Changes
- ✅ `api/upload-lesson.js`: 
  - `extractPartFromFilePath()` giờ trả về string cho Reading parts ("1", "2", "4", "5")
  - `extractMetadataFromJS()` hỗ trợ cả string và number cho backward compatibility
- ✅ `js/reading_question_list.js`: Query với string ("1", "2", "4", "5")
- ✅ `js/admin_lessons.js`: Query với string ("1", "2", "4", "5")
- ✅ `api/lessons/list.js`: Đã hỗ trợ URL encoding cho part filter

### 2. Database Migration
File: `supabase_migration_part_to_text.sql`

## Các bước thực hiện

### Bước 1: Chạy Migration Script trong Supabase
1. Mở Supabase Dashboard → SQL Editor
2. Copy và chạy nội dung file `supabase_migration_part_to_text.sql`:

```sql
-- Step 1: Drop the existing constraint
ALTER TABLE lessons DROP CONSTRAINT IF EXISTS lessons_part_check;

-- Step 2: Convert existing integer values to text
UPDATE lessons 
SET part = part::TEXT 
WHERE part IS NOT NULL AND part::TEXT IS NOT NULL;

-- Step 3: Change the column type from INTEGER to TEXT
ALTER TABLE lessons 
ALTER COLUMN part TYPE TEXT USING part::TEXT;

-- Step 4: Recreate index
DROP INDEX IF EXISTS idx_lessons_part;
CREATE INDEX IF NOT EXISTS idx_lessons_part ON lessons(part);
```

### Bước 2: Verify Migration
Sau khi chạy script, kiểm tra:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'lessons' AND column_name = 'part';
```
Kết quả phải là: `data_type = 'text'`

### Bước 3: Test
1. **Reading**: Upload một bài học Reading mới và kiểm tra xem có hiển thị trong `reading_question-2.html` không
2. **Listening**: Upload một bài học Listening mới và kiểm tra xem có hiển thị trong `listening_question.html` không

## Format Part trong Database

Sau migration:
- **Reading parts**: `"1"`, `"2"`, `"4"`, `"5"` (string)
- **Listening parts**: `"listening_1_13"`, `"listening_14"`, `"listening_15"`, `"listening_16_17"` (string)

## Backward Compatibility

Code đã được cập nhật để hỗ trợ cả string và number:
- `extractMetadataFromJS()`: Hỗ trợ cả `case 1:` và `case '1':`
- `reading_question_list.js`: `pageMap` hỗ trợ cả string và number keys

## Lưu ý

- Các bài học Reading cũ (đã upload trước migration) sẽ được tự động convert từ integer sang string
- Không cần upload lại các bài học cũ
- Tất cả bài học mới (cả Reading và Listening) sẽ dùng string format

