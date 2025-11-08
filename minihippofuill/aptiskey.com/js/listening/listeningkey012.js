document.addEventListener('DOMContentLoaded', function() {

// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI ///////////////
// ===============================================================================================================

const listeningQuestions1 = [
  {
    heading: "Question 1 of 13",
    audioUrl: "audio/question1_13/audio_de12_q1.mp3",
    question: "Listen to a principal talking about new school facilities. What new facility will the school have?",
    options: ["A new library", "A sports field", "A Performance space"],
    correctAnswer: "A Performance space",
    transcript: "Our school is getting some exciting new facilities. We already have a library and a sports field, but we’re adding something different now. The school will have a new performance space for plays, concerts, and other events. It’s going to be a great addition for the students. We’re really looking forward to seeing it finished!"
  },
{
  heading: "Question 2 of 13",
  audioUrl: "audio/question1_13/audio_de12_q2.mp3",
  question: "What does he advise young people to do to save money?",
  options: ["Use public transportation", "Buy second-hand items", "Cook for yourself"],
  correctAnswer: "Cook for yourself",
  transcript: "He often advises young people to save money by cooking for themselves. Instead of eating out frequently, cooking at home can help cut down on unnecessary expenses and improve financial habits."
},
  {
    heading: "Question 3 of 13",
    audioUrl: "audio/question1_13/audio_de12_q3.mp3",
    question: "Listening to a man talking about his business trip. What does he like in Dubai?",
    options: ["He enjoys shopping", "He enjoys his job here", "He enjoys the weather"],
    correctAnswer: "He enjoys his job here",
    transcript: "I've been living in Dubai for about two years now, and I really enjoy my work here. It's challenging, but that's what makes it exciting. The company I work for is great, and I get to meet people from all over the world. The food is also amazing, but the work itself is what keeps me happy. I can see myself staying here for a long time because I feel lucky to do what I love."
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "audio/question1_13/audio_de12_q4.mp3",
    question: "Listen to a conversation between the teacher and a parent. What will the father do?",
    options: ["Change schools", "Arrange private classes", "Enroll in after-school programs"],
    correctAnswer: "Arrange private classes",
    transcript: "Teacher: Hello, Mr. Johnson. Thank you for coming in today. I wanted to talk about your son, Jake.\nFather: Hi, Mrs. Lee. Yes, I’ve noticed he’s been struggling a bit lately.\nTeacher: Yes, his performance is not so good in math and reading. He seems to have some difficulties understanding the lessons.\nFather: I’m worried about that. What can we do to help him?\nTeacher: I know a private tutor who works well with children. She can provide extra help and support. Father: That sounds like a good idea! Can you give me her contact information? Teacher: Of course! I will write it down for you. I think Jake will really benefit from it."
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "audio/question1_13/audio_de12_q5.mp3",
    question: "A woman is talking about her job. What encouraged her to become a scientist?",
    options: ["Her mother's support", "A large stone", "A book she read"],
    correctAnswer: "A large stone",
    transcript: "I’ve always loved science, but there was a moment that really encouraged me to become a scientist. I remember when I was a child, I found a large stone during a school trip. It sparked my curiosity about geology. My mother also inspired me to explore my interests in science. Of course, I use the computer a lot now for my research, but that stone was the beginning."
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "audio/question1_13/audio_de12_q6.mp3",
    question: "Listen to David talking about the conference. How long did he talk in the speech?",
    options: ["20 minutes", "10 minutes", "15 minutes"],
    correctAnswer: "15 minutes",
    transcript: "Hello everyone. Today, I want to tell you about the conference that took place last week. It was very interesting, and many people attended. I spoke about new ideas in business. My presentation wasn’t very long, but I had a lot to say. The other speakers talked about technology and education. After the talks, there were some questions from the audience. My speech lasted about 15 minutes, shorter than expected. However, the audience was very attentive, and I was happy to see that."
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "audio/question1_13/audio_de12_q7.mp3",
    question: "A man is talking about his holiday. How is he going to travel to the city?",
    options: ["By car", "By bus", "By train"],
    correctAnswer: "By bus",
    transcript: "Hello, everyone! I want to share my plans for the holiday. This year, I’m going to travel to the city for a few days. I’m very excited because I love exploring new places. I plan to visit some interesting museums and try different foods at local restaurants. The best part is that I will travel by bus, which is fun and also very cheap! I will leave early in the morning to enjoy the day. I can’t wait to see all the sights and take lots of pictures! It will be an amazing holiday!"
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "audio/question1_13/audio_de12_q8.mp3",
    question: "Lily is talking about her daily routine. What does she do in the evening?",
    options: ["Does yoga", "Goes for a walk", "Watches TV"],
    correctAnswer: "Goes for a walk",
    transcript: "Hi, I’m Lily, and I want to tell you about my daily routine. I wake up early around 6:30 A.M. and have breakfast before going to work. I work in a small office, and my job keeps me busy until about 5 P.M. After dinner, I usually go for a walk to relax, but today I’m going to try something different—I’ll do some yoga at home. It sounds fun and peaceful. After that, I’ll probably watch a movie before going to bed. It’s a simple day, but I like it!"
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "audio/question1_13/audio_de12_q9.mp3",
    question: "A man and a woman are talking about their old school days. What was the man's favorite thing about school?",
    options: ["Math classes", "Sports", "History classes"],
    correctAnswer: "History classes",
    transcript: "Woman: What do you remember most about our school days? Man: Honestly, I don’t remember much.\nWoman: I remember that I was terrible at math! It was my worst subject. Also, I remember that you were really good at history.\nMan: That’s right! I loved history. Actually, those classes were the ones I remember the most. All those stories and events were so fascinating!"
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "audio/question1_13/audio_de12_q10.mp3",
    question: "Listen to a radio man talking about a new popular song. Which is the most attractive part of the song?",
    options: ["The words", "The beat", "The instruments"],
    correctAnswer: "The words",
    transcript: "Good evening, listeners! Today, I want to talk about a new song that’s quickly becoming popular - You’re my everything. The tune is really catchy, and it makes you want to dance right away. The instruments used are simple but create a great rhythm. However, the most attractive part of all is the words. The lyrics tell a beautiful story that everyone can relate to. It’s no wonder so many people are loving this song! If you haven’t heard it yet, make sure to give it a listen soon!"
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "audio/question1_13/audio_de12_q11.mp3",
    question: "Listen to the announcement. When does the train leave the station?",
    options: ["9:15", "9:30", "9:00"],
    correctAnswer: "9:15",
    transcript: "Good morning, everyone. This is an important announcement about a change in the train schedule. The train to London will now leave at 9:15, not 9:30 as planned. Please listen carefully to this information. If you are taking this train, please go to Platform 3 now. Thank you for your attention, and have a good day."
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "audio/question1_13/audio_de12_q12.mp3",
    question: "Lucy is calling her friend. What is her sister like?",
    options: ["They have different hair colors", "They have similar characters", "They are very different"],
    correctAnswer: "They have similar characters",
    transcript: "Hi Emma, it’s Lucy. I hope you’re doing well! I need a small favor from you today. Could you pick up my sister after school? She’ll be standing at the school gate at 3 P.M. She looks just like me, so you’ll recognize her easily. I have a meeting, and I won’t make it in time. Thank you so much! Let me know if that’s okay with you."
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "audio/question1_13/audio_de12_q13.mp3",
    question: "An expert is talking about lack of satisfaction at work. What should be the solution?",
    options: ["Request a transfer", "Take a vacation", "Find a new job"],
    correctAnswer: "Request a transfer",
    transcript: "Many people feel unhappy at work, and often, they think a higher salary or less work will fix it. But that’s not always the solution. Sometimes, the problem is the work environment. A change of place can help improve how we feel at work. However, looking for a new job can be stressful and take time. One option is to ask for a transfer to another branch within the same company. This can offer the same benefits as getting a new job, without the challenges of starting over somewhere new."
  }
];


// Dữ liệu câu hỏi 14
const question14Data = {
  audioUrl: "audio/question14/audio_de12.mp3",  // Đường dẫn audio
  topic: "Topic: Studying (phiên bản 2).",                  
  options: [
    "In the coffee shop",
    "In the park",
    "On public transport",
    "At home",
  "In a shared workspace",      
  "While traveling abroad"      
  ],
  transcript: "A: \"I don't like studying in very quiet places such as at home or in the library because I get sleepy easily and might even fall asleep while studying. There's a coffee shop near my house, and I often go there to study because the presence of other people makes me feel more motivated. I find that I achieve higher productivity and efficiency in my studies when I'm there.\"\n\nB: \"I notice that most people prefer doing their homework in the classroom, but for me, those chairs are way too hard and leave me sore all day. I prefer sitting under the trees in the park to study—it's cool, and the air is fresh. There's a famous coffee shop across from where I sit, and they serve really good coffee.\"\n\nC: \"The distance from my house to school is 20 km, and it usually takes me an hour to get there. So, when I'm on the train, I use the time to do homework and review the lessons for the day. Some people say that studying like this can be distracting, but I find it very effective for me.\"\n\nD: \"I don't like studying in very crowded places because I can't focus well. I usually sit on the sofa in the living room to study. My parents often travel for work, so my house is very quiet.\""
};
// Dữ liệu câu hỏi 15
const question15Data = {
  audioUrl: "audio/question15/audio_de12.mp3", // Đường dẫn đến file audio
  topic: "Topic: Community design",
  transcript: "Man: You know, I believe building design can shape people’s behaviors and interactions from the start. When spaces are designed well, people feel comfortable and naturally start connecting.\n\nWoman: Of course, design matters, but there’s no shortcut to building real community connections. Creating community takes time and consistency, even in spaces that encourage interaction.\n\nMan: Really? But I also feel that work communities and social communities aren’t as different as we might think. Both require spaces that help people feel connected and valued, whether it’s at work or in social settings.\n\nWoman: I’m not sure I agree with that. Work communities and social communities serve very different purposes. In a social community, people gather out of personal interest and shared hobbies, but in work communities, people connect because of their job roles. That can affect how close they feel and how they interact with one another.\n\nMan: I see your point, but even in work communities, people still find ways to connect on a personal level. A good work environment encourages friendships that might go beyond work topics.\n\nWoman: That’s a good point. And with technology, people can now connect for both work and social reasons, even if they’re not physically together. But I still think it’s important to build spaces where people can gather in person.\n\nMan: Yes, I agree, but I think technology has really changed how communities form. It makes connecting so much easier, and people don’t always need to meet face-to-face to feel a sense of community.\n\nWoman: I see that, but I don’t think online connections can fully replace in-person gatherings. There’s a different energy when people come together in real spaces—something technology just can’t replicate.\n\nMan: I understand, but I feel that virtual spaces can be just as meaningful. Technology adds a new layer, making it possible for communities to thrive even across distances, and that’s valuable in its own way."
,  questions: [
    "1. Building design can influence people's behavior.",
    "2. Creating community can take time",
    "3. Work communities and social communities are the same.",
    "4. Technology has changed how community forms."
  ],
  correctAnswer: ["Both", "Woman", "Man", "Both"] // Đáp án đúng của từng câu hỏi
};
// Dữ liệu câu hỏi 16 & 17
const question16Data = [
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "The importance of sleep",
    questions: [
      {
        id: "16.1",
        question: "What is the way to have a good sleep according to the speaker?",
        options: [
      "Blocking out noise and light is key",
      "Drinking coffee before bed helps relax the mind",
      "Sleeping fewer hours increases deep sleep quality"
        ]
      },
      {
        id: "16.2",
        question: "What is the speaker's view on insomnia in general?",
        options: [
      "People can't always recognize the symptoms of tiredness",
      "Most people with insomnia actually sleep too much",
      "Insomnia is caused only by physical health problems"
        ],
      }
    ],
    transcript: "Bài văn này không có audio (học thuộc đáp án là được)." 
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",  // Phần tử thứ hai
    topic: "A book about a life of a scientist",
    questions: [
      {
        id: "17.1", 
        question: "Why is the book so popular?",
        options: [
      "It uses simple language to describe complex ideas",
      "It was endorsed by a famous celebrity",
      "It contains many colorful illustrations"
        ]
      },
      {
        id: "17.2", 
        question: "What do people criticize about the book?",
        options: [
      "It is similar to the previous book about the scientist",
      "It is too short to be meaningful",
      "It focuses too much on entertainment rather than facts"
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
