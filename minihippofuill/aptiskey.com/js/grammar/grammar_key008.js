
const keyid = "Grammar key8";
// Mảng câu hỏi (25 câu, đã hoán đổi vị trí)
// Mảng câu hỏi (xáo trộn thứ tự)
const question1_list = [
    {
        question_ask: "He had been working for hours when he _______ asleep.",
        question_answer: ["fell", "has fallen", "falls"]
    },
    {
        question_ask: "I’m really not sure what to do at work. I need _______ advice.",
        question_answer: ["some", "the", "piece of"]
    },
    {
        question_ask: "San Francisco is the most beautiful city I _______ visited.",
        question_answer: ["ever", "have", "had"]
    },
    {
        question_ask: "It is expected that two million copies of the novel _______ sold by December.",
        question_answer: ["will have been", "have been", "will have being"]
    },
    {
        question_ask: "She _______ to the market every Saturday.",
        question_answer: ["Goes", "Go", "Going"]
    },
    {
        question_ask: "You missed a great party on Saturday night. You _______ have come.",
        question_answer: ["should", "must", "ought"]
    },
    {
        question_ask: "Before she got married, she _______ go out most evenings.",
        question_answer: ["would", "should", "must"]
    },
    {
        question_ask: "John: I love riding bikes. Paul: _______? Me too!",
        question_answer: ["Really", "Right", "Anyway"]
    },
    {
        question_ask: "I’m _______ happy with my new car. It’s brilliant!",
        question_answer: ["quite", "so", "a bit"]
    },
    {
        question_ask: "Why _______ you apply for the job, you’ve got the experience.",
        question_answer: ["don’t", "are", "not"]
    },
    {
        question_ask: "Please, _______ the street if the light is red.",
        question_answer: ["do not cross", "cross not", "not cross"]
    },
    {
        question_ask: "It _______ been snowing heavily, so we decided to go skiing.",
        question_answer: ["had", "has", "would have"]
    },
    {
        question_ask: "I _______ London but it’s expensive.",
        question_answer: ["like", "likes", "liking"]
    },
    {
        question_ask: "In those days, my father _______ never eat dinner after eight o’clock.",
        question_answer: ["would", "will", "used to"]
    },
    {
        question_ask: "The way I see it, you _______ have sold the land then – prices are higher now.",
        question_answer: ["shouldn’t", "mustn’t", "can’t"]
    },
    {
        question_ask: "I’m sorry to let you _______, but I can’t come to your party.",
        question_answer: ["down", "on", "under"]
    },
    {
        question_ask: "We _______ through France during the summer.",
        question_answer: ["travelled", "was travelling", "travelling"]
    },
    {
        question_ask: "There were _______ than fifty people in the audience last night.",
        question_answer: ["fewer", "lesser", "few"]
    },
    {
        question_ask: "If I _______ harder at school, I wouldn’t be doing this job now.",
        question_answer: ["had worked", "has worked", "have worked"]
    },
    {
        question_ask: "I’m not sure about my future. _______ I’ll start a business.",
        question_answer: ["Perhaps", "Sometimes", "Always"]
    },
    {
        question_ask: "He _______ finished cooking when we arrived.",
        question_answer: ["had", "have", "has"]
    },
    {
        question_ask: "_______ the cold weather, she went swimming.",
        question_answer: ["Despite", "Although", "In spite"]
    },
    {
        question_ask: "If you were a better cook, you _______ need to eat out all the time.",
        question_answer: ["wouldn’t", "won’t", "hadn’t"]
    },
    {
        question_ask: "I think, in the future, space travel _______ as common as plane travel is now.",
        question_answer: ["will become", "has become", "is becoming"]
    },
    {
        question_ask: "We ate their lunch while they _______ coming home from school.",
        question_answer: ["were", "was", "are"]
    }
];


