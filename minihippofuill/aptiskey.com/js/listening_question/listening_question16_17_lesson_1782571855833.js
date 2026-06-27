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
  },
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "(khá giống ‘Script production’)",
    questions: [
      {
        id: "16.1",
        question: "What is one criticism mentioned regarding the series\' storytelling?",
        options: [
          "The dialogues seem unrealistic",
          "The plot develops too slowly",
          "The episodes are too short to build tension"
        ]
      },
      {
        id: "16.2",
        question: "What issue is highlighted about the series\' writing?",
        options: [
          "The new industry demand is negatively influencing script production",
          "Writers are relying too much on audience feedback",
          "There is not enough funding for script development"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "Script production ver2",
    questions: [
      {
        id: "17.1",
        question: "What is one criticism mentioned regarding the series’ storytelling?",
        options: [
          "The characters’ backgrounds are not explored",
          "The storyline contains too many unexpected twists",
          "The relationship between characters develops too quickly"
        ]
      },
      {
        id: "17.2",
        question: "What issue is highlighted about the series’ writing?",
        options: [
          "Many scripts are lacking original ideas",
          "Scriptwriters are given too much creative freedom",
          "Modern audiences prefer simpler storylines"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "chưa có",
    questions: [
      {
        id: "16.1",
        question: "Listen to a lecturer talking about two big writers of history, which are Shakespeare William and Louis Michael.",
        options: [
          "They have both been overlooked by academics",
          "They were widely recognised during their lifetime",
          "Their works influenced modern historical research directly"
        ]
      },
      {
        id: "16.2",
        question: "What did the lecturer say about both authors?",
        options: [
          "It is not always easy for the meanings to be identified",
          "Their writing style is simple for modern readers to understand",
          "Most critics agree on the interpretation of their works"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "Sports",
    questions: [
      {
        id: "17.1",
        question: "Listen to an educational expert talking about sport competition in school",
        options: [
          "They can cause harmful effects",
          "They always improve students’ academic performance",
          "They encourage every student to become more competitive"
        ]
      },
      {
        id: "17.2",
        question: "What is the expert’s advice for schools?",
        options: [
          "Provides them with a balance in their lives. / It helps balance students’ lives",
          "Schools should increase the number of sports events each term.",
          "Students should focus more on competitive sports than academic subjects."
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "chưa xác định",
    questions: [
      {
        id: "16.1",
        question: "What does the expert say about advertising?",
        options: [
          "It helps to reach new customers",
          "It mainly increases the quality of sports events",
          "It reduces the cost of organizing competitions"
        ]
      },
      {
        id: "16.2",
        question: "In what way can advertising affect sports?",
        options: [
          "They are not always good for sports fans",
          "They always make sports more enjoyable for audiences",
          "They improve the fairness of sports competitions"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "A regional development plan",
    questions: [
      {
        id: "17.1",
        question: "What is one of the main criticisms of the Regional Development Plan?",
        options: [
          "It doesn\'t provide enough alternatives to driving",
          "It focuses too much on public transport expansion",
          "It improves cycling routes but ignores road safety"
        ]
      },
      {
        id: "17.2",
        question: "What challenge is the Regional Development Plan likely to face?",
        options: [
          "It is likely to meet resistance from local communities/ The plan is not making efficient use of existing land",
          "It is expected to receive full government funding without delay",
          "It will quickly gain support from all stakeholders involved"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "A promotion campaign for a product ver2",
    questions: [
      {
        id: "16.1",
        question: "What is the main issue with the promotion campaign for a product?",
        options: [
          "It is not targeting the correct market",
          "It is spending too much money on advertising",
          "It is using outdated marketing channels"
        ]
      },
      {
        id: "16.2",
        question: "Why is the product struggling to stand out in the market?",
        options: [
          "It is too similar to many existing products",
          "It has limited availability in stores",
          "It is priced much higher than competitors"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "khá giống ‘Managing financial spending’",
    questions: [
      {
        id: "17.1",
        question: "How to manage personal finances?",
        options: [
          "Organizing their resources more effectively",
          "Spending money only on essential items",
          "Saving all income without investing"
        ]
      },
      {
        id: "17.2",
        question: "What does the speaker suggest for improving financial management?",
        options: [
          "Get advice from people that have experience/ Seek advice from someone who is experienced",
          "Avoid discussing money matters with others.",
          "Rely only on personal budgeting tools without guidance."
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "CCTV",
    questions: [
      {
        id: "16.1",
        question: "Chọn key theo topic",
        options: [
          "People are unnecessarily worried about them",
          "People are fully aware of how CCTV systems work",
          "CCTV cameras are only used in private homes"
        ]
      },
      {
        id: "16.2",
        question: "Chọn key theo topic",
        options: [
          "People should feel reassured about their presence",
          "CCTV should be removed from most public areas",
          "CCTV is only effective when people are constantly aware of it"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "A new book about science",
    questions: [
      {
        id: "17.1",
        question: "What does the speaker say about the way of writing?",
        options: [
          "It is exciting to read.",
          "It is too technical for most readers.",
          "It focuses mainly on long historical explanations."
        ]
      },
      {
        id: "17.2",
        question: "What does the speaker say about the overall content of the book?",
        options: [
          "It has been written for a general audience.",
          "It is intended only for professional scientists.",
          "It is mainly a collection of academic research papers."
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "A research into happiness",
    questions: [
      {
        id: "16.1",
        question: "What does the radio MC say about how the research on happiness has been covered by the media?",
        options: [
          "It has not been accurately reported by the media",
          "It has been widely praised for its scientific accuracy",
          "It has received very little attention from journalists"
        ]
      },
      {
        id: "16.2",
        question: "According to the radio MC, what is unlikely regarding the research on happiness?",
        options: [
          "The research is unlikely to find a conclusive answer",
          "The research will quickly become outdated",
          "The research will only focus on short-term happiness"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "Making plans for short-term goals",
    questions: [
      {
        id: "17.1",
        question: "What does the speaker say about short-term goals?",
        options: [
          "It allows you to be more flexible.",
          "It makes long-term planning unnecessary.",
          "It requires strict and fixed schedules."
        ]
      },
      {
        id: "17.2",
        question: "What is the speaker\'s opinion about goal setting?",
        options: [
          "It can prevent you from making mistakes.",
          "It limits creativity in decision-making.",
          "It only works for experienced people."
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "A new guide",
    questions: [
      {
        id: "16.1",
        question: "What does this guidebook offer to its audience?",
        options: [
          "It creates a sense of adventure.",
          "It provides detailed historical background of each location.",
          "It focuses mainly on budget travel options."
        ]
      },
      {
        id: "16.2",
        question: "What is the speaker\'s opinion about this guidebook?",
        options: [
          "It is suitable for particular generations.",
          "It is designed for all age groups equally.",
          "It is outdated and no longer relevant for modern travellers."
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "Managing financial spending ver2",
    questions: [
      {
        id: "17.1",
        question: "How does the speaker recommend saving money effectively?",
        options: [
          "Organizing their resources more effectively",
          "Reducing all unnecessary spending immediately",
          "Keeping all savings in cash at home"
        ]
      },
      {
        id: "17.2",
        question: "Who does the speaker believe can save money most successfully?",
        options: [
          "Get advice from people that have experience.",
          "People who avoid making financial plans.",
          "People who make decisions without outside opinions."
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "Viral video",
    questions: [
      {
        id: "16.1",
        question: "Chọn key theo topic",
        options: [
          "Its production techniques.",
          "Its high advertising budget.",
          "Its celebrity endorsements."
        ]
      },
      {
        id: "16.2",
        question: "Chọn key theo topic",
        options: [
          "They should be released at the right time.",
          "They should be uploaded to as many platforms as possible.",
          "They should avoid targeting specific audiences."
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "Concentration",
    questions: [
      {
        id: "17.1",
        question: "Chọn key theo topic",
        options: [
          "Concentration depends mostly on environment.",
          "Concentration is determined only by natural ability.",
          "Concentration improves automatically with age."
        ]
      },
      {
        id: "17.2",
        question: "Chọn key theo topic",
        options: [
          "People often fail to consider the limits of concentration.",
          "People generally overestimate the importance of rest.",
          "People can maintain concentration for unlimited periods."
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "Building",
    questions: [
      {
        id: "16.1",
        question: "Chọn key theo topic",
        options: [
          "Not typical of modern buildings",
          "They are usually identical across all cities",
          "They are inspired mainly by ancient architecture"
        ]
      },
      {
        id: "16.2",
        question: "Chọn key theo topic",
        options: [
          "They often display a lack of ambition",
          "They are too expensive to construct",
          "They are overly decorated with traditional styles"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "Create motivation",
    questions: [
      {
        id: "17.1",
        question: "Chọn key theo topic",
        options: [
          "The team members lose confidence",
          "The team becomes more competitive",
          "The team improves communication skills"
        ]
      },
      {
        id: "17.2",
        question: "Chọn key theo topic",
        options: [
          "Someone who can set a realistic goal",
          "Someone who avoids making decisions",
          "Someone who focuses only on short-term success"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "Railways",
    questions: [
      {
        id: "16.1",
        question: "Chọn key theo topic",
        options: [
          "They did not make enough money",
          "They expanded too quickly into new regions",
          "They had too many passengers"
        ]
      },
      {
        id: "16.2",
        question: "Chọn key theo topic",
        options: [
          "He was continuing policies that had already been implemented",
          "He was introducing completely new transportation laws",
          "He was reducing investment in public transport"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "Chưa xác định",
    questions: [
      {
        id: "17.1",
        question: "Chọn key theo topic",
        options: [
          "Have something to say about modern society",
          "Focus only on historical events",
          "Avoid discussing social issues"
        ]
      },
      {
        id: "17.2",
        question: "Chọn key theo topic",
        options: [
          "Meanings are not easily identified",
          "Meanings are always obvious to readers",
          "Texts should not be interpreted in different ways"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "Television Series (Ver 2)",
    questions: [
      {
        id: "16.1",
        question: "Chọn key theo topic",
        options: [
          "It caught the audience\'s attention from the start",
          "It struggled to gain viewers at first",
          "It was cancelled after the first episode"
        ]
      },
      {
        id: "16.2",
        question: "Chọn key theo topic",
        options: [
          "It can help reach new customers",
          "It is only popular among critics",
          "It has no impact on audience growth"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "Television Series (Ver 3)",
    questions: [
      {
        id: "17.1",
        question: "Chọn key theo topic",
        options: [
          "It failed to engage the audience from the start",
          "It became popular after the final season",
          "It improved steadily over time"
        ]
      },
      {
        id: "17.2",
        question: "Chọn key theo topic",
        options: [
          "Series are damaged by overexposure",
          "Series become better the longer they run",
          "Overexposure has no impact on audience interest"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "Building Design",
    questions: [
      {
        id: "16.1",
        question: "Chọn key theo topic",
        options: [
          "They associate with modern cityscapes",
          "They are mainly influenced by rural architecture",
          "They are designed for historical preservation"
        ]
      },
      {
        id: "16.2",
        question: "Chọn key theo topic",
        options: [
          "They often display a lack of ambition",
          "They are too focused on interior design",
          "They use too many experimental materials"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "Work And Books",
    questions: [
      {
        id: "17.1",
        question: "Chọn key theo topic",
        options: [
          "It helps develop skills, contribute to society, and provide a sense of purpose",
          "It is mainly for entertainment purposes only",
          "It replaces the need for practical experience"
        ]
      },
      {
        id: "17.2",
        question: "Chọn key theo topic",
        options: [
          "Growth in every area of a person\'s life",
          "Improvement in financial status only",
          "Better academic performance exclusively"
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
    },
    {
      "id": 4,
      "title": "UPDATE P4",
      "question16": {
        "topic": "(khá giống ‘Script production’)",
        "audioUrl": "audio/question16/no_audio.mp3",
        "questions": [
          {
            "id": "16.1",
            "question": "What is one criticism mentioned regarding the series' storytelling?",
            "options": [
              "The dialogues seem unrealistic",
              "The plot develops too slowly",
              "The episodes are too short to build tension"
            ],
            "correctAnswer": "The dialogues seem unrealistic"
          },
          {
            "id": "16.2",
            "question": "What issue is highlighted about the series' writing?",
            "options": [
              "The new industry demand is negatively influencing script production",
              "Writers are relying too much on audience feedback",
              "There is not enough funding for script development"
            ],
            "correctAnswer": "The new industry demand is negatively influencing script production"
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "Script production ver2",
        "audioUrl": "audio/question17/no_audio.mp3",
        "questions": [
          {
            "id": "17.1",
            "question": "What is one criticism mentioned regarding the series’ storytelling?",
            "options": [
              "The characters’ backgrounds are not explored",
              "The storyline contains too many unexpected twists",
              "The relationship between characters develops too quickly"
            ],
            "correctAnswer": "The characters’ backgrounds are not explored"
          },
          {
            "id": "17.2",
            "question": "What issue is highlighted about the series’ writing?",
            "options": [
              "Many scripts are lacking original ideas",
              "Scriptwriters are given too much creative freedom",
              "Modern audiences prefer simpler storylines"
            ],
            "correctAnswer": "Many scripts are lacking original ideas"
          }
        ],
        "transcript": ""
      }
    },
    {
      "id": 5,
      "title": "UPDATE P4",
      "question16": {
        "topic": "chưa có",
        "audioUrl": "audio/question16/no_audio.mp3",
        "questions": [
          {
            "id": "16.1",
            "question": "Listen to a lecturer talking about two big writers of history, which are Shakespeare William and Louis Michael.",
            "options": [
              "They have both been overlooked by academics",
              "They were widely recognised during their lifetime",
              "Their works influenced modern historical research directly"
            ],
            "correctAnswer": "They have both been overlooked by academics"
          },
          {
            "id": "16.2",
            "question": "What did the lecturer say about both authors?",
            "options": [
              "It is not always easy for the meanings to be identified",
              "Their writing style is simple for modern readers to understand",
              "Most critics agree on the interpretation of their works"
            ],
            "correctAnswer": "It is not always easy for the meanings to be identified"
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "Sports",
        "audioUrl": "audio/question17/no_audio.mp3",
        "questions": [
          {
            "id": "17.1",
            "question": "Listen to an educational expert talking about sport competition in school",
            "options": [
              "They can cause harmful effects",
              "They always improve students’ academic performance",
              "They encourage every student to become more competitive"
            ],
            "correctAnswer": "They can cause harmful effects"
          },
          {
            "id": "17.2",
            "question": "What is the expert’s advice for schools?",
            "options": [
              "Provides them with a balance in their lives. / It helps balance students’ lives",
              "Schools should increase the number of sports events each term.",
              "Students should focus more on competitive sports than academic subjects."
            ],
            "correctAnswer": "Provides them with a balance in their lives. / It helps balance students’ lives"
          }
        ],
        "transcript": ""
      }
    },
    {
      "id": 6,
      "title": "UPDATE P4",
      "question16": {
        "topic": "chưa xác định",
        "audioUrl": "audio/question16/no_audio.mp3",
        "questions": [
          {
            "id": "16.1",
            "question": "What does the expert say about advertising?",
            "options": [
              "It helps to reach new customers",
              "It mainly increases the quality of sports events",
              "It reduces the cost of organizing competitions"
            ],
            "correctAnswer": "It helps to reach new customers"
          },
          {
            "id": "16.2",
            "question": "In what way can advertising affect sports?",
            "options": [
              "They are not always good for sports fans",
              "They always make sports more enjoyable for audiences",
              "They improve the fairness of sports competitions"
            ],
            "correctAnswer": "They are not always good for sports fans"
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "A regional development plan",
        "audioUrl": "audio/question17/no_audio.mp3",
        "questions": [
          {
            "id": "17.1",
            "question": "What is one of the main criticisms of the Regional Development Plan?",
            "options": [
              "It doesn't provide enough alternatives to driving",
              "It focuses too much on public transport expansion",
              "It improves cycling routes but ignores road safety"
            ],
            "correctAnswer": "It doesn't provide enough alternatives to driving"
          },
          {
            "id": "17.2",
            "question": "What challenge is the Regional Development Plan likely to face?",
            "options": [
              "It is likely to meet resistance from local communities/ The plan is not making efficient use of existing land",
              "It is expected to receive full government funding without delay",
              "It will quickly gain support from all stakeholders involved"
            ],
            "correctAnswer": "It is likely to meet resistance from local communities/ The plan is not making efficient use of existing land"
          }
        ],
        "transcript": ""
      }
    },
    {
      "id": 7,
      "title": "UPDATE P4",
      "question16": {
        "topic": "A promotion campaign for a product ver2",
        "audioUrl": "audio/question16/no_audio.mp3",
        "questions": [
          {
            "id": "16.1",
            "question": "What is the main issue with the promotion campaign for a product?",
            "options": [
              "It is not targeting the correct market",
              "It is spending too much money on advertising",
              "It is using outdated marketing channels"
            ],
            "correctAnswer": "It is not targeting the correct market"
          },
          {
            "id": "16.2",
            "question": "Why is the product struggling to stand out in the market?",
            "options": [
              "It is too similar to many existing products",
              "It has limited availability in stores",
              "It is priced much higher than competitors"
            ],
            "correctAnswer": "It is too similar to many existing products"
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "khá giống ‘Managing financial spending’",
        "audioUrl": "audio/question17/no_audio.mp3",
        "questions": [
          {
            "id": "17.1",
            "question": "How to manage personal finances?",
            "options": [
              "Organizing their resources more effectively",
              "Spending money only on essential items",
              "Saving all income without investing"
            ],
            "correctAnswer": "Organizing their resources more effectively"
          },
          {
            "id": "17.2",
            "question": "What does the speaker suggest for improving financial management?",
            "options": [
              "Get advice from people that have experience/ Seek advice from someone who is experienced",
              "Avoid discussing money matters with others.",
              "Rely only on personal budgeting tools without guidance."
            ],
            "correctAnswer": "Get advice from people that have experience/ Seek advice from someone who is experienced"
          }
        ],
        "transcript": ""
      }
    },
    {
      "id": 8,
      "title": "UPDATE P4",
      "question16": {
        "topic": "CCTV",
        "audioUrl": "audio/question16/no_audio.mp3",
        "questions": [
          {
            "id": "16.1",
            "question": "Chọn key theo topic",
            "options": [
              "People are unnecessarily worried about them",
              "People are fully aware of how CCTV systems work",
              "CCTV cameras are only used in private homes"
            ],
            "correctAnswer": "People are unnecessarily worried about them"
          },
          {
            "id": "16.2",
            "question": "Chọn key theo topic",
            "options": [
              "People should feel reassured about their presence",
              "CCTV should be removed from most public areas",
              "CCTV is only effective when people are constantly aware of it"
            ],
            "correctAnswer": "People should feel reassured about their presence"
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "A new book about science",
        "audioUrl": "audio/question17/no_audio.mp3",
        "questions": [
          {
            "id": "17.1",
            "question": "What does the speaker say about the way of writing?",
            "options": [
              "It is exciting to read.",
              "It is too technical for most readers.",
              "It focuses mainly on long historical explanations."
            ],
            "correctAnswer": "It is exciting to read."
          },
          {
            "id": "17.2",
            "question": "What does the speaker say about the overall content of the book?",
            "options": [
              "It has been written for a general audience.",
              "It is intended only for professional scientists.",
              "It is mainly a collection of academic research papers."
            ],
            "correctAnswer": "It has been written for a general audience."
          }
        ],
        "transcript": ""
      }
    },
    {
      "id": 9,
      "title": "UPDATE P4",
      "question16": {
        "topic": "A research into happiness",
        "audioUrl": "audio/question16/no_audio.mp3",
        "questions": [
          {
            "id": "16.1",
            "question": "What does the radio MC say about how the research on happiness has been covered by the media?",
            "options": [
              "It has not been accurately reported by the media",
              "It has been widely praised for its scientific accuracy",
              "It has received very little attention from journalists"
            ],
            "correctAnswer": "It has not been accurately reported by the media"
          },
          {
            "id": "16.2",
            "question": "According to the radio MC, what is unlikely regarding the research on happiness?",
            "options": [
              "The research is unlikely to find a conclusive answer",
              "The research will quickly become outdated",
              "The research will only focus on short-term happiness"
            ],
            "correctAnswer": "The research is unlikely to find a conclusive answer"
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "Making plans for short-term goals",
        "audioUrl": "audio/question17/no_audio.mp3",
        "questions": [
          {
            "id": "17.1",
            "question": "What does the speaker say about short-term goals?",
            "options": [
              "It allows you to be more flexible.",
              "It makes long-term planning unnecessary.",
              "It requires strict and fixed schedules."
            ],
            "correctAnswer": "It allows you to be more flexible."
          },
          {
            "id": "17.2",
            "question": "What is the speaker's opinion about goal setting?",
            "options": [
              "It can prevent you from making mistakes.",
              "It limits creativity in decision-making.",
              "It only works for experienced people."
            ],
            "correctAnswer": "It can prevent you from making mistakes."
          }
        ],
        "transcript": ""
      }
    },
    {
      "id": 10,
      "title": "UPDATE P4",
      "question16": {
        "topic": "A new guide",
        "audioUrl": "audio/question16/no_audio.mp3",
        "questions": [
          {
            "id": "16.1",
            "question": "What does this guidebook offer to its audience?",
            "options": [
              "It creates a sense of adventure.",
              "It provides detailed historical background of each location.",
              "It focuses mainly on budget travel options."
            ],
            "correctAnswer": "It creates a sense of adventure."
          },
          {
            "id": "16.2",
            "question": "What is the speaker's opinion about this guidebook?",
            "options": [
              "It is suitable for particular generations.",
              "It is designed for all age groups equally.",
              "It is outdated and no longer relevant for modern travellers."
            ],
            "correctAnswer": "It is suitable for particular generations."
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "Managing financial spending ver2",
        "audioUrl": "audio/question17/no_audio.mp3",
        "questions": [
          {
            "id": "17.1",
            "question": "How does the speaker recommend saving money effectively?",
            "options": [
              "Organizing their resources more effectively",
              "Reducing all unnecessary spending immediately",
              "Keeping all savings in cash at home"
            ],
            "correctAnswer": "Organizing their resources more effectively"
          },
          {
            "id": "17.2",
            "question": "Who does the speaker believe can save money most successfully?",
            "options": [
              "Get advice from people that have experience.",
              "People who avoid making financial plans.",
              "People who make decisions without outside opinions."
            ],
            "correctAnswer": "Get advice from people that have experience."
          }
        ],
        "transcript": ""
      }
    },
    {
      "id": 11,
      "title": "UPDATE P4",
      "question16": {
        "topic": "Viral video",
        "audioUrl": "audio/question16/no_audio.mp3",
        "questions": [
          {
            "id": "16.1",
            "question": "Chọn key theo topic",
            "options": [
              "Its production techniques.",
              "Its high advertising budget.",
              "Its celebrity endorsements."
            ],
            "correctAnswer": "Its production techniques."
          },
          {
            "id": "16.2",
            "question": "Chọn key theo topic",
            "options": [
              "They should be released at the right time.",
              "They should be uploaded to as many platforms as possible.",
              "They should avoid targeting specific audiences."
            ],
            "correctAnswer": "They should be released at the right time."
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "Concentration",
        "audioUrl": "audio/question17/no_audio.mp3",
        "questions": [
          {
            "id": "17.1",
            "question": "Chọn key theo topic",
            "options": [
              "Concentration depends mostly on environment.",
              "Concentration is determined only by natural ability.",
              "Concentration improves automatically with age."
            ],
            "correctAnswer": "Concentration depends mostly on environment."
          },
          {
            "id": "17.2",
            "question": "Chọn key theo topic",
            "options": [
              "People often fail to consider the limits of concentration.",
              "People generally overestimate the importance of rest.",
              "People can maintain concentration for unlimited periods."
            ],
            "correctAnswer": "People often fail to consider the limits of concentration."
          }
        ],
        "transcript": ""
      }
    },
    {
      "id": 12,
      "title": "UPDATE P4",
      "question16": {
        "topic": "Building",
        "audioUrl": "audio/question16/no_audio.mp3",
        "questions": [
          {
            "id": "16.1",
            "question": "Chọn key theo topic",
            "options": [
              "Not typical of modern buildings",
              "They are usually identical across all cities",
              "They are inspired mainly by ancient architecture"
            ],
            "correctAnswer": "Not typical of modern buildings"
          },
          {
            "id": "16.2",
            "question": "Chọn key theo topic",
            "options": [
              "They often display a lack of ambition",
              "They are too expensive to construct",
              "They are overly decorated with traditional styles"
            ],
            "correctAnswer": "They often display a lack of ambition"
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "Create motivation",
        "audioUrl": "audio/question17/no_audio.mp3",
        "questions": [
          {
            "id": "17.1",
            "question": "Chọn key theo topic",
            "options": [
              "The team members lose confidence",
              "The team becomes more competitive",
              "The team improves communication skills"
            ],
            "correctAnswer": "The team members lose confidence"
          },
          {
            "id": "17.2",
            "question": "Chọn key theo topic",
            "options": [
              "Someone who can set a realistic goal",
              "Someone who avoids making decisions",
              "Someone who focuses only on short-term success"
            ],
            "correctAnswer": "Someone who can set a realistic goal"
          }
        ],
        "transcript": ""
      }
    },
    {
      "id": 13,
      "title": "UPDATE P4",
      "question16": {
        "topic": "Railways",
        "audioUrl": "audio/question16/no_audio.mp3",
        "questions": [
          {
            "id": "16.1",
            "question": "Chọn key theo topic",
            "options": [
              "They did not make enough money",
              "They expanded too quickly into new regions",
              "They had too many passengers"
            ],
            "correctAnswer": "They did not make enough money"
          },
          {
            "id": "16.2",
            "question": "Chọn key theo topic",
            "options": [
              "He was continuing policies that had already been implemented",
              "He was introducing completely new transportation laws",
              "He was reducing investment in public transport"
            ],
            "correctAnswer": "He was continuing policies that had already been implemented"
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "Chưa xác định",
        "audioUrl": "audio/question17/no_audio.mp3",
        "questions": [
          {
            "id": "17.1",
            "question": "Chọn key theo topic",
            "options": [
              "Have something to say about modern society",
              "Focus only on historical events",
              "Avoid discussing social issues"
            ],
            "correctAnswer": "Have something to say about modern society"
          },
          {
            "id": "17.2",
            "question": "Chọn key theo topic",
            "options": [
              "Meanings are not easily identified",
              "Meanings are always obvious to readers",
              "Texts should not be interpreted in different ways"
            ],
            "correctAnswer": "Meanings are not easily identified"
          }
        ],
        "transcript": ""
      }
    },
    {
      "id": 14,
      "title": "UPDATE P4",
      "question16": {
        "topic": "Television Series (Ver 2)",
        "audioUrl": "audio/question16/no_audio.mp3",
        "questions": [
          {
            "id": "16.1",
            "question": "Chọn key theo topic",
            "options": [
              "It caught the audience's attention from the start",
              "It struggled to gain viewers at first",
              "It was cancelled after the first episode"
            ],
            "correctAnswer": "It caught the audience's attention from the start"
          },
          {
            "id": "16.2",
            "question": "Chọn key theo topic",
            "options": [
              "It can help reach new customers",
              "It is only popular among critics",
              "It has no impact on audience growth"
            ],
            "correctAnswer": "It can help reach new customers"
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "Television Series (Ver 3)",
        "audioUrl": "audio/question17/no_audio.mp3",
        "questions": [
          {
            "id": "17.1",
            "question": "Chọn key theo topic",
            "options": [
              "It failed to engage the audience from the start",
              "It became popular after the final season",
              "It improved steadily over time"
            ],
            "correctAnswer": "It failed to engage the audience from the start"
          },
          {
            "id": "17.2",
            "question": "Chọn key theo topic",
            "options": [
              "Series are damaged by overexposure",
              "Series become better the longer they run",
              "Overexposure has no impact on audience interest"
            ],
            "correctAnswer": "Series are damaged by overexposure"
          }
        ],
        "transcript": ""
      }
    },
    {
      "id": 15,
      "title": "UPDATE P4",
      "question16": {
        "topic": "Building Design",
        "audioUrl": "audio/question16/no_audio.mp3",
        "questions": [
          {
            "id": "16.1",
            "question": "Chọn key theo topic",
            "options": [
              "They associate with modern cityscapes",
              "They are mainly influenced by rural architecture",
              "They are designed for historical preservation"
            ],
            "correctAnswer": "They associate with modern cityscapes"
          },
          {
            "id": "16.2",
            "question": "Chọn key theo topic",
            "options": [
              "They often display a lack of ambition",
              "They are too focused on interior design",
              "They use too many experimental materials"
            ],
            "correctAnswer": "They often display a lack of ambition"
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "Work And Books",
        "audioUrl": "audio/question17/no_audio.mp3",
        "questions": [
          {
            "id": "17.1",
            "question": "Chọn key theo topic",
            "options": [
              "It helps develop skills, contribute to society, and provide a sense of purpose",
              "It is mainly for entertainment purposes only",
              "It replaces the need for practical experience"
            ],
            "correctAnswer": "It helps develop skills, contribute to society, and provide a sense of purpose"
          },
          {
            "id": "17.2",
            "question": "Chọn key theo topic",
            "options": [
              "Growth in every area of a person's life",
              "Improvement in financial status only",
              "Better academic performance exclusively"
            ],
            "correctAnswer": "Growth in every area of a person's life"
          }
        ],
        "transcript": ""
      }
    }
  ]
}
MINI_HIPPO_LESSON_DATA_END */
