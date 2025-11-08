document.addEventListener('DOMContentLoaded', function() {

// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI ///////////////
// ===============================================================================================================

const listeningQuestions1 = [
  {
    heading: "Question 1 of 17",
    audioUrl: "audio/question1_13/audio_de6_q1.mp3",
    question: "Listen to the announcement. When does the train leave the station?",
    options: ["9:30", "9:00", "9:15"],
    correctAnswer: "9:15",
    transcript: "Good morning, everyone. This is an important announcement about a change in the train schedule. The train to London will now leave at 9:15, not 9:30 as planned. Please listen carefully to this information. If you are taking this train, please go to Platform 3 now. Thank you for your attention, and have a good day."
  },
  {
    heading: "Question 2 of 17",
    audioUrl: "audio/question1_13/audio_de6_q2.mp3",
    question: "Jana is talking to her friend. What does Jana’s sister look like?",
    options: ["Blonde", "Tall", "Short"],
    correctAnswer: "Short",
    transcript: "Hey, could you do me a favor? My sister is waiting outside, and I need you to give her my book. She’s the one who is short and has straight hair, so you can’t miss her. I also think she’s wearing a blue jacket today. If you see her, just hand it to her, and I’ll be so grateful. Thanks for helping me out!"
  },
  {
    heading: "Question 3 of 17",
    audioUrl: "audio/question1_13/audio_de6_q3.mp3",
    question: "What does her sister drink? / Linda is talking about what she likes to eat. What does she have for lunch?",
    options: ["Tea", "Juice", "Coffee"],
    correctAnswer: "Tea",
    transcript: "When it comes to lunch, I have a simple pleasure: I really enjoy a warm cup of tea. It’s my favorite drink to have while I eat. I find it calming, and it makes my meal feel special. Sometimes people ask me why I don’t choose coffee or juice, but for me, tea is just perfect. It warms my heart and gives me a moment to relax."
  },
  {
    heading: "Question 4 of 17",
    audioUrl: "audio/question1_13/audio_de6_q4.mp3",
    question: "A man is calling his wife. Where do the couple meet?",
    options: ["At the restaurant", "At the station", "Outside a shop"],
    correctAnswer: "Outside a shop",
    transcript: "Hi honey, it’s me! Just a reminder that the train leaves at 5, so you should arrive around 6 o’clock. I’ll be there to pick you up at the train station. Let’s meet outside the shop opposite the station. I can’t wait to have dinner together! See you soon!"
  },
  {
    heading: "Question 5 of 17",
    audioUrl: "audio/question1_13/audio_de6_q5.mp3",
    question: "A man is talking about his eating habit. What time does he usually eat?",
    options: ["8 o'clock", "7 o'clock", "5 o'clock"],
    correctAnswer: "7 o'clock",
    transcript: "I usually have dinner every evening. It's become a habit for me to enjoy a meal at that time after a long day. I find it’s the perfect time to unwind and relax. Plus, I love to spend time with my family during dinner. It’s our chance to catch up and enjoy some good food together. We usually have dinner at 7 o'clock and it is definitely my favorite meal of the day!"
  },
  {
    heading: "Question 6 of 17",
    audioUrl: "audio/question1_13/audio_de6_q6.mp3",
    question: "A professor is talking to his student. What does the professor ask his student to do?",
    options: ["Submit a report", "Speak at the conference", "Write an essay"],
    correctAnswer: "Speak at the conference",
    transcript: "Professor: Good morning, Alex. I’ve just finished reading your thesis, and I must say, it’s very well done. You’ve put a lot of effort into it.\nStudent: Thank you, Professor! I’m glad you liked it. I worked hard on it.\nProfessor: It shows. Your research is thorough, and your arguments are clear. I actually think you should consider presenting it at the upcoming student conference. Student: Wow, really? That sounds exciting! But, I’m not sure how that works. Could you tell me more about it? Professor: Of course. The conference is a great opportunity to share your findings with a wider audience. You would prepare a short presentation, around 10-15 minutes, and then answer some questions from the audience. It’s a good way to get feedback and gain experience speaking publicly."
  },
  {
    heading: "Question 7 of 17",
    audioUrl: "audio/question1_13/audio_de6_q7.mp3",
    question: "A man and a woman are talking about their old school days. What was the man's favorite thing about school?",
    options: ["Math classes", "History classes", "Sports"],
    correctAnswer: "History classes",
    transcript: "Woman: What do you remember most about our school days? Man: Honestly, I don’t remember much.\nWoman: I remember that I was terrible at math! It was my worst subject. Also, I remember that you were really good at history.\nMan: That’s right! I loved history. Actually, those classes were the ones I remember the most. All those stories and events were so fascinating!"
  },
  {
    heading: "Question 8 of 17",
    audioUrl: "audio/question1_13/audio_de6_q8.mp3",
    question: "Where did she go for the holiday? / Listen to the woman talking about her holiday plans. Where is she going next?",
    options: ["The east", "The north", "The south"],
    correctAnswer: "The south",
    transcript: "I can’t wait for my next holiday! This time, I’m heading to the south, where the mountains are. I’ve never been there before, but I’ve heard it’s beautiful. I’m looking forward to hiking and seeing the snow-covered peaks. It’s going to be a nice change from the city. Hopefully, the weather will be perfect!"
  },
  {
    heading: "Question 9 of 17",
    audioUrl: "audio/question1_13/audio_de6_q9.mp3",
    question: "Listen to a radio man talking about a new popular song. Which is the most attractive part of the song?",
    options: ["The melody", "The rhythm", "The words"],
    correctAnswer: "The words",
    transcript: "Good evening, listeners! Today, I want to talk about a new song that’s quickly becoming popular - You’re my everything. The tune is really catchy, and it makes you want to dance right away. The instruments used are simple but create a great rhythm. However, the most attractive part of all is the words. The lyrics tell a beautiful story that everyone can relate to. It’s no wonder so many people are loving this song! If you haven’t heard it yet, make sure to give it a listen soon!"
  },
  {
    heading: "Question 10 of 17",
    audioUrl: "audio/question1_13/audio_de6_q10.mp3",
    question: "A man is talking about the environment of the countryside. What is the main cause of poor air quality?",
    options: ["Factories", "Cars", "Fires from the countryside"],
    correctAnswer: "Fires from the countryside",
    transcript: "I really like living in the countryside. There are many green fields, tall trees, and small rivers. The air usually smells fresh and clean. But sometimes, the air becomes dirty and hard to breathe. Many people think cars on the roads make the air bad. Others say the smoke from big factories is the problem. These things can make the air dirty, but in the countryside, there’s a bigger issue. Farmers often start fires to clean their fields. They burn old plants and grass. These fires make a lot of smoke that goes into the air. It's sad because the smoke can hurt animals and make people sick. We need to find better ways to clean fields without using fire."
  },
  {
    heading: "Question 11 of 17",
    audioUrl: "audio/question1_13/audio_de6_q11.mp3",
    question: "A person calls a friend about his new car. What is the price of the small car?",
    options: ["3,250 pounds", "3,550 pounds", "3,000 pounds"],
    correctAnswer: "3,250 pounds",
    transcript: "Hey, I just wanted to tell you about my new car! It's a small one, perfect for my needs. I got it for a great price—only 3,250 pounds! Can you believe it? I was looking at bigger models too, but they were way more expensive, around 3,550 pounds or even 4,250 pounds. I'm really happy with my choice!"
  },
{
  heading: "Question 12 of 17",
  audioUrl: "audio/question1_13/audio_de6_q12.mp3",
  question: "Which room will they study in? / Where will the first lesson of computer science take place?",
  options: ["Room 301", "Room 101", "Room 203"],
  correctAnswer: "Room 301",
  transcript: "They’ve decided to meet up for their study session, and room 301 is where they’ll study. It’s a quiet space with plenty of desks, so it’s perfect for focusing and getting some work done."
},
{
  heading: "Question 13 of 17",
  audioUrl: "audio/question1_13/audio_de6_q13.mp3",
  question: "Stephanie is looking for a job taking care of children. How old is she?",
  options: ["21", "25", "30"],
  correctAnswer: "21",
  transcript: "Stephanie is eager to start a career and is looking for a job taking care of children. She’s 21 years old and believes this is the perfect age to begin working in childcare and gaining experience."
},
];


// Dữ liệu câu hỏi 14
const question14Data = {
  audioUrl: "audio/question14/audio_de6.mp3",  // Đường dẫn audio
  topic: "Topic: The place to run",                  
  options: [
    "in the fitness centre",
    "at the seaside",
    "in the street",
    "on the running track",
    "in the library",
    "at the supermarket"
  ],
  transcript: "A: \"My friends often invite me to go jogging on the street, but I find it too dangerous. There’s a lot of traffic, which can be dangerous for people jogging on the street. So, I bought a one-year gym membership and go there to exercise every day.\"\n\nB: \"I see many people wake up early to go jogging and exercise to stay healthy. As for me, I usually walk along the beach simply to relax because there’s a beautiful beach near my house. Every morning, I spend time walking on the white sand; it really helps a lot with my mental well-being.\"\n\nC: \"I usually wake up early in the morning to exercise, and I choose to jog on the street because of its convenience. I just need to step out of the house, and I can start exercising. However, I have to go jogging early to avoid cyclists. My friends go to the gym to exercise a lot, but I find something artificial about the whole thing.\"\n\nD: \"Near my house, there’s a stadium where many people go to exercise. I often run on the track there, and it makes me feel like I’m running more professionally. My personality is quite competitive, so I also time myself and race with my friends there.\""
};
// Dữ liệu câu hỏi 15
const question15Data = {
  audioUrl: "audio/question15/audio_de6.mp3", // Đường dẫn đến file audio
  topic: "Topic: The arts",
  transcript: "W: What magazine are you reading?\n\nM: I'm reading about art.\n\nW: That sounds interesting. I think art is only for the wealthy. Poor people don’t have the opportunity or time to enjoy art.\n\nM: Actually, art isn’t limited to any one group. If we have an interest, we can access art because it’s all around us.\n\nW: I wish that when I was a child and in school, I had more exposure to the arts. I'm really glad that now, when my child goes to school, they can have more exposure to the arts.\n\nM: Yes, that's great news. I hope that the authorities and the government will invest more in the arts and make them accessible to everyone, especially by adding more art classes in schools so that students can be exposed to art early on.\n\nW: I agree. Children should be introduced to the arts early so they can develop their own sense of beauty sooner.\n\nM: I think with the development of technology, where we just scroll a bit and see art videos and images flooding social media, art is becoming more accessible than ever.\n\nW: Really? Let's wait and see how it unfolds.."
,
  questions: [
    "1. Art is only suitable for the privileged few",
    "2. The government should invest more in arts",
    "3. Children should be exposed to art early",
    "4. In the future, art will become more accessible"
  ],
  correctAnswer: ["Woman", "Man", "Both", "Man"] // Đáp án đúng của từng câu hỏi
};
// Dữ liệu câu hỏi 16 & 17
const question16Data = [
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "A musician's life",
    questions: [
      {
        id: "16.1",
        question: "What will this musician do in the near future?",
        options: [
          "He will probably retire from singing",
          "He plans to release a new album",
          "He wants to collaborate with younger artists"
        ]
      },
      {
        id: "16.2",
        question: "What does the speaker think about his career in general?",
        options: [
          "He could have been more successful",
          "He regrets choosing his profession",
          "He believes he reached the peak too early"
        ],
      }
    ],
    transcript: "Bài văn này không có audio (học thuộc đáp án là được)." 
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",  // Phần tử thứ hai
    topic: "A new guide",
    questions: [
      {
        id: "17.1", 
        question: "What is the advantage of this new guide?",
        options: [
          "It creates a sense of adventure",
          "It includes detailed hotel reviews",
          "It focuses mainly on luxury travel"
        ]
      },
      {
        id: "17.2", 
        question: "What is the limitation of this new guide?",
        options: [
          "It is only suitable for a particular generation",
          "It doesn’t cover popular tourist attractions",
          "It is too expensive for most travelers"
        ]
      }
    ],
    transcript: "Bài văn này không có audio (học thuộc đáp án là được)." 
  }
];

// ===============================================================================================================
// ////////////// CÂU HỎI 1_13 ///////////////
// ===============================================================================================================
function renderQuestion1_13(data) {
  const radioButtons = document.querySelectorAll('input[name="answer"]');
  radioButtons.forEach(button => {
    button.checked = false;  
  });

  document.getElementById("question1_13_id").innerText = data.heading;

  const audio = document.getElementById("audioPlayer");
  const questionText = document.getElementById("questionText");
  audio.src = data.audioUrl;
  questionText.innerText = data.question;

  data.options.forEach((option, index) => {
    const label = document.getElementById("label" + index);
    const input = document.getElementById("option" + index);
    if (label && input) {
      label.innerText = option;
      input.value = option;
    }
  });

  // ✅ Đặt lại đáp án sau khi input đã có value
  const storedAnswer = userAnswers[currentIndex]; 
  if (storedAnswer) {
    const savedInput = document.querySelector(`input[name="answer"][value="${storedAnswer}"]`);
    if (savedInput) savedInput.checked = true;
  }

  const playBtn = document.getElementById("playButton");
  const playIcon = document.getElementById("playIcon");
  setupPlayButton(audio, playBtn, playIcon);

  const transcriptBox = document.getElementById("transcriptBox");
  const transcriptContent = document.getElementById("transcriptContent");
  transcriptContent.innerText = data.transcript;

  const showTranscriptButton = document.getElementById("showTranscriptButton");

  transcriptBox.style.display = "none";
  showTranscriptButton.innerText = "Show paragraph";

  showTranscriptButton.removeEventListener("click", toggleTranscript); 
  showTranscriptButton.addEventListener("click", toggleTranscript);
}



// 2. Hàm ẩn hiện paragrap
function toggleTranscript() {
  if (transcriptBox.style.display === "none") {
    transcriptBox.style.display = "block";
    showTranscriptButton.innerText = "Hide paragraph";
  } else {
    transcriptBox.style.display = "none";
    showTranscriptButton.innerText = "Show paragraph";
  }
}

// 3. Hàm load âm thanh
function setupPlayButton(audio, playBtn, playIcon) {
  if (playBtn.dataset.bound === "true") return;
  playBtn.dataset.bound = "true"; 

  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => {
        playIcon.classList.remove("bi-play-fill");
        playIcon.classList.add("bi-pause-fill");
      }).catch(err => console.error("Không phát được:", err));
    } else {
      audio.pause();
      playIcon.classList.remove("bi-pause-fill");
      playIcon.classList.add("bi-play-fill");
    }
  });

  audio.addEventListener("ended", () => {
    playIcon.classList.remove("bi-pause-fill");
    playIcon.classList.add("bi-play-fill");
  });
}



