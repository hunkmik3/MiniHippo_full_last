document.addEventListener('DOMContentLoaded', function() {

// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI ///////////////
// ===============================================================================================================

// 2. Câu 2
const question2Content_1 = [
    "The most important of these is the Natural history centre",
    "The entrance of the centre is on the town's main square",
    "When you enter the building from the square, you will see a set of stairs to your left",
    "The ticket office is on the top of these stairs, the staff there are very helpful",
    "As well as selling tickets, they can provide maps and useful tour information",
];


const question2Content_2 = [
    "They were out of order and the traffic moved very slowly", 
    "This created long delays in the roads to the city's business district", 
    "As a result of these delays, many people were not able to get to work on time", 
    "Fortunately, in the evening, the traffic lights were working again", 
    "Therefore, there were no further delays for people going back home"
];
const question2Content_3 = [
    "When you collect your pack, go to the lifts on the right",
    "Take the lift to the third floor and go to the main desk",
    "Show your pass from the conference pack to a member of staff at the desk",
    "He or she will tell you your seat number for the talk at the main hall",
    "Once you are in the hall, someone will help you find your seat"
];

const question2Content_4 = [
    "When you arrive, go straight to the main office to collect your ticket",
    "You will need to show this to a member of staff at the door before you enter",
    "Inside the building, you will find a photography exhibition on the ground floor",
    "Before you look at the pictures, a guide will tell you about the day’s event",
    "These activities will include playing and feeding the animals"
];

const question2Content_5 = [
    "The first and most important thing is to choose the location", 
    "In order to choose the right place, you need to consider several factors", 
    "The most important of these to look at is the price of homes", 
    "Other factors to look at is the place of employment, shops and schools", 
    "Such requirements of course depend on your personal circumstances"
];

const question2Content_6 = [
    "Go to the collection point and click on the screen to choose the bike with your bank card", 
    'Choose "hire the cycle" on the screen and then follow the instructions to receive an unlock code.', 
    "Enter the code on the lock of the bike and wait for the green lights", 
    "When the light comes, you can unlock your bike and start your journey", 
    "When you finish your journey, return the bike to any empty collection point"
];


const question2Content_7 = [
    "To enter the building and use the lift, you will need your key card",
    "If you lose this, you will need to see the staff member at the front desk",
    "He or she will ask for your name and your flat number, and then will write these down",
    "You will also need to show your identification card",
    "He or she will make a copy of it and give you a new key card"
];

const question2Content_8 = [
    "When he was young, he began writing short stories for a magazine",
    "He soon wrote regularly for the magazine, but he was not satisfied",
    "He almost left the magazine, but then he decided to create some unusual new characters",
    "The characters he imagined were one of the most famous in the world",
    "This popularity made Tome Harper rich and successful"
];

const question2Content_9 = [
    "She was born in Shanghai in 1933 to a American mother and a father from Scotland",
    "At that time, Shanghai is a city filled with many people from different countries",
    "After she finished her school, she went to Wellesley College, a famous university in USA",
    "However, she missed China, and applied for a job in Hong Kong, where she taught from 1959 to 1972, and learnt to speak Cantonese, the local language",
    "In the 1980s, she finally returned to China and still lives with her Shanghai husband, George Wang."
];

const question2Content_10 = [
    "I have just passed the test, and I am the proud owner of the driving license",
    "However, I did not have a car and my parents would not let me drive theirs",
    "So, when I saw an advertisement on the local newspaper for a cheap second hand car, I did not waste a time",
    "I called the number in that advert and arranged a meeting to meet the owner on the other side of the town",
    "We agreed on a price and when I handed over the money, he gave me the keys"
];

const question2Content_11 = [
    "The first step is to find out what you know about the problem",
    "The next one is to form a hypothesis or an idea based on your information",
    "Then, you need to perform experiments to see if these ideas are true or not",
    "You can also compare your results with experiments in the past",
    "In this way, you can add to your knowledge of the subject for future experiments"
];
const question2Content_12 = [
    'Before you start to write your report, you should look at websites for the information you need',
    "Remember to save links to websites and include them in your report",
    "You should also include a list of books that you use for reference",
    'When you have finished your report, correct all the mistakes',
    "After you make the corrections, send your report by your email"
];

const question2Content_13 = [
    "When you arrive, please take a ticket from a machine at the entrance",
    "This ticket will show the date and the time you arrived",
    "Please display the ticket with this information in the window of your car",
    "Before you leave, please put the ticket on the machine by the gate",
    "The machine will read your information and tell you how much you have to pay"
];
const question2Content_14 = [
    'In your account, press "open new window"',
    "When you do this, a new window will open",
    "Simply drag and drop your files",
    'Once you put the files there, press the "send" button',
    "After you send your work, you should check your email"
];
const question2Content_15 = [
    "When you arrive at the university, go to the help desk",
    "A member of staff will ask for your name and your address",
    "He or she will enter your information into the computer and give you an identification card",
    "You can use this card to borrow books from library and access lesson materials online",
    "You will find these in material links on your home page"
];
const question2Content_16 = [
    'On your arrival, please go to the information point at the north gate',
    "Runners must register here at least 30 minutes before the race starts at 9am",
    "To do this, you just need to give us your photo card",
    'A member of staff will give you a numbered armband to wear',
    "Please put this on immediately and join other competitors at the warm-up area"
];

const question2Content_17 = [
    "First, you need to find an appropriate place to put your printer",
    "When your printer is in place, turn it on using the switch",
    "A light comes on at the front of the printer",
    "If the light is green, your printer is ready to use",
    "Before using the printer, you need to put papers into it"
];
const question2Content_18 = [
    'You should arrive at the main office by 6.30am and collect your keys',
    "In the office, you can also collect a map of your route",
    "You must follow the route on the map to deliver packages",
    'When you have completed all deliveries, return to your office',
    "You must return your keys to the office manager after you get back"
];

const question2Content_19 = [
    "First, it is a good idea to check your report and correct mistakes",
    "When you are sure there are no mistakes left, print out your report",
    "Next, complete a cover sheet with your name and your student number, and attach it to your printed assignment",
    "Bring your assignment with the attached cover sheet to the front desk in the main hall",
    "The staff member will take your report and confirm that everything is complete"
];
const question2Content_20 = [
    'When you hear the alarm, leave your bags and belongings at the desk',
    "Next, walk calmly to the doors marked Emergency Exit",
    "Through these doors, there are stairs leading you to the ground floor",
    'When you reach the bottom of these stairs, leave the building through front entrance',
    "Outside, gather on the grass and wait for further instructions"
];
const question2Content_21 = [
    "When he was a child, he played for some local teams near his home in Marseille",
    "He then moved away from his home to join Cannes Football Club in the southern France",
    "While he was at that club, people throughout France saw that he was a brilliant player",
    "After that, he moved to Italy and Spain, where he finished his playing career",
    "Since he retired from playing, he has worked as a football club manager"
];
const question2Content_22 = [
    'All you need is some earth, an old potato and a big spot',
    "An old potato will have little roots, will be a little green, and won't be good for eating",
    "This colour means it is perfect for growing, you should put some earth in the pot and dig it deep down",
    "When you've done this, you should water it everyday and place it in a sunny spot",
    "With this care, you should see a potato plant growing after couples of weeks"
];
const question2Content_23 = [
    "As a child, he moved to a special school because he was so clever",
    "His best friend in his new class was a girl named Lavime",
    "She later became his wife and helped him with his earliest scientific discoveries",
    "These were so advanced that he soon became famous all over the world",
    "Princeton University in the USA offered him a job because he was so famous"
];
const question2Content_24 = [
    'When you arrive at the conference hall, give your booking number',
    "A staff member will note this down and give you a welcome pack",
    "Inside you will find a schedule of events and the information of the key speaker",
    'If you would like to attend his talk, it will take place in the main hall at midday',
    "After he finishes, there will be time for questions"
];
const question2Content_25 = [
    "They left their home country and took Jay to live in the United States",
    "He started study at the school in that country, and in his free time he did some strength exercise",
    "Jay was very good at that and he participated in a bodybuilding competition",
    "At one of these events, an actor agent saw him and gave him a starring role",
    "It was a major action movie and he gained famous from that film"
];
const question2Content_26 = [
    'When she was a child, she was very interested in space',
    "Because of this passion, she worked very hard and passed the university entrance exam",
    "This hard work was recognized by many lecturers at the university",
    "They introduced her to a job opportunity at a prestigious organization",
    "A year later, she was selected to fly into space"
];


const question2Content_27 = [
    "In the chosen place, dig a deep hole in the ground",
    "Put the base of the rose and cover the root with lease earth",
    "Push this down by hand until the tree is straight",
    "Once you planted it, water them everyday",
    "The amount of water depends on the weather condition"
];

const question2Content_28 = [
    'When she was young, she liked looking at the star and hoped to visit them',
    "Because of this, she studied hard at school and university",
    "Her hard work was successful because American Space invited",
    'They invited her to join the team and train',
    "After 1 year training, she was selected from hundreds to fly to the moon"
];
const question2Content_29 = [
    'Ring the bell of the gate to notify the staff of your arrival',
    'Show your membership card to verify your eligibility for receiving the gift',
    'Provide details of the person receiving the gift to ensure the correct recipient is identified',
    'Fill in the required document to complete the necessary formalities for the gift',
    'Take a seat and wait for your turn to receive the gift'
];
const question2Content_30 = [
    'He first performed at one of the city’s theaters at the age of 5',
    'Although he was very young, he was very popular on the stage',
    'His popular grew, he soon appeared in all the theaters of the country',
    'After being famous at home, he moved to America and joined a traveling theater group',
    'He traveled widely with this group, then decided there to make it his home'
];
const question2Content_31 = [
    'Before taking the documents, complete the required forms.',
    'Go to the library desk to get this',
    'Sign at the back of the photograph',
    'Give the photo to the library staff',
    'They will check the details',
];

const question2Content_32 = [
    'Before the open day, you should call or email us so that we can take your personal details.',
    'With this information, we will create an identification card for you to collect on arrival.',
    'You must show it to access the introductory talk and the morning lectures.',
    'Each one has scheduled a question-and-answer discussion with current students.',
    'Following these presentations, you will have the opportunity to visit different departments',
];


// Mảng chứa các bộ câu hỏi
const questionSets = [
    question2Content_1, question2Content_2, question2Content_3, question2Content_4,
    question2Content_5, question2Content_6, question2Content_7, question2Content_8,
    question2Content_9, question2Content_10, question2Content_11, question2Content_12,
    question2Content_13, question2Content_14, question2Content_15, question2Content_16,
    question2Content_17, question2Content_18, question2Content_19, question2Content_20,
    question2Content_21, question2Content_22, question2Content_23, question2Content_24,
    question2Content_25, question2Content_26, question2Content_27, question2Content_28,
    question2Content_29, question2Content_30, question2Content_31, question2Content_32,
    
];

const questheader1 = {
    question2Content_1: "Natural History Center (đề cũ)",
    question2Content_2: "Traffic Lights (đề cũ)",
    question2Content_3: "Enter the conference hall (đề cũ)",
    question2Content_4: "Animal Hospital Process (đề cũ)",
    question2Content_5: "Buying a New House (đề cũ)",
    question2Content_6: "Using Public Cycle (đề cũ)",
    question2Content_7: "Key Card (đề cũ)",
    question2Content_8: "Tom Harper (đề cũ)",
    question2Content_9: "Betty Barr's Life (đề cũ)",
    question2Content_10: "My First Car (đề cũ)",
    question2Content_11: "Solve a Problem (đề cũ)",
    question2Content_12: "Submit Report (đề cũ)",
    question2Content_13: "Car Park (đề cũ)",
    question2Content_14: "Submit Paperwork (đề cũ)",
    question2Content_15: "Instructions for New Students (đề cũ)",
    question2Content_16: "Race Participation (đề cũ)",
    question2Content_17: "Printer Usage (đề cũ)",
    question2Content_18: "Delivery Man (đề cũ)",
    question2Content_19: "Hand in Assignment (đề cũ)",
    question2Content_20: "Fire Instructions (đề cũ)",
    question2Content_21: "Famous Football Player (đề cũ)",
    question2Content_22: "Growing Potatoes (đề cũ)",
    question2Content_23: "Albert's Life (đề cũ)",
    question2Content_24: "Conference Hall Process (đề cũ)",
    question2Content_25: "Famous Actor Jay (đề cũ)",
    question2Content_26: "Space Travel Dream (đề cũ)",
    question2Content_27: "Rose Planting Process (đề cũ)",
    question2Content_28: "Kelly’s journey into space (đề cũ)",
    question2Content_29: "Receive gift (đề cũ)",
    question2Content_30: "He first performed (đề cũ)",
    question2Content_31: "Document Retrieval Process (đề cũ)",
    question2Content_32: "Open day (đề cũ)",
};


function getQuestHeaders(obj) {
    return Object.values(obj);
}

// Gọi hàm
const questheader = getQuestHeaders(questheader1);


// ===============================================================================================================
// ////////////// CÂU HỎI 2 ///////////////
// ===============================================================================================================

// Mảng lưu các câu trả lời đúng
var correctAnswersQuestion2 = [];

// Hàm trộn ngẫu nhiên (Fisher-Yates shuffle) để random các câu hỏi
function shuffleQuestions(questions) {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions;  // Trả lại mảng đã xáo trộn
}

// Hàm render các câu hỏi vào trong các cards cho Question 2
function renderQuestion2(questionlist) {
    // Gán giá trị mới cho correctAnswersQuestion2 từ mảng questionlist
    //correctAnswersQuestion2 = questionlist.map(item => item.text);
    correctAnswersQuestion2 = [];
    questionlist.forEach(item => {
    correctAnswersQuestion2.push(item);
});

    // Xáo trộn mảng câu hỏi
    let shuffledQuestionlist = shuffleQuestions([...questionlist]);

    // Xóa các card cũ
    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = ''; // Clear previous cards

    // Tạo và thêm các thẻ card mới
    shuffledQuestionlist.forEach((text, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card', 'mb-2', 'draggable-item');
        cardDiv.setAttribute('draggable', 'true');
        cardDiv.id = `item${index + 1}`;

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        cardBody.innerText = text;

        cardDiv.appendChild(cardBody);
        cardsContainer.appendChild(cardDiv);
    });

    // Kích hoạt kéo thả bằng SortableJS
    initSortable();
    document.getElementById('html_questheader').textContent = `Question ${currentSetIndex + 1} / ${questheader.length} - ${questheader[currentSetIndex]}`;

}

// Hàm khởi tạo SortableJS cho các phần tử kéo thả
function initSortable() {
    const cardsContainer = document.getElementById('cardsContainer');

    // Khởi tạo Sortable cho cardsContainer
    new Sortable(cardsContainer, {
        group: 'shared',
        animation: 150,
    });
}

//-----------------------------------------------------------------------
// Mảng lưu đáp án của người học
const userAnswersQuestion2 = [];

// Lắng nghe sự kiện khi nhấn nút "Check result"
document.getElementById('checkResultButton').addEventListener('click', function() {
    // Lấy kết quả từ các card đã sắp xếp
    userAnswersQuestion2.length = 0; // Reset mảng userAnswers

    const cardsContainer = document.getElementById('cardsContainer');
    const cards = cardsContainer.querySelectorAll('.draggable-item');

    // Lặp qua các thẻ card và lấy câu trả lời của người học
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

    // Hiển thị kết quả so sánh trong bảng
    question2Score = displayComparisonResultsQuestion2(answers, correctAnswers);

    // Mở modal kết quả sau khi tính điểm
    var resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
    resultModal.show();
});

// Hiển thị đáp án đúng và so sánh
function displayComparisonResultsQuestion2(userAnswers, correctAnswers) {
    const comparisonBody = document.getElementById('comparisonTableBody');
    const totalScoreElement = document.getElementById('totalScore');
    
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

    // Display the score in the result section
    totalScoreElement.innerHTML = `<strong>Your score: ${score} / ${correctAnswers.length}</strong>`;

    // Return the score
    return score;
}






// 1. Hiển thị câu hỏi khi trang được load
window.onload = function() {
    renderQuestion2(question2Content_1);
};



let currentSetIndex = 0; // Biến để theo dõi bộ câu hỏi hiện tại

// Hàm để chuyển sang bộ câu hỏi tiếp theo
document.getElementById('nextButton').addEventListener('click', function() {
    if (currentSetIndex < questionSets.length - 1) {
        // Chuyển sang bộ câu hỏi tiếp theo
        currentSetIndex++;
        renderQuestion2(questionSets[currentSetIndex]);
        
        // Cập nhật tiêu đề với tiền tố "Question 2 & 3 - "
       // document.getElementById('html_questheader').textContent = `Question ${currentSetIndex + 1} / ${questheader.length} - ${questheader[currentSetIndex]}`;
        
        // Nếu đã đến bộ câu hỏi cuối, thay đổi nút Next thành "Đã hết câu hỏi"
        if (currentSetIndex === questionSets.length - 1) {
            document.getElementById('nextButton').textContent = "Đã hết câu hỏi";
        }
    }
});

// Hàm xử lý sự kiện khi nhấn nút Back
document.getElementById('backButton').addEventListener('click', function() {
    if (currentSetIndex > 0) {
        // Quay lại bộ câu hỏi trước
        currentSetIndex--;
        renderQuestion2(questionSets[currentSetIndex]);
        
        // Cập nhật tiêu đề với tiền tố "Question 2 & 3 - "
        //document.getElementById('html_questheader').textContent = `Question 2 & 3 - ${questheader[currentSetIndex]}`;
       // document.getElementById('html_questheader').textContent = `Question ${currentSetIndex + 1} / ${questheader.length} - ${questheader[currentSetIndex]}`;

        
        // Nếu không phải bộ câu hỏi cuối, đổi nút Next về "Next"
        if (currentSetIndex !== questionSets.length - 1) {
            document.getElementById('nextButton').textContent = "Next";
        }
    }
});








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


// Kết thúc
});
