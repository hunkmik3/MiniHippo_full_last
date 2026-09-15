# Giao diện THẬT Aptis — bản xuất cho web bán khoá

Đây **không phải** giao diện thiết kế lại. Toàn bộ HTML/CSS/JS trong thư mục này
được **copy nguyên từ trang thi Aptis đang chạy**, nên hiển thị giống hệt sản phẩm thật.
Chỉ khác 2 điểm: **đã gỡ phần đăng nhập** và **dữ liệu lấy qua API học thử**.

## 1. Cấu hình (1 file duy nhất)

Sửa `js/mh-demo-config.js`:

```js
window.MH_DEMO_CONFIG = {
  force: true,                        // bật sẵn chế độ học thử
  base:  'https://minihippo.edu.vn',  // domain Mini Hippo
  key:   'API_KEY_MINI_HIPPO_CAP'
};
```

## 2. Mở bài

| Kỹ năng | File | Tham số |
|---|---|---|
| Reading | `reading.html` | `?set=<SET_ID>` |
| Listening | `listening.html` | `?set=<SET_ID>` |
| Speaking | `speaking.html` | `?set=<SET_ID>` |
| Writing | `writing.html` | `?lesson=<LESSON_FILE>` |

Lấy danh sách id: `GET {base}/api/demo/sets?key=...` và `GET {base}/api/demo/lessons?key=...`
(xem `DEMO_API.md`).

Mở `index.html` để bấm thử nhanh.

## 3. Nhúng vào web bán khoá

```html
<iframe src="/demo_export/reading.html?set=<SET_ID>"
        width="100%" height="900" style="border:0" allow="microphone"></iframe>
```

Hoặc copy thẳng markup trong các file `.html` vào template của web bán khoá —
nhớ mang theo `css/` và `js/` kèm theo.

## 4. Cấu trúc

```
demo_export/
├─ index.html                 mở thử nhanh
├─ reading.html  listening.html  speaking.html  writing.html
├─ css/  lesson-ui.css + <kỹ năng>key.css + demo_embed.css
└─ js/   mh-demo-config.js  demo_embed.js  <engine từng kỹ năng>
```

## 5. Lưu ý

- **Không sửa tay các file .html** — chúng được sinh tự động bằng
  `tools/build_demo_export.mjs` bên phía Mini Hippo. Trang gốc đổi thì chạy lại
  script để xuất bản mới.
- Audio/ảnh trong đề là **đường dẫn tương đối**; `demo_embed.js` tự ghép `base`
  vào nên phải khai báo `base` đúng.
- **Speaking cần HTTPS** (hoặc localhost) mới xin được quyền micro.
- Bài học thử **không lưu kết quả**, **không gọi AI chấm bài** — chấm tại chỗ trên
  trình duyệt. Writing/Speaking không có điểm tự động (chỗ mời đăng ký).
- Bootstrap nạp từ CDN; nếu web bán khoá đã có Bootstrap thì bỏ dòng CDN trong
  từng file để tránh nạp 2 lần.
