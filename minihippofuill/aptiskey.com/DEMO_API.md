# Bài học thử Aptis — tài liệu cho dev web bán khoá

Tài liệu bàn giao cho dev tích hợp bài học thử (Aptis) vào web bán khoá học.

Có 2 cách dùng, **nên dùng cách 1**:

1. **Nhúng iframe** — dùng luôn giao diện trang thi thật của Mini Hippo. Nhanh nhất, không phụ thuộc stack, tự động cập nhật khi Mini Hippo sửa đề/giao diện.
2. **Gọi API lấy dữ liệu** — nếu muốn tự dựng giao diện riêng.

Bài học thử **không cần đăng nhập** và **không lưu kết quả** về hệ thống: chấm và hiển thị điểm ngay trên trình duyệt.

---

## 1. Nhúng iframe (khuyến nghị)

```html
<iframe
  src="https://minihippo.edu.vn/reading_bode_set.html?demo=1&set=<SET_ID>&key=<DEMO_API_KEY>"
  width="100%" height="900" style="border:0"
  allow="microphone"></iframe>
```

Trang theo từng kỹ năng:

| Kỹ năng | Trang nhúng |
|---|---|
| Reading | `reading_bode_set.html` |
| Listening | `listening_bode_set.html` |
| Speaking | `speaking_question.html` |
| Writing | `writing_question.html` (dùng `lesson=<tên file>` thay cho `set=`) |

Tham số:

| Tham số | Bắt buộc | Ý nghĩa |
|---|---|---|
| `demo` | ✅ | Luôn để `1` để bật chế độ học thử |
| `set` | ✅ (trừ Writing) | Id bộ đề, lấy từ API `/api/practice_sets/demo-sets` |
| `lesson` | ✅ (Writing) | Tên file bài học writing |
| `key` | ✅ | `DEMO_API_KEY` |
| `cta` | — | Link đăng ký hiện ở màn hình kết quả |
| `ctaLabel` | — | Chữ trên nút đăng ký (mặc định “Đăng ký học thật”) |

Lưu ý:
- `allow="microphone"` **bắt buộc** với Speaking (bài nói cần ghi âm).
- Chế độ demo tự ẩn header/sidebar/footer nên iframe chỉ hiển thị phần làm bài.
- Nên để `height` từ 900px trở lên; đề Reading/Listening khá dài.

**Lấy nhanh mã nhúng:** mở `https://minihippo.edu.vn/demo.html?key=<DEMO_API_KEY>` — trang này liệt kê các bài học thử kèm nút xem thử và mã nhúng copy được.

---

## 2. API lấy dữ liệu

Base URL: `https://minihippo.edu.vn/api/demo`

Xác thực: gắn API key theo **một trong hai cách**
- Header: `X-Demo-Key: <DEMO_API_KEY>`
- Hoặc query: `?key=<DEMO_API_KEY>`

Chỉ hỗ trợ `GET`. Có CORS (`Access-Control-Allow-Origin`) cho các domain được cấu hình trong `DEMO_ALLOWED_ORIGINS`.

### GET `/api/practice_sets/demo-sets`

Danh sách bài học thử. Không kèm nội dung đề, không kèm đáp án.

Query tuỳ chọn: `skill=reading|listening|writing|speaking`

```json
{
  "sets": [
    {
      "id": "a47ea4a8-d9db-4a60-9e13-5b66e624fe03",
      "title": "READING ĐỀ 18",
      "description": "",
      "skill": "reading",
      "durationMinutes": 35
    }
  ]
}
```

### GET `/api/practice_sets/demo-set?id=<SET_ID>`

Nội dung đầy đủ của 1 bài học thử (gồm câu hỏi và đáp án, để chấm tại chỗ).

```json
{
  "set": {
    "id": "...",
    "title": "READING ĐỀ 18",
    "type": "reading",
    "duration_minutes": 35,
    "data": { "part1": {}, "part2": {}, "part4": {}, "part5": {} }
  },
  "skill": "reading",
  "demo": true
}
```

### GET `/api/lessons/demo-lessons`

