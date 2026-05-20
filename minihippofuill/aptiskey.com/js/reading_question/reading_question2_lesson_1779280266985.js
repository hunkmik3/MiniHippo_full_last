// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI PART 2 & 3 ///////////////
// ===============================================================================================================

// UPDATE - Topic: Movies then and now
const question2Content_1 = [
    'Movies today are very different from movies in the past.',
    'In the old days, films were only in black and white, and sometimes even without sound.',
    'In addition to these technological limits, producers had very low budgets.',
    'Because of the lack of money, actors also earn little money from acting.',
    'Nowadays, everything has changed: actors and producers can earn a lot of money from producing films.',
];

// UPDATE - Topic: Eating at restaurant
const question2Content_2 = [
    'I decided to try a new café located at the end of the street.',
    'The place was quite busy, with a lively atmosphere.',
    'Even so, a staff member quickly noticed me and brought over the menu.',
    'I was a bit surprised to see that there were only a few items to choose from.',
    'In the end, I went for the most expensive salad on the menu.',
];

// UPDATE - Topic: Artificial Intelligence (2)
const question2Content_3 = [
    'Over the past decade, artificial intelligence has reshaped industries around the world.',
    'Early AI systems were capable of handling only simple pattern recognition tasks.',
    'In the past, high computational costs slowed down the progress of AI development.',
    'Today, AI engineers design sophisticated models for applications such as language translation.',
    'Modern AI tools enable businesses to analyze vast amounts of data and make smarter decisions.',
];

// UPDATE - Topic: Wellness Fair
const question2Content_4 = [
    'The wellness fair took place on Saturday afternoon, encouraging people to adopt healthier lifestyles.',
    'More than 60 (con số bất kỳ) participants joined the event, with Dr. A (tên người) leading an engaging fitness workshop',
    'The fair also included activities like cooking demonstrations, mindfulness sessions, and a fun run.',
    'After the workshops, prizes were awarded to participants who created the most creative health posters.',
    'Families enjoyed tasting healthy snacks and discovering practical tips for better overall wellness.',
];

const questionSets = [
    question2Content_1,
    question2Content_2,
    question2Content_3,
    question2Content_4,
];

window.questionSets = questionSets;

const questheader1 = {
    question2Content_1: "Movies then and now",
    question2Content_2: "Eating at restaurant",
    question2Content_3: "Artificial Intelligence (2)",
    question2Content_4: "Wellness Fair",
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
  if (!cardsContainer) {
    console.error('cardsContainer not found');
    return;
  }
  // Check if Sortable is available
  if (typeof Sortable === 'undefined') {
    console.error('SortableJS is not loaded. Please ensure sortablejs library is included.');
    // Try to wait a bit and retry
    setTimeout(function() {
      if (typeof Sortable !== 'undefined') {
        initSortable();
      } else {
        console.error('SortableJS still not available after retry');
      }
    }, 500);
    return;
  }
  // Destroy existing Sortable instance if any
  if (cardsContainer.sortableInstance) {
    cardsContainer.sortableInstance.destroy();
    cardsContainer.sortableInstance = null;
  }
  // Create new Sortable instance
  // Only allow dragging items with class 'draggable-item' (excludes first item)
  try {
    const sortable = new Sortable(cardsContainer, {
      animation: 150,
      draggable: '.draggable-item',
      filter: function(evt, item) {
        // Prevent dragging first child (which doesn't have draggable-item class)
        return item === cardsContainer.firstElementChild;
      },
      preventOnFilter: true,
      forceFallback: false,
      swapThreshold: 0.65,
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen'
    });
    // Store instance for later cleanup
    cardsContainer.sortableInstance = sortable;
    console.log('Sortable initialized successfully');
  } catch (error) {
    console.error('Error initializing Sortable:', error);
  }
}