// Question2 - Mảng câu hỏi
// Select a word from the list that has the most similar meaning to the word on the left.
const question2_list = [
    {
        question_orginal: "oppose",
        question_answer: ["", "doubt", "tell", "accept", "join", "realise", "assume", "choose", "finish", "disagree", "touch", "large"],
        correct_answer: "disagree"  
    },
    {
        question_orginal: "unite",
        question_answer: ["", "doubt", "tell", "accept", "join", "realise", "assume", "choose", "finish", "disagree", "touch", "large"],
        correct_answer: "join"  
    },
    {
        question_orginal: "complete",
        question_answer: ["", "doubt", "tell", "accept", "join", "realise", "assume", "choose", "finish", "disagree", "touch", "large"],
        correct_answer: "finish"  
    },
    {
        question_orginal: "say",
        question_answer: ["", "doubt", "tell", "accept", "join", "realise", "assume", "choose", "finish", "disagree", "touch", "large"],
        correct_answer: "tell" 
    },
    {
        question_orginal: "vote",
        question_answer: ["", "doubt", "tell", "accept", "join", "realise", "assume", "choose", "finish", "disagree", "touch", "large"],
        correct_answer: "choose"  
    }
];


// Question3 - Mảng câu hỏi
// Complete each definition using a word from the list. Use each word once only. You will not need five of the words.
const question3_list = [
    {
        question_orginal: "To say no is to…",
        question_answer: ["", "instruct", "improve", "follow", "share", "cover", "refuse", "measure", "link", "observe", "estimate"],
        correct_answer: "refuse" 
    },
    {
        question_orginal: "To look at something is to…",
        question_answer: ["", "instruct", "improve", "follow", "share", "cover", "refuse", "measure", "link", "observe", "estimate"],
        correct_answer: "observe"  
    },
    {
        question_orginal: "To wrap something is to…",
        question_answer: ["", "instruct", "improve", "follow", "share", "cover", "refuse", "measure", "link", "observe", "estimate"],
        correct_answer: "cover"  
    },
    {
        question_orginal: "To give orders is to…",
        question_answer: ["", "instruct", "improve", "follow", "share", "cover", "refuse", "measure", "link", "observe", "estimate"],
        correct_answer: "instruct" 
    },
    {
        question_orginal: "To guess something is to…",
        question_answer: ["", "instruct", "improve", "follow", "share", "cover", "refuse", "measure", "link", "observe", "estimate"],
        correct_answer: "estimate" 
    }
];

// Question4 - Mảng câu hỏi
// Finish each sentence using a word from the list. Use each word once only. You will not need five of the words.
const question4_list = [
    {
        question_start: "I don’t buy",
        question_answer: ["", "catch", "vicious", "swift", "organic", "ripe", "extravagant", "secret", "furious", "vocal", "calm"],
        question_end: "food because it’s expensive and I think it’s a waste of money.",
        correct_answer: "organic"  
    },
    {
        question_start: "He was an excitable man and was very",
        question_answer: ["", "catch", "vicious", "swift", "organic", "ripe", "extravagant", "secret", "furious", "vocal", "calm"],
        question_end: "about being unhappy.",
        correct_answer: "vocal"
    },
    {
        question_start: "It was one of the ugliest things I’ve ever seen. It was absolutely",
        question_answer: ["", "catch", "vicious", "swift", "organic", "ripe", "extravagant", "secret", "furious", "vocal", "calm"],
        question_end: ".",
        correct_answer: "vicious"
    },
    {
        question_start: "They’d spent a huge amount of money on the wedding. It was very",
        question_answer: ["", "catch", "vicious", "swift", "organic", "ripe", "extravagant", "secret", "furious", "vocal", "calm"],
        question_end: ".",
        correct_answer: "extravagant"
    },
    {
        question_start: "When the player found out he’d lost the point, he was absolutely",
        question_answer: ["", "catch", "vicious", "swift", "organic", "ripe", "extravagant", "secret", "furious", "vocal", "calm"],
        question_end: ".",
        correct_answer: "furious"
    }
];


