document.addEventListener('DOMContentLoaded', function() {

document.getElementById('question_step').innerHTML = 'Bộ đề #05'; // Bộ 20
const q2_topic = "Artificial intelligence";
const q3_topic = "Company wellness day";

const q4_topic = "Work and life balance";
const q5_topic = "Women mathematicians";


// document.getElementById('question_step').innerHTML = 'Bộ đề #016';
// const q2_topic = "New coffee shop";
// const q3_topic = "Films";
// const q4_topic = "Music festival";
// const q5_topic = "Mountain";

// document.getElementById('question_step').innerHTML = 'Bộ đề #017';
// const q2_topic = "Writing about a place";
// const q3_topic = "Movies then and now";
// const q4_topic = "Extreme sports";
// const q5_topic = "Four-Day Workweek";

// document.getElementById('question_step').innerHTML = 'Bộ đề #018';
// const q2_topic = "Weekend activities";
// const q3_topic = "The famous singer";

// const q4_topic = "Games from childhood";
// const q5_topic = "Digital transformation";

// document.getElementById('question_step').innerHTML = 'Bộ đề #019';
// const q2_topic = "Family sports day";
// const q3_topic = "Means of transportation";

// const q4_topic = "Technology in childhood";
// const q5_topic = "Wellness trend";


// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI ///////////////
// ===============================================================================================================

// Đề mới tháng 9 - Cập nhật 18/9 - Bộ đề 20
const questions1_header = "Question 1 of 5 "
const questions1 = [
    { questionStart: "Is your neighborhood", answerOptions: ["friendly", "noisy", "quiet"], questionEnd: "?", correctAnswer: "friendly" },
    { questionStart: "How do you usually", answerOptions: ["run", "walk", "cycle"], questionEnd: "to work?", correctAnswer: "walk" },
    { questionStart: "When did you meet your friend", answerOptions: ["first", "last", "next"], questionEnd: "?", correctAnswer: "first" },
    { questionStart: "Can you", answerOptions: ["speak", "read", "write"], questionEnd: "French?", correctAnswer: "speak" },
    { questionStart: "Do you like going out", answerOptions: ["alone", "together", "separately"], questionEnd: "with your friends?", correctAnswer: "together" }
];


/// 2. Câu 41 ( đề mới)
const question2Content = [
    { 
        text: "Over the past decade, artificial intelligence has revolutionized various industries.", 
        id: "item1"
    },
    { 
        text: "The early AI systems were limited to simple pattern recognition tasks.", 
        id: "item2"
    },
    { 
        text: "High computational costs previously hindered the development of AI.", 
        id: "item3"
    },
    { 
        text: "Nowadays, AI engineers build advanced models for complex tasks such as language translation.", 
        id: "item4"
    },
    { 
        text: "Modern AI tools help businesses to analyze data and make better decisions.", 
        id: "item5"
    }
];




/// 2. Câu 42 ( đề mới)
const question3Content = [
    { 
        text: "This month, the wellness day took place on Friday, focusing on work-life balance.", 
        id: "item1"
    },
    { 
        text: "More than 50 (con số bất kỳ) employees participated, with Mr.A (tên người) leading a workshop on stress relief.", 
        id: "item2"
    },
    { 
        text: "Activities included team yoga, time management seminars, and a group walk.", 
        id: "item3"
    },
    { 
        text: "After the workshops, awards were given for the most creative wellness ideas.", 
        id: "item4"
    },
    { 
        text: "Employees enjoyed healthy snacks and exchanged tips for managing stress.", 
        id: "item5"
    }
];



// 4. Câu 4 - Đề mới tháng 9 -- cập nhật 12/9
const question4Text = [
    "<strong>Here is the perspective of four people on the above topic. Please read the content and answer the question.</strong>",
    "<strong>A:</strong> When I was a child, I enjoyed playing board games with my parents after their busy workdays. Now, I get to share that experience with my own kids, and having a four-day workweek gives us more time together. Flexible schedules are a big help, but I always make sure to plan ahead so I can balance both work and family life. These are the moments that create lasting memories.",
    "<strong>B:</strong> As a kid, I would set up pretend offices with my friends, using toy phones and notebooks. I loved taking on the role of 'boss' and organizing our tasks. Those imaginative games taught me valuable lessons in organization and leadership, and I still laugh thinking about the 'serious' meetings we held.",
    "<strong>C:</strong> When I was younger, I devoured books about different professions, dreaming about what my future career might be. Those books inspired my ambition. Today, I rely on productivity apps to keep track of my tasks in my four-day workweek. While the apps make my work more efficient, the excitement of organizing and planning is still the same.",
    "<strong>D:</strong> As a child, I spent countless evenings playing tag with my friends in the neighborhood. On rainy days, though, I often found myself feeling bored indoors. Now, after work, I practice mindfulness to help me relax and recharge. It’s especially helpful with a shorter workweek, as it keeps me focused and refreshed.",
];
const question4Content = [
    { question: "Who now enjoys productivity apps?", id: "question4_q1", options: ["", "A", "B", "C", "D"], answer: "C" },
    { question: "Who loved outdoor play as a child?", id: "question4_q2", options: ["", "A", "B", "C", "D"], answer: "D" },
    { question: "Who enjoys family time with board games?", id: "question4_q3", options: ["", "A", "B", "C", "D"], answer: "A" },
    { question: "Who loved organizing pretend offices as a child?", id: "question4_q4", options: ["", "A", "B", "C", "D"], answer: "B" },
    { question: "Who finds modern schedules more flexible?", id: "question4_q5", options: ["", "A", "B", "C", "D"], answer: "A" },
    { question: "Who loved reading about careers as a child?", id: "question4_q6", options: ["", "A", "B", "C", "D"], answer: "C" },
    { question: "Who now prefers mindfulness practices?", id: "question4_q7", options: ["", "A", "B", "C", "D"], answer: "D" }
];

const correctAnswersQuestion4 = ['C', 'D', 'A', 'B', 'A', 'C', 'D'];



// 5. Câu 5 - Đề mới tháng 9 -- cập nhật 12/9
const options = [
    '',
    "Breaking New Ground in Ancient Mathematics",
    "Trailblazing Computer Science",
    "Driving Space Exploration Forward",
    "Transforming Geometry and Motion",
    "Connecting Symmetry to Physics",
    "Encouraging Diversity in STEM",
    "Breaking Through Educational Barriers",
];


const paragraph_question5 = [
    "Long before modern scientific institutions emerged, certain individuals in ancient history established the foundations of mathematics as we know it. One such pioneer was Hypatia of Alexandria, a famous philosopher and mathematician in the 4th century.",
    "The early 20th century saw remarkable advancements in computing, largely propelled by the innovative work of figures like Alan Turing. Turing’s concept of a universal machine, capable of performing any computable task, laid the foundation for modern computers.",
    "Humanity’s quest to explore the cosmos has been defined by groundbreaking milestones. From the launch of Sputnik 1 to the Apollo moon landings, each mission has broadened our understanding of space and our place in the universe.",
    "The study of geometry and motion was irrevocably altered by the works of Isaac Newton and later Albert Einstein. Newton’s laws provided the mathematical foundation for understanding motion on Earth and in space, while Einstein’s theory of general relativity revolutionized our understanding of gravity.",
    "One of the most profound ideas in modern physics is the link between symmetry and the laws of nature. Emmy Noether, a brilliant German mathematician, proved a theorem that demonstrated how physical laws are intrinsically linked to symmetrical properties.",
    "Despite advancements in science and technology, many groups remain underrepresented in STEM fields. In recent decades, educators and organizations have worked to foster more inclusive environments, offering scholarships, mentorship, and outreach programs.",
    "In many parts of the world, individuals have had to fight for the right to education, particularly in scientific disciplines. A well-known example is the story of 19th-century women who were denied entry to universities."
];



const strong2 = document.createElement('p');
strong2.innerHTML = '<strong>Mẹo nhớ Keyword:</strong> Mathematics → Computer → Space → Motion → Connecting → Diversity → Educational';

const strong3 = document.createElement('p');
strong3.innerHTML = "<strong>Nhớ theo đoạn văn:</strong> Toán học (<strong>Mathematics</strong>) là nền tảng cho khoa học máy tính (<strong>Computer</strong>) và khám phá không gian (<strong>Space</strong>), giúp chúng ta hiểu về chuyển động (<strong>Motion</strong>) và kết nối (<strong>Connecting</strong>) các kiến thức đa dạng (<strong>Diversity</strong>), từ đó phát triển giáo dục (<strong>Educational</strong>) cho tương lai.";


const questions5 = [
    { id: 'question5_q1', label: '1.', paragraph: paragraph_question5[0], correctAnswer: options[1] }, 
    { id: 'question5_q2', label: '2.', paragraph: paragraph_question5[1], correctAnswer: options[2] }, 
    { id: 'question5_q3', label: '3.', paragraph: paragraph_question5[2], correctAnswer: options[3] },  
    { id: 'question5_q4', label: '4.', paragraph: paragraph_question5[3], correctAnswer: options[4] },  
    { id: 'question5_q5', label: '5.', paragraph: paragraph_question5[4], correctAnswer: options[5] },  
    { id: 'question5_q6', label: '6.', paragraph: paragraph_question5[5], correctAnswer: options[6] },  
    { id: 'question5_q7', label: '7.', paragraph: paragraph_question5[6], correctAnswer: options[7] },  
];

// ===============================================================================================================
// ////////////// ĐẾM NGƯỢC THỜI GIAN --- COUNT DOWN ///////////////
// ===============================================================================================================
// Countdown Timer
let timeLeft = 35 * 60; // 35 minutes in seconds
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

// ===============================================================================================================
// ////////////// NÚT NHẤN NEXT VÀ BACK ///////////////
// ===============================================================================================================
let currentQuestion = 1; // Biến để theo dõi câu hỏi hiện tại

// Hàm để chuyển sang câu hỏi tiếp theo
document.getElementById('nextButton').addEventListener('click', function() {
    if (currentQuestion === 1) {
        // Ẩn câu hỏi 1 và hiển thị câu hỏi 2
        document.getElementById('question1').style.display = 'none';
        document.getElementById('question2').style.display = 'block';
        currentQuestion = 2; // Cập nhật câu hỏi hiện tại
    } else if (currentQuestion === 2) {
        // Ẩn câu hỏi 2 và hiển thị câu hỏi 3
        document.getElementById('question2').style.display = 'none';
        document.getElementById('question3').style.display = 'block';
        currentQuestion = 3; // Cập nhật câu hỏi hiện tại
    } else if (currentQuestion === 3) {
        // Ẩn câu hỏi 3 và hiển thị câu hỏi 4
        document.getElementById('question3').style.display = 'none';
        document.getElementById('question4').style.display = 'block';
        currentQuestion = 4; // Cập nhật câu hỏi hiện tại
    } else if (currentQuestion === 4) {
        // Ẩn câu hỏi 4 và hiển thị câu hỏi 5
        document.getElementById('question4').style.display = 'none';
        document.getElementById('question5').style.display = 'block';
        document.getElementById('nextButton').textContent = "Submit Test"; // Đổi văn bản nút Next
        
        currentQuestion = 5; // Cập nhật câu hỏi hiện tại
    } else if (currentQuestion === 5) {
        // Khi nút Next có văn bản là "Submit Test", hiển thị modal xác nhận
        if (document.getElementById('nextButton').textContent === "Submit Test") {
            const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));

            // Mở modal
            confirmationModal.show();

            // Loại bỏ aria-hidden khi modal được mở
            const modalElement = document.getElementById('confirmationModal');
            modalElement.removeAttribute('aria-hidden');  // Loại bỏ aria-hidden khi modal mở

            // Đảm bảo tiêu điểm chuyển đến modal
            modalElement.querySelector('.btn-close').focus();  // Đưa tiêu điểm về nút đóng modal
        }


        // Về trang chủ
         if (document.getElementById('nextButton').textContent === "Back to home") {
            window.location.href = "/home.html";
        }
    }
});

