// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI PART 4 ///////////////
// ===============================================================================================================

const question4Text_1 = [
    "Here is the perspective of four people on the above topic. Please read the content and answer the question.",
    "In the past, I really liked playing board games. Now, to limit the children from using computers, I often spend time playing with them. However, I have struggled with them because the games nowadays have more characters and rules, making us think a lot every time we play. Despite this, my children and I still like it and have a good time together",
    "When I was a child, I often played soccer with other children of the same age. We usually played in the schoolyard and sometimes in the open spaces of the neighborhood. We divided into small teams and chased the ball until we were all tired.",
    "When I was a child, I didn\'t like going out to play, so I chose reading books as a form of entertainment. The stories described in the pages of books helped me discover my own world. Later, when I grew up, I started liking modern games with eye-catching interfaces, which help me relax and increase my creativity.",
    "When I was a child, I really liked outdoor activities. I remember that on bad weather days, I was always by the window, glued to it, looking outside and praying for the rain to stop. At those times, my mother often gave me paper and a box of crayons. I really enjoyed that drawing activity and often drew at home when the weather was bad.",
];

const question4Content_1 = [
    { question: "Who finds today’s games harder than before?", id: "question4_q1", options: ["", "A", "B", "C", "D"], answer: "A" },
    { question: "Who enjoyed playing with friends in childhood?", id: "question4_q2", options: ["", "A", "B", "C", "D"], answer: "B" },
    { question: "Who enjoys playing with their children?", id: "question4_q3", options: ["", "A", "B", "C", "D"], answer: "C" },
    { question: "Who waited and hoped to go outside?", id: "question4_q4", options: ["", "A", "B", "C", "D"], answer: "D" },
    { question: "Who prefers modern games?", id: "question4_q5", options: ["", "A", "B", "C", "D"], answer: "A" },
    { question: "Who enjoyed arts as a child?", id: "question4_q6", options: ["", "A", "B", "C", "D"], answer: "B" },
    { question: "Who enjoyed reading books as a child?", id: "question4_q7", options: ["", "A", "B", "C", "D"], answer: "C" },
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
  topic1: "Games from childhood",
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
  question4Text[index].forEach(text => {
    const p = document.createElement('p');
    p.innerHTML = text;
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
}
// Expose renderQuestion4 to window
window.renderQuestion4 = renderQuestion4;

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    renderQuestion4(0);
  });
} else {
  renderQuestion4(0);
}


/* MINI_HIPPO_LESSON_DATA_START
{
  "version": 1,
  "lessonType": "reading",
  "part": "4",
  "sets": [
    {
      "id": 1,
      "title": "Reading Question 4",
      "data": {
        "topic": "Games from childhood",
        "texts": [
          "Here is the perspective of four people on the above topic. Please read the content and answer the question.",
          "In the past, I really liked playing board games. Now, to limit the children from using computers, I often spend time playing with them. However, I have struggled with them because the games nowadays have more characters and rules, making us think a lot every time we play. Despite this, my children and I still like it and have a good time together",
          "When I was a child, I often played soccer with other children of the same age. We usually played in the schoolyard and sometimes in the open spaces of the neighborhood. We divided into small teams and chased the ball until we were all tired.",
          "When I was a child, I didn't like going out to play, so I chose reading books as a form of entertainment. The stories described in the pages of books helped me discover my own world. Later, when I grew up, I started liking modern games with eye-catching interfaces, which help me relax and increase my creativity.",
          "When I was a child, I really liked outdoor activities. I remember that on bad weather days, I was always by the window, glued to it, looking outside and praying for the rain to stop. At those times, my mother often gave me paper and a box of crayons. I really enjoyed that drawing activity and often drew at home when the weather was bad."
        ],
        "questions": [
          {
            "question": "Who finds today’s games harder than before?",
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
            "question": "Who enjoyed playing with friends in childhood?",
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
            "question": "Who enjoys playing with their children?",
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
            "question": "Who waited and hoped to go outside?",
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
            "question": "Who prefers modern games?",
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
            "question": "Who enjoyed arts as a child?",
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
            "question": "Who enjoyed reading books as a child?",
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
