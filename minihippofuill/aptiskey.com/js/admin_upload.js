// Admin Upload Script for Mini Hippo Reading Questions

// Global variables - Use window to make them accessible across scripts
window.currentPart = window.currentPart || 1;
window.part1Questions = window.part1Questions || [];
window.part2Sentences = window.part2Sentences || [];
window.part4Questions = window.part4Questions || [];
window.part5Options = window.part5Options || [];
window.part5Paragraphs = window.part5Paragraphs || [];

// Create local references - use window directly for currentPart to always get latest value
// For arrays, we'll update window when we modify them
var currentPart = window.currentPart;
var part1Questions = window.part1Questions;
var part2Sentences = window.part2Sentences;
var part4Questions = window.part4Questions;
var part5Options = window.part5Options;
var part5Paragraphs = window.part5Paragraphs;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Part selector event listeners
    document.querySelectorAll('input[name="partSelect"]').forEach(radio => {
        radio.addEventListener('change', function() {
            switchPart(parseInt(this.value));
        });
    });
    
    // Initialize with Part 1
    switchPart(1);
    addPart1Question();
    
    // Initialize Part 4 with 7 questions
    for (let i = 0; i < 7; i++) {
        addPart4Question();
    }
    
    // Initialize Part 5 with 7 options and 7 paragraphs
    for (let i = 0; i < 7; i++) {
        addPart5Option();
        addPart5Paragraph();
    }
});

// Switch between parts
function switchPart(part) {
    window.currentPart = part;
    
    // Hide all part forms only (part1-form, part2-form, part4-form, part5-form)
    const partForms = ['part1-form', 'part2-form', 'part4-form', 'part5-form'];
    partForms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            form.style.display = 'none';
        }
    });
    
    // Show selected form
    const selectedForm = document.getElementById(`part${part}-form`);
    if (selectedForm) {
        selectedForm.style.display = 'block';
    }
    
    // Update radio button
    const radio = document.getElementById(`part${part}`);
    if (radio) {
        radio.checked = true;
    }
    
    // Always ensure action buttons section is visible
    const actionSection = document.getElementById('action-buttons-section');
    if (actionSection) {
        actionSection.style.display = 'block';
        actionSection.style.visibility = 'visible';
        actionSection.style.opacity = '1';
    }
}

// ============================================
// PART 1: Fill in the Blank
// ============================================

function addPart1Question() {
    const index = part1Questions.length;
    const container = document.getElementById('part1-questions-container');
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    questionDiv.id = `part1-q${index}`;
    questionDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <h5 class="mb-0">Câu hỏi ${index + 1}</h5>
            <button type="button" class="btn btn-remove btn-sm" onclick="removePart1Question(${index})">
                <i class="bi bi-trash"></i>
            </button>
        </div>
        <div class="row g-3">
            <div class="col-md-4">
                <label class="form-label">Question Start</label>
                <input type="text" class="form-control part1-questionStart" placeholder="Where is the train">
            </div>
            <div class="col-md-4">
                <label class="form-label">Question End</label>
                <input type="text" class="form-control part1-questionEnd" placeholder="in this town?">
            </div>
            <div class="col-md-4">
                <label class="form-label">Correct Answer</label>
                <input type="text" class="form-control part1-correctAnswer" placeholder="station">
            </div>
            <div class="col-md-12">
                <label class="form-label">Answer Options (mỗi option một dòng)</label>
                <textarea class="form-control part1-answerOptions" rows="3" placeholder="station&#10;school&#10;market"></textarea>
            </div>
        </div>
    `;
    
    container.appendChild(questionDiv);
    part1Questions.push({
        questionStart: '',
        answerOptions: [],
        questionEnd: '',
        correctAnswer: ''
    });
}

function removePart1Question(index) {
    const questionDiv = document.getElementById(`part1-q${index}`);
    if (questionDiv) {
        questionDiv.remove();
        part1Questions.splice(index, 1);
        // Re-render to update indices
        renderPart1Questions();
    }
}

function renderPart1Questions() {
    const container = document.getElementById('part1-questions-container');
    container.innerHTML = '';
    part1Questions.forEach((q, index) => {
        addPart1Question();
        // Populate with existing data
        const questionDiv = document.getElementById(`part1-q${index}`);
        if (questionDiv) {
            questionDiv.querySelector('.part1-questionStart').value = q.questionStart || '';
            questionDiv.querySelector('.part1-questionEnd').value = q.questionEnd || '';
            questionDiv.querySelector('.part1-correctAnswer').value = q.correctAnswer || '';
            questionDiv.querySelector('.part1-answerOptions').value = Array.isArray(q.answerOptions) ? q.answerOptions.join('\n') : '';
        }
    });
}

// ============================================
// PART 2 & 3: Sentence Ordering
// ============================================

function addPart2Sentence() {
    const index = part2Sentences.length;
    const container = document.getElementById('part2-sentences-container');
    
    const sentenceDiv = document.createElement('div');
    sentenceDiv.className = 'question-item';
    sentenceDiv.id = `part2-s${index}`;
    sentenceDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <h5 class="mb-0">Câu văn ${index + 1}</h5>
            <button type="button" class="btn btn-remove btn-sm" onclick="removePart2Sentence(${index})">
                <i class="bi bi-trash"></i>
            </button>
        </div>
        <textarea class="form-control part2-sentence" rows="2" placeholder="Old movies were very different from today's movies."></textarea>
    `;
    
    container.appendChild(sentenceDiv);
    part2Sentences.push('');
}