// Hàm xử lý sự kiện khi nhấn nút Back
document.getElementById('backButton').addEventListener('click', function() {
    if (currentQuestion === 2) {
        // Quay lại câu hỏi 1
        document.getElementById('question2').style.display = 'none';
        document.getElementById('question1').style.display = 'block';
        currentQuestion = 1; // Cập nhật câu hỏi hiện tại
    } else if (currentQuestion === 3) {
        // Quay lại câu hỏi 2
        document.getElementById('question3').style.display = 'none';
        document.getElementById('question2').style.display = 'block';
        currentQuestion = 2; // Cập nhật câu hỏi hiện tại
    } else if (currentQuestion === 4) {
        // Quay lại câu hỏi 3
        document.getElementById('question4').style.display = 'none';
        document.getElementById('question3').style.display = 'block';
        currentQuestion = 3; // Cập nhật câu hỏi hiện tại
    } else if (currentQuestion === 5) {
        // Quay lại câu hỏi 4
        document.getElementById('question5').style.display = 'none';
        document.getElementById('question4').style.display = 'block';
        currentQuestion = 4; // Cập nhật câu hỏi hiện tại
        document.getElementById('nextButton').textContent = "Next"; // Đổi văn bản nút Next
    }
});


// Handle the confirm submission button click
document.getElementById('confirmSubmitBtn').addEventListener('click', function() {
    // Close the modal
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    confirmationModal.hide();

    // Cập nhật nội dung khi xác nhận submit
    document.getElementById('nextButton').textContent = "Back to home";
    document.getElementById('backButton').style.display = 'none';

    // Loại bỏ aria-hidden khi modal ẩn đi
    const modalElement = document.getElementById('confirmationModal');
    modalElement.setAttribute('aria-hidden', 'true'); // Thêm lại aria-hidden khi modal ẩn

    // Đảm bảo tiêu điểm trở lại một phần tử hợp lý, chẳng hạn nút Next
    document.getElementById('nextButton').focus(); // Đưa tiêu điểm về nút Next
});



