(function() {
  // Execute immediately if DOM is ready, otherwise wait for DOMContentLoaded
  function init() {

// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI ///////////////
// ===============================================================================================================

const question14Data_1 = {
  audioUrl: "audio/question14/audio_1764765774731.mp3",
  topic: "Part 2 ONLINE SHOPPING",
  options: [
    "The products are delivered",
    "It is cheaper",
    "It saves time",
    "There are more choices",
    "It is",
    "There are"
  ],
  transcript: `A. The products are delivered \n\"I used to be a person who didn’t like shopping online, but ever since I experienced  home delivery, I no longer shop in stores. When I shop online, the delivery person  brings the package right to my door, even up to my floor, and knocks on my  apartment door,so I don’t even need to step outside. I really enjoy this convenience.\" \nB. It is cheaper \n\"Shopping online has helped me save quite a bit of money. After a few months of  online shopping, I was able to save enough to buy a new bicycle. But don\'t get me  wrong, I haven\'t been eating any less or cutting back on the groceries I buy. It\'s just  that online shopping allows me to compare prices and choose the store with the best  deal.\" \nC. It saves time \n\"I’m a pretty busy person, and I often don’t have enough time because of my hectic  work schedule. That’s why I always shop online to save time. This way, I don’t need  to go to the store in person, and someone will deliver the items directly to me.  Additionally, online shopping is very convenient because, with just a few clicks, I  can buy everything I want without having to go from one store to another.\" \nD. There are more choices \n\"I don\'t shop online because it\'s cheaper or because of the fast shipping. I shop  online because, when browsing online stores, I have a wide range of choices. For  the same item, there are many different types and brands for me to choose from and  compare, which allows me to pick the one I like the most.\"`
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
  if (currentIndex < question14Data.length - 1) {
    currentIndex++;
    renderQuestionByIndex(currentIndex);
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
      "title": "Part 2 ONLINE SHOPPING",
      "topic": "Part 2 ONLINE SHOPPING",
      "audioUrl": "audio/question14/audio_1764765774731.mp3",
      "options": [
        "The products are delivered",
        "It is cheaper",
        "It saves time",
        "There are more choices",
        "It is",
        "There are"
      ],
      "transcript": "A. The products are delivered \n\"I used to be a person who didn’t like shopping online, but ever since I experienced  home delivery, I no longer shop in stores. When I shop online, the delivery person  brings the package right to my door, even up to my floor, and knocks on my  apartment door,so I don’t even need to step outside. I really enjoy this convenience.\" \nB. It is cheaper \n\"Shopping online has helped me save quite a bit of money. After a few months of  online shopping, I was able to save enough to buy a new bicycle. But don't get me  wrong, I haven't been eating any less or cutting back on the groceries I buy. It's just  that online shopping allows me to compare prices and choose the store with the best  deal.\" \nC. It saves time \n\"I’m a pretty busy person, and I often don’t have enough time because of my hectic  work schedule. That’s why I always shop online to save time. This way, I don’t need  to go to the store in person, and someone will deliver the items directly to me.  Additionally, online shopping is very convenient because, with just a few clicks, I  can buy everything I want without having to go from one store to another.\" \nD. There are more choices \n\"I don't shop online because it's cheaper or because of the fast shipping. I shop  online because, when browsing online stores, I have a wide range of choices. For  the same item, there are many different types and brands for me to choose from and  compare, which allows me to pick the one I like the most.\""
    }
  ]
}
MINI_HIPPO_LESSON_DATA_END */
