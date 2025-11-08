document.addEventListener('DOMContentLoaded', function() {

// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI ///////////////
// ===============================================================================================================

const listeningQuestions1 = [

  {
    heading: "Question 1 of 17",
    audioUrl: "audio/question1_13/audio_de3_q1.mp3",
    question: "What did the mother call her daughter to help her buy?",
    options: ["eggs", "bread", "milk"],
    correctAnswer: "eggs",
    transcript: "Hi Sally, it’s Mom. How are you? I just wanted to remind you about dinner tonight. We’re having your favorite, spaghetti! Don’t forget to pick up your brother from school at 4 o’clock. Oh, and can you stop by the store on your way home? We’re out of eggs, and I need some to finish baking the cake. Thanks, sweetie!"
  },
  {
    heading: "Question 2 of 17",
    audioUrl: "audio/question1_13/audio_de3_q2.mp3",
    question: "Samia is going to meet her friend. What time are they going to meet?",
    options: ["9:30", "11:00", "10:00"],
    correctAnswer: "10:00",
    transcript: "Hey! I was thinking about our meet-up. We plan to meet at 9:30, but I just realized I have a class that finishes at 9:00, so I might not make it in time. How about we meet at 10:00 instead? That should give me enough time to get there. Does that work for you?"
  },
  {
    heading: "Question 3 of 17",
    audioUrl: "audio/question1_13/audio_de3_q3.mp3",
    question: "Anna is calling her brother Max. What does Anna do later in the afternoon?",
    options: ["Pick up the kids", "Stay late at the office", "Hang out with friends"],
    correctAnswer: "Stay late at the office",
    transcript: "Hey Max, it’s Anna. I want to ask you for a favor this afternoon. I have to stay late at the office to finish some work. Could you please pick up my kids from school? After that, I know you’ll want to hang out with your friends, so feel free to take them along. I really appreciate your help!"
  },
  {
    heading: "Question 4 of 17",
    audioUrl: "audio/question1_13/audio_de3_q4.mp3",
    question: "A woman is talking about her favorite film on the radio. What film did she recommend?",
    options: ["Action film", "Romantic film", "Comedy film"],
    correctAnswer: "Action film",
    transcript: "Today, I want to recommend an action film that really impressed me. The lead actor, who is usually known for his romantic roles, delivered an outstanding performance. Of course, if you’re in the mood for something lighter, there are plenty of comedies to enjoy as well. But if you’re looking for excitement, this action film is definitely worth a watch!"
  },
{
  heading: "Question 5 of 17",
  audioUrl: "audio/question1_13/audio_de3_q5.mp3",
  question: "Where does Malik want to go?",
  options: ["The town hall", "The library", "The park"],
  correctAnswer: "The town hall",
  transcript: "Malik has been hearing a lot about an important event, and the town hall is where he wants to go because he believes it will give him a chance to learn more, engage with the community, and share his own ideas."
}
,
{
  heading: "Question 6 of 17",
  audioUrl: "audio/question1_13/audio_de3_q6.mp3",
  question: "Greg is talking about a working day in his life. How does he go to work?",
  options: ["By bus", "By car", "By bike"],
  correctAnswer: "By bus",
  transcript: "Hi, everyone! I’m Greg, and I want to tell you about a typical working day in my life. I usually wake up early, around 7 A.M. After a quick breakfast, I get ready for work. I like to wear smart clothes because I work in an office. I go by bus every day, which takes about 30 minutes. I enjoy looking out the window and listening to music on my way. When I arrive at the office, I start my day by checking emails and planning my tasks. I have meetings with my team, and we work together on projects."
},
{
  heading: "Question 7 of 17",
  audioUrl: "audio/question1_13/audio_de3_q7.mp3",
  question: "Listen to a nutrition expert. What time is the best for children to eat fruit?",
  options: ["In the morning", "In the afternoon", "In the evening"],
  correctAnswer: "In the morning",
  transcript: "Hello, everyone! I’m here to talk about nutrition and how important it is for our health. Eating fruits is very beneficial, especially for children. Fruits have vitamins and minerals that help kids grow strong and stay healthy. The best time for children to eat fruit is in the morning. This gives them energy for the day ahead. You can add fruit to breakfast, like in a smoothie or with yogurt. It’s a delicious and healthy way to start the day! So, let’s encourage our kids to eat more fruit in the morning! Thank you!"
},
{
  heading: "Question 8 of 17",
  audioUrl: "audio/question1_13/audio_de3_q8.mp3",
  question: "Listen to a woman explaining her morning routine to her friend. Why do women get up early?",
  options: ["To go to work", "To take care of their kids", "To have some quiet time"],
  correctAnswer: "To have some quiet time",
  transcript: "I usually wake up early each day before anyone else. Some people get up early to go to work or to take care of their kids, but for me, it’s all about enjoying that calm before the busyness begins. I enjoy this quiet time because it helps me start my day peacefully. It’s nice to have a few moments to myself, sipping coffee and planning my day ahead."
},
{
  heading: "Question 9 of 17",
  audioUrl: "audio/question1_13/audio_de3_q9.mp3",
  question: "A man is talking to his friend. Why does he need to learn to drive?",
  options: ["To go on a road trip", "To take his family on vacations", "He has to drive to work"],
  correctAnswer: "He has to drive to work",
  transcript: "Man: Hey, Sarah. I’ve got some news—I’m moving to a new place.\nWoman: Oh really? That sounds exciting! Where’s your new place?\nMan: It's actually pretty far from my workplace, and the public transport there isn't great. So, I've been thinking, I need to learn how to drive.\nWoman: Yeah, that makes sense. It's hard to rely on public transport if it's not reliable. Have you ever driven before? Man: Not really. I've always used buses and trains, but now it looks like I don't have a choice. I need to get a license.\nWoman: You'll get the hang of it. Driving will definitely make your commute easier. Are you planning to take lessons soon?\nMan: Yeah, I'm going to sign up for a driving school next week. Hopefully, I can get it done quickly."
},
{
  heading: "Question 10 of 17",
  audioUrl: "audio/question1_13/audio_de3_q10.mp3",
  question: "Two friends are talking with each other. What did they both buy?",
  options: ["Clothes", "Shoes", "Books"],
  correctAnswer: "Clothes",
  transcript: "Man: I just got back from shopping. I found a great jacket and also picked up some tea.\nWoman: Nice! What kind of jacket did you get?\nMan: It’s a stylish leather jacket. I think it’ll be perfect for the fall. What about you?\nWoman: I bought a cozy sweater and also grabbed a delicious cake.\nMan: Sounds great! Those are perfect for this weather. Woman: Thanks! I’m excited to try the cake later. Looks like we both made good choices today!\nMan: Absolutely! New clothes and tasty treats for the chilly days ahead!"
},
{
  heading: "Question 11 of 17",
  audioUrl: "audio/question1_13/audio_de3_q11.mp3",
  question: "What area is he describing?",
  options: ["A shopping district", "A university area", "A residential neighborhood"],
  correctAnswer: "A university area",
  transcript: "He’s describing a place with a vibrant atmosphere, full of students and professors. The university area is where he’s talking about, known for its lively campus, beautiful buildings, and the mix of academic and social life that surrounds it."
},
{
  heading: "Question 12 of 17",
  audioUrl: "audio/question1_13/audio_de3_q12.mp3",
  question: "A man wants to buy a new house. What is his biggest problem?",
  options: ["Finding the right house", "Persuading his family", "Getting the financing"],
  correctAnswer: "Persuading his family",
  transcript: "I’ve been having a tough time lately. I really want to move abroad for a new job, but my family isn’t on board with it. They’re worried about me leaving and don’t understand why I want to go so far away. I’ve tried to explain all the benefits, but they just don’t seem to get it. It’s really frustrating because I want their support, but it feels like I’m not getting through to them."
},
{
  heading: "Question 13 of 17",
  audioUrl: "audio/question1_13/audio_de3_q13.mp3",
  question: "Listening to a tour guide talking about Rock City. How old is the city?",
  options: ["1000 years", "2000 years", "1500 years"],
  correctAnswer: "1500 years",
  transcript: "Welcome to Rock City, everyone! I'm excited to show you around this amazing place. Rock City has a very long and interesting history. People first started living here about 1500 years ago. Can you believe how old that is? It's older than many famous cities in the world! The city got its name because of all the big rocks you can see around us. Over time, people built houses and roads between these rocks. Today, we can still see many old buildings from long ago."
},
];

// Dữ liệu câu hỏi 14
const question14Data = {
  audioUrl: "audio/question14/audio_de3.mp3",  // Đường dẫn audio
  topic: "Topic: Online shopping",                  
  options: [
    "The products are delivered",
    "It is cheaper",
    "It saves time",
    "There are more choices",
    "It increases efficiency",
    "It provides better customer service"
  ],
  transcript: `A: "I used to be the person who didn’t like shopping online, but ever since I experienced home delivery, I no longer shop in stores. When I shop online, the delivery person brings the package right to my door, even up to my floor, and knocks on my apartment door, so I don’t even need to step outside. I really enjoy this convenience."

B: "Shopping online has helped me save quite a bit of money. After a few months of online shopping, I was able to save enough to buy a new bicycle. But don't get me wrong, I haven't been eating any less or cutting back on the groceries I buy. It's just that online shopping allows me to compare prices and choose the store with the best deal."

C: "I’m a pretty busy person, and I often don’t have enough time because of my hectic work schedule. That’s why I always shop online to save time. This way, I don’t need to go to the store in person, and someone will deliver the items directly to me. Additionally, online shopping is very convenient because, with just a few clicks, I can buy everything I want without having to go from one store to another."

D: "I don't shop online because it's cheaper or because of the fast shipping. I shop online because, when browsing online stores, I have a wide range of choices. For the same item, there are many different types and brands for me to choose from and compare, which allows me to pick the one I like the most."`
};
// Dữ liệu câu hỏi 15
const question15Data = {
  audioUrl: "audio/question15/audio_de3.mp3", // Đường dẫn đến file audio
  topic: "Topic: Actors (câu này nhiều phiên bản nên cứ chọn MWBB - Mẹ Win bừa bộn)",
  transcript: `W: What do you think about casting actors before casting them?

M: I think it's absolutely necessary and the most important thing because it determines whether the actor is suitable for the role or not.

W: I understand that auditions are important. But if we only rely on a 15 to 20 minute audition, that short period of time cannot really show us the actor's full potential.

M: That's a good point. So I think it's better to let actors perform freestyle, not relying on the script, so that they can improvise, thereby clearly showing their acting skills.

W: But actors often respond best to a good script. And they also need a script provided by the director and directed to act according to the script. Actors can’t always act freely.

M: What do you think about stage actors moving to film acting?

W: I think they are two completely different fields. When I was studying acting in college, stage acting and film acting were two completely separate subjects. They require different skills and qualities from the actor. So, it’s not easy to move from stage acting to film acting and vice versa.

M: That’s right. These are two very different forms of acting and they require different skills from the actor. However, as actors, I think we all need encouragement and support from the audience.

W: I completely agree. Actors need praise and feedback to feel recognized for their efforts and contributions.`,
  questions: [
    "1. Auditions are the most important of casting",
    "2. Actors respond best to a strong script",
    "3. Theatre acting and movie acting require different skills",
    "4. Actors need to be praised"
  ],
  correctAnswer: ["Man", "Woman", "Both", "Both"] // Đáp án đúng của từng câu hỏi
};
// Dữ liệu câu hỏi 16 & 17
const question16Data = [
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "Advertising and sponsoring",
    questions: [
      {
        id: "16.1",
        question: "What is the importance of advertising?",
        options: [
          "It can help reach new customers",
          "It increases the product price",
          "It can build brand recognition"
        ]
      },
      {
        id: "16.2",
        question: "Why shouldn't we sponsor sports tournaments?",
        options: [
          "They can generate negative publicity for the sport",
          "They are too expensive",
          "They can create unfair competition"
        ],
      }
    ],
    transcript: "Bài văn này không có audio (học thuộc đáp án là được)." 
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",  // Phần tử thứ hai
    topic: "Famous writers",
    questions: [
      {
        id: "17.1", 
        question: "What do these two famous writers have in common?",
        options: [
          "They both make references to each other in their work",
          "They both wrote in the same genre",
          "They both were born in the same country"
        ]
      },
      {
        id: "17.2", 
        question: "What is special about their works?",
        options: [
          "The meaning of their work is not always easily identified",
          "Their works are all based on real events",
          "They use simple language and structure"
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