// ===============================================================================================================
// ////////////// NAVIGATOR REVIEW KẾT QUẢ ///////////////
// ===============================================================================================================
// NAVIGATOR REVIEW KẾT QUẢ
// Khi nhấn vào số câu hỏi, hiển thị kết quả so sánh của câu đó và thay đổi màu nút
document.getElementById('navQ1').addEventListener('click', function() {
    // Ẩn tất cả các kết quả trước
    document.querySelectorAll('[id^="comparisonResult_question"]').forEach(function(element) {
        element.style.display = 'none';
    });
    // Hiển thị kết quả của câu 1
    document.getElementById('comparisonResult_question1').style.display = 'block';

    // Thay đổi màu nút
    updateNavButtons('navQ1');
});

// Tương tự cho các câu hỏi 2, 3, 4, 5
document.getElementById('navQ2').addEventListener('click', function() {
    document.querySelectorAll('[id^="comparisonResult_question"]').forEach(function(element) {
        element.style.display = 'none';
    });
    document.getElementById('comparisonResult_question2').style.display = 'block';
    updateNavButtons('navQ2');
});

document.getElementById('navQ3').addEventListener('click', function() {
    document.querySelectorAll('[id^="comparisonResult_question"]').forEach(function(element) {
        element.style.display = 'none';
    });
    document.getElementById('comparisonResult_question3').style.display = 'block';
    updateNavButtons('navQ3');
});

document.getElementById('navQ4').addEventListener('click', function() {
    document.querySelectorAll('[id^="comparisonResult_question"]').forEach(function(element) {
        element.style.display = 'none';
    });
    document.getElementById('comparisonResult_question4').style.display = 'block';
    updateNavButtons('navQ4');
});

document.getElementById('navQ5').addEventListener('click', function() {
    document.querySelectorAll('[id^="comparisonResult_question"]').forEach(function(element) {
        element.style.display = 'none';
    });
    document.getElementById('comparisonResult_question5').style.display = 'block';
    updateNavButtons('navQ5');
});

// Hàm để thay đổi màu nút
function updateNavButtons(activeButtonId) {
    // Reset màu cho tất cả nút
    const buttons = document.querySelectorAll('[id^="navQ"]');
    buttons.forEach(function(button) {
        button.classList.remove('btn-active');
    });

    // Thêm màu xanh cho nút được chọn
    const activeButton = document.getElementById(activeButtonId);
    activeButton.classList.add('btn-active');
}



// ===============================================================================================================
// ////////////// CÂU HỎI 1 ///////////////
// ===============================================================================================================
// Mảng câu hỏi gồm phần đầu, đáp án và phần kết
    // const questions1 = [
    //     { questionStart: "It is a", answerOptions: ["sunny", "rainy", "beautiful"], questionEnd: "day.", correctAnswer: "sunny" },
    //     { questionStart: "I need the", answerOptions: ["summary", "details", "report"], questionEnd: "of the report.", correctAnswer: "summary" },
    //     { questionStart: "Can you print a", answerOptions: ["copy", "document", "page"], questionEnd: "for me?", correctAnswer: "document" },
    //     { questionStart: "I am", answerOptions: ["busy", "worried", "happy"], questionEnd: "with my work.", correctAnswer: "busy" },
    //     { questionStart: "I will have meetings with my", answerOptions: ["manager", "team", "boss"], questionEnd: ".", correctAnswer: "manager" }
    // ];

    // Mảng lưu đáp án của người dùng
    const userAnswers = [];

    // Chức năng hiển thị câu hỏi từ mảng
    function renderQuestions1() {
        const container = document.getElementById('questions-container');
        questions1.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('mb-3', 'd-flex', 'align-items-center', 'border', 'p-3', 'rounded', 'shadow-sm', 'bg-light');

            // Phần đầu câu hỏi
            const label = document.createElement('label');
            label.classList.add('form-label', 'me-3');
            label.setAttribute('for', `gap${index}`);
            label.innerText = `${question.questionStart}`;

            // Dropdown đáp án
            const select = document.createElement('select');
            select.classList.add('form-select', 'w-auto');
            select.id = `gap${index}`;
            select.name = `gap${index}`;
            select.addEventListener('change', function() {
                // Lưu đáp án của người dùng
                userAnswers[index] = select.value;
            });

            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.innerText = '';
            select.appendChild(emptyOption);

            question.answerOptions.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.innerText = option;
                select.appendChild(optionElement);
            });

            // Phần kết câu hỏi
            const span = document.createElement('span');
            span.classList.add('ms-3');
            span.innerText = question.questionEnd;

            questionDiv.appendChild(label);
            questionDiv.appendChild(select);
            questionDiv.appendChild(span);

            container.appendChild(questionDiv);
        });
        document.getElementById('question1_header').innerHTML = questions1_header;
    }





