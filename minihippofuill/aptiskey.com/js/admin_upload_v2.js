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

function requireAuthTokenOrRedirect() {
    const token = typeof getAuthToken === 'function'
        ? getAuthToken()
        : localStorage.getItem('auth_token');
    if (!token) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.');
        window.location.href = 'login.html';
        throw new Error('AUTH_TOKEN_MISSING');
    }
    return token;
}

window.buildAuthorizedHeaders = function(additionalHeaders = {}) {
    const token = requireAuthTokenOrRedirect();
    return {
        Authorization: `Bearer ${token}`,
        ...additionalHeaders
    };
};

function getJsonAuthHeaders() {
    return window.buildAuthorizedHeaders({ 'Content-Type': 'application/json' });
}

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
            loadExistingLesson(editLessonId, editPart);
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
async function loadExistingLesson(lessonId, requestedPart) {
    try {
        // Show loading state
        const banner = document.getElementById('edit-mode-banner');
        if (banner) {
            banner.style.display = 'block';
            banner.innerHTML = `<i class="bi bi-info-circle me-2"></i><strong>Chế độ chỉnh sửa:</strong> Đang tải dữ liệu bài học...`;
        }
        
        // Fetch lesson data
        const response = await fetch(`/api/lessons/get?id=${lessonId}`, {
            headers: getJsonAuthHeaders()
        });
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to load lesson');
        }
        
        const lesson = result.lesson;
        
        // Store editing state
        window.editingLessonId = lessonId;
        window.editingLessonFilePath = lesson.file_path;
        
        const lessonPart = lesson.part || requestedPart;
        let loaded = false;
        
        if (lesson.file_path) {
            const scriptContent = await fetchLessonScript(lesson.file_path);
            const embeddedData = extractLessonDataFromScript(scriptContent);
            if (embeddedData && Array.isArray(embeddedData.sets) && embeddedData.sets.length > 0) {
                loaded = applyLessonDataToEditor(embeddedData, lessonPart);
            }
        }
        
        if (!loaded) {
            alert(`Đang chỉnh sửa bài học: ${lesson.title || lesson.topic}\n\nKhông tìm thấy dữ liệu nhúng trong file. Vui lòng nhập lại nội dung thủ công.`);
            if (typeof switchPart === 'function' && lessonPart) {
                const numericPart = parseInt(lessonPart, 10);
                if (!Number.isNaN(numericPart)) {
                    switchPart(numericPart);
                }
            }
        } else if (banner) {
            banner.innerHTML = `<i class="bi bi-info-circle me-2"></i><strong>Chế độ chỉnh sửa:</strong> ${lesson.title || lesson.topic || 'Bài học'} đã được tải. Vui lòng chỉnh sửa và nhấn Upload để lưu.`;
        }
        
    } catch (error) {
        console.error('Error loading lesson:', error);
        if (error.message !== 'AUTH_TOKEN_MISSING') {
        alert('Lỗi khi tải bài học: ' + error.message);
        }
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

// Save Part 1 Set from direct input form
function savePart1Set() {
    const titleInput = document.getElementById('part1-title-input');
    const title = titleInput ? titleInput.value.trim() : '';
    
    // Collect data from part1-questions-container
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
    
    if (questions.length === 0) {
        alert('Vui lòng thêm ít nhất một câu hỏi!');
        return;
    }
    
    // Create new set
    const newSet = {
        id: questionSets[1].length + 1,
        title: title || `Bộ đề ${questionSets[1].length + 1}`,
        data: { questions }
    };
    
    questionSets[1].push(newSet);
    
    // Clear form
    if (titleInput) titleInput.value = '';
    document.getElementById('part1-questions-container').innerHTML = '';
    window.part1Questions = [];
    
    // Re-render sets
    renderQuestionSets(1);
    
    // Show success message
    alert('Đã lưu bộ đề thành công!');
}

// Make savePart1Set global
window.savePart1Set = savePart1Set;

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

function ensureCurrentSetPersisted(part) {
    const editForm = document.getElementById(`part${part}-edit-form`);
    if (editForm && editForm.style.display !== 'none') {
        saveCurrentSet();
    }
}

function sanitizeQuestionSets(part) {
    const sets = Array.isArray(questionSets[part]) ? questionSets[part] : [];
    const filtered = sets.filter(set => hasContentForSet(part, set)).map((set, index) => ({
        ...set,
        id: index + 1
    }));
    questionSets[part] = filtered;
    return filtered;
}

function hasContentForSet(part, set) {
    if (!set || !set.data) return false;
    switch(part) {
        case 1:
            return Array.isArray(set.data.questions) && set.data.questions.length > 0;
        case 2:
            return Array.isArray(set.data.sentences) && set.data.sentences.length > 0;
        case 4:
            return Array.isArray(set.data.questions) && set.data.questions.length > 0;
        case 5:
            const optionCount = Array.isArray(set.data.options) ? set.data.options.length - 1 : 0;
            const paragraphCount = Array.isArray(set.data.paragraphs) ? set.data.paragraphs.length : 0;
            return optionCount > 0 && paragraphCount > 0;
        default:
            return false;
    }
}

function appendLessonDataComment(code, payload) {
    try {
        const serialized = JSON.stringify(payload, null, 2);
        return `${code}\n/* MINI_HIPPO_LESSON_DATA_START\n${serialized}\nMINI_HIPPO_LESSON_DATA_END */\n`;
    } catch (error) {
        console.error('Failed to append lesson data comment:', error);
        return code;
    }
}

// Upload lesson to GitHub
async function uploadLessonToGitHub() {
    // Check if listening or reading
    const currentLessonType = window.currentLessonType || 'reading';
    
    if (currentLessonType === 'listening') {
        // Use listening upload function
        if (window.uploadListeningLessonToGitHub) {
            return await window.uploadListeningLessonToGitHub();
        } else {
            alert('Listening upload function chưa được load. Vui lòng refresh trang.');
            return;
        }
    }
    
    // Reading upload logic
    const currentPart = window.currentPart || 1;
    ensureCurrentSetPersisted(currentPart);
    const availableSets = sanitizeQuestionSets(currentPart);
    
    // Check if there are any question sets
    if (!availableSets || availableSets.length === 0) {
        alert('Chưa có bộ đề nào để upload. Vui lòng thêm và lưu bộ đề trước.');
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
    
    jsCode = appendLessonDataComment(jsCode, {
        version: 1,
        lessonType: 'reading',
        part: String(currentPart),
        sets: availableSets
    });
    
    // Determine file path based on part and whether editing existing lesson
    let filePath;
    const editingLessonId = window.editingLessonId;
    
    if (editingLessonId && window.editingLessonFilePath) {
        // Use existing file path if editing
        filePath = window.editingLessonFilePath;
    } else {
        // Create new file with lesson ID
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
    }
    
    // Get title for commit message (use first set's title or default)
    const firstSet = availableSets[0];
    const lessonTitle = firstSet && firstSet.title ? firstSet.title : `Part ${currentPart} Lesson`;
    const numSets = availableSets.length;
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
        // Send POST request to API
        const response = await fetch('/api/upload-lesson', {
            method: 'POST',
            headers: getJsonAuthHeaders(),
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
        
        // Upload successful - no popups
        
    } catch (error) {
        console.error('Upload error:', error);
        if (error.message === 'AUTH_TOKEN_MISSING') {
            return;
        }
        alert('Lỗi khi upload: ' + error.message);
    } finally {
        // Restore button state
        if (uploadButton) {
            uploadButton.disabled = false;
            uploadButton.innerHTML = originalText;
        }
    }
}

// Make function globally accessible
window.uploadLessonToGitHub = uploadLessonToGitHub;

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
    
    // Expose to window scope for external access
    code += `window.questionSets = questionSets;\n\n`;
    
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
    
    // Expose to window scope for external access
    code += `window.questionSets = questionSets;\n`;
    code += `window.questheader = questheader;\n\n`;
    
    // Add render function and dependencies
    code += `let currentSetIndex = 0;\n`;
    code += `let correctAnswersQuestion2 = [];\n\n`;
    code += `function shuffleQuestions(questions) {\n`;
    code += `  for (let i = questions.length - 1; i > 0; i--) {\n`;
    code += `    const j = Math.floor(Math.random() * (i + 1));\n`;
    code += `    [questions[i], questions[j]] = [questions[j], questions[i]];\n`;
    code += `  }\n`;
    code += `  return questions;\n`;
    code += `}\n\n`;
    code += `function initSortable() {\n`;
    code += `  const cardsContainer = document.getElementById('cardsContainer');\n`;
    code += `  if (!cardsContainer) {\n`;
    code += `    console.error('cardsContainer not found');\n`;
    code += `    return;\n`;
    code += `  }\n`;
    code += `  // Check if Sortable is available\n`;
    code += `  if (typeof Sortable === 'undefined') {\n`;
    code += `    console.error('SortableJS is not loaded. Please ensure sortablejs library is included.');\n`;
    code += `    // Try to wait a bit and retry\n`;
    code += `    setTimeout(function() {\n`;
    code += `      if (typeof Sortable !== 'undefined') {\n`;
    code += `        initSortable();\n`;
    code += `      } else {\n`;
    code += `        console.error('SortableJS still not available after retry');\n`;
    code += `      }\n`;
    code += `    }, 500);\n`;
    code += `    return;\n`;
    code += `  }\n`;
    code += `  // Destroy existing Sortable instance if any\n`;
    code += `  if (cardsContainer.sortableInstance) {\n`;
    code += `    cardsContainer.sortableInstance.destroy();\n`;
    code += `    cardsContainer.sortableInstance = null;\n`;
    code += `  }\n`;
    code += `  // Create new Sortable instance\n`;
    code += `  // Only allow dragging items with class 'draggable-item' (excludes first item)\n`;
    code += `  try {\n`;
    code += `    const sortable = new Sortable(cardsContainer, {\n`;
    code += `      animation: 150,\n`;
    code += `      draggable: '.draggable-item',\n`;
    code += `      filter: function(evt, item) {\n`;
    code += `        // Prevent dragging first child (which doesn't have draggable-item class)\n`;
    code += `        return item === cardsContainer.firstElementChild;\n`;
    code += `      },\n`;
    code += `      preventOnFilter: true,\n`;
    code += `      forceFallback: false,\n`;
    code += `      swapThreshold: 0.65,\n`;
    code += `      ghostClass: 'sortable-ghost',\n`;
    code += `      chosenClass: 'sortable-chosen'\n`;
    code += `    });\n`;
    code += `    // Store instance for later cleanup\n`;
    code += `    cardsContainer.sortableInstance = sortable;\n`;
    code += `    console.log('Sortable initialized successfully');\n`;
    code += `  } catch (error) {\n`;
    code += `    console.error('Error initializing Sortable:', error);\n`;
    code += `  }\n`;
    code += `}\n\n`;
    code += `function renderQuestion2(questionlist) {\n`;
    code += `  correctAnswersQuestion2 = [];\n`;
    code += `  questionlist.forEach(item => { correctAnswersQuestion2.push(item); });\n`;
    code += `  // Keep first sentence fixed at index 0, shuffle the rest\n`;
    code += `  const firstSentence = questionlist[0];\n`;
    code += `  const restSentences = questionlist.slice(1);\n`;
    code += `  const shuffledRest = shuffleQuestions([...restSentences]);\n`;
    code += `  const shuffledQuestionlist = [firstSentence, ...shuffledRest];\n`;
    code += `  const cardsContainer = document.getElementById('cardsContainer');\n`;
    code += `  if (cardsContainer) {\n`;
    code += `    cardsContainer.innerHTML = '';\n`;
    code += `    shuffledQuestionlist.forEach((text, index) => {\n`;
    code += `      const cardDiv = document.createElement('div');\n`;
    code += `      if (index === 0) {\n`;
    code += `        // First sentence: fixed, not draggable, with checkmark and highlight\n`;
    code += `        cardDiv.classList.add('card', 'mb-2');\n`;
    code += `        cardDiv.style.backgroundColor = '#e3f2fd';\n`;
    code += `        cardDiv.style.border = '2px solid #1976d2';\n`;
    code += `        cardDiv.style.cursor = 'default';\n`;
    code += `        const cardBody = document.createElement('div');\n`;
    code += `        cardBody.classList.add('card-body', 'd-flex', 'align-items-center');\n`;
    code += `        const checkIcon = document.createElement('i');\n`;
    code += `        checkIcon.classList.add('bi', 'bi-check-circle-fill', 'text-success', 'me-2');\n`;
    code += `        checkIcon.style.fontSize = '1.2rem';\n`;
    code += `        cardBody.appendChild(checkIcon);\n`;
    code += `        const textSpan = document.createElement('span');\n`;
    code += `        textSpan.innerText = text;\n`;
    code += `        cardBody.appendChild(textSpan);\n`;
    code += `        cardDiv.appendChild(cardBody);\n`;
    code += `      } else {\n`;
    code += `        // Other sentences: draggable\n`;
    code += `        cardDiv.classList.add('card', 'mb-2', 'draggable-item');\n`;
    code += `        // Don't set draggable attribute - SortableJS handles dragging\n`;
    code += `        cardDiv.id = 'item' + (index + 1);\n`;
    code += `        const cardBody = document.createElement('div');\n`;
    code += `        cardBody.classList.add('card-body', 'd-flex', 'align-items-center');\n`;
    code += `        const dragIcon = document.createElement('i');\n`;
    code += `        dragIcon.classList.add('bi', 'bi-grip-vertical', 'me-2', 'text-muted');\n`;
    code += `        dragIcon.style.fontSize = '1.2rem';\n`;
    code += `        cardBody.appendChild(dragIcon);\n`;
    code += `        const textSpan = document.createElement('span');\n`;
    code += `        textSpan.innerText = text;\n`;
    code += `        cardBody.appendChild(textSpan);\n`;
    code += `        cardDiv.appendChild(cardBody);\n`;
    code += `      }\n`;
    code += `      cardsContainer.appendChild(cardDiv);\n`;
    code += `    });\n`;
    code += `    // Initialize Sortable after a short delay to ensure DOM is ready and SortableJS is loaded\n`;
    code += `    setTimeout(function() {\n`;
    code += `      initSortable();\n`;
    code += `    }, 200);\n`;
    code += `  }\n`;
    code += `  const headerEl = document.getElementById('html_questheader');\n`;
    code += `  if (headerEl) headerEl.textContent = 'Reading Question 2 & 3 ( ' + (currentSetIndex + 1) + ' / ' + questheader.length + ' )';\n`;
    code += `  const topicEl = document.getElementById('question2_topic');\n`;
    code += `  if (topicEl) topicEl.textContent = 'Topic: ' + questheader[currentSetIndex];\n`;
    code += `}\n`;
    code += `// Expose renderQuestion2 to window\n`;
    code += `window.renderQuestion2 = renderQuestion2;\n\n`;
    code += `// User answers array\n`;
    code += `const userAnswersQuestion2 = [];\n`;
    code += `let question2Score = 0;\n\n`;
    code += `// Check result button handler\n`;
    code += `document.getElementById('checkResultButton').addEventListener('click', function() {\n`;
    code += `  userAnswersQuestion2.length = 0;\n`;
    code += `  const cardsContainer = document.getElementById('cardsContainer');\n`;
    code += `  // Get all cards including the first one (which is not draggable)\n`;
    code += `  const cards = cardsContainer.querySelectorAll('.card');\n`;
    code += `  cards.forEach((card) => {\n`;
    code += `    // Get text content, removing icon text if present\n`;
    code += `    const cardBody = card.querySelector('.card-body');\n`;
    code += `    if (cardBody) {\n`;
    code += `      const textSpan = cardBody.querySelector('span');\n`;
    code += `      const selectedAnswer = textSpan ? textSpan.textContent.trim() : cardBody.textContent.trim().replace(/^[✓\\s]*/, '').trim();\n`;
    code += `      userAnswersQuestion2.push(selectedAnswer || "(không chọn)");\n`;
    code += `    } else {\n`;
    code += `      const selectedAnswer = card.textContent.trim() || "(không chọn)";\n`;
    code += `      userAnswersQuestion2.push(selectedAnswer);\n`;
    code += `    }\n`;
    code += `  });\n`;
    code += `  const answers = [];\n`;
    code += `  const correctAnswers = [];\n`;
    code += `  correctAnswersQuestion2.forEach((correctAnswer, index) => {\n`;
    code += `    const selectedAnswer = userAnswersQuestion2[index] || "(không chọn)";\n`;
    code += `    answers.push(selectedAnswer);\n`;
    code += `    correctAnswers.push(correctAnswer);\n`;
    code += `  });\n`;
    code += `  question2Score = displayComparisonResultsQuestion2(answers, correctAnswers);\n`;
    code += `  const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));\n`;
    code += `  resultModal.show();\n`;
    code += `});\n\n`;
    code += `// Display comparison results function\n`;
    code += `function displayComparisonResultsQuestion2(userAnswers, correctAnswers) {\n`;
    code += `  const comparisonBody = document.getElementById('comparisonTableBody');\n`;
    code += `  const totalScoreElement = document.getElementById('totalScore');\n`;
    code += `  comparisonBody.innerHTML = '';\n`;
    code += `  let score = 0;\n`;
    code += `  userAnswers.forEach((userAnswer, index) => {\n`;
    code += `    const tr = document.createElement('tr');\n`;
    code += `    const userAnswerTd = document.createElement('td');\n`;
    code += `    userAnswerTd.innerHTML = '<span class="' + (userAnswer === correctAnswers[index] ? 'correct' : 'incorrect') + '">' + userAnswer + '</span>';\n`;
    code += `    tr.appendChild(userAnswerTd);\n`;
    code += `    const correctAnswerTd = document.createElement('td');\n`;
    code += `    correctAnswerTd.innerHTML = '<span class="correct">' + correctAnswers[index] + '</span>';\n`;
    code += `    tr.appendChild(correctAnswerTd);\n`;
    code += `    if (userAnswer === correctAnswers[index]) score++;\n`;
    code += `    comparisonBody.appendChild(tr);\n`;
    code += `  });\n`;
    code += `  totalScoreElement.innerHTML = '<strong>Your score: ' + score + ' / ' + correctAnswers.length + '</strong>';\n`;
    code += `  return score;\n`;
    code += `}\n\n`;
    code += `// Next button handler\n`;
    code += `document.getElementById('nextButton').addEventListener('click', function() {\n`;
    code += `  if (currentSetIndex < questionSets.length - 1) {\n`;
    code += `    currentSetIndex++;\n`;
    code += `    renderQuestion2(questionSets[currentSetIndex]);\n`;
    code += `    if (currentSetIndex === questionSets.length - 1) {\n`;
    code += `      document.getElementById('nextButton').textContent = "The end";\n`;
    code += `    }\n`;
    code += `  }\n`;
    code += `});\n\n`;
    code += `// Back button handler\n`;
    code += `document.getElementById('backButton').addEventListener('click', function() {\n`;
    code += `  if (currentSetIndex > 0) {\n`;
    code += `    currentSetIndex--;\n`;
    code += `    renderQuestion2(questionSets[currentSetIndex]);\n`;
    code += `    if (currentSetIndex !== questionSets.length - 1) {\n`;
    code += `      document.getElementById('nextButton').textContent = "Next";\n`;
    code += `    }\n`;
    code += `  }\n`;
    code += `});\n\n`;
    code += `// Initialize on load\n`;
    code += `if (document.readyState === 'loading') {\n`;
    code += `  document.addEventListener('DOMContentLoaded', function() {\n`;
    code += `    if (questionSets && questionSets.length > 0) renderQuestion2(questionSets[0]);\n`;
    code += `  });\n`;
    code += `} else {\n`;
    code += `  if (questionSets && questionSets.length > 0) renderQuestion2(questionSets[0]);\n`;
    code += `}\n\n`;
    
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
    
    // Expose to window scope for external access
    code += `window.question4Text = question4Text;\n`;
    code += `window.question4Content = question4Content;\n\n`;
    
    // Add render function and dependencies
    code += `let currentIndex = 0;\n\n`;
    code += `function renderQuestion4(index) {\n`;
    code += `  document.getElementById('question4_index').textContent = "Reading Question 4" + " (" + (index + 1) + "/" + question4Text.length + ")";\n`;
    code += `  if (!question4Text[index] || !question4Content[index]) {\n`;
    code += `    console.error('Không tìm thấy dữ liệu cho câu hỏi tại index: ' + index);\n`;
    code += `    return;\n`;
    code += `  }\n`;
    code += `  const container = document.getElementById('question4');\n`;
    code += `  const row = container.querySelector('.row');\n`;
    code += `  const leftColumn = row.querySelector('.col-md-7');\n`;
    code += `  leftColumn.innerHTML = '';\n`;
    code += `  question4Text[index].forEach((text, textIndex) => {\n`;
    code += `    const p = document.createElement('p');\n`;
    code += `    let formattedText = text || '';\n`;
    code += `    \n`;
    code += `    // First paragraph (index 0) - introduction, make it bold\n`;
    code += `    if (textIndex === 0) {\n`;
    code += `      // If not already wrapped in strong tags, wrap the entire text\n`;
    code += `      if (!formattedText.includes('<strong>')) {\n`;
    code += `        formattedText = '<strong>' + formattedText + '</strong>';\n`;
    code += `      }\n`;
    code += `    } else {\n`;
    code += `      // Other paragraphs (A, B, C, D) - add letter prefix and make it bold\n`;
    code += `      const letters = ['A', 'B', 'C', 'D'];\n`;
    code += `      const letterIndex = textIndex - 1; // textIndex 1->A, 2->B, 3->C, 4->D\n`;
    code += `      \n`;
    code += `      if (letterIndex < letters.length) {\n`;
    code += `        const letter = letters[letterIndex];\n`;
    code += `        const letterPrefix = letter + ': ';\n`;
    code += `        \n`;
    code += `        // Check if text already starts with the letter (with or without strong tags)\n`;
    code += `        const hasLetterPrefix = formattedText.trim().toUpperCase().startsWith(letter + ':');\n`;
    code += `        \n`;
    code += `        if (hasLetterPrefix) {\n`;
    code += `          // Text already has letter prefix, just ensure it's bold\n`;
    code += `          // Remove existing strong tags around letter if any, then add new ones\n`;
    code += `          formattedText = formattedText.replace(/^\\s*<strong>\\s*([A-D]):\\s*<\\/strong>\\s*/i, '');\n`;
    code += `          formattedText = formattedText.replace(/^\\s*([A-D]):\\s*/i, '');\n`;
    code += `          formattedText = '<strong>' + letter + ':</strong> ' + formattedText.trim();\n`;
    code += `        } else {\n`;
    code += `          // Text doesn't have letter prefix, add it with bold\n`;
    code += `          formattedText = '<strong>' + letter + ':</strong> ' + formattedText.trim();\n`;
    code += `        }\n`;
    code += `      }\n`;
    code += `    }\n`;
    code += `    \n`;
    code += `    p.innerHTML = formattedText;\n`;
    code += `    leftColumn.appendChild(p);\n`;
    code += `  });\n`;
    code += `  const rightColumn = row.querySelector('.col-md-5');\n`;
    code += `  const form = rightColumn.querySelector('form');\n`;
    code += `  form.innerHTML = '';\n`;
    code += `  question4Content[index].forEach(item => {\n`;
    code += `    const div = document.createElement('div');\n`;
    code += `    div.classList.add('mb-3', 'row', 'align-items-center');\n`;
    code += `    const label = document.createElement('label');\n`;
    code += `    label.setAttribute('for', item.id);\n`;
    code += `    label.classList.add('col-9', 'col-form-label');\n`;
    code += `    label.textContent = item.question;\n`;
    code += `    const selectDiv = document.createElement('div');\n`;
    code += `    selectDiv.classList.add('col-3');\n`;
    code += `    const select = document.createElement('select');\n`;
    code += `    select.id = item.id;\n`;
    code += `    select.classList.add('form-select', 'select-fixed');\n`;
    code += `    item.options.forEach(option => {\n`;
    code += `      const optionElement = document.createElement('option');\n`;
    code += `      optionElement.textContent = option;\n`;
    code += `      select.appendChild(optionElement);\n`;
    code += `    });\n`;
    code += `    selectDiv.appendChild(select);\n`;
    code += `    div.appendChild(label);\n`;
    code += `    div.appendChild(selectDiv);\n`;
    code += `    form.appendChild(div);\n`;
    code += `  });\n`;
    code += `  const topicElement = document.getElementById('question4_topic');\n`;
    code += `  topicElement.textContent = 'Topic: ' + question4Topic[index];\n`;
    code += `  currentIndex = index;\n`;
    code += `}\n`;
    code += `// Expose renderQuestion4 to window\n`;
    code += `window.renderQuestion4 = renderQuestion4;\n`;
    code += `window.setupNavigationButtons = setupNavigationButtons;\n\n`;
    code += `// Check result function\n`;
    code += `function displayComparisonResultsQuestion4(userAnswers, correctAnswers) {\n`;
    code += `  const comparisonBody = document.getElementById('comparisonTableBody');\n`;
    code += `  const totalScoreElement = document.getElementById('totalScore_question4');\n`;
    code += `  \n`;
    code += `  // Clear previous results\n`;
    code += `  comparisonBody.innerHTML = '';\n`;
    code += `  \n`;
    code += `  // Calculate score\n`;
    code += `  let score = 0;\n`;
    code += `  \n`;
    code += `  // Loop through questions and display results\n`;
    code += `  question4Content[currentIndex].forEach((item, index) => {\n`;
    code += `    const tr = document.createElement('tr');\n`;
    code += `    \n`;
    code += `    // Question column\n`;
    code += `    const questionTd = document.createElement('td');\n`;
    code += `    questionTd.innerHTML = item.question;\n`;
    code += `    tr.appendChild(questionTd);\n`;
    code += `    \n`;
    code += `    // User answer column\n`;
    code += `    const userAnswerTd = document.createElement('td');\n`;
    code += `    const userAnswer = userAnswers[index] || "(không chọn)";\n`;
    code += `    userAnswerTd.innerHTML = '<span class="' + (userAnswer === correctAnswers[index] ? 'correct' : 'incorrect') + '">' + userAnswer + '</span>';\n`;
    code += `    tr.appendChild(userAnswerTd);\n`;
    code += `    \n`;
    code += `    // Correct answer column\n`;
    code += `    const correctAnswerTd = document.createElement('td');\n`;
    code += `    correctAnswerTd.innerHTML = '<span class="correct">' + correctAnswers[index] + '</span>';\n`;
    code += `    tr.appendChild(correctAnswerTd);\n`;
    code += `    \n`;
    code += `    // If correct, add score\n`;
    code += `    if (userAnswer === correctAnswers[index]) {\n`;
    code += `      score += 2;\n`;
    code += `    }\n`;
    code += `    \n`;
    code += `    comparisonBody.appendChild(tr);\n`;
    code += `  });\n`;
    code += `  \n`;
    code += `  // Display total score\n`;
    code += `  if (totalScoreElement) {\n`;
    code += `    totalScoreElement.textContent = 'Total Score: ' + score + ' / ' + (question4Content[currentIndex].length * 2);\n`;
    code += `  }\n`;
    code += `  \n`;
    code += `  return score;\n`;
    code += `}\n\n`;
    code += `// Check result button event listener\n`;
    code += `if (document.readyState === 'loading') {\n`;
    code += `  document.addEventListener('DOMContentLoaded', function() {\n`;
    code += `    const checkResultBtn = document.getElementById('checkResultButton');\n`;
    code += `    if (checkResultBtn) {\n`;
    code += `      checkResultBtn.addEventListener('click', function() {\n`;
    code += `        const answers = [];\n`;
    code += `        const correctAnswers = [];\n`;
    code += `        \n`;
    code += `        // Get user answers\n`;
    code += `        question4Content[currentIndex].forEach((item, index) => {\n`;
    code += `          const selectElement = document.getElementById(item.id);\n`;
    code += `          if (selectElement) {\n`;
    code += `            const selectedAnswer = selectElement.value || "(không chọn)";\n`;
    code += `            answers.push(selectedAnswer);\n`;
    code += `            correctAnswers.push(correctAnswersQuestion4[currentIndex][index]);\n`;
    code += `          }\n`;
    code += `        });\n`;
    code += `        \n`;
    code += `        // Display results\n`;
    code += `        displayComparisonResultsQuestion4(answers, correctAnswers);\n`;
    code += `        \n`;
    code += `        // Show modal\n`;
    code += `        const modal = new bootstrap.Modal(document.getElementById('resultModal'));\n`;
    code += `        modal.show();\n`;
    code += `      });\n`;
    code += `    }\n`;
    code += `  });\n`;
    code += `} else {\n`;
    code += `  const checkResultBtn = document.getElementById('checkResultButton');\n`;
    code += `  if (checkResultBtn) {\n`;
    code += `    checkResultBtn.addEventListener('click', function() {\n`;
    code += `      const answers = [];\n`;
    code += `      const correctAnswers = [];\n`;
    code += `      \n`;
    code += `      // Get user answers\n`;
    code += `      question4Content[currentIndex].forEach((item, index) => {\n`;
    code += `        const selectElement = document.getElementById(item.id);\n`;
    code += `        if (selectElement) {\n`;
    code += `          const selectedAnswer = selectElement.value || "(không chọn)";\n`;
    code += `          answers.push(selectedAnswer);\n`;
    code += `          correctAnswers.push(correctAnswersQuestion4[currentIndex][index]);\n`;
    code += `        }\n`;
    code += `      });\n`;
    code += `      \n`;
    code += `      // Display results\n`;
    code += `      displayComparisonResultsQuestion4(answers, correctAnswers);\n`;
    code += `      \n`;
    code += `      // Show modal\n`;
    code += `      const modal = new bootstrap.Modal(document.getElementById('resultModal'));\n`;
    code += `      modal.show();\n`;
    code += `    });\n`;
    code += `  }\n`;
    code += `}\n\n`;
    code += `// Next and Back button handlers\n`;
    code += `let navigationButtonsSetup = false;\n`;
    code += `function setupNavigationButtons() {\n`;
    code += `  if (navigationButtonsSetup) {\n`;
    code += `    return; // Already setup\n`;
    code += `  }\n`;
    code += `  \n`;
    code += `  const nextButton = document.getElementById('nextButton');\n`;
    code += `  const backButton = document.getElementById('backButton');\n`;
    code += `  \n`;
    code += `  if (nextButton) {\n`;
    code += `    nextButton.addEventListener('click', function() {\n`;
    code += `      if (backButton) backButton.textContent = "Back";\n`;
    code += `      if (currentIndex < question4Text.length - 1) {\n`;
    code += `        currentIndex++;\n`;
    code += `        renderQuestion4(currentIndex);\n`;
    code += `        // Update header with current index\n`;
    code += `        const headerEl = document.getElementById('question4_index');\n`;
    code += `        if (headerEl) headerEl.textContent = 'Reading Question 4 (' + (currentIndex + 1) + '/' + question4Text.length + ')';\n`;
    code += `      } else {\n`;
    code += `        // If at last question, change button text\n`;
    code += `        nextButton.textContent = "The end";\n`;
    code += `      }\n`;
    code += `    });\n`;
    code += `  }\n`;
    code += `  \n`;
    code += `  if (backButton) {\n`;
    code += `    backButton.addEventListener('click', function() {\n`;
    code += `      if (currentIndex > 0) {\n`;
    code += `        currentIndex--;\n`;
    code += `        renderQuestion4(currentIndex);\n`;
    code += `        if (nextButton) nextButton.textContent = "Next";\n`;
    code += `        // Update header with current index\n`;
    code += `        const headerEl = document.getElementById('question4_index');\n`;
    code += `        if (headerEl) headerEl.textContent = 'Reading Question 4 (' + (currentIndex + 1) + '/' + question4Text.length + ')';\n`;
    code += `      } else {\n`;
    code += `        // If at first question, change button text\n`;
    code += `        backButton.textContent = "No Previous Question";\n`;
    code += `      }\n`;
    code += `    });\n`;
    code += `  }\n`;
    code += `  \n`;
    code += `  navigationButtonsSetup = true;\n`;
    code += `}\n\n`;
    code += `// Initialize on load\n`;
    code += `if (document.readyState === 'loading') {\n`;
    code += `  document.addEventListener('DOMContentLoaded', function() {\n`;
    code += `    renderQuestion4(0);\n`;
    code += `    setupNavigationButtons();\n`;
    code += `  });\n`;
    code += `} else {\n`;
    code += `  renderQuestion4(0);\n`;
    code += `  setupNavigationButtons();\n`;
    code += `}\n\n`;
    
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
    
    code += `const paragraph_question5 = [\n`;
    questionSets[5].forEach((set, index) => {
        code += `  paragraph_question5_${index + 1},\n`;
    });
    code += `];\n\n`;
    
    code += `const meohoc = [\n`;
    questionSets[5].forEach((set, index) => {
        code += `  [question5_keyword_${index + 1}, question5_meo_${index + 1}],\n`;
    });
    code += `];\n\n`;
    
    // Generate topics
    code += `const topic_name = {\n`;
    questionSets[5].forEach((set, index) => {
        code += `    topic_${index + 1}: "${escapeJS(set.data.topic || set.title || '')}",\n`;
    });
    code += `};\n\n`;
    
    code += `const dodai = options.length;\n`;
    
    // Expose to window scope for external access
    code += `window.options = options;\n`;
    code += `window.paragraph_question5 = paragraph_question5;\n`;
    code += `window.meohoc = meohoc;\n`;
    code += `window.topic_name = topic_name;\n\n`;
    
    // Add render function and dependencies
    code += `let currentQuestion = 0;\n`;
    code += `let questions5 = [];\n\n`;
    code += `function shuffleArray(array) {\n`;
    code += `  const firstElement = array[0]; // Lưu phần tử đầu tiên (rỗng)\n`;
    code += `  // Tách phần tử đầu tiên và xáo trộn phần còn lại của mảng\n`;
    code += `  const remainingElements = array.slice(1);\n`;
    code += `  // Xáo trộn phần còn lại của mảng\n`;
    code += `  for (let i = remainingElements.length - 1; i > 0; i--) {\n`;
    code += `    const j = Math.floor(Math.random() * (i + 1));\n`;
    code += `    [remainingElements[i], remainingElements[j]] = [remainingElements[j], remainingElements[i]];\n`;
    code += `  }\n`;
    code += `  // Thêm lại phần tử đầu tiên vào đầu mảng đã xáo trộn\n`;
    code += `  remainingElements.unshift(firstElement);\n`;
    code += `  return remainingElements;\n`;
    code += `}\n\n`;
    code += `function renderQuestion5(options, paragraph_question5, meohoc) {\n`;
    code += `  const container = document.getElementById('question5-container');\n`;
    code += `  if (!container) { console.error("Container không tồn tại!"); return; }\n`;
    code += `  const topicEl = document.getElementById("question5_topic");\n`;
    code += `  if (topicEl) topicEl.innerText = "TOPIC: " + topic_name["topic_" + (currentQuestion + 1)];\n`;
    code += `  const indexEl = document.getElementById('question5_index');\n`;
    code += `  if (indexEl) indexEl.textContent = 'Reading question 5 (' + (currentQuestion + 1) + '/' + dodai + ')';\n`;
    code += `  // Shuffle options (shuffleArray already keeps first empty option at beginning)\n`;
    code += `  const shuffledOptions = shuffleArray([...options]);\n`;
    code += `  questions5 = [\n`;
    code += `    { id: 'question5_q1', label: '1.', paragraph: paragraph_question5[0], correctAnswer: options[1] },\n`;
    code += `    { id: 'question5_q2', label: '2.', paragraph: paragraph_question5[1], correctAnswer: options[2] },\n`;
    code += `    { id: 'question5_q3', label: '3.', paragraph: paragraph_question5[2], correctAnswer: options[3] },\n`;
    code += `    { id: 'question5_q4', label: '4.', paragraph: paragraph_question5[3], correctAnswer: options[4] },\n`;
    code += `    { id: 'question5_q5', label: '5.', paragraph: paragraph_question5[4], correctAnswer: options[5] },\n`;
    code += `    { id: 'question5_q6', label: '6.', paragraph: paragraph_question5[5], correctAnswer: options[6] },\n`;
    code += `    { id: 'question5_q7', label: '7.', paragraph: paragraph_question5[6], correctAnswer: options[7] },\n`;
    code += `  ];\n`;
    code += `  container.innerHTML = '';\n`;
    code += `  questions5.forEach((question, index) => {\n`;
    code += `    // Tạo div cho mỗi câu hỏi\n`;
    code += `    const questionDiv = document.createElement('div');\n`;
    code += `    questionDiv.classList.add('mb-3', 'border', 'rounded-3', 'p-3', 'bg-white', 'shadow-sm');\n`;
    code += `    \n`;
    code += `    // Tạo một div cha để hiển thị label số và select trên cùng một hàng\n`;
    code += `    const questionRow = document.createElement('div');\n`;
    code += `    questionRow.style.display = 'flex';\n`;
    code += `    questionRow.style.alignItems = 'center';\n`;
    code += `    questionRow.style.gap = '12px';\n`;
    code += `    questionRow.classList.add('mb-2');\n`;
    code += `    \n`;
    code += `    // Tạo label số\n`;
    code += `    const label = document.createElement('label');\n`;
    code += `    label.classList.add('mb-0', 'fw-semibold');\n`;
    code += `    label.textContent = (index + 1) + '.';\n`;
    code += `    label.style.minWidth = '30px';\n`;
    code += `    \n`;
    code += `    // Tạo phần tử select cho câu hỏi\n`;
    code += `    const select = document.createElement('select');\n`;
    code += `    select.classList.add('form-select');\n`;
    code += `    select.id = question.id;\n`;
    code += `    shuffledOptions.forEach((optionValue, optIndex) => {\n`;
    code += `      // Skip empty, null, undefined values (except for '-- Chọn --')\n`;
    code += `      if (optionValue === null || optionValue === undefined || (typeof optionValue === 'string' && optionValue.trim() === '' && optionValue !== '-- Chọn --')) {\n`;
    code += `        return;\n`;
    code += `      }\n`;
    code += `      const option = document.createElement('option');\n`;
    code += `      option.value = optionValue === '-- Chọn --' ? '' : optionValue;\n`;
    code += `      option.textContent = optionValue === '-- Chọn --' ? '-- Chọn --' : optionValue;\n`;
    code += `      if (optionValue === '-- Chọn --') {\n`;
    code += `        option.selected = true; // Select empty option by default\n`;
    code += `      }\n`;
    code += `      select.appendChild(option);\n`;
    code += `    });\n`;
    code += `    \n`;
    code += `    questionRow.appendChild(label);\n`;
    code += `    questionRow.appendChild(select);\n`;
    code += `    \n`;
    code += `    // Tạo paragraph để hiển thị nội dung (ẩn mặc định)\n`;
    code += `    const paragraph = document.createElement('p');\n`;
    code += `    paragraph.classList.add('mt-2', 'mb-0');\n`;
    code += `    paragraph.id = 'paragraph' + question.id.slice(10);\n`;
    code += `    paragraph.style.display = 'none';\n`;
    code += `    paragraph.textContent = question.paragraph;\n`;
    code += `    \n`;
    code += `    questionDiv.appendChild(questionRow);\n`;
    code += `    questionDiv.appendChild(paragraph);\n`;
    code += `    container.appendChild(questionDiv);\n`;
    code += `  });\n`;
    code += `}\n`;
    code += `// Expose renderQuestion5 to window\n`;
    code += `window.renderQuestion5 = renderQuestion5;\n\n`;
    code += `// Setup button handlers\n`;
    code += `let buttonsSetup = false;\n`;
    code += `function setupPart5Buttons() {\n`;
    code += `  if (buttonsSetup) {\n`;
    code += `    console.log('Buttons already setup, skipping...');\n`;
    code += `    return;\n`;
    code += `  }\n`;
    code += `  console.log('Setting up Part 5 buttons...');\n`;
    code += `  // Show/Hide paragraphs button\n`;
    code += `  const showParagraphBtn = document.getElementById('showParagraphButton');\n`;
    code += `  if (showParagraphBtn) {\n`;
    code += `    showParagraphBtn.addEventListener('click', function() {\n`;
    code += `      const paragraphs = document.querySelectorAll('#question5-container p.mt-2');\n`;
    code += `      if (paragraphs.length === 0) {\n`;
    code += `        console.warn('No paragraphs found in question5-container');\n`;
    code += `        return;\n`;
    code += `      }\n`;
    code += `      \n`;
    code += `      // Check current state - if first paragraph is visible, hide all; otherwise show all\n`;
    code += `      const firstParagraph = paragraphs[0];\n`;
    code += `      const isCurrentlyVisible = firstParagraph && (firstParagraph.style.display !== 'none' && window.getComputedStyle(firstParagraph).display !== 'none');\n`;
    code += `      \n`;
    code += `      // Toggle visibility\n`;
    code += `      paragraphs.forEach(paragraph => {\n`;
    code += `        paragraph.style.display = isCurrentlyVisible ? 'none' : 'block';\n`;
    code += `      });\n`;
    code += `      \n`;
    code += `      // Update button text\n`;
    code += `      showParagraphBtn.textContent = isCurrentlyVisible ? 'Xem nội dung' : 'Ẩn nội dung';\n`;
    code += `      console.log('Paragraphs toggled, isVisible:', isCurrentlyVisible, 'paragraphs count:', paragraphs.length);\n`;
    code += `    });\n`;
    code += `  } else {\n`;
    code += `    console.warn('showParagraphButton not found');\n`;
    code += `  }\n`;
    code += `  \n`;
    code += `  // Show tips button\n`;
    code += `  const showAnswerBtn = document.getElementById('showAnswerButton');\n`;
    code += `  if (showAnswerBtn) {\n`;
    code += `    showAnswerBtn.addEventListener('click', function() {\n`;
    code += `      const modalBody = document.getElementById('modal-body');\n`;
    code += `      if (modalBody) {\n`;
    code += `        modalBody.innerHTML = '';\n`;
    code += `        const p1 = document.createElement('p');\n`;
    code += `        p1.innerHTML = '<strong>Học mẹo nếu bạn cần học gấp:</strong>';\n`;
    code += `        modalBody.appendChild(p1);\n`;
    code += `        const p2 = document.createElement('p');\n`;
    code += `        p2.innerHTML = meohoc[currentQuestion][0] || '';\n`;
    code += `        modalBody.appendChild(p2);\n`;
    code += `        const p3 = document.createElement('p');\n`;
    code += `        p3.innerHTML = meohoc[currentQuestion][1] || '';\n`;
    code += `        modalBody.appendChild(p3);\n`;
    code += `        const modalElement = document.getElementById('answerModal');\n`;
    code += `        if (modalElement) {\n`;
    code += `          // Remove any existing backdrop first\n`;
    code += `          const existingBackdrop = document.querySelector('.modal-backdrop');\n`;
    code += `          if (existingBackdrop) {\n`;
    code += `            existingBackdrop.remove();\n`;
    code += `            document.body.classList.remove('modal-open');\n`;
    code += `            document.body.style.overflow = '';\n`;
    code += `            document.body.style.paddingRight = '';\n`;
    code += `          }\n`;
    code += `          const modal = new bootstrap.Modal(modalElement);\n`;
    code += `          modal.show();\n`;
    code += `          // Clean up backdrop when modal is hidden\n`;
    code += `          modalElement.addEventListener('hidden.bs.modal', function() {\n`;
    code += `            const backdrop = document.querySelector('.modal-backdrop');\n`;
    code += `            if (backdrop) {\n`;
    code += `              backdrop.remove();\n`;
    code += `            }\n`;
    code += `            document.body.classList.remove('modal-open');\n`;
    code += `            document.body.style.overflow = '';\n`;
    code += `            document.body.style.paddingRight = '';\n`;
    code += `          }, { once: true });\n`;
    code += `        }\n`;
    code += `      }\n`;
    code += `    });\n`;
    code += `  }\n`;
    code += `  \n`;
    code += `  // Check result button\n`;
    code += `  const checkResultBtn = document.getElementById('checkResultButton');\n`;
    code += `  if (checkResultBtn) {\n`;
    code += `    checkResultBtn.addEventListener('click', function() {\n`;
    code += `      const answers = [];\n`;
    code += `      const correctAnswers = [];\n`;
    code += `      questions5.forEach((question, index) => {\n`;
    code += `        const selectElement = document.getElementById(question.id);\n`;
    code += `        if (selectElement) {\n`;
    code += `          const selectedAnswer = selectElement.value || "(không chọn)";\n`;
    code += `          answers.push(selectedAnswer);\n`;
    code += `          correctAnswers.push(question.correctAnswer);\n`;
    code += `        }\n`;
    code += `      });\n`;
    code += `      \n`;
    code += `      // Display results\n`;
    code += `      const comparisonBody = document.getElementById('comparisonTableBody');\n`;
    code += `      const totalScoreEl = document.getElementById('totalScore_question4');\n`;
    code += `      if (comparisonBody) {\n`;
    code += `        comparisonBody.innerHTML = '';\n`;
    code += `        let score = 0;\n`;
    code += `        questions5.forEach((question, index) => {\n`;
    code += `          const tr = document.createElement('tr');\n`;
    code += `          const questionTd = document.createElement('td');\n`;
    code += `          questionTd.textContent = (index + 1) + '. ' + question.paragraph.substring(0, 50) + '...';\n`;
    code += `          tr.appendChild(questionTd);\n`;
    code += `          const userAnswerTd = document.createElement('td');\n`;
    code += `          const userAnswer = answers[index] || "(không chọn)";\n`;
    code += `          userAnswerTd.innerHTML = '<span class="' + (userAnswer === correctAnswers[index] ? 'correct' : 'incorrect') + '">' + userAnswer + '</span>';\n`;
    code += `          tr.appendChild(userAnswerTd);\n`;
    code += `          const correctAnswerTd = document.createElement('td');\n`;
    code += `          correctAnswerTd.innerHTML = '<span class="correct">' + correctAnswers[index] + '</span>';\n`;
    code += `          tr.appendChild(correctAnswerTd);\n`;
    code += `          if (userAnswer === correctAnswers[index]) score += 2;\n`;
    code += `          comparisonBody.appendChild(tr);\n`;
    code += `        });\n`;
    code += `        if (totalScoreEl) {\n`;
    code += `          totalScoreEl.textContent = 'Total Score: ' + score + ' / ' + (questions5.length * 2);\n`;
    code += `        }\n`;
    code += `        const resultModalElement = document.getElementById('resultModal');\n`;
    code += `        if (resultModalElement) {\n`;
    code += `          // Remove any existing backdrop first\n`;
    code += `          const existingBackdrop = document.querySelector('.modal-backdrop');\n`;
    code += `          if (existingBackdrop) {\n`;
    code += `            existingBackdrop.remove();\n`;
    code += `            document.body.classList.remove('modal-open');\n`;
    code += `            document.body.style.overflow = '';\n`;
    code += `            document.body.style.paddingRight = '';\n`;
    code += `          }\n`;
    code += `          const modal = new bootstrap.Modal(resultModalElement);\n`;
    code += `          modal.show();\n`;
    code += `          // Clean up backdrop when modal is hidden\n`;
    code += `          resultModalElement.addEventListener('hidden.bs.modal', function() {\n`;
    code += `            const backdrop = document.querySelector('.modal-backdrop');\n`;
    code += `            if (backdrop) {\n`;
    code += `              backdrop.remove();\n`;
    code += `            }\n`;
    code += `            document.body.classList.remove('modal-open');\n`;
    code += `            document.body.style.overflow = '';\n`;
    code += `            document.body.style.paddingRight = '';\n`;
    code += `          }, { once: true });\n`;
    code += `        }\n`;
    code += `      }\n`;
    code += `    });\n`;
    code += `  }\n`;
    code += `  \n`;
    code += `  // Next button\n`;
    code += `  const nextButton = document.getElementById('nextButton');\n`;
    code += `  if (nextButton) {\n`;
    code += `    nextButton.addEventListener('click', function() {\n`;
    code += `      if (currentQuestion < options.length - 1) {\n`;
    code += `        currentQuestion++;\n`;
    code += `        const container = document.getElementById('question5-container');\n`;
    code += `        if (container) container.innerHTML = '';\n`;
    code += `        renderQuestion5(options[currentQuestion], paragraph_question5[currentQuestion], meohoc[currentQuestion] || ['', '']);\n`;
    code += `        const backButton = document.getElementById('backButton');\n`;
    code += `        if (backButton) backButton.textContent = 'Back';\n`;
    code += `      } else {\n`;
    code += `        nextButton.textContent = 'The end';\n`;
    code += `      }\n`;
    code += `    });\n`;
    code += `  }\n`;
    code += `  \n`;
    code += `  // Back button\n`;
    code += `  const backButton = document.getElementById('backButton');\n`;
    code += `  if (backButton) {\n`;
    code += `    backButton.addEventListener('click', function() {\n`;
    code += `      if (currentQuestion > 0) {\n`;
    code += `        currentQuestion--;\n`;
    code += `        const container = document.getElementById('question5-container');\n`;
    code += `        if (container) container.innerHTML = '';\n`;
    code += `        renderQuestion5(options[currentQuestion], paragraph_question5[currentQuestion], meohoc[currentQuestion] || ['', '']);\n`;
    code += `        const nextButton = document.getElementById('nextButton');\n`;
    code += `        if (nextButton) nextButton.textContent = 'Next';\n`;
    code += `      }\n`;
    code += `    });\n`;
    code += `  }\n`;
    code += `  \n`;
    code += `  buttonsSetup = true;\n`;
    code += `  console.log('Part 5 buttons setup completed');\n`;
    code += `}\n\n`;
    code += `// Expose setupPart5Buttons to window\n`;
    code += `window.setupPart5Buttons = setupPart5Buttons;\n\n`;
    code += `// Initialize on load\n`;
    code += `if (document.readyState === 'loading') {\n`;
    code += `  document.addEventListener('DOMContentLoaded', function() {\n`;
    code += `    if (options && options.length > 0 && paragraph_question5 && paragraph_question5.length > 0 && meohoc && meohoc.length > 0) {\n`;
    code += `      renderQuestion5(options[0], paragraph_question5[0], meohoc[0] || ['', '']);\n`;
    code += `      setupPart5Buttons();\n`;
    code += `    }\n`;
    code += `  });\n`;
    code += `} else {\n`;
    code += `  if (options && options.length > 0 && paragraph_question5 && paragraph_question5.length > 0 && meohoc && meohoc.length > 0) {\n`;
    code += `    renderQuestion5(options[0], paragraph_question5[0], meohoc[0] || ['', '']);\n`;
    code += `    setupPart5Buttons();\n`;
    code += `  }\n`;
    code += `}\n\n`;
    
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

async function fetchLessonScript(filePath) {
    if (!filePath) {
        return null;
    }
    let headers = {};
    try {
        headers = window.buildAuthorizedHeaders();
    } catch (error) {
        if (error.message === 'AUTH_TOKEN_MISSING') {
            throw error;
        }
    }
    
    const response = await fetch(`/api/lessons/get-script?filePath=${encodeURIComponent(filePath)}`, {
        headers
    });
    
    if (!response.ok) {
        console.warn('Không thể tải file script từ GitHub:', await response.text());
        return null;
    }
    
    return await response.text();
}

function extractLessonDataFromScript(scriptContent) {
    if (!scriptContent) return null;
    const match = scriptContent.match(/MINI_HIPPO_LESSON_DATA_START\s*([\s\S]*?)\s*MINI_HIPPO_LESSON_DATA_END/);
    if (!match || !match[1]) {
        return null;
    }
    try {
        return JSON.parse(match[1]);
    } catch (error) {
        console.error('Không thể parse dữ liệu bài học:', error);
        return null;
    }
}

function normalizeListeningPart(part) {
    if (!part) return null;
    if (part.startsWith('listening_')) {
        return part.replace('listening_', '');
    }
    return part;
}

function applyLessonDataToEditor(data, fallbackPart) {
    if (!data || !Array.isArray(data.sets)) {
        return false;
    }
    
    const lessonType = data.lessonType || 'reading';
    
    if (lessonType === 'listening') {
        const listeningPart = normalizeListeningPart(data.part || fallbackPart);
        if (!listeningPart) {
            return false;
        }
        
        const listeningSelector = document.getElementById('typeListening');
        if (listeningSelector && !listeningSelector.checked) {
            listeningSelector.checked = true;
            listeningSelector.dispatchEvent(new Event('change'));
        }
        
        window.currentLessonType = 'listening';
        window.currentListeningPart = listeningPart;
        window.listeningQuestionSets[listeningPart] = data.sets;
        
        if (typeof renderListeningQuestionSets === 'function') {
            renderListeningQuestionSets(listeningPart);
        }
        return true;
    }
    
    const partValue = data.part || fallbackPart;
    const numericPart = parseInt(partValue, 10);
    if (Number.isNaN(numericPart)) {
        return false;
    }
    
    const readingSelector = document.getElementById('typeReading');
    if (readingSelector && !readingSelector.checked) {
        readingSelector.checked = true;
        readingSelector.dispatchEvent(new Event('change'));
    }
    
    window.currentLessonType = 'reading';
    questionSets[numericPart] = (data.sets || []).map((set, index) => ({
        id: set.id || index + 1,
        title: set.title || `Bộ đề ${index + 1}`,
        data: set.data || {}
    }));
    
    if (typeof switchPart === 'function') {
        switchPart(numericPart);
    } else {
        window.currentPart = numericPart;
    }
    
    renderQuestionSets(numericPart);
    return true;
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
    // Check if listening or reading
    const currentLessonType = window.currentLessonType || 'reading';
    
    if (currentLessonType === 'listening') {
        // Use listening preview function
        if (window.previewListeningLessonInterface) {
            return window.previewListeningLessonInterface();
        } else {
            alert('Listening preview function chưa được load. Vui lòng refresh trang.');
            return;
        }
    }
    
    // Reading preview logic
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

