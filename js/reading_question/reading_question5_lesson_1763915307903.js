// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI PART 5 ///////////////
// ===============================================================================================================

const options_1 = [
    '',
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
];

const paragraph_question5_1 = [
    'vThe term \"mountain\" has evolved over time, reflecting not only physical characteristics but also cultural significance. In contemporary discussions, mountains may symbolize challenges to overcome or destinations for adventure, transcending their geographical attributes.',
    'vThe term \"mountain\" has evolved over time, reflecting not only physical characteristics but also cultural significance. In contemporary discussions, mountains may symbolize challenges to overcome or destinations for adventure, transcending their geographical attributes.',
    'vThe term \"mountain\" has evolved over time, reflecting not only physical characteristics but also cultural significance. In contemporary discussions, mountains may symbolize challenges to overcome or destinations for adventure, transcending their geographical attributes.',
    'vThe term \"mountain\" has evolved over time, reflecting not only physical characteristics but also cultural significance. In contemporary discussions, mountains may symbolize challenges to overcome or destinations for adventure, transcending their geographical attributes.',
    'vThe term \"mountain\" has evolved over time, reflecting not only physical characteristics but also cultural significance. In contemporary discussions, mountains may symbolize challenges to overcome or destinations for adventure, transcending their geographical attributes.',
    'vThe term \"mountain\" has evolved over time, reflecting not only physical characteristics but also cultural significance. In contemporary discussions, mountains may symbolize challenges to overcome or destinations for adventure, transcending their geographical attributes.',
    'vThe term \"mountain\" has evolved over time, reflecting not only physical characteristics but also cultural significance. In contemporary discussions, mountains may symbolize challenges to overcome or destinations for adventure, transcending their geographical attributes.',
];

const question5_keyword_1 = 'vThe term \"mountain\" has evolved over time, reflecting not only physical characteristics but also cultural significance. In contemporary discussions, mountains may symbolize challenges to overcome or destinations for adventure, transcending their geographical attributes.';
const question5_meo_1 = "vThe term \"mountain\" has evolved over time, reflecting not only physical characteristics but also cultural significance. In contemporary discussions, mountains may symbolize challenges to overcome or destinations for adventure, transcending their geographical attributes.";

const options = [
    options_1,
];

const paragraph_question5 = [
  paragraph_question5_1,
];

const meohoc = [
  [question5_keyword_1, question5_meo_1],
];

const topic_name = {
    topic_1: "12321312",
};

const dodai = options.length;
window.options = options;
window.paragraph_question5 = paragraph_question5;
window.meohoc = meohoc;
window.topic_name = topic_name;

let currentQuestion = 0;
let questions5 = [];

function shuffleArray(array) {
  const firstElement = array[0]; // Lưu phần tử đầu tiên (rỗng)
  // Tách phần tử đầu tiên và xáo trộn phần còn lại của mảng
  const remainingElements = array.slice(1);
  // Xáo trộn phần còn lại của mảng
  for (let i = remainingElements.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [remainingElements[i], remainingElements[j]] = [remainingElements[j], remainingElements[i]];
  }
  // Thêm lại phần tử đầu tiên vào đầu mảng đã xáo trộn
  remainingElements.unshift(firstElement);
  return remainingElements;
}