// --------------------------------------------------------------------------
// Lấy kết quả khi nhấn nút "confirm"
document.getElementById('confirmSubmitBtn').addEventListener('click', function() {
    const answers = [];
    const correctAnswers = [];

    // Lấy tất cả câu trả lời từ người dùng
    questions1.forEach((question, index) => {
        const selectedAnswer = userAnswers[index] || "(không chọn)";  // Nếu không có lựa chọn, sử dụng "(bỏ trống)"
        answers.push(`${question.questionStart} ${selectedAnswer} ${question.questionEnd}`);
        correctAnswers.push(`${question.questionStart} ${question.correctAnswer} ${question.questionEnd}`);
    });


    // Chỉ hiển thị khi nút nhấn id bằng 5
    question1Score = displayComparisonResultsQuestion1(userAnswers, correctAnswers);

    document.getElementById('question1').style.display = 'none';
    document.getElementById('question2').style.display = 'none';
    document.getElementById('question3').style.display = 'none';
    document.getElementById('question4').style.display = 'none';
    document.getElementById('question5').style.display = 'none';
    document.getElementById('result_navigation').style.display = 'block';
    
    
});

// Hàm hiển thị kết quả so sánh và tính điểm
function displayComparisonResultsQuestion1(userAnswers, correctAnswers) {
    const comparisonResult = document.getElementById('comparisonResult_question1');
    const comparisonBody = document.getElementById('comparisonBody_question1');
    const totalScoreElement = document.getElementById('totalScore_question1'); // Thêm phần tử hiển thị điểm tổng
    let totalScore = 0; // Biến để lưu tổng điểm

    comparisonResult.style.display = 'block';

    // Clear previous results
    comparisonBody.innerHTML = '';

    // Lặp qua các câu hỏi và so sánh đáp án của người dùng và đáp án đúng
    questions1.forEach((question, index) => {
        const tr = document.createElement('tr');

        // Kiểm tra xem người học có chọn đáp án không, nếu không thì hiển thị "(không chọn)"
        const userAnswer = userAnswers[index] || "(không chọn)";
        
        // Tính điểm cho câu hỏi
        if (userAnswer === question.correctAnswer) {
            totalScore += 2; // Nếu đúng, cộng 2 điểm
        }

        const userAnswerTd = document.createElement('td');
        userAnswerTd.innerHTML = `${question.questionStart} <span class="${userAnswer === question.correctAnswer ? 'correct' : 'incorrect'}">${userAnswer}</span> ${question.questionEnd}`;
        tr.appendChild(userAnswerTd);

        // Hiển thị đáp án đúng
        const correctAnswerTd = document.createElement('td');
        correctAnswerTd.innerHTML = `${question.questionStart} <span class="correct">${question.correctAnswer}</span> ${question.questionEnd}`;
        tr.appendChild(correctAnswerTd);
        comparisonBody.appendChild(tr);

        totalScoreElement.innerHTML = `<strong>Your score: ${totalScore} / ${correctAnswers.length*2}</strong>`;
    });

    // Trả về tổng điểm thay vì hiển thị
    return totalScore;
}


// ===============================================================================================================
// ////////////// CÂU HỎI 2 ///////////////
// ===============================================================================================================


// ===============================================================================================================
// ////////////// CÂU HỎI 2 ///////////////
// ===============================================================================================================
// Mảng câu hỏi và các lựa chọn (cards) cho question 2
// const question2Content = [
//     { 
//         text: "The first and most important thing is to choose the location", 
//         id: "item1"
//     },
//     { 
//         text: "In order to choose the right place, you need to consider several factors", 
//         id: "item2"
//     },
//     { 
//         text: "The most important of these to look at is the price of homes", 
//         id: "item3"
//     },
//     { 
//         text: "Other factors to look at is the place of employment, shops and schools", 
//         id: "item4"
//     },
//     { 
//         text: "Such requirements of course depend on your personal circumstances", 
//         id: "item5"
//     }
// ];
// Hàm trộn ngẫu nhiên (Fisher-Yates shuffle) để random các câu hỏi
function shuffleQuestions(questions) {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
}

// Hàm render các câu hỏi mà không sử dụng slot
function renderQuestion2() {
    // Random các câu hỏi
    shuffleQuestions(question2Content);
    document.getElementById('question2_topic').innerHTML = 'Topic: ' + q2_topic;
    
    // Lấy vùng chứa câu hỏi (thay vì các slot riêng biệt)
    const questionContainer = document.getElementById('question2_questions_container');
    
    // Lặp qua mảng question2Content và tạo các thẻ card tương ứng
    question2Content.forEach((item, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card', 'mb-2', 'draggable-item');
        cardDiv.setAttribute('draggable', 'true');
        cardDiv.id = item.id;

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        cardBody.innerText = item.text;  // Gán nội dung câu hỏi vào card body

        cardDiv.appendChild(cardBody);
        questionContainer.appendChild(cardDiv); // Đưa card vào container chung
    });

    // Gọi lại sự kiện kéo thả sau khi render xong
    initSortable();
}

// Hàm khởi tạo SortableJS cho các phần tử kéo thả
function initSortable() {
    const questionContainer = document.getElementById('question2_questions_container');
    
    new Sortable(questionContainer, {
        group: 'shared',
        animation: 150,
        onAdd: function (evt) {
            const targetContainer = evt.to;
            const draggedItem = evt.item;
            
            // Kiểm tra có thể hoán đổi vị trí không nếu cần thiết
            if (targetContainer.children.length > 1) {
                const existingItem = [...targetContainer.children].find(child => child !== draggedItem);
                evt.from.appendChild(existingItem); // Hoán đổi lại nếu có
            }
        }
    });
}
// Mảng lưu đáp án của người học
const correctAnswersQuestion2 = question2Content.map(item => item.text);
const userAnswersQuestion2 = [];

