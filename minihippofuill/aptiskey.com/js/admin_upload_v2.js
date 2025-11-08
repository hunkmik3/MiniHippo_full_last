// Admin Upload Script v2 - Support Multiple Question Sets per Part
// This file extends admin_upload.js with multi-set functionality

// Use existing variables from admin_upload.js (don't redeclare)
// currentPart, part1Questions, part2Sentences, etc. are already declared in admin_upload.js

// Question sets storage - only declare if not exists
window.questionSets = window.questionSets || {
    1: [], // Array of question sets for Part 1
    2: [], // Array of question sets for Part 2
    4: [], // Array of question sets for Part 4
    5: []  // Array of question sets for Part 5
};

// Create references to use in this file
const questionSets = window.questionSets;

// Initialize on page load - Wait a bit to avoid conflict with admin_upload.js
document.addEventListener('DOMContentLoaded', function() {
    // Use setTimeout to ensure admin_upload.js initializes first
    setTimeout(function() {
        console.log('Admin upload v2 initialized');
        
        // Check if editing existing lesson
        const urlParams = new URLSearchParams(window.location.search);
        const editLessonId = urlParams.get('edit');
        const editPart = urlParams.get('part');
        
        if (editLessonId && editPart) {
            // Load existing lesson
            loadExistingLesson(editLessonId, parseInt(editPart));
        } else {
            // Render empty sets for all parts
            renderQuestionSets(1);
            renderQuestionSets(2);
            renderQuestionSets(4);
            renderQuestionSets(5);
        }
        
        console.log('All question sets rendered');
    }, 100);
});

// Load existing lesson for editing
async function loadExistingLesson(lessonId, part) {
    try {
        // Show loading state
        const banner = document.getElementById('edit-mode-banner');
        if (banner) {
            banner.style.display = 'block';
        }
        
        // Fetch lesson data
        const response = await fetch(`/api/lessons/get?id=${lessonId}`);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to load lesson');
        }
        
        const lesson = result.lesson;
        
        // Store editing state
        window.editingLessonId = lessonId;
        window.editingLessonFilePath = lesson.file_path;
        
        // Switch to correct part
        if (typeof switchPart === 'function') {
            switchPart(part);
        }
        
        // Note: To fully load the lesson, we would need to:
        // 1. Fetch the JS file from GitHub
        // 2. Parse the JS code to extract question sets
        // 3. Load into form
        
        // For now, just show a message
        alert(`Đang chỉnh sửa bài học: ${lesson.title || lesson.topic}\n\nLưu ý: Bạn cần nhập lại dữ liệu. Tính năng tự động load từ file sẽ được thêm sau.`);
        
    } catch (error) {
        console.error('Error loading lesson:', error);
        alert('Lỗi khi tải bài học: ' + error.message);
    }
}

// Override switchPart to also render question sets
(function() {
    const originalSwitchPart = window.switchPart;
    window.switchPart = function(part) {
        if (originalSwitchPart && typeof originalSwitchPart === 'function') {
            originalSwitchPart(part);
        } else {
            // Fallback if original doesn't exist
            window.currentPart = part;
            // Hide all part forms (but not action buttons)
            document.querySelectorAll('.form-section').forEach(form => {
                if (form.id !== 'action-buttons-section' && form.id && form.id.startsWith('part') && form.id.endsWith('-form')) {
                    form.style.display = 'none';
                }
            });
            const form = document.getElementById(`part${part}-form`);
            if (form) form.style.display = 'block';
            const radio = document.getElementById(`part${part}`);
            if (radio) radio.checked = true;
            
            // Always show action buttons
            const actionSection = document.getElementById('action-buttons-section');
            if (actionSection) {
                actionSection.style.display = 'block';
            }
        }
        // Always render question sets after switching
        if (typeof renderQuestionSets === 'function') {
            renderQuestionSets(part);
        }
    };
})();

// ============================================
// Question Set Management
// ============================================

function addQuestionSet(part) {
    try {
        console.log('=== addQuestionSet called for part:', part);
        
        if (!part || (part !== 1 && part !== 2 && part !== 4 && part !== 5)) {
            console.error('Invalid part:', part);
            alert('Part không hợp lệ: ' + part);
            return;
        }
        
        const setId = questionSets[part].length + 1;
        const newSet = {
            id: setId,
            title: '',
            data: getEmptySetData(part)
        };
        
        questionSets[part].push(newSet);
        console.log('New set added. Total sets for part', part, ':', questionSets[part].length);
        
        // Hide sets container and show edit form
        const setsContainer = document.getElementById(`part${part}-sets-container`);
        if (setsContainer) {
            setsContainer.style.display = 'none';
            console.log('Sets container hidden');
        } else {
            console.error('Sets container not found:', `part${part}-sets-container`);
        }
        
        const editForm = document.getElementById(`part${part}-edit-form`);
        if (editForm) {
            editForm.style.display = 'block';
            console.log('Edit form shown for part', part);
        } else {
            console.error('Edit form not found:', `part${part}-edit-form`);
            alert('Không tìm thấy form chỉnh sửa cho part ' + part);
            return;
        }
        
        // Clear form first (without confirm)
        clearFormSilently(part);
        console.log('Form cleared');
        
        // Load empty set into form for editing
        const setIndex = questionSets[part].length - 1;
        loadSetIntoForm(part, setIndex);
        console.log('Set loaded into form, index:', setIndex);
        
        // Initialize with default items if needed
        if (part === 1) {
            // Add one question to start
            if (typeof addPart1Question === 'function') {
                addPart1Question();
                console.log('Part 1 question added');
            } else {
                console.error('addPart1Question is not a function');
            }
        } else if (part === 2) {
            // Add one sentence to start
            if (typeof addPart2Sentence === 'function') {
                addPart2Sentence();
                console.log('Part 2 sentence added');
            }
        } else if (part === 4) {
            // Initialize with 7 questions for Part 4
            if (typeof addPart4Question === 'function') {
                for (let i = 0; i < 7; i++) {
                    addPart4Question();
                }
                console.log('Part 4 questions added');
            }
        } else if (part === 5) {
            // Initialize with 7 options and 7 paragraphs for Part 5
            if (typeof addPart5Option === 'function' && typeof addPart5Paragraph === 'function') {
                for (let i = 0; i < 7; i++) {
                    addPart5Option();
                    addPart5Paragraph();
                }
                console.log('Part 5 options and paragraphs added');
            }
        }
        
        console.log('=== addQuestionSet completed successfully');
    } catch (error) {
        console.error('Error in addQuestionSet:', error);
        console.error('Error stack:', error.stack);
        alert('Có lỗi xảy ra: ' + error.message + '\nVui lòng mở Console để xem chi tiết.');
    }
}

function removeQuestionSet(part, index) {
    if (confirm('Bạn có chắc muốn xóa bộ đề này?')) {
        questionSets[part].splice(index, 1);
        // Re-index all sets
        questionSets[part].forEach((set, idx) => {
            set.id = idx + 1;
        });
        renderQuestionSets(part);
    }
}

function getEmptySetData(part) {
    switch(part) {
        case 1:
            return { questions: [] };
        case 2:
            return { topic: '', sentences: [] };
        case 4:
            return { 
                topic: '', 
                texts: ['', '', '', '', ''], 
                questions: [] 
            };
        case 5:
            return { 
                topic: '', 
                options: [], 
                paragraphs: [], 
                tips: { keyword: '', meo: '' } 
            };
        default:
            return {};
    }
}