function renderQuestion5(options, paragraph_question5, meohoc) {
  const container = document.getElementById('question5-container');
  if (!container) { console.error("Container không tồn tại!"); return; }
  const topicEl = document.getElementById("question5_topic");
  if (topicEl) topicEl.innerText = "TOPIC: " + topic_name["topic_" + (currentQuestion + 1)];
  const indexEl = document.getElementById('question5_index');
  if (indexEl) indexEl.textContent = 'Reading question 5 (' + (currentQuestion + 1) + '/' + dodai + ')';
  // Shuffle options (shuffleArray already keeps first empty option at beginning)
  const shuffledOptions = shuffleArray([...options]);
  questions5 = [
    { id: 'question5_q1', label: '1.', paragraph: paragraph_question5[0], correctAnswer: options[1] },
    { id: 'question5_q2', label: '2.', paragraph: paragraph_question5[1], correctAnswer: options[2] },
    { id: 'question5_q3', label: '3.', paragraph: paragraph_question5[2], correctAnswer: options[3] },
    { id: 'question5_q4', label: '4.', paragraph: paragraph_question5[3], correctAnswer: options[4] },
    { id: 'question5_q5', label: '5.', paragraph: paragraph_question5[4], correctAnswer: options[5] },
    { id: 'question5_q6', label: '6.', paragraph: paragraph_question5[5], correctAnswer: options[6] },
    { id: 'question5_q7', label: '7.', paragraph: paragraph_question5[6], correctAnswer: options[7] },
  ];
  container.innerHTML = '';
  questions5.forEach(question => {
    // Tạo div cho mỗi câu hỏi
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('mb-3');
    
    // Tạo một div cha để hiển thị label và select trên cùng một hàng
    const questionRow = document.createElement('div');
    questionRow.style.display = 'flex';
    questionRow.style.alignItems = 'center';
    
    // Tạo label cho câu hỏi
    const label = document.createElement('label');
    label.setAttribute('for', question.id);
    label.classList.add('form-label');
    label.textContent = question.label;
    label.style.marginRight = '10px';
    label.style.marginBottom = '0';
    
    // Tạo phần tử select cho câu hỏi
    const select = document.createElement('select');
    select.classList.add('form-select');
    select.id = question.id;
    shuffledOptions.forEach((optionValue, optIndex) => {
      const option = document.createElement('option');
      option.value = optionValue;
      if (optionValue === '' || optionValue === null || optionValue === undefined) {
        option.textContent = '-- Chọn --';
        option.selected = true; // Select empty option by default
      } else {
        option.textContent = optionValue;
      }
      select.appendChild(option);
    });
    
    questionRow.appendChild(label);
    questionRow.appendChild(select);
    
    // Tạo paragraph để hiển thị nội dung (ẩn mặc định)
    const paragraph = document.createElement('p');
    paragraph.classList.add('mt-2');
    paragraph.id = 'paragraph' + question.id.slice(10);
    paragraph.style.display = 'none';
    paragraph.textContent = question.paragraph;
    
    questionDiv.appendChild(questionRow);
    questionDiv.appendChild(paragraph);
    container.appendChild(questionDiv);
  });
}
// Expose renderQuestion5 to window
window.renderQuestion5 = renderQuestion5;

