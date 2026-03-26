
// Admin Writing Sets - Xử lý logic upload và quản lý bộ đề Writing

document.addEventListener('DOMContentLoaded', function () {
    console.log("Admin Writing Sets JS Loaded");
    initWritingForm();
    // Auto-load sets if the writing module is already visible (rare on refresh, but good practice)
    const module = document.getElementById('writing-set-module');
    if (module && module.style.display !== 'none') {
        loadWritingSets();
    }
});

// --- Global Management Functions ---

window.loadWritingSets = async function () {
    const listEl = document.getElementById('writing-set-list');
    const emptyEl = document.getElementById('writing-set-empty');
    if (!listEl) return;

    listEl.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2 text-muted">Đang tải danh sách...</p></div>';
    listEl.style.display = 'block';

    try {
        const res = await fetch('/api/lessons/list?part=writing');
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to load sets');

        const sets = data.lessons || [];

        if (sets.length === 0) {
            listEl.innerHTML = '';
            if (emptyEl) emptyEl.style.display = 'block';
            return;
        }

        if (emptyEl) emptyEl.style.display = 'none';

        listEl.innerHTML = sets.map(set => {
            const key = extractKeyFromPath(set.file_path);
            const createdDate = new Date(set.created_at).toLocaleDateString('vi-VN');
            return `
            <div class="card mb-3 shadow-sm border-0 bg-white">
                <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                    <div>
                        <h5 class="card-title mb-1 fw-bold text-primary">
                            <i class="bi bi-file-earmark-text me-2"></i>${set.title || 'Bài tập Writing ' + key}
                        </h5>
                        <p class="card-text text-muted small mb-0">
                            <span class="me-3"><i class="bi bi-calendar3 me-1"></i>${createdDate}</span>
                            <span class="me-3"><i class="bi bi-key me-1"></i>Mã đề: ${key}</span>
                            ${set.topic ? `<span><i class="bi bi-tag me-1"></i>CLB: ${set.topic}</span>` : ''}
                        </p>
                    </div>
                    <div class="d-flex gap-2">
                        <a href="writing_question.html?lesson=writingkey${key}" target="_blank" class="btn btn-sm btn-outline-info">
                            <i class="bi bi-eye me-1"></i>Xem
                        </a>
                        <button onclick="editWritingSet('${set.id}', '${set.file_path}')" class="btn btn-sm btn-outline-warning">
                            <i class="bi bi-pencil me-1"></i>Sửa
                        </button>
                        <button onclick="deleteWritingSet('${set.id}')" class="btn btn-sm btn-outline-danger">
                            <i class="bi bi-trash me-1"></i>Xoá
                        </button>
                    </div>
                </div>
            </div>
            `;
        }).join('');
    } catch (err) {
        console.error(err);
        listEl.innerHTML = `<div class="alert alert-danger"><i class="bi bi-exclamation-triangle me-2"></i>Lỗi tải danh sách: ${err.message}</div>`;
    }
};

window.showWritingForm = function (isEdit) {
    const listEl = document.getElementById('writing-set-list');
    const emptyEl = document.getElementById('writing-set-empty');
    const formCard = document.getElementById('writing-set-form-card');
    const createBtn = document.getElementById('createWritingSetBtn');
    const refreshBtn = document.getElementById('refreshWritingSetsBtn');

    if (listEl) listEl.style.display = 'none';
    if (emptyEl) emptyEl.style.display = 'none';
    if (formCard) formCard.style.display = 'block';

    // Hide header buttons to avoid confusion
    if (createBtn) createBtn.style.display = 'none';
    if (refreshBtn) refreshBtn.style.display = 'none';

    // Reset form to create mode if not editing
    if (!isEdit) {
        window._writingEditMode = false;
        window._writingEditId = null;
        document.getElementById('writing-form-title').textContent = 'Tạo bộ đề Writing mới';
        const keyInput = document.getElementById('w-lessonKey');
        if (keyInput) { keyInput.readOnly = false; keyInput.value = ''; }
        const submitBtn = document.querySelector('#writing-upload-form button[onclick*="generateAndUploadWriting"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="bi bi-cloud-upload me-2"></i>Tạo & Upload Bài Học';
            submitBtn.className = 'btn btn-success btn-lg';
        }
        document.getElementById('writing-upload-form')?.reset();
    }
};

