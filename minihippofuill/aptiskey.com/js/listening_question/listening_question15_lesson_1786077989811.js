(function() {
  // Execute immediately if DOM is ready, otherwise wait for DOMContentLoaded
  function init() {

// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI ///////////////
// ===============================================================================================================

const question15Data_1 = {
  audioUrl: "audio/question15/audio_1786075818520.mp3",
  topic: "Politics",
  transcript: ``,
  questions: [
    "Young people are becoming more interested in politics",
    "Social media has changed political activism",
    "People are better informed political issues",
    "More women are likely to participate in politics"
  ],
  correctAnswer: ["Both", "Woman", "Man", "Both"]
};

const question15Data_2 = {
  audioUrl: "audio/question15/audio_1786075872883.mp3",
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

const question15Data_3 = {
  audioUrl: "audio/question15/audio_1786075923017.mp3",
  topic: "Urban farming",
  transcript: ``,
  questions: [
    "Living space is more important than farming space",
    "Farming space is appealing",
    "Farming space will benefit the urban economy",
    "Farming space is in need of more food"
  ],
  correctAnswer: ["Woman", "Man", "Man", "Both"]
};

const question15Data_4 = {
  audioUrl: "audio/question15/audio_1786075972866.mp3",
  topic: "Online shopping",
  transcript: ``,
  questions: [
    "The internet makes shopping easier",
    "Online shopping can be risky",
    "Shopping online is more convenient",
    "Online shopping is popular with young people"
  ],
  correctAnswer: ["Both", "Woman", "Man", "Both"]
};

const question15Data_5 = {
  audioUrl: "audio/question15/audio_1786076049965.mp3",
  topic: "Community design - Ver khác:  B - W - M - B",
  transcript: ``,
  questions: [
    "Building design can influence people\'s behavior",
    "Creating community can take time",
    "Work communities and social communities are the same",
    "Technology has changed how community forms"
  ],
  correctAnswer: ["Both", "Woman", "Man", "Man"]
};

const question15Data_6 = {
  audioUrl: "audio/question15/audio_1786076091598.mp3",
  topic: "Actor",
  transcript: ``,
  questions: [
    "Auditions are the most important of casting",
    "Actors respond best to a strong script",
    "Theatre acting and movie acting require different skills",
    "Actors need to be praised"
  ],
  correctAnswer: ["Both", "Woman", "Man", "Both"]
};

const question15Data_7 = {
  audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/question15/audio_1786076518611.mp3",
  topic: "Environmental volunteer program",
  transcript: `Man: I watched a news report about the clean-up program yesterday. To be honest, I think the media made it sound much more successful than it really was.\nWoman: I agree. They only showed the best parts and ignored many problems. The benefits of the program were clearly exaggerated.\nMan: Exactly. And even with programs like this, I still think littering will always be a problem. Some people just do not care enough about public places.\nWoman: Maybe, but I don\'t think we should give up. Volunteers can still make a difference.\nMan: That\'s true, but the problem will never completely disappear.\nWoman: For me, the reason why volunteers join is not very important. Whether they do it because they care about the environment or because they want experience, the result can still be the same if they work hard.\nMan: I see your point. But I think we need stricter rules too. In my opinion, punishment is the most effective way to stop people from littering.\nWoman: I\'m not sure it is the best way. Education is also important.\nMan: Education helps, but without fines or punishment, many people will not change their behavior.`,
  questions: [
    "The media exaggerates the benefits of the program.",
    "Littering will always be a problem.",
    "The motivation of volunteers does not affect the outcome of the program.",
    "Punishment is the most effective way to prevent littering."
  ],
  correctAnswer: ["Both", "Man", "Woman", "Man"]
};

const question15Data_8 = {
  audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/question15/audio_1786076599516.mp3",
  topic: "Local Cultural Differences",
  transcript: `Man: Have you ever thought about how different local cultures can be, even within the same country?\nWoman: Definitely. When I visited different regions last year, I was really surprised by how unique each place felt - the food, the festivals, the daily customs.\nMan: For me, the hardest part is always the language. Even when people share a national language, local dialects and accents can create real misunderstandings. I honestly think language is the biggest barrier to experiencing a different local culture.\nWoman: I would not say language alone is the biggest issue. There are other challenges too, like differences in values and social customs. But I am also concerned about how globalisation is affecting local cultures. International trends are slowly replacing traditional customs everywhere.\nMan: I think you are right about that. Globalisation is clearly changing the way people live, and local traditions are not as strong as they used to be.\nWoman: What worries me most is that younger people seem less motivated to learn about their own heritage. They are more interested in global trends than in local traditions.\nMan: I am not completely sure about that. Some young people are actually very proud of where they come from and work hard to keep their traditions alive.\nWoman: Maybe a few are. But in general, local knowledge is not being passed on the way it used to be. That is why I believe travel is really the most effective way to truly understand and appreciate cultural differences. You learn so much more by being there in person than by reading about it.\n\nMan: Travel can certainly be eye-opening. But I think there are other good ways to learn too, such as online resources and cultural events.`,
  questions: [
    "Language is the main barrier to experiencing a local culture",
    "Globalisation is having an impact on local cultures",
    "Young people are less interested in their own local heritage",
    "Travel is the best way to understand cultural differences"
  ],
  correctAnswer: ["Man", "Both", "Woman", "Woman"]
};

const question15Data_9 = {
  audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/question15/audio_1786077302937.mp3",
  topic: "Homeschooling",
  transcript: ``,
  questions: [
    "Parents should create their own curriculum",
    "Homeschooling multiple children at the same time is a good idea",
    "Homeschooling deprives children from the important social interaction",
    "Homeschooling will become less popular in the future"
  ],
  correctAnswer: ["Man", "Both", "Woman", "Man"]
};

const question15Data_10 = {
  audioUrl: "audio/question15/audio_1786077979427.mp3",
  topic: "Internet - Ver khác:  B - W - W - B/  M - W - B - W",
  transcript: ``,
  questions: [
    "There is too much information on the internet",
    "Using internet requires skills",
    "The internet is changing the way we think",
    "Internet has made people less patient"
  ],
  correctAnswer: ["Both", "Both", "Man", "Both"]
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
  question15Data_10
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
      "id": 2,
      "title": "UPDATE P3.2",
      "topic": "Politics",
      "audioUrl": "audio/question15/audio_1786075818520.mp3",
      "questions": [
        "Young people are becoming more interested in politics",
        "Social media has changed political activism",
        "People are better informed political issues",
        "More women are likely to participate in politics"
      ],
      "correctAnswer": [
        "Both",
        "Woman",
        "Man",
        "Both"
      ],
      "transcript": ""
    },
    {
      "id": 3,
      "title": "UPDATE P3.3",
      "topic": "University and technology",
      "audioUrl": "audio/question15/audio_1786075872883.mp3",
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
    },
    {
      "id": 4,
      "title": "UPDATE P3.4",
      "topic": "Urban farming",
      "audioUrl": "audio/question15/audio_1786075923017.mp3",
      "questions": [
        "Living space is more important than farming space",
        "Farming space is appealing",
        "Farming space will benefit the urban economy",
        "Farming space is in need of more food"
      ],
      "correctAnswer": [
        "Woman",
        "Man",
        "Man",
        "Both"
      ],
      "transcript": ""
    },
    {
      "id": 5,
      "title": "UPDATE P3.5",
      "topic": "Online shopping",
      "audioUrl": "audio/question15/audio_1786075972866.mp3",
      "questions": [
        "The internet makes shopping easier",
        "Online shopping can be risky",
        "Shopping online is more convenient",
        "Online shopping is popular with young people"
      ],
      "correctAnswer": [
        "Both",
        "Woman",
        "Man",
        "Both"
      ],
      "transcript": ""
    },
    {
      "id": 6,
      "title": "UPDATE P3.6",
      "topic": "Community design - Ver khác:  B - W - M - B",
      "audioUrl": "audio/question15/audio_1786076049965.mp3",
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
      "id": 7,
      "title": "UPDATE P3.7",
      "topic": "Actor",
      "audioUrl": "audio/question15/audio_1786076091598.mp3",
      "questions": [
        "Auditions are the most important of casting",
        "Actors respond best to a strong script",
        "Theatre acting and movie acting require different skills",
        "Actors need to be praised"
      ],
      "correctAnswer": [
        "Both",
        "Woman",
        "Man",
        "Both"
      ],
      "transcript": ""
    },
    {
      "id": 8,
      "title": "UPDATE P3.8",
      "topic": "Environmental volunteer program",
      "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/question15/audio_1786076518611.mp3",
      "questions": [
        "The media exaggerates the benefits of the program.",
        "Littering will always be a problem.",
        "The motivation of volunteers does not affect the outcome of the program.",
        "Punishment is the most effective way to prevent littering."
      ],
      "correctAnswer": [
        "Both",
        "Man",
        "Woman",
        "Man"
      ],
      "transcript": "Man: I watched a news report about the clean-up program yesterday. To be honest, I think the media made it sound much more successful than it really was.\nWoman: I agree. They only showed the best parts and ignored many problems. The benefits of the program were clearly exaggerated.\nMan: Exactly. And even with programs like this, I still think littering will always be a problem. Some people just do not care enough about public places.\nWoman: Maybe, but I don't think we should give up. Volunteers can still make a difference.\nMan: That's true, but the problem will never completely disappear.\nWoman: For me, the reason why volunteers join is not very important. Whether they do it because they care about the environment or because they want experience, the result can still be the same if they work hard.\nMan: I see your point. But I think we need stricter rules too. In my opinion, punishment is the most effective way to stop people from littering.\nWoman: I'm not sure it is the best way. Education is also important.\nMan: Education helps, but without fines or punishment, many people will not change their behavior."
    },
    {
      "id": 9,
      "title": "UPDATE P3.9",
      "topic": "Local Cultural Differences",
      "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/question15/audio_1786076599516.mp3",
      "questions": [
        "Language is the main barrier to experiencing a local culture",
        "Globalisation is having an impact on local cultures",
        "Young people are less interested in their own local heritage",
        "Travel is the best way to understand cultural differences"
      ],
      "correctAnswer": [
        "Man",
        "Both",
        "Woman",
        "Woman"
      ],
      "transcript": "Man: Have you ever thought about how different local cultures can be, even within the same country?\nWoman: Definitely. When I visited different regions last year, I was really surprised by how unique each place felt - the food, the festivals, the daily customs.\nMan: For me, the hardest part is always the language. Even when people share a national language, local dialects and accents can create real misunderstandings. I honestly think language is the biggest barrier to experiencing a different local culture.\nWoman: I would not say language alone is the biggest issue. There are other challenges too, like differences in values and social customs. But I am also concerned about how globalisation is affecting local cultures. International trends are slowly replacing traditional customs everywhere.\nMan: I think you are right about that. Globalisation is clearly changing the way people live, and local traditions are not as strong as they used to be.\nWoman: What worries me most is that younger people seem less motivated to learn about their own heritage. They are more interested in global trends than in local traditions.\nMan: I am not completely sure about that. Some young people are actually very proud of where they come from and work hard to keep their traditions alive.\nWoman: Maybe a few are. But in general, local knowledge is not being passed on the way it used to be. That is why I believe travel is really the most effective way to truly understand and appreciate cultural differences. You learn so much more by being there in person than by reading about it.\n\nMan: Travel can certainly be eye-opening. But I think there are other good ways to learn too, such as online resources and cultural events."
    },
    {
      "id": 10,
      "title": "UPDATE P3.10",
      "topic": "Homeschooling",
      "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/question15/audio_1786077302937.mp3",
      "questions": [
        "Parents should create their own curriculum",
        "Homeschooling multiple children at the same time is a good idea",
        "Homeschooling deprives children from the important social interaction",
        "Homeschooling will become less popular in the future"
      ],
      "correctAnswer": [
        "Man",
        "Both",
        "Woman",
        "Man"
      ],
      "transcript": ""
    },
    {
      "id": 10,
      "title": "UPDATE 3.1",
      "topic": "Internet - Ver khác:  B - W - W - B/  M - W - B - W",
      "audioUrl": "audio/question15/audio_1786077979427.mp3",
      "questions": [
        "There is too much information on the internet",
        "Using internet requires skills",
        "The internet is changing the way we think",
        "Internet has made people less patient"
      ],
      "correctAnswer": [
        "Both",
        "Both",
        "Man",
        "Both"
      ],
      "transcript": ""
    }
  ]
}
MINI_HIPPO_LESSON_DATA_END */