function renderQuestionSets(part) {
    const container = document.getElementById(`part${part}-sets-container`);
    if (!container) return;
    
    container.innerHTML = '';
    
    questionSets[part].forEach((set, index) => {
        const setDiv = document.createElement('div');
        setDiv.className = 'question-set-item mb-4';
        setDiv.id = `part${part}-set-${index}`;
        
        setDiv.innerHTML = `
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="bi bi-folder me-2"></i>
                        Bộ đề ${set.id}
                        ${set.title ? `: ${set.title}` : ''}
                    </h5>
                    <div>
                        <button type="button" class="btn btn-sm btn-outline-primary me-2" onclick="editQuestionSet(${part}, ${index})">
                            <i class="bi bi-pencil"></i> Sửa
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeQuestionSet(${part}, ${index})">
                            <i class="bi bi-trash"></i> Xóa
                        </button>
                    </div>
                </div>
                <div class="card-body" id="part${part}-set-${index}-content">
                    ${renderSetContent(part, set)}
                </div>
            </div>
        `;
        
        container.appendChild(setDiv);
    });
    
    // If no sets, show message
    if (questionSets[part].length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                Chưa có bộ đề nào. Hãy thêm bộ đề đầu tiên.
            </div>
        `;
    }
}

function renderSetContent(part, set) {
    if (!set || !set.data) {
        return '<p class="text-muted">Chưa có dữ liệu</p>';
    }
    
    switch(part) {
        case 1:
            const qCount = set.data.questions ? set.data.questions.length : 0;
            return `<p class="mb-1"><strong>Số câu hỏi:</strong> ${qCount}</p>
                    <p class="mb-0 text-muted"><small>${set.title || 'Chưa có tiêu đề'}</small></p>`;
        case 2:
            const sCount = set.data.sentences ? set.data.sentences.length : 0;
            return `<p class="mb-1"><strong>Topic:</strong> ${set.data.topic || '(chưa có)'}</p>
                    <p class="mb-1"><strong>Số câu văn:</strong> ${sCount}</p>
                    <p class="mb-0 text-muted"><small>${set.title || 'Chưa có tiêu đề'}</small></p>`;
        case 4:
            const q4Count = set.data.questions ? set.data.questions.length : 0;
            return `<p class="mb-1"><strong>Topic:</strong> ${set.data.topic || '(chưa có)'}</p>
                    <p class="mb-1"><strong>Số câu hỏi:</strong> ${q4Count}</p>
                    <p class="mb-0 text-muted"><small>${set.title || 'Chưa có tiêu đề'}</small></p>`;
        case 5:
            const optCount = set.data.options ? (set.data.options.length > 0 ? set.data.options.length - 1 : 0) : 0;
            const pCount = set.data.paragraphs ? set.data.paragraphs.length : 0;
            return `<p class="mb-1"><strong>Topic:</strong> ${set.data.topic || '(chưa có)'}</p>
                    <p class="mb-1"><strong>Số options:</strong> ${optCount}</p>
                    <p class="mb-1"><strong>Số paragraphs:</strong> ${pCount}</p>
                    <p class="mb-0 text-muted"><small>${set.title || 'Chưa có tiêu đề'}</small></p>`;
        default:
            return '';
    }
}

// ============================================
// Edit Question Set
// ============================================

function editQuestionSet(part, index) {
    const set = questionSets[part][index];
    
    // Hide sets container
    document.getElementById(`part${part}-sets-container`).style.display = 'none';
    
    // Show edit form
    const editForm = document.getElementById(`part${part}-edit-form`);
    if (editForm) {
        editForm.style.display = 'block';
        loadSetIntoForm(part, index);
    }
}

function loadSetIntoForm(part, index) {
    try {
        if (!questionSets[part] || !questionSets[part][index]) {
            console.error('Set not found:', part, index);
            return;
        }
        
        const set = questionSets[part][index];
        
        // Set title
        const titleInput = document.getElementById(`part${part}-title`);
        if (titleInput) {
            titleInput.value = set.title || '';
        } else {
            console.warn('Title input not found:', `part${part}-title`);
        }
        
        // Load data based on part
        switch(part) {
            case 1:
                if (typeof loadPart1SetData === 'function') {
                    loadPart1SetData(set.data);
                }
                break;
            case 2:
                if (typeof loadPart2SetData === 'function') {
                    loadPart2SetData(set.data);
                }
                break;
            case 4:
                if (typeof loadPart4SetData === 'function') {
                    loadPart4SetData(set.data);
                }
                break;
            case 5:
                if (typeof loadPart5SetData === 'function') {
                    loadPart5SetData(set.data);
                }
                break;
        }
        
        // Store current editing index
        window.currentEditingSet = { part, index };
    } catch (error) {
        console.error('Error in loadSetIntoForm:', error);
    }
}

function saveCurrentSet() {
    const currentPart = window.currentPart || 1;
    
    if (!window.currentEditingSet) {
        // Create new set
        const newSet = {
            id: questionSets[currentPart].length + 1,
            title: document.getElementById(`part${currentPart}-title`)?.value.trim() || '',
            data: collectCurrentPartData()
        };
        questionSets[currentPart].push(newSet);
    } else {
        // Update existing set
        const { part, index } = window.currentEditingSet;
        const titleInput = document.getElementById(`part${part}-title`);
        if (titleInput) {
            questionSets[part][index].title = titleInput.value.trim();
        }
        questionSets[part][index].data = collectCurrentPartData();
        window.currentEditingSet = null;
    }
    
    // Hide edit form and show sets container
    const editForm = document.getElementById(`part${currentPart}-edit-form`);
    if (editForm) {
        editForm.style.display = 'none';
    }
    const setsContainer = document.getElementById(`part${currentPart}-sets-container`);
    if (setsContainer) {
        setsContainer.style.display = 'block';
    }
    
    renderQuestionSets(currentPart);
    clearFormSilently(currentPart);
}

// ============================================
// Data Collection (Updated for sets)
// ============================================

function collectCurrentPartData() {
    const currentPart = window.currentPart || 1;
    switch(currentPart) {
        case 1:
            return collectPart1Data();
        case 2:
            return collectPart2Data();
        case 4:
            return collectPart4Data();
        case 5:
            return collectPart5Data();
        default:
            return {};
    }
}

// Keep existing collect functions but adapt for sets
function collectPart1Data() {
    const questions = [];
    document.querySelectorAll('#part1-questions-container .question-item').forEach((item) => {
        const questionStart = item.querySelector('.part1-questionStart')?.value.trim() || '';
        const questionEnd = item.querySelector('.part1-questionEnd')?.value.trim() || '';
        const correctAnswer = item.querySelector('.part1-correctAnswer')?.value.trim() || '';
        const answerOptionsText = item.querySelector('.part1-answerOptions')?.value.trim() || '';
        const answerOptions = answerOptionsText.split('\n').filter(opt => opt.trim() !== '');
        
        if (questionStart || questionEnd || correctAnswer) {
            questions.push({
                questionStart,
                answerOptions,
                questionEnd,
                correctAnswer
            });
        }
    });
    
    return { questions };
}

function collectPart2Data() {
    const sentences = [];
    document.querySelectorAll('#part2-sentences-container .question-item').forEach(item => {
        const sentence = item.querySelector('.part2-sentence')?.value.trim() || '';
        if (sentence) {
            sentences.push(sentence);
        }
    });
    
    return {
        topic: document.getElementById('part2-topic').value.trim(),
        sentences: sentences
    };
}

function collectPart4Data() {
    const questions = [];
    document.querySelectorAll('#part4-questions-container .question-item').forEach(item => {
        const question = item.querySelector('.part4-question')?.value.trim() || '';
        const correctAnswer = item.querySelector('.part4-correctAnswer')?.value.trim() || '';
        if (question || correctAnswer) {
            questions.push({
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
        topic: document.getElementById('part4-topic').value.trim(),
        texts: texts,
        questions: questions
    };
}

function collectPart5Data() {
    const options = [];
    document.querySelectorAll('#part5-options-container .question-item').forEach(item => {
        const option = item.querySelector('.part5-option')?.value.trim() || '';
        if (option) {
            options.push(option);
        }
    });
    
    const paragraphs = [];
    document.querySelectorAll('#part5-paragraphs-container .question-item').forEach(item => {
        const paragraph = item.querySelector('.part5-paragraph')?.value.trim() || '';
        if (paragraph) {
            paragraphs.push(paragraph);
        }
    });
    
    return {
        topic: document.getElementById('part5-topic').value.trim(),
        options: ['', ...options], // First option is always empty
        paragraphs: paragraphs,
        tips: {
            keyword: document.getElementById('part5-keyword').value.trim(),
            meo: document.getElementById('part5-meo').value.trim()
        }
    };
}

// ============================================
// Export to JS Format
// ============================================

function exportToJS() {
    let jsCode = '';
    
    switch(currentPart) {
        case 1:
            jsCode = generatePart1JS();
            break;
        case 2:
            jsCode = generatePart2JS();
            break;
        case 4:
            jsCode = generatePart4JS();
            break;
        case 5:
            jsCode = generatePart5JS();
            break;
    }
    
    // Copy to clipboard
    navigator.clipboard.writeText(jsCode).then(() => {
        alert('Đã copy code JS vào clipboard! Bạn có thể paste vào file tương ứng.');
    });
    
    // Also show in preview
    document.getElementById('js-preview').textContent = jsCode;
    document.getElementById('preview-section').style.display = 'block';
}

// Upload lesson to GitHub
async function uploadLessonToGitHub() {
    const currentPart = window.currentPart || 1;
    
    // Check if there are any question sets
    if (!questionSets[currentPart] || questionSets[currentPart].length === 0) {
        alert('Chưa có bộ đề nào để upload. Vui lòng thêm bộ đề trước.');
        return;
    }
    
    // Generate JS code
    let jsCode = '';
    switch(currentPart) {
        case 1:
            jsCode = generatePart1JS();
            break;
        case 2:
            jsCode = generatePart2JS();
            break;
        case 4:
            jsCode = generatePart4JS();
            break;
        case 5:
            jsCode = generatePart5JS();
            break;
    }
    
    if (!jsCode || jsCode.trim() === '' || jsCode.includes('Chưa có bộ đề nào')) {
        alert('Không có dữ liệu để upload. Vui lòng thêm bộ đề trước.');
        return;
    }
    
    // Determine file path based on part and whether editing existing lesson
    let filePath;
    const editingLessonId = window.editingLessonId;
    
    console.log('Upload - editingLessonId:', editingLessonId);
    console.log('Upload - editingLessonFilePath:', window.editingLessonFilePath);
    
    if (editingLessonId && window.editingLessonFilePath) {
        // Use existing file path if editing
        filePath = window.editingLessonFilePath;
        console.log('Using existing file path for editing:', filePath);
    } else {
        // Create new file with lesson ID - ALWAYS create unique path
        const basePaths = {
            1: 'js/reading_question/reading_question1',
            2: 'js/reading_question/reading_question2',
            4: 'js/reading_question/reading_question4',
            5: 'js/reading_question/reading_question5'
        };
        
        const basePath = basePaths[currentPart];
        if (!basePath) {
            alert('Part không hợp lệ.');
            return;
        }
        
        // Generate unique lesson ID (timestamp-based)
        const lessonId = Date.now();
        filePath = `${basePath}_lesson_${lessonId}.js`;
        console.log('Generated new unique file path:', filePath);
    }
    
    // Get title for commit message (use first set's title or default)
    const firstSet = questionSets[currentPart][0];
    const lessonTitle = firstSet && firstSet.title ? firstSet.title : `Part ${currentPart} Lesson`;
    const numSets = questionSets[currentPart].length;
    const commitMessage = editingLessonId 
        ? `Update lesson: ${lessonTitle} (${numSets} sets)`
        : `Add new lesson: ${lessonTitle} (${numSets} sets)`;
    
    // Show loading state
    const uploadButton = document.getElementById('upload-github-btn');
    const originalText = uploadButton ? uploadButton.innerHTML : '';
    if (uploadButton) {
        uploadButton.disabled = true;
        uploadButton.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Đang upload...';
    }
    
    try {
        // Log the data being sent
        const uploadData = {
            filePath: filePath,
            content: jsCode.substring(0, 100) + '...', // Log first 100 chars only
            message: commitMessage,
            append: false,
            lessonId: editingLessonId || null,
            title: lessonTitle,
            topic: firstSet && firstSet.data && firstSet.data.topic ? firstSet.data.topic : ''
        };
        console.log('Uploading with data:', uploadData);
        console.log('Full filePath:', filePath);
        
        // Send POST request to API
        const response = await fetch('/api/upload-lesson', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filePath: filePath,
                content: jsCode,
                message: commitMessage,
                append: false,
                lessonId: editingLessonId || null,
                title: lessonTitle,
                topic: firstSet && firstSet.data && firstSet.data.topic ? firstSet.data.topic : ''
            })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Upload failed');
        }
        
        // Success
        alert(`Upload thành công!\n\nCommit: ${result.commitUrl}\nFile: ${result.fileUrl}`);
        
        // Clear editing state
        if (editingLessonId) {
            window.editingLessonId = null;
            window.editingLessonFilePath = null;
            const banner = document.getElementById('edit-mode-banner');
            if (banner) banner.style.display = 'none';
        }
        
        // Optionally open commit URL in new tab
        if (result.commitUrl) {
            if (confirm('Bạn có muốn mở commit trên GitHub không?')) {
                window.open(result.commitUrl, '_blank');
            }
        }
        
        // Optionally redirect to lessons management
        if (confirm('Bạn có muốn chuyển đến trang quản lý bài học không?')) {
            window.location.href = 'admin_lessons.html';
        }
        
    } catch (error) {
        console.error('Upload error:', error);
        alert('Lỗi khi upload: ' + error.message);
    } finally {
        // Restore button state
        if (uploadButton) {
            uploadButton.disabled = false;
            uploadButton.innerHTML = originalText;
        }
    }
}

// Make function globally accessible - Override any existing function
window.uploadLessonToGitHub = uploadLessonToGitHub;
console.log('uploadLessonToGitHub function from admin_upload_v2.js has been registered');

function generatePart1JS() {
    if (questionSets[1].length === 0) {
        return '// Chưa có bộ đề nào cho Part 1';
    }
    
    let code = '// ===============================================================================================================\n';
    code += '// ////////////// DANH SÁCH CÂU HỎI PART 1 ///////////////\n';
    code += '// ===============================================================================================================\n\n';
    
    questionSets[1].forEach((set, index) => {
        const varName = `questions1_${index + 1}`;
        code += `// ${set.title || `Bộ đề ${index + 1}`}\n`;
        code += `const ${varName} = [\n`;
        
        if (set.data.questions && set.data.questions.length > 0) {
            set.data.questions.forEach(q => {
                const options = Array.isArray(q.answerOptions) ? q.answerOptions : [];
                code += `    { questionStart: "${escapeJS(q.questionStart || '')}", answerOptions: [${options.map(opt => `"${escapeJS(opt)}"`).join(', ')}], questionEnd: "${escapeJS(q.questionEnd || '')}", correctAnswer: "${escapeJS(q.correctAnswer || '')}" },\n`;
            });
        }
        
        code += `];\n\n`;
    });
    
    // Generate questionsArrays
    code += `const questionsArrays = [\n`;
    questionSets[1].forEach((set, index) => {
        code += `    questions1_${index + 1},\n`;
    });
    code += `];\n\n`;
    
    // Add DOMContentLoaded and all necessary code
    code += `document.addEventListener('DOMContentLoaded', function() {\n\n`;
    code += `// ===============================================================================================================\n`;
    code += `// ////////////// ĐẾM NGƯỢC THỜI GIAN --- COUNT DOWN ///////////////\n`;
    code += `// ===============================================================================================================\n`;
    code += `// Countdown Timer\n`;
    code += `let timeLeft = 35 * 60; // 35 minutes in seconds\n`;
    code += `const countdownElement = document.getElementById('countdownTimer');\n\n`;
    code += `function updateCountdown() {\n`;
    code += `    const minutes = Math.floor(timeLeft / 60);\n`;
    code += `    const seconds = timeLeft % 60;\n`;
    code += `    countdownElement.textContent = \`\${minutes}:\${seconds < 10 ? '0' : ''}\${seconds}\`;\n`;
    code += `    if (timeLeft > 0) {\n`;
    code += `        timeLeft--;\n`;
    code += `        setTimeout(updateCountdown, 1000);\n`;
    code += `    }\n`;
    code += `}\n\n`;
    code += `updateCountdown();\n\n`;
    code += `    let currentArrayIndex = 0;\n`;
    code += `    const userAnswers = [];\n\n`;
    code += `    // Hàm để render câu hỏi từ mảng\n`;
    code += `    function renderQuestions() {\n`;
    code += `        const container = document.getElementById('questions-container');\n`;
    code += `        container.innerHTML = ''; // Xóa câu hỏi cũ\n\n`;
    code += `        const questions = questionsArrays[currentArrayIndex];\n`;
    code += `        questions.forEach((question, index) => {\n`;
    code += `            const questionDiv = document.createElement('div');\n`;
    code += `            questionDiv.classList.add('mb-3', 'd-flex', 'align-items-center', 'border', 'p-3', 'rounded', 'shadow-sm', 'bg-light');\n\n`;
    code += `            const label = document.createElement('label');\n`;
    code += `            label.classList.add('form-label', 'me-3');\n`;
    code += `            label.setAttribute('for', \`gap\${index}\`);\n`;
    code += `            label.innerText = \`\${question.questionStart}\`;\n\n`;
    code += `            const select = document.createElement('select');\n`;
    code += `            select.classList.add('form-select', 'w-auto');\n`;
    code += `            select.id = \`gap\${index}\`;\n`;
    code += `            select.name = \`gap\${index}\`;\n`;
    code += `            select.addEventListener('change', function() {\n`;
    code += `                userAnswers[index] = select.value;\n`;
    code += `            });\n\n`;
    code += `            const emptyOption = document.createElement('option');\n`;
    code += `            emptyOption.value = '';\n`;
    code += `            emptyOption.innerText = '';\n`;
    code += `            select.appendChild(emptyOption);\n\n`;
    code += `            question.answerOptions.forEach(option => {\n`;
    code += `                const optionElement = document.createElement('option');\n`;
    code += `                optionElement.value = option;\n`;
    code += `                optionElement.innerText = option;\n`;
    code += `                select.appendChild(optionElement);\n`;
    code += `            });\n\n`;
    code += `            const span = document.createElement('span');\n`;
    code += `            span.classList.add('ms-3');\n`;
    code += `            span.innerText = question.questionEnd;\n\n`;
    code += `            questionDiv.appendChild(label);\n`;
    code += `            questionDiv.appendChild(select);\n`;
    code += `            questionDiv.appendChild(span);\n\n`;
    code += `            container.appendChild(questionDiv);\n`;
    code += `        });\n`;
    code += `        const questions1_header_length = questionsArrays.length;\n\n`;
    code += `        document.getElementById('question1_header').innerHTML = \`Reading Question 1 (\${currentArrayIndex + 1}/\${questions1_header_length})\`;\n`;
    code += `    }\n\n`;
    code += `    // Render câu hỏi ban đầu\n`;
    code += `    renderQuestions();\n\n`;
    code += `    // Hàm chuyển đến câu hỏi tiếp theo\n`;
    code += `    document.getElementById('nextButton').addEventListener('click', function() {\n`;
    code += `        if (currentArrayIndex < questionsArrays.length - 1) {\n`;
    code += `            currentArrayIndex++;\n`;
    code += `            renderQuestions();\n`;
    code += `        } else {\n`;
    code += `            document.getElementById('checkResultButton').style.display = 'block';\n`;
    code += `            document.getElementById('nextButton').textContent = 'The end';\n`;
    code += `        }\n`;
    code += `    });\n\n`;
    code += `    // Hàm quay lại câu hỏi trước đó\n`;
    code += `    document.getElementById('backButton').addEventListener('click', function() {\n`;
    code += `        if (currentArrayIndex > 0) {\n`;
    code += `            currentArrayIndex--;\n`;
    code += `            renderQuestions();\n`;
    code += `            document.getElementById('nextButton').textContent = 'Next';\n`;
    code += `        }\n`;
    code += `    });\n\n`;
    code += `    // Hiển thị kết quả khi nhấn nút Check Result\n`;
    code += `    document.getElementById('checkResultButton').addEventListener('click', function() {\n`;
    code += `        const comparisonTableBody = document.getElementById('comparisonTableBody');\n`;
    code += `        comparisonTableBody.innerHTML = ''; // Xóa kết quả cũ\n\n`;
    code += `        const questions = questionsArrays[currentArrayIndex];\n\n`;
    code += `        questions.forEach((question, index) => {\n`;
    code += `            const userAnswer = userAnswers[index] || "(không chọn)";\n`;
    code += `            const correctAnswer = question.correctAnswer;\n\n`;
    code += `            const tr = document.createElement('tr');\n\n`;
    code += `            const userAnswerTd = document.createElement('td');\n`;
    code += `            userAnswerTd.innerHTML = \`\${userAnswer}\`;\n`;
    code += `            if (userAnswer === correctAnswer) {\n`;
    code += `                userAnswerTd.classList.add('text-success');\n`;
    code += `            } else {\n`;
    code += `                userAnswerTd.classList.add('text-danger');\n`;
    code += `            }\n`;
    code += `            tr.appendChild(userAnswerTd);\n\n`;
    code += `            const correctAnswerTd = document.createElement('td');\n`;
    code += `            correctAnswerTd.innerHTML = \`\${correctAnswer}\`;\n`;
    code += `            correctAnswerTd.classList.add('text-success');\n`;
    code += `            tr.appendChild(correctAnswerTd);\n\n`;
    code += `            comparisonTableBody.appendChild(tr);\n`;
    code += `        });\n\n`;
    code += `        document.getElementById('totalScore').innerText = 'Your Score: ' + calculateScore(userAnswers, questionsArrays);\n`;
    code += `        document.getElementById('scoreClassification').innerText = 'Classification: ' + getScoreClassification(calculateScore(userAnswers, questionsArrays));\n\n`;
    code += `        const myModal = new bootstrap.Modal(document.getElementById('resultModal'));\n`;
    code += `        myModal.show();\n`;
    code += `    });\n\n`;
    code += `    // Tính điểm\n`;
    code += `    function calculateScore(userAnswers, questionsArrays) {\n`;
    code += `        let score = 0;\n`;
    code += `        const questions = questionsArrays[currentArrayIndex];\n`;
    code += `        questions.forEach((question, index) => {\n`;
    code += `            if (userAnswers[index] === question.correctAnswer) {\n`;
    code += `                score += 2;\n`;
    code += `            }\n`;
    code += `        });\n`;
    code += `        return score;\n`;
    code += `    }\n\n`;
    code += `    // Phân loại điểm\n`;
    code += `    function getScoreClassification(score) {\n`;
    code += `        if (score >= 10) {\n`;
    code += `            return 'Excellent';\n`;
    code += `        } else if (score >= 5) {\n`;
    code += `            return 'Good';\n`;
    code += `        } else {\n`;
    code += `            return 'Cố gắng thêm nhé!';\n`;
    code += `        }\n`;
    code += `    }\n`;
    code += `});\n`;
    
    return code;
}

