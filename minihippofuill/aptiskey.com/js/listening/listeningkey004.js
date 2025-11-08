document.addEventListener('DOMContentLoaded', function() {

// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI ///////////////
// ===============================================================================================================

const listeningQuestions1 = [

{
  heading: "Question 1 of 17",
  audioUrl: "audio/question1_13/audio_de4_q1.mp3",
  question: "Listen to the instructions of a university. Where is the main office?",
  options: ["in the basement", "on the first floor", "on the second floor"],
  correctAnswer: "on the first floor",
  transcript: "Welcome to our university! When you enter the campus, you’ll see the library on your left and the cafeteria on your right. If you need help with anything, the main office is on the first floor of the center campus building. There, you can ask about classes, schedules, or anything else. Behind the main building, you’ll find the gym and sports area. For quiet study, there are some nice spots in the garden near the science building. Make sure to explore and enjoy your time here!"
},
{
  heading: "Question 2 of 17",
  audioUrl: "audio/question1_13/audio_de4_q2.mp3",
  question: "How much can Max pay for the computer?",
  options: ["200 pounds", "250 pounds", "300 pounds"],
  correctAnswer: "250 pounds",
  transcript: "Hi, it’s me Max. I’m calling about the computer that you are selling. You see. My computer is old and slow. I can’t play any games on it any more and would like to replace it with a new one. How much do you offer? I can pay 250 pounds. This afternoon I am busy but we can discuss this tomorrow morning. Is that okay? Call me back soon."
},
{
  heading: "Question 3 of 17",
  audioUrl: "audio/question1_13/audio_de4_q3.mp3",
  question: "Where does he want to go tomorrow?",
  options: ["The park", "The cinema", "The town hall"],
  correctAnswer: "The town hall",
  transcript: "He has some important things to discuss tomorrow, and the town hall is where he wants to go, as it’s the perfect place for the meeting and gathering more information."
},

{
  heading: "Question 4 of 17",
  audioUrl: "audio/question1_13/audio_de4_q4.mp3",
  question: "What will they bring to the picnic?",
  options: ["Drinks", "Food", "Snacks"],
  correctAnswer: "Food",
  transcript: "Pierre: Hey, Emma, are you ready for the picnic this weekend?\nEmma: Definitely! I’m really looking forward to it. Do you know what everyone’s bringing?\nPierre: Yeah, I spoke with a few people. Sarah’s bringing cups and bowls, and Tom said he’ll take care of drinks. He’s got some lemonade and iced tea ready.\nEmma: Sounds great! I think Clara mentioned she’s making a fruit salad, right?\nPierre: Yep, and Leo’s bringing chips and dips. I guess we’re pretty covered on snacks.\nEmma: Awesome! So, what should we bring? Maybe some food in case we might get hungry?\nPierre: That’s a good idea. How about we prepare some chicken and french fries?\nEmma: Perfect! This picnic is going to be amazing!"
},
{
  heading: "Question 5 of 17",
  audioUrl: "audio/question1_13/audio_de4_q5.mp3",
  question: "How many people live in the town?",
  options: ["5,000", "10,000", "20,000"],
  correctAnswer: "10,000",
  transcript: "Welcome, everyone! Today, I’m excited to introduce you to our charming small town. Right here in the town square, you’ll find local shops, cozy cafes, and a beautiful fountain where people gather to relax. This square is the heart of our community, often filled with cool events like farmers' markets and live music. Currently, there are 10,000 people living in this town. As we explore, you’ll see the unique blend of history and modern life that makes our town so special."
},
{
  heading: "Question 6 of 17",
  audioUrl: "audio/question1_13/audio_de4_q6.mp3",
  question: "Where are they going to meet?",
  options: ["at the park", "at the station", "at the university"],
  correctAnswer: "at the park",
  transcript: "Hi, it’s me! I wanted to confirm where we’re meeting today. I thought we agreed to meet at the park, right? It’s a nice place to relax and catch up. The station would be too crowded, and the university is a bit far for me. Let’s stick to the park so we can enjoy the weather. What time should I meet you there?"
},
{
  heading: "Question 7 of 17",
  audioUrl: "audio/question1_13/audio_de4_q7.mp3",
  question: "What color top is he going to buy?",
  options: ["Green", "Red", "Black"],
  correctAnswer: "Black",
  transcript: "Man: Hello, I would like to buy a top, please.\nWoman: Sure, do you have anything particular in mind? Man: I like the design of that green one over there. Do you have it in blue?\nWoman: Maybe. What size are you?\nMan: I am wearing large.\nWoman: Let me see. Ohh. We have that one in blue but small. The red and black ones, however, are available in large.\nMan: Red is not my cup of tea. Well, I will go with the other option then."
},
{
  heading: "Question 8 of 17",
  audioUrl: "audio/question1_13/audio_de4_q8.mp3",
  question: "What career did he choose?",
  options: ["to work in business", "to become a teacher", "to become a researcher"],
  correctAnswer: "to work in business",
  transcript: "Woman: Welcome, how may I help you?\nMan: Yes, I would like to have some advice for my future job. I majored in Mathematics. Is there anything that I could do?\nWoman: Well, there are a variety of career paths you can take, let say becoming a teacher, a businessman, or continue to study higher to become a researcher.\nMan: I have a friend who also majors in Mathematics and he is now a businessman with his own company. I guess that would be my choice then. I am not suitable to become a teacher since I think I am a bit impatient."
},
{
  heading: "Question 9 of 17",
  audioUrl: "audio/question1_13/audio_de4_q9.mp3",
  question: "When is the assignment due?",
  options: ["on Friday", "on Saturday", "on Sunday"],
  correctAnswer: "on Saturday",
  transcript: "The assignment needs to be submitted soon, and it’s due on Saturday. Make sure to finish it by then to avoid any last-minute stress."
}
,
{
  heading: "Question 10 of 17",
  audioUrl: "audio/question1_13/audio_de4_q10.mp3",
  question: "What course did he take? / Listen to a student talking about his study. What course is the student going to take this year?",
  options: ["English", "Math", "Computer"],
  correctAnswer: "Computer",
  transcript: "Hi, I’m Ben, and I want to share a bit about my studies. Last term, I took English, math, and science. They were all interesting, but math was a bit tough for me. I worked hard, though, and got good results in the end. This year, I’m really excited because I’m going to take a computer course. I’ve always wanted to learn more about technology, so I’m looking forward to it!"
},
{
  heading: "Question 11 of 17",
  audioUrl: "audio/question1_13/audio_de4_q11.mp3",
  question: "What did she like best about the film?",
  options: ["the mountain scenes", "the action scenes", "the ending"],
  correctAnswer: "the mountain scenes",
  transcript: "\"The Fall\" is one of my favorite films, which I saw last weekend. The film was so terrific that it kept me on the edge of my seat all the time. I usually don’t like watching action movies as they feel the same and repetitive with those dull racing car scenes and meaningless fights that go on for hours. The mountain scenes were rather unusual. The sequencing fascinatingly brings out the most captivating parts for me. The ending, however, was a bit sad. Many people wish it was a happy ending."
},
{
  heading: "Question 12 of 17",
  audioUrl: "audio/question1_13/audio_de4_q12.mp3",
  question: "What elements of the film do they agree on?",
  options: ["the soundtrack", "the characters", "the ending"],
  correctAnswer: "the ending",
  transcript: "Man: \"I just finished watching that film we talked about. What did you think?\"\nWoman: \"I loved it! The ending was so satisfying!\"\nMan: \"Absolutely! It wrapped everything up perfectly. But I wasn’t really sold on the characters.\"\nWoman: \"Really? I thought the characters were great and well developed!\"\nMan: \"I felt they were a bit cliché, especially the main character. But I really love the soundtrack.\"\nWoman: \"Honestly, I didn’t like the music at all. It felt out of place.\""
},
{
  heading: "Question 13 of 17",
  audioUrl: "audio/question1_13/audio_de4_q13.mp3",
  question: "Why does Douglas call Kay?",
  options: ["to ask for a favor", "to say thank you", "to discuss ideas"],
  correctAnswer: "to say thank you",
  transcript: "Hi, Kay! It’s Douglas. I hope you are doing well. I wanted to call you today to say thank you for all your help with the project. Your advice was really valuable, and it made a big difference. I also wanted to ask for a favor. If you have some time, I would love to meet and discuss a few ideas I have. Let me know when you are free!"
},
];

// Dữ liệu câu hỏi 14
const question14Data = {
  audioUrl: "audio/question14/audio_de4.mp3",  // Đường dẫn audio
  topic: "Topic: Listening to music",                  
  options: [
    "To relax",
    "After waking up",
    "While singing",
    "While studying",
    "to discuss ideas",
    "to complain"
  ],
  transcript: "A: \"I see a lot of people listen to music right when they wake up to help them feel alert. But if I listen to music as soon as I wake up, it gives me a headache all day and makes it hard for me to focus on anything. So, I just listen to music to relax when I’m feeling comfortable, not for any other reason.\"\n\nB: \"I usually listen to a pop or rock song as soon as I get out of bed in the morning because it helps me wake up instantly. If I don't listen to music at that moment, I don't know when I'll be able to get up and go to work.\"\n\nC: \"My brothers and friends often say that I have a beautiful voice, so I often sing when I meet them. I usually play music on the TV and hold the remote control, pretending it's a microphone so I can sing.\"\n\nD: \"I have a habit of listening to music while studying; it helps me stay motivated and alert while doing my assignments. If I don't play music, I could fall asleep at any moment, and I'll study in a discouraged mood.\""
};
// Dữ liệu câu hỏi 15
const question15Data = {
  audioUrl: "audio/question15/audio_de4.mp3", // Đường dẫn đến file audio
  topic: "Topic: Information and technology",
  transcript: "M: Hi, what have you been studying lately?\n\nW: Oh, I'm still studying technology and information systems—it's a really hot topic these days.\n\nM: That's a fascinating field. I still can't imagine the future of humanity alongside technology. I think within the next hundred years, humans won't be able to keep up with the pace of information technology development.\n\nW: I believe that the younger generation and future generations will become increasingly smarter, and they'll discover even more amazing things about information technology to benefit society.\n\nM: But if technology advances too quickly and becomes too sophisticated, won't that cause a lot of people to lose their jobs? Many industries could be replaced by machines and robots. In the future, machines might even be smarter than humans.\n\nW: I think machines are just there to support humans in their work; they can't replace us or be smarter than us. If machines and robots are involved in the work process, they will make our jobs less strenuous and improve efficiency. This, in turn, will drive continuous economic and social development alongside technological advancements.\n\nM: What about the issue of personal data breaches? We should have more policies to protect personal information and prevent machines from leaking important personal data.\n\nW: I agree with you. A major issue with information technology is the potential for data breaches. If we can improve this, it would be fantastic."
,
  questions: [
    "1. The future generation will fail to cope with new information",
    "2. The information revolution will be good for the economy",
    "3. No computer is superior to the human brain",
    "4. More should be done to protect individual privacy"
  ],
  correctAnswer: ["Man", "Woman", "Woman", "Both"] // Đáp án đúng của từng câu hỏi
};
// Dữ liệu câu hỏi 16 & 17
const question16Data = [
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "A regional development plan",
    questions: [
      {
        id: "16.1",
        question: "Why do residents oppose this plan?",
        options: [
          "It doesn't do enough to promote alternatives to driving",
          "It increases the number of public parks in the area",
          "It provides free public transportation for all residents"
        ]
      },
      {
        id: "16.2",
        question: "What difficulties is the city council having with this plan?",
        options: [
          "The plan is not making efficient use of existing land",
          "The plan has already exceeded its budget by a large margin",
          "There is too much public support, making it hard to manage expectations"
        ],
      }
    ],
    transcript: "Bài văn này không có audio (học thuộc đáp án là được)." 
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",  // Phần tử thứ hai
    topic: "Life after university",
    questions: [
      {
        id: "17.1", 
        question: "What should students do when choosing a career?",
        options: [
          "Be flexible and open minded",
          "Choose the same career as their friends",
          "Focus only on the salary offered"
        ]
      },
      {
        id: "17.2", 
        question: "What should students pay attention to when applying for jobs these days?",
        options: [
          "They are becoming more competitive",
          "Most jobs no longer require any qualifications",
          "Companies prefer handwritten applications"
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