// Question5 - Mảng câu hỏi
// Select a word from the list that has the most similar meaning to the word on the left
const question5_list = [
    {
        question_orginal: "whack",
        question_answer: ["", "catch", "dance", "chase", "hit", "step", "stand", "excite", "laugh", "mix", "fix"],
        correct_answer: "hit"  
    },
    {
        question_orginal: "tread",
        question_answer: ["", "catch", "dance", "chase", "hit", "step", "stand", "excite", "laugh", "mix", "fix"],
        correct_answer: "step"  
    },
    {
        question_orginal: "arrest",
        question_answer: ["", "catch", "dance", "chase", "hit", "step", "stand", "excite", "laugh", "mix", "fix"],
        correct_answer: "catch"  
    },
    {
        question_orginal: "mend",
        question_answer: ["", "catch", "dance", "chase", "hit", "step", "stand", "excite", "laugh", "mix", "fix"],
        correct_answer: "fix"  
    },
    {
        question_orginal: "thrill",
        question_answer: ["", "catch", "dance", "chase", "hit", "step", "stand", "excite", "laugh", "mix", "fix"],
        correct_answer: "excite"  
    }
];




// Question6 - Mảng câu hỏi
// Select a word from the list that is most often used with the word on the left. Use each word once only. You will not need five of the words.
const question6_list = [
    {
        question_orginal: "millionaire",
        question_answer: ["", "hunters", "subject", "employee", "programme", "shoppers", "joint", "proportions", "wipers", "size", "businessmen"],
        correct_answer: "businessmen"  
    },
    {
        question_orginal: "epidemic",
        question_answer: ["", "hunters", "subject", "employee", "programme", "shoppers", "joint", "proportions", "wipers", "size", "businessmen"],
        correct_answer: "programme"  
    },
    {
        question_orginal: "diploma",
        question_answer: ["", "hunters", "subject", "employee", "programme", "shoppers", "joint", "proportions", "wipers", "size", "businessmen"],
        correct_answer: "subject"  
    },
    {
        question_orginal: "windscreen",
        question_answer: ["", "hunters", "subject", "employee", "programme", "shoppers", "joint", "proportions", "wipers", "size", "businessmen"],
        correct_answer: "wipers"  
    },
    {
        question_orginal: "bargain",
        question_answer: ["", "hunters", "subject", "employee", "programme", "shoppers", "joint", "proportions", "wipers", "size", "businessmen"],
        correct_answer: "shoppers"  
    }
];








// Mảng lưu đáp án đúng (phần tử đầu tiên của mảng question_answer)
const correct_answers = [];
const user_answers = [];
const shuffledQuestions = [];

// Hàm xáo trộn mảng
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Hoán đổi
    }
}


function render_question1(index) {
    const questionContainer = document.getElementById("question1");
    const question1_x = document.getElementById("question1_x");
    question1_x.innerHTML = "Question " + (index + 1) + " of 30"
    

    question1_list.forEach((questionObj, index) => {
        correct_answers.push(questionObj.question_answer[0]);

        const shuffledAnswers = [...questionObj.question_answer];
        shuffleArray(shuffledAnswers);
        shuffledQuestions.push(shuffledAnswers);
        user_answers.push(null);
    });

    const questionObj = question1_list[index];
    const shuffledAnswers = shuffledQuestions[index];

    const questionHTML = `
        <div class="mb-3">
            <label for="q${index}" class="form-label">${questionObj.question_ask}</label>
            ${shuffledAnswers.map((answer, idx) => `
                <div>
                    <input type="radio" id="q${index}-${idx}" name="q${index}" value="${answer}" ${user_answers[index] === answer ? 'checked' : ''}>
                    <label for="q${index}-${idx}" class="form-check-label">${answer}</label>
                </div>
            `).join('')}
        </div>
    `;
    questionContainer.innerHTML = questionHTML;

    const radioButtons = document.querySelectorAll(`input[name="q${index}"]`);
    radioButtons.forEach((radio) => {
        radio.addEventListener("change", function() {
            user_answers[index] = this.value;
        });
    });

    

}