function generatePart2JS() {
    if (questionSets[2].length === 0) {
        return '// Chưa có bộ đề nào cho Part 2 & 3';
    }
    
    let code = '// ===============================================================================================================\n';
    code += '// ////////////// DANH SÁCH CÂU HỎI PART 2 & 3 ///////////////\n';
    code += '// ===============================================================================================================\n\n';
    
    questionSets[2].forEach((set, index) => {
        const varName = `question2Content_${index + 1}`;
        code += `// ${set.title || `Bộ đề ${index + 1}`} - Topic: ${set.data.topic || ''}\n`;
        code += `const ${varName} = [\n`;
        
        if (set.data.sentences && set.data.sentences.length > 0) {
            set.data.sentences.forEach(sentence => {
                code += `    '${escapeJS(sentence)}',\n`;
            });
        }
        
        code += `];\n\n`;
    });
    
    // Generate questionSets array
    code += `const questionSets = [\n`;
    questionSets[2].forEach((set, index) => {
        code += `    question2Content_${index + 1},\n`;
    });
    code += `];\n\n`;
    
    // Generate questheader1 object
    code += `const questheader1 = {\n`;
    questionSets[2].forEach((set, index) => {
        const varName = `question2Content_${index + 1}`;
        code += `    ${varName}: "${escapeJS(set.data.topic || set.title || '')}",\n`;
    });
    code += `};\n\n`;
    
    code += `function getQuestHeaders(obj) {\n`;
    code += `    return Object.values(obj);\n`;
    code += `}\n\n`;
    code += `const questheader = getQuestHeaders(questheader1);\n`;
    
    return code;
}

