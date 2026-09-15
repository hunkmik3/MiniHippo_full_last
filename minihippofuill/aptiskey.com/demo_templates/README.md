# Giao diện mẫu Aptis — bàn giao cho dev web bán khoá

Bộ giao diện mẫu **tĩnh, bấm được**, dùng để dựng bài học thử Aptis trên web bán khoá học.

- **HTML/CSS/JS thuần** — không jQuery, không React, không build step. Mở thẳng file là chạy.
- Mỗi kỹ năng một file, gồm đủ **3 màn**: danh sách bài → làm bài → kết quả.
- Mặc định chạy bằng **dữ liệu mẫu nhúng sẵn**, bật một tham số là lấy **dữ liệu thật realtime** từ Mini Hippo.

```
demo_templates/
├─ index.html          ← trang mở thử cả 4 kỹ năng
├─ reading.html        ← Reading  (trắc nghiệm điền từ)
├─ listening.html      ← Listening (audio + trắc nghiệm)
├─ writing.html        ← Writing  (viết + đếm từ)
├─ speaking.html       ← Speaking (ghi âm bằng micro)
└─ assets/
   ├─ mh-demo.css      ← style dùng chung (đổi màu ở :root)
   └─ mh-demo.js       ← client gọi API + hàm chấm điểm
```

---

## 1. Chạy thử ngay

Mở trực tiếp `index.html` bằng trình duyệt → chạy bằng dữ liệu mẫu, không cần mạng, không cần key.

## 2. Bật dữ liệu thật (realtime)

Thêm 3 tham số vào URL:

```
reading.html?live=1&base=https://minihippo.edu.vn&key=<DEMO_API_KEY>
```

| Tham số | Ý nghĩa |
|---|---|
| `live=1` | Gọi API thật thay vì dữ liệu mẫu |
| `base` | Domain Mini Hippo |
| `key` | API key do Mini Hippo cấp |

Hoặc sửa cứng trong `assets/mh-demo.js`:

```js
var config = {
  baseUrl: 'https://minihippo.edu.vn',
  apiKey:  'KEY_DO_MINI_HIPPO_CAP',
  live:    true
};
```

Nếu gọi API lỗi, template **tự quay về dữ liệu mẫu** và hiện thông báo — trang bán khoá không bao giờ bị trắng.

---

## 3. Dữ liệu lấy từ đâu

Aptis có 2 kiểu nội dung, template đã xử lý sẵn cả hai:

| Kỹ năng | Nguồn | Hàm trong `mh-demo.js` |
|---|---|---|
| Reading | Học theo câu hỏi | `MH.listLessons('1')` → `MH.getLesson(id)` |
| Listening | Học theo câu hỏi | `MH.listLessons('listening_1_13')` → `MH.getLesson(id)` |
| Writing | Học theo câu hỏi | `MH.listLessons('writing')` → `MH.getLesson(id)` |
| Speaking | Bộ đề | `MH.listSets('speaking')` → `MH.getSet(id)` |

Các `part` khác dùng được tương tự:

- Reading: `'1'`, `'2'`, `'4'`, `'5'`
- Listening: `'listening_1_13'`, `'listening_14'`, `'listening_15'`, `'listening_16_17'`
- Writing: `'writing'`

> ⚠️ Mỗi part có **cấu trúc dữ liệu riêng**. Template hiện dùng `part 1` (Reading) và `listening_1_13` (Listening) vì đây là dạng trắc nghiệm chuẩn, dễ hiển thị nhất. Đổi sang part khác thì cần chỉnh phần đọc dữ liệu trong hàm `boot()` cho khớp.

Chi tiết endpoint xem file `DEMO_API.md`.

---

## 4. Tuỳ biến giao diện

Đổi màu cho khớp web bán khoá — sửa đúng khối này trong `assets/mh-demo.css`:

```css
:root {
  --mh-primary: #1d4ed8;   /* màu chính */
  --mh-ok:      #16a34a;   /* câu đúng */
  --mh-bad:     #dc2626;   /* câu sai */
  --mh-radius:  14px;      /* bo góc */
}
```

Toàn bộ class đều có tiền tố `mh-` nên **không đụng CSS sẵn có** của web bán khoá.

---

## 5. Lưu ý

- Bài học thử **không lưu kết quả** về hệ thống — chấm và hiện điểm ngay trên trình duyệt.
- **Writing/Speaking không chấm tự động** ở bản học thử. Đây là chỗ đặt lời mời đăng ký (đã có sẵn dòng gợi ý ở màn kết quả).
- **Speaking cần HTTPS** (hoặc `localhost`) mới xin được quyền micro — đây là quy định của trình duyệt.
- Audio trong dữ liệu thật có thể là đường dẫn tương đối; template tự ghép với `base` nên cần truyền đúng `base`.
