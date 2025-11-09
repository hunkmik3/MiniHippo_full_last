document.addEventListener('DOMContentLoaded', function() {

// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI ///////////////
// ===============================================================================================================

const listeningQuestions1 = [
  {
    heading: "sdasdasdsad",
    audioUrl: "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/audio/question1_13/audio_q1.mp3",
    question: "ádasdasda",
    options: ["sdasdasd", "ádasda", "dấdad"],
    correctAnswer: "dấdad",
    transcript: "ádadasdasdadadasdasdas"
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

function toggleTranscript() {
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

let currentIndex = 0;
let userAnswers = [];

function storeUserAnswer(questionIndex, answer) {
  userAnswers[questionIndex] = answer;
}

document.querySelectorAll('input[name="answer"]').forEach((input, index) => {
  input.addEventListener('change', function() {
    storeUserAnswer(currentIndex, this.value);
  });
});

window.onload = function() {
  renderQuestion1_13(listeningQuestions1[0]);
};
});