function renderQuestion2(questionlist) {
  correctAnswersQuestion2 = [];
  questionlist.forEach(item => { correctAnswersQuestion2.push(item); });
  // Keep first sentence fixed at index 0, shuffle the rest
  const firstSentence = questionlist[0];
  const restSentences = questionlist.slice(1);
  const shuffledRest = shuffleQuestions([...restSentences]);
  const shuffledQuestionlist = [firstSentence, ...shuffledRest];
  const cardsContainer = document.getElementById('cardsContainer');
  if (cardsContainer) {
    cardsContainer.innerHTML = '';
    shuffledQuestionlist.forEach((text, index) => {
      const cardDiv = document.createElement('div');
      if (index === 0) {
        // First sentence: fixed, not draggable, with checkmark and highlight
        cardDiv.classList.add('card', 'mb-2');
        cardDiv.style.backgroundColor = '#e3f2fd';
        cardDiv.style.border = '2px solid #1976d2';
        cardDiv.style.cursor = 'default';
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'd-flex', 'align-items-center');
        const checkIcon = document.createElement('i');
        checkIcon.classList.add('bi', 'bi-check-circle-fill', 'text-success', 'me-2');
        checkIcon.style.fontSize = '1.2rem';
        cardBody.appendChild(checkIcon);
        const textSpan = document.createElement('span');
        textSpan.innerText = text;
        cardBody.appendChild(textSpan);
        cardDiv.appendChild(cardBody);
      } else {
        // Other sentences: draggable
        cardDiv.classList.add('card', 'mb-2', 'draggable-item');
        // Don't set draggable attribute - SortableJS handles dragging
        cardDiv.id = 'item' + (index + 1);
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'd-flex', 'align-items-center');
        const dragIcon = document.createElement('i');
        dragIcon.classList.add('bi', 'bi-grip-vertical', 'me-2', 'text-muted');
        dragIcon.style.fontSize = '1.2rem';
        cardBody.appendChild(dragIcon);
        const textSpan = document.createElement('span');
        textSpan.innerText = text;
        cardBody.appendChild(textSpan);
        cardDiv.appendChild(cardBody);
      }
      cardsContainer.appendChild(cardDiv);
    });
    // Initialize Sortable after a short delay to ensure DOM is ready and SortableJS is loaded
    setTimeout(function() {
      initSortable();
    }, 200);
  }
  const headerEl = document.getElementById('html_questheader');
  if (headerEl) headerEl.textContent = 'Reading Question 2 & 3 ( ' + (currentSetIndex + 1) + ' / ' + questheader.length + ' )';
  const topicEl = document.getElementById('question2_topic');
  if (topicEl) topicEl.textContent = 'Topic: ' + questheader[currentSetIndex];
}
// Expose renderQuestion2 to window
window.renderQuestion2 = renderQuestion2;

// User answers array
const userAnswersQuestion2 = [];
let question2Score = 0;

// Check result button handler
document.getElementById('checkResultButton').addEventListener('click', function() {
  userAnswersQuestion2.length = 0;
  const cardsContainer = document.getElementById('cardsContainer');
  // Get all cards including the first one (which is not draggable)
  const cards = cardsContainer.querySelectorAll('.card');
  cards.forEach((card) => {
    // Get text content, removing icon text if present
    const cardBody = card.querySelector('.card-body');
    if (cardBody) {
      const textSpan = cardBody.querySelector('span');
      const selectedAnswer = textSpan ? textSpan.textContent.trim() : cardBody.textContent.trim().replace(/^[✓\s]*/, '').trim();
      userAnswersQuestion2.push(selectedAnswer || "(không chọn)");
    } else {
      const selectedAnswer = card.textContent.trim() || "(không chọn)";
      userAnswersQuestion2.push(selectedAnswer);
    }
  });
  const answers = [];
  const correctAnswers = [];
  correctAnswersQuestion2.forEach((correctAnswer, index) => {
    const selectedAnswer = userAnswersQuestion2[index] || "(không chọn)";
    answers.push(selectedAnswer);
    correctAnswers.push(correctAnswer);
  });
  question2Score = displayComparisonResultsQuestion2(answers, correctAnswers);
  const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
  resultModal.show();
});