// Setup button handlers
let buttonsSetup = false;
function setupPart5Buttons() {
  if (buttonsSetup) {
    console.log('Buttons already setup, skipping...');
    return;
  }
  console.log('Setting up Part 5 buttons...');
  // Show/Hide paragraphs button
  const showParagraphBtn = document.getElementById('showParagraphButton');
  if (showParagraphBtn) {
    showParagraphBtn.addEventListener('click', function() {
      const paragraphs = document.querySelectorAll('#question5-container p.mt-2');
      if (paragraphs.length === 0) {
        console.warn('No paragraphs found in question5-container');
        return;
      }
      
      // Check current state - if first paragraph is visible, hide all; otherwise show all
      const firstParagraph = paragraphs[0];
      const isCurrentlyVisible = firstParagraph && (firstParagraph.style.display !== 'none' && window.getComputedStyle(firstParagraph).display !== 'none');
      
      // Toggle visibility
      paragraphs.forEach(paragraph => {
        paragraph.style.display = isCurrentlyVisible ? 'none' : 'block';
      });
      
      // Update button text
      showParagraphBtn.textContent = isCurrentlyVisible ? 'Xem nội dung' : 'Ẩn nội dung';
      console.log('Paragraphs toggled, isVisible:', isCurrentlyVisible, 'paragraphs count:', paragraphs.length);
    });
  } else {
    console.warn('showParagraphButton not found');
  }
  
  // Show tips button
  const showAnswerBtn = document.getElementById('showAnswerButton');
  if (showAnswerBtn) {
    showAnswerBtn.addEventListener('click', function() {
      const modalBody = document.getElementById('modal-body');
      if (modalBody) {
        modalBody.innerHTML = '';
        const p1 = document.createElement('p');
        p1.innerHTML = '<strong>Học mẹo nếu bạn cần học gấp:</strong>';
        modalBody.appendChild(p1);
        const p2 = document.createElement('p');
        p2.innerHTML = meohoc[currentQuestion][0] || '';
        modalBody.appendChild(p2);
        const p3 = document.createElement('p');
        p3.innerHTML = meohoc[currentQuestion][1] || '';
        modalBody.appendChild(p3);
        const modalElement = document.getElementById('answerModal');
        if (modalElement) {
          // Remove any existing backdrop first
          const existingBackdrop = document.querySelector('.modal-backdrop');
          if (existingBackdrop) {
            existingBackdrop.remove();
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
          }
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
          // Clean up backdrop when modal is hidden
          modalElement.addEventListener('hidden.bs.modal', function() {
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
              backdrop.remove();
            }
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
          }, { once: true });
        }
      }
    });
  }
  
  // Check result button
  const checkResultBtn = document.getElementById('checkResultButton');
  if (checkResultBtn) {
    checkResultBtn.addEventListener('click', function() {
      const answers = [];
      const correctAnswers = [];
      questions5.forEach((question, index) => {
        const selectElement = document.getElementById(question.id);
        if (selectElement) {
          const selectedAnswer = selectElement.value || "(không chọn)";
          answers.push(selectedAnswer);
          correctAnswers.push(question.correctAnswer);
        }
      });
      
      // Display results
      const comparisonBody = document.getElementById('comparisonTableBody');
      const totalScoreEl = document.getElementById('totalScore_question4');
      if (comparisonBody) {
        comparisonBody.innerHTML = '';
        let score = 0;
        questions5.forEach((question, index) => {
          const tr = document.createElement('tr');
          const questionTd = document.createElement('td');
          questionTd.textContent = (index + 1) + '. ' + question.paragraph.substring(0, 50) + '...';
          tr.appendChild(questionTd);
          const userAnswerTd = document.createElement('td');
          const userAnswer = answers[index] || "(không chọn)";
          userAnswerTd.innerHTML = '<span class="' + (userAnswer === correctAnswers[index] ? 'correct' : 'incorrect') + '">' + userAnswer + '</span>';
          tr.appendChild(userAnswerTd);
          const correctAnswerTd = document.createElement('td');
          correctAnswerTd.innerHTML = '<span class="correct">' + correctAnswers[index] + '</span>';
          tr.appendChild(correctAnswerTd);
          if (userAnswer === correctAnswers[index]) score += 2;
          comparisonBody.appendChild(tr);
        });
        if (totalScoreEl) {
          totalScoreEl.textContent = 'Total Score: ' + score + ' / ' + (questions5.length * 2);
        }
        const resultModalElement = document.getElementById('resultModal');
        if (resultModalElement) {
          // Remove any existing backdrop first
          const existingBackdrop = document.querySelector('.modal-backdrop');
          if (existingBackdrop) {
            existingBackdrop.remove();
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
          }
          const modal = new bootstrap.Modal(resultModalElement);
          modal.show();
          // Clean up backdrop when modal is hidden
          resultModalElement.addEventListener('hidden.bs.modal', function() {
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
              backdrop.remove();
            }
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
          }, { once: true });
        }
      }
    });
  }
  
  // Next button
  const nextButton = document.getElementById('nextButton');
  if (nextButton) {
    nextButton.addEventListener('click', function() {
      if (currentQuestion < options.length - 1) {
        currentQuestion++;
        const container = document.getElementById('question5-container');
        if (container) container.innerHTML = '';
        renderQuestion5(options[currentQuestion], paragraph_question5[currentQuestion], meohoc[currentQuestion] || ['', '']);
        const backButton = document.getElementById('backButton');
        if (backButton) backButton.textContent = 'Back';
      } else {
        nextButton.textContent = 'The end';
      }
    });
  }
  
  // Back button
  const backButton = document.getElementById('backButton');
  if (backButton) {
    backButton.addEventListener('click', function() {
      if (currentQuestion > 0) {
        currentQuestion--;
        const container = document.getElementById('question5-container');
        if (container) container.innerHTML = '';
        renderQuestion5(options[currentQuestion], paragraph_question5[currentQuestion], meohoc[currentQuestion] || ['', '']);
        const nextButton = document.getElementById('nextButton');
        if (nextButton) nextButton.textContent = 'Next';
      }
    });
  }
  
  buttonsSetup = true;
  console.log('Part 5 buttons setup completed');
}