function removePart2Sentence(index) {
    const sentenceDiv = document.getElementById(`part2-s${index}`);
    if (sentenceDiv) {
        sentenceDiv.remove();
        part2Sentences.splice(index, 1);
        renderPart2Sentences();
    }
}

function renderPart2Sentences() {
    const container = document.getElementById('part2-sentences-container');
    container.innerHTML = '';
    part2Sentences.forEach((s, index) => {
        addPart2Sentence();
        const sentenceDiv = document.getElementById(`part2-s${index}`);
        if (sentenceDiv) {
            sentenceDiv.querySelector('.part2-sentence').value = s || '';
        }
    });
}

// ============================================
// PART 4: Reading Comprehension
// ============================================

function addPart4Question() {
    const index = part4Questions.length;
    const container = document.getElementById('part4-questions-container');
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    questionDiv.id = `part4-q${index}`;
    questionDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <h5 class="mb-0">Câu hỏi ${index + 1}</h5>
            <button type="button" class="btn btn-remove btn-sm" onclick="removePart4Question(${index})">
                <i class="bi bi-trash"></i>
            </button>
        </div>
        <div class="row g-3">
            <div class="col-md-9">
                <label class="form-label">Câu hỏi</label>
                <input type="text" class="form-control part4-question" placeholder="Who finds today's games harder than before?">
            </div>
            <div class="col-md-3">
                <label class="form-label">Correct Answer</label>
                <select class="form-select part4-correctAnswer">
                    <option value="">-- Chọn --</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                </select>
            </div>
        </div>
    `;
    
    container.appendChild(questionDiv);
    part4Questions.push({
        question: '',
        correctAnswer: ''
    });
}

function removePart4Question(index) {
    const questionDiv = document.getElementById(`part4-q${index}`);
    if (questionDiv) {
        questionDiv.remove();
        part4Questions.splice(index, 1);
        renderPart4Questions();
    }
}

function renderPart4Questions() {
    const container = document.getElementById('part4-questions-container');
    container.innerHTML = '';
    part4Questions.forEach((q, index) => {
        addPart4Question();
        const questionDiv = document.getElementById(`part4-q${index}`);
        if (questionDiv) {
            questionDiv.querySelector('.part4-question').value = q.question || '';
            questionDiv.querySelector('.part4-correctAnswer').value = q.correctAnswer || '';
        }
    });
}

// ============================================
// PART 5: Paragraph Matching
// ============================================

function addPart5Option() {
    const index = part5Options.length;
    const container = document.getElementById('part5-options-container');
    
    const optionDiv = document.createElement('div');
    optionDiv.className = 'question-item';
    optionDiv.id = `part5-opt${index}`;
    optionDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <h5 class="mb-0">Option ${index + 1}</h5>
            <button type="button" class="btn btn-remove btn-sm" onclick="removePart5Option(${index})">
                <i class="bi bi-trash"></i>
            </button>
        </div>
        <input type="text" class="form-control part5-option" placeholder="Changing the definition of mountain">
    `;
    
    container.appendChild(optionDiv);
    part5Options.push('');
}

function removePart5Option(index) {
    const optionDiv = document.getElementById(`part5-opt${index}`);
    if (optionDiv) {
        optionDiv.remove();
        part5Options.splice(index, 1);
        renderPart5Options();
    }
}

function renderPart5Options() {
    const container = document.getElementById('part5-options-container');
    container.innerHTML = '';
    part5Options.forEach((opt, index) => {
        addPart5Option();
        const optionDiv = document.getElementById(`part5-opt${index}`);
        if (optionDiv) {
            optionDiv.querySelector('.part5-option').value = opt || '';
        }
    });
}