function generatePart4JS() {
    if (questionSets[4].length === 0) {
        return '// Chưa có bộ đề nào cho Part 4';
    }
    
    let code = '// ===============================================================================================================\n';
    code += '// ////////////// DANH SÁCH CÂU HỎI PART 4 ///////////////\n';
    code += '// ===============================================================================================================\n\n';
    
    questionSets[4].forEach((set, index) => {
        const textVarName = `question4Text_${index + 1}`;
        const contentVarName = `question4Content_${index + 1}`;
        const answersVarName = `correctAnswersQuestion4_${index + 1}`;
        
        // Generate texts
        code += `const ${textVarName} = [\n`;
        if (set.data.texts && set.data.texts.length > 0) {
            set.data.texts.forEach(text => {
                code += `    "${escapeJS(text || '')}",\n`;
            });
        }
        code += `];\n\n`;
        
        // Generate content
        code += `const ${contentVarName} = [\n`;
        if (set.data.questions && set.data.questions.length > 0) {
            set.data.questions.forEach((q, qIndex) => {
                code += `    { question: "${escapeJS(q.question || '')}", id: "question4_q${qIndex + 1}", options: ["", "A", "B", "C", "D"], answer: "${q.correctAnswer || ''}" },\n`;
            });
        }
        code += `];\n\n`;
        
        // Generate correct answers
        if (set.data.questions && set.data.questions.length > 0) {
            code += `const ${answersVarName} = [${set.data.questions.map(q => `'${q.correctAnswer || ''}'`).join(', ')}];\n\n`;
        } else {
            code += `const ${answersVarName} = [];\n\n`;
        }
    });
    
    // Generate arrays
    code += `const question4Text = [\n`;
    questionSets[4].forEach((set, index) => {
        code += `  question4Text_${index + 1},\n`;
    });
    code += `];\n\n`;
    
    code += `const question4Content = [\n`;
    questionSets[4].forEach((set, index) => {
        code += `  question4Content_${index + 1},\n`;
    });
    code += `];\n\n`;
    
    code += `const correctAnswersQuestion4 = [\n`;
    questionSets[4].forEach((set, index) => {
        code += `  correctAnswersQuestion4_${index + 1},\n`;
    });
    code += `];\n\n`;
    
    // Generate topics
    code += `const question4Topic1 = {\n`;
    questionSets[4].forEach((set, index) => {
        code += `  topic${index + 1}: "${escapeJS(set.data.topic || set.title || '')}",\n`;
    });
    code += `};\n\n`;
    
    code += `function getQuestHeaders(obj) {\n`;
    code += `    return Object.values(obj);\n`;
    code += `}\n\n`;
    code += `const question4Topic = getQuestHeaders(question4Topic1);\n`;
    
    return code;
}

function generatePart5JS() {
    if (questionSets[5].length === 0) {
        return '// Chưa có bộ đề nào cho Part 5';
    }
    
    let code = '// ===============================================================================================================\n';
    code += '// ////////////// DANH SÁCH CÂU HỎI PART 5 ///////////////\n';
    code += '// ===============================================================================================================\n\n';
    
    questionSets[5].forEach((set, index) => {
        const optionsVarName = `options_${index + 1}`;
        const paragraphVarName = `paragraph_question5_${index + 1}`;
        const keywordVarName = `question5_keyword_${index + 1}`;
        const meoVarName = `question5_meo_${index + 1}`;
        
        // Generate options
        code += `const ${optionsVarName} = [\n`;
        code += `    '',\n`; // First option is always empty
        if (set.data.options && set.data.options.length > 1) {
            set.data.options.slice(1).forEach(opt => {
                if (opt) {
                    code += `    "${escapeJS(opt)}",\n`;
                }
            });
        }
        code += `];\n\n`;
        
        // Generate paragraphs
        code += `const ${paragraphVarName} = [\n`;
        if (set.data.paragraphs && set.data.paragraphs.length > 0) {
            set.data.paragraphs.forEach(para => {
                code += `    '${escapeJS(para || '')}',\n`;
            });
        }
        code += `];\n\n`;
        
        // Generate tips
        const keyword = set.data.tips ? set.data.tips.keyword : '';
        const meo = set.data.tips ? set.data.tips.meo : '';
        code += `const ${keywordVarName} = '${escapeJS(keyword)}';\n`;
        code += `const ${meoVarName} = "${escapeJS(meo)}";\n\n`;
    });
    
    // Generate arrays
    code += `const options = [\n`;
    questionSets[5].forEach((set, index) => {
        code += `    options_${index + 1},\n`;
    });
    code += `];\n\n`;
    
    code += `const paragraph_question5 = Array.from(\n`;
    code += `  { length: options.length },\n`;
    code += `  (_, i) => eval(\`paragraph_question5_\${i + 1}\`)\n`;
    code += `);\n\n`;
    
    code += `const meohoc = Array.from({ length: options.length }, (_, i) => [\n`;
    code += `  eval(\`question5_keyword_\${i + 1}\`),\n`;
    code += `  eval(\`question5_meo_\${i + 1}\`)\n`;
    code += `]);\n\n`;
    
    // Generate topics
    code += `const topic_name = {\n`;
    questionSets[5].forEach((set, index) => {
        code += `    topic_${index + 1}: "${escapeJS(set.data.topic || set.title || '')}",\n`;
    });
    code += `};\n\n`;
    
    code += `const dodai = options.length;\n`;
    
    return code;
}

