const key_id = "Bộ đề #002";
const club_name = "dsfdsfdsfdsf";
//----------------------------------------------------------------------
const questions1 = {
    "question1_1": "dfdsfdafqewr",
    "question1_2": "ewrqwerweqr",
    "question1_3": "ưerwqerwer",
    "question1_4": "ửqwerqwer",
    "question1_5": "qưerqrewweqr",
};
const questions1_answer = {
    "question1_1_answer": "qưerwer",
    "question1_2_answer": "ewrqwerqwr",
    "question1_3_answer": "ewrqwerewqr",
    "question1_4_answer": "qưerqwerqewr",
    "question1_5_answer": "qưerqewrewrq",
};
//----------------------------------------------------------------------
const questions2 = {
    "question2": "ewrqwerqwer",
};
const questions2_answer = {
    "question2": "ewrwqer",
};
//----------------------------------------------------------------------
const questions3 = {
    "question3_1": "ưeewrqwerqwer",
    "question3_2": "ưerqwer",
    "question3_3": "ewqrqwerqwer",
};
const questions3_answer = {
    "question3_1_answer": "qưerqwerwerqwerweqr",
    "question3_2_answer": "ưeqrwerweqrqwer",
    "question3_3_answer": "qưerqwerqwerqwerqwr",
};
//----------------------------------------------------------------------
const questions4_main = "qưerqwerewrweqr";
const question4_1_text = "ưerweqrqwerqwerWrite a short email to your friend. Tell your friend your feelings about this and what you plan to do.";
const question4_2_text = "qưerweqrewqrWrite an email to the president of the club. Tell them your thoughts about this and what you would like to do.";
const question4_1_text_answer = `ưeqrweqrwerwerwqer`;
const question4_2_text_answer = `ưeqrwqerwererw`;

// Hàm để render câu hỏi cho câu hỏi 1
function renderQuestions1() {
    document.getElementById('topic-title_q1').textContent = `Question 1 of 4 - ${club_name}`;
    document.getElementById('description_q1').textContent = `You are joining a ${club_name}. Fill out the form. Write short answers (1-10 words) for each message (5 questions).`;
    const container = document.getElementById("questions-container1");
    let formContent = '';
    for (let key in questions1) {
        formContent += `
            <div class="mb-4">
                <label for="${key}" class="form-label">${questions1[key]}</label>
                <input type="text" class="form-control" id="${key}" name="${key}">
            </div>
        `;
    }
    container.innerHTML = formContent;
}

// Hàm để render câu hỏi cho câu hỏi 2
function renderQuestions2() {
    document.getElementById('topic-title_q2').textContent = `Question 2 of 4 - ${club_name}`;
    document.getElementById('description_q2').textContent = `Now you've become a new member of the ${club_name}. Fill in the form. Write in sentences. Use 20-45 words.`;
    const container = document.getElementById("questions-container2");
    let formContent = '';
    for (let key in questions2) {
        formContent += `
            <div class="mb-4">
                <label for="${key}" class="form-label">${questions2[key]}</label>
                <textarea class="form-control" id="${key}" name="${key}" rows="3" style="width: 100%;"></textarea>
            </div>
        `;
    }
    container.innerHTML = formContent;
     // Thêm sự kiện input cho mỗi textarea
    for (let key in questions2) {
        let textarea = document.getElementById(key);
        textarea.addEventListener("input", countWordsInTextarea);
    }
}

function countWordsInTextarea(event) {
    let textareaContent = event.target.value;
    let wordCount = textareaContent.split(/\s+/).filter(Boolean).length;
    document.getElementById("wordCountLabel").textContent = `Word Count: ${wordCount}`;
}

