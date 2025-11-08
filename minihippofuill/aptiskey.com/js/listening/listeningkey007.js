document.addEventListener('DOMContentLoaded', function() {

// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI ///////////////
// ===============================================================================================================

const listeningQuestions1 = [
  {
    heading: "Question 1 of 17",
    audioUrl: "audio/question1_13/audio_de7_q1.mp3",
    question: "Listen to a voice message. How does Evan feel?",
    options: ["Happy", "Tired", "Sick"],
    correctAnswer: "Sick",
    transcript: "Hi, Evan! This is Mom. I just wanted to leave you a message to check on you. I heard you’re not feeling well, and I’m really worried about you. Make sure you’re resting and drinking plenty of fluids. Do you need anything? I can bring you some soup or your favorite snacks. Please take care of yourself! I love you and hope you feel better soon. Call me back when you can!"
  },
  {
    heading: "Question 2 of 17",
    audioUrl: "audio/question1_13/audio_de7_q2.mp3",
    question: "The train was delayed. What time does the train leave? / Listen to a man talking about their train journey. What time did the train depart?",
    options: ["9:00", "9:15", "9:30"],
    correctAnswer: "9:30",
    transcript: "This morning was rough at the station. I thought the train would leave around 9:00, but I heard it would be delayed. It finally departed at 9:30, though some people said it might be even later. Usually, if it’s delayed, it could leave as late as 10:00. I’m glad it didn’t take that long today!"
  },
  {
    heading: "Question 3 of 17",
    audioUrl: "audio/question1_13/audio_de7_q3.mp3",
    question: "A man and woman are discussing their plans for the evening. What do the man and woman decide to do in the evening?",
    options: ["Go to the movies", "Make plans later", "Stay at home"],
    correctAnswer: "Make plans later",
    transcript: "I’m thinking about what to do this evening. I could go to the movies, but I’m not sure if that’s the best idea. I might prefer to stay at home and relax. However, I want to discuss this with my friend first. It might be better to plan when we can decide together. I believe keeping our options open is a good idea. So for now, I’ll wait and see what we want to do."
  },
  {
    heading: "Question 4 of 17",
    audioUrl: "audio/question1_13/audio_de7_q4.mp3",
    question: "A woman is talking about her holiday plan. Where is she going on holidays?",
    options: ["The beach", "The mountains", "The city"],
    correctAnswer: "The mountains",
    transcript: "I'm so excited about my upcoming holiday! I've been thinking about where to go for a long time. Some of my friends suggested going to a nice beach. Others talked about exploring interesting caves. But I've made up my mind - I'm going to the mountains! The mountains are so beautiful with their green forests. I can't wait to breathe the fresh air up there. They are perfect for relaxing and enjoying nature."
  },
  {
    heading: "Question 5 of 17",
    audioUrl: "audio/question1_13/audio_de7_q5.mp3",
    question: "A tour guide is talking about the group's traveling schedule. Where will the group wait for the bus?",
    options: ["By the hotel's main entrance", "In the lobby", "At the train station"],
    correctAnswer: "By the hotel's main entrance",
    transcript: "Good morning, everyone! Let me walk you through today’s schedule. First, we’ll start the day at 9:00 AM with a visit to the City Museum, where you’ll have about two hours to explore the exhibits. After that, at 12:30 PM, we’ll head to the Central Park for a picnic lunch and a relaxing stroll. Around 3:00 PM, we’ll make our way to the Old Town Market, where you can shop for souvenirs and enjoy some local treats. We’ll wrap up our activities by 6:00 PM, giving you a little free time back at the hotel. Finally, at 8:00 PM, we’ll meet at the hotel’s main entrance to catch the bus to the airport. Make sure to be on time, and we’ll head to the airport together!"
  },
  {
    heading: "Question 6 of 17",
    audioUrl: "audio/question1_13/audio_de7_q6.mp3",
    question: "Listen to a tour guide introducing the tour. Where will tea be served?",
    options: ["In the park", "The hotel", "The river boat"],
    correctAnswer: "The river boat",
    transcript: "Welcome to our scenic tour! I’m excited to show you this beautiful area. We’ll start along the coast to enjoy the amazing ocean views. Then, we’ll go up to the mountain looking for some breathtaking views. After that, we’ll head down to the harbor and take a relaxing riverboat cruise. While on the boat, you can enjoy afternoon tea and see the charming riverside scenery. After the boat trip, we’ll end the day with a walk on the beach. Don’t forget your camera—there will be lots of chances for great photos!"
  },
  {
    heading: "Question 7 of 17",
    audioUrl: "audio/question1_13/audio_de7_q7.mp3",
    question: "A man is talking about the city concert. How will the concert end?",
    options: ["With a fireworks display", "With a famous singer", "With the city's favorite group"],
    correctAnswer: "With the city's favorite group",
    transcript: "I can’t wait for the concert this weekend! It’s going to be such an exciting event. The highlight ending will be the city’s favorite group performing on stage. I’ve heard they have some amazing songs planned. There will also be a fireworks performance to celebrate before that, and I’m sure the orchestra will do some singing as well. It’s going to be a night to remember!"
  },
  {
    heading: "Question 8 of 17",
    audioUrl: "audio/question1_13/audio_de7_q8.mp3",
    question: "What is the phone number of the store? (0080...) / A man calls the teleshop. What is the teleshop number?",
    options: ["201030", "102030", "301020"],
    correctAnswer: "201030",
    transcript: "Hello, I need to call the teleshop for some information. My phone is not working. Can you remind me of the number? I think it starts with 20 or 10 or 30 something. Is it 102030 or 301020? No, wait! I remember now—it’s 201030! I really need to order that new gadget. Thanks for your help!"
  },
  {
    heading: "Question 9 of 17",
    audioUrl: "audio/question1_13/audio_de7_q9.mp3",
    question: "Alice is calling her friend. What did she lose?",
    options: ["Book", "Phone", "Laptop"],
    correctAnswer: "Phone",
    transcript: "Hey, it's Alice. I think I might have left something at your house. I had my book with me. It's in my backpack. My laptop’s here too. But I can’t find my phone anywhere! Did you happen to see it after I left? I think I might have left it on the table."
  },
  {
    heading: "Question 10 of 17",
    audioUrl: "audio/question1_13/audio_de7_q10.mp3",
    question: "What time should they meet at the library? What time do men and women meet? / Two people are talking about meeting for dinner. What time does Ahmed meet Rose?",
    options: ["8:00 PM", "Quarter to eight", "7:30 PM"],
    correctAnswer: "Quarter to eight",
    transcript: "Hi Rose. It’s Ahmed, what time should we meet for dinner tonight? How about we meet at quarter past seven instead? Oh wait, I just remembered—I have a meeting ending at a half past seven. Let’s make it quarter to eight instead so we could have 15 minutes to travel. Does that work for you?"
  },
  {
    heading: "Question 11 of 17",
    audioUrl: "audio/question1_13/audio_de7_q11.mp3",
    question: "A woman is talking about her family’s holidays. What did the family do last year?",
    options: ["Camping", "Beach trip", "Road trip"],
    correctAnswer: "Camping",
    transcript: "This year, my family and I are going to the beach for our holiday. I’m really excited because I love swimming and relaxing by the sea. Last year, we went camping on the mountain, which was fun, but this time we wanted to do something different. We’re staying in a small house near the beach, and I can’t wait to watch the sunset every evening. My kids are excited too; they want to build sandcastles and play in the water. I think it’s going to be a great holiday!"
  },
  {
    heading: "Question 12 of 17",
    audioUrl: "audio/question1_13/audio_de7_q12.mp3",
    question: "The woman is walking into a local store. How much are the cleaning products?",
    options: ["Two pounds", "One pound fifty", "Three pounds"],
    correctAnswer: "One pound fifty",
    transcript: "As I walk into the store, I notice that the cleaning products are on sale. They’re usually a bit more expensive, but today they’re only one pound fifty. I was expecting to pay three pounds fifty, so it’s a nice surprise. I grab a few items since I know I’ll need them later. It’s a small store, but the deals are always good here. Time to check out!"
  },
  {
    heading: "Question 13 of 17",
    audioUrl: "audio/question1_13/audio_de7_q13.mp3",
    question: "What advice do they need for decorating their living room? / Mary is talking to her friend about her new home. What does she ask her friend about?",
    options: ["Where to buy a new table", "Where to buy a sofa", "Where to buy curtains"],
    correctAnswer: "Where to buy a new table",
    transcript: "Hi Ivan. It’s Mary. I just moved into my new house. I want something nice for the dining area. I also saw a cute coffee shop nearby, and I’m thinking about getting a mirror for the living room. I need to get some furniture, especially a coffee table. Do you know where to buy one?"
  }
];


// Dữ liệu câu hỏi 14
const question14Data = {
  audioUrl: "audio/question14/audio_de7.mp3",  // Đường dẫn audio
  topic: "Topic: Do exercise",                  
  options: [
    "hate exercising",
    "help improve work performance",
    "find exercise tiring",
    "has fun when exercising with friends",
    "in the library",
    "at the supermarket"
  ],
  transcript: "A: \"My friends often advise me to exercise to maintain a good physique and health. However, I am very busy with a tight work schedule. Even if I weren’t busy, I still wouldn’t like to exercise. I feel uncomfortable as soon as I put on workout clothes. I don’t think exercise is something that suits me.\"\n\nB: \"I know that working out every day is good for my health and helps me get in shape. But what I've found is that exercising actually boosts my productivity a lot and really helps me focus better. So, I always try to squeeze in some exercise before heading to work—it definitely makes me more productive.\"\n\nC: \"We’ve all heard about the many benefits of exercising, and I know about them too. My friends often invite me to work out, but after I exercise, I end up feeling extremely exhausted and spend the rest of the day just lying around to recover.\"\n\nD: \"I often go to the gym to work out, but what really motivates me to workout is catching up with my friends there, not just for improving my health. Plus, it’s a great way to meet and make new friends. For me, exercising is just another chance to socialize.\""
};
// Dữ liệu câu hỏi 15
const question15Data = {
  audioUrl: "audio/question15/audio_de7.mp3", // Đường dẫn đến file audio
  topic: "Topic: The music",
  transcript: "M: Did you hear about the concert last night? A lot of young people attended.\n\nW: Yes, I know about that concert; it was very popular. I don’t understand why so many young people are so eager to attend. They're blindly idolizing young singers, and these idols don’t really teach them anything good.\n\nM: I see it differently. The young singers today are very talented, and they do a lot of charitable work for society. I think young people look up to them and follow their example.\n\nW: Yes, they volunteer a lot, but they do it for the wrong reasons. They only want to boost their own fame.\n\nM: Oh, I think you don't like young singers because you don't enjoy their music, right?\n\nW: Exactly, I only like listening to classical music from previous generations. I think music preferences are very personal and each generation has its own unique taste in music. But music is always a universal language that conveys emotions everyone can understand.\n\nM: I didn’t study music like you, so I don’t really have any ideas about this.\n\nW: You don’t need to study music to understand it. Just think about why you cry during a sad movie scene when the music plays or why you feel energized when you hear a happy song. Isn’t that right?\n\nM: Yes, I think that’s why films always try to include at least one piece of music.",
  questions: [
    "1. Singers play a good role for young people",
    "2. Taste in music is a highly personal thing",
    "3. Music is a universal language",
    "4. Music can manipulate people's feelings"
  ],
  correctAnswer: ["Man", "Both", "Woman", "Both"] // Đáp án đúng của từng câu hỏi
};
// Dữ liệu câu hỏi 16 & 17
const question16Data = [
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "A research into happiness",
    questions: [
      {
        id: "16.1",
        question: "How has this research into happiness been responded to?",
        options: [
          "It has not been accurately reported by the media",
          "It has been completely ignored by the public",
          "It has led to immediate changes in government policy"
        ]
      },
      {
        id: "16.2",
        question: "What is the speaker's opinion on this research in general?",
        options: [
          "The research is unlikely to find a conclusive answer",
          "The research has already changed public attitudes",
          "The researchers are biased in their approach"
        ],
      }
    ],
    transcript: "Bài văn này không có audio (học thuộc đáp án là được)." 
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",  // Phần tử thứ hai
    topic: "Criticism of the new novel",
    questions: [
      {
        id: "17.1", 
        question: "What attracts readers to this novel?",
        options: [
          "The characters were interesting",
          "The book includes detailed historical facts",
          "The chapters are very short and easy to read"
        ]
      },
      {
        id: "17.2", 
        question: "What is the speaker's opinion about this novel?",
        options: [
          "It will establish the author's popularity",
          "It needs major editing before publication",
          "It’s unlikely to appeal to international readers"
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
