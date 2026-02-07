const key_id = "Bộ đề #001";
const club_name = "lkhjlkjlk";
//----------------------------------------------------------------------
const questions1 = {
    "question1_1": "lk",
    "question1_2": "jlk",
    "question1_3": "jlkj",
    "question1_4": "j",
    "question1_5": "lkj",
};
const questions1_answer = {
    "question1_1_answer": "jlk",
    "question1_2_answer": "jlk",
    "question1_3_answer": "lk",
    "question1_4_answer": "lkj",
    "question1_5_answer": "lkj",
};
//----------------------------------------------------------------------
const questions2 = {
    "question2": "lkk",
};
const questions2_answer = {
    "question2": "jjkl",
};
//----------------------------------------------------------------------
const questions3 = {
    "question3_1": "lkjlkjkljkllk",
    "question3_2": "lkj",
    "question3_3": "kjhkjhkjvb",
};
const questions3_answer = {
    "question3_1_answer": "jlk",
    "question3_2_answer": "hkkjhkjhkj",
    "question3_3_answer": "nbvnbvnb",
};
//----------------------------------------------------------------------
const questions4_main = "65876587";
const question4_1_text = "7868768Write a short email to your friend. Tell your friend your feelings about this and what you plan to do.";
const question4_2_text = "987987987Write an email to the president of the club. Tell them your thoughts about this and what you would like to do.";
const question4_1_text_answer = `98798797`;
const question4_2_text_answer = `9798798665`;

// Static Render Functions
function renderQuestions1(){const t=document.getElementById("topic-title_q1");if(t)t.textContent=`Question 1 of 4 - ${club_name}`;const d=document.getElementById("description_q1");if(d)d.textContent=`You are joining a ${club_name}. Fill out the form. Write short answers (1-10 words) for each message (5 questions).`;const c=document.getElementById("questions-container1");if(!c)return;let h="";for(let k in questions1)h+=`<div class="mb-4"><label class="form-label">${questions1[k]}</label><input type="text" class="form-control" id="${k}"></div>`;c.innerHTML=h}
function renderQuestions2(){const t=document.getElementById("topic-title_q2");if(t)t.textContent=`Question 2 of 4 - ${club_name}`;const d=document.getElementById("description_q2");if(d)d.textContent=`Now you've become a new member of the ${club_name}. Fill in the form. Write in sentences. Use 20-45 words.`;const c=document.getElementById("questions-container2");if(!c)return;let h="";for(let k in questions2)h+=`<div class="mb-4"><label class="form-label">${questions2[k]}</label><textarea class="form-control" id="${k}" rows="3"></textarea></div>`;c.innerHTML=h;for(let k in questions2){document.getElementById(k)?.addEventListener("input",e=>{const c=e.target.value.split(/\s+/).filter(Boolean).length;document.getElementById("wordCountLabel").textContent=`Word Count: ${c}`})}}
function renderQuestions3(){const t=document.getElementById("topic-title_q3");if(t)t.textContent=`Question 3 of 4 - ${club_name}`;const d=document.getElementById("description_q3");if(d)d.textContent=`You are speaking to fellow members of the ${club_name} in a group chat. Respond to them in full sentences (30-60 words per answer).`;const c=document.getElementById("questions-container3");if(!c)return;let h="";for(let k in questions3)h+=`<div class="mb-4"><label class="form-label">${questions3[k]}</label><textarea class="form-control" id="${k}" rows="3"></textarea><div id="${k}-wordCount" class="text-muted text-end mt-1">Word Count: 0</div></div>`;c.innerHTML=h;for(let k in questions3){document.getElementById(k)?.addEventListener("input",e=>{const c=e.target.value.split(/\s+/).filter(Boolean).length;document.getElementById(`${k}-wordCount`).textContent=`Word Count: ${c}`})}}
function renderQuestions4(){const t=document.getElementById("topic-title_q4");if(t)t.textContent="Question 4 of 4 - Email Writing";const d=document.getElementById("description_q4");if(d)d.textContent="Write a short email (about 50-75 words) to your friend, and a longer email (120-225 words) to the president of the club.";const c=document.getElementById("questions-container4");if(!c)return;const q4={"question4_1":`${questions4_main} <br><strong>${question4_1_text}</strong>`,"question4_2":`${questions4_main} <br><strong>${question4_2_text}</strong>`};let h="";for(let k in q4)h+=`<div class="mb-4"><label class="form-label">${q4[k]}</label><textarea class="form-control" id="${k}" rows="4"></textarea><div id="${k}-wordCount" class="text-muted text-end mt-1">Word Count: 0</div></div>`;c.innerHTML=h;for(let k in q4){document.getElementById(k)?.addEventListener("input",e=>{const c=(e.target.value||"").trim().split(/\s+/).filter(Boolean).length;document.getElementById(`${k}-wordCount`).textContent=`Word Count: ${c}`})}}

