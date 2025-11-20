(function() {
  // Execute immediately if DOM is ready, otherwise wait for DOMContentLoaded
  function init() {

// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI ///////////////
// ===============================================================================================================
const question16Data = [
  {
    audioUrl: "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/audio/question16/audio_1763663538990.mp3",
    topic: "sadasdasd",
    questions: [
      {
        id: "16.1",
        question: "sadasdasd",
        options: [
          "sadasdasd",
          "sadasdasd",
          "sadasdasd"
        ]
      },
      {
        id: "16.2",
        question: "sadasdasd",
        options: [
          "sadasdasd",
          "sadasdasd",
          "sadasdasd"
        ]
      }
    ],
    transcript: "sadasdasd"
  },
  {
    audioUrl: "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/audio/question17/audio_1763663549413.mp3",
    topic: "sadasdasd",
    questions: [
      {
        id: "17.1",
        question: "sadasdasd",
        options: [
          "sadasdasd",
          "sadasdasd",
          "sadasdasd"
        ]
      },
      {
        id: "17.2",
        question: "sadasdasd",
        options: [
          "sadasdasd",
          "sadasdasd",
          "sadasdasd"
        ]
      }
    ],
    transcript: "sadasdasd"
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
  if (currentIndex < question16Data.length-1) {
    currentIndex++;
    renderQuestionByIndex(currentIndex);
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
      "title": "dfgdsfgsdfgdfg",
      "part": "16_17",
      "question16": {
        "topic": "sadasdasd",
        "audioUrl": "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/audio/question16/audio_1763663538990.mp3",
        "questions": [
          {
            "id": "16.1",
            "question": "sadasdasd",
            "options": [
              "sadasdasd",
              "sadasdasd",
              "sadasdasd"
            ]
          },
          {
            "id": "16.2",
            "question": "sadasdasd",
            "options": [
              "sadasdasd",
              "sadasdasd",
              "sadasdasd"
            ]
          }
        ],
        "transcript": "sadasdasd"
      },
      "question17": {
        "topic": "sadasdasd",
        "audioUrl": "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/audio/question17/audio_1763663549413.mp3",
        "questions": [
          {
            "id": "17.1",
            "question": "sadasdasd",
            "options": [
              "sadasdasd",
              "sadasdasd",
              "sadasdasd"
            ]
          },
          {
            "id": "17.2",
            "question": "sadasdasd",
            "options": [
              "sadasdasd",
              "sadasdasd",
              "sadasdasd"
            ]
          }
        ],
        "transcript": "sadasdasd"
      }
    }
  ]
}
MINI_HIPPO_LESSON_DATA_END */