function escapeJS(str) {
    return str.replace(/\\/g, '\\\\')
              .replace(/'/g, "\\'")
              .replace(/"/g, '\\"')
              .replace(/\n/g, '\\n')
              .replace(/\r/g, '\\r');
}

// ============================================
// Helper Functions
// ============================================

function clearFormSilently(part) {
    // Clear form without confirmation dialog
    // If part is not provided, use currentPart
    if (!part) {
        part = window.currentPart || 1;
    }
    switch (part) {
        case 1:
            const title1 = document.getElementById('part1-title');
            if (title1) title1.value = '';
            const container1 = document.getElementById('part1-questions-container');
            if (container1) container1.innerHTML = '';
            if (typeof part1Questions !== 'undefined') {
                part1Questions = [];
            }
            break;
        case 2:
            const title2 = document.getElementById('part2-title');
            const topic2 = document.getElementById('part2-topic');
            if (title2) title2.value = '';
            if (topic2) topic2.value = '';
            const container2 = document.getElementById('part2-sentences-container');
            if (container2) container2.innerHTML = '';
            if (typeof part2Sentences !== 'undefined') {
                part2Sentences = [];
            }
            break;
        case 4:
            const title4 = document.getElementById('part4-title');
            const topic4 = document.getElementById('part4-topic');
            const intro4 = document.getElementById('part4-text-intro');
            const a4 = document.getElementById('part4-text-a');
            const b4 = document.getElementById('part4-text-b');
            const c4 = document.getElementById('part4-text-c');
            const d4 = document.getElementById('part4-text-d');
            if (title4) title4.value = '';
            if (topic4) topic4.value = '';
            if (intro4) intro4.value = '';
            if (a4) a4.value = '';
            if (b4) b4.value = '';
            if (c4) c4.value = '';
            if (d4) d4.value = '';
            const container4 = document.getElementById('part4-questions-container');
            if (container4) container4.innerHTML = '';
            if (typeof part4Questions !== 'undefined') {
                part4Questions = [];
            }
            break;
        case 5:
            const title5 = document.getElementById('part5-title');
            const topic5 = document.getElementById('part5-topic');
            const keyword5 = document.getElementById('part5-keyword');
            const meo5 = document.getElementById('part5-meo');
            if (title5) title5.value = '';
            if (topic5) topic5.value = '';
            if (keyword5) keyword5.value = '';
            if (meo5) meo5.value = '';
            const optionsContainer5 = document.getElementById('part5-options-container');
            const paragraphsContainer5 = document.getElementById('part5-paragraphs-container');
            if (optionsContainer5) optionsContainer5.innerHTML = '';
            if (paragraphsContainer5) paragraphsContainer5.innerHTML = '';
            if (typeof part5Options !== 'undefined') {
                part5Options = [];
            }
            if (typeof part5Paragraphs !== 'undefined') {
                part5Paragraphs = [];
            }
            break;
    }
}

function cancelEdit(part) {
    document.getElementById(`part${part}-edit-form`).style.display = 'none';
    document.getElementById(`part${part}-sets-container`).style.display = 'block';
    window.currentEditingSet = null;
    clearFormSilently(part);
}

function loadPart1SetData(data) {
    part1Questions = [];
    const container = document.getElementById('part1-questions-container');
    if (container) {
        container.innerHTML = '';
    }
    
    (data.questions || []).forEach((q, index) => {
        addPart1Question();
        const questionDiv = document.getElementById(`part1-q${index}`);
        if (questionDiv) {
            questionDiv.querySelector('.part1-questionStart').value = q.questionStart || '';
            questionDiv.querySelector('.part1-questionEnd').value = q.questionEnd || '';
            questionDiv.querySelector('.part1-correctAnswer').value = q.correctAnswer || '';
            questionDiv.querySelector('.part1-answerOptions').value = Array.isArray(q.answerOptions) ? q.answerOptions.join('\n') : '';
        }
    });
}

function loadPart2SetData(data) {
    const topicInput = document.getElementById('part2-topic');
    if (topicInput) {
        topicInput.value = data.topic || '';
    }
    
    part2Sentences = [];
    const container = document.getElementById('part2-sentences-container');
    if (container) {
        container.innerHTML = '';
    }
    
    (data.sentences || []).forEach((s, index) => {
        addPart2Sentence();
        const sentenceDiv = document.getElementById(`part2-s${index}`);
        if (sentenceDiv) {
            sentenceDiv.querySelector('.part2-sentence').value = s || '';
        }
    });
}

function loadPart4SetData(data) {
    const topicInput = document.getElementById('part4-topic');
    if (topicInput) {
        topicInput.value = data.topic || '';
    }
    
    if (data.texts && data.texts.length >= 5) {
        const introInput = document.getElementById('part4-text-intro');
        const aInput = document.getElementById('part4-text-a');
        const bInput = document.getElementById('part4-text-b');
        const cInput = document.getElementById('part4-text-c');
        const dInput = document.getElementById('part4-text-d');
        
        if (introInput) introInput.value = data.texts[0] || '';
        if (aInput) aInput.value = data.texts[1] || '';
        if (bInput) bInput.value = data.texts[2] || '';
        if (cInput) cInput.value = data.texts[3] || '';
        if (dInput) dInput.value = data.texts[4] || '';
    }
    
    part4Questions = [];
    const container = document.getElementById('part4-questions-container');
    if (container) {
        container.innerHTML = '';
    }
    
    (data.questions || []).forEach((q, index) => {
        addPart4Question();
        const questionDiv = document.getElementById(`part4-q${index}`);
        if (questionDiv) {
            questionDiv.querySelector('.part4-question').value = q.question || '';
            questionDiv.querySelector('.part4-correctAnswer').value = q.correctAnswer || '';
        }
    });
}

function loadPart5SetData(data) {
    const topicInput = document.getElementById('part5-topic');
    if (topicInput) {
        topicInput.value = data.topic || '';
    }
    
    // Remove first empty option
    const options = data.options || [];
    part5Options = [];
    const optionsContainer = document.getElementById('part5-options-container');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
    }
    
    options.slice(1).forEach((opt, index) => {
        addPart5Option();
        const optionDiv = document.getElementById(`part5-opt${index}`);
        if (optionDiv) {
            optionDiv.querySelector('.part5-option').value = opt || '';
        }
    });
    
    part5Paragraphs = [];
    const paragraphsContainer = document.getElementById('part5-paragraphs-container');
    if (paragraphsContainer) {
        paragraphsContainer.innerHTML = '';
    }
    
    (data.paragraphs || []).forEach((p, index) => {
        addPart5Paragraph();
        const paragraphDiv = document.getElementById(`part5-p${index}`);
        if (paragraphDiv) {
            paragraphDiv.querySelector('.part5-paragraph').value = p || '';
        }
    });
    
    if (data.tips) {
        const keywordInput = document.getElementById('part5-keyword');
        const meoInput = document.getElementById('part5-meo');
        if (keywordInput) keywordInput.value = data.tips.keyword || '';
        if (meoInput) meoInput.value = data.tips.meo || '';
    }
}

function copyJS() {
    const jsCode = document.getElementById('js-preview').textContent;
    navigator.clipboard.writeText(jsCode).then(() => {
        alert('Đã copy JS code vào clipboard!');
    });
}

// ============================================
// Update preview functions
// ============================================

function previewJSON() {
    const currentPart = window.currentPart || 1;
    const data = {
        part: currentPart,
        sets: questionSets[currentPart]
    };
    const json = JSON.stringify(data, null, 2);
    const previewSection = document.getElementById('preview-section');
    const jsonPreview = document.getElementById('json-preview');
    
    jsonPreview.textContent = json;
    document.getElementById('js-preview').style.display = 'none';
    previewSection.style.display = 'block';
    previewSection.scrollIntoView({ behavior: 'smooth' });
}

function exportJSON() {
    const currentPart = window.currentPart || 1;
    const data = {
        part: currentPart,
        sets: questionSets[currentPart]
    };
    const json = JSON.stringify(data, null, 2);
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
    const currentPart = window.currentPart || 1;
    const data = {
        part: currentPart,
        sets: questionSets[currentPart]
    };
    const json = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(json).then(() => {
        alert('Đã copy JSON vào clipboard!');
    });
}

// ============================================
// Import JSON
// ============================================

function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.part && data.sets) {
                questionSets[data.part] = data.sets;
                switchPart(data.part);
                renderQuestionSets(data.part);
                alert('Đã import JSON thành công!');
            } else {
                alert('File JSON không đúng format. Vui lòng kiểm tra lại.');
            }
        } catch (error) {
            alert('Lỗi: Không thể đọc file JSON. Vui lòng kiểm tra lại format.');
            console.error(error);
        }
    };
    reader.readAsText(file);
}

// ============================================
// Preview Lesson Interface
// ============================================

// Global variables for preview navigation
window.previewCurrentSetIndex = 0;
window.previewSets = [];
window.previewPart = 1;
window.previewUserAnswers = {}; // Store user answers for each part and set

function previewLessonInterface() {
    const currentPart = window.currentPart || 1;
    const sets = questionSets[currentPart] || [];
    
    if (sets.length === 0) {
        alert('Chưa có bộ đề nào. Vui lòng thêm bộ đề trước khi preview.');
        return;
    }
    
    // Initialize preview state
    window.previewCurrentSetIndex = 0;
    window.previewSets = sets;
    window.previewPart = currentPart;
    window.previewUserAnswers = {}; // Reset user answers
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('lessonPreviewModal'));
    document.getElementById('preview-part-number').textContent = currentPart;
    
    // Render preview content
    renderCurrentPreview();
    
    // Load necessary CSS and scripts
    loadPreviewStyles();
    
    modal.show();
}

function renderCurrentPreview() {
    const previewContent = document.getElementById('lesson-preview-content');
    previewContent.innerHTML = '';
    
    const currentIndex = window.previewCurrentSetIndex || 0;
    const sets = window.previewSets || [];
    const currentPart = window.previewPart || 1;
    
    if (sets.length === 0) {
        previewContent.innerHTML = '<div class="alert alert-warning">Không có bộ đề để hiển thị.</div>';
        return;
    }
    
    // Render based on part
    switch(currentPart) {
        case 1:
            renderPart1Preview(previewContent, sets, currentIndex);
            break;
        case 2:
            renderPart2Preview(previewContent, sets, currentIndex);
            break;
        case 4:
            renderPart4Preview(previewContent, sets, currentIndex);
            break;
        case 5:
            renderPart5Preview(previewContent, sets, currentIndex);
            break;
    }
}

// Make functions globally accessible for onclick handlers
window.nextPreviewSet = function() {
    const currentIndex = window.previewCurrentSetIndex || 0;
    const sets = window.previewSets || [];
    
    if (currentIndex < sets.length - 1) {
        window.previewCurrentSetIndex = currentIndex + 1;
        renderCurrentPreview();
        // Scroll to top of preview content
        const previewContent = document.getElementById('lesson-preview-content');
        if (previewContent) {
            previewContent.scrollTop = 0;
        }
    }
};

