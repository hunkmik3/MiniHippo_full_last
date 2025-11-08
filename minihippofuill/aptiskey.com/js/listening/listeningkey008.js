document.addEventListener('DOMContentLoaded', function() {

// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI ///////////////
// ===============================================================================================================

const listeningQuestions1 = [
  {
    heading: "Question 1 of 17",
    audioUrl: "audio/question1_13/audio_de8_q1.mp3",
    question: "Listen to a weather forecast. Where will the weather be best?",
    options: ["In the west", "In the south", "In the east"],
    correctAnswer: "In the east",
    transcript: "Good evening, everyone! Here’s your weather update for today. Unfortunately, the weather down south isn’t looking too great—strong winds and heavy rain are expected throughout the day, so it might be best to avoid any outdoor plans in that region. On a brighter note, the west will have decent weather with clear skies and mild temperatures, making it a nice option if you’re looking for some fresh air. However, the best weather can be found in the east, where we’re expecting sunny skies and perfect temperatures for any outdoor activities. If you’re planning to travel, I’d highly recommend heading east for the best conditions. Safe travels, and make sure to check local forecasts for any changes!"
  },
  {
    heading: "Question 2 of 17",
    audioUrl: "audio/question1_13/audio_de8_q2.mp3",
    question: "Listen to the announcement from a travel agent representative. Why is the air travel cancelled?",
    options: ["Staff shortage", "Poor weather conditions", "Technical issues"],
    correctAnswer: "Poor weather conditions",
    transcript: "Good afternoon, everyone. I’d like to start by saying that we’re doing everything we can to assist you with your travel plans today. Unfortunately, due to poor weather conditions, our flight has been cancelled. I know this isn’t the news you were hoping for, but your safety comes first. That said, we do have alternatives available. The train services are still running, and buses are also operating, so you have options to continue your journey. If you’d like to explore these alternatives, please come see us, and we’ll help with the arrangements. Thank you for your patience and understanding."
  },
  {
    heading: "Question 3 of 17",
    audioUrl: "audio/question1_13/audio_de8_q3.mp3",
    question: "Which platform do you need to take if you want to travel to Edinburgh? / Listen to an announcement. Which platform to wait for the train?",
    options: ["Platform One", "Platform Two", "Platform Three"],
    correctAnswer: "Platform Two",
    transcript: "Attention, all passengers! The 10:30 train to Greenfield is now arriving at Platform 2. Please make sure you have your ticket ready before boarding. This train will stop at River Station and Oakwood before reaching its final destination. Be careful when stepping onto the train, and mind the gap. For your safety, please keep your belongings close and follow all instructions from the staff. Thank you for traveling with us today!"
  },
  {
    heading: "Question 4 of 17",
    audioUrl: "audio/question1_13/audio_de8_q4.mp3",
    question: "When will Anna meet her friend? / A man is calling his friend, Maria. When will he see her?",
    options: ["10am on Saturday", "8pm on Sunday", "9am on Sunday"],
    correctAnswer: "9am on Sunday",
    transcript: "Hey Maria, it's me! I wanted to give you a quick call to let you know that I'll be visiting your town this weekend. I’ve got a few things planned—going to check out the local market and maybe explore some of the nearby parks. But the best part? I’ll finally get to see you! I’ll be at your place at 9 a.m. on Sunday, so we can catch up. Can’t wait to hang out!"
  },
{
  heading: "Question 5 of 17",
  audioUrl: "audio/question1_13/audio_de8_q5.mp3",
  question: "How long does it take to get to the station?",
  options: ["20 minutes", "15 minutes", "25 minutes"],
  correctAnswer: "20 minutes",
  transcript: "It usually takes about 20 minutes to get to the station, depending on traffic. It’s not too far, so it's a convenient trip to catch the train."
},
  {
    heading: "Question 6 of 17",
    audioUrl: "audio/question1_13/audio_de8_q6.mp3",
    question: "Why was the trip to the museum delayed? / A tour guide is making an announcement. Why was the tour canceled?",
    options: ["Not enough people", "Bad weather", "Transportation issue"],
    correctAnswer: "Not enough people",
    transcript: "Hello everyone, I hope you’re all having a good day. I’m your tour guide, and I was really looking forward to showing you around the city today. However, there is a small issue. The weather is perfect, and transportation is not a problem; everything is ready for our trip. Certainly, these are not the problems. Unfortunately, we don’t have enough people for the tour today. Because of this, we have to cancel the tour. I’m really sorry for the inconvenience, and I hope we can see you next time!"
  },
  {
    heading: "Question 7 of 17",
    audioUrl: "audio/question1_13/audio_de8_q7.mp3",
    question: "A man is talking about his trip. What did he enjoy last year?",
    options: ["Hiking", "Cycling", "Swimming"],
    correctAnswer: "Cycling",
    transcript: "Last year, I had an amazing trip! One of the best things I enjoyed was going cycling in the countryside. The views were stunning, and it felt great to be outdoors. I also went for a walk a few times, but cycling really allowed me to explore more areas. We even had a picnic one day, which was lovely too!"
  },
  {
    heading: "Question 8 of 17",
    audioUrl: "audio/question1_13/audio_de8_q8.mp3",
    question: "Where is the girl's office? / Listen to a tour guide. Where is the office located?",
    options: ["Opposite the hotel", "Next to the park", "In the shopping mall"],
    correctAnswer: "Opposite the hotel",
    transcript: "Hello, everyone! Welcome to our tour! My name is Sam, and I’m your tour guide today. I’m excited to show you around this beautiful city. We will visit many interesting places, including parks, museums, and local markets. As we walk, I’ll share fun facts and stories about each location. If you have any questions, feel free to ask! Now, before we start, I want to let you know that our office is opposite the hotel where you are staying. If you need any help or information during your stay, you can always come to us. Let’s begin our adventure and enjoy exploring together!"
  },
  {
    heading: "Question 9 of 17",
    audioUrl: "audio/question1_13/audio_de8_q9.mp3",
    question: "A man is talking about how he goes to work. Why does he prefer traveling by train?",
    options: ["It’s cheaper", "It’s comfortable", "Practical"],
    correctAnswer: "Practical",
    transcript: "I’ve been thinking about how to get to work every day. At first, I considered driving, but the traffic is always really bad in the morning. Then, I thought about riding my bike, but it’s too far, and I’d be tired before I even start my day. The bus is another option, but it’s often late. After thinking about all the choices, I decided to travel by train. It’s practical because it’s on time, and I can relax during the trip. Plus, the station is close to my office!"
  },
  {
    heading: "Question 10 of 17",
    audioUrl: "audio/question1_13/audio_de8_q10.mp3",
    question: "A man is calling his friend to meet for coffee. Where is the coffee shop located?",
    options: ["Opposite the gift shop", "In the shopping center", "Next to the bookstore"],
    correctAnswer: "Opposite the gift shop",
    transcript: "Hey, are you free for coffee later? I found a great new place in town. It’s not hard to find at all. You know the big gift shop on Main Street? Well, the coffee shop is right across from it. Just look for the gift shop, then cross the street. You’ll see the coffee shop right there, opposite the gift shop. They have amazing pastries too. Let’s meet there at 3 PM, okay?"
  },
  {
    heading: "Question 11 of 17",
    audioUrl: "audio/question1_13/audio_de8_q11.mp3",
    question: "Tom is calling his mom. Who is visiting Tom this weekend?",
    options: ["His aunt and uncle", "His sister and her children", "His cousin"],
    correctAnswer: "His sister and her children",
    transcript: "Hey, mom! Are you coming over this weekend? I’d really love to see you! What? You’re busy? That’s too bad. But at least my sister is visiting with her kids. I’m excited about that! Is uncle coming with her too? Oh, he’s not? That’s a shame. Hopefully, you can all get together next time!"
  },
  {
    heading: "Question 12 of 17",
    audioUrl: "audio/question1_13/audio_de8_q12.mp3",
    question: "Who does she live with? / A woman is talking about her vacation. What is the relationship between Lisa and the speaker?",
    options: ["Best friends", "Cousins", "Sisters"],
    correctAnswer: "Best friends",
    transcript: "I just got back from an amazing vacation with Lisa! We’ve been friends for years, and this trip really brought us closer. I can’t imagine going with anyone else. Some people think we look like mother and daughter because we care for each other so much, but it’s really just best friends hanging out!"
  },
  {
    heading: "Question 13 of 17",
    audioUrl: "audio/question1_13/audio_de8_q13.mp3",
    question: "A woman shares her job with her friend. Why does she want to become a writer?",
    options: ["Help people", "Become famous", "Earn money"],
    correctAnswer: "Help people",
    transcript: "I have been thinking a lot about my job, and I really want to become a writer. It’s not just about earning a lot of money or becoming famous for me. My main reason is to help people improve themselves. I believe stories can inspire and support others during hard times. I hope my writing can make a difference in their lives, and that’s why I’m choosing this path."
  }
];


// Dữ liệu câu hỏi 14
const question14Data = {
  audioUrl: "audio/question14/audio_de8.mp3",  // Đường dẫn audio
  topic: "Topic: The internet",                  
  options: [
      "watch films",
      "communicate with friends",
      "complete assignments",
      "find transport information",
      "buy groceries online",
      "listen to the radio"
  ],
  transcript: "A: \"I am a big fan of newly released movies, but the cost of going to the cinema is too high. I'm just a student, so I can't afford to go to the cinema regularly to indulge in my hobby. Therefore, I think the internet is great because it allows me to watch movies for free at home. I save both the time of going to the cinema and a considerable amount of money.\"\n\nB: \"In today's digital age, the internet helps us access social media to stay constantly connected with friends. Especially since I have relatives mainly living abroad or in distant cities, the internet has been a great help for my family to stay in touch. We often video call each other to share daily stories.\"\n\nC: \"The internet is a great resource for research, finding materials, and useful information for studying. My friends and I often go to each other's houses to do homework together. Instead of spending hours trying to figure out how to do our homework, we quickly go online and find the answers.\"\n\nD: \"I see that people often use the internet to watch movies, read newspapers, quickly update the news, and so on. But I usually use the internet to find directions and public transport to my friends' and relatives' houses. I'm a forgetful person, and I often forget the way, even if I've been there a hundred times. So the internet helps me a lot in not getting lost and easily find nearby public transport.\""
};
// Dữ liệu câu hỏi 15
const question15Data = {
  audioUrl: "audio/question15/audio_de8.mp3", // Đường dẫn đến file audio
  topic: "Topic: University and technology",
  transcript: "M: What course are you taking these days?\n\nW: I'm currently pursuing an online university degree. It's really suitable and convenient because I can study while working. Technology has truly made education much more accessible.\n\nM: That's amazing. I still remember the old days when you had to stand in long lines to borrow a book from the library, which took a lot of time. And by the time it was your turn, the book was often already gone. Now, when we want to read a book, we just type the title online and have it immediately.\n\nW: Exactly, study materials were really scarce back then, unlike now.\n\nM: That’s why I’m thinking, why not make all school classes online? It would save a lot of costs.\n\nW: I think attending school in person is still very necessary because meeting friends and socializing helps us gain more soft skills.\n\nM: Don’t forget that young people do have a reputation for being less social. They often prefer talking on social media rather than meeting in person.\n\nW: Additionally, I think the variety of courses available nowadays is also a good way to improve education.\n\nM: I don't think so. Offering too many diverse courses can make traditional and core subjects seem less important and neglected.\n\nW: We should also consider competition among universities. It’s essential for universities to continuously improve their programs and attract more funding, especially with the current trend of universities seeking financial autonomy.\n\nM: I don’t think we should turn education into a race like competing businesses. If universities need funding, they can report it to the government and educational organizations.",
  questions: [
    "1. Technology helps make education more accessible",
    "2. Social interaction is important",
    "3. The diverse curriculum is not an advantage",
    "4. University competition should be encouraged"
  ],
  correctAnswer: ["Both", "Woman", "Man", "Woman"] // Đáp án đúng của từng câu hỏi
};
// Dữ liệu câu hỏi 16 & 17
const question16Data = [
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "Writer's block",
    questions: [
      {
        id: "16.1",
        question: "What helps writers focus more on writing?",
        options: [
          "Create dedicated periods",
          "Work in noisy environments",
          "Rely entirely on inspiration"
        ]
      },
      {
        id: "16.2",
        question: "What is a common mistake writers make when generating ideas?",
        options: [
          "Refusing to seek the advice of other people",
          "Writing ideas only in digital format",
          "Spending too much time researching grammar rules"
        ],
      }
    ],
    transcript: "Bài văn này không có audio (học thuộc đáp án là được)." 
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",  // Phần tử thứ hai
    topic: "Professionalism at work",
    questions: [
      {
        id: "17.1", 
        question: "How is professionalism demonstrated at work?",
        options: [
          "Maintain the positive attitude",
          "Always agree with your manager",
          "Avoid giving feedback to colleagues"
        ]
      },
      {
        id: "17.2", 
        question: "What is the public's view of current professionalism?",
        options: [
          "Change its definition",
          "Increase working hours",
          "Reduce opportunities for remote work"
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