// Hàm lấy kết quả khi người học hoàn thành
document.getElementById('confirmSubmitBtn').addEventListener('click', function() {
    // Lấy kết quả từ các câu hỏi đã render
    userAnswersQuestion2.length = 0; // Reset mảng userAnswers

    // Lặp qua các câu hỏi trong container và lấy câu trả lời của người học
    const questionContainer = document.getElementById('question2_questions_container');
    const cards = questionContainer.querySelectorAll('.draggable-item');

    cards.forEach((card) => {
        const selectedAnswer = card.textContent.trim() || "(không chọn)";
        userAnswersQuestion2.push(selectedAnswer);
    });

    // So sánh kết quả người học với đáp án đúng
    const answers = [];
    const correctAnswers = [];

    correctAnswersQuestion2.forEach((correctAnswer, index) => {
        const selectedAnswer = userAnswersQuestion2[index] || "(không chọn)";  // Nếu không có lựa chọn, sử dụng "(không chọn)"
        answers.push(selectedAnswer);
        correctAnswers.push(correctAnswer);
    });

    // Hiển thị kết quả so sánh
    question2Score = displayComparisonResultsQuestion2(answers, correctAnswers);
});

// Hiển thị đáp án đúng
function displayComparisonResultsQuestion2(userAnswers, correctAnswers) {
    const comparisonResult = document.getElementById('comparisonResult_question2');
    const comparisonBody = document.getElementById('comparisonBody_question2');
    const totalScoreElement = document.getElementById('totalScore_question2');
    
    comparisonBody.innerHTML = ''; // Clear previous results
    let score = 0; // Variable to keep track of the score

    // Loop through the user's answers and compare with correct answers
    userAnswers.forEach((userAnswer, index) => {
        const tr = document.createElement('tr');

        // User's answer cell
        const userAnswerTd = document.createElement('td');
        userAnswerTd.innerHTML = `<span class="${userAnswer === correctAnswers[index] ? 'correct' : 'incorrect'}">${userAnswer}</span>`;
        tr.appendChild(userAnswerTd);

        // Correct answer cell
        const correctAnswerTd = document.createElement('td');
        correctAnswerTd.innerHTML = `<span class="correct">${correctAnswers[index]}</span>`;
        tr.appendChild(correctAnswerTd);

        // If the user's answer is correct, increment score
        if (userAnswer === correctAnswers[index]) {
            score++;
        }

        comparisonBody.appendChild(tr);
    });

    // Display the score in the result section (optional)
    totalScoreElement.innerHTML = `<strong>Your score: ${score} / ${correctAnswers.length}</strong>`;

    // Return the score
    return score;
}

// ===============================================================================================================
// ////////////// CÂU HỎI 3 ///////////////
// ===============================================================================================================

// Hàm render các câu hỏi vào trong container (không dùng slot cho Question 3)
function renderQuestion3() {
    document.getElementById('question3_topic').innerHTML = 'Topic: ' + q3_topic;
    shuffleQuestions(question3Content);

    // Lấy container để chứa câu hỏi (thay vì dùng slot)
    const questionContainer = document.getElementById('question3_questions_container');

    // Lặp qua mảng question3Content và tạo các thẻ card tương ứng
    question3Content.forEach((item, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card', 'mb-2', 'draggable-item');
        cardDiv.setAttribute('draggable', 'true');
        cardDiv.id = item.id;

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        cardBody.innerText = item.text;  // Gán nội dung câu hỏi vào card body

        cardDiv.appendChild(cardBody);
        questionContainer.appendChild(cardDiv); // Đưa card vào container
    });

    // Gọi lại sự kiện kéo thả sau khi render xong
    initSortable3();
}

// Hàm khởi tạo SortableJS cho các phần tử kéo thả
function initSortable3() {
    // Khởi tạo Sortable cho container
    const questionContainer = document.getElementById('question3_questions_container');
    
    new Sortable(questionContainer, {
        group: 'q3_shared',
        animation: 150,
        onAdd: function (evt) {
            const targetContainer = evt.to;
            const draggedItem = evt.item;

            if (targetContainer.children.length > 1) {
                // Nếu container đã có item, cần hoán đổi
                const existingItem = [...targetContainer.children].find(child => child !== draggedItem);

                // Nếu kéo từ container khác → trả item cũ về lại vị trí ban đầu
                evt.from.appendChild(existingItem);
            }
        }
    });
}

// Xử lý kết quả
const correctAnswersquestion3 = question3Content.map(item => item.text);
const userAnswersquestion3 = [];

document.getElementById('confirmSubmitBtn').addEventListener('click', function() {
    userAnswersquestion3.length = 0; 
    
    // Lấy các câu trả lời từ các card trong container
    const questionContainer = document.getElementById('question3_questions_container');
    const cards = questionContainer.querySelectorAll('.draggable-item');

    cards.forEach((card) => {
        const selectedAnswer = card.textContent.trim() || "(không chọn)";
        userAnswersquestion3.push(selectedAnswer);
    });

    const answers = [];
    const correctAnswers = [];

    correctAnswersquestion3.forEach((correctAnswer, index) => {
        const selectedAnswer = userAnswersquestion3[index] || "(không chọn)";  // Nếu không có lựa chọn, sử dụng "(không chọn)"
        answers.push(selectedAnswer);
        correctAnswers.push(correctAnswer);
    });

    // Hiển thị kết quả so sánh
    question3Score = displayComparisonResultsquestion3(answers, correctAnswers);
});

