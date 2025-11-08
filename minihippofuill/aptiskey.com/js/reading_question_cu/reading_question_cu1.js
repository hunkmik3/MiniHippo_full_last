// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI ///////////////
// ===============================================================================================================
// 1. Câu 1
const questions1_1 = [
    { questionStart: "I am always", answerOptions: ["hate", "late", "meet"], questionEnd: "for school.", correctAnswer: "late" },
    { questionStart: "In the morning, I usually attend", answerOptions: ["meetings", "park", "working"], questionEnd: ".", correctAnswer: "meetings" },
    { questionStart: "I like to relax in the", answerOptions: ["sky", "park", "gym"], questionEnd: "during the day.", correctAnswer: "park" },
    { questionStart: "I often buy food at the", answerOptions: ["square", "street", "shop"], questionEnd: "near my house.", correctAnswer: "shop" },
    { questionStart: "I love to", answerOptions: ["cook", "make", "build"], questionEnd: "dinner for my family.", correctAnswer: "cook" }
];
const questions1_2 = [
    { questionStart: "6. It is a", answerOptions: ["short", "long", "hard"], questionEnd: "day.", correctAnswer: "long" },
    { questionStart: "7. I need the", answerOptions: ["summary", "detail", "report"], questionEnd: "of the report.", correctAnswer: "detail" },
    { questionStart: "8. Can you print a", answerOptions: ["copy", "disk", "language"], questionEnd: "for me?", correctAnswer: "copy" },
    { questionStart: "9. I am very", answerOptions: ["love", "busy", "hate"], questionEnd: "with my work.", correctAnswer: "busy" },
    { questionStart: "10. I will have meetings with my", answerOptions: ["client", "dogs", "birds"], questionEnd: "this afternoon.", correctAnswer: "client" }
];
// 1. Câu 1
const questions1_3 = [
    { questionStart: "11. My colleague is", answerOptions: ["healthy", "sick", "birthday"], questionEnd: "today.", correctAnswer: "sick" },
    { questionStart: "12. I need to", answerOptions: ["speak", "booking", "read"], questionEnd: "a report.", correctAnswer: "read" },
    { questionStart: "13. I have a", answerOptions: ["party", "meeting", "break"], questionEnd: "soon.", correctAnswer: "meeting" },
    { questionStart: "14. The phone is", answerOptions: ["ringing", "silent", "turn"], questionEnd: ".", correctAnswer: "ringing" },
    { questionStart: "15. I need to", answerOptions: ["eat", "drink", "sleep"], questionEnd: "some coffee.", correctAnswer: "drink" }
];
const questions1_4 = [
    { questionStart: "16. I wake up", answerOptions: ["early", "fast", "quickly"], questionEnd: "every day.", correctAnswer: "early" },
    { questionStart: "17. I have", answerOptions: ["coffee", "lunch", "windows"], questionEnd: "at noon.", correctAnswer: "lunch" },
    { questionStart: "18. I", answerOptions: ["leave", "live", "stay"], questionEnd: "the house at 8 AM.", correctAnswer: "leave" },
    { questionStart: "19. I drive to work in my new", answerOptions: ["plane", "bike", "car"], questionEnd: ".", correctAnswer: "car" },
    { questionStart: "20. I sleep when I feel", answerOptions: ["full", "sleepy", "hungry"], questionEnd: ".", correctAnswer: "sleepy" }
];
const questions1_5 = [
    { questionStart: "21. My dog is", answerOptions: ["friendly", "run", "sleepy"], questionEnd: ".", correctAnswer: "friendly" },
    { questionStart: "22. This is the", answerOptions: ["weekend", "boring", "first"], questionEnd: "book I read.", correctAnswer: "first" },
    { questionStart: "23. I can", answerOptions: ["skip", "sleep", "walk"], questionEnd: "to the park.", correctAnswer: "walk" },
    { questionStart: "24. He can", answerOptions: ["run", "speak", "dance"], questionEnd: "English very well.", correctAnswer: "speak" },
    { questionStart: "25. We eat dinner", answerOptions: ["working", "alone", "together"], questionEnd: "every evening.", correctAnswer: "together" }
];
const questions1_6 = [
    { questionStart: "26. I imagine you don’t want to", answerOptions: ["ignore", "skip", "miss"], questionEnd: "this.", correctAnswer: "miss" },
    { questionStart: "27. I", answerOptions: ["called", "talk", "emailed"], questionEnd: "you earlier but you were not home.", correctAnswer: "called" },
    { questionStart: "28. Can you be", answerOptions: ["late", "ready", "slow"], questionEnd: "before 7pm?", correctAnswer: "ready" },
    { questionStart: "29. I can", answerOptions: ["take", "run", "meet"], questionEnd: "you at your place then.", correctAnswer: "meet" },
    { questionStart: "30. Don't have too much", answerOptions: ["running", "dinner", "work"], questionEnd: "because we're going to eat cake.", correctAnswer: "dinner" }
];
const questions1_7 = [
    { questionStart: "31. The books don't", answerOptions: ["balance", "fall", "stand"], questionEnd: "on the shelf.", correctAnswer: "balance" },
    { questionStart: "32. Could you get the financial", answerOptions: ["statement", "report", "class"], questionEnd: "for me?", correctAnswer: "statement" },
    { questionStart: "33. I", answerOptions: ["guess", "think", "learn"], questionEnd: "it will be useful for the project.", correctAnswer: "think" },
    { questionStart: "34. Read the instructions", answerOptions: ["carefully", "quickly", "slowly"], questionEnd: ", not quickly.", correctAnswer: "slowly" },
    { questionStart: "35. Send me the report", answerOptions: ["late", "before", "late"], questionEnd: "the meeting, not after.", correctAnswer: "before" }
];
const questions1_8 = [
    { questionStart: "36. I", answerOptions: ["live", "work", "run"], questionEnd: "in a house.", correctAnswer: "live" },
    { questionStart: "37. I", answerOptions: ["study", "eat", "share"], questionEnd: "my room with my brother.", correctAnswer: "share" },
    { questionStart: "38. We are in the same", answerOptions: ["sky", "park", "class"], questionEnd: "at school.", correctAnswer: "class" },
    { questionStart: "39. We", answerOptions: ["run", "drive", "study"], questionEnd: "to the park.", correctAnswer: "drive" },
    { questionStart: "40. We like to", answerOptions: ["cook", "hate", "love"], questionEnd: "together.", correctAnswer: "cook" }
];
const questions1_9 = [
    { questionStart: "41. The sky is", answerOptions: ["clear", "running", "busy"], questionEnd: "today.", correctAnswer: "clear" },
    { questionStart: "42. I had an", answerOptions: ["sad", "love", "enjoyable"], questionEnd: "lunch with my friends.", correctAnswer: "enjoyable" },
    { questionStart: "43. After", answerOptions: ["gaming", "eat", "working"], questionEnd: "for hours, I felt tired.", correctAnswer: "working" },
    { questionStart: "44. I hope to", answerOptions: ["write", "read", "sing"], questionEnd: "that book soon.", correctAnswer: "read" },
    { questionStart: "45. The", answerOptions: ["sea", "sun", "tree"], questionEnd: "is shining brightly today.", correctAnswer: "sun" }
];
const questions1_10 = [
    { questionStart: "46. I was looking at the art in the", answerOptions: ["game", "window", "sky"], questionEnd: ".", correctAnswer: "window" },
    { questionStart: "47. I didn't", answerOptions: ["buy", "eat", "take"], questionEnd: "it because it was too expensive.", correctAnswer: "buy" },
    { questionStart: "48. I bought vegetables at the", answerOptions: ["home", "park", "market"], questionEnd: ".", correctAnswer: "market" },
    { questionStart: "49. I ate", answerOptions: ["stone", "cake", "fruit"], questionEnd: "after dinner.", correctAnswer: "cake" },
    { questionStart: "50. I", answerOptions: ["read", "see", "watched"], questionEnd: "a TV show last night.", correctAnswer: "watched" }
];
const questions1_11 = [
    { questionStart: "51. The weather is", answerOptions: ["fly", "great", "hate"], questionEnd: ".", correctAnswer: "great" },
    { questionStart: "52. We are on the", answerOptions: ["sky", "sea", "boat"], questionEnd: ".", correctAnswer: "boat" },
    { questionStart: "53. We eat dinner", answerOptions: ["then", "late", "first"], questionEnd: "we go to church.", correctAnswer: "then" },
    { questionStart: "54. We are going to", answerOptions: ["running", "drive", "fly"], questionEnd: "around.", correctAnswer: "drive" },
    { questionStart: "55. I hope the weather isn't", answerOptions: ["cold", "too", "learn"], questionEnd: "hot.", correctAnswer: "too" }
];
const questions1_12 = [
    { questionStart: "56. I am living with a family", answerOptions: ["near", "above", "below"], questionEnd: "the park.", correctAnswer: "near" },
    { questionStart: "57. The children are", answerOptions: ["hate", "friendly", "sad"], questionEnd: "to me.", correctAnswer: "friendly" },
    { questionStart: "58. People", answerOptions: ["play", "hate", "practise"], questionEnd: "speaking English with me.", correctAnswer: "practise" },
    { questionStart: "59. Sometimes, I", answerOptions: ["run", "read", "sleep"], questionEnd: "books to my friends.", correctAnswer: "read" },
    { questionStart: "60. I hate the food,", answerOptions: ["so", "but", "because"], questionEnd: "I ate out yesterday.", correctAnswer: "so" }
];
const questions1_13 = [
    { questionStart: "61. It is", answerOptions: ["just", "only", "perfect"], questionEnd: "what I need.", correctAnswer: "just" },
    { questionStart: "62. And it is the perfect color,", answerOptions: ["so", "also", "too"], questionEnd: ".", correctAnswer: "too" },
    { questionStart: "63. I am going to wear it", answerOptions: ["for", "to", "at"], questionEnd: "my friend's party.", correctAnswer: "to" },
    { questionStart: "64. I will save you", answerOptions: ["two", "many", "some"], questionEnd: "cake.", correctAnswer: "some" },
    { questionStart: "65. I", answerOptions: ["love", "give", "show"], questionEnd: "my best wishes to everyone.", correctAnswer: "give" }
];
const questions1_14 = [
    { questionStart: "66. I was looking at the art in the", answerOptions: ["window", "game", "sky"], questionEnd: ".", correctAnswer: "window" },
    { questionStart: "67. I didn't", answerOptions: ["take", "eat", "buy"], questionEnd: "it because it was too expensive.", correctAnswer: "buy" },
    { questionStart: "68. I bought vegetables at the", answerOptions: ["park", "market", "home"], questionEnd: ".", correctAnswer: "market" },
    { questionStart: "69. I ate", answerOptions: ["fruit", "stone", "cake"], questionEnd: "after dinner.", correctAnswer: "cake" },
    { questionStart: "70. I", answerOptions: ["watched", "see", "read"], questionEnd: "a TV show last night.", correctAnswer: "watched" }
];