window.previousPreviewSet = function() {
    const currentIndex = window.previewCurrentSetIndex || 0;
    
    if (currentIndex > 0) {
        window.previewCurrentSetIndex = currentIndex - 1;
        renderCurrentPreview();
        // Scroll to top of preview content
        const previewContent = document.getElementById('lesson-preview-content');
        if (previewContent) {
            previewContent.scrollTop = 0;
        }
    }
};

function loadPreviewStyles() {
    // Styles should already be loaded in admin_upload.html
    // This function is kept for potential future use
    // The preview modal will use the existing CSS files loaded in the page
}

function renderPart1Preview(container, sets, currentIndex) {
    if (sets.length === 0) return;
    
    const currentSet = sets[currentIndex] || sets[0];
    const questions = currentSet.data.questions || [];
    const setNumber = currentIndex + 1;
    const totalSets = sets.length;
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === totalSets - 1;
    
    let html = `
        <!-- Header -->
        <div class="header d-flex justify-content-between align-items-center p-3" style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white;">
            <div class="d-flex align-items-center">
                <a href="#" class="me-3 text-decoration-none text-white fs-4">
                    <i class="bi bi-house-door-fill me-2"></i>
                    <span>Mini Hippo</span>
                </a>
            </div>
            <div class="d-flex align-items-center">
                <span class="me-2">Time remaining:</span>
                <span class="countdown" style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #1e293b; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 700;">35:00</span>
            </div>
            <div id="question_step" style="background: rgba(255, 255, 255, 0.15); padding: 0.5rem 1rem; border-radius: 0.5rem; color: white;">
                Reading Question 1
            </div>
        </div>
        
        <!-- Question Content -->
        <div class="container py-5" style="background: #f8fafc; min-height: 500px;">
            <h1 class="mb-4">Reading Question 1 (${setNumber}/${totalSets})</h1>
            <p class="mb-4">Choose the word that fits in the gap. The first one is done for you.</p>
            <p>Hey Lewis,<br><br></p>
            <div id="preview-questions-container">
    `;
    
    questions.forEach((question, index) => {
        const selectId = `preview-part1-q${index}`;
        html += `
            <div class="mb-3 d-flex align-items-center border p-3 rounded shadow-sm bg-light" style="background: white !important; border: 2px solid #e2e8f0 !important;">
                <label class="form-label me-3">${question.questionStart || ''}</label>
                <select class="form-select w-auto preview-answer-select" id="${selectId}" data-question-index="${index}" style="min-width: 150px;" onchange="updatePreviewAnswer(1, ${currentIndex}, ${index}, this.value)">
                    <option value="">-- Chọn --</option>
        `;
        
        (question.answerOptions || []).forEach(option => {
            html += `<option value="${option}">${option}</option>`;
        });
        
        html += `
                </select>
                <span class="ms-3">${question.questionEnd || ''}</span>
            </div>
        `;
    });
    
    html += `
            </div>
            <p><br>Love,<br>Helen<br><br><br></p>
        </div>
        
        <!-- Footer -->
        <div style="background: white; padding: 1rem; border-top: 2px solid #e2e8f0; position: sticky; bottom: 0;">
            <div class="d-flex justify-content-between">
                <button class="btn btn-secondary" onclick="previousPreviewSet()" ${isFirst ? 'disabled' : ''}>Back</button>
                <button class="btn btn-primary" onclick="checkPreviewResult(1, ${currentIndex})">Check result</button>
                <button class="btn btn-success" onclick="nextPreviewSet()" ${isLast ? 'disabled' : ''}>${isLast ? 'The end' : 'Next'}</button>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function renderPart2Preview(container, sets, currentIndex) {
    if (sets.length === 0) return;
    
    const currentSet = sets[currentIndex] || sets[0];
    const sentences = currentSet.data.sentences || [];
    const topic = currentSet.data.topic || '';
    const setNumber = currentIndex + 1;
    const totalSets = sets.length;
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === totalSets - 1;
    
    // Store correct order before shuffling
    const correctOrder = [...sentences];
    
    // Shuffle sentences (Fisher-Yates shuffle) - BUT keep first sentence in place
    const shuffledSentences = [...sentences];
    // Keep first sentence fixed at index 0, shuffle the rest (from index 1 onwards)
    if (shuffledSentences.length > 1) {
        // Shuffle from index 1 onwards (skip first sentence at index 0)
        // Start from last index and go down to index 1
        for (let i = shuffledSentences.length - 1; i >= 1; i--) {
            // Random index from 1 to i (inclusive) - this ensures we never swap with index 0
            const j = Math.floor(Math.random() * (i - 1 + 1)) + 1;
            [shuffledSentences[i], shuffledSentences[j]] = [shuffledSentences[j], shuffledSentences[i]];
        }
    }
    
    // Store correct answers for this set
    if (!window.previewPart2CorrectAnswers) {
        window.previewPart2CorrectAnswers = {};
    }
    window.previewPart2CorrectAnswers[`${currentIndex}`] = correctOrder;
    
    let html = `
        <!-- Header -->
        <div class="header d-flex justify-content-between align-items-center p-3" style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white;">
            <div class="d-flex align-items-center">
                <a href="#" class="me-3 text-decoration-none text-white fs-4">
                    <i class="bi bi-house-door-fill me-2"></i>
                    <span>Mini Hippo</span>
                </a>
            </div>
            <div class="d-flex align-items-center">
                <span class="countdown" style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #1e293b; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 700;">34:00</span>
            </div>
            <div style="background: rgba(255, 255, 255, 0.15); padding: 0.5rem 1rem; border-radius: 0.5rem; color: white;">
                Reading Q2&3 (${setNumber}/${totalSets})
            </div>
        </div>
        
        <!-- Question Content -->
        <div class="container py-5" style="background: #f8fafc; min-height: 500px;">
            <h1 class="mb-2">Reading Question 2 & 3</h1>
            <h4 class="mb-4" style="color: red;"><strong>Topic: ${topic}</strong></h4>
            <h6 class="mb-4">Put the sentences below in the right order. The first sentence is done for you.</h6>
            <div id="preview-cards-container-${currentIndex}" style="display: flex; flex-direction: column; gap: 0.75rem;">
    `;
    
    shuffledSentences.forEach((sentence, index) => {
        // First sentence (index 0) should not be draggable - it's fixed
        const isFirst = index === 0;
        const draggableAttr = isFirst ? 'false' : 'true';
        const cursorStyle = isFirst ? 'default' : 'move';
        const bgStyle = isFirst ? 'background: #f0f9ff;' : 'background: white;';
        
        html += `
            <div class="card mb-2 draggable-item ${isFirst ? 'fixed-first-item' : ''}" draggable="${draggableAttr}" style="${bgStyle} border: 2px solid ${isFirst ? '#3b82f6' : '#e2e8f0'}; cursor: ${cursorStyle};">
                <div class="card-body d-flex align-items-center">
                    ${isFirst ? '<span class="me-3 text-success fw-bold">✓</span>' : '<i class="bi bi-grip-vertical me-3" style="color: #64748b; font-size: 1.2rem;"></i>'}
                    <span>${sentence}</span>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background: white; padding: 1rem; border-top: 2px solid #e2e8f0; position: sticky; bottom: 0;">
            <div class="d-flex justify-content-between">
                <button class="btn btn-secondary" onclick="previousPreviewSet()" ${isFirst ? 'disabled' : ''}>Back</button>
                <button class="btn btn-primary" onclick="checkPreviewResult(2, ${currentIndex})">Check result</button>
                <button class="btn btn-success" onclick="nextPreviewSet()" ${isLast ? 'disabled' : ''}>${isLast ? 'The end' : 'Next'}</button>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Initialize SortableJS after HTML is rendered
    setTimeout(() => {
        const cardsContainer = document.getElementById(`preview-cards-container-${currentIndex}`);
        if (cardsContainer && typeof Sortable !== 'undefined') {
            // Destroy existing Sortable instance if any
            const existingSortable = cardsContainer.sortableInstance;
            if (existingSortable) {
                existingSortable.destroy();
            }
            
            // Create new Sortable instance
            // Filter out first item (index 0) from being draggable
            const sortable = new Sortable(cardsContainer, {
                animation: 150,
                handle: '.bi-grip-vertical',
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                dragClass: 'sortable-drag',
                filter: '.fixed-first-item' // Prevent dragging items with this class
            });
            
            // Ensure first item cannot be moved and is visually distinct
            const firstCard = cardsContainer.querySelector('.fixed-first-item');
            if (firstCard) {
                firstCard.style.pointerEvents = 'none';
                firstCard.style.userSelect = 'none';
            }
            
            // Store instance for later cleanup
            cardsContainer.sortableInstance = sortable;
        }
    }, 100);
}

