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
          "It has received very positive reviews",
          "It will be released next month"
        ]
      },
      {
        id: "16.2",
        question: "What should the writer do in the future?",
        options: [
          "He should listen to critics before writing his next work",
          "He should continue to develop his own style",
          "He should write for a wider audience"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "Writer’s block",
    questions: [
      {
        id: "17.1",
        question: "What is the critic’s main complaint?",
        options: [
          "The characters lacked depth/ Create dedicated periods",
          "The story is too predictable",
          "The ending is confusing"
        ]
      },
      {
        id: "17.2",
        question: "What does the writer regret doing during her experience with writer’s block?",
        options: [
          "Refuse to seek advice from others",
          "Stopping writing completely",
          "Putting too much pressure on herself"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "2 famous writers",
    questions: [
      {
        id: "16.1",
        question: "Chọn key theo Topic",
        options: [
          "They both make references to each other in their work",
          "They only wrote children’s fairy tales",
          "Their works were always immediately understood by the public"
        ]
      },
      {
        id: "16.2",
        question: "Chọn key theo Topic",
        options: [
          "The meaning of their work is not always easily identified",
          "They lived in completely different centuries and never overlapped in time",
          "They focused exclusively on political speeches rather than literature"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "Work from home",
    questions: [
      {
        id: "17.1",
        question: "Chọn key theo Topic",
        options: [
          "It wasn’t as good as she had expected",
          "It always guarantees higher productivity for everyone",
          "It completely eliminates the need for teamwork"
        ]
      },
      {
        id: "17.2",
        question: "Chọn key theo Topic",
        options: [
          "It depends on your situation and personality",
          "It is universally preferred over working in an office",
          "It makes communication with colleagues unnecessary"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "Managing financial spending",
    questions: [
      {
        id: "16.1",
        question: "Chọn key theo Topic",
        options: [
          "Monitor your spending for a weekly plan",
          "Spend money without keeping any record",
          "Always ignore professional financial guidance"
        ]
      },
      {
        id: "16.2",
        question: "Chọn key theo Topic",
        options: [
          "Seek advice from someone who has experience",
          "Buy whatever you want without considering your budget",
          "Assume financial planning is unnecessary for young people"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "The importance of sleep",
    questions: [
      {
        id: "17.1",
        question: "Chọn key theo Topic",
        options: [
          "Blocking out noise and light is a key",
          "Sleep is unnecessary for maintaining good health",
          "Everyone needs exactly the same number of hours of sleep"
        ]
      },
      {
        id: "17.2",
        question: "Chọn key theo Topic",
        options: [
          "People can’t always recognize the symptoms of tiredness",
          "Sleeping less always makes you more productive",
          "Sleep problems can be solved simply by drinking more coffee"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "Making plans",
    questions: [
      {
        id: "16.1",
        question: "Chọn key theo Topic",
        options: [
          "They help you make decisions",
          "Plans always guarantee success without effort",
          "Making plans means you never face unexpected problems"
        ]
      },
      {
        id: "16.2",
        question: "Chọn key theo Topic",
        options: [
          "It requires you to set yourself certain limits",
          "Plans are only useful for people who dislike creativity",
          "Once you make a plan, you must follow it exactly without any flexibility"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "A promotion campaign for a product",
    questions: [
      {
        id: "17.1",
        question: "Chọn key theo Topic",
        options: [
          "It is making exaggerated claims",
          "A promotion campaign never requires any planning or strategy",
          "It guarantees instant success for every product"
        ]
      },
      {
        id: "17.2",
        question: "Chọn key theo Topic",
        options: [
          "It costs too much to make to be profitable",
          "Customers will always believe the campaign without question",
          "It makes the product automatically better in quality"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "Television series",
    questions: [
      {
        id: "16.1",
        question: "Chọn key theo Topic",
        options: [
          "It has the consistent quality throughout",
          "Every television series is produced without any budget limitations",
          "Series never change their storyline once the first episode is made"
        ]
      },
      {
        id: "16.2",
        question: "Chọn key theo Topic",
        options: [
          "Viewer habits influence the way that series are made",
          "All viewers interpret the series in exactly the same way",
          "Television series are created only for educational purposes"
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
        question: "Chọn key theo Topic",
        options: [
          "It can help reach new customers",
          "Advertising and sponsoring always guarantee success without any risk",
          "Sponsorships never affect the image of the product or the sport"
        ]
      },
      {
        id: "17.2",
        question: "Chọn key theo Topic",
        options: [
          "They can generate negative publicity for the sport",
          "They make customers automatically loyal without further effort",
          "Advertising campaigns are only useful for products that are already popular"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "Professionalism at work",
    questions: [
      {
        id: "16.1",
        question: "Chọn key theo Topic",
        options: [
          "Maintain a positive attitude",
          "Professionalism means ignoring all workplace rules",
          "It requires you to avoid communicating with colleagues"
        ]
      },
      {
        id: "16.2",
        question: "Chọn key theo Topic",
        options: [
          "Change its definition",
          "Being professional means admitting mistakes",
          "Professionalism is important for managers"
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
        question: "Chọn key theo Topic",
        options: [
          "He will probably retire from singing",
          "He had no problems",
          "Every song was a hit"
        ]
      },
      {
        id: "17.2",
        question: "Chọn key theo Topic",
        options: [
          "He could have been more successful",
          "His life was stress‑free",
          "He only sang for friends"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "A book about a life of a scientist",
    questions: [
      {
        id: "16.1",
        question: "Chọn key theo Topic",
        options: [
          "It uses simple language to describe complex ideas",
          "It explains scientific concepts in great detail",
          "The writing style is clear and well organised"
        ]
      },
      {
        id: "16.2",
        question: "Chọn key theo Topic",
        options: [
          "It is similar to the previous book about the scientist",
          "The book offers new perspectives on the scientist",
          "It focuses on a different stage of the scientist’s life"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "A break from studying",
    questions: [
      {
        id: "17.1",
        question: "Chọn key theo Topic",
        options: [
          "He wasn’t ready to start higher education",
          "He disliked all forms of learning",
          "Every student must take a break"
        ]
      },
      {
        id: "17.2",
        question: "Chọn key theo Topic",
        options: [
          "To be more independent",
          "A break guarantees better grades without effort",
          "It means avoiding responsibility altogether"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "A new restaurant",
    questions: [
      {
        id: "16.1",
        question: "Chọn key theo Topic",
        options: [
          "Standard of Service wasn’t good",
          "The service was provided quickly",
          "The staff were generally polite"
        ]
      },
      {
        id: "16.2",
        question: "Chọn key theo Topic",
        options: [
          "They need to make the customers feel valued and welcome",
          "They should offer more special discounts",
          "The business needs to improve its facilities"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "New novel",
    questions: [
      {
        id: "17.1",
        question: "Chọn key theo Topic",
        options: [
          "They are difficult to relate to",
          "Every reader finds it perfect",
          "It instantly became the most popular book worldwide"
        ]
      },
      {
        id: "17.2",
        question: "Chọn key theo Topic",
        options: [
          "It lacks originality",
          "The novel requires no imagination to enjoy",
          "It improves the quality of all other novels automatically"
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
        question: "Chọn key theo Topic",
        options: [
          "It creates a sense of adventure",
          "It allows people to experience new places",
          "It can be exciting for some participants"
        ]
      },
      {
        id: "16.2",
        question: "Chọn key theo Topic",
        options: [
          "It is only suitable for a particular generation",
          "Younger people tend to be more interested in it",
          "It appeals to a wide range of age groups"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "Life after university",
    questions: [
      {
        id: "17.1",
        question: "Chọn key theo Topic",
        options: [
          "Be flexible and open minded",
          "Follow clear rules and routines",
          "Plan everything carefully in advance"
        ]
      },
      {
        id: "17.2",
        question: "Chọn key theo Topic",
        options: [
          "They are becoming more competitive",
          "They are facing increasing pressure",
          "They are changing the way they operate"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "CCTV (Security cameras)",
    questions: [
      {
        id: "16.1",
        question: "Chọn key theo Topic",
        options: [
          "Employees probably worry unnecessary",
          "Employees have expressed concerns about recent changes",
          "Some employees are uncertain about the situation"
        ]
      },
      {
        id: "16.2",
        question: "Chọn key theo Topic",
        options: [
          "People should feel reassured",
          "People are waiting for more information",
          "People have mixed feelings about the issue"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "Writer’s book",
    questions: [
      {
        id: "17.1",
        question: "Chọn key theo Topic",
        options: [
          "Create dedicated periods",
          "Use time more efficiently",
          "Follow a flexible schedule"
        ]
      },
      {
        id: "17.2",
        question: "Chọn key theo Topic",
        options: [
          "Refusing to seek the advice of other people",
          "Listening carefully to different opinions",
          "Discussing problems with colleagues"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question16/no_audio.mp3",
    topic: "Script production",
    questions: [
      {
        id: "16.1",
        question: "Chọn key theo topic",
        options: [
          "The characters\' background are not adequately explored",
          "The characters play an important role in the story",
          "The characters’ personalities are clearly presented"
        ]
      },
      {
        id: "16.2",
        question: "Chọn key theo topic",
        options: [
          "The new industry demands are negatively influencing script production",
          "The industry is undergoing rapid changes",
          "Script production has increased in recent years"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "Plans for the city",
    questions: [
      {
        id: "17.1",
        question: "Chọn key theo topic",
        options: [
          "It doesn\'t do enough to promote alternatives to driving",
          "The focus is mainly on improving road safety",
          "It encourages people to consider different transport options"
        ]
      },
      {
        id: "17.2",
        question: "Chọn key theo topic",
        options: [
          "The plan is not making efficient use of existing land",
          "The plan involves developing new areas",
          "Land use has been carefully considered in the proposal"
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
        question: "Chọn key theo topic",
        options: [
          "It has not been accurately reported by the media",
          "The issue has received widespread media coverage",
          "The media has shown increasing interest in the topic"
        ]
      },
      {
        id: "16.2",
        question: "Chọn key theo topic",
        options: [
          "The research is unlikely to find a conclusive answer",
          "The research is expected to provide useful insights",
          "The study may lead to further investigation in the future"
        ]
      }
    ],
    transcript: ""
  },
  {
    audioUrl: "audio/question17/no_audio.mp3",
    topic: "Criticism of the new novel",
    questions: [
      {
        id: "17.1",
        question: "Chọn key theo topic",
        options: [
          "The characters were interesting",
          "The storyline was easy to follow",
          "The characters were described in great detail"
        ]
      },
      {
        id: "17.2",
        question: "Chọn key theo topic",
        options: [
          "It will establish the author\'s popularity",
          "It may improve the author’s writing skills",
          "It could influence other writers in the same genre"
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
      "title": "LISTENING ĐỀ 12 - Question 16 & 17",
      "part": "16_17",
      "question16": {
        "topic": "A new novel of a famous writer",
        "audioUrl": "",
        "questions": [
          {
            "id": "16.1",
            "question": "What does the announcer say?",
            "options": [
              "It is different from his earlier works",
              "It has received very positive reviews",
              "It will be released next month"
            ]
          },
          {
            "id": "16.2",
            "question": "What should the writer do in the future?",
            "options": [
              "He should listen to critics before writing his next work",
              "He should continue to develop his own style",
              "He should write for a wider audience"
            ]
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "Writer’s block",
        "audioUrl": "",
        "questions": [
          {
            "id": "17.1",
            "question": "What is the critic’s main complaint?",
            "options": [
              "The characters lacked depth/ Create dedicated periods",
              "The story is too predictable",
              "The ending is confusing"
            ]
          },
          {
            "id": "17.2",
            "question": "What does the writer regret doing during her experience with writer’s block?",
            "options": [
              "Refuse to seek advice from others",
              "Stopping writing completely",
              "Putting too much pressure on herself"
            ]
          }
        ],
        "transcript": ""
      }
    },
    {
      "title": "LISTENING ĐỀ 11 - Question 16 & 17",
      "part": "16_17",
      "question16": {
        "topic": "2 famous writers",
        "audioUrl": "",
        "questions": [
          {
            "id": "16.1",
            "question": "Chọn key theo Topic",
            "options": [
              "They both make references to each other in their work",
              "They only wrote children’s fairy tales",
              "Their works were always immediately understood by the public"
            ]
          },
          {
            "id": "16.2",
            "question": "Chọn key theo Topic",
            "options": [
              "The meaning of their work is not always easily identified",
              "They lived in completely different centuries and never overlapped in time",
              "They focused exclusively on political speeches rather than literature"
            ]
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "Work from home",
        "audioUrl": "",
        "questions": [
          {
            "id": "17.1",
            "question": "Chọn key theo Topic",
            "options": [
              "It wasn’t as good as she had expected",
              "It always guarantees higher productivity for everyone",
              "It completely eliminates the need for teamwork"
            ]
          },
          {
            "id": "17.2",
            "question": "Chọn key theo Topic",
            "options": [
              "It depends on your situation and personality",
              "It is universally preferred over working in an office",
              "It makes communication with colleagues unnecessary"
            ]
          }
        ],
        "transcript": ""
      }
    },
    {
      "title": "LISTENING ĐỀ 10 - Question 16 & 17",
      "part": "16_17",
      "question16": {
        "topic": "Managing financial spending",
        "audioUrl": "",
        "questions": [
          {
            "id": "16.1",
            "question": "Chọn key theo Topic",
            "options": [
              "Monitor your spending for a weekly plan",
              "Spend money without keeping any record",
              "Always ignore professional financial guidance"
            ]
          },
          {
            "id": "16.2",
            "question": "Chọn key theo Topic",
            "options": [
              "Seek advice from someone who has experience",
              "Buy whatever you want without considering your budget",
              "Assume financial planning is unnecessary for young people"
            ]
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "The importance of sleep",
        "audioUrl": "",
        "questions": [
          {
            "id": "17.1",
            "question": "Chọn key theo Topic",
            "options": [
              "Blocking out noise and light is a key",
              "Sleep is unnecessary for maintaining good health",
              "Everyone needs exactly the same number of hours of sleep"
            ]
          },
          {
            "id": "17.2",
            "question": "Chọn key theo Topic",
            "options": [
              "People can’t always recognize the symptoms of tiredness",
              "Sleeping less always makes you more productive",
              "Sleep problems can be solved simply by drinking more coffee"
            ]
          }
        ],
        "transcript": ""
      }
    },
    {
      "title": "LISTENING ĐỀ 09 - Question 16 & 17",
      "part": "16_17",
      "question16": {
        "topic": "Making plans",
        "audioUrl": "",
        "questions": [
          {
            "id": "16.1",
            "question": "Chọn key theo Topic",
            "options": [
              "They help you make decisions",
              "Plans always guarantee success without effort",
              "Making plans means you never face unexpected problems"
            ]
          },
          {
            "id": "16.2",
            "question": "Chọn key theo Topic",
            "options": [
              "It requires you to set yourself certain limits",
              "Plans are only useful for people who dislike creativity",
              "Once you make a plan, you must follow it exactly without any flexibility"
            ]
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "A promotion campaign for a product",
        "audioUrl": "",
        "questions": [
          {
            "id": "17.1",
            "question": "Chọn key theo Topic",
            "options": [
              "It is making exaggerated claims",
              "A promotion campaign never requires any planning or strategy",
              "It guarantees instant success for every product"
            ]
          },
          {
            "id": "17.2",
            "question": "Chọn key theo Topic",
            "options": [
              "It costs too much to make to be profitable",
              "Customers will always believe the campaign without question",
              "It makes the product automatically better in quality"
            ]
          }
        ],
        "transcript": ""
      }
    },
    {
      "title": "LISTENING ĐỀ 08 - Question 16 & 17",
      "part": "16_17",
      "question16": {
        "topic": "Television series",
        "audioUrl": "",
        "questions": [
          {
            "id": "16.1",
            "question": "Chọn key theo Topic",
            "options": [
              "It has the consistent quality throughout",
              "Every television series is produced without any budget limitations",
              "Series never change their storyline once the first episode is made"
            ]
          },
          {
            "id": "16.2",
            "question": "Chọn key theo Topic",
            "options": [
              "Viewer habits influence the way that series are made",
              "All viewers interpret the series in exactly the same way",
              "Television series are created only for educational purposes"
            ]
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "Advertising and sponsoring",
        "audioUrl": "",
        "questions": [
          {
            "id": "17.1",
            "question": "Chọn key theo Topic",
            "options": [
              "It can help reach new customers",
              "Advertising and sponsoring always guarantee success without any risk",
              "Sponsorships never affect the image of the product or the sport"
            ]
          },
          {
            "id": "17.2",
            "question": "Chọn key theo Topic",
            "options": [
              "They can generate negative publicity for the sport",
              "They make customers automatically loyal without further effort",
              "Advertising campaigns are only useful for products that are already popular"
            ]
          }
        ],
        "transcript": ""
      }
    },
    {
      "title": "LISTENING ĐỀ 07 - Question 16 & 17",
      "part": "16_17",
      "question16": {
        "topic": "Professionalism at work",
        "audioUrl": "",
        "questions": [
          {
            "id": "16.1",
            "question": "Chọn key theo Topic",
            "options": [
              "Maintain a positive attitude",
              "Professionalism means ignoring all workplace rules",
              "It requires you to avoid communicating with colleagues"
            ]
          },
          {
            "id": "16.2",
            "question": "Chọn key theo Topic",
            "options": [
              "Change its definition",
              "Being professional means admitting mistakes",
              "Professionalism is important for managers"
            ]
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "A musician’s life",
        "audioUrl": "",
        "questions": [
          {
            "id": "17.1",
            "question": "Chọn key theo Topic",
            "options": [
              "He will probably retire from singing",
              "He had no problems",
              "Every song was a hit"
            ]
          },
          {
            "id": "17.2",
            "question": "Chọn key theo Topic",
            "options": [
              "He could have been more successful",
              "His life was stress‑free",
              "He only sang for friends"
            ]
          }
        ],
        "transcript": ""
      }
    },
    {
      "title": "LISTENING ĐỀ 06 - Question 16 & 17",
      "part": "16_17",
      "question16": {
        "topic": "A book about a life of a scientist",
        "audioUrl": "",
        "questions": [
          {
            "id": "16.1",
            "question": "Chọn key theo Topic",
            "options": [
              "It uses simple language to describe complex ideas",
              "It explains scientific concepts in great detail",
              "The writing style is clear and well organised"
            ]
          },
          {
            "id": "16.2",
            "question": "Chọn key theo Topic",
            "options": [
              "It is similar to the previous book about the scientist",
              "The book offers new perspectives on the scientist",
              "It focuses on a different stage of the scientist’s life"
            ]
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "A break from studying",
        "audioUrl": "",
        "questions": [
          {
            "id": "17.1",
            "question": "Chọn key theo Topic",
            "options": [
              "He wasn’t ready to start higher education",
              "He disliked all forms of learning",
              "Every student must take a break"
            ]
          },
          {
            "id": "17.2",
            "question": "Chọn key theo Topic",
            "options": [
              "To be more independent",
              "A break guarantees better grades without effort",
              "It means avoiding responsibility altogether"
            ]
          }
        ],
        "transcript": ""
      }
    },
    {
      "title": "LISTENING ĐỀ 05 - Question 16 & 17",
      "part": "16_17",
      "question16": {
        "topic": "A new restaurant",
        "audioUrl": "",
        "questions": [
          {
            "id": "16.1",
            "question": "Chọn key theo Topic",
            "options": [
              "Standard of Service wasn’t good",
              "The service was provided quickly",
              "The staff were generally polite"
            ]
          },
          {
            "id": "16.2",
            "question": "Chọn key theo Topic",
            "options": [
              "They need to make the customers feel valued and welcome",
              "They should offer more special discounts",
              "The business needs to improve its facilities"
            ]
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "New novel",
        "audioUrl": "",
        "questions": [
          {
            "id": "17.1",
            "question": "Chọn key theo Topic",
            "options": [
              "They are difficult to relate to",
              "Every reader finds it perfect",
              "It instantly became the most popular book worldwide"
            ]
          },
          {
            "id": "17.2",
            "question": "Chọn key theo Topic",
            "options": [
              "It lacks originality",
              "The novel requires no imagination to enjoy",
              "It improves the quality of all other novels automatically"
            ]
          }
        ],
        "transcript": ""
      }
    },
    {
      "title": "LISTENING ĐỀ 04 - Question 16 & 17",
      "part": "16_17",
      "question16": {
        "topic": "A new guide",
        "audioUrl": "",
        "questions": [
          {
            "id": "16.1",
            "question": "Chọn key theo Topic",
            "options": [
              "It creates a sense of adventure",
              "It allows people to experience new places",
              "It can be exciting for some participants"
            ]
          },
          {
            "id": "16.2",
            "question": "Chọn key theo Topic",
            "options": [
              "It is only suitable for a particular generation",
              "Younger people tend to be more interested in it",
              "It appeals to a wide range of age groups"
            ]
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "Life after university",
        "audioUrl": "",
        "questions": [
          {
            "id": "17.1",
            "question": "Chọn key theo Topic",
            "options": [
              "Be flexible and open minded",
              "Follow clear rules and routines",
              "Plan everything carefully in advance"
            ]
          },
          {
            "id": "17.2",
            "question": "Chọn key theo Topic",
            "options": [
              "They are becoming more competitive",
              "They are facing increasing pressure",
              "They are changing the way they operate"
            ]
          }
        ],
        "transcript": ""
      }
    },
    {
      "title": "LISTENING ĐỀ 02 - Question 16 & 17",
      "part": "16_17",
      "question16": {
        "topic": "CCTV (Security cameras)",
        "audioUrl": "",
        "questions": [
          {
            "id": "16.1",
            "question": "Chọn key theo Topic",
            "options": [
              "Employees probably worry unnecessary",
              "Employees have expressed concerns about recent changes",
              "Some employees are uncertain about the situation"
            ]
          },
          {
            "id": "16.2",
            "question": "Chọn key theo Topic",
            "options": [
              "People should feel reassured",
              "People are waiting for more information",
              "People have mixed feelings about the issue"
            ]
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "Writer’s book",
        "audioUrl": "",
        "questions": [
          {
            "id": "17.1",
            "question": "Chọn key theo Topic",
            "options": [
              "Create dedicated periods",
              "Use time more efficiently",
              "Follow a flexible schedule"
            ]
          },
          {
            "id": "17.2",
            "question": "Chọn key theo Topic",
            "options": [
              "Refusing to seek the advice of other people",
              "Listening carefully to different opinions",
              "Discussing problems with colleagues"
            ]
          }
        ],
        "transcript": ""
      }
    },
    {
      "title": "LISTENING ĐỀ 03 - Question 16 & 17",
      "part": "16_17",
      "question16": {
        "topic": "Script production",
        "audioUrl": "",
        "questions": [
          {
            "id": "16.1",
            "question": "Chọn key theo topic",
            "options": [
              "The characters' background are not adequately explored",
              "The characters play an important role in the story",
              "The characters’ personalities are clearly presented"
            ]
          },
          {
            "id": "16.2",
            "question": "Chọn key theo topic",
            "options": [
              "The new industry demands are negatively influencing script production",
              "The industry is undergoing rapid changes",
              "Script production has increased in recent years"
            ]
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "Plans for the city",
        "audioUrl": "",
        "questions": [
          {
            "id": "17.1",
            "question": "Chọn key theo topic",
            "options": [
              "It doesn't do enough to promote alternatives to driving",
              "The focus is mainly on improving road safety",
              "It encourages people to consider different transport options"
            ]
          },
          {
            "id": "17.2",
            "question": "Chọn key theo topic",
            "options": [
              "The plan is not making efficient use of existing land",
              "The plan involves developing new areas",
              "Land use has been carefully considered in the proposal"
            ]
          }
        ],
        "transcript": ""
      }
    },
    {
      "title": "LISTENING ĐỀ 01 - Question 16 & 17",
      "part": "16_17",
      "question16": {
        "topic": "A research into happiness",
        "audioUrl": "",
        "questions": [
          {
            "id": "16.1",
            "question": "Chọn key theo topic",
            "options": [
              "It has not been accurately reported by the media",
              "The issue has received widespread media coverage",
              "The media has shown increasing interest in the topic"
            ]
          },
          {
            "id": "16.2",
            "question": "Chọn key theo topic",
            "options": [
              "The research is unlikely to find a conclusive answer",
              "The research is expected to provide useful insights",
              "The study may lead to further investigation in the future"
            ]
          }
        ],
        "transcript": ""
      },
      "question17": {
        "topic": "Criticism of the new novel",
        "audioUrl": "",
        "questions": [
          {
            "id": "17.1",
            "question": "Chọn key theo topic",
            "options": [
              "The characters were interesting",
              "The storyline was easy to follow",
              "The characters were described in great detail"
            ]
          },
          {
            "id": "17.2",
            "question": "Chọn key theo topic",
            "options": [
              "It will establish the author's popularity",
              "It may improve the author’s writing skills",
              "It could influence other writers in the same genre"
            ]
          }
        ],
        "transcript": ""
      }
    }
  ]
}
MINI_HIPPO_LESSON_DATA_END */