const questions1_header = {
    questions1_1: "-- Đề cũ",
    questions1_2: "-- Đề cũ",
    questions1_3: "-- Đề cũ",
    questions1_4: "-- Đề cũ",
    questions1_5: "-- Đề cũ",
    questions1_6: "-- Đề cũ",
    questions1_7: "-- Đề cũ",
    questions1_8: "-- Đề cũ",
    questions1_9: "-- Đề cũ",
    questions1_10: "-- Đề cũ",
    questions1_11: "-- Đề cũ",
    questions1_12: "-- Đề cũ",
    questions1_13: "-- Đề cũ",
    questions1_14: "-- Đề cũ"
};







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


    let currentArrayIndex = 0; // 0: questions1_1, 1: questions1_2, 2: questions1_3
    // Mảng câu hỏi từ questions1_1 đến questions1_14
const questionsArrays = [
    questions1_1,
    questions1_2,
    questions1_3,
    questions1_4,
    questions1_5,
    questions1_6,
    questions1_7,
    questions1_8,
    questions1_9,
    questions1_10,
    questions1_11,
    questions1_12,
    questions1_13,
    questions1_14,
];

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
        const questions1_header_length = Object.keys(questions1_header).length;

        document.getElementById('question1_header').innerHTML = "Question " + (currentArrayIndex + 1) + "/" + questions1_header_length + " " + questions1_header['questions1_' + (currentArrayIndex + 1)] + " " ;
    }

    // Render câu hỏi ban đầu
    renderQuestions();

    // Hàm chuyển đến câu hỏi tiếp theo
    document.getElementById('nextButton').addEventListener('click', function() {
        if (currentArrayIndex < questionsArrays.length - 1) {
            currentArrayIndex++;
            renderQuestions();
        } else {
            // Hiển thị kết quả khi đến mảng cuối cùng
            document.getElementById('checkResultButton').style.display = 'block';
        }
    });

    // Hàm quay lại câu hỏi trước đó
    document.getElementById('backButton').addEventListener('click', function() {
        if (currentArrayIndex > 0) {
            currentArrayIndex--;
            renderQuestions();
        }
    });

    // Hiển thị kết quả khi nhấn nút Check Result
    document.getElementById('checkResultButton').addEventListener('click', function() {
        const correctAnswers = [];

        // Tạo bảng so sánh kết quả trong modal
        const comparisonTableBody = document.getElementById('comparisonTableBody');
        comparisonTableBody.innerHTML = ''; // Xóa kết quả cũ

        const questions = questionsArrays[currentArrayIndex]; // Lấy câu hỏi hiện tại

        questions.forEach((question, index) => {
            const userAnswer = userAnswers[index] || "(không chọn)";
            const correctAnswer = question.correctAnswer;

            // Tạo dòng trong bảng so sánh
            const tr = document.createElement('tr');

            // Cột trái: đáp án của người học
            const userAnswerTd = document.createElement('td');
            userAnswerTd.innerHTML = `${userAnswer}`;
            if (userAnswer === correctAnswer) {
                userAnswerTd.classList.add('text-success'); // Màu xanh nếu đúng
            } else {
                userAnswerTd.classList.add('text-danger'); // Màu đỏ nếu sai
            }
            tr.appendChild(userAnswerTd);

            // Cột phải: đáp án đúng
            const correctAnswerTd = document.createElement('td');
            correctAnswerTd.innerHTML = `${correctAnswer}`;
            correctAnswerTd.classList.add('text-success'); // Màu xanh cho đáp án đúng
            tr.appendChild(correctAnswerTd);

            comparisonTableBody.appendChild(tr);
        });

        // Cập nhật điểm tổng và phân loại điểm
        document.getElementById('totalScore').innerText = 'Your Score: ' + calculateScore(userAnswers, questionsArrays);
        document.getElementById('scoreClassification').innerText = 'Classification: ' + getScoreClassification(calculateScore(userAnswers, questionsArrays));

        // Hiển thị modal kết quả
        const myModal = new bootstrap.Modal(document.getElementById('resultModal'));
        myModal.show();
    });

    // Tính điểm
    function calculateScore(userAnswers, questionsArrays) {
        let score = 0;
        const questions = questionsArrays[currentArrayIndex]; // Lấy câu hỏi hiện tại
        questions.forEach((question, index) => {
            if (userAnswers[index] === question.correctAnswer) {
                score += 2; // Mỗi câu đúng được 2 điểm
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