function renderPart4Preview(container, sets, currentIndex) {
    if (sets.length === 0) return;
    
    const currentSet = sets[currentIndex] || sets[0];
    const texts = currentSet.data.texts || [];
    const questions = currentSet.data.questions || [];
    const topic = currentSet.data.topic || '';
    const setNumber = currentIndex + 1;
    const totalSets = sets.length;
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === totalSets - 1;
    
    let html = `
        <!-- Header -->
        <div class="header d-flex justify-content-between align-items-center p-3" style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white;">
            <div class="d-flex align-items-center">
                <a href="#" class="me-3 text-decoration-none text-white fs-4">
                    <i class="bi bi-house-door-fill me-2"></i>
                    <span>Mini Hippo</span>
                </a>
            </div>
            <div class="d-flex align-items-center">
                <span class="me-2">Time remaining:</span>
                <span class="countdown" style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #1e293b; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 700;">34:00</span>
            </div>
            <div style="background: rgba(255, 255, 255, 0.15); padding: 0.5rem 1rem; border-radius: 0.5rem; color: white;">
                Reading Question 4 (${setNumber}/${totalSets})
            </div>
        </div>
        
        <!-- Question Content -->
        <div class="container py-5" style="background: #f8fafc; min-height: 500px;">
            <h1 class="mb-4"><strong>Question 4</strong></h1>
            <h4 class="mb-4" style="color: red;"><strong>Topic: ${topic}</strong></h4>
            <div class="row">
                <div class="col-md-7">
                    <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                        ${texts[0] ? `<p>${texts[0]}</p>` : ''}
                        ${texts[1] ? `<p><strong>A:</strong> ${texts[1]}</p>` : ''}
                        ${texts[2] ? `<p><strong>B:</strong> ${texts[2]}</p>` : ''}
                        ${texts[3] ? `<p><strong>C:</strong> ${texts[3]}</p>` : ''}
                        ${texts[4] ? `<p><strong>D:</strong> ${texts[4]}</p>` : ''}
                    </div>
                </div>
                <div class="col-md-5">
                    <p class="fw-bold mb-3">Read the four opinions posted in the forum, and proceed to answer the questions.</p>
                    <form>
    `;
    
    questions.forEach((q, index) => {
        const selectId = `preview-part4-q${index}`;
        html += `
            <div class="mb-3">
                <label class="form-label fw-bold">${q.question || `Question ${index + 1}`}</label>
                <select class="form-select preview-answer-select" id="${selectId}" data-question-index="${index}" onchange="updatePreviewAnswer(4, ${currentIndex}, ${index}, this.value)">
                    <option value="">-- Chọn --</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                </select>
            </div>
        `;
    });
    
    html += `
                    </form>
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background: white; padding: 1rem; border-top: 2px solid #e2e8f0; position: sticky; bottom: 0;">
            <div class="d-flex justify-content-between">
                <button class="btn btn-secondary" onclick="previousPreviewSet()" ${isFirst ? 'disabled' : ''}>Back</button>
                <button class="btn btn-primary" onclick="checkPreviewResult(4, ${currentIndex})">Check result</button>
                <button class="btn btn-success" onclick="nextPreviewSet()" ${isLast ? 'disabled' : ''}>${isLast ? 'The end' : 'Next'}</button>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function renderPart5Preview(container, sets, currentIndex) {
    if (sets.length === 0) return;
    
    const currentSet = sets[currentIndex] || sets[0];
    const options = currentSet.data.options || [];
    const paragraphs = currentSet.data.paragraphs || [];
    const topic = currentSet.data.topic || '';
    const keyword = currentSet.data.tips ? currentSet.data.tips.keyword : '';
    const meo = currentSet.data.tips ? currentSet.data.tips.meo : '';
    const setNumber = currentIndex + 1;
    const totalSets = sets.length;
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === totalSets - 1;
    
    // Shuffle options (Fisher-Yates shuffle) - but keep first element (empty) in place
    const shuffleArray = (arr) => {
        const firstElement = arr[0]; // Keep first element (empty)
        const remainingElements = arr.slice(1);
        
        // Shuffle remaining elements
        for (let i = remainingElements.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [remainingElements[i], remainingElements[j]] = [remainingElements[j], remainingElements[i]];
        }
        
        return [firstElement, ...remainingElements];
    };
    
    const shuffledOptions = shuffleArray([...options]);
    
    // Store correct answers: options[1] for paragraph[0], options[2] for paragraph[1], etc.
    const correctAnswers = [];
    paragraphs.forEach((para, index) => {
        if (options[index + 1]) {
            correctAnswers.push(options[index + 1]);
        }
    });
    
    // Store correct answers for this set
    if (!window.previewPart5CorrectAnswers) {
        window.previewPart5CorrectAnswers = {};
    }
    window.previewPart5CorrectAnswers[`${currentIndex}`] = correctAnswers;
    
    let html = `
        <!-- Header -->
        <div class="header d-flex justify-content-between align-items-center p-3" style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white;">
            <div class="d-flex align-items-center">
                <a href="#" class="me-3 text-decoration-none text-white fs-4">
                    <i class="bi bi-house-door-fill me-2"></i>
                    <span>Mini Hippo</span>
                </a>
            </div>
            <div class="d-flex align-items-center">
                <span class="me-2">Time remaining:</span>
                <span class="countdown" style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #1e293b; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 700;">34:00</span>
            </div>
            <div style="background: rgba(255, 255, 255, 0.15); padding: 0.5rem 1rem; border-radius: 0.5rem; color: white;">
                Reading Question 5
            </div>
        </div>
        
        <!-- Question Content -->
        <div class="container py-5" style="background: #f8fafc; min-height: 500px;">
            <h1 class="mb-4" id="preview-question5-index"><strong>Reading question 5 (${setNumber}/${totalSets})</strong></h1>
            <h4 class="mb-4" id="preview-question5-topic" style="color: red;"><strong>TOPIC: ${topic}</strong></h4>
            <div class="mb-3">
                <button class="btn btn-secondary me-2" id="preview-showParagraphButton-${currentIndex}">Xem nội dung</button>
                <button class="btn btn-secondary" id="preview-showAnswerButton-${currentIndex}">Xem mẹo</button>
            </div>
            
            <div id="preview-question5-container">
    `;
    
    // Create questions array similar to reading_question5.js
    const questions5 = [];
    paragraphs.forEach((para, index) => {
        if (options[index + 1]) {
            questions5.push({
                id: `preview-part5-q${index}`,
                label: `${index + 1}.`,
                paragraph: para,
                correctAnswer: options[index + 1]
            });
        }
    });
    
    // Render questions: label and select on same row, paragraph hidden initially
    questions5.forEach(question => {
        html += `
            <div class="mb-3">
                <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                    <label class="form-label" for="${question.id}" style="margin-right: 10px; margin-bottom: 0;">${question.label}</label>
                    <select class="form-select preview-answer-select" id="${question.id}" data-question-index="${questions5.indexOf(question)}" style="flex: 1; min-width: 300px;" onchange="updatePreviewAnswer(5, ${currentIndex}, ${questions5.indexOf(question)}, this.value)">
                        <option value="">-- Chọn --</option>
        `;
        
        // Add shuffled options (skip first empty one)
        shuffledOptions.slice(1).forEach(opt => {
            const capitalized = opt.charAt(0).toUpperCase() + opt.slice(1);
            html += `<option value="${opt}">${capitalized}</option>`;
        });
        
        html += `
                    </select>
                </div>
                <p class="mt-2" id="preview-paragraph${question.id.replace('preview-part5-q', '')}" style="display: none;">${question.paragraph}</p>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background: white; padding: 1rem; border-top: 2px solid #e2e8f0; position: sticky; bottom: 0;">
            <div class="d-flex justify-content-between">
                <button class="btn btn-secondary" onclick="previousPreviewSet()" ${isFirst ? 'disabled' : ''}>Back</button>
                <button class="btn btn-primary" onclick="checkPreviewResult(5, ${currentIndex})">Check result</button>
                <button class="btn btn-success" onclick="nextPreviewSet()" ${isLast ? 'disabled' : ''}>${isLast ? 'The end' : 'Next'}</button>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Add event listeners for "Xem nội dung" button
    const showParagraphButton = document.getElementById(`preview-showParagraphButton-${currentIndex}`);
    if (showParagraphButton) {
        showParagraphButton.addEventListener('click', function() {
            const paragraphs = document.querySelectorAll(`#preview-question5-container p[id^="preview-paragraph"]`);
            paragraphs.forEach(p => {
                if (p.style.display === 'none') {
                    p.style.display = 'block';
                    showParagraphButton.textContent = 'Ẩn nội dung';
                } else {
                    p.style.display = 'none';
                    showParagraphButton.textContent = 'Xem nội dung';
                }
            });
        });
    }
    
    // Add event listener for "Xem mẹo" button
    const showAnswerButton = document.getElementById(`preview-showAnswerButton-${currentIndex}`);
    if (showAnswerButton) {
        showAnswerButton.addEventListener('click', function() {
            const modalBody = document.getElementById('previewAnswerModalBody');
            if (modalBody) {
                modalBody.innerHTML = '';
                
                const strong1 = document.createElement('p');
                strong1.innerHTML = '<strong>Học mẹo nếu bạn cần học gấp:</strong>';
                
                const strong2 = document.createElement('p');
                strong2.innerHTML = keyword || '';
                
                const strong3 = document.createElement('p');
                strong3.innerHTML = meo || '';
                
                modalBody.appendChild(strong1);
                if (keyword) modalBody.appendChild(strong2);
                if (meo) modalBody.appendChild(strong3);
                
                const modal = new bootstrap.Modal(document.getElementById('previewAnswerModal'));
                modal.show();
            }
        });
    }
}

// ============================================
// Check Result Functions
// ============================================

// Update user answer when they select an option
window.updatePreviewAnswer = function(part, setIndex, questionIndex, value) {
    const key = `${part}_${setIndex}_${questionIndex}`;
    if (!window.previewUserAnswers) {
        window.previewUserAnswers = {};
    }
    window.previewUserAnswers[key] = value || '';
};

// Collect all answers from the current preview
function collectPreviewAnswers(part, setIndex) {
    const answers = [];
    const selects = document.querySelectorAll(`.preview-answer-select[data-question-index]`);
    
    selects.forEach(select => {
        const questionIndex = parseInt(select.getAttribute('data-question-index'));
        const value = select.value || '';
        answers[questionIndex] = value;
        // Also update the global answers object
        const key = `${part}_${setIndex}_${questionIndex}`;
        if (!window.previewUserAnswers) {
            window.previewUserAnswers = {};
        }
        window.previewUserAnswers[key] = value;
    });
    
    return answers;
}