// Prompt variables
const promptText_question1 = "Người này đang là thành viên của câu lạc bộ " + club_name + " Hãy chấm điểm 5 câu sau theo khung aptis mức độ A0 đến C1, tiêu chí chấm điểm là trả lời 1-10 từ, đơn giản và viết hoa chữ đầu dấu chấm cuối câu, kết quả trả về có giải thích.\n\n";
const promptText_question2 = "Người này đang là thành viên của câu lạc bộ " + club_name + " Hãy chấm điểm câu trả lời sau theo khung aptis mức độ A0 đến C1, độ dài trong phạm vi 20-45 words, kết quả trả về có giải thích:\n\n";
const promptText_question3 = "Người này đang là thành viên của câu lạc bộ " + club_name + " Hãy chấm điểm câu trả lời sau theo khung aptis mức độ A0 đến C1, độ dài trong phạm vi 30-60 từ, kết quả trả về có giải thích:\n\n";
const promptText_question4 = "Người này đang là thành viên của câu lạc bộ " + club_name + " Hãy chấm điểm câu trả lời sau theo khung aptis mức độ A0 đến C1, độ dài trong phạm vi 50-75 từ cho câu hỏi 1 và 120-225 từ cho câu hỏi 2, kết quả trả về có giải thích, sau khi chấm 4 câu hãy chấm cấp độ tổng thể cho các câu trên:\n\n";

// Navigation
const questions = ["question1", "question2", "question3", "question4"];
let currentQuestionIndex = 0;
function showCurrentQuestion(){questions.forEach(id=>{const el=document.getElementById(id);if(el)el.style.display='none'});const c=document.getElementById(questions[currentQuestionIndex]);if(c)c.style.display='block';const btn=document.getElementById('btn_checkallquestions');if(btn)btn.classList.toggle('d-none', currentQuestionIndex !== questions.length - 1)}
document.addEventListener("DOMContentLoaded",()=>{if(typeof key_id!=='undefined')document.getElementById('keys_id').innerHTML=key_id;document.getElementById('nextButton')?.addEventListener('click',()=>currentQuestionIndex<questions.length-1&&++currentQuestionIndex&&showCurrentQuestion());document.getElementById('backButton')?.addEventListener('click',()=>currentQuestionIndex>0&&--currentQuestionIndex&&showCurrentQuestion());document.getElementById('btn_checkallquestions')?.addEventListener('click',()=>new bootstrap.Modal(document.getElementById('confirmationModal')).show());document.getElementById('confirmButton')?.addEventListener('click',()=>handleSubmitAllQuestions()||bootstrap.Modal.getInstance(document.getElementById('confirmationModal')).hide());showCurrentQuestion()});

// Submit Logic
async function handleSubmitAllQuestions(){
    const ans={question1:{},question2:{},question3:{},question4:{}};
    for(let i=1;i<=5;i++)ans.question1[`question1_${i}`]=document.getElementById(`question1_${i}`)?.value||"";
    ans.question2.question2=document.getElementById('question2')?.value||"";
    for(let i=1;i<=3;i++)ans.question3[`question3_${i}`]=document.getElementById(`question3_${i}`)?.value||"";
    ans.question4.question4_1=document.getElementById('question4_1')?.value||"";
    ans.question4.question4_2=document.getElementById('question4_2')?.value||"";
    
    const full=`${promptText_question1}
${Object.entries(ans.question1).map(([k,v])=>`${questions1[k]}: ${v}`).join('\n')}

${promptText_question2}
${questions2.question2}: ${ans.question2.question2}

${promptText_question3}
${Object.entries(ans.question3).map(([k,v])=>`${questions3[k]}: ${v}`).join('\n')}

${promptText_question4}
Email 1: ${ans.question4.question4_1}
Email 2: ${ans.question4.question4_2}`;
    
    const loading=new bootstrap.Modal(document.getElementById('loadingModal'));loading.show();
    try{const r=await fetch('/ask',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:full})});const d=await r.json();document.getElementById('modal-body-ai').innerHTML=`<div style="white-space: pre-wrap;">${d.answer||d.error}</div>`;new bootstrap.Modal(document.getElementById('resultModal')).show();}catch(e){alert('Lỗi: '+e.message)}finally{loading.hide()}
}
window.handleSubmitAllQuestions=handleSubmitAllQuestions;

// Answer Logic
document.addEventListener("DOMContentLoaded", function() {
    ["question1", "question2", "question3", "question4"].forEach(q => {
        const btn = document.getElementById(`${q}_showanswer`);
        if (btn) {
            btn.onclick = function() {
                const body = document.getElementById(`modal-body${q === 'question1' ? '' : q.replace('question', '')}`);
                body.innerHTML = "";
                if(q==='question1'){for(let i=1;i<=5;i++)body.innerHTML+=`<p><strong>${questions1['question1_'+i]}</strong><br>${questions1_answer['question1_'+i+'_answer']}</p>`}
                else if(q==='question2')body.innerHTML=`<p><strong>${questions2.question2}</strong><br>${questions2_answer.question2}</p>`
                else if(q==='question3'){for(let i=1;i<=3;i++)body.innerHTML+=`<p><strong>${questions3['question3_'+i]}</strong><br>${questions3_answer['question3_'+i+'_answer']}</p>`}
                else if(q==='question4')body.innerHTML=`<p><strong>Friend:</strong><br>${question4_1_text_answer}</p><p><strong>President:</strong><br>${question4_2_text_answer}</p>`
                new bootstrap.Modal(document.getElementById(`${q}_answerModal`)).show();
            };
        }
    });
});

// Init
if(typeof renderQuestions1==='function'){renderQuestions1();renderQuestions2();renderQuestions3();renderQuestions4();}