function addPart5Paragraph() {
    const index = part5Paragraphs.length;
    const container = document.getElementById('part5-paragraphs-container');
    
    const paragraphDiv = document.createElement('div');
    paragraphDiv.className = 'question-item';
    paragraphDiv.id = `part5-p${index}`;
    paragraphDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <h5 class="mb-0">Đoạn văn ${index + 1}</h5>
            <button type="button" class="btn btn-remove btn-sm" onclick="removePart5Paragraph(${index})">
                <i class="bi bi-trash"></i>
            </button>
        </div>
        <textarea class="form-control part5-paragraph" rows="3" placeholder="The term 'mountain' has evolved over time..."></textarea>
    `;
    
    container.appendChild(paragraphDiv);
    part5Paragraphs.push('');
}

function removePart5Paragraph(index) {
    const paragraphDiv = document.getElementById(`part5-p${index}`);
    if (paragraphDiv) {
        paragraphDiv.remove();
        part5Paragraphs.splice(index, 1);
        renderPart5Paragraphs();
    }
}

function renderPart5Paragraphs() {
    const container = document.getElementById('part5-paragraphs-container');
    container.innerHTML = '';
    part5Paragraphs.forEach((p, index) => {
        addPart5Paragraph();
        const paragraphDiv = document.getElementById(`part5-p${index}`);
        if (paragraphDiv) {
            paragraphDiv.querySelector('.part5-paragraph').value = p || '';
        }
    });
}

// ============================================
// Data Collection & JSON Generation
// ============================================

function collectPart1Data() {
    part1Questions = [];
    document.querySelectorAll('#part1-questions-container .question-item').forEach((item, index) => {
        const questionStart = item.querySelector('.part1-questionStart').value.trim();
        const questionEnd = item.querySelector('.part1-questionEnd').value.trim();
        const correctAnswer = item.querySelector('.part1-correctAnswer').value.trim();
        const answerOptionsText = item.querySelector('.part1-answerOptions').value.trim();
        const answerOptions = answerOptionsText.split('\n').filter(opt => opt.trim() !== '');
        
        if (questionStart || questionEnd || correctAnswer) {
            part1Questions.push({
                questionStart,
                answerOptions,
                questionEnd,
                correctAnswer
            });
        }
    });
    
    return {
        part: 1,
        title: document.getElementById('part1-title').value.trim() || 'Reading Question 1',
        questions: part1Questions
    };
}

function collectPart2Data() {
    part2Sentences = [];
    document.querySelectorAll('#part2-sentences-container .question-item').forEach(item => {
        const sentence = item.querySelector('.part2-sentence').value.trim();
        if (sentence) {
            part2Sentences.push(sentence);
        }
    });
    
    return {
        part: 2,
        title: document.getElementById('part2-title').value.trim() || 'Reading Question 2 & 3',
        topic: document.getElementById('part2-topic').value.trim() || '',
        sentences: part2Sentences
    };
}

function collectPart4Data() {
    part4Questions = [];
    document.querySelectorAll('#part4-questions-container .question-item').forEach(item => {
        const question = item.querySelector('.part4-question').value.trim();
        const correctAnswer = item.querySelector('.part4-correctAnswer').value.trim();
        if (question || correctAnswer) {
            part4Questions.push({
                question,
                options: ['', 'A', 'B', 'C', 'D'],
                correctAnswer
            });
        }
    });
    
    const texts = [
        document.getElementById('part4-text-intro').value.trim(),
        document.getElementById('part4-text-a').value.trim(),
        document.getElementById('part4-text-b').value.trim(),
        document.getElementById('part4-text-c').value.trim(),
        document.getElementById('part4-text-d').value.trim()
    ];
    
    return {
        part: 4,
        title: document.getElementById('part4-title').value.trim() || 'Reading Question 4',
        topic: document.getElementById('part4-topic').value.trim() || '',
        texts: texts,
        questions: part4Questions
    };
}

function collectPart5Data() {
    part5Options = [];
    document.querySelectorAll('#part5-options-container .question-item').forEach(item => {
        const option = item.querySelector('.part5-option').value.trim();
        if (option) {
            part5Options.push(option);
        }
    });
    
    part5Paragraphs = [];
    document.querySelectorAll('#part5-paragraphs-container .question-item').forEach(item => {
        const paragraph = item.querySelector('.part5-paragraph').value.trim();
        if (paragraph) {
            part5Paragraphs.push(paragraph);
        }
    });
    
    return {
        part: 5,
        title: document.getElementById('part5-title').value.trim() || 'Reading Question 5',
        topic: document.getElementById('part5-topic').value.trim() || '',
        options: ['', ...part5Options], // First option is always empty
        paragraphs: part5Paragraphs,
        tips: {
            keyword: document.getElementById('part5-keyword').value.trim(),
            meo: document.getElementById('part5-meo').value.trim()
        }
    };
}

function generateJSON() {
    let data;
    
    switch (currentPart) {
        case 1:
            data = collectPart1Data();
            break;
        case 2:
            data = collectPart2Data();
            break;
        case 4:
            data = collectPart4Data();
            break;
        case 5:
            data = collectPart5Data();
            break;
        default:
            data = {};
    }
    
    return JSON.stringify(data, null, 2);
}

// ============================================
// Preview & Export
// ============================================

function previewJSON() {
    const json = generateJSON();
    const previewSection = document.getElementById('preview-section');
    const jsonPreview = document.getElementById('json-preview');
    
    jsonPreview.textContent = json;
    previewSection.style.display = 'block';
    previewSection.scrollIntoView({ behavior: 'smooth' });
}

function exportJSON() {
    const json = generateJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reading_question_part${currentPart}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Đã export JSON thành công!');
}

function copyJSON() {
    const json = generateJSON();
    navigator.clipboard.writeText(json).then(() => {
        alert('Đã copy JSON vào clipboard!');
    });
}

// ============================================
// Import JSON
// ============================================

function importJSON() {
    document.getElementById('jsonFileInput').click();
}

function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            loadDataIntoForm(data);
            alert('Đã import JSON thành công!');
        } catch (error) {
            alert('Lỗi: Không thể đọc file JSON. Vui lòng kiểm tra lại format.');
            console.error(error);
        }
    };
    reader.readAsText(file);
}

function loadDataIntoForm(data) {
    // Switch to the correct part
    switchPart(data.part);
    
    switch (data.part) {
        case 1:
            loadPart1Data(data);
            break;
        case 2:
            loadPart2Data(data);
            break;
        case 4:
            loadPart4Data(data);
            break;
        case 5:
            loadPart5Data(data);
            break;
    }
}

function loadPart1Data(data) {
    document.getElementById('part1-title').value = data.title || '';
    part1Questions = data.questions || [];
    renderPart1Questions();
}

function loadPart2Data(data) {
    document.getElementById('part2-title').value = data.title || '';
    document.getElementById('part2-topic').value = data.topic || '';
    part2Sentences = data.sentences || [];
    renderPart2Sentences();
}

function loadPart4Data(data) {
    document.getElementById('part4-title').value = data.title || '';
    document.getElementById('part4-topic').value = data.topic || '';
    
    if (data.texts && data.texts.length >= 5) {
        document.getElementById('part4-text-intro').value = data.texts[0] || '';
        document.getElementById('part4-text-a').value = data.texts[1] || '';
        document.getElementById('part4-text-b').value = data.texts[2] || '';
        document.getElementById('part4-text-c').value = data.texts[3] || '';
        document.getElementById('part4-text-d').value = data.texts[4] || '';
    }
    
    part4Questions = data.questions || [];
    renderPart4Questions();
}

function loadPart5Data(data) {
    document.getElementById('part5-title').value = data.title || '';
    document.getElementById('part5-topic').value = data.topic || '';
    
    // Remove first empty option
    const options = data.options || [];
    part5Options = options.slice(1);
    renderPart5Options();
    
    part5Paragraphs = data.paragraphs || [];
    renderPart5Paragraphs();
    
    if (data.tips) {
        document.getElementById('part5-keyword').value = data.tips.keyword || '';
        document.getElementById('part5-meo').value = data.tips.meo || '';
    }
}

// ============================================
// Clear Form
// ============================================

function clearForm() {
    if (confirm('Bạn có chắc muốn xóa toàn bộ dữ liệu trong form?')) {
        switch (currentPart) {
            case 1:
                document.getElementById('part1-title').value = '';
                part1Questions = [];
                document.getElementById('part1-questions-container').innerHTML = '';
                break;
            case 2:
                document.getElementById('part2-title').value = '';
                document.getElementById('part2-topic').value = '';
                part2Sentences = [];
                document.getElementById('part2-sentences-container').innerHTML = '';
                break;
            case 4:
                document.getElementById('part4-title').value = '';
                document.getElementById('part4-topic').value = '';
                document.getElementById('part4-text-intro').value = '';
                document.getElementById('part4-text-a').value = '';
                document.getElementById('part4-text-b').value = '';
                document.getElementById('part4-text-c').value = '';
                document.getElementById('part4-text-d').value = '';
                part4Questions = [];
                document.getElementById('part4-questions-container').innerHTML = '';
                break;
            case 5:
                document.getElementById('part5-title').value = '';
                document.getElementById('part5-topic').value = '';
                document.getElementById('part5-keyword').value = '';
                document.getElementById('part5-meo').value = '';
                part5Options = [];
                part5Paragraphs = [];
                document.getElementById('part5-options-container').innerHTML = '';
                document.getElementById('part5-paragraphs-container').innerHTML = '';
                break;
        }
        
        document.getElementById('preview-section').style.display = 'none';
    }
}

