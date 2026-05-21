(function() {

// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI ///////////////
// ===============================================================================================================

window.listeningQuestions1 = [
  {
    heading: "Question 1 of 17",
    audioUrl: "audio/question1_13/audio_q1.mp3",
    question: "What is the teleshop number?",
    options: ["201030", "201032", "301030"],
    correctAnswer: "201030",
    transcript: ""
  },
  {
    heading: "Question 2 of 17",
    audioUrl: "audio/question1_13/audio_q2.mp3",
    question: "What color top is he going to buy?",
    options: ["Black", "White", "Pink"],
    correctAnswer: "Black",
    transcript: ""
  },
  {
    heading: "Question 3 of 17",
    audioUrl: "audio/question1_13/audio_q3.mp3",
    question: "What is she going to change in their house?",
    options: ["The window", "Living room", "Kitchen"],
    correctAnswer: "The window",
    transcript: ""
  },
  {
    heading: "Question 4 of 17",
    audioUrl: "audio/question1_13/audio_q4.mp3",
    question: "How many clients are Americans?",
    options: ["Two", "One", "Four"],
    correctAnswer: "One",
    transcript: ""
  },
  {
    heading: "Question 5 of 17",
    audioUrl: "audio/question1_13/audio_q5.mp3",
    question: "Where are they standing?",
    options: ["Residential area", "At the park", "In front of their house"],
    correctAnswer: "Residential area",
    transcript: ""
  },
  {
    heading: "Question 6 of 17",
    audioUrl: "audio/question1_13/audio_q6.mp3",
    question: "How long does it take to get to the station?",
    options: ["45 minutes", "55 minutes", "40 minutes"],
    correctAnswer: "40 minutes",
    transcript: ""
  },
  {
    heading: "Question 7 of 17",
    audioUrl: "audio/question1_13/audio_q7.mp3",
    question: "How much does the flight in the morning cost?",
    options: ["550 pounds", "350 pounds", "300 pounds"],
    correctAnswer: "350 pounds",
    transcript: ""
  },
  {
    heading: "Question 8 of 17",
    audioUrl: "audio/question1_13/audio_q8.mp3",
    question: "How much did she sell it for?",
    options: ["60 dollars", "55 dollars", "50 dollars"],
    correctAnswer: "50 dollars",
    transcript: ""
  },
  {
    heading: "Question 9 of 17",
    audioUrl: "audio/question1_13/audio_q9.mp3",
    question: "What is the main reason he gets late?",
    options: ["There was heavy traffic", "Missed the train", "He woke up too late"],
    correctAnswer: "Missed the train",
    transcript: ""
  },
  {
    heading: "Question 10 of 17",
    audioUrl: "audio/question1_13/audio_q10.mp3",
    question: "When is the work due?",
    options: ["On Saturday morning", "On Saturday evening", "On Sunday morning"],
    correctAnswer: "On Saturday morning",
    transcript: ""
  },
  {
    heading: "Question 11 of 17",
    audioUrl: "audio/question1_13/audio_q11.mp3",
    question: "What is the man going to do after work?",
    options: ["Goes running", "Listen to music", "Meet his friends for dinner"],
    correctAnswer: "Goes running",
    transcript: ""
  },
  {
    heading: "Question 12 of 17",
    audioUrl: "audio/question1_13/audio_q12.mp3",
    question: "What is the woman\'s favorite form of entertainment?",
    options: ["Going to the theatre", "Swimming", "Listening to music"],
    correctAnswer: "Going to the theatre",
    transcript: ""
  },
  {
    heading: "Question 13 of 17",
    audioUrl: "audio/question1_13/audio_q13.mp3",
    question: "What was the woman good at?",
    options: ["Plays Football", "Drawing pictures", "Solving math problems"],
    correctAnswer: "Plays Football",
    transcript: ""
  },
  {
    heading: "Question 14",
    audioUrl: "audio/question1_13/audio_q14.mp3",
    question: "Which platform to wait for the train?",
    options: ["Platform 3", "Platform 2", "Platform 4"],
    correctAnswer: "Platform 2",
    transcript: ""
  },
  {
    heading: "Question 15",
    audioUrl: "audio/question1_13/audio_q15.mp3",
    question: "What will the father do?",
    options: ["Hire a new tutor for his son", "Arrange private classes for his son", "Send his son to an evening course"],
    correctAnswer: "Arrange private classes for his son",
    transcript: ""
  },
  {
    heading: "Question 16",
    audioUrl: "audio/question1_13/audio_q16.mp3",
    question: "What does the man want to do next?",
    options: ["Become a Writer", "Become a Artist", "Become a Teacher"],
    correctAnswer: "Become a Writer",
    transcript: ""
  },
  {
    heading: "Question 17",
    audioUrl: "audio/question1_13/audio_q17.mp3",
    question: "What time will they meet?",
    options: ["5 PM", "6 PM", "7 PM"],
    correctAnswer: "7 PM",
    transcript: ""
  },
  {
    heading: "Question 18",
    audioUrl: "audio/question1_13/audio_q18.mp3",
    question: "What shouldn’t they do?",
    options: ["Ask for more time", "Ask for more money", "Ask for more information"],
    correctAnswer: "Ask for more money",
    transcript: ""
  },
  {
    heading: "Question 19",
    audioUrl: "audio/question1_13/audio_q19.mp3",
    question: "What will it end with?",
    options: ["A short speech", "A music show", "A surprise performance"],
    correctAnswer: "A surprise performance",
    transcript: ""
  },
  {
    heading: "Question 20",
    audioUrl: "audio/question1_13/audio_q20.mp3",
    question: "What is her sister like?",
    options: ["They have similar characters", "She is very friendly", "She is quite shy"],
    correctAnswer: "They have similar characters",
    transcript: ""
  },
  {
    heading: "Question 21",
    audioUrl: "audio/question1_13/audio_q21.mp3",
    question: "Which part of the cabinet is original?",
    options: ["The handle", "The wooden door", "The drawer"],
    correctAnswer: "The drawer",
    transcript: ""
  },
  {
    heading: "Question 22",
    audioUrl: "audio/question1_13/audio_q22.mp3",
    question: "How is he going to travel to the city?",
    options: ["By motorbike", "By train", "By bus"],
    correctAnswer: "By train",
    transcript: ""
  },
  {
    heading: "Question 23",
    audioUrl: "audio/question1_13/audio_q23.mp3",
    question: "What time is the best for children to eat fruit?",
    options: ["In the morning", "In the afternoon", "In the evening"],
    correctAnswer: "In the morning",
    transcript: ""
  },
  {
    heading: "Question 24",
    audioUrl: "audio/question1_13/audio_q24.mp3",
    question: "What does she have for lunch?",
    options: ["Rice", "Milk", "Tea"],
    correctAnswer: "Tea",
    transcript: ""
  },
  {
    heading: "Question 25",
    audioUrl: "audio/question1_13/audio_q25.mp3",
    question: "How long did he talk in the speech?",
    options: ["15 minutes", "10 minutes", "20 minutes"],
    correctAnswer: "15 minutes",
    transcript: ""
  }
];

// ===============================================================================================================
// ////////////// CÂU HỎI 1_13 ///////////////
// ===============================================================================================================
window.renderQuestion1_13 = function(data) {
  const radioButtons = document.querySelectorAll('input[name="answer"]');
  radioButtons.forEach(button => {
    button.checked = false;
  });

  const totalQuestions = window.listeningQuestions1 ? window.listeningQuestions1.length : 0;
  const currentNumber = (typeof window.currentIndex !== 'undefined' ? window.currentIndex + 1 : 1);
  document.getElementById("question1_13_id").innerText = 'Question ' + currentNumber + ' of ' + totalQuestions;

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

  const storedAnswer = window.userAnswers[window.currentIndex];
  if (storedAnswer) {
    const savedInput = document.querySelector(`input[name="answer"][value="${storedAnswer}"]`);
    if (savedInput) savedInput.checked = true;
  }

  const playBtn = document.getElementById("playButton");
  const playIcon = document.getElementById("playIcon");
  window.setupPlayButton(audio, playBtn, playIcon);

  const transcriptBox = document.getElementById("transcriptBox");
  const transcriptContent = document.getElementById("transcriptContent");
  transcriptContent.innerText = data.transcript;

  const showTranscriptButton = document.getElementById("showTranscriptButton");

  transcriptBox.style.display = "none";
  showTranscriptButton.innerText = "Show paragraph";

  showTranscriptButton.removeEventListener("click", window.toggleTranscript);
  showTranscriptButton.addEventListener("click", window.toggleTranscript);
}

window.toggleTranscript = function() {
  const transcriptBox = document.getElementById("transcriptBox");
  const showTranscriptButton = document.getElementById("showTranscriptButton");
  if (transcriptBox.style.display === "none") {
    transcriptBox.style.display = "block";
    showTranscriptButton.innerText = "Hide paragraph";
  } else {
    transcriptBox.style.display = "none";
    showTranscriptButton.innerText = "Show paragraph";
  }
}

window.setupPlayButton = function(audio, playBtn, playIcon) {
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

window.currentIndex = 0;
window.userAnswers = [];

window.storeUserAnswer = function(questionIndex, answer) {
  window.userAnswers[questionIndex] = answer;
}

document.querySelectorAll('input[name="answer"]').forEach((input, index) => {
  input.addEventListener('change', function() {
    window.storeUserAnswer(window.currentIndex, this.value);
  });
});

window.onload = function() {
  window.renderQuestion1_13(window.listeningQuestions1[0]);
};

window.showResults_question1_13 = function() {
  const comparisonTableBody = document.getElementById('comparisonTableBody');
  if (!comparisonTableBody) return;
  comparisonTableBody.innerHTML = '';

  let score = 0;

  window.listeningQuestions1.forEach((question, index) => {
    const userAnswer = window.userAnswers[index];
    const isCorrect = userAnswer === question.correctAnswer;
    const textColor = isCorrect ? 'text-success' : 'text-danger';

    if (isCorrect) {
      score += 2;
    }

    // Populate table in modal only (not on page) - format like Reading
    comparisonTableBody.innerHTML += `
      <tr>
        <td class="${textColor} fw-bold">${userAnswer || 'Not answered'}</td>
        <td class="text-success fw-bold">${question.correctAnswer}</td>
      </tr>
    `;
  });

  window.question1_13Score = score;
  // Don't show result on page, only in modal
  // totalScoreDisplay.innerText = `Score: ${score} / ${window.listeningQuestions1.length * 2}`;
  // const resultContainer = document.getElementById('comparisonResult_question1');
  // if (resultContainer) resultContainer.style.display = "block";
}

window.question1_13Score = 0;
window.calculateTotalScore = function() {
  var totalScore = window.question1_13Score;
  const totalScoreEl = document.getElementById('totalScore');
  if (totalScoreEl) totalScoreEl.innerText = 'Your Score: ' + totalScore;
  window.classifyScore(totalScore);
}

window.classifyScore = function(score) {
  let classification = '';
  const totalQuestions = window.listeningQuestions1 ? window.listeningQuestions1.length : 13;
  const maxScore = totalQuestions * 2;
  const percentage = (score / maxScore) * 100;
  if (percentage >= 80) {
    classification = 'Excellent';
  } else if (percentage >= 50) {
    classification = 'Good';
  } else {
    classification = 'Cố gắng thêm nhé!';
  }
  const scoreEl = document.getElementById('scoreClassification');
  if (scoreEl) scoreEl.innerText = 'Classification: ' + classification;
}

const checkResultBtn = document.getElementById('checkResultButton');
if (checkResultBtn) {
  checkResultBtn.addEventListener('click', function() {
    console.log('Check result button clicked');
    try {
      window.showResults_question1_13();
      window.calculateTotalScore();
      // Keep question container visible (like Reading) - don't hide it
      // const questionContainer = document.getElementById("question1_13");
      // if (questionContainer) questionContainer.style.display = "none";
      // Don't show result container on page, only show modal
      // const resultContainer = document.getElementById('comparisonResult_question1');
      // if (resultContainer) resultContainer.style.display = "block";
      // Keep navigation buttons visible (don't hide them)
      // const backBtn = document.getElementById('backButton');
      // if (backBtn) backBtn.style.display = "none";
      // checkResultBtn.style.display = "none";
      // const nextBtn = document.getElementById('nextButton');
      // if (nextBtn) nextBtn.style.display = "none";
      // Show modal with results
      const resultModal = document.getElementById('resultModal');
      if (resultModal && typeof bootstrap !== 'undefined') {
        const modal = new bootstrap.Modal(resultModal);
        modal.show();
        console.log('Result modal shown');
      } else {
        console.error('resultModal not found or bootstrap not available');
      }
    } catch (error) {
      console.error('Error in check result button handler:', error);
    }
  });
}

function renderQuestionByIndex(index) {
  if (index >= 0 && index < window.listeningQuestions1.length) {
    window.currentIndex = index;
    window.renderQuestion1_13(window.listeningQuestions1[index]);
  }
  // Update Next button text if last question
  if (index === window.listeningQuestions1.length - 1) {
    const nextBtn = document.getElementById('nextButton');
    if (nextBtn) nextBtn.textContent = 'The end';
  } else {
    const nextBtn = document.getElementById('nextButton');
    if (nextBtn) nextBtn.textContent = 'Next';
  }
}

const nextBtn = document.getElementById('nextButton');
if (nextBtn) {
  nextBtn.addEventListener('click', function() {
    // Pause all audio
    document.querySelectorAll('audio').forEach(audio => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    // Reset play icons
    document.querySelectorAll('i[id^="playIcon"]').forEach(icon => {
      icon.classList.remove('bi-pause-fill');
      icon.classList.add('bi-play-fill');
    });
    if (window.currentIndex < window.listeningQuestions1.length - 1) {
      renderQuestionByIndex(window.currentIndex + 1);
    } else if (this.textContent === 'The end') {
      window.location.href = 'listening_question.html';
    }
  });
}

const backBtn = document.getElementById('backButton');
if (backBtn) {
  backBtn.addEventListener('click', function() {
    // Pause all audio
    document.querySelectorAll('audio').forEach(audio => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    // Reset play icons
    document.querySelectorAll('i[id^="playIcon"]').forEach(icon => {
      icon.classList.remove('bi-pause-fill');
      icon.classList.add('bi-play-fill');
    });
    if (window.currentIndex > 0) {
      renderQuestionByIndex(window.currentIndex - 1);
    }
  });
}

// ===============================================================================================================
// ////////////// ĐẾM NGƯỢC THỜI GIAN --- COUNT DOWN ///////////////
// ===============================================================================================================
if (!window.countdownInitialized) {
  window.countdownInitialized = true;
  window.timeLeft = 40 * 60; // 40 minutes in seconds
  const countdownElement = document.getElementById('countdownTimer');

  // Clear any existing timer first
  if (window.countdownTimerId) {
    clearTimeout(window.countdownTimerId);
  }

  window.updateCountdown = function() {
    if (!countdownElement) return;
    const minutes = Math.floor(window.timeLeft / 60);
    const seconds = window.timeLeft % 60;
    countdownElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    if (window.timeLeft > 0) {
      window.timeLeft--;
      window.countdownTimerId = setTimeout(window.updateCountdown, 1000);
    }
  }

  window.updateCountdown();
}
})();

/* MINI_HIPPO_LESSON_DATA_START
{
  "version": 1,
  "lessonType": "listening",
  "part": "listening_1_13",
  "sets": [
    {
      "title": "UPDATE P1",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 17",
          "audioUrl": "audio/question1_13/audio_q1.mp3",
          "question": "What is the teleshop number?",
          "options": [
            "201030",
            "201032",
            "301030"
          ],
          "correctAnswer": "201030",
          "transcript": ""
        },
        {
          "heading": "Question 2 of 17",
          "audioUrl": "audio/question1_13/audio_q2.mp3",
          "question": "What color top is he going to buy?",
          "options": [
            "Black",
            "White",
            "Pink"
          ],
          "correctAnswer": "Black",
          "transcript": ""
        },
        {
          "heading": "Question 3 of 17",
          "audioUrl": "audio/question1_13/audio_q3.mp3",
          "question": "What is she going to change in their house?",
          "options": [
            "The window",
            "Living room",
            "Kitchen"
          ],
          "correctAnswer": "The window",
          "transcript": ""
        },
        {
          "heading": "Question 4 of 17",
          "audioUrl": "audio/question1_13/audio_q4.mp3",
          "question": "How many clients are Americans?",
          "options": [
            "Two",
            "One",
            "Four"
          ],
          "correctAnswer": "One",
          "transcript": ""
        },
        {
          "heading": "Question 5 of 17",
          "audioUrl": "audio/question1_13/audio_q5.mp3",
          "question": "Where are they standing?",
          "options": [
            "Residential area",
            "At the park",
            "In front of their house"
          ],
          "correctAnswer": "Residential area",
          "transcript": ""
        },
        {
          "heading": "Question 6 of 17",
          "audioUrl": "audio/question1_13/audio_q6.mp3",
          "question": "How long does it take to get to the station?",
          "options": [
            "45 minutes",
            "55 minutes",
            "40 minutes"
          ],
          "correctAnswer": "40 minutes",
          "transcript": ""
        },
        {
          "heading": "Question 7 of 17",
          "audioUrl": "audio/question1_13/audio_q7.mp3",
          "question": "How much does the flight in the morning cost?",
          "options": [
            "550 pounds",
            "350 pounds",
            "300 pounds"
          ],
          "correctAnswer": "350 pounds",
          "transcript": ""
        },
        {
          "heading": "Question 8 of 17",
          "audioUrl": "audio/question1_13/audio_q8.mp3",
          "question": "How much did she sell it for?",
          "options": [
            "60 dollars",
            "55 dollars",
            "50 dollars"
          ],
          "correctAnswer": "50 dollars",
          "transcript": ""
        },
        {
          "heading": "Question 9 of 17",
          "audioUrl": "audio/question1_13/audio_q9.mp3",
          "question": "What is the main reason he gets late?",
          "options": [
            "There was heavy traffic",
            "Missed the train",
            "He woke up too late"
          ],
          "correctAnswer": "Missed the train",
          "transcript": ""
        },
        {
          "heading": "Question 10 of 17",
          "audioUrl": "audio/question1_13/audio_q10.mp3",
          "question": "When is the work due?",
          "options": [
            "On Saturday morning",
            "On Saturday evening",
            "On Sunday morning"
          ],
          "correctAnswer": "On Saturday morning",
          "transcript": ""
        },
        {
          "heading": "Question 11 of 17",
          "audioUrl": "audio/question1_13/audio_q11.mp3",
          "question": "What is the man going to do after work?",
          "options": [
            "Goes running",
            "Listen to music",
            "Meet his friends for dinner"
          ],
          "correctAnswer": "Goes running",
          "transcript": ""
        },
        {
          "heading": "Question 12 of 17",
          "audioUrl": "audio/question1_13/audio_q12.mp3",
          "question": "What is the woman's favorite form of entertainment?",
          "options": [
            "Going to the theatre",
            "Swimming",
            "Listening to music"
          ],
          "correctAnswer": "Going to the theatre",
          "transcript": ""
        },
        {
          "heading": "Question 13 of 17",
          "audioUrl": "audio/question1_13/audio_q13.mp3",
          "question": "What was the woman good at?",
          "options": [
            "Plays Football",
            "Drawing pictures",
            "Solving math problems"
          ],
          "correctAnswer": "Plays Football",
          "transcript": ""
        },
        {
          "heading": "Question 14",
          "audioUrl": "audio/question1_13/audio_q14.mp3",
          "question": "Which platform to wait for the train?",
          "options": [
            "Platform 3",
            "Platform 2",
            "Platform 4"
          ],
          "correctAnswer": "Platform 2",
          "transcript": ""
        },
        {
          "heading": "Question 15",
          "audioUrl": "audio/question1_13/audio_q15.mp3",
          "question": "What will the father do?",
          "options": [
            "Hire a new tutor for his son",
            "Arrange private classes for his son",
            "Send his son to an evening course"
          ],
          "correctAnswer": "Arrange private classes for his son",
          "transcript": ""
        },
        {
          "heading": "Question 16",
          "audioUrl": "audio/question1_13/audio_q16.mp3",
          "question": "What does the man want to do next?",
          "options": [
            "Become a Writer",
            "Become a Artist",
            "Become a Teacher"
          ],
          "correctAnswer": "Become a Writer",
          "transcript": ""
        },
        {
          "heading": "Question 17",
          "audioUrl": "audio/question1_13/audio_q17.mp3",
          "question": "What time will they meet?",
          "options": [
            "5 PM",
            "6 PM",
            "7 PM"
          ],
          "correctAnswer": "7 PM",
          "transcript": ""
        },
        {
          "heading": "Question 18",
          "audioUrl": "audio/question1_13/audio_q18.mp3",
          "question": "What shouldn’t they do?",
          "options": [
            "Ask for more time",
            "Ask for more money",
            "Ask for more information"
          ],
          "correctAnswer": "Ask for more money",
          "transcript": ""
        },
        {
          "heading": "Question 19",
          "audioUrl": "audio/question1_13/audio_q19.mp3",
          "question": "What will it end with?",
          "options": [
            "A short speech",
            "A music show",
            "A surprise performance"
          ],
          "correctAnswer": "A surprise performance",
          "transcript": ""
        },
        {
          "heading": "Question 20",
          "audioUrl": "audio/question1_13/audio_q20.mp3",
          "question": "What is her sister like?",
          "options": [
            "They have similar characters",
            "She is very friendly",
            "She is quite shy"
          ],
          "correctAnswer": "They have similar characters",
          "transcript": ""
        },
        {
          "heading": "Question 21",
          "audioUrl": "audio/question1_13/audio_q21.mp3",
          "question": "Which part of the cabinet is original?",
          "options": [
            "The handle",
            "The wooden door",
            "The drawer"
          ],
          "correctAnswer": "The drawer",
          "transcript": ""
        },
        {
          "heading": "Question 22",
          "audioUrl": "audio/question1_13/audio_q22.mp3",
          "question": "How is he going to travel to the city?",
          "options": [
            "By motorbike",
            "By train",
            "By bus"
          ],
          "correctAnswer": "By train",
          "transcript": ""
        },
        {
          "heading": "Question 23",
          "audioUrl": "audio/question1_13/audio_q23.mp3",
          "question": "What time is the best for children to eat fruit?",
          "options": [
            "In the morning",
            "In the afternoon",
            "In the evening"
          ],
          "correctAnswer": "In the morning",
          "transcript": ""
        },
        {
          "heading": "Question 24",
          "audioUrl": "audio/question1_13/audio_q24.mp3",
          "question": "What does she have for lunch?",
          "options": [
            "Rice",
            "Milk",
            "Tea"
          ],
          "correctAnswer": "Tea",
          "transcript": ""
        },
        {
          "heading": "Question 25",
          "audioUrl": "audio/question1_13/audio_q25.mp3",
          "question": "How long did he talk in the speech?",
          "options": [
            "15 minutes",
            "10 minutes",
            "20 minutes"
          ],
          "correctAnswer": "15 minutes",
          "transcript": ""
        }
      ]
    }
  ]
}
MINI_HIPPO_LESSON_DATA_END */