// Hiển thị đáp án đúng
function displayComparisonResultsquestion3(userAnswers, correctAnswers) {
    const comparisonResult = document.getElementById('comparisonResult_question3');
    const comparisonBody = document.getElementById('comparisonBody_question3');
    const totalScoreElement = document.getElementById('totalScore_question3');
    
    comparisonBody.innerHTML = ''; // Clear previous results
    let score = 0; // Variable to keep track of the score

    // Loop through the user's answers and compare with correct answers
    userAnswers.forEach((userAnswer, index) => {
        const tr = document.createElement('tr');

        // User's answer cell
        const userAnswerTd = document.createElement('td');
        userAnswerTd.innerHTML = `<span class="${userAnswer === correctAnswers[index] ? 'correct' : 'incorrect'}">${userAnswer}</span>`;
        tr.appendChild(userAnswerTd);

        // Correct answer cell
        const correctAnswerTd = document.createElement('td');
        correctAnswerTd.innerHTML = `<span class="correct">${correctAnswers[index]}</span>`;
        tr.appendChild(correctAnswerTd);

        // If the user's answer is correct, increment score
        if (userAnswer === correctAnswers[index]) {
            score++;
        }

        comparisonBody.appendChild(tr);
    });

    // Display the score in the result section (optional)
    totalScoreElement.innerHTML = `<strong>Your score: ${score} / ${correctAnswers.length}</strong>`;

    // Return the score
    return score;
}


// ===============================================================================================================
// ////////////// MẢNG CÂU HỎI VÀ ĐÁP ÁN CÂU HỎI 4 ///////////////
// ===============================================================================================================

// // Mảng câu hỏi và các lựa chọn
// const question4Content = [
//     { question: "Who thinks the park is a beautiful place to relax?", id: "question4_q1", options: ["","A", "B", "C", "D"] },
//     { question: "Who thinks volunteering will help with future employment?", id: "question4_q2", options: ["","A", "B", "C", "D"] },
//     { question: "Who thinks local areas need cleaning?", id: "question4_q3", options: ["","A", "B", "C", "D"] },
//     { question: "Who will ask for others to help?", id: "question4_q4", options: ["","A", "B", "C", "D"] },
//     { question: "Who can’t clean the park because of their busy work?", id: "question4_q5", options: ["","A", "B", "C", "D"] },
//     { question: "Who thinks the cleaning needs to be done regularly?", id: "question4_q6", options: ["","A", "B", "C", "D"] },
//     { question: "Who thinks volunteering is important for students?", id: "question4_q7", options: ["","A", "B", "C", "D"] }
// ];

// // Mảng nội dung các đoạn văn
// const question4Text = [
//     "<strong>Four people respond in the comments section of an online magazine article about above topic. Read the texts and then answer the questions.</strong>",
//     "<strong>A:</strong> I feel very lucky to have this park here. My family and I often go to the park because of the natural landscape here. It's different from the city, which is very busy and full of dust. Unfortunately, I am away this weekend so I cannot help with the cleaning. However, I know my brother and his friends will be very interested in this cleanup so I will ask them if they can help.",
//     "<strong>B:</strong> I’m a very busy person and I have to spend this weekend with my family because I only have the weekend as free time. I think young people who don’t have families should help. Besides, students and schools also have days off on weekends. I think this volunteering will be very helpful for students’ future careers.",
//     "<strong>C:</strong> I think this volunteering is a good idea but it doesn’t have a long-term vision. When volunteers clean up the park, it will be clean, but it will become busy again after about a month when tourist season arrives. I think we should clean this park regularly about once a month. Surrounding areas such as the lake and local forest should also be cleaned up. We should also have signs telling visitors to clean up their trash. I am very upset when I see a lot of trash on both sides of the road.",
//     "<strong>D:</strong> My family and I often spend time at the park. My children love going to the park and they find the park a very interesting place to visit. My son has a dream of becoming a biologist so I think cleaning up this park will be very helpful for my son. I think we should pique children’s interest in cleaning. They will be more willing to volunteer and help others."
// ];

// // Mảng đáp án đúng cho câu hỏi 4
// const correctAnswersQuestion4 = ['A', 'B', 'C', 'A', 'B', 'C', 'D']; // Mảng các đáp án đúng