function submitQuizQuestion1() {
    const questionContainer = document.getElementById("question1");
    const resultContainer = document.getElementById("resultContainer_question1");
    const resultTableBody = document.getElementById("resultTableBody");

    // Biến để tính điểm, thay 'score' thành 'score_question1'
    let score_question1 = 0;

    resultTableBody.innerHTML = ''; 

    question1_list.forEach((questionObj, index) => {
        const userAnswer = user_answers[index];
        const correctAnswer = correct_answers[index];
        const result = userAnswer === correctAnswer ? 'Correct' : 'Incorrect';
        const resultColor = userAnswer === correctAnswer ? 'text-success' : 'text-danger';

        // Tính điểm nếu câu trả lời đúng
        if (userAnswer === correctAnswer) {
            score_question1++;
        }

        const resultRow = `
            <tr>
                <td>${index + 1}</td>
                <td>${questionObj.question_ask}</td>
                <td>${userAnswer || 'No answer'}</td>
                <td>${correctAnswer}</td>
                <td class="${resultColor}">${result}</td>
            </tr>
        `;
        resultTableBody.innerHTML += resultRow;
    });

    // Hiển thị điểm lên phần tử yourScore_question1
    document.getElementById("yourScore_question1").textContent =
        `Your Score: ${score_question1} / ${question1_list.length}`;

    // Ẩn phần footer và câu hỏi, hiển thị kết quả
    document.querySelector(".footer").style.display = "none";
    questionContainer.style.display = "none";
    resultContainer.style.display = "block";

    // Đóng modal nếu có
    const myModal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
    if (myModal) myModal.hide();

     return score_question1;

}





// ++++++++++++++++++++++++++++++++++++++++++++++++++++++
// QUESTION 2
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++


// Hàm hiển thị câu hỏi khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", function() {
    render_question2();  // Gọi hàm render_question2 khi DOM đã tải xong
});


// Hàm render câu hỏi 2
function render_question2() {
    const form = document.getElementById("exerciseForm_question2");
    form.innerHTML = ""; // Xóa nội dung cũ nếu có

    question2_list.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "row mb-3 align-items-center";

        const colLeft = document.createElement("div");
        colLeft.className = "col-md-3";
        colLeft.innerText = item.question_orginal;

        const colRight = document.createElement("div");
        colRight.className = "col-md-6";
        const select = document.createElement("select");
        select.className = "form-select";
        select.name = `question_${index}`;

        item.question_answer.forEach(answer => {
            const option = document.createElement("option");
            option.value = answer;
            option.innerText = answer;
            select.appendChild(option);
        });

        colRight.appendChild(select);
        row.appendChild(colLeft);
        row.appendChild(colRight);
        form.appendChild(row);
    });
}