// Display comparison results function
function displayComparisonResultsQuestion2(userAnswers, correctAnswers) {
  const comparisonBody = document.getElementById('comparisonTableBody');
  const totalScoreElement = document.getElementById('totalScore');
  comparisonBody.innerHTML = '';
  let score = 0;
  userAnswers.forEach((userAnswer, index) => {
    const tr = document.createElement('tr');
    const userAnswerTd = document.createElement('td');
    userAnswerTd.innerHTML = '<span class="' + (userAnswer === correctAnswers[index] ? 'correct' : 'incorrect') + '">' + userAnswer + '</span>';
    tr.appendChild(userAnswerTd);
    const correctAnswerTd = document.createElement('td');
    correctAnswerTd.innerHTML = '<span class="correct">' + correctAnswers[index] + '</span>';
    tr.appendChild(correctAnswerTd);
    if (userAnswer === correctAnswers[index]) score++;
    comparisonBody.appendChild(tr);
  });
  totalScoreElement.innerHTML = '<strong>Your score: ' + score + ' / ' + correctAnswers.length + '</strong>';
  return score;
}

// Next button handler
document.getElementById('nextButton').addEventListener('click', function() {
  const nextBtn = document.getElementById('nextButton');
  if (currentSetIndex < questionSets.length - 1) {
    currentSetIndex++;
    renderQuestion2(questionSets[currentSetIndex]);
    if (currentSetIndex === questionSets.length - 1 && nextBtn) {
      nextBtn.textContent = "The end";
    }
  } else if (nextBtn && nextBtn.textContent === 'The end') {
    // Khi đã xong toàn bộ bộ đề upload (Reading Question 2 & 3) -> quay về trang chọn bài Reading
    window.location.href = 'reading_question.html';
  }
});

// Back button handler
document.getElementById('backButton').addEventListener('click', function() {
  if (currentSetIndex > 0) {
    currentSetIndex--;
    renderQuestion2(questionSets[currentSetIndex]);
    if (currentSetIndex !== questionSets.length - 1) {
      document.getElementById('nextButton').textContent = "Next";
    }
  }
});

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
      "title": "UPDATE",
      "data": {
        "topic": "Movies then and now",
        "sentences": [
          "Movies today are very different from movies in the past.",
          "In the old days, films were only in black and white, and sometimes even without sound.",
          "In addition to these technological limits, producers had very low budgets.",
          "Because of the lack of money, actors also earn little money from acting.",
          "Nowadays, everything has changed: actors and producers can earn a lot of money from producing films."
        ]
      }
    },
    {
      "id": 2,
      "title": "UPDATE",
      "data": {
        "topic": "Eating at restaurant",
        "sentences": [
          "I decided to try a new café located at the end of the street.",
          "The place was quite busy, with a lively atmosphere.",
          "Even so, a staff member quickly noticed me and brought over the menu.",
          "I was a bit surprised to see that there were only a few items to choose from.",
          "In the end, I went for the most expensive salad on the menu."
        ]
      }
    },
    {
      "id": 3,
      "title": "UPDATE",
      "data": {
        "topic": "Artificial Intelligence (2)",
        "sentences": [
          "Over the past decade, artificial intelligence has reshaped industries around the world.",
          "Early AI systems were capable of handling only simple pattern recognition tasks.",
          "In the past, high computational costs slowed down the progress of AI development.",
          "Today, AI engineers design sophisticated models for applications such as language translation.",
          "Modern AI tools enable businesses to analyze vast amounts of data and make smarter decisions."
        ]
      }
    },
    {
      "id": 4,
      "title": "UPDATE",
      "data": {
        "topic": "Wellness Fair",
        "sentences": [
          "The wellness fair took place on Saturday afternoon, encouraging people to adopt healthier lifestyles.",
          "More than 60 (con số bất kỳ) participants joined the event, with Dr. A (tên người) leading an engaging fitness workshop",
          "The fair also included activities like cooking demonstrations, mindfulness sessions, and a fun run.",
          "After the workshops, prizes were awarded to participants who created the most creative health posters.",
          "Families enjoyed tasting healthy snacks and discovering practical tips for better overall wellness."
        ]
      }
    }
  ]
}
MINI_HIPPO_LESSON_DATA_END */