// ===============================================================================================================
// ////////////// RENDER CÂU HỎI 4 VÀ ĐÁP ÁN ///////////////
// ===============================================================================================================
function renderQuestion4() {
    document.getElementById('question4_topic').innerHTML = 'Topic: ' + q4_topic;
    const container = document.getElementById('question4');
    const row = container.querySelector('.row');

    // Render các đoạn văn vào cột bên trái
    const leftColumn = row.querySelector('.col-md-7');
    question4Text.forEach(text => {
        const p = document.createElement('p');
        p.innerHTML = text;  // Allow HTML inside text (for <strong> tags)
        leftColumn.appendChild(p);
    });

    // Render các câu hỏi và dropdown vào cột bên phải
    const rightColumn = row.querySelector('.col-md-5');
    const form = rightColumn.querySelector('form');

    question4Content.forEach(item => {
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
}

// 2. Xử lý kết quả khi nhấn submit
document.getElementById('confirmSubmitBtn').addEventListener('click', function() {
    const answers = [];
    const correctAnswers = [];

    // Lặp qua các câu hỏi và lấy đáp án người học, sau đó so sánh với đáp án đúng
    for (let i = 0; i < 7; i++) {
        const selectElement = document.getElementById(`question4_q${i + 1}`);
        if (selectElement) {
            const selectedAnswer = selectElement.value || "(không chọn)";
            answers.push(selectedAnswer);
            correctAnswers.push(correctAnswersQuestion4[i]);
        } else {
            console.error(`Element with id 'question4_q${i + 1}' not found`);
        }
    }

    // Hiển thị kết quả so sánh
    question4Score = displayComparisonResultsQuestion4(answers, correctAnswers);
});

// Hàm hiển thị kết quả so sánh và điểm số cùng với các đoạn văn
function displayComparisonResultsQuestion4(userAnswers, correctAnswers) {
    const comparisonResult = document.getElementById('comparisonResult_question4');
    const comparisonBody = document.getElementById('comparisonBody_question4');
    const totalScoreElement = document.getElementById('totalScore_question4');
    const textContainer = document.getElementById('question4_textContainer');
    
    // Clear previous results
    comparisonBody.innerHTML = '';
    textContainer.innerHTML = '';

    // Thêm các đoạn văn vào phần kết quả (phần trước bảng kết quả)
    question4Text.forEach(text => {
        const p = document.createElement('p');
        p.innerHTML = text;  // Allow HTML inside text (for <strong> tags)
        textContainer.appendChild(p);
    });

    // Tính điểm
    let score = 0;

    // Lặp qua các câu hỏi từ mảng question4Content và hiển thị đáp án người học và đáp án đúng
    question4Content.forEach((item, index) => {
        const tr = document.createElement('tr');

        // Cột câu hỏi
        const questionTd = document.createElement('td');
        questionTd.innerHTML = item.question;  // Lấy câu hỏi từ question4Content
        tr.appendChild(questionTd);

        // Cột đáp án người học
        const userAnswerTd = document.createElement('td');
        const userAnswer = userAnswers[index] || "(không chọn)";
        userAnswerTd.innerHTML = `<span class="${userAnswer === correctAnswers[index] ? 'correct' : 'incorrect'}">${userAnswer}</span>`;
        tr.appendChild(userAnswerTd);

        // Cột đáp án đúng
        const correctAnswerTd = document.createElement('td');
        correctAnswerTd.innerHTML = `<span class="correct">${correctAnswers[index]}</span>`;
        tr.appendChild(correctAnswerTd);

        // Nếu người học chọn đúng, cộng điểm
        if (userAnswer === correctAnswers[index]) {
            score += 2;
        }

        comparisonBody.appendChild(tr);
    });

    // Hiển thị điểm số vào phần tử có id "totalScore_question4"
    totalScoreElement.innerHTML = `<strong>Your score: ${score} / ${correctAnswers.length * 2}</strong>`;

    // Trả về điểm số
    return score;
}




// ===============================================================================================================
// ////////////// CÂU HỎI 5 ///////////////
// ===============================================================================================================
// // Dữ liệu cho các câu hỏi
// const questions5 = [
//     { id: 'question5_q1', label: '1.', paragraph: 'Long time ago, zoos were reserved exclusively for monarchs and aristocrats...', correctAnswer: 'symbol' },
//     { id: 'question5_q2', label: '2.', paragraph: 'It wasn’t until the reign of England’s King John...', correctAnswer: 'opening' },
//     { id: 'question5_q3', label: '3.', paragraph: 'As societal beliefs progressed, zoos took on a more educational role...', correctAnswer: 'amusement' },
//     { id: 'question5_q4', label: '4.', paragraph: 'In the 19th century, there was a significant change...', correctAnswer: 'freedom' },
//     { id: 'question5_q5', label: '5.', paragraph: 'As culture and ethics evolve, zoos are reevaluating their beliefs...', correctAnswer: 'different' },
//     { id: 'question5_q6', label: '6.', paragraph: 'As culture and ethics evolve, zoos are reevaluating their beliefs...', correctAnswer: 'new' },
//     { id: 'question5_q7', label: '7.', paragraph: 'As culture and ethics evolve, zoos are reevaluating their beliefs...', correctAnswer: 'modern' },
// ];

// // Mảng các giá trị trong <option>
// const options = ['symbol', 'opening', 'amusement', 'freedom', 'different', 'new', 'modern'];

// Lấy container để chứa các câu hỏi
const container = document.getElementById('question5-container');  // Cập nhật id container
document.getElementById('question5_topic').innerHTML = 'Topic: ' + q5_topic;

// ===============================================================================================================
// ////////////// TẠO ĐÁP ÁN VÀ GIẢI THÍCH (ANSWER BOX) ///////////////
// ===============================================================================================================
// Lấy các phần tử cần thiết

const showAnswerButton = document.getElementById('showAnswerButton');
const answerModal = new bootstrap.Modal(document.getElementById('answerModal'));
const modalBody = document.getElementById('modal-body');

// Tạo các phần tử động
const strong1 = document.createElement('p');
strong1.innerHTML = '<strong>Học mẹo nếu bạn cần học gấp:</strong>';
// Thêm các phần tử vào modalBody khi nút "Xem mẹo" được nhấn
showAnswerButton.addEventListener('click', function() {
    // Xóa nội dung cũ
    modalBody.innerHTML = '';

    // Thêm các phần tử vào modalBody
    modalBody.appendChild(strong1);
    modalBody.appendChild(strong2);
    modalBody.appendChild(strong3);

    // Hiển thị modal
    answerModal.show();
});

// 1. Tạo các câu hỏi động
questions5.forEach(question => {
    // Tạo phần tử div chứa câu hỏi
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('mb-3');

    // Tạo một div cha có display: flex để hiển thị label và select trên cùng một hàng
    const questionRow = document.createElement('div');
    questionRow.style.display = 'flex';
    questionRow.style.alignItems = 'center'; // Căn chỉnh các phần tử giữa theo chiều dọc

    // Tạo label cho câu hỏi
    const label = document.createElement('label');
    label.setAttribute('for', question.id);
    label.classList.add('form-label');
    label.textContent = question.label;
    label.style.marginRight = '10px'; // Thêm khoảng cách giữa label và select

    // Tạo phần tử select cho câu hỏi
    const select = document.createElement('select');
    select.classList.add('form-select');
    select.id = question.id;

    // Thêm các option vào select
    // options.forEach(optionValue => {
    //     const option = document.createElement('option');
    //     option.value = optionValue;
    //     option.textContent = optionValue.charAt(0).toUpperCase() + optionValue.slice(1); // Viết hoa chữ cái đầu tiên
    //     select.appendChild(option);
    // });


// Hàm Fisher-Yates Shuffle để random mảng (bỏ qua phần tử đầu tiên)
function shuffleArray(arr) {
    const firstElement = arr[0]; // Lưu phần tử đầu tiên (rỗng)

    // Tách phần tử đầu tiên và xáo trộn phần còn lại của mảng
    const remainingElements = arr.slice(1);

    // Xáo trộn phần còn lại của mảng
    for (let i = remainingElements.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remainingElements[i], remainingElements[j]] = [remainingElements[j], remainingElements[i]]; // Swap elements
    }

    // Thêm lại phần tử đầu tiên vào đầu mảng đã xáo trộn
    remainingElements.unshift(firstElement);

    return remainingElements;
}

    // Xáo trộn mảng options
    shuffleArray(options);

// Xáo trộn mảng options, phần tử đầu tiên vẫn giữ nguyên
const shuffledOptions = shuffleArray(options);

// Lấy select element từ DOM

// Thêm các option vào select
shuffledOptions.forEach(optionValue => {
    const option = document.createElement('option');
    option.value = optionValue;
    option.textContent = optionValue.charAt(0).toUpperCase() + optionValue.slice(1); // Viết hoa chữ cái đầu tiên

    // Thêm option vào select
    select.appendChild(option);
});

    // Thêm label và select vào questionRow (div cha)
    questionRow.appendChild(label);
    questionRow.appendChild(select);

    // Tạo đoạn văn ẩn cho từng câu hỏi
    const paragraph = document.createElement('p');
    paragraph.classList.add('mt-2');
    paragraph.id = `paragraph${question.id.slice(10)}`; // Cắt id phần "question5_"
    paragraph.style.display = 'none'; // Đảm bảo đoạn văn ẩn khi tải trang
    paragraph.textContent = question.paragraph;

    // Ghép các phần tử vào questionDiv
    questionDiv.appendChild(questionRow);
    questionDiv.appendChild(paragraph);

    // Thêm câu hỏi vào container
    container.appendChild(questionDiv);
});




// 2. Xử lý kết quả

// Hàm lấy kết quả khi nhấn nút "Submit Test"
document.getElementById('confirmSubmitBtn').addEventListener('click', function() {
    const answers = [];
    const correctAnswers = [];

    // Lặp qua các câu hỏi và lưu đáp án người học, sau đó so sánh với đáp án đúng
    questions5.forEach((question, index) => {
        const selectedAnswer = document.getElementById(question.id).value || "(không chọn)";  // Lấy đáp án từ các select box
        answers.push(selectedAnswer);
        correctAnswers.push(question.correctAnswer);
    });

    // Hiển thị kết quả so sánh
    question5Score = displayComparisonResultsQuestion5(answers, correctAnswers);
});
// Hàm hiển thị kết quả so sánh và điểm số
function displayComparisonResultsQuestion5(userAnswers, correctAnswers) {
    const comparisonResult = document.getElementById('comparisonResult_question5');
    const comparisonBody = document.getElementById('comparisonBody_question5');
    const totalScoreElement = document.getElementById('totalScore_question5');
    
    // Clear previous results
    comparisonBody.innerHTML = '';

    // Tính điểm
    let score = 0;

    // Lặp qua các câu hỏi và so sánh đáp án của người dùng và đáp án đúng
    userAnswers.forEach((userAnswer, index) => {
        const tr = document.createElement('tr');

        // Kiểm tra xem người học có chọn đáp án không, nếu không thì hiển thị "(bỏ trống)"
        const userAnswerTd = document.createElement('td');
        userAnswerTd.innerHTML = `<span class="${userAnswer === correctAnswers[index] ? 'correct' : 'incorrect'}">${userAnswer}</span>`;
        tr.appendChild(userAnswerTd);

        // Hiển thị đáp án đúng
        const correctAnswerTd = document.createElement('td');
        correctAnswerTd.innerHTML = `<span class="correct">${correctAnswers[index]}</span>`;
        tr.appendChild(correctAnswerTd);

        // Nếu người học chọn đúng, cộng điểm
        if (userAnswer === correctAnswers[index]) {
            score += 2;
        }

        comparisonBody.appendChild(tr);
    });

    // Hiển thị điểm số vào phần tử có id "totalScore_question5"
    totalScoreElement.innerHTML = `<strong>Your score: ${score} / ${correctAnswers.length*2}</strong>`;

    // Trả về điểm số
    return score;
}


// ===============================================================================================================
// ////////////// HIỂN THỊ ĐOẠN VĂN VÀ XEM MẸO ///////////////
// ===============================================================================================================

// Hiển thị/Ẩn đoạn văn khi nhấn nút "Hiển thị đoạn văn"
document.getElementById('showParagraphButton').addEventListener('click', function() {
    const paragraphs = document.querySelectorAll('.mt-2');
    paragraphs.forEach(paragraph => {
        paragraph.style.display = (paragraph.style.display === 'none' || paragraph.style.display === '') ? 'block' : 'none';
    });
});

// Hiển thị/Ẩn đáp án khi nhấn nút "Xem mẹo"
document.getElementById('showAnswerButton').addEventListener('click', function() {
    const answerBox = document.getElementById('answerBox');
    answerBox.style.display = (answerBox.style.display === 'none' || answerBox.style.display === '') ? 'block' : 'none';
});




// 1. Hiển thị câu hỏi khi trang được load
window.onload = function() {
    renderQuestions1();  // Gọi hàm renderQuestions1
    renderQuestion4();   // Gọi hàm renderQuestion4
    renderQuestion2();
    renderQuestion3();
};










// ===============================================================================================================
// ////////////// TÍNH TỔNG ĐIỂM VÀ PHÂN LOẠI CẤP BẬC ///////////////
// ===============================================================================================================
var question1Score = 0;
var question2Score = 0;
var question3Score = 0;
var question4Score = 0;
var question5Score = 0;
function calculateTotalScore() {
    var totalScore = 0;
    totalScore = question1Score + question2Score + question3Score + question4Score + question5Score;
    
    if (totalScore === 48) {
        totalScore = 50;
    }
    document.getElementById('totalScore').innerText = `Total Score: ${totalScore} / 50`;
    classifyScore(totalScore);

}

// 2. Phân loại điểm
function classifyScore(score) {
    let grade = '';
    
    if (score >= 46) {
        grade = 'C1';
    } else if (score >= 38) {
        grade = 'B2';
    } else if (score >= 26) {
        grade = 'B1';
    } else if (score >= 16) {
        grade = 'A2';
    }else {
        grade = 'A1';
    }
    document.getElementById('scoreClassification').innerText = `Your grade: ${grade}`;
}
document.getElementById('confirmSubmitBtn').addEventListener('click', function() {
    calculateTotalScore();
    document.getElementById('result_navigation').style.display = 'block';
});




// Kết thúc
});
