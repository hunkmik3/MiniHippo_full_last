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
    'The term \"mountain\" has evolved over time, reflecting not only physical characteristics but also cultural significance. In contemporary discussions, mountains may symbolize challenges to overcome or destinations for adventure, transcending their geographical attributes.',
    'Climbing a mountain often leads to a profound sense of accomplishment. It represents not just reaching a physical summit but also conquering personal fears and pushing one\'s limits, creating memories that last a lifetime.',
    'In today\'s digital age, sharing achievements has become prevalent. Climbing a mountain is frequently documented on social media, turning personal milestones into public spectacles that inspire others while also raising questions about authenticity.',
    'The pursuit of climbing mountains can sometimes lead to misplaced priorities. While seeking adventure and recognition, individuals may neglect personal relationships or responsibilities, emphasizing the need for a balanced approach to life.',
    'Engaging in extreme sports, such as mountain climbing, can forge strong bonds among participants. However, it may also create worrying connections where individuals prioritize adrenaline over safety, potentially leading to dangerous situations.',
    'Shared experiences in challenging environments, like mountains, can deepen intimacy in relationships. Couples or friends who navigate the challenges of climbing together often find their bonds strengthened through mutual support and understanding.',
    'While adventure is thrilling, there is a growing recognition of the importance of stability in life. Balancing the desire for adventure with the need for security is crucial, prompting individuals to reflect on their life choices and long-term goals.',
];

const question5_keyword_1 = 'mountain → achievement → Publicity → mistake → Worrying → relationships → stability.';
const question5_meo_1 = "Ngọn núi (mountain) là biểu tượng của thành tựu (achievement), nhưng việc phô trương thành tích leo núi để có danh tiếng (publicity) là một sai lầm (mistake). Điều này dẫn đến lo ngại (worrying) và hiềm khích đến mối quan hệ (relationships) giữa những người leo núi. Tốt nhất là giữ tâm lý ổn định (stability) và không khoe khoang.";

const options = [
    options_1,
];

const paragraph_question5 = Array.from(
  { length: options.length },
  (_, i) => eval(`paragraph_question5_${i + 1}`)
);

const meohoc = Array.from({ length: options.length }, (_, i) => [
  eval(`question5_keyword_${i + 1}`),
  eval(`question5_meo_${i + 1}`)
]);

const topic_name = {
    topic_1: "Mountain",
};

const dodai = options.length;
window.options = options;
window.paragraph_question5 = paragraph_question5;
window.topic_name = topic_name;

let currentQuestion = 0;
let questions5 = [];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function renderQuestion5(options, paragraph_question5, meohoc) {
  const container = document.getElementById('question5-container');
  if (!container) { console.error("Container không tồn tại!"); return; }
  const topicEl = document.getElementById("question5_topic");
  if (topicEl) topicEl.innerText = "TOPIC: " + topic_name["topic_" + (currentQuestion + 1)];
  const indexEl = document.getElementById('question5_index');
  if (indexEl) indexEl.textContent = 'Reading question 5 (' + (currentQuestion + 1) + '/' + dodai + ')';
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
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('mb-3');
    const questionRow = document.createElement('div');
    questionRow.style.display = 'flex';
    questionRow.style.alignItems = 'center';
    const label = document.createElement('label');
    label.setAttribute('for', question.id);
    label.classList.add('form-label');
    label.textContent = question.label;
    label.style.marginRight = '10px';
    const select = document.createElement('select');
    select.classList.add('form-select');
    select.id = question.id;
    shuffledOptions.forEach(optionValue => {
      const option = document.createElement('option');
      option.value = optionValue;
      option.textContent = optionValue.charAt(0).toUpperCase() + optionValue.slice(1);
      select.appendChild(option);
    });
    questionRow.appendChild(label);
    questionRow.appendChild(select);
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

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    if (options && options.length > 0 && paragraph_question5 && paragraph_question5.length > 0 && meohoc && meohoc.length > 0) {
      renderQuestion5(options[0], paragraph_question5[0], meohoc[0] || ['', '']);
    }
  });
} else {
  if (options && options.length > 0 && paragraph_question5 && paragraph_question5.length > 0 && meohoc && meohoc.length > 0) {
    renderQuestion5(options[0], paragraph_question5[0], meohoc[0] || ['', '']);
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
      "title": "Reading question 5",
      "data": {
        "topic": "Mountain",
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
          "The term \"mountain\" has evolved over time, reflecting not only physical characteristics but also cultural significance. In contemporary discussions, mountains may symbolize challenges to overcome or destinations for adventure, transcending their geographical attributes.",
          "Climbing a mountain often leads to a profound sense of accomplishment. It represents not just reaching a physical summit but also conquering personal fears and pushing one's limits, creating memories that last a lifetime.",
          "In today's digital age, sharing achievements has become prevalent. Climbing a mountain is frequently documented on social media, turning personal milestones into public spectacles that inspire others while also raising questions about authenticity.",
          "The pursuit of climbing mountains can sometimes lead to misplaced priorities. While seeking adventure and recognition, individuals may neglect personal relationships or responsibilities, emphasizing the need for a balanced approach to life.",
          "Engaging in extreme sports, such as mountain climbing, can forge strong bonds among participants. However, it may also create worrying connections where individuals prioritize adrenaline over safety, potentially leading to dangerous situations.",
          "Shared experiences in challenging environments, like mountains, can deepen intimacy in relationships. Couples or friends who navigate the challenges of climbing together often find their bonds strengthened through mutual support and understanding.",
          "While adventure is thrilling, there is a growing recognition of the importance of stability in life. Balancing the desire for adventure with the need for security is crucial, prompting individuals to reflect on their life choices and long-term goals."
        ],
        "tips": {
          "keyword": "mountain → achievement → Publicity → mistake → Worrying → relationships → stability.",
          "meo": "Ngọn núi (mountain) là biểu tượng của thành tựu (achievement), nhưng việc phô trương thành tích leo núi để có danh tiếng (publicity) là một sai lầm (mistake). Điều này dẫn đến lo ngại (worrying) và hiềm khích đến mối quan hệ (relationships) giữa những người leo núi. Tốt nhất là giữ tâm lý ổn định (stability) và không khoe khoang."
        }
      }
    }
  ]
}
MINI_HIPPO_LESSON_DATA_END */
