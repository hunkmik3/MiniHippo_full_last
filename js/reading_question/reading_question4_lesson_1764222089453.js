// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI PART 4 ///////////////
// ===============================================================================================================

const question4Text_1 = [
    "Here is the perspective of four people on the above topic. Please read the content and answer the question.",
    "ádsadsadsadsadsad",
    "sadsadsadasdasdsa",
    "đâsdsadasdsadasdsadasd",
    "dsadsadsadas",
];

const question4Content_1 = [
    { question: "1", id: "question4_q1", options: ["", "A", "B", "C", "D"], answer: "A" },
    { question: "2", id: "question4_q2", options: ["", "A", "B", "C", "D"], answer: "B" },
    { question: "3", id: "question4_q3", options: ["", "A", "B", "C", "D"], answer: "C" },
    { question: "4", id: "question4_q4", options: ["", "A", "B", "C", "D"], answer: "D" },
    { question: "5", id: "question4_q5", options: ["", "A", "B", "C", "D"], answer: "A" },
    { question: "6", id: "question4_q6", options: ["", "A", "B", "C", "D"], answer: "B" },
    { question: "7", id: "question4_q7", options: ["", "A", "B", "C", "D"], answer: "C" },
];

const correctAnswersQuestion4_1 = ['A', 'B', 'C', 'D', 'A', 'B', 'C'];

const question4Text = [
  question4Text_1,
];

const question4Content = [
  question4Content_1,
];

const correctAnswersQuestion4 = [
  correctAnswersQuestion4_1,
];

const question4Topic1 = {
  topic1: "ádasdasdasdsad",
};

function getQuestHeaders(obj) {
    return Object.values(obj);
}

const question4Topic = getQuestHeaders(question4Topic1);
window.question4Text = question4Text;
window.question4Content = question4Content;

let currentIndex = 0;

function renderQuestion4(index) {
  document.getElementById('question4_index').textContent = "Reading Question 4" + " (" + (index + 1) + "/" + question4Text.length + ")";
  if (!question4Text[index] || !question4Content[index]) {
    console.error('Không tìm thấy dữ liệu cho câu hỏi tại index: ' + index);
    return;
  }
  const container = document.getElementById('question4');
  const row = container.querySelector('.row');
  const leftColumn = row.querySelector('.col-md-7');
  leftColumn.innerHTML = '';
  question4Text[index].forEach((text, textIndex) => {
    const p = document.createElement('p');
    let formattedText = text || '';
    
    // First paragraph (index 0) - introduction, make it bold
    if (textIndex === 0) {
      // If not already wrapped in strong tags, wrap the entire text
      if (!formattedText.includes('<strong>')) {
        formattedText = '<strong>' + formattedText + '</strong>';
      }
    } else {
      // Other paragraphs (A, B, C, D) - add letter prefix and make it bold
      const letters = ['A', 'B', 'C', 'D'];
      const letterIndex = textIndex - 1; // textIndex 1->A, 2->B, 3->C, 4->D
      
      if (letterIndex < letters.length) {
        const letter = letters[letterIndex];
        const letterPrefix = letter + ': ';
        
        // Check if text already starts with the letter (with or without strong tags)
        const hasLetterPrefix = formattedText.trim().toUpperCase().startsWith(letter + ':');
        
        if (hasLetterPrefix) {
          // Text already has letter prefix, just ensure it's bold
          // Remove existing strong tags around letter if any, then add new ones
          formattedText = formattedText.replace(/^\s*<strong>\s*([A-D]):\s*<\/strong>\s*/i, '');
          formattedText = formattedText.replace(/^\s*([A-D]):\s*/i, '');
          formattedText = '<strong>' + letter + ':</strong> ' + formattedText.trim();
        } else {
          // Text doesn't have letter prefix, add it with bold
          formattedText = '<strong>' + letter + ':</strong> ' + formattedText.trim();
        }
      }
    }
    
    p.innerHTML = formattedText;
    leftColumn.appendChild(p);
  });
  const rightColumn = row.querySelector('.col-md-5');
  const form = rightColumn.querySelector('form');
  form.innerHTML = '';
  question4Content[index].forEach(item => {
    const div = document.createElement('div');
    div.classList.add('mb-3', 'row', 'align-items-center');
    const label = document.createElement('label');
    label.setAttribute('for', item.id);
    label.classList.add('col-9', 'col-form-label');
    label.textContent = item.question;
    const selectDiv = document.createElement('div');
    selectDiv.classList.add('col-3');
    const select = document.createElement('select');
    select.id = item.id;
    select.classList.add('form-select', 'select-fixed');
    item.options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.textContent = option;
      select.appendChild(optionElement);
    });
    selectDiv.appendChild(select);
    div.appendChild(label);
    div.appendChild(selectDiv);
    form.appendChild(div);
  });
  const topicElement = document.getElementById('question4_topic');
  topicElement.textContent = 'Topic: ' + question4Topic[index];
  currentIndex = index;
}
// Expose renderQuestion4 to window
window.renderQuestion4 = renderQuestion4;
window.setupNavigationButtons = setupNavigationButtons;