window.hideWritingForm = function () {
    const listEl = document.getElementById('writing-set-list');
    const formCard = document.getElementById('writing-set-form-card');
    const createBtn = document.getElementById('createWritingSetBtn');
    const refreshBtn = document.getElementById('refreshWritingSetsBtn');

    if (listEl) listEl.style.display = 'block';
    if (formCard) formCard.style.display = 'none';

    // Show header buttons
    if (createBtn) createBtn.style.display = 'inline-flex';
    if (refreshBtn) refreshBtn.style.display = 'inline-flex';

    // Reset edit state
    window._writingEditMode = false;
    window._writingEditId = null;
    document.getElementById('writing-form-title').textContent = 'Tạo bộ đề Writing mới';
    const keyInput = document.getElementById('w-lessonKey');
    if (keyInput) { keyInput.readOnly = false; keyInput.value = ''; }
    const submitBtn = document.querySelector('#writing-upload-form button[onclick*="generateAndUploadWriting"]');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="bi bi-cloud-upload me-2"></i>Tạo & Upload Bài Học';
        submitBtn.className = 'btn btn-success btn-lg';
    }
    document.getElementById('writing-upload-form')?.reset();

    // Reload list to ensure it's up to date
    loadWritingSets();
};

window.deleteWritingSet = async function (id) {
    if (!confirm("Bạn có chắc chắn muốn xóa bộ đề này không? Hành động này không thể hoàn tác.")) return;

    try {
        const res = await fetch(`/api/lessons/delete?id=${id}`, {
            method: 'DELETE',
            headers: getJsonAuthHeaders()
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to delete');

        alert("Đã xóa bộ đề thành công!");
        loadWritingSets();
    } catch (err) {
        console.error(err);
        alert("Lỗi khi xóa: " + err.message);
    }
};

window.editWritingSet = async function (id, filePath) {
    const listEl = document.getElementById('writing-set-list');
    if (listEl) listEl.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div><p class="mt-2 text-muted">Đang tải dữ liệu bộ đề...</p></div>';

    try {
        // Fetch the JS file directly as static content
        const res = await fetch(`/${filePath}?t=${Date.now()}`);
        if (!res.ok) throw new Error('Không thể tải nội dung bộ đề');
        const jsContent = await res.text();
        const parsed = parseWritingSetContent(jsContent);

        // Show form in edit mode
        showWritingForm(true);
        window._writingEditMode = true;
        window._writingEditId = id;

        // Update UI for edit mode
        document.getElementById('writing-form-title').textContent = `Chỉnh sửa bộ đề #${parsed.key}`;
        const keyInput = document.getElementById('w-lessonKey');
        if (keyInput) { keyInput.value = parsed.key; keyInput.readOnly = true; }
        document.getElementById('w-clubName').value = parsed.clubName;

        // Part 1
        for (let i = 1; i <= 5; i++) {
            const el = document.getElementById(`w-q1_${i}`);
            if (el) el.value = parsed.questions1[`question1_${i}`] || '';
        }
        // Part 2
        document.getElementById('w-q2-question').value = parsed.question2 || '';
        // Part 3
        for (let i = 1; i <= 3; i++) {
            const el = document.getElementById(`w-q3_${i}`);
            if (el) el.value = parsed.questions3[`question3_${i}`] || '';
        }
        // Part 4
        document.getElementById('w-q4-main').value = parsed.questions4Main || '';
        document.getElementById('w-q4-1-text').value = parsed.question4_1Text || '';
        document.getElementById('w-q4-2-text').value = parsed.question4_2Text || '';

        // Change submit button
        const submitBtn = document.querySelector('#writing-upload-form button[onclick*="generateAndUploadWriting"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="bi bi-save me-2"></i>Cập nhật bộ đề';
            submitBtn.className = 'btn btn-warning btn-lg';
        }
    } catch (err) {
        console.error(err);
        alert('Lỗi khi tải dữ liệu: ' + err.message);
        loadWritingSets();
    }
};

function parseWritingSetContent(jsContent) {
    const unesc = (s) => (s || '').replace(/\\n/g, '\n').replace(/\\"/g, '"').trim();
    const getMatch = (pattern) => { const m = jsContent.match(pattern); return m ? m[1] : ''; };

    const key = getMatch(/key_id\s*=\s*"Bộ đề #(\d+)"/);
    const clubName = getMatch(/club_name\s*=\s*"([^"]+)"/);

    // Part 1 — extract from const questions1 block only
    const questions1 = {};
    const q1Block = jsContent.match(/const questions1\s*=\s*\{([\s\S]*?)\};/);
    if (q1Block) {
        for (const m of q1Block[1].matchAll(/"question1_(\d+)":\s*"([^"]*(?:\\.[^"]*)*)"/g)) {
            questions1[`question1_${m[1]}`] = unesc(m[2]);
        }
    }

    // Part 2
    const q2Block = jsContent.match(/const questions2\s*=\s*\{[\s\S]*?"question2":\s*"([^"]*(?:\\.[^"]*)*)"/);
    const question2 = q2Block ? unesc(q2Block[1]) : '';

    // Part 3
    const questions3 = {};
    const q3Block = jsContent.match(/const questions3\s*=\s*\{([\s\S]*?)\};/);
    if (q3Block) {
        for (const m of q3Block[1].matchAll(/"question3_(\d+)":\s*"([^"]*(?:\\.[^"]*)*)"/g)) {
            questions3[`question3_${m[1]}`] = unesc(m[2]);
        }
    }

    // Part 4
    const questions4Main = unesc(getMatch(/questions4_main\s*=\s*"([^"]*(?:\\.[^"]*)*)"/));
    const question4_1Text = unesc(getMatch(/question4_1_text\s*=\s*"([^"]*(?:\\.[^"]*)*)"/));
    const question4_2Text = unesc(getMatch(/question4_2_text\s*=\s*"([^"]*(?:\\.[^"]*)*)"/));

    return { key, clubName, questions1, question2, questions3, questions4Main, question4_1Text, question4_2Text };
}

function extractKeyFromPath(path) {
    // js/writing/writingkey001.js -> 001
    if (!path) return "???";
    const match = path.match(/writingkey(\d+)\.js/);
    return match ? match[1] : path;
}

function getJsonAuthHeaders() {
    if (typeof window.buildAuthorizedHeaders === 'function') {
        return window.buildAuthorizedHeaders({ 'Content-Type': 'application/json' });
    }
    const token = localStorage.getItem('auth_token');
    if (!token) {
        throw new Error("Chưa đăng nhập. Vui lòng đăng nhập lại.");
    }
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    if (typeof window.getDeviceId === 'function') {
        headers['X-Device-Id'] = window.getDeviceId();
    }
    if (typeof window.getDeviceName === 'function') {
        headers['X-Device-Name'] = window.getDeviceName();
    }
    return headers;
}


// --- Form Logic ---

function initWritingForm() {
    console.log("Initializing Writing Form...");
    // Generate Part 1 Fields (5 questions)
    const p1 = document.getElementById('w-part1-container');
    if (p1 && p1.innerHTML.trim() === '') {
        for (let i = 1; i <= 5; i++) {
            p1.innerHTML += `
                <div class="row mb-2 pb-2 border-bottom border-light">
                    <div class="col-12">
                        <label class="form-label small fw-bold">Question 1.${i}</label>
                        <input type="text" class="form-control form-control-sm" id="w-q1_${i}" required>
                    </div>
                </div>
            `;
        }
    }

    // Generate Part 3 Fields (3 questions)
    const p3 = document.getElementById('w-part3-container');
    if (p3 && p3.innerHTML.trim() === '') {
        for (let i = 1; i <= 3; i++) {
            p3.innerHTML += `
                <div class="mb-3 border-bottom pb-2">
                    <label class="form-label small fw-bold">Question 3.${i}</label>
                    <textarea class="form-control mb-2" id="w-q3_${i}" rows="2" required></textarea>
                </div>
            `;
        }
    }
}

async function generateAndUploadWriting() {
    // 1. Validate Form
    const keyInput = document.getElementById('w-lessonKey');
    const clubInput = document.getElementById('w-clubName');

    if (!keyInput.value || !clubInput.value) {
        alert("Vui lòng nhập Mã đề và Tên CLB!");
        return;
    }

    const key = keyInput.value.trim().replace('#', '');
    const club = clubInput.value.trim();
    const fileName = `writingkey${key.padStart(3, '0')}.js`;

    // 2. Generate Content
    let jsContent = `const key_id = "Bộ đề #${key.padStart(3, '0')}";\n`;
    jsContent += `const club_name = "${club}";\n`;
    jsContent += `//----------------------------------------------------------------------\n`;

    // Part 1
    jsContent += `const questions1 = {\n`;
    for (let i = 1; i <= 5; i++) {
        const qVal = document.getElementById(`w-q1_${i}`).value || "";
        jsContent += `    "question1_${i}": "${escapeStr(qVal)}",\n`;
    }
    jsContent += `};\n`;

    jsContent += `const questions1_answer = {\n`;
    for (let i = 1; i <= 5; i++) {
        jsContent += `    "question1_${i}_answer": "",\n`;
    }
    jsContent += `};\n`;

    // Part 2
    const q2Val = document.getElementById('w-q2-question').value || "";

    jsContent += `//----------------------------------------------------------------------\n`;
    jsContent += `const questions2 = {\n    "question2": "${escapeStr(q2Val)}",\n};\n`;
    jsContent += `const questions2_answer = {\n    "question2": "",\n};\n`;

    // Part 3
    jsContent += `//----------------------------------------------------------------------\n`;
    jsContent += `const questions3 = {\n`;
    for (let i = 1; i <= 3; i++) {
        const qVal = document.getElementById(`w-q3_${i}`).value || "";
        jsContent += `    "question3_${i}": "${escapeStr(qVal)}",\n`;
    }
    jsContent += `};\n`;

    jsContent += `const questions3_answer = {\n`;
    for (let i = 1; i <= 3; i++) {
        jsContent += `    "question3_${i}_answer": "",\n`;
    }
    jsContent += `};\n`;

    // Part 4
    jsContent += `//----------------------------------------------------------------------\n`;
    jsContent += `const questions4_main = "${escapeStr(document.getElementById('w-q4-main').value || "")}";\n`;
    jsContent += `const question4_1_text = "${escapeStr(document.getElementById('w-q4-1-text').value || "")}";\n`;
    jsContent += `const question4_2_text = "${escapeStr(document.getElementById('w-q4-2-text').value || "")}";\n`;
    jsContent += `const question4_1_text_answer = \`\`;\n`;
    jsContent += `const question4_2_text_answer = \`\`;\n`;

    // ADDED CONSTANTS & FUNCTIONS FOR RENDER (Compact Version)
    jsContent += `
// Static Render Functions
function renderQuestions1(){const t=document.getElementById("topic-title_q1");if(t)t.textContent=\`Question 1 of 4 - \${club_name}\`;const d=document.getElementById("description_q1");if(d)d.textContent=\`You are joining a \${club_name}. Fill out the form. Write short answers (1-10 words) for each message (5 questions).\`;const c=document.getElementById("questions-container1");if(!c)return;let h="";for(let k in questions1)h+=\`<div class="mb-4"><label class="form-label">\${questions1[k]}</label><input type="text" class="form-control" id="\${k}" name="\${k}"></div>\`;c.innerHTML=h;for(let k in questions1){document.getElementById(k)?.addEventListener("input",e=>{const w=e.target.value.split(/\\s+/).filter(Boolean);if(w.length>10)e.target.value=w.slice(0,10).join(' ')+' '})}}
function renderQuestions2(){const t=document.getElementById("topic-title_q2");if(t)t.textContent=\`Question 2 of 4 - \${club_name}\`;const d=document.getElementById("description_q2");if(d)d.textContent=\`Now you've become a new member of the \${club_name}. Fill in the form. Write in sentences. Use 20-45 words.\`;const c=document.getElementById("questions-container2");if(!c)return;let h="";for(let k in questions2)h+=\`<div class="mb-4"><label class="form-label">\${questions2[k]}</label><textarea class="form-control" id="\${k}" name="\${k}" rows="3"></textarea></div>\`;c.innerHTML=h;for(let k in questions2){document.getElementById(k)?.addEventListener("input",e=>{const w=e.target.value.split(/\\s+/).filter(Boolean);if(w.length>45)e.target.value=w.slice(0,45).join(' ')+' ';const c=e.target.value.split(/\\s+/).filter(Boolean).length;document.getElementById("wordCountLabel").textContent=\`Số từ: \${c} / 45\`})}}
function renderQuestions3(){const t=document.getElementById("topic-title_q3");if(t)t.textContent=\`Question 3 of 4 - \${club_name}\`;const d=document.getElementById("description_q3");if(d)d.textContent=\`You are speaking to fellow members of the \${club_name} in a group chat. Respond to them in full sentences (30-60 words per answer).\`;const c=document.getElementById("questions-container3");if(!c)return;let h="";for(let k in questions3)h+=\`<div class="mb-4"><label class="form-label">\${questions3[k]}</label><textarea class="form-control" id="\${k}" name="\${k}" rows="3"></textarea><div id="\${k}-wordCount" class="text-muted text-end mt-1">Số từ: 0 / 60</div></div>\`;c.innerHTML=h;for(let k in questions3){document.getElementById(k)?.addEventListener("input",e=>{const w=e.target.value.split(/\\s+/).filter(Boolean);if(w.length>60)e.target.value=w.slice(0,60).join(' ')+' ';const c=e.target.value.split(/\\s+/).filter(Boolean).length;document.getElementById(\`\${k}-wordCount\`).textContent=\`Số từ: \${c} / 60\`})}}
function renderQuestions4(){const t=document.getElementById("topic-title_q4");if(t)t.textContent=\`Question 4 of 4 - \${club_name}\`;const d=document.getElementById("description_q4");if(d)d.textContent="Write a short email (about 50-75 words) to your friend, and a longer email (120-225 words) to the president of the club.";const c=document.getElementById("questions-container4");if(!c)return;const q4={"question4_1":\`\${questions4_main} <br><strong>\${question4_1_text}</strong>\`,"question4_2":\`\${questions4_main} <br><strong>\${question4_2_text}</strong>\`};let h="";for(let k in q4)h+=\`<div class="mb-4"><label class="form-label">\${q4[k]}</label><textarea class="form-control" id="\${k}" name="\${k}" rows="4"></textarea><div id="\${k}-wordCount" class="text-muted text-end mt-1">Số từ: 0</div></div>\`;c.innerHTML=h;for(let k in q4){const mx=k==='question4_1'?75:225;document.getElementById(\`\${k}-wordCount\`).textContent=\`Số từ: 0 / \${mx}\`;document.getElementById(k)?.addEventListener("input",e=>{const w=(e.target.value||"").trim().split(/\\s+/).filter(Boolean);if(w.length>mx)e.target.value=w.slice(0,mx).join(' ')+' ';const c=e.target.value.split(/\\s+/).filter(Boolean).length;document.getElementById(\`\${k}-wordCount\`).textContent=\`Số từ: \${c} / \${mx}\`})}}

// Prompt variables
const promptText_question1 = "Người này đang là thành viên của câu lạc bộ " + club_name + " Hãy chấm điểm 5 câu sau theo khung aptis mức độ A0 đến C1, tiêu chí chấm điểm là trả lời 1-10 từ, đơn giản và viết hoa chữ đầu dấu chấm cuối câu, kết quả trả về có giải thích.\\n\\n";
const promptText_question2 = "Người này đang là thành viên của câu lạc bộ " + club_name + " Hãy chấm điểm câu trả lời sau theo khung aptis mức độ A0 đến C1, độ dài trong phạm vi 20-45 words, kết quả trả về có giải thích:\\n\\n";
const promptText_question3 = "Người này đang là thành viên của câu lạc bộ " + club_name + " Hãy chấm điểm câu trả lời sau theo khung aptis mức độ A0 đến C1, độ dài trong phạm vi 30-60 từ, kết quả trả về có giải thích:\\n\\n";
const promptText_question4 = "Người này đang là thành viên của câu lạc bộ " + club_name + " Hãy chấm điểm câu trả lời sau theo khung aptis mức độ A0 đến C1, độ dài trong phạm vi 50-75 từ cho câu hỏi 1 và 120-225 từ cho câu hỏi 2, kết quả trả về có giải thích, sau khi chấm 4 câu hãy chấm cấp độ tổng thể cho các câu trên:\\n\\n";

// Navigation
const questions = ["question1", "question2", "question3", "question4"];
let currentQuestionIndex = 0;
function showCurrentQuestion(){questions.forEach(id=>{const el=document.getElementById(id);if(el)el.style.display='none'});const c=document.getElementById(questions[currentQuestionIndex]);if(c)c.style.display='block';const btn=document.getElementById('btn_checkallquestions');if(btn)btn.classList.toggle('d-none', currentQuestionIndex !== questions.length - 1)}
document.addEventListener("DOMContentLoaded",()=>{if(typeof key_id!=='undefined')document.getElementById('keys_id').innerHTML=key_id;document.getElementById('nextButton')?.addEventListener('click',()=>currentQuestionIndex<questions.length-1&&++currentQuestionIndex&&showCurrentQuestion());document.getElementById('backButton')?.addEventListener('click',()=>currentQuestionIndex>0&&--currentQuestionIndex&&showCurrentQuestion());document.getElementById('btn_checkallquestions')?.addEventListener('click',()=>new bootstrap.Modal(document.getElementById('confirmationModal')).show());document.getElementById('confirmButton')?.addEventListener('click',()=>handleSubmitAllQuestions()||bootstrap.Modal.getInstance(document.getElementById('confirmationModal')).hide());showCurrentQuestion()});

// Submit Logic
async function handleSubmitAllQuestions(){
    const ans={question1:{},question2:{},question3:{},question4:{}};
    for(let i=1;i<=5;i++)ans.question1[\`question1_\${i}\`]=document.getElementById(\`question1_\${i}\`)?.value||"";
    const q2Key=Object.keys(questions2)[0]||"question2";
    ans.question2[q2Key]=document.getElementById(q2Key)?.value||"";
    for(let i=1;i<=3;i++)ans.question3[\`question3_\${i}\`]=document.getElementById(\`question3_\${i}\`)?.value||"";
    ans.question4.question4_1=document.getElementById('question4_1')?.value||"";
    ans.question4.question4_2=document.getElementById('question4_2')?.value||"";
    
    const full=\`\${promptText_question1}\n\${Object.entries(ans.question1).map(([k,v])=>\`\${questions1[k]}: \${v}\`).join('\\n')}\n\n\${promptText_question2}\n\${questions2[q2Key]}: \${ans.question2[q2Key]}\n\n\${promptText_question3}\n\${Object.entries(ans.question3).map(([k,v])=>\`\${questions3[k]}: \${v}\`).join('\\n')}\n\n\${promptText_question4}\nEmail 1: \${ans.question4.question4_1}\nEmail 2: \${ans.question4.question4_2}\`;
    
    const loading=new bootstrap.Modal(document.getElementById('loadingModal'));loading.show();
    try{const r=await fetch('/api/ask',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:full})});const d=await r.json();document.getElementById('modal-body-ai').innerHTML=\`<div style="white-space: pre-wrap;">\${d.answer||d.error}</div>\`;new bootstrap.Modal(document.getElementById('resultModal')).show();}catch(e){alert('Lỗi: '+e.message)}finally{loading.hide()}
}
window.handleSubmitAllQuestions=handleSubmitAllQuestions;

// Answer Logic
document.addEventListener("DOMContentLoaded", function() {
    ["question1", "question2", "question3", "question4"].forEach(q => {
        const btn = document.getElementById(\`\${q}_showanswer\`);
        if (btn) {
            btn.onclick = function() {
                const body = document.getElementById(\`modal-body\${q === 'question1' ? '' : q.replace('question', '')}\`);
                body.innerHTML = "";
                if(q==='question1'){for(let i=1;i<=5;i++)body.innerHTML+=\`<p><strong>\${questions1['question1_'+i]}</strong><br>\${questions1_answer['question1_'+i+'_answer']}</p>\`}
                else if(q==='question2')body.innerHTML=\`<p><strong>\${questions2.question2}</strong><br>\${questions2_answer.question2}</p>\`
                else if(q==='question3'){for(let i=1;i<=3;i++)body.innerHTML+=\`<p><strong>\${questions3['question3_'+i]}</strong><br>\${questions3_answer['question3_'+i+'_answer']}</p>\`}
                else if(q==='question4')body.innerHTML=\`<p><strong>Friend:</strong><br>\${question4_1_text_answer}</p><p><strong>President:</strong><br>\${question4_2_text_answer}</p>\`
                new bootstrap.Modal(document.getElementById(\`\${q}_answerModal\`)).show();
            };
        }
    });
});

// Init
if(typeof renderQuestions1==='function'){renderQuestions1();renderQuestions2();renderQuestions3();renderQuestions4();}
`;

    // 3. Upload to API
    const btn = document.querySelector('#writing-upload-form button[onclick*="generateAndUploadWriting"]');
    const originalText = btn ? btn.innerHTML : 'Lưu lại';
    if (btn) {
        btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Uploading...';
        btn.disabled = true;
    }

    try {
        const response = await fetch('/api/upload-lesson', {
            method: 'POST',
            headers: getJsonAuthHeaders(),
            body: JSON.stringify({
                filePath: `js/writing/${fileName}`,
                content: jsContent,
                message: window._writingEditMode ? `Update writing lesson ${fileName}` : `Upload writing lesson ${fileName}`,
                part: 'writing',
                title: `Writing Set #${key}`,
                topic: club,
                club: club,
                lessonId: window._writingEditMode ? window._writingEditId : undefined
            })
        });

        if (response.ok) {
            alert(window._writingEditMode ? 'Cập nhật thành công! File: ' + fileName : 'Upload thành công! File: ' + fileName);
            // Hide form and reload list
            if (typeof hideWritingForm === 'function') hideWritingForm();
        } else {
            const err = await response.text();
            alert('Upload thất bại: ' + err);
        }

    } catch (e) {
        console.error(e);
        alert('Có lỗi xảy ra: ' + e.message);
    } finally {
        if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }
}

function escapeStr(str) {
    if (!str) return "";
    return str.replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '');
}