// Expose setupPart5Buttons to window
window.setupPart5Buttons = setupPart5Buttons;

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    if (options && options.length > 0 && paragraph_question5 && paragraph_question5.length > 0 && meohoc && meohoc.length > 0) {
      renderQuestion5(options[0], paragraph_question5[0], meohoc[0] || ['', '']);
      setupPart5Buttons();
    }
  });
} else {
  if (options && options.length > 0 && paragraph_question5 && paragraph_question5.length > 0 && meohoc && meohoc.length > 0) {
    renderQuestion5(options[0], paragraph_question5[0], meohoc[0] || ['', '']);
    setupPart5Buttons();
  }
}


/* MINI_HIPPO_LESSON_DATA_START
{
  "version": 1,
  "lessonType": "reading",
  "part": "5",
  "sets": [
    {
      "id": 1,
      "title": "123123",
      "data": {
        "topic": "12321312",
        "options": [
          "",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7"
        ],
        "paragraphs": [
          "vThe term \"mountain\" has evolved over time, reflecting not only physical characteristics but also cultural significance. In contemporary discussions, mountains may symbolize challenges to overcome or destinations for adventure, transcending their geographical attributes.",
          "vThe term \"mountain\" has evolved over time, reflecting not only physical characteristics but also cultural significance. In contemporary discussions, mountains may symbolize challenges to overcome or destinations for adventure, transcending their geographical attributes.",
          "vThe term \"mountain\" has evolved over time, reflecting not only physical characteristics but also cultural significance. In contemporary discussions, mountains may symbolize challenges to overcome or destinations for adventure, transcending their geographical attributes.",
          "vThe term \"mountain\" has evolved over time, reflecting not only physical characteristics but also cultural significance. In contemporary discussions, mountains may symbolize challenges to overcome or destinations for adventure, transcending their geographical attributes.",
          "vThe term \"mountain\" has evolved over time, reflecting not only physical characteristics but also cultural significance. In contemporary discussions, mountains may symbolize challenges to overcome or destinations for adventure, transcending their geographical attributes.",
          "vThe term \"mountain\" has evolved over time, reflecting not only physical characteristics but also cultural significance. In contemporary discussions, mountains may symbolize challenges to overcome or destinations for adventure, transcending their geographical attributes.",
          "vThe term \"mountain\" has evolved over time, reflecting not only physical characteristics but also cultural significance. In contemporary discussions, mountains may symbolize challenges to overcome or destinations for adventure, transcending their geographical attributes."
        ],
        "tips": {
          "keyword": "vThe term \"mountain\" has evolved over time, reflecting not only physical characteristics but also cultural significance. In contemporary discussions, mountains may symbolize challenges to overcome or destinations for adventure, transcending their geographical attributes.",
          "meo": "vThe term \"mountain\" has evolved over time, reflecting not only physical characteristics but also cultural significance. In contemporary discussions, mountains may symbolize challenges to overcome or destinations for adventure, transcending their geographical attributes."
        }
      }
    }
  ]
}
MINI_HIPPO_LESSON_DATA_END */
