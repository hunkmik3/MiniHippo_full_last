(function() {
  // Execute immediately if DOM is ready, otherwise wait for DOMContentLoaded
  function init() {

// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI ///////////////
// ===============================================================================================================
const question16Data = [
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "A new novel of a famous writer",
    questions: [
      {
        id: "16.1",
        question: "What does the announcer say?",
        options: [
          "It is different from his earlier works",
          "It became the writer’s most successful novel.",
          "t received mixed reviews from readers."
        ]
      },
      {
        id: "16.2",
        question: "What should the writer do in the future?",
        options: [
          "He should listen to critics before writing his next work",
          "He should focus on writing shorter novels",
          "He should change his writing style completely"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "Professionalism at work",
    questions: [
      {
        id: "17.1",
        question: "What is the main point about professionalism?",
        options: [
          "To maintain a positive attitude",
          "To follow strict workplace rules at all times",
          "To improve technical skills continuously"
        ]
      },
      {
        id: "17.2",
        question: "What does the expert say about the definition of professionalism?",
        options: [
          "Our definition of it is changing",
          "It has remained the same for decades",
          "Different companies should create their own definitions"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "Writer’s block",
    questions: [
      {
        id: "16.1",
        question: "What is the critic’s main complaint?",
        options: [
          "The characters lacked depth/ Create dedicated periods",
          "The storyline was too predictable",
          "The ending was confusing and incomplete"
        ]
      },
      {
        id: "16.2",
        question: "What does the writer regret doing during her experience with writer’s block?",
        options: [
          "Spend too much time editing previous chapters",
          "Refuse to seek advice from others",
          "Take a long break from writing completely"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "A musician’s life",
    questions: [
      {
        id: "17.1",
        question: "What has the musician decided regarding his singing career?",
        options: [
          "He will retire from singing professionally/He will probably retire from singing",
          "He plans to release one final album before taking a break",
          "He wants to focus more on international performances"
        ]
      },
      {
        id: "17.2",
        question: "What could the musician have achieved with his recent albums?",
        options: [
          "He could have been more successful",
          "He could have attracted younger audiences",
          "He could have won more music awards"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "TV series",
    questions: [
      {
        id: "16.1",
        question: "What happened to the TV series?",
        options: [
          "It caught the audience\'s attention from the start",
          "It became popular only after the second season",
          "It received criticism despite high viewing figures"
        ]
      },
      {
        id: "16.2",
        question: "According to the expert, what is the series’ potential?",
        options: [
          "Series are damaged by overexposure",
          "The series could continue successfully for many more seasons",
          "The series has the potential to attract a global audience"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "Advertising and sponsoring",
    questions: [
      {
        id: "17.1",
        question: "What does the expert say about the negative side of advertising?",
        options: [
          "Series are damaged by overexposure",
          "Advertising often increases production costs unnecessarily",
          "Too many advertisements can reduce customer trust"
        ]
      },
      {
        id: "17.2",
        question: "In what way can advertising affect sports?",
        options: [
          "They can generate negative publicity for the sport",
          "They can encourage more people to take up sports",
          "They can increase ticket prices for major events"
        ]
      }
    ],
    transcript: ""
  }
];

// Expose to window scope for external access
window.question16Data = question16Data;

// ===============================================================================================================
// ////////////// CÂU HỎI 16 ///////////////
// ===============================================================================================================
let userAnswers_question16 = {};
let correctAnswers_question16 = {};
let shuffledOptionsMap_question16 = {};

function renderQuestion16(data) {
  document.getElementById("audioPlayer16").src = data.audioUrl;
  document.getElementById("question16_topic").innerText = 'Topic: ' + data.topic;
  document.getElementById("transcriptContent16").innerText = data.transcript;
  const questionText_id = `Question ${currentIndex + 1} of ${question16Data.length}`;
  document.getElementById('question16_id').textContent = questionText_id;
  data.questions.forEach((q, index) => {
    const qIndex = index + 1;
    const labelEl = document.getElementById('q16_opinion' + qIndex + '_label');
    labelEl.innerText = q.id + ' ' + q.question;
    correctAnswers_question16[q.id] = q.options[0];
    const shuffled = [...q.options].sort(() => Math.random() - 0.5);
    shuffledOptionsMap_question16[q.id] = shuffled;
    shuffled.forEach((text, optIndex) => {
      const letter = String.fromCharCode(65 + optIndex);
      const radio = document.getElementById('opinion' + qIndex + '_' + letter);
      const label = document.querySelector('label[for=opinion' + qIndex + '_' + letter + ']');
      if (radio && label) {
        label.innerText = text;
        radio.checked = false;
        radio.onchange = () => { userAnswers_question16[q.id] = letter; };
      }
    });
  });
  const audio = document.getElementById("audioPlayer16");
  const playBtn = document.getElementById("playButton16");
  const playIcon = document.getElementById("playIcon16");
  setupPlayButton(audio, playBtn, playIcon);
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
// Expose renderQuestion16 to window
window.renderQuestion16 = renderQuestion16;

function showResults_question16() {
  const tbody = document.getElementById("comparisonTableBody");
  const totalScoreEl = document.getElementById("totalScore");
  const scoreClassificationEl = document.getElementById("scoreClassification");
  tbody.innerHTML = "";
  let score = 0;
  if (currentIndex < 0 || currentIndex >= question16Data.length) return;
  const currentData = question16Data[currentIndex];
  currentData.questions.forEach(q => {
    const qid = q.id;
    const correctText = correctAnswers_question16[qid];
    const shuffled = shuffledOptionsMap_question16[qid];
    const userLetter = userAnswers_question16[qid];
    const userText = userLetter ? shuffled[userLetter.charCodeAt(0) - 65] : "Not answered";
    const isCorrect = userText === correctText;
    if (isCorrect) score += 2;
    const row = document.createElement("tr");
    const userClass = isCorrect ? "text-success fw-bold" : "text-danger fw-bold";
    row.innerHTML = '<td class="' + userClass + '">' + userText + '</td><td class="text-success fw-bold">' + correctText + '</td>';
    tbody.appendChild(row);
  });
  totalScoreEl.innerText = 'Score: ' + score + ' / 4';
  if (score === 4) scoreClassificationEl.innerText = "Excellent";
  else if (score >= 2) scoreClassificationEl.innerText = "Good";
  else scoreClassificationEl.innerText = "Needs Improvement";
  const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
  resultModal.show();
}

const checkResultButton = document.getElementById('checkResultButton');
checkResultButton.addEventListener('click', showResults_question16);

let currentIndex = 0;

function renderQuestionByIndex(currentIndex) {
  if (currentIndex <= question16Data.length - 1) {
    renderQuestion16(question16Data[currentIndex]);
  }
  if (currentIndex === question16Data.length - 1) {
    document.getElementById('nextButton').textContent = "The end";
  }
}

document.getElementById('nextButton').addEventListener('click', function (e) {
  document.querySelectorAll('audio').forEach(audio => {
    if (!audio.paused) { audio.pause(); audio.currentTime = 0; }
  });
  document.querySelectorAll('i[id^="playIcon"]').forEach(icon => {
    icon.classList.remove("bi-pause-fill");
    icon.classList.add("bi-play-fill");
  });
  const nextBtn = document.getElementById('nextButton');
  if (currentIndex < question16Data.length-1) {
    currentIndex++;
    renderQuestionByIndex(currentIndex);
  } else if (nextBtn && nextBtn.textContent === 'The end') {
    // Khi đã xong toàn bộ bộ đề upload (Listening Question 16 & 17) -> quay về trang chọn bài Listening
    window.location.href = 'listening_question.html';
  }
});

document.getElementById('backButton').addEventListener('click', function () {
  document.querySelectorAll('audio').forEach(audio => {
    if (!audio.paused) { audio.pause(); audio.currentTime = 0; }
  });
  document.querySelectorAll('i[id^="playIcon"]').forEach(icon => {
    icon.classList.remove("bi-pause-fill");
    icon.classList.add("bi-play-fill");
  });
  document.getElementById('nextButton').textContent = "Next";
  if (currentIndex > 0) currentIndex--;
  renderQuestionByIndex(currentIndex);
});

window.onload = function() {
    renderQuestionByIndex(0);
};

let timeLeft = 40 * 60;
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

  } // End of init function

  // Execute immediately if DOM is ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* MINI_HIPPO_LESSON_DATA_START
{
  "version": 1,
  "lessonType": "listening",
  "part": "listening_16_17",
  "sets": [
    {
      "id": 13,
      "title": "UPDATE P4",
      "question16": {
        "topic": "A new novel of a famous writer",
        "audioUrl": "audio/question16/no_audio.mp3",
        "questions": [
          {
            "id": "16.1",
            "question": "What does the announcer say?",
            "options": [
              "It is different from his earlier works",
              "It became the writer’s most successful novel.",
              "t received mixed reviews from readers."
            ],
            "correctAnswer": "It is different from his earlier works"
          },
          {
            "id": "16.2",
            "question": "What should the writer do in the future?",
            "options": [
              "He should listen to critics before writing his next work",
              "He should focus on writing shorter novels",
              "He should change his writing style completely"
            ],
            "correctAnswer": "He should listen to critics before writing his next work"
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "Professionalism at work",
        "audioUrl": "audio/question17/no_audio.mp3",
        "questions": [
          {
            "id": "17.1",
            "question": "What is the main point about professionalism?",
            "options": [
              "To maintain a positive attitude",
              "To follow strict workplace rules at all times",
              "To improve technical skills continuously"
            ],
            "correctAnswer": "To maintain a positive attitude"
          },
          {
            "id": "17.2",
            "question": "What does the expert say about the definition of professionalism?",
            "options": [
              "Our definition of it is changing",
              "It has remained the same for decades",
              "Different companies should create their own definitions"
            ],
            "correctAnswer": "Our definition of it is changing"
          }
        ],
        "transcript": ""
      }
    },
    {
      "id": 14,
      "title": "UPDATE P4",
      "question16": {
        "topic": "Writer’s block",
        "audioUrl": "audio/question16/no_audio.mp3",
        "questions": [
          {
            "id": "16.1",
            "question": "What is the critic’s main complaint?",
            "options": [
              "The characters lacked depth/ Create dedicated periods",
              "The storyline was too predictable",
              "The ending was confusing and incomplete"
            ],
            "correctAnswer": "The characters lacked depth/ Create dedicated periods"
          },
          {
            "id": "16.2",
            "question": "What does the writer regret doing during her experience with writer’s block?",
            "options": [
              "Spend too much time editing previous chapters",
              "Refuse to seek advice from others",
              "Take a long break from writing completely"
            ],
            "correctAnswer": "Refuse to seek advice from others"
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "A musician’s life",
        "audioUrl": "audio/question17/no_audio.mp3",
        "questions": [
          {
            "id": "17.1",
            "question": "What has the musician decided regarding his singing career?",
            "options": [
              "He will retire from singing professionally/He will probably retire from singing",
              "He plans to release one final album before taking a break",
              "He wants to focus more on international performances"
            ],
            "correctAnswer": "He will retire from singing professionally/He will probably retire from singing"
          },
          {
            "id": "17.2",
            "question": "What could the musician have achieved with his recent albums?",
            "options": [
              "He could have been more successful",
              "He could have attracted younger audiences",
              "He could have won more music awards"
            ],
            "correctAnswer": "He could have been more successful"
          }
        ],
        "transcript": ""
      }
    },
    {
      "id": 3,
      "title": "UPDATE P4",
      "question16": {
        "topic": "TV series",
        "audioUrl": "audio/question16/no_audio.mp3",
        "questions": [
          {
            "id": "16.1",
            "question": "What happened to the TV series?",
            "options": [
              "It caught the audience's attention from the start",
              "It became popular only after the second season",
              "It received criticism despite high viewing figures"
            ],
            "correctAnswer": "It caught the audience's attention from the start"
          },
          {
            "id": "16.2",
            "question": "According to the expert, what is the series’ potential?",
            "options": [
              "Series are damaged by overexposure",
              "The series could continue successfully for many more seasons",
              "The series has the potential to attract a global audience"
            ],
            "correctAnswer": "Series are damaged by overexposure"
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "Advertising and sponsoring",
        "audioUrl": "audio/question17/no_audio.mp3",
        "questions": [
          {
            "id": "17.1",
            "question": "What does the expert say about the negative side of advertising?",
            "options": [
              "Series are damaged by overexposure",
              "Advertising often increases production costs unnecessarily",
              "Too many advertisements can reduce customer trust"
            ],
            "correctAnswer": "Series are damaged by overexposure"
          },
          {
            "id": "17.2",
            "question": "In what way can advertising affect sports?",
            "options": [
              "They can generate negative publicity for the sport",
              "They can encourage more people to take up sports",
              "They can increase ticket prices for major events"
            ],
            "correctAnswer": "They can generate negative publicity for the sport"
          }
        ],
        "transcript": ""
      }
    }
  ]
}
MINI_HIPPO_LESSON_DATA_END */
