// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI PART 1 ///////////////
// ===============================================================================================================

// qưeqweqw
const questions1_1 = [
    { questionStart: "eqweqwe", answerOptions: ["qưeqweqw", "ưqwqe", "ưqeqewqweqwe"], questionEnd: "eqweqweqwe", correctAnswer: "qưeqweqweqwe" },
    { questionStart: "sàdsadsad", answerOptions: ["sàdsadsad", "sàdsadsad", "sàdsadsad"], questionEnd: "sàdsadsad", correctAnswer: "sàdsadsad" },
];

const questionsArrays = [
    questions1_1,
];

document.addEventListener('DOMContentLoaded', function() {

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

    let currentArrayIndex = 0;
    const userAnswers = [];

    // Hàm để render câu hỏi từ mảng
    function renderQuestions() {
        const container = document.getElementById('questions-container');
        container.innerHTML = ''; // Xóa câu hỏi cũ

        const questions = questionsArrays[currentArrayIndex];
        questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('mb-3', 'd-flex', 'align-items-center', 'border', 'p-3', 'rounded', 'shadow-sm', 'bg-light');

            const label = document.createElement('label');
            label.classList.add('form-label', 'me-3');
            label.setAttribute('for', `gap${index}`);
            label.innerText = `${question.questionStart}`;

            const select = document.createElement('select');
            select.classList.add('form-select', 'w-auto');
            select.id = `gap${index}`;
            select.name = `gap${index}`;
            select.addEventListener('change', function() {
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

            const span = document.createElement('span');
            span.classList.add('ms-3');
            span.innerText = question.questionEnd;

            questionDiv.appendChild(label);
            questionDiv.appendChild(select);
            questionDiv.appendChild(span);

            container.appendChild(questionDiv);
        });
        const questions1_header_length = questionsArrays.length;

        document.getElementById('question1_header').innerHTML = `Reading Question 1 (${currentArrayIndex + 1}/${questions1_header_length})`;
    }

    // Render câu hỏi ban đầu
    renderQuestions();

    // Hàm chuyển đến câu hỏi tiếp theo
    document.getElementById('nextButton').addEventListener('click', function() {
        if (currentArrayIndex < questionsArrays.length - 1) {
            currentArrayIndex++;
            renderQuestions();
        } else {
            document.getElementById('checkResultButton').style.display = 'block';
            document.getElementById('nextButton').textContent = 'The end';
        }
    });

    // Hàm quay lại câu hỏi trước đó
    document.getElementById('backButton').addEventListener('click', function() {
        if (currentArrayIndex > 0) {
            currentArrayIndex--;
            renderQuestions();
            document.getElementById('nextButton').textContent = 'Next';
        }
    });

    // Hiển thị kết quả khi nhấn nút Check Result
    document.getElementById('checkResultButton').addEventListener('click', function() {
        const comparisonTableBody = document.getElementById('comparisonTableBody');
        comparisonTableBody.innerHTML = ''; // Xóa kết quả cũ

        const questions = questionsArrays[currentArrayIndex];

        questions.forEach((question, index) => {
            const userAnswer = userAnswers[index] || "(không chọn)";
            const correctAnswer = question.correctAnswer;

            const tr = document.createElement('tr');

            const userAnswerTd = document.createElement('td');
            userAnswerTd.innerHTML = `${userAnswer}`;
            if (userAnswer === correctAnswer) {
                userAnswerTd.classList.add('text-success');
            } else {
                userAnswerTd.classList.add('text-danger');
            }
            tr.appendChild(userAnswerTd);

            const correctAnswerTd = document.createElement('td');
            correctAnswerTd.innerHTML = `${correctAnswer}`;
            correctAnswerTd.classList.add('text-success');
            tr.appendChild(correctAnswerTd);

            comparisonTableBody.appendChild(tr);
        });

        document.getElementById('totalScore').innerText = 'Your Score: ' + calculateScore(userAnswers, questionsArrays);
        document.getElementById('scoreClassification').innerText = 'Classification: ' + getScoreClassification(calculateScore(userAnswers, questionsArrays));

        const myModal = new bootstrap.Modal(document.getElementById('resultModal'));
        myModal.show();
    });

    // Tính điểm
    function calculateScore(userAnswers, questionsArrays) {
        let score = 0;
        const questions = questionsArrays[currentArrayIndex];
        questions.forEach((question, index) => {
            if (userAnswers[index] === question.correctAnswer) {
                score += 2;
            }
        });
        return score;
    }

    // Phân loại điểm
    function getScoreClassification(score) {
        if (score >= 10) {
            return 'Excellent';
        } else if (score >= 5) {
            return 'Good';
        } else {
            return 'Cố gắng thêm nhé!';
        }
    }
});