// Hàm để render câu hỏi cho câu hỏi 3
function renderQuestions3() {
    document.getElementById('topic-title_q3').textContent = `Question 3 of 4 - ${club_name}`;
    document.getElementById('description_q3').textContent = `You are speaking to fellow members of the ${club_name} in a group chat. Respond to them in full sentences (30-60 words per answer).`;
    const container = document.getElementById("questions-container3");
    let formContent = '';
    for (let key in questions3) {
        formContent += `
            <div class="mb-4">
                <label for="${key}" class="form-label">${questions3[key]}</label>
                <textarea class="form-control" id="${key}" name="${key}" rows="3" style="width: 100%;"></textarea>
                <div id="${key}-wordCount" class="text-muted text-end mt-1">Word Count: 0</div>
            </div>
        `;
    }
    container.innerHTML = formContent;
    for (let key in questions3) {
        let textarea = document.getElementById(key);
        textarea.addEventListener("input", function(event) {
            const content = textarea.value;
            const wordCount = content.split(/\s+/).filter(Boolean).length;
            document.getElementById(`${key}-wordCount`).textContent = `Word Count: ${wordCount}`;
        });
    }
}

const questions4 = {
    "question4_1": `${questions4_main} <br><strong>${question4_1_text}</strong>`,
    "question4_2": `${questions4_main} <br><strong>${question4_2_text}</strong>`,
};

const description_question4 = "Write a short email (about 50-75 words) to your friend, and a longer email (120-225 words) to the president of the club.";

// Hàm để render câu hỏi cho câu hỏi 4
function renderQuestions4() {
    document.getElementById('topic-title_q4').textContent = "Question 4 of 4 - Email Writing";
    document.getElementById('description_q4').textContent = description_question4;
    const container = document.getElementById("questions-container4");
    let formContent = '';
    for (let key in questions4) {
        formContent += `
            <div class="mb-4">
                <label for="${key}" class="form-label">${questions4[key]}</label>
                <textarea class="form-control" id="${key}" name="${key}" rows="4" style="width: 100%;"></textarea>
                <div id="${key}-wordCount" class="text-muted text-end mt-1">Word Count: 0</div>
            </div>
        `;
    }
    container.innerHTML = formContent;
    for (let key in questions4) {
        let textarea = document.getElementById(key);
        textarea.addEventListener("input", function(event) {
            const content = (textarea.value || "").trim();
            const wordCount = content ? content.split(/\s+/).filter(Boolean).length : 0;
            document.getElementById(`${key}-wordCount`).textContent = `Word Count: ${wordCount}`;
        });
    }
}

// Cập nhật prompt
const promptText_question1 = "Người này đang là thành viên của câu lạc bộ " + club_name + " Hãy chấm điểm 5 câu sau theo khung aptis mức độ A0 đến C1, tiêu chí chấm điểm là trả lời 1-10 từ, đơn giản và viết hoa chữ đầu dấu chấm cuối câu, kết quả trả về có giải thích.\n\n";
const promptText_question2 = "Người này đang là thành viên của câu lạc bộ " + club_name + " Hãy chấm điểm câu trả lời sau theo khung aptis mức độ A0 đến C1, độ dài trong phạm vi 20-45 words, kết quả trả về có giải thích:\n\n";
const promptText_question3 = "Người này đang là thành viên của câu lạc bộ " + club_name + " Hãy chấm điểm câu trả lời sau theo khung aptis mức độ A0 đến C1, độ dài trong phạm vi 30-60 từ, kết quả trả về có giải thích:\n\n";
const promptText_question4 = "Người này đang là thành viên của câu lạc bộ " + club_name + " Hãy chấm điểm câu trả lời sau theo khung aptis mức độ A0 đến C1, độ dài trong phạm vi 50-75 từ cho câu hỏi 1 và 120-225 từ cho câu hỏi 2, kết quả trả về có giải thích, sau khi chấm 4 câu hãy chấm cấp độ tổng thể cho các câu trên:\n\n";

// ... (Các hàm xử lý submit) ...

// Gọi hàm render khi trang tải
if(typeof renderQuestions1 === 'function') renderQuestions1();
if(typeof renderQuestions2 === 'function') renderQuestions2();
if(typeof renderQuestions3 === 'function') renderQuestions3();
if(typeof renderQuestions4 === 'function') renderQuestions4();