// Check result function
function displayComparisonResultsQuestion4(userAnswers, correctAnswers) {
  const comparisonBody = document.getElementById('comparisonTableBody');
  const totalScoreElement = document.getElementById('totalScore_question4');
  
  // Clear previous results
  comparisonBody.innerHTML = '';
  
  // Calculate score
  let score = 0;
  
  // Loop through questions and display results
  question4Content[currentIndex].forEach((item, index) => {
    const tr = document.createElement('tr');
    
    // Question column
    const questionTd = document.createElement('td');
    questionTd.innerHTML = item.question;
    tr.appendChild(questionTd);
    
    // User answer column
    const userAnswerTd = document.createElement('td');
    const userAnswer = userAnswers[index] || "(không chọn)";
    userAnswerTd.innerHTML = '<span class="' + (userAnswer === correctAnswers[index] ? 'correct' : 'incorrect') + '">' + userAnswer + '</span>';
    tr.appendChild(userAnswerTd);
    
    // Correct answer column
    const correctAnswerTd = document.createElement('td');
    correctAnswerTd.innerHTML = '<span class="correct">' + correctAnswers[index] + '</span>';
    tr.appendChild(correctAnswerTd);
    
    // If correct, add score
    if (userAnswer === correctAnswers[index]) {
      score += 2;
    }
    
    comparisonBody.appendChild(tr);
  });
  
  // Display total score
  if (totalScoreElement) {
    totalScoreElement.textContent = 'Total Score: ' + score + ' / ' + (question4Content[currentIndex].length * 2);
  }
  
  return score;
}

// Check result button event listener
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    const checkResultBtn = document.getElementById('checkResultButton');
    if (checkResultBtn) {
      checkResultBtn.addEventListener('click', function() {
        const answers = [];
        const correctAnswers = [];
        
        // Get user answers
        question4Content[currentIndex].forEach((item, index) => {
          const selectElement = document.getElementById(item.id);
          if (selectElement) {
            const selectedAnswer = selectElement.value || "(không chọn)";
            answers.push(selectedAnswer);
            correctAnswers.push(correctAnswersQuestion4[currentIndex][index]);
          }
        });
        
        // Display results
        displayComparisonResultsQuestion4(answers, correctAnswers);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('resultModal'));
        modal.show();
      });
    }
  });
} else {
  const checkResultBtn = document.getElementById('checkResultButton');
  if (checkResultBtn) {
    checkResultBtn.addEventListener('click', function() {
      const answers = [];
      const correctAnswers = [];
      
      // Get user answers
      question4Content[currentIndex].forEach((item, index) => {
        const selectElement = document.getElementById(item.id);
        if (selectElement) {
          const selectedAnswer = selectElement.value || "(không chọn)";
          answers.push(selectedAnswer);
          correctAnswers.push(correctAnswersQuestion4[currentIndex][index]);
        }
      });
      
      // Display results
      displayComparisonResultsQuestion4(answers, correctAnswers);
      
      // Show modal
      const modal = new bootstrap.Modal(document.getElementById('resultModal'));
      modal.show();
    });
  }
}

// Next and Back button handlers
let navigationButtonsSetup = false;
function setupNavigationButtons() {
  if (navigationButtonsSetup) {
    return; // Already setup
  }
  
  const nextButton = document.getElementById('nextButton');
  const backButton = document.getElementById('backButton');
  
  if (nextButton) {
    nextButton.addEventListener('click', function() {
      if (backButton) backButton.textContent = "Back";
      if (currentIndex < question4Text.length - 1) {
        currentIndex++;
        renderQuestion4(currentIndex);
        // Update header with current index
        const headerEl = document.getElementById('question4_index');
        if (headerEl) headerEl.textContent = 'Reading Question 4 (' + (currentIndex + 1) + '/' + question4Text.length + ')';
      } else {
        // If at last question, change button text
        nextButton.textContent = "The end";
      }
    });
  }
  
  if (backButton) {
    backButton.addEventListener('click', function() {
      if (currentIndex > 0) {
        currentIndex--;
        renderQuestion4(currentIndex);
        if (nextButton) nextButton.textContent = "Next";
        // Update header with current index
        const headerEl = document.getElementById('question4_index');
        if (headerEl) headerEl.textContent = 'Reading Question 4 (' + (currentIndex + 1) + '/' + question4Text.length + ')';
      } else {
        // If at first question, change button text
        backButton.textContent = "No Previous Question";
      }
    });
  }
  
  navigationButtonsSetup = true;
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    renderQuestion4(0);
    setupNavigationButtons();
  });
} else {
  renderQuestion4(0);
  setupNavigationButtons();
}


/* MINI_HIPPO_LESSON_DATA_START
{
  "version": 1,
  "lessonType": "reading",
  "part": "4",
  "sets": [
    {
      "id": 1,
      "title": "ádasda",
      "data": {
        "part": 4,
        "title": "ádasda",
        "topic": "ádasdasdasdsad",
        "texts": [
          "Here is the perspective of four people on the above topic. Please read the content and answer the question.",
          "ádsadsadsadsadsad",
          "sadsadsadasdasdsa",
          "đâsdsadasdsadasdsadasd",
          "dsadsadsadas"
        ],
        "questions": [
          {
            "question": "1",
            "options": [
              "",
              "A",
              "B",
              "C",
              "D"
            ],
            "correctAnswer": "A"
          },
          {
            "question": "2",
            "options": [
              "",
              "A",
              "B",
              "C",
              "D"
            ],
            "correctAnswer": "B"
          },
          {
            "question": "3",
            "options": [
              "",
              "A",
              "B",
              "C",
              "D"
            ],
            "correctAnswer": "C"
          },
          {
            "question": "4",
            "options": [
              "",
              "A",
              "B",
              "C",
              "D"
            ],
            "correctAnswer": "D"
          },
          {
            "question": "5",
            "options": [
              "",
              "A",
              "B",
              "C",
              "D"
            ],
            "correctAnswer": "A"
          },
          {
            "question": "6",
            "options": [
              "",
              "A",
              "B",
              "C",
              "D"
            ],
            "correctAnswer": "B"
          },
          {
            "question": "7",
            "options": [
              "",
              "A",
              "B",
              "C",
              "D"
            ],
            "correctAnswer": "C"
          }
        ]
      }
    }
  ]
}
MINI_HIPPO_LESSON_DATA_END */