Danh sách bài **"học theo câu hỏi"** (Reading / Listening / Writing).

Query tuỳ chọn `part`:
- Reading: `1`, `2`, `4`, `5`
- Listening: `listening_1_13`, `listening_14`, `listening_15`, `listening_16_17`
- Writing: `writing`

```json
{ "lessons": [ { "id": "...", "part": "1", "title": "READING ĐỀ 4", "topic": null, "numSets": 18 } ] }
```

### GET `/api/lessons/demo-lesson?id=<LESSON_ID>`

Nội dung bài "học theo câu hỏi", **đã chuyển sang JSON**.

Bài loại này vốn lưu trên GitHub dưới dạng file JavaScript (mỗi part một cấu trúc
khác nhau). Endpoint này chạy file đó trong sandbox rồi bóc ra dữ liệu thuần, nên
bên ngoài dùng như JSON bình thường.

```json
{
  "lesson": { "id": "...", "part": "1", "title": "READING ĐỀ 4", "numSets": 18 },
  "data": {
    "questions1_1": [
      { "questionStart": "I imagine you don’t want to",
        "answerOptions": ["miss", "love", "remember"],
        "questionEnd": "this.",
        "correctAnswer": "miss" }
    ]
  },
  "variables": ["questions1_1", "questions1_2"],
  "demo": true
}
```

> ⚠️ Mỗi part có cấu trúc riêng (`questions1_1`, `question2Content_1`, `question4Text_1`,
> `options_1`, `question15Data_1`, `listeningQuestions1`, `key_id`/`club_name`...).
> Trường `variables` liệt kê đúng các biến có trong bài để dò.

---

## 2b. Cấu hình allowlist bài học

| Biến | Ý nghĩa |
|---|---|
| `DEMO_LESSON_IDS` | Allowlist id bài "học theo câu hỏi" (bảng `lessons`) |

### Mã lỗi

| Mã | Ý nghĩa |
|---|---|
| `401` | Thiếu hoặc sai API key |
| `403` | Domain không nằm trong allowlist, **hoặc** bộ đề không mở cho học thử |
| `404` | Không tìm thấy bộ đề |
| `503` | Máy chủ chưa cấu hình `DEMO_API_KEY` |

---

## 3. Cấu hình phía Mini Hippo (Vercel → Environment Variables)

| Biến | Ví dụ | Ý nghĩa |
|---|---|---|
| `DEMO_API_KEY` | `a1b2c3...` | Key cấp cho dev web bán khoá |
| `DEMO_SET_IDS` | `id1,id2,id3` | **Allowlist** bộ đề (`practice_sets`) mở cho học thử |
| `DEMO_LESSON_IDS` | `id1,id2` | **Allowlist** bài "học theo câu hỏi" (`lessons`) |
| `DEMO_ALLOWED_ORIGINS` | `https://khoahoc.example.com` | Domain được phép gọi API (để trống = chỉ chặn bằng key) |

Đổi biến xong cần **redeploy** để có hiệu lực.

---

## 4. Những điểm đã chốt về bảo mật

- **Chỉ các bộ đề trong `DEMO_SET_IDS`** mới lấy được. Id ngoài danh sách bị trả `403` và **không hề truy vấn database**.
- API demo **chỉ đọc**, không có endpoint ghi.
- Bài học thử **không gọi AI chấm bài** (`/api/ask` bị chặn ở chế độ demo) để tránh phát sinh chi phí AI và bị lạm dụng trên trang công khai. Người dùng thấy lời mời đăng ký thay cho nhận xét AI.
- API key đặt ở frontend nên **có thể bị lộ** — đây là rào chống gọi bừa, không phải bảo mật tuyệt đối. Thiệt hại tối đa nếu lộ key chỉ giới hạn trong mấy bộ đề demo.
- Do chấm tại chỗ trên trình duyệt nên **đáp án nằm trong dữ liệu trả về** (xem được ở tab Network). Vì vậy chỉ đưa đề demo vào `DEMO_SET_IDS`, **tuyệt đối không đưa đề thi thật của học viên**.
