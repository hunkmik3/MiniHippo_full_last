(function() {

// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI ///////////////
// ===============================================================================================================

window.listeningQuestions1 = [
  {
    heading: "asdasdasda",
    audioUrl: "audio/question1_13/audio_q1.mp3",
    question: "asdsadasd",
    options: ["sadasda", "dadasd", "adadsasd"],
    correctAnswer: "asdasdasd",
    transcript: "asdasdasd"
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
  const comparisonBody1 = document.getElementById('comparisonBody_question1');
  const totalScoreDisplay = document.getElementById('totalScore_question1_13');
  if (!comparisonBody1 || !totalScoreDisplay) return;
  comparisonBody1.innerHTML = '';

  let score = 0;

  window.listeningQuestions1.forEach((question, index) => {
    const userAnswer = window.userAnswers[index];
    const isCorrect = userAnswer === question.correctAnswer;
    const textColor = isCorrect ? 'text-success' : 'text-danger';

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

  window.question1_13Score = score;
  totalScoreDisplay.innerText = `Score: ${score} / ${window.listeningQuestions1.length * 2}`;
  const resultContainer = document.getElementById('comparisonResult_question1');
  if (resultContainer) resultContainer.style.display = "block";
}

window.question1_13Score = 0;
window.calculateTotalScore = function() {
  var totalScore = window.question1_13Score;
  const totalScoreEl = document.getElementById('totalScore');
  if (totalScoreEl) totalScoreEl.innerText = `Total Score: ${totalScore} / ${window.listeningQuestions1.length * 2}`;
  window.classifyScore(totalScore);
}

window.classifyScore = function(score) {
  let grade = '';
  if (score >= 40) {
    grade = 'C1';
  } else if (score >= 32) {
    grade = 'B2';
  } else if (score >= 24) {
    grade = 'B1';
  } else if (score >= 16) {
    grade = 'A2';
  } else {
    grade = 'A1';
  }
  const scoreEl = document.getElementById('scoreClassification');
  if (scoreEl) scoreEl.innerText = `Your grade: ${grade}`;
}

const checkResultBtn = document.getElementById('checkResultButton');
if (checkResultBtn) {
  checkResultBtn.addEventListener('click', function() {
    console.log('Check result button clicked');
    try {
      window.showResults_question1_13();
      window.calculateTotalScore();
      const questionContainer = document.getElementById("question1_13");
      if (questionContainer) questionContainer.style.display = "none";
      const resultContainer = document.getElementById('comparisonResult_question1');
      if (resultContainer) resultContainer.style.display = "block";
      const backBtn = document.getElementById('backButton');
      if (backBtn) backBtn.style.display = "none";
      checkResultBtn.style.display = "none";
      const nextBtn = document.getElementById('nextButton');
      if (nextBtn) nextBtn.style.display = "none";
      const resultModal = document.getElementById('resultModal');
      if (resultModal && typeof bootstrap !== 'undefined') {
        const modal = new bootstrap.Modal(resultModal);
        modal.show();
      }
    } catch (error) {
      console.error('Error in check result button handler:', error);
    }
  });
}

// ===============================================================================================================
// ////////////// ĐẾM NGƯỢC THỜI GIAN --- COUNT DOWN ///////////////
// ===============================================================================================================
window.timeLeft = 40 * 60; // 40 minutes in seconds
const countdownElement = document.getElementById('countdownTimer');

window.updateCountdown = function() {
  if (!countdownElement) return;
  const minutes = Math.floor(window.timeLeft / 60);
  const seconds = window.timeLeft % 60;
  countdownElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  if (window.timeLeft > 0) {
    window.timeLeft--;
    setTimeout(window.updateCountdown, 1000);
  }
}

window.updateCountdown();
})();