// ===============================================================================================================
// 4. Đáp án câu 1-13
document.querySelectorAll('input[name="answer"]').forEach((input, index) => {
  input.addEventListener('change', function() {
    storeUserAnswer(currentIndex, this.value);
  });
});

function storeUserAnswer(questionIndex, answer) {
  userAnswers[questionIndex] = answer;
}


function showResults_question1_13() {
  const comparisonBody1 = document.getElementById('comparisonBody_question1');
  const totalScoreDisplay = document.getElementById('totalScore_question1_13');
  comparisonBody1.innerHTML = '';

  let score = 0;

  listeningQuestions1.forEach((question, index) => {
    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer === question.correctAnswer;
    const textColor = isCorrect ? 'text-success' : 'text-danger'; // ✅ Màu chữ cho câu trả lời người dùng

    if (isCorrect) {
      score += 2;
    }

    comparisonBody1.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td class="${textColor} fw-bold">${userAnswer || 'Not answered'}</td>
        <td class="text-success fw-bold">${question.correctAnswer}</td>
      </tr>
    `;
  });

  question1_13Score = score;
  totalScoreDisplay.innerText = `Score: ${score} / 26`;
  document.getElementById('comparisonResult_question1').style.display = "block";
}








// ===============================================================================================================
// ////////////// CÂU HỎI 2 (14 of 17) ///////////////
// ===============================================================================================================
// 1. Hàm render
//let correctAnswer14 = []; // ✅ Đáp án đúng 4 phần tử đầu tiên (dùng cho chấm điểm)

// ✅ Hàm render
let shuffledOptions14 = [];
function renderQuestion14(data) {
  document.getElementById("audioPlayer2").src = data.audioUrl;
  document.getElementById("question14_topic").innerText = data.topic;

  // Lưu lại 4 đáp án đúng đầu tiên
  correctAnswer14 = data.options.slice(0, 4);

  // Tạo mảng xáo trộn để render
  shuffledOptions14 = [...data.options].sort(() => Math.random() - 0.5);

  const selectIds = ["person1", "person2", "person3", "person4"];
  selectIds.forEach((id, index) => {
    const select = document.getElementById(id);
    select.innerHTML = `<option value="">-- Select an answer --</option>`;

    shuffledOptions14.forEach((opt, idx) => {
      const val = String.fromCharCode(65 + idx);
      const optionEl = document.createElement("option");
      optionEl.value = val;
      optionEl.innerText = opt;
      select.appendChild(optionEl);
    });

    // Nếu người dùng đã chọn đáp án → chọn lại
    const prevAnswer = userAnswers_question14[index];
    if (prevAnswer) {
      const selectedIndex = shuffledOptions14.indexOf(prevAnswer);
      select.selectedIndex = selectedIndex + 1; // vì index 0 là "-- Select an answer --"
    }
  });

  const audio = document.getElementById("audioPlayer2");
  const playBtn = document.getElementById("playButton2");
  const playIcon = document.getElementById("playIcon2");
  setupPlayButton(audio, playBtn, playIcon);

  const transcriptBox = document.getElementById("transcriptBox14");
  const transcriptContent = document.getElementById("transcriptContent14");
  transcriptContent.innerText = data.transcript;

  const showTranscriptButton = document.getElementById("showTranscriptButton14");
  transcriptBox.style.display = "none";
  showTranscriptButton.innerText = "Show paragraph";

  showTranscriptButton.removeEventListener("click", toggleTranscript14);
  showTranscriptButton.addEventListener("click", toggleTranscript14);
}


// 2. Hàm ẩn hiện
function toggleTranscript14() {
  const transcriptBox = document.getElementById("transcriptBox14");
  const showTranscriptButton = document.getElementById("showTranscriptButton14");

  if (transcriptBox.style.display === "none") {
    transcriptBox.style.display = "block";
    showTranscriptButton.innerText = "Hide paragraph";
  } else {
    transcriptBox.style.display = "none";
    showTranscriptButton.innerText = "Show paragraph";
  }
}
// ===============================================================================================================
// Đáp án câu 14 (với 4 phần tử đầu tiên của options trong question14Data)
// ===============================================================================================================

// Lắng nghe sự kiện khi người dùng chọn đáp án cho câu hỏi 14 (selectbox)
document.querySelectorAll('select[id^="person"]').forEach((select, index) => {
  select.addEventListener('change', function() {
    storeUserAnswerQuestion14(index, this.value); // Lưu đáp án người dùng cho câu hỏi 14
  });
});

// Hàm lưu đáp án câu 14 vào mảng userAnswers_question14
let userAnswers_question14 = [];

// Hàm lưu đáp án người dùng cho câu hỏi 14 vào mảng
function storeUserAnswerQuestion14(index, answerLetter) {
  const optionIndex = answerLetter.charCodeAt(0) - 65;
  const selectedAnswer = shuffledOptions14[optionIndex]; // ✅ Dùng mảng đã xáo trộn
  userAnswers_question14[index] = selectedAnswer;
}




// Hàm ẩn hiện transcript
function toggleTranscript14() {
  const transcriptBox = document.getElementById("transcriptBox14");
  const showTranscriptButton = document.getElementById("showTranscriptButton14");

  if (transcriptBox.style.display === "none") {
    transcriptBox.style.display = "block";
    showTranscriptButton.innerText = "Hide paragraph";
  } else {
    transcriptBox.style.display = "none";
    showTranscriptButton.innerText = "Show paragraph";
  }
}


let correctAnswer14 = []; // Đáp án đúng cho câu 14
function showResults_question14() {
  const comparisonBody14 = document.getElementById('comparisonBody_question14');
  const totalScoreEl = document.getElementById('totalScore_question14');
  comparisonBody14.innerHTML = '';

  //const correctAnswer14 = question14Data.options.slice(0, 4); // 4 đáp án đúng
  let score = 0;
  let html14 = '';

  correctAnswer14.forEach((correctOption, index) => {
    const userAnswer = userAnswers_question14[index] || 'Not answered';
    const isCorrect = userAnswer === correctOption;
    const textColor = isCorrect ? 'text-success' : 'text-danger';

    if (isCorrect) {
      score += 2; // Mỗi câu đúng 2 điểm
    }

    html14 += `
      <tr>
        <td>${index + 1}</td>
        <td class="${textColor} fw-bold">${userAnswer}</td>
        <td class="text-success fw-bold">${correctOption}</td>
      </tr>
    `;
  });

  comparisonBody14.innerHTML = html14;
  totalScoreEl.innerText = `Score: ${score} / 8`;
  question14Score = score;

  // Hiện bảng kết quả nếu muốn
  // document.getElementById('comparisonResult_question14').style.display = "block";
}





// ===============================================================================================================
// ////////////// CÂU HỎI 15 ///////////////
// ===============================================================================================================
// Mảng lưu đáp án người dùng cho câu hỏi 15
let userAnswers_question15 = [];



// Hàm lưu đáp án người dùng cho câu hỏi 15
function storeUserAnswerQuestion15(index, answer) {
  const options = ["Man", "Woman", "Both"]; // Các lựa chọn thực tế
  const selectedAnswer = options[answer.charCodeAt(0) - 65];  // Chuyển từ 'A' -> "man", 'B' -> "woman", 'C' -> "both"
  userAnswers_question15[index] = selectedAnswer; // Lưu đáp án vào mảng
}

// Hàm render câu hỏi 15
function renderQuestion15(data) {
  document.getElementById("audioPlayer3").src = data.audioUrl;
  document.getElementById("question15_id").innerText = data.topic;

  data.questions.forEach((question, index) => {
    const label = document.getElementById("opinion" + (index + 1) + "_label");  // Dùng index để tạo id cho label
    const select = document.getElementById("opinion" + (index + 1));  // Dùng index để tạo id cho select

    if (label) {
      label.innerText = question;  // Gán nội dung question từ mảng vào label
    }

    if (select) {
      select.innerHTML = `<option value="">-- Select an answer --</option>`; // reset
      const options = ["Man", "Woman", "Both"];
      options.forEach((opt, i) => {
        const val = String.fromCharCode(65 + i); // 'A', 'B', 'C'
        const optionEl = document.createElement("option");
        optionEl.value = val;
        optionEl.innerText = opt;
        select.appendChild(optionEl);
      });

      // Nếu người dùng đã chọn đáp án trước đó, hiển thị lại đáp án đã chọn
      if (userAnswers_question15[index]) {
        const selectedIndex = options.indexOf(userAnswers_question15[index]);
        select.value = String.fromCharCode(65 + selectedIndex); // Chọn lại giá trị đã lưu
      }
    }
  });

  const audio = document.getElementById("audioPlayer3");
  const playBtn = document.getElementById("playButton3");
  const playIcon = document.getElementById("playIcon3");
  setupPlayButton(audio, playBtn, playIcon);

  const transcriptBox = document.getElementById("transcriptBox15");
  const transcriptContent = document.getElementById("transcriptContent15");
  transcriptContent.innerText = data.transcript;

  const showTranscriptButton = document.getElementById("showTranscriptButton15");

  transcriptBox.style.display = "none";
  showTranscriptButton.innerText = "Show paragraph";

  showTranscriptButton.removeEventListener("click", toggleTranscript15);
  showTranscriptButton.addEventListener("click", toggleTranscript15);
}

// Hàm ẩn hiện transcript
function toggleTranscript15() {
  const transcriptBox = document.getElementById("transcriptBox15");
  const showTranscriptButton = document.getElementById("showTranscriptButton15");

  if (transcriptBox.style.display === "none") {
    transcriptBox.style.display = "block";
    showTranscriptButton.innerText = "Hide paragraph";
  } else {
    transcriptBox.style.display = "none";
    showTranscriptButton.innerText = "Show paragraph";
  }
}

// Lắng nghe sự kiện khi người dùng chọn đáp án cho câu hỏi 15 (selectbox)
document.querySelectorAll('select[id^="opinion"]').forEach((select, index) => {
  select.addEventListener('change', function() {
    storeUserAnswerQuestion15(index, this.value); // Lưu đáp án người dùng cho câu hỏi 15
  });
});

// Hàm hiển thị kết quả cho câu hỏi 15
function showResults_question15() {
  const comparisonBody15 = document.getElementById('comparisonBody_question15');
  const totalScoreEl = document.getElementById('totalScore_question15');
  comparisonBody15.innerHTML = '';

  const correctAnswer15 = question15Data.correctAnswer;
  let score = 0;
  let html15 = '';

  correctAnswer15.forEach((correctAns, index) => {
    const userAns = userAnswers_question15[index] || 'Not answered';
    const isCorrect = userAns === correctAns;
    const textColor = isCorrect ? 'text-success' : 'text-danger';

    if (isCorrect) {
      score += 2;
    }

    html15 += `
      <tr>
        <td>${index + 1}</td>
        <td class="${textColor} fw-bold">${userAns}</td>
        <td class="text-success fw-bold">${correctAns}</td>
      </tr>
    `;
  });

  comparisonBody15.innerHTML = html15;
  totalScoreEl.innerText = `Score: ${score} / 8`;
  question15Score = score;

  // document.getElementById('comparisonResult_question15').style.display = 'block';
}





// ===============================================================================================================
// ////////////// CÂU HỎI 16 ///////////////
// ===============================================================================================================



let userAnswers_question16 = {}; // Lưu đáp án người dùng
let correctAnswers_question16 = {};        // q.id → correct answer text
let shuffledOptionsMap_question16 = {};    // q.id → shuffled options array

function renderQuestion16(data) {
  // Gán audio và tiêu đề
  document.getElementById("audioPlayer16").src = data.audioUrl;
  document.getElementById("question16_topic").innerText = `Topic: ${data.topic}`;
  document.getElementById("transcriptContent16").innerText = data.transcript;

  data.questions.forEach((q, index) => {
  const qIndex = index + 1;

  // Gán tiêu đề câu hỏi
  const labelEl = document.getElementById(`q16_opinion${qIndex}_label`);
  labelEl.innerText = `${q.id} ${q.question}`;

  // Lưu đáp án đúng (phần tử đầu tiên)
  correctAnswers_question16[q.id] = q.options[0];

  // Chỉ xáo trộn nếu chưa có câu trả lời
  if (Object.keys(userAnswers_question16).length === 0) {
    const shuffled = [...q.options].sort(() => Math.random() - 0.5);
    shuffledOptionsMap_question16[q.id] = shuffled;
  } else {
    shuffledOptionsMap_question16[q.id] = shuffledOptionsMap_question16[q.id] || [...q.options];
  }

  const shuffled = shuffledOptionsMap_question16[q.id];

  shuffled.forEach((text, optIndex) => {
    const letter = String.fromCharCode(65 + optIndex); // A, B, C
    const radio = document.getElementById(`opinion${qIndex}_${letter}`);
    const label = document.querySelector(`label[for=opinion${qIndex}_${letter}]`);

    if (radio && label) {
      label.innerText = text;
      radio.checked = false;

      // Nếu đã chọn trước đó, hiển thị lại
      if (userAnswers_question16[q.id] === letter) {
        radio.checked = true;
      }

      radio.onchange = () => {
        userAnswers_question16[q.id] = letter;
        console.log(userAnswers_question16, correctAnswers_question16);
      };
    }
  });
});


  // 👉 Thêm đoạn này
  const audio = document.getElementById("audioPlayer16");
  const playBtn = document.getElementById("playButton16");
  const playIcon = document.getElementById("playIcon16");
  setupPlayButton(audio, playBtn, playIcon);

  // Ẩn/hiện transcript
  const btn = document.getElementById("showTranscriptButton16");
  const box = document.getElementById("transcriptBox16");
  btn.innerText = "Show Paragraph";
  box.style.display = "none";

  btn.onclick = () => {
    if (box.style.display === "none") {
      box.style.display = "block";
      btn.innerText = "Hide Paragraph";
    } else {
      box.style.display = "none";
      btn.innerText = "Show Paragraph";
    }
  };
}


function showResults_question16() {
  const container = document.getElementById("comparisonResult_question16");
  const tbody = document.getElementById("comparisonBody_question16");
  const totalScoreEl = document.getElementById("totalScore_question16");
  tbody.innerHTML = "";

  let score = 0;

  question16Data.forEach(section => {
    section.questions.forEach(q => {
      const qid = q.id;
      const correctText = correctAnswers_question16[qid];                // đáp án đúng gốc
      const shuffled = shuffledOptionsMap_question16[qid];              // mảng đã xáo trộn
      const userLetter = userAnswers_question16[qid];                   // A/B/C
      const userText = userLetter ? shuffled[userLetter.charCodeAt(0) - 65] : "Not answered";

      const isCorrect = userText === correctText;
      if (isCorrect) score += 2;

      const row = document.createElement("tr");
      const userClass = isCorrect ? "text-success fw-bold" : "text-danger fw-bold";

      row.innerHTML = `
        <td>${qid}</td>
        <td class="${userClass}">${userText}</td>
        <td class="text-success fw-bold">${correctText}</td>
      `;
      tbody.appendChild(row);
    });
  });

  totalScoreEl.innerText = `Score: ${score} / 8`;
  question16_17Score = score;
}





// ===============================================================================================================
// ////////////// NÚT NHẤN NEXT VÀ BACK ///////////////
// ===============================================================================================================
let currentIndex = 0;
let userAnswers = [];  // Mảng lưu trữ các đáp án người dùng

function renderQuestionByIndex(currentIndex) {
  if (currentIndex <= listeningQuestions1.length - 1) {
    renderQuestion1_13(listeningQuestions1[currentIndex]);
    document.getElementById("question1_13").style.display = "block";
    document.getElementById("question14").style.display = "none";
    document.getElementById("question15").style.display = "none";
    document.getElementById("question16").style.display = "none";
  } else if (currentIndex === listeningQuestions1.length) {
    renderQuestion14(question14Data);
    document.getElementById("question1_13").style.display = "none";
    document.getElementById("question14").style.display = "block";
    document.getElementById("question15").style.display = "none";
    document.getElementById("question16").style.display = "none";
  } else if (currentIndex === listeningQuestions1.length + 1) {
    renderQuestion15(question15Data);
    document.getElementById("question1_13").style.display = "none";
    document.getElementById("question14").style.display = "none";
    document.getElementById("question15").style.display = "block";
    document.getElementById("question16").style.display = "none";
  } else if (currentIndex === listeningQuestions1.length + 2) {
    renderQuestion16(question16Data[0]);
    document.getElementById("question1_13").style.display = "none";
    document.getElementById("question14").style.display = "none";
    document.getElementById("question15").style.display = "none";
    document.getElementById("question16").style.display = "block";
    document.getElementById('question16_id').textContent = "Question 16 of 17"; // Change Next to Submit
  } else if (currentIndex === listeningQuestions1.length + 3) {
    renderQuestion16(question16Data[1]);
    document.getElementById("question1_13").style.display = "none";
    document.getElementById("question14").style.display = "none";
    document.getElementById("question15").style.display = "none";
    document.getElementById("question16").style.display = "block";
    document.getElementById('question16_id').textContent = "Question 17 of 17"; 
    document.getElementById('nextButton').textContent = "Submit Test"; 
  }
}




// ===== XỬ LÝ NÚT NEXT =====
document.getElementById('nextButton').addEventListener('click', function (e) {
  // 🔁 Reset tất cả audio và icon play
  document.querySelectorAll('audio').forEach(audio => {
    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
  });
  document.querySelectorAll('i[id^="playIcon"]').forEach(icon => {
    icon.classList.remove("bi-pause-fill");
    icon.classList.add("bi-play-fill");
  });

  const btn = e.target;
  const btnText = btn.innerText.trim().toLowerCase();

  if (btnText === "submit test") {
    const modal = new bootstrap.Modal(document.getElementById("confirmationModal"));
    modal.show();
    return;
  }

  if (btnText === "back to home") {
    window.location.href = "/home.html";
    return;
  }

  if (currentIndex < listeningQuestions1.length + 3) {
    currentIndex++;
    renderQuestionByIndex(currentIndex);
  }
});

// ===== XỬ LÝ NÚT BACK =====
document.getElementById('backButton').addEventListener('click', function () {
  // 🔁 Reset tất cả audio và icon play
  document.querySelectorAll('audio').forEach(audio => {
    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
  });
  document.querySelectorAll('i[id^="playIcon"]').forEach(icon => {
    icon.classList.remove("bi-pause-fill");
    icon.classList.add("bi-play-fill");
  });

  document.getElementById('nextButton').textContent = "Next";

  if (currentIndex > 0) {
    currentIndex--;
  }

  renderQuestionByIndex(currentIndex);
});


// Lắng nghe sự kiện nhấn nút "confirmSubmitBtn" (trên popup)
document.getElementById('confirmSubmitBtn').addEventListener('click', function () {
  // Gọi tất cả hàm hiển thị kết quả các phần
  showResults_question1_13();   // Câu 1–13
  showResults_question14();    // Câu 14
  showResults_question15();    // Câu 15
  showResults_question16();    // Câu 16–17

  // Tính tổng điểm và phân loại
  calculateTotalScore();

      document.getElementById("question1_13").style.display = "none";
    document.getElementById("question14").style.display = "none";
    document.getElementById("question15").style.display = "none";
    document.getElementById("question16").style.display = "none";
    document.getElementById('backButton').style.display = "none";

  // Hiển thị khu vực kết quả phân loại và navigation
  document.getElementById('result_navigation').style.display = 'block';
  document.getElementById('nextButton').textContent = "Back to home";
});





// 1. Hiển thị câu hỏi khi trang được load
window.onload = function() {
    renderQuestion1_13(listeningQuestions1[0]);
};










// ===============================================================================================================
// ////////////// TÍNH TỔNG ĐIỂM VÀ PHÂN LOẠI CẤP BẬC ///////////////
// ===============================================================================================================
var question1_13Score = 0;
var question14Score = 0;
var question15Score = 0;
var question16_17Score = 0;
function calculateTotalScore() {
    var totalScore = 0;
    totalScore = question1_13Score + question14Score + question15Score + question16_17Score;
    
    if (totalScore === 48) {
        totalScore = 50;
    }
    document.getElementById('totalScore').innerText = `Total Score: ${totalScore} / 50`;
    classifyScore(totalScore);

}

// 2. Phân loại điểm
function classifyScore(score) {
    let grade = '';
    
    if (score >= 42) {
        grade = 'C1';
    } else if (score >= 34) {
        grade = 'B2';
    } else if (score >= 24) {
        grade = 'B1';
    } else if (score >= 16) {
        grade = 'A2';
    }else {
        grade = 'A1';
    }
    document.getElementById('scoreClassification').innerText = `Your grade: ${grade}`;
}
document.getElementById('confirmSubmitBtn').addEventListener('click', function() {
    calculateTotalScore();
    document.getElementById('result_navigation').style.display = 'block';
});

// ===============================================================================================================
// ////////////// HIỂN THỊ SỐ ĐIỂM ///////////////
// ===============================================================================================================
// Bản đồ giữa nút và phần kết quả tương ứng
const navMap = {
  navQ1: 'comparisonResult_question1',
  navQ2: 'comparisonResult_question14',
  navQ3: 'comparisonResult_question15',
  navQ4: 'comparisonResult_question16'
};

// Lặp qua tất cả các nút điều hướng
Object.keys(navMap).forEach(navId => {
  const button = document.getElementById(navId);
  button.addEventListener('click', () => {
    // 1. Ẩn toàn bộ các khu vực kết quả
    Object.values(navMap).forEach(resultId => {
      const section = document.getElementById(resultId);
      if (section) section.style.display = 'none';
    });

    // 2. Hiện phần được chọn
    const targetResult = document.getElementById(navMap[navId]);
    if (targetResult) targetResult.style.display = 'block';

    // 3. Cập nhật nút đang được chọn (btn-active)
    Object.keys(navMap).forEach(id => {
      const btn = document.getElementById(id);
      btn.classList.remove('btn-active');
    });
    button.classList.add('btn-active');
  });
});


// ===============================================================================================================
// ////////////// ĐẾM NGƯỢC THỜI GIAN --- COUNT DOWN ///////////////
// ===============================================================================================================
// Countdown Timer
let timeLeft = 40 * 60; // 35 minutes in seconds
const countdownElement = document.getElementById('countdownTimer');

function updateCountdown() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    countdownElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    if (timeLeft > 0) {
        timeLeft--;
        setTimeout(updateCountdown, 1000);
    }
}

updateCountdown();


// Kết thúc
});
