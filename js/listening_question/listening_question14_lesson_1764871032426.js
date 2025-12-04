(function() {
  // Execute immediately if DOM is ready, otherwise wait for DOMContentLoaded
  function init() {

// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI ///////////////
// ===============================================================================================================

const question14Data_1 = {
  audioUrl: "audio/question14/audio_1764871028213.mp3",
  topic: "ádasda",
  options: [
    "sadasd",
    "ádas",
    "đâsdasd"
  ],
  transcript: ``
};

const question14Data = [
  question14Data_1
];

// Expose to window scope for external access
window.question14Data = question14Data;

// ===============================================================================================================
// ////////////// CÂU HỎI 2 (14 of 17) ///////////////
// ===============================================================================================================
let correctAnswer14 = [];
let shuffledOptions14 = [];
function renderQuestion14(data) {
  document.getElementById("audioPlayer2").src = data.audioUrl;
  document.getElementById("question14_topic").innerText = data.topic;
  const questionText_id = `Question ${currentIndex + 1} of ${question14Data.length}`;
  document.getElementById('question2_id').textContent = questionText_id;
  correctAnswer14 = data.options.slice(0, 4);
  shuffledOptions14 = [...data.options].sort(() => Math.random() - 0.5);
  const selectIds = ["person1", "person2", "person3", "person4"];
  selectIds.forEach((id, index) => {
    const select = document.getElementById(id);
    select.innerHTML = '<option value="">-- Select an answer --</option>';
    shuffledOptions14.forEach((opt, idx) => {
      const val = String.fromCharCode(65 + idx);
      const optionEl = document.createElement("option");
      optionEl.value = val;
      optionEl.innerText = opt;
      select.appendChild(optionEl);
    });
    const prevAnswer = userAnswers_question14[index];
    if (prevAnswer) {
      const selectedIndex = shuffledOptions14.indexOf(prevAnswer);
      select.selectedIndex = selectedIndex + 1;
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
// Expose renderQuestion14 to window
window.renderQuestion14 = renderQuestion14;

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

document.querySelectorAll('select[id^="person"]').forEach((select, index) => {
  select.addEventListener('change', function() {
    storeUserAnswerQuestion14(index, this.value);
  });
});

let userAnswers_question14 = [];

function storeUserAnswerQuestion14(index, answerLetter) {
  const optionIndex = answerLetter.charCodeAt(0) - 65;
  const selectedAnswer = shuffledOptions14[optionIndex];
  userAnswers_question14[index] = selectedAnswer;
}

function showResults_question14() {
  const comparisonBody14 = document.getElementById('comparisonTableBody');
  const totalScoreEl = document.getElementById('totalScore');
  const scoreClassificationEl = document.getElementById('scoreClassification');
  comparisonBody14.innerHTML = '';
  let score = 0;
  let html14 = '';
  correctAnswer14.forEach((correctOption, index) => {
    const userAnswer = userAnswers_question14[index] || 'Not answered';
    const isCorrect = userAnswer === correctOption;
    const userAnswerColor = isCorrect ? 'text-success' : 'text-danger';
    if (isCorrect) score += 2;
    html14 += '<tr><td class="' + userAnswerColor + '">' + userAnswer + '</td><td class="text-success">' + correctOption + '</td></tr>';
  });
  comparisonBody14.innerHTML = html14;
  totalScoreEl.innerText = 'Score: ' + score + ' / 8';
  let classification = '';
  if (score >= 8) classification = 'Excellent';
  else if (score >= 6) classification = 'Good';
  else if (score >= 4) classification = 'Satisfactory';
  else classification = 'Needs Improvement';
  scoreClassificationEl.innerText = 'Classification: ' + classification;
  const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
  resultModal.show();
}

document.getElementById('checkResultButton').addEventListener('click', showResults_question14);

let currentIndex = 0;
let userAnswers = [];

function renderQuestionByIndex(currentIndex) {
  if (currentIndex <= question14Data.length - 1) {
    renderQuestion14(question14Data[currentIndex]);
  }
  if (currentIndex === question14Data.length - 1) {
    document.getElementById('nextButton').textContent = "The end";
  }
}

document.getElementById('nextButton').addEventListener('click', function (e) {
  userAnswers_question14 = [];
  document.querySelectorAll('audio').forEach(audio => {
    if (!audio.paused) { audio.pause(); audio.currentTime = 0; }
  });
  document.querySelectorAll('i[id^="playIcon"]').forEach(icon => {
    icon.classList.remove("bi-pause-fill");
    icon.classList.add("bi-play-fill");
  });
  const nextBtn = document.getElementById('nextButton');
  if (currentIndex < question14Data.length - 1) {
    currentIndex++;
    renderQuestionByIndex(currentIndex);
  } else if (nextBtn && nextBtn.textContent === 'The end') {
    // Khi đã xong toàn bộ bộ đề upload (Listening Question 14) -> quay về trang chọn bài Listening
    window.location.href = 'listening_question.html';
  }
});

document.getElementById('backButton').addEventListener('click', function () {
  userAnswers_question14 = [];
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
    renderQuestion14(question14Data[0]);
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
  "part": "listening_14",
  "sets": [
    {
      "id": 1,
      "title": "sdasdasdsad",
      "topic": "ádasda",
      "audioUrl": "audio/question14/audio_1764871028213.mp3",
      "options": [
        "sadasd",
        "ádas",
        "đâsdasd"
      ],
      "transcript": ""
    }
  ]
}
MINI_HIPPO_LESSON_DATA_END */
