# API nội dung bài học Mini Hippo — tài liệu cho dev web bán khoá

API chỉ đọc, dùng để lấy **toàn bộ nội dung bài học** Aptis và VSTEP (câu hỏi,
đoạn văn, lựa chọn, audio, hình ảnh, đáp án) và dựng lại trên web bán khoá.

Base URL: `https://www.minihippo.edu.vn` *(có `www` — domain không `www` tự chuyển hướng, trình duyệt sẽ chặn
khi gọi kèm header `X-Demo-Key`)*

## Xác thực

Mọi request cần API key, gắn theo **một trong hai cách**:

- Header: `X-Demo-Key: <API_KEY>` *(khuyến nghị)*
- Query: `?key=<API_KEY>`

Chỉ hỗ trợ `GET`.

> 🔒 **Nên gọi API từ backend của bạn**, không gọi thẳng từ trình duyệt. API key
> mở được toàn bộ ngân hàng đề — nếu đặt ở frontend, ai mở DevTools cũng lấy được
> key và tải hết. Gọi từ server thì key được giữ kín.

## Cách dùng: 2 bước

1. Gọi **catalog** → có cả cây bài học đã nhóm sẵn (chỉ metadata, rất nhẹ).
2. Với bài cần hiển thị, chọn 1 trong 2 cách:
   - **Dùng giao diện thật của Mini Hippo** (bộ `demo_export/`, nhúng iframe) → dùng
     **`embedUrl`** của bài, xem mục 3.
   - **Tự dựng giao diện** → gọi **`detailUrl`** để lấy nội dung đầy đủ dạng JSON.

---

## 1. Aptis

### ⭐ GET `/api/lessons/demo-catalog`

**Một lần gọi có đủ cả cây**, nhóm giống hệt menu Mini Hippo:

```
Reading   → Học theo câu hỏi → Part 1 · Part 2 & 3 · Part 4 · Part 5
          → Học theo bộ đề   → Bộ đề Reading
Listening → Học theo câu hỏi → Question 1-13 · 14 · 15 · 16 & 17
          → Học theo bộ đề   → Bộ đề Listening
Writing   → Học theo bộ đề
Speaking  → Học theo câu hỏi · Học theo bộ đề
```

Query tuỳ chọn: `skill=reading|listening|writing|speaking` (bỏ trống = cả 4).

```json
{
  "skills": [{
    "skill": "reading",
    "label": "Reading",
    "modes": [{
      "mode": "by_question",
      "label": "Học theo câu hỏi",
      "groups": [{
        "key": "1",
        "label": "Part 1",
        "count": 1,
        "items": [{
          "id": "78935751-…",
          "title": "READING ĐỀ 4 - Question 1",
          "topic": null,
          "numSets": 18,
          "source": "lesson",
          "detailUrl": "/api/lessons/demo-lesson?id=78935751-…",
          "embedUrl": "reading_part1.html?lesson=78935751-…"
        }]
      }]
    }]
  }],
  "generatedAt": "2026-09-23T10:00:00.000Z"
}
```

Mỗi bài có `source`:
- `lesson` → chi tiết ở `/api/lessons/demo-lesson`
- `set` → chi tiết ở `/api/practice_sets/demo-set`

Cứ gọi thẳng `detailUrl` là đúng, không cần phân biệt.

`embedUrl` = trang giao diện thật tương ứng trong bộ `demo_export/` (đường dẫn tương
đối so với thư mục đó), đã kèm sẵn tham số. Mọi bài đều có — kể cả "học theo câu hỏi".

### GET `/api/lessons/demo-lesson?id=<ID>`

Nội dung 1 bài "học theo câu hỏi" (Reading/Listening) hoặc 1 bộ đề Writing.

Nội dung loại này vốn lưu trên Mini Hippo dưới dạng **file JavaScript**, mỗi part
một cấu trúc riêng. Endpoint đã **chuyển sẵn sang JSON**.

```json
{
  "lesson": { "id": "…", "part": "1", "title": "READING ĐỀ 4 - Question 1", "numSets": 18 },
  "data": {
    "questions1_1": [{
      "questionStart": "I imagine you don’t want to",
      "answerOptions": ["miss", "love", "remember"],
      "questionEnd": "this.",
      "correctAnswer": "miss"
    }]
  },
  "variables": ["questions1_1", "questions1_2", "…"]
}
```

⚠️ **Mỗi part có cấu trúc khác nhau** — đây là định dạng gốc của Mini Hippo:

| Part | Biến dữ liệu chính |
|---|---|
| Reading 1 | `questions1_1`, `questions1_2`… (mảng câu) |
| Reading 2 & 3 | `question2Content_1`… |
| Reading 4 | `question4Text_1`, `question4Content_1`, `correctAnswersQuestion4_1`… |
| Reading 5 | `options_1`, `paragraph_question5_1`… |
| Listening 1-13 | `listeningQuestions1` (mảng câu) |
| Listening 14 | `question14Data_1`… |
| Listening 15 | `question15Data_1`… |
| Listening 16 & 17 | `question16Data` |
| Writing | `key_id`, `club_name`, `questions1`, `questions2`… |

Trường `variables` liệt kê đúng các biến có trong bài.

### GET `/api/practice_sets/demo-set?id=<ID>`

Nội dung 1 bộ đề Reading / Listening / Speaking — nguyên định dạng trang thi
Mini Hippo đang dùng.

```json
{
  "set": {
    "id": "…",
    "title": "READING ĐỀ 18",
    "duration_minutes": 35,
    "data": { "part1": {}, "part2": {}, "part4": {}, "part5": {} }
  },
  "skill": "reading"
}
```