function submitQuizQuestion2() {
    const resultTableBody = document.getElementById("resultTableBody_question2");
    const yourScoreElement = document.getElementById("yourScore_question2");

    // Kiểm tra tồn tại
    if (!resultTableBody) {
        console.error('resultTableBody_question2 không tồn tại trong DOM.');
        return;
    }

    resultTableBody.innerHTML = ''; // Xóa bảng cũ

    let correctCount = 0; // Biến lưu số câu đúng

    // Tạo mảng kết quả từ question2_list
    const results = question2_list.map((item, index) => {
        const select = document.querySelector(`select[name="question_${index}"]`);
        const userAnswer = select ? select.value : "";

        // Kiểm tra câu trả lời đúng
        if (userAnswer === item.correct_answer) {
            correctCount++;
        }

        return {
            question: item.question_orginal,
            userAnswer: userAnswer,
            correctAnswer: item.correct_answer
        };
    });

    // Cập nhật điểm
    yourScoreElement.innerText = `Your score: ${correctCount} / 5`;

    // Render ra bảng
    results.forEach((result, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${result.question}</td>
            <td>${result.userAnswer}</td>
            <td>${result.correctAnswer}</td>
            <td class="${result.userAnswer === result.correctAnswer ? 'text-success' : 'text-danger'}">
                ${result.userAnswer === result.correctAnswer ? 'Correct' : 'Incorrect'}
            </td>
        `;
        resultTableBody.appendChild(row);
    });

    // Hiển thị container kết quả
    //document.getElementById("resultContainer_question2").style.display = "block";

    return correctCount;
}









// ++++++++++++++++++++++++++++++++++++++++++++++++++++++
// QUESTION 3
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++


document.addEventListener("DOMContentLoaded", function() {
    render_question3();  // Gọi hàm render_question3 khi DOM đã tải xong
});

// Mảng để theo dõi các từ đã chọn
let selectedAnswers_question3 = [];

function render_question3() {
    const form = document.getElementById("exerciseForm_question3");
    form.innerHTML = ""; // Xóa nội dung cũ nếu có

    question3_list.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "row mb-3 align-items-center";

        const colLeft = document.createElement("div");
        colLeft.className = "col-md-3";
        colLeft.innerText = item.question_orginal;

        const colRight = document.createElement("div");
        colRight.className = "col-md-6";
        const select = document.createElement("select");
        select.className = "form-select";
        select.name = `question_${index}`;

        // Lọc ra các từ đã được chọn
       const availableAnswers = item.question_answer.filter(answer => !selectedAnswers_question3.includes(answer));


        // Thêm các tùy chọn vào select
        availableAnswers.forEach(answer => {
            const option = document.createElement("option");
            option.value = answer;
            option.innerText = answer;
            select.appendChild(option);
        });

        // Lắng nghe sự thay đổi của lựa chọn
        select.addEventListener("change", function() {
            selectedAnswers_question3[index] = select.value; // Lưu đáp án đã chọn
        });

        colRight.appendChild(select);
        row.appendChild(colLeft);
        row.appendChild(colRight);
        form.appendChild(row);
    });
}

function submitQuizQuestion3() {
    const resultTableBody = document.getElementById("resultTableBody_question3");
    const yourScoreElement = document.getElementById("yourScore_question3");

    // Kiểm tra tồn tại
    if (!resultTableBody) {
        console.error('resultTableBody_question3 không tồn tại trong DOM.');
        return;
    }

    resultTableBody.innerHTML = ''; // Xóa bảng cũ

    let correctCount = 0; // Biến lưu số câu đúng

    // Tạo mảng kết quả từ question3_list
    const results = question3_list.map((item, index) => {
        const userAnswer = selectedAnswers_question3[index] || "";  // Lấy giá trị người dùng chọn

        // Kiểm tra câu trả lời đúng
        if (userAnswer === item.correct_answer) {
            correctCount++;
        }

        return {
            question: item.question_orginal,
            userAnswer: userAnswer,
            correctAnswer: item.correct_answer
        };
    });

    // Cập nhật điểm
    yourScoreElement.innerText = `Your score: ${correctCount} / 5`;

    // Render ra bảng
    results.forEach((result, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${result.question}</td>
            <td>${result.userAnswer}</td>  <!-- Hiển thị đáp án người dùng chọn -->
            <td>${result.correctAnswer}</td>
            <td class="${result.userAnswer === result.correctAnswer ? 'text-success' : 'text-danger'}">
                ${result.userAnswer === result.correctAnswer ? 'Correct' : 'Incorrect'}
            </td>
        `;
        resultTableBody.appendChild(row);
    });

    // Hiển thị container kết quả
    //document.getElementById("resultContainer_question3").style.display = "block";

    return correctCount;
}






// ++++++++++++++++++++++++++++++++++++++++++++++++++++++
// QUESTION 4
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++
document.addEventListener("DOMContentLoaded", function() {
    render_question4();  // Gọi hàm render_question4 khi DOM đã tải xong
});

let selectedAnswers_question4 = [];


function render_question4() {
    const form = document.getElementById("exerciseForm_question4");
    form.innerHTML = ""; // Xóa nội dung cũ nếu có

    question4_list.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "mb-3 d-flex align-items-center"; // Dùng d-flex để căn chỉnh theo hàng và align-items-center để canh giữa các phần tử

        // Tạo câu hỏi đầu (question_start)
        const questionStart = document.createElement("div");
        questionStart.className = "me-2"; // Thêm margin-right giữa các phần tử
        questionStart.innerText = item.question_start;

        // Tạo selectbox cho câu trả lời
        const select = document.createElement("select");
        select.className = "form-select form-select-sm w-auto me-2"; // Thêm form-select-sm và w-auto để giảm chiều rộng
        select.name = `question_${index}`;

        // Lọc các lựa chọn chưa được chọn
        const availableAnswers = item.question_answer.filter(answer => !selectedAnswers_question4.includes(answer));

        // Thêm các lựa chọn vào select
        availableAnswers.forEach(answer => {
            const option = document.createElement("option");
            option.value = answer;
            option.innerText = answer;
            select.appendChild(option);
        });

        // Lắng nghe sự thay đổi của lựa chọn
        select.addEventListener("change", function() {
            selectedAnswers_question4[index] = select.value; // Lưu đáp án đã chọn
        });

        // Tạo phần kết thúc câu hỏi (question_end)
        const questionEnd = document.createElement("div");
        questionEnd.innerText = item.question_end;

        // Thêm vào form
        row.appendChild(questionStart);
        row.appendChild(select);
        row.appendChild(questionEnd);

        form.appendChild(row);
    });
}