// Check result for preview
window.checkPreviewResult = function(part, setIndex) {
    const sets = window.previewSets || [];
    const currentSet = sets[setIndex];
    
    if (!currentSet) {
        alert('Không tìm thấy bộ đề.');
        return;
    }
    
    // Collect user answers
    let userAnswers = collectPreviewAnswers(part, setIndex);
    let correctAnswers = [];
    let questions = [];
    
    switch(part) {
        case 1:
            questions = currentSet.data.questions || [];
            correctAnswers = questions.map(q => q.correctAnswer || '');
            break;
        case 2:
            // Part 2: Compare sentence order from drag-and-drop
            const sentences = currentSet.data.sentences || [];
            const correctOrder = window.previewPart2CorrectAnswers && window.previewPart2CorrectAnswers[`${setIndex}`] 
                ? window.previewPart2CorrectAnswers[`${setIndex}`] 
                : sentences;
            
            // Get current order from DOM
            const cardsContainer = document.getElementById(`preview-cards-container-${setIndex}`);
            if (!cardsContainer) {
                alert('Không tìm thấy container của câu hỏi.');
                return;
            }
            
            const cards = cardsContainer.querySelectorAll('.draggable-item');
            const currentOrder = [];
            cards.forEach((card) => {
                const sentenceText = card.textContent.trim();
                currentOrder.push(sentenceText);
            });
            
            // Create questions array for display
            questions = correctOrder.map((s, i) => ({ question: `Sentence ${i + 1}` }));
            correctAnswers = correctOrder;
            userAnswers = currentOrder; // Update userAnswers with current order
            break;
        case 4:
            questions = currentSet.data.questions || [];
            correctAnswers = questions.map(q => q.correctAnswer || '');
            break;
        case 5:
            const paragraphs = currentSet.data.paragraphs || [];
            const options = currentSet.data.options || [];
            questions = paragraphs.map((p, i) => ({ question: `${i + 1}.` }));
            // Part 5: Use stored correct answers from renderPart5Preview
            if (window.previewPart5CorrectAnswers && window.previewPart5CorrectAnswers[`${setIndex}`]) {
                correctAnswers = window.previewPart5CorrectAnswers[`${setIndex}`];
            } else {
                // Fallback: options[1] for paragraph[0], options[2] for paragraph[1], etc.
                correctAnswers = [];
                paragraphs.forEach((p, i) => {
                    if (options[i + 1]) {
                        correctAnswers.push(options[i + 1]);
                    }
                });
            }
            break;
    }
    
    showPreviewResultModal(part, setIndex, userAnswers, correctAnswers, questions);
};

// Show result modal
function showPreviewResultModal(part, setIndex, userAnswers, correctAnswers, questions, customMessage) {
    const tableBody = document.getElementById('previewComparisonTableBody');
    tableBody.innerHTML = '';
    
    if (customMessage) {
        tableBody.innerHTML = `<tr><td colspan="3" class="text-center">${customMessage}</td></tr>`;
        document.getElementById('previewTotalScore').textContent = '';
        document.getElementById('previewScoreClassification').textContent = '';
    } else {
        let score = 0;
        let totalQuestions = Math.max(userAnswers.length, correctAnswers.length);
        
        // For Part 2, each correct position is worth 1 point (not 2)
        // Part 2 scoring: 1 point per correct position
        const pointsPerQuestion = (part === 2) ? 1 : 2;
        
        // Create comparison table
        for (let i = 0; i < totalQuestions; i++) {
            const userAnswer = userAnswers[i] || '(không chọn)';
            const correctAnswer = correctAnswers[i] || '';
            
            // For Part 2, first sentence (index 0) is always correct because it's fixed in place
            let isCorrect = userAnswer === correctAnswer;
            if (part === 2 && i === 0) {
                isCorrect = true; // First sentence is always correct
            }
            
            if (isCorrect) {
                score += pointsPerQuestion;
            }
            
            const tr = document.createElement('tr');
            
            // Question column
            const questionTd = document.createElement('td');
            if (part === 2) {
                questionTd.textContent = `Position ${i + 1}`;
            } else {
                questionTd.textContent = questions[i] ? (questions[i].question || `Question ${i + 1}`) : `Question ${i + 1}`;
            }
            tr.appendChild(questionTd);
            
            // User answer column
            const userAnswerTd = document.createElement('td');
            userAnswerTd.textContent = userAnswer;
            userAnswerTd.classList.add(isCorrect ? 'text-success' : 'text-danger');
            if (isCorrect) {
                userAnswerTd.innerHTML += ' <i class="bi bi-check-circle-fill text-success"></i>';
            } else {
                userAnswerTd.innerHTML += ' <i class="bi bi-x-circle-fill text-danger"></i>';
            }
            tr.appendChild(userAnswerTd);
            
            // Correct answer column
            const correctAnswerTd = document.createElement('td');
            correctAnswerTd.textContent = correctAnswer;
            correctAnswerTd.classList.add('text-success');
            correctAnswerTd.innerHTML += ' <i class="bi bi-check-circle-fill text-success"></i>';
            tr.appendChild(correctAnswerTd);
            
            tableBody.appendChild(tr);
        }
        
        // Update score
        const maxScore = totalQuestions * pointsPerQuestion;
        document.getElementById('previewTotalScore').textContent = `Your Score: ${score}/${maxScore}`;
        
        // Classification
        const classification = getPreviewScoreClassification(score, totalQuestions, pointsPerQuestion);
        document.getElementById('previewScoreClassification').textContent = `Classification: ${classification}`;
    }
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('previewResultModal'));
    modal.show();
}

// Get score classification
function getPreviewScoreClassification(score, totalQuestions, pointsPerQuestion = 2) {
    const maxScore = totalQuestions * pointsPerQuestion;
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    
    if (percentage >= 80) {
        return 'Excellent';
    } else if (percentage >= 60) {
        return 'Good';
    } else if (percentage >= 40) {
        return 'Fair';
    } else {
        return 'Cố gắng thêm nhé!';
    }
}

// ============================================
// Preview Question Sets
// ============================================

function previewQuestionSets() {
    const currentPart = window.currentPart || 1;
    const sets = questionSets[currentPart] || [];
    
    if (sets.length === 0) {
        alert('Chưa có bộ đề nào. Vui lòng thêm bộ đề trước.');
        return;
    }
    
    // Create preview content
    let previewHTML = `<h5 class="mb-3">Preview - Part ${currentPart} (${sets.length} bộ đề)</h5>`;
    previewHTML += '<div class="table-responsive"><table class="table table-bordered table-hover">';
    previewHTML += '<thead class="table-primary"><tr><th>#</th><th>Tiêu đề</th><th>Chi tiết</th></tr></thead><tbody>';
    
    sets.forEach((set, index) => {
        previewHTML += '<tr>';
        previewHTML += `<td><strong>${set.id}</strong></td>`;
        previewHTML += `<td>${set.title || '(Chưa có tiêu đề)'}</td>`;
        previewHTML += '<td>';
        
        switch(currentPart) {
            case 1:
                const qCount = set.data && set.data.questions ? set.data.questions.length : 0;
                previewHTML += `Số câu hỏi: <strong>${qCount}</strong>`;
                break;
            case 2:
                const sCount = set.data && set.data.sentences ? set.data.sentences.length : 0;
                previewHTML += `Topic: <strong>${set.data && set.data.topic ? set.data.topic : '(chưa có)'}</strong><br>`;
                previewHTML += `Số câu văn: <strong>${sCount}</strong>`;
                break;
            case 4:
                const q4Count = set.data && set.data.questions ? set.data.questions.length : 0;
                previewHTML += `Topic: <strong>${set.data && set.data.topic ? set.data.topic : '(chưa có)'}</strong><br>`;
                previewHTML += `Số câu hỏi: <strong>${q4Count}</strong>`;
                break;
            case 5:
                const optCount = set.data && set.data.options ? (set.data.options.length > 0 ? set.data.options.length - 1 : 0) : 0;
                const pCount = set.data && set.data.paragraphs ? set.data.paragraphs.length : 0;
                previewHTML += `Topic: <strong>${set.data && set.data.topic ? set.data.topic : '(chưa có)'}</strong><br>`;
                previewHTML += `Số options: <strong>${optCount}</strong><br>`;
                previewHTML += `Số paragraphs: <strong>${pCount}</strong>`;
                break;
        }
        
        previewHTML += '</td>';
        previewHTML += '</tr>';
    });
    
    previewHTML += '</tbody></table></div>';
    
    // Show in preview section
    const previewSection = document.getElementById('preview-section');
    const jsonPreview = document.getElementById('json-preview');
    const jsPreview = document.getElementById('js-preview');
    
    jsonPreview.innerHTML = previewHTML;
    jsonPreview.style.display = 'block';
    jsPreview.style.display = 'none';
    document.getElementById('preview-actions').style.display = 'none';
    previewSection.style.display = 'block';
    previewSection.scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// Export to JS - Show preview
// ============================================

function exportToJS() {
    const currentPart = window.currentPart || 1;
    let jsCode = '';
    
    switch(currentPart) {
        case 1:
            jsCode = generatePart1JS();
            break;
        case 2:
            jsCode = generatePart2JS();
            break;
        case 4:
            jsCode = generatePart4JS();
            break;
        case 5:
            jsCode = generatePart5JS();
            break;
    }
    
    // Show in preview
    document.getElementById('js-preview').textContent = jsCode;
    document.getElementById('js-preview').style.display = 'block';
    document.getElementById('json-preview').style.display = 'none';
    document.getElementById('preview-actions').style.display = 'flex';
    document.getElementById('preview-section').style.display = 'block';
    document.getElementById('preview-section').scrollIntoView({ behavior: 'smooth' });
    
    // Also copy to clipboard
    navigator.clipboard.writeText(jsCode).then(() => {
        alert('Đã copy code JS vào clipboard! Bạn có thể paste vào file tương ứng.');
    });
}

