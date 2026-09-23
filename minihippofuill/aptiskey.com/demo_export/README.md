# Giao diện THẬT Mini Hippo — bản xuất cho web bán khoá

Đây **không phải** giao diện thiết kế lại. Toàn bộ HTML/CSS/JS trong thư mục này
được **copy nguyên từ các trang học/thi đang chạy** trên Mini Hippo (Aptis cả
"học theo câu hỏi" lẫn "học theo bộ đề", và phòng thi VSTEP), nên hiển thị giống
hệt sản phẩm thật. Chỉ khác: **đã gỡ đăng nhập**, **dữ liệu lấy qua API học thử**,
**không lưu kết quả**.

## 1. Cấu hình (1 file duy nhất)

Sửa `js/mh-demo-config.js`:

```js
window.MH_DEMO_CONFIG = {
  force: true,                            // bật sẵn chế độ học thử
  base:  'https://www.minihippo.edu.vn',  // domain Mini Hippo
  key:   'API_KEY_MINI_HIPPO_CAP',
  homeUrl: 'index.html'                   // nút "quay lại" trong bài mở trang này
};
```

## 2. Các trang

| Phần | File | Tham số |
|---|---|---|
| Reading · Part 1 | `reading_part1.html` | `?lesson=…` |
| Reading · Part 2 & 3 | `reading_part2.html` | `?lesson=…` |
| Reading · Part 4 | `reading_part4.html` | `?lesson=…` |
| Reading · Part 5 | `reading_part5.html` | `?lesson=…` |
| Listening · Question 1-13 | `listening_q1_13.html` | `?lesson=…` |
| Listening · Question 14 | `listening_q14.html` | `?lesson=…` |
| Listening · Question 15 | `listening_q15.html` | `?lesson=…` |
| Listening · Question 16 & 17 | `listening_q16_17.html` | `?lesson=…` |
| Speaking · Học theo câu hỏi | `speaking_part.html` | `?set=…` |
| Reading · Bộ đề | `reading.html` | `?set=…` |
| Listening · Bộ đề | `listening.html` | `?set=…` |
| Speaking · Bộ đề | `speaking.html` | `?set=…` |
| Writing · Bộ đề | `writing.html` | `?lesson=…` |
| VSTEP · Phòng thi | `vstep.html` | `?set=…` |

**Không cần tự ghép tham số**: mỗi bài trong API catalog có sẵn trường
`embedUrl` (vd `reading_part1.html?lesson=78935751-…`), đường dẫn tương đối
so với thư mục này:

- Aptis: `GET {base}/api/lessons/demo-catalog` → `skills[].modes[].groups[].items[].embedUrl`
- VSTEP: `GET {base}/api/vstep/demo/catalog` → `groups[].items[].embedUrl`

Mở `index.html` để xem toàn bộ danh mục và bấm thử từng bài.

## 3. Nhúng vào web bán khoá

```html
<iframe src="/demo_export/{embedUrl}"
        width="100%" height="900" style="border:0"
        allow="microphone; camera; fullscreen; autoplay" allowfullscreen></iframe>
```

- `microphone`: Speaking (Aptis + VSTEP) ghi âm.
- `camera` + `fullscreen`: phòng thi VSTEP kiểm tra webcam và vào chế độ toàn màn hình như thi thật.
- Cần chạy trên **HTTPS** (hoặc localhost) thì trình duyệt mới cho dùng micro/webcam.

**Nút rời bài** (quay lại danh sách, về trang chủ, hết bài): trang gửi
`postMessage` lên trang cha rồi chuyển sang `homeUrl`:

```js
window.addEventListener('message', (e) => {
  if (e.data && e.data.source === 'minihippo-demo' && e.data.type === 'exit') {
    // vd đóng popup chứa iframe, quay về danh sách khoá học...
  }
});
```

Muốn tự xử lý hoàn toàn thì đặt `homeUrl: ''` (trang đứng yên, chỉ gửi message).

## 4. Cấu trúc

```
demo_export/
├─ index.html          danh mục toàn bộ bài (lấy từ API catalog)
├─ reading_part*.html  listening_q*.html  speaking_part.html   ← học theo câu hỏi
├─ reading.html  listening.html  speaking.html  writing.html   ← học theo bộ đề
├─ vstep.html                                                  ← phòng thi VSTEP
├─ css/   CSS gốc của từng trang + demo_embed.css
└─ js/    mh-demo-config.js  demo_embed.js  <engine gốc từng trang>
```

## 5. Lưu ý

- **Domain của web bán khoá phải được Mini Hippo cho phép** (biến
  `DEMO_ALLOWED_ORIGINS` phía Mini Hippo). Chưa cho phép thì trình duyệt chặn
  (lỗi CORS) → trang báo không tải được bài. Gửi Mini Hippo domain chính xác,
  vd `https://nightowl.edu.vn`.
- **Không sửa tay các file .html/.js** — chúng được sinh tự động bằng
  `tools/build_demo_export.mjs` bên phía Mini Hippo. Trang gốc đổi thì Mini Hippo
  chạy lại script và gửi bản mới.
- Audio/ảnh có đường dẫn tương đối được `demo_embed.js` tự ghép `base` → phải
  khai báo `base` đúng.
- Bài học thử **không lưu kết quả**, **không gọi AI chấm bài**: Reading/Listening
  chấm tại chỗ trên trình duyệt; Writing/Speaking nộp xong chỉ hiện thông báo hoàn
  thành (ghi âm không được tải lên máy chủ).
- API key nằm trong `js/mh-demo-config.js` nên ai mở trang cũng xem được — đây là
  key chỉ đọc nội dung bài học thử, không truy cập được dữ liệu học viên.
- Bootstrap nạp từ CDN; nếu web bán khoá đã có Bootstrap thì bỏ dòng CDN trong
  từng file để tránh nạp 2 lần.
