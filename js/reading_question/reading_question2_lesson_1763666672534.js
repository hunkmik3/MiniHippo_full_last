// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI PART 2 & 3 ///////////////
// ===============================================================================================================

// sadsadas - Topic: đâsd
const question2Content_1 = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
];

const questionSets = [
    question2Content_1,
];

window.questionSets = questionSets;

const questheader1 = {
    question2Content_1: "đâsd",
};

function getQuestHeaders(obj) {
    return Object.values(obj);
}

const questheader = getQuestHeaders(questheader1);
window.questionSets = questionSets;
window.questheader = questheader;

let currentSetIndex = 0;
let correctAnswersQuestion2 = [];

function shuffleQuestions(questions) {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
  return questions;
}

function initSortable() {
  const cardsContainer = document.getElementById('cardsContainer');
  if (cardsContainer && typeof Sortable !== 'undefined') {
    new Sortable(cardsContainer, { group: 'shared', animation: 150 });
  }
}

function renderQuestion2(questionlist) {
  correctAnswersQuestion2 = [];
  questionlist.forEach(item => { correctAnswersQuestion2.push(item); });
  let shuffledQuestionlist = shuffleQuestions([...questionlist]);
  const cardsContainer = document.getElementById('cardsContainer');
  if (cardsContainer) {
    cardsContainer.innerHTML = '';
    shuffledQuestionlist.forEach((text, index) => {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('card', 'mb-2', 'draggable-item');
      cardDiv.setAttribute('draggable', 'true');
      cardDiv.id = 'item' + (index + 1);
      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');
      cardBody.innerText = text;
      cardDiv.appendChild(cardBody);
      cardsContainer.appendChild(cardDiv);
    });
    initSortable();
  }
  const headerEl = document.getElementById('html_questheader');
  if (headerEl) headerEl.textContent = 'Reading Question 2 & 3 ( ' + (currentSetIndex + 1) + ' / ' + questheader.length + ' )';
  const topicEl = document.getElementById('question2_topic');
  if (topicEl) topicEl.textContent = 'Topic: ' + questheader[currentSetIndex];
}
// Expose renderQuestion2 to window
window.renderQuestion2 = renderQuestion2;

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    if (questionSets && questionSets.length > 0) renderQuestion2(questionSets[0]);
  });
} else {
  if (questionSets && questionSets.length > 0) renderQuestion2(questionSets[0]);
}


/* MINI_HIPPO_LESSON_DATA_START
{
  "version": 1,
  "lessonType": "reading",
  "part": "2",
  "sets": [
    {
      "id": 1,
      "title": "sadsadas",
      "data": {
        "topic": "đâsd",
        "sentences": [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6"
        ]
      }
    }
  ]
}
MINI_HIPPO_LESSON_DATA_END */
