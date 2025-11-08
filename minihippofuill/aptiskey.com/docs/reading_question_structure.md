# Cấu trúc Bài Tập Reading Question - Mini Hippo

## Tổng quan
Trang `reading_question.html` có 4 phần (Parts) với cấu trúc dữ liệu khác nhau:

---

## Part 1: Fill in the Blank (reading_question1.html)

### Cấu trúc dữ liệu:
```javascript
const questions1_X = [
    { 
        questionStart: "Where is the train", 
        answerOptions: ["station", "school", "market"], 
        questionEnd: "in this town?", 
        correctAnswer: "station" 
    },
    // ... thêm các câu hỏi khác
];
```

### Đặc điểm:
- **Loại câu hỏi**: Fill in the blank với dropdown select
- **Format**: `questionStart` + [dropdown] + `questionEnd`
- **Đáp án**: Chọn từ `answerOptions`, đáp án đúng trong `correctAnswer`
- **Số câu hỏi**: 5 câu mỗi bộ đề
- **Điểm**: 2 điểm/câu đúng
- **File JS**: `js/reading_question/reading_question1.js`

### Template HTML:
```html
<div class="mb-3 d-flex align-items-center">
    <label>questionStart</label>
    <select>
        <option value="">-- Chọn --</option>
        <option>option1</option>
        <option>option2</option>
        <option>option3</option>
    </select>
    <span>questionEnd</span>
</div>
```

---

## Part 2 & 3: Sentence Ordering (reading_question2.html)

### Cấu trúc dữ liệu:
```javascript
const question2Content_X = [
    'Old movies were very different from today\'s movies.',
    'That\'s because the movies were only in black and white...',
    // ... 5 câu văn
];

const questheader1 = {
    question2Content_1: "Films",
    question2Content_2: "Weekend activities",
    // ...
};
```

### Đặc điểm:
- **Loại câu hỏi**: Drag and drop để sắp xếp các câu theo thứ tự đúng
- **Format**: Mảng các câu văn (strings)
- **Đáp án**: Thứ tự ban đầu của mảng là đáp án đúng
- **Số câu**: 5 câu văn mỗi bộ đề
- **Điểm**: 1 điểm/câu đúng
- **Topic**: Có topic cho mỗi bộ đề
- **File JS**: `js/reading_question/reading_question2.js`
- **Thư viện**: SortableJS cho drag & drop

### Template HTML:
```html
<div id="cardsContainer">
    <div class="card draggable-item" draggable="true">
        <div class="card-body">Câu văn 1</div>
    </div>
    <!-- ... -->
</div>
```

---

## Part 4: Reading Comprehension (reading_question4.html)

### Cấu trúc dữ liệu:
```javascript
const question4Text_X = [
    "<strong>Here is the perspective of four people...</strong>",
    "<strong>A:</strong> Nội dung của người A...",
    "<strong>B:</strong> Nội dung của người B...",
    "<strong>C:</strong> Nội dung của người C...",
    "<strong>D:</strong> Nội dung của người D...",
];

const question4Content_X = [
    { 
        question: "Who finds today's games harder than before?", 
        id: "question4_q1", 
        options: ["", "A", "B", "C", "D"],
        answer: "A"  // Optional, có thể dùng mảng riêng
    },
    // ... 7 câu hỏi
];

const correctAnswersQuestion4_X = ['A', 'B', 'A', 'D', 'C', 'D', 'C'];

const question4Topic1 = {
    topic1: "Games from childhood",
    topic2: "Extreme sports",
    // ...
};
```

### Đặc điểm:
- **Loại câu hỏi**: Đọc hiểu với 4 đoạn văn (A, B, C, D) và chọn đáp án
- **Format**: 
  - Left column: 4 đoạn văn (có thể có HTML)
  - Right column: 7 câu hỏi với dropdown (A/B/C/D)
- **Đáp án**: Mảng 7 đáp án (A, B, C, hoặc D)
- **Số câu hỏi**: 7 câu mỗi bộ đề
- **Điểm**: 2 điểm/câu đúng
- **Topic**: Có topic cho mỗi bộ đề
- **File JS**: `js/reading_question/reading_question4.js`

### Template HTML:
```html
<div class="row">
    <div class="col-md-7">
        <p><strong>A:</strong> Nội dung...</p>
        <!-- ... -->
    </div>
    <div class="col-md-5">
        <form>
            <div class="mb-3">
                <label>Câu hỏi</label>
                <select>
                    <option value="">-- Chọn --</option>
                    <option>A</option>
                    <option>B</option>
                    <option>C</option>
                    <option>D</option>
                </select>
            </div>
        </form>
    </div>
</div>
```

