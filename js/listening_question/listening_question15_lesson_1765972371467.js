(function() {
  // Execute immediately if DOM is ready, otherwise wait for DOMContentLoaded
  function init() {

// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI ///////////////
// ===============================================================================================================

const question15Data_1 = {
  audioUrl: "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question15/Topic-Community-design.mp3",
  topic: "Community design",
  transcript: ``,
  questions: [
    "Building design can influence people\'s behavior",
    "Creating community can take time",
    "Work communities and social communities are the same",
    "Technology has changed how community forms"
  ],
  correctAnswer: ["Both", "Woman", "Man", "Man"]
};

const question15Data_2 = {
  audioUrl: "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question15/Topic_%20Local%20festivals.mp3",
  topic: "Local festivals",
  transcript: ``,
  questions: [
    "Exhibitions should be different and diverse",
    "Traditional customs are gradually losing their significance",
    "Local festivals will disappear soon in the near future",
    "Schools are important to shaping future generations:"
  ],
  correctAnswer: ["Man", "Both", "Woman", "Woman"]
};

const question15Data_3 = {
  audioUrl: "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question15/Topic_%20information%20and%20technology%20(test%2011).mp3",
  topic: "Information and technology",
  transcript: ``,
  questions: [
    "The future generation will fail to cope with new information",
    "The information revolution will be good for the economy",
    "No computer is superior to the human brain",
    "More should be done to protect individual privacy"
  ],
  correctAnswer: ["Man", "Woman", "Woman", "Both"]
};

const question15Data_4 = {
  audioUrl: "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question15/Topic_%20changes%20in%20the%20workplace%20(test%209).mp3",
  topic: "Changes in the workplace",
  transcript: ``,
  questions: [
    "Continuity is important when planning a career",
    "Job security cannot be guaranteed",
    "Job satisfaction is important for motivator",
    "Technological improvement is good for the economy"
  ],
  correctAnswer: ["Man", "Woman", "Both", "Man"]
};

const question15Data_5 = {
  audioUrl: "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question15/Topic_%20politics%20(test%208).mp3",
  topic: "Politics",
  transcript: ``,
  questions: [
    "Young people are becoming more interested in politics",
    "Social media has changed political activism",
    "People are better informed political issues",
    "More women are likely to participate in politics"
  ],
  correctAnswer: ["Both", "Man", "Woman", "Both"]
};

const question15Data_6 = {
  audioUrl: "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question15/Topic_%20urban%20farming%20(test%207).mp3",
  topic: "Urban farming",
  transcript: ``,
  questions: [
    "Living space is more important than farming space",
    "Urban farming sites can be visually appealing",
    "Urban farming can benefit local economics",
    "Urban farming cannot meet food needs"
  ],
  correctAnswer: ["Man", "Both", "Woman", "Both"]
};

const question15Data_7 = {
  audioUrl: "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question15/Topic_%20Arts%20(test%206).mp3",
  topic: "ARTS",
  transcript: ``,
  questions: [
    "Art is only suitable for the privileged few",
    "The government should invest more in arts",
    "Children should be exposed to art early",
    "In the future, art will become more accessible"
  ],
  correctAnswer: ["Man", "Woman", "Both", "Woman"]
};

const question15Data_8 = {
  audioUrl: "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question15/Part%203%20Actors.mp3",
  topic: "Actors",
  transcript: ``,
  questions: [
    "Auditions are the most important of casting",
    "Actors respond best to a strong script",
    "Theatre acting and movie acting require different skills",
    "Actors need to be praised"
  ],
  correctAnswer: ["Woman", "Man", "Both", "Both"]
};

const question15Data_9 = {
  audioUrl: "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question15/Topic_%20The%20subject%20of%20beauty%20(Test%204).mp3",
  topic: "The subject of beauty",
  transcript: ``,
  questions: [
    "People share the very similar ideas about beauty",
    "Views of beauty change over time",
    "Beauty can be found in unlikely places",
    "Traditional ideas of beauty are going to change"
  ],
  correctAnswer: ["Man", "Woman", "Both", "Woman"]
};

const question15Data_10 = {
  audioUrl: "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question15/Topic_%20internet%20(Test%202).mp3",
  topic: "Internet",
  transcript: ``,
  questions: [
    "There is too much information on the internet",
    "Using internet requires skills",
    "The internet is changing the way we think",
    "Internet has made people less patient"
  ],
  correctAnswer: ["Both", "Woman", "Woman", "Both"]
};

const question15Data_11 = {
  audioUrl: "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question15/Part%203%20Music%20and%20singers.mp3",
  topic: "Music and singers",
  transcript: ``,
  questions: [
    "Singers play a good role for young people",
    "Taste in music is a highly personal thing",
    "Music is a universal language",
    "Music can manipulate people\'s feelings"
  ],
  correctAnswer: ["Woman", "Both", "Man", "Both"]
};

const question15Data_12 = {
  audioUrl: "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question15/Part%203%20University%20and%20technology.mp3",
  topic: "University and technology",
  transcript: ``,
  questions: [
    "Technology helps make education more accessible",
    "Social interaction is important",
    "The diverse curriculum is not an advantage",
    "University competition should be encouraged"
  ],
  correctAnswer: ["Both", "Man", "Woman", "Man"]
};

const question15Data = [
  question15Data_1,
  question15Data_2,
  question15Data_3,
  question15Data_4,
  question15Data_5,
  question15Data_6,
  question15Data_7,
  question15Data_8,
  question15Data_9,
  question15Data_10,
  question15Data_11,
  question15Data_12
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
  const nextBtn = document.getElementById('nextButton');
  if (currentIndex < question15Data.length - 1) {
    currentIndex++;
    renderQuestionByIndex(currentIndex);
  } else if (nextBtn && nextBtn.textContent === 'The end') {
    // Khi đã xong toàn bộ bộ đề upload (Listening Question 15) -> quay về trang chọn bài Listening
    window.location.href = 'listening_question.html';
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
      "title": "LISTENING ĐỀ 12 - Question 15",
      "part": "15",
      "topic": "Community design",
      "audioUrl": "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question15/Topic-Community-design.mp3",
      "questions": [
        "Building design can influence people's behavior",
        "Creating community can take time",
        "Work communities and social communities are the same",
        "Technology has changed how community forms"
      ],
      "correctAnswer": [
        "Both",
        "Woman",
        "Man",
        "Man"
      ],
      "transcript": ""
    },
    {
      "title": "LISTENING ĐỀ 11 - Question 15",
      "part": "15",
      "topic": "Local festivals",
      "audioUrl": "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question15/Topic_%20Local%20festivals.mp3",
      "questions": [
        "Exhibitions should be different and diverse",
        "Traditional customs are gradually losing their significance",
        "Local festivals will disappear soon in the near future",
        "Schools are important to shaping future generations:"
      ],
      "correctAnswer": [
        "Man",
        "Both",
        "Woman",
        "Woman"
      ],
      "transcript": ""
    },
    {
      "title": "LISTENING ĐỀ 10 - Question 15",
      "part": "15",
      "topic": "Information and technology",
      "audioUrl": "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question15/Topic_%20information%20and%20technology%20(test%2011).mp3",
      "questions": [
        "The future generation will fail to cope with new information",
        "The information revolution will be good for the economy",
        "No computer is superior to the human brain",
        "More should be done to protect individual privacy"
      ],
      "correctAnswer": [
        "Man",
        "Woman",
        "Woman",
        "Both"
      ],
      "transcript": ""
    },
    {
      "title": "LISTENING ĐỀ 09 - Question 15",
      "part": "15",
      "topic": "Changes in the workplace",
      "audioUrl": "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question15/Topic_%20changes%20in%20the%20workplace%20(test%209).mp3",
      "questions": [
        "Continuity is important when planning a career",
        "Job security cannot be guaranteed",
        "Job satisfaction is important for motivator",
        "Technological improvement is good for the economy"
      ],
      "correctAnswer": [
        "Man",
        "Woman",
        "Both",
        "Man"
      ],
      "transcript": ""
    },
    {
      "title": "LISTENING ĐỀ 08 - Question 15",
      "part": "15",
      "topic": "Politics",
      "audioUrl": "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question15/Topic_%20politics%20(test%208).mp3",
      "questions": [
        "Young people are becoming more interested in politics",
        "Social media has changed political activism",
        "People are better informed political issues",
        "More women are likely to participate in politics"
      ],
      "correctAnswer": [
        "Both",
        "Man",
        "Woman",
        "Both"
      ],
      "transcript": ""
    },
    {
      "title": "LISTENING ĐỀ 07 - Question 15",
      "part": "15",
      "topic": "Urban farming",
      "audioUrl": "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question15/Topic_%20urban%20farming%20(test%207).mp3",
      "questions": [
        "Living space is more important than farming space",
        "Urban farming sites can be visually appealing",
        "Urban farming can benefit local economics",
        "Urban farming cannot meet food needs"
      ],
      "correctAnswer": [
        "Man",
        "Both",
        "Woman",
        "Both"
      ],
      "transcript": ""
    },
    {
      "title": "LISTENING ĐỀ 06 - Question 15",
      "part": "15",
      "topic": "ARTS",
      "audioUrl": "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question15/Topic_%20Arts%20(test%206).mp3",
      "questions": [
        "Art is only suitable for the privileged few",
        "The government should invest more in arts",
        "Children should be exposed to art early",
        "In the future, art will become more accessible"
      ],
      "correctAnswer": [
        "Man",
        "Woman",
        "Both",
        "Woman"
      ],
      "transcript": ""
    },
    {
      "title": "LISTENING ĐỀ 05 - Question 15",
      "part": "15",
      "topic": "Actors",
      "audioUrl": "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question15/Part%203%20Actors.mp3",
      "questions": [
        "Auditions are the most important of casting",
        "Actors respond best to a strong script",
        "Theatre acting and movie acting require different skills",
        "Actors need to be praised"
      ],
      "correctAnswer": [
        "Woman",
        "Man",
        "Both",
        "Both"
      ],
      "transcript": ""
    },
    {
      "title": "LISTENING ĐỀ 04 - Question 15",
      "part": "15",
      "topic": "The subject of beauty",
      "audioUrl": "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question15/Topic_%20The%20subject%20of%20beauty%20(Test%204).mp3",
      "questions": [
        "People share the very similar ideas about beauty",
        "Views of beauty change over time",
        "Beauty can be found in unlikely places",
        "Traditional ideas of beauty are going to change"
      ],
      "correctAnswer": [
        "Man",
        "Woman",
        "Both",
        "Woman"
      ],
      "transcript": ""
    },
    {
      "title": "LISTENING ĐỀ 02 - Question 15",
      "part": "15",
      "topic": "Internet",
      "audioUrl": "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question15/Topic_%20internet%20(Test%202).mp3",
      "questions": [
        "There is too much information on the internet",
        "Using internet requires skills",
        "The internet is changing the way we think",
        "Internet has made people less patient"
      ],
      "correctAnswer": [
        "Both",
        "Woman",
        "Woman",
        "Both"
      ],
      "transcript": ""
    },
    {
      "title": "LISTENING ĐỀ 03 - Question 15",
      "part": "15",
      "topic": "Music and singers",
      "audioUrl": "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question15/Part%203%20Music%20and%20singers.mp3",
      "questions": [
        "Singers play a good role for young people",
        "Taste in music is a highly personal thing",
        "Music is a universal language",
        "Music can manipulate people's feelings"
      ],
      "correctAnswer": [
        "Woman",
        "Both",
        "Man",
        "Both"
      ],
      "transcript": ""
    },
    {
      "title": "LISTENING ĐỀ 01 - Question 15",
      "part": "15",
      "topic": "University and technology",
      "audioUrl": "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question15/Part%203%20University%20and%20technology.mp3",
      "questions": [
        "Technology helps make education more accessible",
        "Social interaction is important",
        "The diverse curriculum is not an advantage",
        "University competition should be encouraged"
      ],
      "correctAnswer": [
        "Both",
        "Man",
        "Woman",
        "Man"
      ],
      "transcript": ""
    }
  ]
}
MINI_HIPPO_LESSON_DATA_END */