### Danh sách phẳng (không nhóm) — tuỳ chọn

Nếu không cần cây nhóm sẵn:
- `GET /api/lessons/demo-lessons?part=1` — bài "học theo câu hỏi" + Writing
- `GET /api/practice_sets/demo-sets?skill=reading` — bộ đề

---

## 2. VSTEP

### ⭐ GET `/api/vstep/demo/catalog`

Nhóm giống sidebar khu Ôn thi VSTEP:

```
Full Test (bộ đề tổng hợp 4 kỹ năng) → Listening → Reading → Writing → Speaking
```

Query tuỳ chọn: `skill=full_test|listening|reading|writing|speaking`.

```json
{
  "groups": [{
    "key": "full_test",
    "label": "Full Test (bộ đề tổng hợp)",
    "count": 9,
    "items": [{
      "id": "45a5a6c4-…",
      "title": "FULL BÀI THI 9",
      "combined": true,
      "durationMinutes": null,
      "track": null, "order": null, "deadlineAt": null,
      "detailUrl": "/api/vstep/demo/content?id=45a5a6c4-…",
      "embedUrl": "vstep.html?set=45a5a6c4-…"
    }]
  }]
}
```

Chỉ gồm nội dung **khu Ôn thi đã xuất bản** — đúng những gì học viên Mini Hippo
đang thấy.

### GET `/api/vstep/demo/content?id=<ID>`

Nội dung đầy đủ 1 bộ đề. **Bộ đề tổng hợp được gộp sẵn đủ 4 kỹ năng.**

```json
{
  "content": {
    "id": "…",
    "title": "FULL BÀI THI 9",
    "data": {
      "listening": { "parts": [] },
      "reading":   { "parts": [] },
      "writing":   { "parts": [] },
      "speaking":  { "parts": [] },
      "durations": { "listening": 45, "reading": 60, "writing": 60, "speaking": 12 }
    }
  }
}
```

---

## 3. Giao diện thật (bộ `demo_export/`)

Bản sao nguyên các trang học/thi đang chạy trên Mini Hippo — **đủ mọi phần**:

| Phần | Trang |
|---|---|
| Aptis · Reading học theo câu hỏi | `reading_part1.html` · `reading_part2.html` · `reading_part4.html` · `reading_part5.html` |
| Aptis · Listening học theo câu hỏi | `listening_q1_13.html` · `listening_q14.html` · `listening_q15.html` · `listening_q16_17.html` |
| Aptis · Speaking học theo câu hỏi | `speaking_part.html` |
| Aptis · học theo bộ đề | `reading.html` · `listening.html` · `speaking.html` · `writing.html` |
| VSTEP · phòng thi (Full Test + từng kỹ năng) | `vstep.html` |

Không cần nhớ bảng này: lấy `embedUrl` của bài trong catalog rồi nhúng:

```html
<iframe src="/demo_export/{embedUrl}" width="100%" height="900" style="border:0"
        allow="microphone; camera; fullscreen; autoplay" allowfullscreen></iframe>
```

Cấu hình (domain + API key) và cách bắt sự kiện "rời bài" xem `demo_export/README.md`.
Domain của web bán khoá phải nằm trong `DEMO_ALLOWED_ORIGINS` (mục cuối), không thì
trình duyệt báo lỗi `403`/CORS.

## 4. Lưu ý khi dựng giao diện

- **Audio / hình ảnh**: phần lớn là URL đầy đủ (GitHub hoặc Cloudflare R2), dùng
  thẳng được. Một số ít là đường dẫn tương đối (vd `audio/question1_13/audio_q1.mp3`)
  → ghép với Base URL: `https://www.minihippo.edu.vn/audio/question1_13/audio_q1.mp3`
- Có vài bài Listening đang **thiếu file audio ngay trên Mini Hippo** (bên Mini
  Hippo đang xử lý). URL audio của các bài này trả `404` — nên hiển thị dạng "chưa
  có audio" thay vì để trình phát lỗi.
- Dữ liệu được **cache phía server**: catalog 1 phút, nội dung bài 5 phút. Sửa đề
  trên Mini Hippo thì tối đa vài phút sau API mới trả bản mới.
- Muốn giao diện **giống hệt** trang thi Mini Hippo thì dùng bộ `demo_export/` (mục 3).

## 5. Mã lỗi

| Mã | Ý nghĩa |
|---|---|
| `400` | Thiếu tham số `id` |
| `401` | Thiếu hoặc sai API key |
| `403` | Domain gọi từ trình duyệt không nằm trong danh sách cho phép |
| `404` | Không tìm thấy bài học |
| `502` | Tạm thời không tải được nội dung bài từ kho lưu trữ, thử lại sau |
| `503` | Máy chủ chưa cấu hình API key |

---

## Phía Mini Hippo (Vercel → Environment Variables)

| Biến | Ý nghĩa |
|---|---|
| `DEMO_API_KEY` | API key cấp cho dev web bán khoá |
| `DEMO_ALLOWED_ORIGINS` | Domain được gọi API từ trình duyệt, cách nhau dấu phẩy (để trống = chỉ chặn bằng key) |

Đổi biến xong cần **Redeploy** mới có hiệu lực.

API chỉ trả **nội dung bài học**. Dữ liệu nội bộ nằm cùng bảng (lớp học, lịch buổi
học, nội dung buổi Lớp Học, bộ Key, bài nháp, khu Học tập VSTEP) bị chặn — gọi vào
sẽ nhận `404`.
