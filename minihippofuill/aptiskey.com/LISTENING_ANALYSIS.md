# Phân tích chi tiết Listening Parts

## Tổng quan
Listening có 4 loại câu hỏi chính:
1. **Question 1-13**: Multiple choice với 3 options
2. **Question 14**: Matching với 6 options, chọn 4 đáp án đúng
3. **Question 15**: Opinion matching (Man/Woman/Both) với 4 câu hỏi
4. **Question 16-17**: Multiple choice với 2 câu hỏi mỗi section

---

## 1. Question 1-13

### Cấu trúc dữ liệu:
```javascript
const listeningQuestions1 = [
  {
    heading: "Question 1 of 17",
    audioUrl: "audio/question1_13/audio_q1.mp3",
    question: "What is not original?",
    options: ["Furniture", "Home", "Bicycle"],
    correctAnswer: "Furniture",
    transcript: "Welcome! I'm so glad..."
  },
  // ... 13 questions total
];
```

### Giao diện:
- Audio player với play/pause button
- Question text
- 3 radio buttons (options)
- Show/Hide transcript button
- Next/Back navigation
- Check result button

### Đặc điểm:
- Mỗi question độc lập
- 13 questions trong 1 set
- Điểm: 2 điểm/câu = 26 điểm tổng

---

## 2. Question 14

### Cấu trúc dữ liệu:
```javascript
const question14Data = {
  audioUrl: "audio/question14/audio_q1.mp3",
  topic: "Topic: Protect the environment",
  options: [
    "Does not use commercial cleaning products",
    "Give away used items",
    "Buy environmentally friendly products",
    "Reuse containers for storing food",  // 4 đáp án đúng đầu tiên
    "Plant trees in the backyard",
    "Use solar panels for electricity"
  ],
  transcript: "Person A: I find the act..."
};
```

### Giao diện:
- Audio player
- Topic heading
- 4 dropdown selects (Person 1, 2, 3, 4)
- Mỗi dropdown có 6 options (xáo trộn)
- 4 đáp án đúng = 4 options đầu tiên
- Show/Hide transcript

### Đặc điểm:
- 1 audio cho 1 question
- 6 options, chọn 4 đáp án đúng
- Đáp án đúng = 4 phần tử đầu tiên của options array
- Điểm: 2 điểm/câu = 8 điểm tổng
- Có thể có nhiều sets (question14Data_1, question14Data_2, ...)

---

## 3. Question 15

### Cấu trúc dữ liệu:
```javascript
const question15Data = {
  audioUrl: "audio/question15/audio_q1.mp3",
  topic: "Topic: Changes in the workplace",
  transcript: "W: I'm thinking about...",
  questions: [
    "1. Continuity is important when planning a career",
    "2. Job security cannot be guaranteed",
    "3. Job satisfaction is important for motivator",
    "4. Technological improvement is good for the economy"
  ],
  correctAnswer: ["Man", "Woman", "Both", "Man"]
};
```

### Giao diện:
- Audio player
- Topic heading
- 4 dropdown selects (opinion1, opinion2, opinion3, opinion4)
- Mỗi dropdown có 3 options: "Man", "Woman", "Both"
- Show/Hide transcript

### Đặc điểm:
- 1 audio cho 1 question
- 4 câu hỏi với 3 options mỗi câu
- Đáp án: Man/Woman/Both
- Điểm: 2 điểm/câu = 8 điểm tổng
- Có thể có nhiều sets

---

## 4. Question 16-17

### Cấu trúc dữ liệu:
```javascript
const question16Data = [
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "A break from studying",
    questions: [
      {
        id: "16.1",
        question: "Why hasn't he gone to college?",
        options: [
          "He wasn't ready to start higher education",  // Đáp án đúng (đầu tiên)
          "He couldn't afford the tuition fees.",
          "He didn't get good enough grades"
        ]
      },
      {
        id: "16.2",
        question: "Why did he decide to travel for 2 years?",
        options: [
          "To gain life experience.",  // Đáp án đúng
          "To avoid studying.",
          "To travelling."
        ]
      }
    ],
    transcript: "Bài văn này không có audio..."
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "A book about a life of a scientist",
    questions: [
      {
        id: "17.1",
        question: "Why do many readers find the book interesting?",
        options: [...]
      },
      {
        id: "17.2",
        question: "Why is the book so popular?",
        options: [...]
      }
    ],
    transcript: "..."
  }
];
```

### Giao diện:
- Audio player (có thể không có audio)
- Topic heading
- 2 câu hỏi (16.1, 16.2 hoặc 17.1, 17.2)
- Mỗi câu hỏi có 3 radio buttons
- Show/Hide transcript

### Đặc điểm:
- Mảng gồm nhiều sections (16 và 17)
- Mỗi section có 2 câu hỏi
- Đáp án đúng = option đầu tiên của mỗi câu hỏi
- Điểm: 2 điểm/câu = 4 điểm/section
- Có thể có nhiều sets (nhiều cặp 16-17)

---

## Tổng kết

### File paths cho audio:
- Question 1-13: `audio/question1_13/audio_q{1-13}.mp3`
- Question 14: `audio/question14/audio_q1.mp3` (hoặc audio_de2.mp3, ...)
- Question 15: `audio/question15/audio_q1.mp3` (hoặc audio_de2.mp3, ...)
- Question 16-17: `audio/question16/no_audio.mp3`, `audio/question17/no_audio.mp3`

### JS file paths:
- Question 1-13: `js/listening_question/listening_question1_13.js`
- Question 14: `js/listening_question/listening_question14.js`
- Question 15: `js/listening_question/listening_question15.js`
- Question 16-17: `js/listening_question/listening_question16_17.js`

### HTML pages:
- Question 1-13: `listening_question1_13.html`
- Question 14: `listening_question14.html`
- Question 15: `listening_question15.html`
- Question 16-17: `listening_question16_17.html`