function submitQuizQuestion4() {
    const resultTableBody = document.getElementById("resultTableBody_question4");
    const yourScoreElement = document.getElementById("yourScore_question4");

    resultTableBody.innerHTML = ''; // Xóa bảng cũ

    let correctCount = 0; // Biến lưu số câu đúng

    // Tạo mảng kết quả từ question4_list
    const results = question4_list.map((item, index) => {
        const userAnswer = selectedAnswers_question4[index] || "";  // Lấy giá trị người dùng chọn

        // Kiểm tra câu trả lời đúng
        if (userAnswer === item.correct_answer) {
            correctCount++;
        }

        return {
            question: `${item.question_start} ... ${item.question_end}`,
            userAnswer: userAnswer,
            correctAnswer: item.correct_answer
        };
    });

    // Cập nhật điểm
    yourScoreElement.innerText = `Your score: ${correctCount} / 5`;

    // Render ra bảng
    results.forEach((result, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${result.question}</td>
            <td>${result.userAnswer}</td>  <!-- Hiển thị đáp án người dùng chọn -->
            <td>${result.correctAnswer}</td>
            <td class="${result.userAnswer === result.correctAnswer ? 'text-success' : 'text-danger'}">
                ${result.userAnswer === result.correctAnswer ? 'Correct' : 'Incorrect'}
            </td>
        `;
        resultTableBody.appendChild(row);
    });

    // Hiển thị container kết quả
    //document.getElementById("resultContainer_question4").style.display = "block";

    return correctCount;
}





// ++++++++++++++++++++++++++++++++++++++++++++++++++++++
// QUESTION 5
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++


// Hàm hiển thị câu hỏi khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", function() {
    render_question5();  // Gọi hàm render_question5 khi DOM đã tải xong
});


// Hàm render câu hỏi 2
function render_question5() {
    const form = document.getElementById("exerciseForm_question5");
    form.innerHTML = ""; // Xóa nội dung cũ nếu có

    question5_list.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "row mb-3 align-items-center";

        const colLeft = document.createElement("div");
        colLeft.className = "col-md-3";
        colLeft.innerText = item.question_orginal;

        const colRight = document.createElement("div");
        colRight.className = "col-md-6";
        const select = document.createElement("select");
        select.className = "form-select";
        select.name = `question_${index}`;

        item.question_answer.forEach(answer => {
            const option = document.createElement("option");
            option.value = answer;
            option.innerText = answer;
            select.appendChild(option);
        });

        colRight.appendChild(select);
        row.appendChild(colLeft);
        row.appendChild(colRight);
        form.appendChild(row);
    });
}


function submitQuizQuestion5() {
    const resultTableBody = document.getElementById("resultTableBody_question5");
    const yourScoreElement = document.getElementById("yourScore_question5");

    // Kiểm tra tồn tại
    if (!resultTableBody) {
        console.error('resultTableBody_question5 không tồn tại trong DOM.');
        return;
    }

    resultTableBody.innerHTML = ''; // Xóa bảng cũ

    let correctCount = 0; // Biến lưu số câu đúng

    // Tạo mảng kết quả từ question5_list
    const results = question5_list.map((item, index) => {
        const select = document.querySelector(`select[name="question_${index}"]`);
        const userAnswer = select ? select.value : "";

        // Kiểm tra câu trả lời đúng
        if (userAnswer === item.correct_answer) {
            correctCount++;
        }

        return {
            question: item.question_orginal,
            userAnswer: userAnswer,
            correctAnswer: item.correct_answer
        };
    });

    // Cập nhật điểm
    yourScoreElement.innerText = `Your score: ${correctCount} / 5`;

    // Render ra bảng
    results.forEach((result, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${result.question}</td>
            <td>${result.userAnswer}</td>
            <td>${result.correctAnswer}</td>
            <td class="${result.userAnswer === result.correctAnswer ? 'text-success' : 'text-danger'}">
                ${result.userAnswer === result.correctAnswer ? 'Correct' : 'Incorrect'}
            </td>
        `;
        resultTableBody.appendChild(row);
    });

    // Hiển thị container kết quả
    //document.getElementById("resultContainer_question5").style.display = "block";
    
    return correctCount;
}




