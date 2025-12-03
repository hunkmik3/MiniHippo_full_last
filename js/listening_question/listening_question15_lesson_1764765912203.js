(function() {
  // Execute immediately if DOM is ready, otherwise wait for DOMContentLoaded
  function init() {

// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI ///////////////
// ===============================================================================================================

const question15Data_1 = {
  audioUrl: "audio/question15/audio_1764765910265.mp3",
  topic: "Topic: University and technology",
  transcript: `University competition should be encouraged`,
  questions: [
    "Technology helps make education more accessible",
    "Social interaction is important",
    "The diverse curriculum is not an advantage",
    "University competition should be encouraged"
  ],
  correctAnswer: ["Both", "Woman", "Man", "Woman"]
};

const question15Data = [
  question15Data_1
];

// Expose to window scope for external access
window.question15Data = question15Data;

// ===============================================================================================================
// ////////////// CÂU HỎI 15 ///////////////
// ===============================================================================================================
let userAnswers_question15 = [];

function storeUserAnswerQuestion15(index, answer) {
  const options = ["Man", "Woman", "Both"];
  const selectedAnswer = options[answer.charCodeAt(0) - 65];
  userAnswers_question15[index] = selectedAnswer;
}

function renderQuestion15(data) {
  document.getElementById("audioPlayer3").src = data.audioUrl;
  document.getElementById("question15_id").innerText = data.topic;
  const questionText_id = `Question ${currentIndex + 1} of ${question15Data.length}`;
  document.getElementById('question2_id').textContent = questionText_id;
  data.questions.forEach((question, index) => {
    const label = document.getElementById("opinion" + (index + 1) + "_label");
    const select = document.getElementById("opinion" + (index + 1));
    if (label) label.innerText = question;
    if (select) {
      select.innerHTML = '<option value="">-- Select an answer --</option>';
      const options = ["Man", "Woman", "Both"];
      options.forEach((opt, i) => {
        const val = String.fromCharCode(65 + i);
        const optionEl = document.createElement("option");
        optionEl.value = val;
        optionEl.innerText = opt;
        select.appendChild(optionEl);
      });
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
// Expose renderQuestion15 to window
window.renderQuestion15 = renderQuestion15;

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

document.querySelectorAll('select[id^="opinion"]').forEach((select, index) => {
  select.addEventListener('change', function() {
    storeUserAnswerQuestion15(index, this.value);
  });
});

function showResults_question15() {
  const comparisonBody15 = document.getElementById('comparisonTableBody');
  const totalScoreEl = document.getElementById('totalScore');
  comparisonBody15.innerHTML = '';
  const correctAnswer15 = question15Data[currentIndex].correctAnswer;
  let score = 0;
  let html15 = '';
  correctAnswer15.forEach((correctAns, index) => {
    const userAns = userAnswers_question15[index] || 'Not answered';
    const isCorrect = userAns === correctAns;
    const textColor = isCorrect ? 'text-success' : 'text-danger';
    if (isCorrect) score += 2;
    html15 += '<tr><td class="' + textColor + ' fw-bold">' + userAns + '</td><td class="text-success fw-bold">' + correctAns + '</td></tr>';
  });
  comparisonBody15.innerHTML = html15;
  totalScoreEl.innerText = 'Score: ' + score + ' / 8';
  const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
  resultModal.show();
}

document.getElementById('checkResultButton').addEventListener('click', showResults_question15);

let currentIndex = 0;

function renderQuestionByIndex(currentIndex) {
  if (currentIndex <= question15Data.length - 1) {
    renderQuestion15(question15Data[currentIndex]);
  }
  if (currentIndex === question15Data.length - 1) {
    document.getElementById('nextButton').textContent = "The end";
  }
}

document.getElementById('nextButton').addEventListener('click', function (e) {
  userAnswers_question15 = [];
  document.querySelectorAll('audio').forEach(audio => {
    if (!audio.paused) { audio.pause(); audio.currentTime = 0; }
  });
  document.querySelectorAll('i[id^="playIcon"]').forEach(icon => {
    icon.classList.remove("bi-pause-fill");
    icon.classList.add("bi-play-fill");
  });
  if (currentIndex < question15Data.length - 1) {
    currentIndex++;
    renderQuestionByIndex(currentIndex);
  }
});

document.getElementById('backButton').addEventListener('click', function () {
  userAnswers_question15 = [];
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
  "part": "listening_15",
  "sets": [
    {
      "id": 1,
      "title": "Topic: University and technology",
      "topic": "Topic: University and technology",
      "audioUrl": "audio/question15/audio_1764765910265.mp3",
      "questions": [
        "Technology helps make education more accessible",
        "Social interaction is important",
        "The diverse curriculum is not an advantage",
        "University competition should be encouraged"
      ],
      "correctAnswer": [
        "Both",
        "Woman",
        "Man",
        "Woman"
      ],
      "transcript": "University competition should be encouraged"
    }
  ]
}
MINI_HIPPO_LESSON_DATA_END */