---

## Part 5: Paragraph Matching (reading_question5.html)

### Cấu trúc dữ liệu:
```javascript
const options_X = [
    '',  // Option đầu tiên luôn là rỗng
    "Changing the definition of mountain",
    "The unique feeling of achievement",
    // ... 7 options (tổng 8, bỏ option đầu)
];

const paragraph_question5_X = [
    'Đoạn văn 1 tương ứng với option[1]',
    'Đoạn văn 2 tương ứng với option[2]',
    // ... 7 đoạn văn
];

const question5_keyword_X = '<strong>Mẹo nhớ Keyword:</strong> ...';
const question5_meo_X = "<strong>Nhớ theo đoạn văn:</strong> ...";

const topic_name = {
    topic_1: "Mountain",
    topic_2: "Four-Day Workweek",
    // ...
};
```

### Đặc điểm:
- **Loại câu hỏi**: Nối các đoạn văn với các heading options
- **Format**: 
  - 7 đoạn văn (paragraphs)
  - 7 options (headings) - option đầu tiên là rỗng
  - Mỗi đoạn văn tương ứng với 1 option
- **Đáp án**: Mảng mapping giữa paragraph index và option index
  - Paragraph[0] → options[1]
  - Paragraph[1] → options[2]
  - ...
- **Số câu hỏi**: 7 câu mỗi bộ đề
- **Điểm**: 2 điểm/câu đúng
- **Topic**: Có topic cho mỗi bộ đề
- **Mẹo học**: Có keyword và mẹo nhớ
- **File JS**: `js/reading_question/reading_question5.js`

### Template HTML:
```html
<div>
    <label>1.</label>
    <select>
        <option value="">-- Chọn --</option>
        <option>Option 1</option>
        <!-- ... -->
    </select>
    <p style="display:none">Đoạn văn 1</p>
</div>
```

---

## Cấu trúc chung cho tất cả Parts:

### 1. Header:
- Logo/Brand: "Mini Hippo"
- Countdown Timer: "34:00" (35 phút)
- Question Step: "Reading Question X"

### 2. Footer:
- Back Button
- Check Result Button
- Next Button

### 3. Result Modal:
- Total Score
- Score Classification
- Comparison Table (Your Answer vs Correct Answer)

### 4. Navigation:
- Next: Chuyển sang bộ đề tiếp theo
- Back: Quay lại bộ đề trước
- Check Result: Hiển thị kết quả và điểm

---

## Format JSON cho Admin Upload:

### Part 1:
```json
{
  "part": 1,
  "title": "Reading Question 1",
  "questions": [
    {
      "questionStart": "Where is the train",
      "answerOptions": ["station", "school", "market"],
      "questionEnd": "in this town?",
      "correctAnswer": "station"
    }
  ]
}
```

### Part 2 & 3:
```json
{
  "part": 2,
  "title": "Reading Question 2 & 3",
  "topic": "Films",
  "sentences": [
    "Old movies were very different from today's movies.",
    "That's because the movies were only in black and white..."
  ]
}
```

### Part 4:
```json
{
  "part": 4,
  "title": "Reading Question 4",
  "topic": "Games from childhood",
  "texts": [
    "<strong>Here is the perspective...</strong>",
    "<strong>A:</strong> Nội dung A...",
    "<strong>B:</strong> Nội dung B...",
    "<strong>C:</strong> Nội dung C...",
    "<strong>D:</strong> Nội dung D..."
  ],
  "questions": [
    {
      "question": "Who finds today's games harder?",
      "options": ["", "A", "B", "C", "D"],
      "correctAnswer": "A"
    }
  ]
}
```

### Part 5:
```json
{
  "part": 5,
  "title": "Reading Question 5",
  "topic": "Mountain",
  "options": [
    "",
    "Changing the definition of mountain",
    "The unique feeling of achievement",
    "..."
  ],
  "paragraphs": [
    "Đoạn văn 1...",
    "Đoạn văn 2...",
    "..."
  ],
  "tips": {
    "keyword": "<strong>Mẹo nhớ Keyword:</strong> ...",
    "meo": "<strong>Nhớ theo đoạn văn:</strong> ..."
  }
}
```

---

## Ghi chú:
- Tất cả các part đều có countdown timer (35 phút)
- Tất cả đều có navigation (Next/Back)
- Tất cả đều có check result với modal hiển thị kết quả
- Part 2 & 3 sử dụng SortableJS cho drag & drop
- Part 4 và 5 có topic cho mỗi bộ đề
- Part 5 có thêm mẹo học (tips)