// ++++++++++++++++++++++++++++++++++++++++++++++++++++++
// QUESTION 6
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++


// Hàm hiển thị câu hỏi khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", function() {
    render_question6();  // Gọi hàm render_question6 khi DOM đã tải xong
});


// Hàm render câu hỏi 2
function render_question6() {
    const form = document.getElementById("exerciseForm_question6");
    form.innerHTML = ""; // Xóa nội dung cũ nếu có

    question6_list.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "row mb-3 align-items-center";

        const colLeft = document.createElement("div");
        colLeft.className = "col-md-3";
        colLeft.innerText = item.question_orginal;

        const colRight = document.createElement("div");
        colRight.className = "col-md-6";
        const select = document.createElement("select");
        select.className = "form-select";
        select.name = `question_${index}`;

        item.question_answer.forEach(answer => {
            const option = document.createElement("option");
            option.value = answer;
            option.innerText = answer;
            select.appendChild(option);
        });

        colRight.appendChild(select);
        row.appendChild(colLeft);
        row.appendChild(colRight);
        form.appendChild(row);
    });
}


function submitQuizQuestion6() {
    const resultTableBody = document.getElementById("resultTableBody_question6");
    const yourScoreElement = document.getElementById("yourScore_question6");

    // Kiểm tra tồn tại
    if (!resultTableBody) {
        console.error('resultTableBody_question6 không tồn tại trong DOM.');
        return;
    }

    resultTableBody.innerHTML = ''; // Xóa bảng cũ

    let correctCount = 0; // Biến lưu số câu đúng

    // Tạo mảng kết quả từ question6_list
    const results = question6_list.map((item, index) => {
        const select = document.querySelector(`select[name="question_${index}"]`);
        const userAnswer = select ? select.value : "";

        // Kiểm tra câu trả lời đúng
        if (userAnswer === item.correct_answer) {
            correctCount++;
        }

        return {
            question: item.question_orginal,
            userAnswer: userAnswer,
            correctAnswer: item.correct_answer
        };
    });

    // Cập nhật điểm
    yourScoreElement.innerText = `Your score: ${correctCount} / 5`;

    // Render ra bảng
    results.forEach((result, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${result.question}</td>
            <td>${result.userAnswer}</td>
            <td>${result.correctAnswer}</td>
            <td class="${result.userAnswer === result.correctAnswer ? 'text-success' : 'text-danger'}">
                ${result.userAnswer === result.correctAnswer ? 'Correct' : 'Incorrect'}
            </td>
        `;
        resultTableBody.appendChild(row);
    });

    // Hiển thị container kết quả
    //document.getElementById("resultContainer_question6").style.display = "block";

    return correctCount;
}



// ============================================================
// 🟢 Nút Submit - Xử lý khi bấm nút nộp bài
// ============================================================

document.addEventListener("DOMContentLoaded", function() {
    const submitTestButton = document.getElementById("submitTestButton");
    const total_score_s = document.getElementById("totalScore");
    const result_navigation = document.getElementById("result_navigation");

    submitTestButton.addEventListener("click", function() {
        // Gọi các hàm nộp quiz và lấy điểm
        const scores = [
            submitQuizQuestion1(),
            submitQuizQuestion2(),
            submitQuizQuestion3(),
            submitQuizQuestion4(),
            submitQuizQuestion5(),
            submitQuizQuestion6()
        ].map(s => Number(s) || 0);

        const total = scores.reduce((a, b) => a + b, 0);

        total_score_s.textContent = `Your grammar total score: ${total}`;

        hidden_all();

        result_navigation.style.display = "block";


    });
});



// ============================================================
// 🟢 Nút next và back
// ============================================================
let currentQuestionIndex = 0;
document.addEventListener("DOMContentLoaded", function() {
    render_question1(0);

    nextButton.addEventListener("click", function() {
        if (currentQuestionIndex < question1_list.length + 4) {
            currentQuestionIndex++;
            if(currentQuestionIndex < question1_list.length){
                render_question1(currentQuestionIndex);
            }
            display_question(currentQuestionIndex);
        } else {
            const myModal = new bootstrap.Modal(document.getElementById('confirmModal'), {
                keyboard: false
            });
            myModal.show();
        }


        const question1_x = document.getElementById("question1_x");
        if (currentQuestionIndex > question1_list.length -1) {
            question1_x.style.display = "none";
        } else {
            question1_x.style.display = "block";
        }

        if (currentQuestionIndex === question1_list.length + 4) {
            nextButton.textContent = "Submit Test"; 
        } else {
            nextButton.textContent = "Next"; 
        }
    });

    backButton.addEventListener("click", function() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;

            if(currentQuestionIndex < question1_list.length - 1){
                render_question1(currentQuestionIndex);
            }           
        }
        display_question(currentQuestionIndex);

        if (currentQuestionIndex > question1_list.length -1) {
            question1_x.style.display = "none";
        } else {
            question1_x.style.display = "block";
        }

        if (currentQuestionIndex === question1_list.length + 4) {
            nextButton.textContent = "Submit Test"; 
        } else {
            nextButton.textContent = "Next"; 
        }
    });
});






function display_question(index) {
    const questions = [
        document.getElementById("question1"),
        document.getElementById("question2"),
        document.getElementById("question3"),
        document.getElementById("question4"),
        document.getElementById("question5"),
        document.getElementById("question6")
    ];

    // Ẩn hết
    questions.forEach(div => div.style.display = "none");

    // Tính xem đang ở câu hỏi số mấy
    let step = 0;
    if (index < question1_list.length) {
        step = 0; // question1
    } else if (index === question1_list.length) {
        step = 1; // question2
    } else if (index === question1_list.length + 1) {
        step = 2; // question3
    } else if (index === question1_list.length + 2) {
        step = 3; // question4
    } else if (index === question1_list.length + 3) {
        step = 4; // question5
    } else if (index === question1_list.length + 4) {
        step = 5; // question6
    }

    // Hiện đúng div
    questions[step].style.display = "block";
}


// Ẩn tất cả câu hỏi
function hidden_all() {
    const questions = [
        document.getElementById("question1"),
        document.getElementById("question2"),
        document.getElementById("question3"),
        document.getElementById("question4"),
        document.getElementById("question5"),
        document.getElementById("question6")
    ];

    questions.forEach(div => {
        if (div) div.style.display = "none";
    });
}


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("question_step").innerHTML = keyid;
    const navButtons = [
        document.getElementById("navQ1"),
        document.getElementById("navQ2"),
        document.getElementById("navQ3"),
        document.getElementById("navQ4"),
        document.getElementById("navQ5"),
        document.getElementById("navQ6")
    ];

    const resultContainers = [
        document.getElementById("resultContainer_question1"),
        document.getElementById("resultContainer_question2"),
        document.getElementById("resultContainer_question3"),
        document.getElementById("resultContainer_question4"),
        document.getElementById("resultContainer_question5"),
        document.getElementById("resultContainer_question6")
    ];

    function hideAllResults() {
        resultContainers.forEach(div => { if (div) div.style.display = "none"; });
    }

    function setActiveButton(activeIdx) {
        navButtons.forEach((btn, i) => {
            btn.classList.toggle("btn-active", i === activeIdx);
            btn.classList.toggle("active", i === activeIdx); // phòng khi bạn muốn dùng .active của Bootstrap
        });
    }

    function showResult(idx) {
        hideAllResults();
        if (resultContainers[idx]) resultContainers[idx].style.display = "block";
        setActiveButton(idx);
        const nav = document.getElementById("result_navigation");
        if (nav) nav.style.display = "block";
    }

    // Gắn sự kiện cho 6 nút
    navButtons.forEach((btn, i) => {
        if (!btn) return;
        btn.addEventListener("click", () => showResult(i));
    });

    // ===== Ví dụ: sau khi submit và tính điểm xong, hiện navigation và kết quả số 1
    // Gọi ở cuối hàm tổng hợp điểm của bạn:
    // document.getElementById("result_navigation").style.display = "block";
    // showResult(0); // hiển thị resultContainer_question1
});
