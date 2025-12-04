// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI PART 4 ///////////////
// ===============================================================================================================

const question4Text_1 = [
    "",
    "A: For me, the most important thing about extreme sports is being well-prepared. Many people think it’s all about excitement and courage, but I don’t see it that way. Without proper training, it’s easy to get hurt or even put others at risk. I once took a rock-climbing course and spent weeks learning how to use the equipment correctly. After that, the actual climb was much more enjoyable because I felt confident. I believe training not only keeps you safe but also makes the experience more relaxed and rewarding.",
    "B: I’ve always preferred traditional sports like swimming and running because they help me stay healthy without being too risky. Still, I was curious about how extreme sports might feel, so I tried bungee jumping during a holiday last year. At first, I was really nervous, but once I jumped, the feeling was incredible. It was a kind of thrill I had never felt before. Even so, I still swim every week because it’s safer and more practical, though I admit extreme sports can be exciting to try at least once.",
    "C: Honestly, I don’t really understand why people enjoy extreme sports. They seem dangerous and unnecessary to me. I’ve never tried one, and I don’t intend to. Some friends have invited me to go snowboarding or paragliding, but I always refuse. It’s not that I dislike sports—I actually enjoy cycling and tennis—but I just don’t see any reason to risk my health for a few seconds of excitement. In my opinion, extreme sports aren’t essential for happiness, so I stay away from them whenever I can.",
    "D: What I love most about extreme sports is that they often take place in beautiful natural settings. Last summer, I went kayaking on a wild river, and the scenery was breathtaking. I also tried mountain biking through the forest and loved the feeling of fresh air and freedom. For me, it’s not just about the sport itself but also about being surrounded by mountains, trees, and rivers. I sometimes wish I had more time and money to do these activities more often. Extreme sports give me energy and make me feel close to nature.",
];

const question4Content_1 = [
    { question: "preparation is necessary before doing extreme sports", id: "question4_q1", options: ["", "A", "B", "C", "D"], answer: "A" },
    { question: "once tried an extreme sport and enjoyed it", id: "question4_q2", options: ["", "A", "B", "C", "D"], answer: "B" },
    { question: "usually does ordinary sports", id: "question4_q3", options: ["", "A", "B", "C", "D"], answer: "B" },
    { question: "believes extreme sports are not important", id: "question4_q4", options: ["", "A", "B", "C", "D"], answer: "C" },
    { question: "always avoids extreme sports", id: "question4_q5", options: ["", "A", "B", "C", "D"], answer: "C" },
    { question: "enjoys being outdoors when doing extreme sports", id: "question4_q6", options: ["", "A", "B", "C", "D"], answer: "D" },
    { question: "wishes to do more extreme sports in the future", id: "question4_q7", options: ["", "A", "B", "C", "D"], answer: "D" },
];

const correctAnswersQuestion4_1 = ['A', 'B', 'B', 'C', 'C', 'D', 'D'];

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
  topic1: "Part 3: Extreme sports (2)",
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
      "title": "Part 3 - đề 25",
      "data": {
        "part": 4,
        "title": "Part 3 - đề 25",
        "topic": "Part 3: Extreme sports (2)",
        "texts": [
          "",
          "A: For me, the most important thing about extreme sports is being well-prepared. Many people think it’s all about excitement and courage, but I don’t see it that way. Without proper training, it’s easy to get hurt or even put others at risk. I once took a rock-climbing course and spent weeks learning how to use the equipment correctly. After that, the actual climb was much more enjoyable because I felt confident. I believe training not only keeps you safe but also makes the experience more relaxed and rewarding.",
          "B: I’ve always preferred traditional sports like swimming and running because they help me stay healthy without being too risky. Still, I was curious about how extreme sports might feel, so I tried bungee jumping during a holiday last year. At first, I was really nervous, but once I jumped, the feeling was incredible. It was a kind of thrill I had never felt before. Even so, I still swim every week because it’s safer and more practical, though I admit extreme sports can be exciting to try at least once.",
          "C: Honestly, I don’t really understand why people enjoy extreme sports. They seem dangerous and unnecessary to me. I’ve never tried one, and I don’t intend to. Some friends have invited me to go snowboarding or paragliding, but I always refuse. It’s not that I dislike sports—I actually enjoy cycling and tennis—but I just don’t see any reason to risk my health for a few seconds of excitement. In my opinion, extreme sports aren’t essential for happiness, so I stay away from them whenever I can.",
          "D: What I love most about extreme sports is that they often take place in beautiful natural settings. Last summer, I went kayaking on a wild river, and the scenery was breathtaking. I also tried mountain biking through the forest and loved the feeling of fresh air and freedom. For me, it’s not just about the sport itself but also about being surrounded by mountains, trees, and rivers. I sometimes wish I had more time and money to do these activities more often. Extreme sports give me energy and make me feel close to nature."
        ],
        "questions": [
          {
            "question": "preparation is necessary before doing extreme sports",
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
            "question": "once tried an extreme sport and enjoyed it",
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
            "question": "usually does ordinary sports",
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
            "question": "believes extreme sports are not important",
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
            "question": "always avoids extreme sports",
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
            "question": "enjoys being outdoors when doing extreme sports",
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
            "question": "wishes to do more extreme sports in the future",
            "options": [
              "",
              "A",
              "B",
              "C",
              "D"
            ],
            "correctAnswer": "D"
          }
        ]
      }
    }
  ]
}
MINI_HIPPO_LESSON_DATA_END */
