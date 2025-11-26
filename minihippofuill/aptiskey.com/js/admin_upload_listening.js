// Admin Upload Script for Listening Lessons
// Handles all listening parts: Question 1-13, 14, 15, 16-17

// Global variables
window.currentLessonType = 'reading'; // 'reading' or 'listening'
window.currentListeningPart = '14'; // '1_13', '14', '15', '16_17'
window.listeningQuestionSets = window.listeningQuestionSets || {
    '1_13': [],
    '14': [],
    '15': [],
    '16_17': []
};
window.currentListeningSetIndex = null;
window.currentListeningSetPart = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin upload listening initialized');
    
    // Setup type selector (Reading/Listening)
    setupTypeSelector();
    
    // Setup listening part selector
    setupListeningPartSelector();
    
    // Setup audio upload listeners
    setupAudioUploadListeners();
    
    // Render initial state
    renderListeningQuestionSets('14');
});

// Setup audio upload event listeners
function setupAudioUploadListeners() {
    // Question 14 audio
    const audio14 = document.getElementById('listening-part14-audio');
    if (audio14) {
        audio14.addEventListener('change', async function() {
            if (this.files && this.files[0]) {
                const preview = document.getElementById('listening-part14-audio-preview');
                if (preview) {
                    preview.innerHTML = '<div class="alert alert-info">Đang upload audio...</div>';
                }
                const audioUrl = await handleAudioUpload('14', this);
                if (audioUrl && preview) {
                    preview.innerHTML = `<div class="alert alert-success">Upload thành công!<br><audio controls src="${audioUrl}" style="width: 100%; margin-top: 10px;"></audio></div>`;
                    // Store audio URL in a hidden field or data attribute
                    this.dataset.audioUrl = audioUrl;
                } else if (preview) {
                    preview.innerHTML = '<div class="alert alert-danger">Upload thất bại!</div>';
                }
            }
        });
    }
    
    // Question 15 audio
    const audio15 = document.getElementById('listening-part15-audio');
    if (audio15) {
        audio15.addEventListener('change', async function() {
            if (this.files && this.files[0]) {
                const preview = document.getElementById('listening-part15-audio-preview');
                if (preview) {
                    preview.innerHTML = '<div class="alert alert-info">Đang upload audio...</div>';
                }
                const audioUrl = await handleAudioUpload('15', this);
                if (audioUrl && preview) {
                    preview.innerHTML = `<div class="alert alert-success">Upload thành công!<br><audio controls src="${audioUrl}" style="width: 100%; margin-top: 10px;"></audio></div>`;
                    this.dataset.audioUrl = audioUrl;
                } else if (preview) {
                    preview.innerHTML = '<div class="alert alert-danger">Upload thất bại!</div>';
                }
            }
        });
    }
    
    // Question 16 audio
    const audio16 = document.getElementById('listening-part16-audio');
    if (audio16) {
        audio16.addEventListener('change', async function() {
            if (this.files && this.files[0]) {
                const preview = document.getElementById('listening-part16-audio-preview');
                if (preview) {
                    preview.innerHTML = '<div class="alert alert-info">Đang upload audio...</div>';
                }
                const audioUrl = await handleAudioUpload('16_17', this, 16);
                if (audioUrl && preview) {
                    preview.innerHTML = `<div class="alert alert-success">Upload thành công!<br><audio controls src="${audioUrl}" style="width: 100%; margin-top: 10px;"></audio></div>`;
                    this.dataset.audioUrl = audioUrl;
                } else if (preview) {
                    preview.innerHTML = '<div class="alert alert-danger">Upload thất bại!</div>';
                }
            }
        });
    }
    
    // Question 17 audio
    const audio17 = document.getElementById('listening-part17-audio');
    if (audio17) {
        audio17.addEventListener('change', async function() {
            if (this.files && this.files[0]) {
                const preview = document.getElementById('listening-part17-audio-preview');
                if (preview) {
                    preview.innerHTML = '<div class="alert alert-info">Đang upload audio...</div>';
                }
                const audioUrl = await handleAudioUpload('16_17', this, 17);
                if (audioUrl && preview) {
                    preview.innerHTML = `<div class="alert alert-success">Upload thành công!<br><audio controls src="${audioUrl}" style="width: 100%; margin-top: 10px;"></audio></div>`;
                    this.dataset.audioUrl = audioUrl;
                } else if (preview) {
                    preview.innerHTML = '<div class="alert alert-danger">Upload thất bại!</div>';
                }
            }
        });
    }
}

// Setup type selector (Reading/Listening)
function setupTypeSelector() {
    const typeSelectors = document.querySelectorAll('input[name="typeSelect"]');
    console.log('Setting up type selector, found', typeSelectors.length, 'selectors');
    
    if (typeSelectors.length === 0) {
        console.error('No type selectors found!');
        return;
    }
    
    typeSelectors.forEach(selector => {
        // Remove existing listeners to avoid duplicates
        const newSelector = selector.cloneNode(true);
        selector.parentNode.replaceChild(newSelector, selector);
        
        newSelector.addEventListener('change', function() {
            console.log('Type selector changed to:', this.value);
            window.currentLessonType = this.value;
            
            const readingPartSelector = document.getElementById('reading-part-selector');
            const listeningPartSelector = document.getElementById('listening-part-selector');
            
            if (this.value === 'reading') {
                console.log('Switching to Reading mode');
                if (readingPartSelector) readingPartSelector.style.display = 'block';
                if (listeningPartSelector) listeningPartSelector.style.display = 'none';
                // Hide all listening forms
                document.querySelectorAll('[id^="listening-part"]').forEach(form => {
                    if (form.id.endsWith('-form')) {
                        form.style.display = 'none';
                    }
                });
                // Show reading forms (handled by admin_upload.js)
            } else if (this.value === 'listening') {
                console.log('Switching to Listening mode');
                if (readingPartSelector) readingPartSelector.style.display = 'none';
                if (listeningPartSelector) listeningPartSelector.style.display = 'block';
                // Hide all reading forms
                document.querySelectorAll('[id^="part"]').forEach(form => {
                    if (form.id.endsWith('-form') && !form.id.includes('listening')) {
                        form.style.display = 'none';
                    }
                });
                // Show first listening form
                switchListeningPart('14');
            }
        });
        
        // Trigger change event if already selected
        if (newSelector.checked) {
            console.log('Type selector already checked:', newSelector.value);
            newSelector.dispatchEvent(new Event('change'));
        }
    });
    
    // Set initial state
    const checkedSelector = document.querySelector('input[name="typeSelect"]:checked');
    if (checkedSelector) {
        console.log('Initial type selector value:', checkedSelector.value);
        window.currentLessonType = checkedSelector.value;
        if (checkedSelector.value === 'reading') {
            const readingPartSelector = document.getElementById('reading-part-selector');
            const listeningPartSelector = document.getElementById('listening-part-selector');
            if (readingPartSelector) readingPartSelector.style.display = 'block';
            if (listeningPartSelector) listeningPartSelector.style.display = 'none';
        } else if (checkedSelector.value === 'listening') {
            const readingPartSelector = document.getElementById('reading-part-selector');
            const listeningPartSelector = document.getElementById('listening-part-selector');
            if (readingPartSelector) readingPartSelector.style.display = 'none';
            if (listeningPartSelector) listeningPartSelector.style.display = 'block';
            switchListeningPart('14');
        }
    }
}

// Setup listening part selector
function setupListeningPartSelector() {
    const partSelectors = document.querySelectorAll('input[name="listeningPartSelect"]');
    partSelectors.forEach(selector => {
        selector.addEventListener('change', function() {
            switchListeningPart(this.value);
        });
    });
}

// Switch listening part
function switchListeningPart(part) {
    window.currentListeningPart = part;
    
    // Hide all listening forms
    document.querySelectorAll('[id^="listening-part"]').forEach(form => {
        if (form.id.endsWith('-form')) {
            form.style.display = 'none';
        }
    });
    
    // Show selected form
    const formId = `listening-part${part}-form`;
    const form = document.getElementById(formId);
    if (form) {
        form.style.display = 'block';
    }
    
    // Initialize form fields if empty (for direct input forms)
    if (part === '1_13') {
        const container = document.getElementById('listening-part1_13-questions-container');
        if (container && container.children.length === 0) {
            addListeningQuestion1_13();
        }
    } else if (part === '14') {
        const container = document.getElementById('listening-part14-options-container');
        if (container && container.children.length === 0) {
            for (let i = 0; i < 6; i++) {
                addListeningQuestion14Option();
            }
        }
    } else if (part === '15') {
        const questionsContainer = document.getElementById('listening-part15-questions-container');
        if (questionsContainer && questionsContainer.children.length === 0) {
            for (let i = 0; i < 4; i++) {
                addListeningQuestion15Question();
            }
        }
    } else if (part === '16_17') {
        const container16 = document.getElementById('listening-part16-questions-container');
        const container17 = document.getElementById('listening-part17-questions-container');
        if (container16 && container16.children.length === 0) {
            addListeningQuestion16Question();
            addListeningQuestion16Question();
        }
        if (container17 && container17.children.length === 0) {
            addListeningQuestion17Question();
            addListeningQuestion17Question();
        }
    }
    
    // Render question sets for this part
    renderListeningQuestionSets(part);
}

// Render question sets for a part
function renderListeningQuestionSets(part) {
    const containerId = `listening-part${part}-sets-container`;
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const sets = window.listeningQuestionSets[part] || [];
    
    if (sets.length === 0) {
        container.innerHTML = '<p class="text-muted">Chưa có bộ đề nào. Nhấn "Thêm bộ đề mới" để bắt đầu.</p>';
        return;
    }
    
    container.innerHTML = sets.map((set, index) => {
        const title = set.title || `Bộ đề ${index + 1}`;
        return `
            <div class="card mb-3 question-set-item">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h6 class="mb-0">${title}</h6>
                    <div>
                        <button class="btn btn-sm btn-primary me-2" onclick="editListeningSet('${part}', ${index})">
                            <i class="bi bi-pencil"></i> Sửa
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteListeningSet('${part}', ${index})">
                            <i class="bi bi-trash"></i> Xóa
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Add new question set
function addListeningQuestionSet(part) {
    window.currentListeningSetPart = part;
    window.currentListeningSetIndex = null;
    
    // Clear form
    clearListeningForm(part);
    
    // Show edit form
    const editFormId = `listening-part${part}-edit-form`;
    const editForm = document.getElementById(editFormId);
    if (editForm) {
        editForm.style.display = 'block';
    }
    
    // Initialize form based on part
    initializeListeningForm(part);
}

// Initialize form based on part
function initializeListeningForm(part) {
    if (part === '1_13') {
        // Add first question
        addListeningQuestion1_13();
    } else if (part === '14') {
        // Add 6 options
        for (let i = 0; i < 6; i++) {
            addListeningQuestion14Option();
        }
    } else if (part === '15') {
        // Add 4 questions
        for (let i = 0; i < 4; i++) {
            addListeningQuestion15Question();
        }
    } else if (part === '16_17') {
        // Add 2 questions for each
        addListeningQuestion16Question();
        addListeningQuestion16Question();
        addListeningQuestion17Question();
        addListeningQuestion17Question();
    }
}

// Clear form
function clearListeningForm(part) {
    const formId = `listening-part${part}-edit-form`;
    const form = document.getElementById(formId);
    if (!form) return;
    
    // Clear all inputs
    form.querySelectorAll('input[type="text"], input[type="file"], textarea').forEach(input => {
        if (input.type === 'file') {
            input.value = '';
        } else {
            input.value = '';
        }
    });
    
    // Clear containers
    const containers = form.querySelectorAll('[id$="-container"]');
    containers.forEach(container => {
        container.innerHTML = '';
    });
}

// Cancel edit
function cancelListeningEdit(part) {
    const editFormId = `listening-part${part}-edit-form`;
    const editForm = document.getElementById(editFormId);
    if (editForm) {
        editForm.style.display = 'none';
    }
    window.currentListeningSetIndex = null;
    window.currentListeningSetPart = null;
}

// Edit existing set
function editListeningSet(part, index) {
    window.currentListeningSetPart = part;
    window.currentListeningSetIndex = index;
    
    const sets = window.listeningQuestionSets[part] || [];
    const set = sets[index];
    if (!set) return;
    
    // Load data into form
    loadListeningSetIntoForm(part, set);
    
    // Show edit form
    const editFormId = `listening-part${part}-edit-form`;
    const editForm = document.getElementById(editFormId);
    if (editForm) {
        editForm.style.display = 'block';
    }
}

// Load set data into form
function loadListeningSetIntoForm(part, set) {
    if (part === '1_13') {
        loadListeningSet1_13(set);
    } else if (part === '14') {
        loadListeningSet14(set);
    } else if (part === '15') {
        loadListeningSet15(set);
    } else if (part === '16_17') {
        loadListeningSet16_17(set);
    }
}

function loadListeningSet1_13(set) {
    document.getElementById('listening-part1_13-title').value = set.title || '';
    
    const container = document.getElementById('listening-part1_13-questions-container');
    container.innerHTML = '';
    
    if (set.questions && set.questions.length > 0) {
        set.questions.forEach((q, index) => {
            addListeningQuestion1_13();
            const questionItem = container.children[index];
            if (questionItem) {
                questionItem.querySelector('[data-field="heading"]').value = q.heading || '';
                questionItem.querySelector('[data-field="question"]').value = q.question || '';
                questionItem.querySelector('[data-field="option1"]').value = q.options[0] || '';
                questionItem.querySelector('[data-field="option2"]').value = q.options[1] || '';
                questionItem.querySelector('[data-field="option3"]').value = q.options[2] || '';
                // Set correct answer - it should match one of the options
                const correctAnswerInput = questionItem.querySelector('[data-field="correctAnswer"]');
                if (correctAnswerInput) {
                    correctAnswerInput.value = q.correctAnswer || '';
                }
                questionItem.querySelector('[data-field="transcript"]').value = q.transcript || '';
            }
        });
    }
}

function loadListeningSet14(set) {
    document.getElementById('listening-part14-title').value = set.title || '';
    document.getElementById('listening-part14-topic').value = set.topic || '';
    document.getElementById('listening-part14-transcript').value = set.transcript || '';
    
    // Set audio URL if available
    const audioInput = document.getElementById('listening-part14-audio');
    if (audioInput && set.audioUrl) {
        audioInput.dataset.audioUrl = set.audioUrl;
        const preview = document.getElementById('listening-part14-audio-preview');
        if (preview) {
            preview.innerHTML = `<div class="alert alert-info">Audio đã được upload<br><audio controls src="${set.audioUrl}" style="width: 100%; margin-top: 10px;"></audio></div>`;
        }
    }
    
    const container = document.getElementById('listening-part14-options-container');
    container.innerHTML = '';
    
    if (set.options && set.options.length > 0) {
        set.options.forEach((opt, index) => {
            addListeningQuestion14Option();
            const optionInput = container.children[index].querySelector('input');
            if (optionInput) {
                optionInput.value = opt;
            }
        });
    }
}

function loadListeningSet15(set) {
    document.getElementById('listening-part15-title').value = set.title || '';
    document.getElementById('listening-part15-topic').value = set.topic || '';
    document.getElementById('listening-part15-transcript').value = set.transcript || '';
    
    // Set audio URL if available
    const audioInput = document.getElementById('listening-part15-audio');
    if (audioInput && set.audioUrl) {
        audioInput.dataset.audioUrl = set.audioUrl;
        const preview = document.getElementById('listening-part15-audio-preview');
        if (preview) {
            preview.innerHTML = `<div class="alert alert-info">Audio đã được upload<br><audio controls src="${set.audioUrl}" style="width: 100%; margin-top: 10px;"></audio></div>`;
        }
    }
    
    const questionsContainer = document.getElementById('listening-part15-questions-container');
    const answersContainer = document.getElementById('listening-part15-answers-container');
    questionsContainer.innerHTML = '';
    answersContainer.innerHTML = '';
    
    if (set.questions && set.questions.length > 0) {
        set.questions.forEach((q, index) => {
            addListeningQuestion15Question();
            const questionInput = questionsContainer.children[index].querySelector('input');
            const answerSelect = answersContainer.children[index].querySelector('select');
            if (questionInput) questionInput.value = q;
            if (answerSelect && set.correctAnswer && set.correctAnswer[index]) {
                answerSelect.value = set.correctAnswer[index];
            }
        });
    }
}

function loadListeningSet16_17(set) {
    document.getElementById('listening-part16_17-title').value = set.title || '';
    
    // Question 16
    if (set.question16) {
        document.getElementById('listening-part16-topic').value = set.question16.topic || '';
        document.getElementById('listening-part16-transcript').value = set.question16.transcript || '';
        
        // Set audio URL if available
        const audio16Input = document.getElementById('listening-part16-audio');
        if (audio16Input && set.question16.audioUrl) {
            audio16Input.dataset.audioUrl = set.question16.audioUrl;
            const preview = document.getElementById('listening-part16-audio-preview');
            if (preview && set.question16.audioUrl !== 'audio/question16/no_audio.mp3') {
                preview.innerHTML = `<div class="alert alert-info">Audio đã được upload<br><audio controls src="${set.question16.audioUrl}" style="width: 100%; margin-top: 10px;"></audio></div>`;
            }
        }
        
        const container16 = document.getElementById('listening-part16-questions-container');
        container16.innerHTML = '';
        
        if (set.question16.questions && set.question16.questions.length > 0) {
            set.question16.questions.forEach((q) => {
                addListeningQuestion16Question();
                const questionItem = container16.children[container16.children.length - 1];
                if (questionItem) {
                    questionItem.querySelector('[data-field="id"]').value = q.id || '';
                    questionItem.querySelector('[data-field="question"]').value = q.question || '';
                    questionItem.querySelector('[data-field="option1"]').value = q.options[0] || '';
                    questionItem.querySelector('[data-field="option2"]').value = q.options[1] || '';
                    questionItem.querySelector('[data-field="option3"]').value = q.options[2] || '';
                }
            });
        }
    }
    
    // Question 17
    if (set.question17) {
        document.getElementById('listening-part17-topic').value = set.question17.topic || '';
        document.getElementById('listening-part17-transcript').value = set.question17.transcript || '';
        
        // Set audio URL if available
        const audio17Input = document.getElementById('listening-part17-audio');
        if (audio17Input && set.question17.audioUrl) {
            audio17Input.dataset.audioUrl = set.question17.audioUrl;
            const preview = document.getElementById('listening-part17-audio-preview');
            if (preview && set.question17.audioUrl !== 'audio/question17/no_audio.mp3') {
                preview.innerHTML = `<div class="alert alert-info">Audio đã được upload<br><audio controls src="${set.question17.audioUrl}" style="width: 100%; margin-top: 10px;"></audio></div>`;
            }
        }
        
        const container17 = document.getElementById('listening-part17-questions-container');
        container17.innerHTML = '';
        
        if (set.question17.questions && set.question17.questions.length > 0) {
            set.question17.questions.forEach((q) => {
                addListeningQuestion17Question();
                const questionItem = container17.children[container17.children.length - 1];
                if (questionItem) {
                    questionItem.querySelector('[data-field="id"]').value = q.id || '';
                    questionItem.querySelector('[data-field="question"]').value = q.question || '';
                    questionItem.querySelector('[data-field="option1"]').value = q.options[0] || '';
                    questionItem.querySelector('[data-field="option2"]').value = q.options[1] || '';
                    questionItem.querySelector('[data-field="option3"]').value = q.options[2] || '';
                }
            });
        }
    }
}

// Delete set
function deleteListeningSet(part, index) {
    if (!confirm('Bạn có chắc muốn xóa bộ đề này?')) return;
    
    const sets = window.listeningQuestionSets[part] || [];
    sets.splice(index, 1);
    
    renderListeningQuestionSets(part);
}

// Save current set
function saveListeningCurrentSet(part) {
    const set = collectListeningSetData(part);
    if (!set) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    const sets = window.listeningQuestionSets[part] || [];
    
    if (window.currentListeningSetIndex !== null && window.currentListeningSetIndex >= 0) {
        // Update existing
        sets[window.currentListeningSetIndex] = set;
    } else {
        // Add new
        sets.push(set);
    }
    
    window.listeningQuestionSets[part] = sets;
    
    // Hide form
    cancelListeningEdit(part);
    
    // Re-render
    renderListeningQuestionSets(part);
}

// Collect set data from form
function collectListeningSetData(part) {
    if (part === '1_13') {
        return collectListeningSet1_13();
    } else if (part === '14') {
        return collectListeningSet14();
    } else if (part === '15') {
        return collectListeningSet15();
    } else if (part === '16_17') {
        return collectListeningSet16_17();
    }
    return null;
}

function collectListeningSet1_13() {
    const title = document.getElementById('listening-part1_13-title').value.trim();
    if (!title) {
        alert('Vui lòng nhập tiêu đề bộ đề!');
        return null;
    }
    
    const container = document.getElementById('listening-part1_13-questions-container');
    const questions = [];
    
    container.querySelectorAll('.question-item').forEach((item, index) => {
        const heading = item.querySelector('[data-field="heading"]').value.trim();
        const question = item.querySelector('[data-field="question"]').value.trim();
        const option1 = item.querySelector('[data-field="option1"]').value.trim();
        const option2 = item.querySelector('[data-field="option2"]').value.trim();
        const option3 = item.querySelector('[data-field="option3"]').value.trim();
        const correctAnswerField = item.querySelector('[data-field="correctAnswer"]').value;
        const transcript = item.querySelector('[data-field="transcript"]').value.trim();
        
        if (!question || !option1 || !option2 || !option3 || !correctAnswerField) {
            return; // Skip incomplete questions
        }
        
        // Get correct answer text - correctAnswerField contains the option value (e.g., "Furniture")
        // We need to find which option matches
        let correctAnswer = '';
        if (correctAnswerField === option1) correctAnswer = option1;
        else if (correctAnswerField === option2) correctAnswer = option2;
        else if (correctAnswerField === option3) correctAnswer = option3;
        else {
            // Fallback: use the field value directly if it doesn't match any option
            correctAnswer = correctAnswerField;
        }
        
        // Get audio URL if uploaded
        const audioInput = item.querySelector('[data-field="audio"]');
        let audioUrl = audioInput?.dataset.audioUrl || `audio/question1_13/audio_q${index + 1}.mp3`;
        
        // If audioUrl is a local path but we have a GitHub raw URL in dataset, use the raw URL
        if (audioUrl.startsWith('audio/') && audioInput?.dataset.audioUrl && audioInput.dataset.audioUrl.startsWith('http')) {
            audioUrl = audioInput.dataset.audioUrl;
        }
        
        questions.push({
            heading: heading || `Question ${index + 1} of 17`,
            audioUrl: audioUrl,
            question: question,
            options: [option1, option2, option3],
            correctAnswer: correctAnswer,
            transcript: transcript
        });
    });
    
    if (questions.length === 0) {
        alert('Vui lòng thêm ít nhất 1 câu hỏi!');
        return null;
    }
    
    return {
        title: title,
        part: '1_13',
        questions: questions
    };
}

function collectListeningSet14() {
    const title = document.getElementById('listening-part14-title').value.trim();
    const topic = document.getElementById('listening-part14-topic').value.trim();
    const transcript = document.getElementById('listening-part14-transcript').value.trim();
    
    if (!title || !topic || !transcript) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return null;
    }
    
    const container = document.getElementById('listening-part14-options-container');
    const options = [];
    
    container.querySelectorAll('input[data-field^="option"]').forEach(input => {
        const value = input.value.trim();
        if (value) {
            options.push(value);
        }
    });
    
    if (options.length < 6) {
        alert('Vui lòng thêm đủ 6 options!');
        return null;
    }
    
    // Get audio URL if uploaded
    const audioInput = document.getElementById('listening-part14-audio');
    const audioUrl = audioInput?.dataset.audioUrl || `audio/question14/audio_${Date.now()}.mp3`;
    
    return {
        title: title,
        part: '14',
        topic: topic,
        audioUrl: audioUrl,
        options: options,
        transcript: transcript
    };
}

function collectListeningSet15() {
    const title = document.getElementById('listening-part15-title').value.trim();
    const topic = document.getElementById('listening-part15-topic').value.trim();
    const transcript = document.getElementById('listening-part15-transcript').value.trim();
    
    if (!title || !topic || !transcript) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return null;
    }
    
    const questionsContainer = document.getElementById('listening-part15-questions-container');
    const answersContainer = document.getElementById('listening-part15-answers-container');
    
    const questions = [];
    const correctAnswer = [];
    
    questionsContainer.querySelectorAll('input[data-field^="question"]').forEach((input, index) => {
        const question = input.value.trim();
        if (question) {
            questions.push(question);
        }
    });
    
    answersContainer.querySelectorAll('select[data-field^="answer"]').forEach((select, index) => {
        const answer = select.value;
        if (answer) {
            correctAnswer.push(answer);
        }
    });
    
    if (questions.length !== 4 || correctAnswer.length !== 4) {
        alert('Vui lòng thêm đủ 4 câu hỏi và 4 đáp án!');
        return null;
    }
    
    // Get audio URL if uploaded
    const audioInput = document.getElementById('listening-part15-audio');
    const audioUrl = audioInput?.dataset.audioUrl || `audio/question15/audio_${Date.now()}.mp3`;
    
    return {
        title: title,
        part: '15',
        topic: topic,
        audioUrl: audioUrl,
        questions: questions,
        correctAnswer: correctAnswer,
        transcript: transcript
    };
}

function collectListeningSet16_17() {
    const title = document.getElementById('listening-part16_17-title').value.trim();
    if (!title) {
        alert('Vui lòng nhập tiêu đề bộ đề!');
        return null;
    }
    
    // Question 16
    const topic16 = document.getElementById('listening-part16-topic').value.trim();
    const transcript16 = document.getElementById('listening-part16-transcript').value.trim();
    const container16 = document.getElementById('listening-part16-questions-container');
    
    const questions16 = [];
    container16.querySelectorAll('.question-item').forEach(item => {
        const id = item.querySelector('[data-field="id"]').value.trim();
        const question = item.querySelector('[data-field="question"]').value.trim();
        const option1 = item.querySelector('[data-field="option1"]').value.trim();
        const option2 = item.querySelector('[data-field="option2"]').value.trim();
        const option3 = item.querySelector('[data-field="option3"]').value.trim();
        
        if (id && question && option1 && option2 && option3) {
            questions16.push({
                id: id,
                question: question,
                options: [option1, option2, option3]
            });
        }
    });
    
    // Question 17
    const topic17 = document.getElementById('listening-part17-topic').value.trim();
    const transcript17 = document.getElementById('listening-part17-transcript').value.trim();
    const container17 = document.getElementById('listening-part17-questions-container');
    
    const questions17 = [];
    container17.querySelectorAll('.question-item').forEach(item => {
        const id = item.querySelector('[data-field="id"]').value.trim();
        const question = item.querySelector('[data-field="question"]').value.trim();
        const option1 = item.querySelector('[data-field="option1"]').value.trim();
        const option2 = item.querySelector('[data-field="option2"]').value.trim();
        const option3 = item.querySelector('[data-field="option3"]').value.trim();
        
        if (id && question && option1 && option2 && option3) {
            questions17.push({
                id: id,
                question: question,
                options: [option1, option2, option3]
            });
        }
    });
    
    if (questions16.length < 2 || questions17.length < 2) {
        alert('Vui lòng thêm đủ 2 câu hỏi cho mỗi Question 16 và 17!');
        return null;
    }
    
    // Get audio URLs if uploaded
    const audio16Input = document.getElementById('listening-part16-audio');
    const audio17Input = document.getElementById('listening-part17-audio');
    const audio16Url = audio16Input?.dataset.audioUrl || 'audio/question16/no_audio.mp3';
    const audio17Url = audio17Input?.dataset.audioUrl || 'audio/question17/no_audio.mp3';
    
    return {
        title: title,
        part: '16_17',
        question16: {
            topic: topic16,
            audioUrl: audio16Url,
            questions: questions16,
            transcript: transcript16
        },
        question17: {
            topic: topic17,
            audioUrl: audio17Url,
            questions: questions17,
            transcript: transcript17
        }
    };
}

// ============================================
// Question 1-13 Functions
// ============================================

function addListeningQuestion1_13() {
    const container = document.getElementById('listening-part1_13-questions-container');
    if (!container) return;
    
    const questionCount = container.children.length;
    if (questionCount >= 13) {
        alert('Tối đa 13 câu hỏi!');
        return;
    }
    
    const questionIndex = questionCount + 1;
    const questionHtml = `
        <div class="question-item mb-3" data-question-index="${questionIndex}">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Câu hỏi ${questionIndex}</h6>
                <button type="button" class="btn btn-sm btn-danger" onclick="removeListeningQuestion1_13(this)">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="mb-2">
                <label class="form-label">Heading</label>
                <input type="text" class="form-control" placeholder="Question ${questionIndex} of 17" data-field="heading">
            </div>
            <div class="mb-2">
                <label class="form-label">Upload Audio (MP3)</label>
                <input type="file" class="form-control listening-audio-upload" accept="audio/mpeg,audio/mp3" data-field="audio" data-question-index="${questionIndex}">
                <small class="text-muted">File size tối đa: 10MB</small>
                <div class="listening-audio-preview-${questionIndex} mt-2"></div>
            </div>
            <div class="mb-2">
                <label class="form-label">Question</label>
                <input type="text" class="form-control" placeholder="What is not original?" data-field="question">
            </div>
            <div class="mb-2">
                <label class="form-label">Option 1</label>
                <input type="text" class="form-control" placeholder="Furniture" data-field="option1">
            </div>
            <div class="mb-2">
                <label class="form-label">Option 2</label>
                <input type="text" class="form-control" placeholder="Home" data-field="option2">
            </div>
            <div class="mb-2">
                <label class="form-label">Option 3</label>
                <input type="text" class="form-control" placeholder="Bicycle" data-field="option3">
            </div>
            <div class="mb-2">
                <label class="form-label">Correct Answer</label>
                <input type="text" class="form-control" placeholder="Nhập đáp án đúng (phải khớp với một trong 3 options)" data-field="correctAnswer">
                <small class="text-muted">Đáp án phải khớp chính xác với một trong 3 options phía trên</small>
            </div>
            <div class="mb-2">
                <label class="form-label">Transcript</label>
                <textarea class="form-control" rows="3" placeholder="Welcome! I'm so glad..." data-field="transcript"></textarea>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', questionHtml);
    
    // Setup audio upload listener for this question
    const questionItem = container.lastElementChild;
    const audioInput = questionItem.querySelector('.listening-audio-upload');
    if (audioInput) {
        audioInput.addEventListener('change', async function() {
            if (this.files && this.files[0]) {
                const preview = questionItem.querySelector(`.listening-audio-preview-${questionIndex}`);
                if (preview) {
                    preview.innerHTML = '<div class="alert alert-info">Đang upload audio...</div>';
                }
                const audioUrl = await handleAudioUpload('1_13', this, questionIndex);
                if (audioUrl && preview) {
                    preview.innerHTML = `<div class="alert alert-success">Upload thành công!<br><audio controls src="${audioUrl}" style="width: 100%; margin-top: 10px;"></audio></div>`;
                    this.dataset.audioUrl = audioUrl;
                } else if (preview) {
                    preview.innerHTML = '<div class="alert alert-danger">Upload thất bại!</div>';
                }
            }
        });
    }
}

function removeListeningQuestion1_13(button) {
    const questionItem = button.closest('.question-item');
    if (questionItem) {
        questionItem.remove();
    }
}

// ============================================
// Question 14 Functions
// ============================================

function addListeningQuestion14Option() {
    const container = document.getElementById('listening-part14-options-container');
    if (!container) return;
    
    const optionCount = container.children.length;
    if (optionCount >= 6) {
        alert('Tối đa 6 options!');
        return;
    }
    
    const optionIndex = optionCount + 1;
    const isCorrect = optionIndex <= 4; // First 4 are correct
    
    const optionHtml = `
        <div class="mb-2 d-flex align-items-center gap-2">
            <input type="text" class="form-control" placeholder="Option ${optionIndex}" data-field="option${optionIndex}" data-is-correct="${isCorrect}">
            ${isCorrect ? '<span class="badge bg-success">Đáp án đúng</span>' : ''}
            <button type="button" class="btn btn-sm btn-danger" onclick="removeListeningQuestion14Option(this)">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', optionHtml);
}

function removeListeningQuestion14Option(button) {
    const optionItem = button.closest('.mb-2');
    if (optionItem) {
        optionItem.remove();
    }
}

// ============================================
// Question 15 Functions
// ============================================

function addListeningQuestion15Question() {
    const container = document.getElementById('listening-part15-questions-container');
    if (!container) return;
    
    const questionCount = container.children.length;
    if (questionCount >= 4) {
        alert('Tối đa 4 câu hỏi!');
        return;
    }
    
    const questionIndex = questionCount + 1;
    const questionHtml = `
        <div class="mb-3" data-question-index="${questionIndex}">
            <label class="form-label">Câu hỏi ${questionIndex}</label>
            <input type="text" class="form-control" placeholder="1. Continuity is important when planning a career" data-field="question${questionIndex}">
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', questionHtml);
    
    // Add corresponding answer select
    const answersContainer = document.getElementById('listening-part15-answers-container');
    if (answersContainer) {
        const answerHtml = `
            <div class="mb-2" data-answer-index="${questionIndex}">
                <label class="form-label">Đáp án câu ${questionIndex}</label>
                <select class="form-select" data-field="answer${questionIndex}">
                    <option value="">-- Chọn đáp án --</option>
                    <option value="Man">Man</option>
                    <option value="Woman">Woman</option>
                    <option value="Both">Both</option>
                </select>
            </div>
        `;
        answersContainer.insertAdjacentHTML('beforeend', answerHtml);
    }
}

// ============================================
// Question 16-17 Functions
// ============================================

function addListeningQuestion16Question() {
    const container = document.getElementById('listening-part16-questions-container');
    if (!container) return;
    
    const questionCount = container.children.length;
    if (questionCount >= 2) {
        alert('Tối đa 2 câu hỏi cho Question 16!');
        return;
    }
    
    const questionIndex = questionCount + 1;
    const questionHtml = `
        <div class="question-item mb-3" data-question-index="${questionIndex}">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Câu hỏi 16.${questionIndex}</h6>
                <button type="button" class="btn btn-sm btn-danger" onclick="removeListeningQuestion16Question(this)">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="mb-2">
                <label class="form-label">Question ID</label>
                <input type="text" class="form-control" value="16.${questionIndex}" data-field="id" readonly>
            </div>
            <div class="mb-2">
                <label class="form-label">Question</label>
                <input type="text" class="form-control" placeholder="Why hasn't he gone to college?" data-field="question">
            </div>
            <div class="mb-2">
                <label class="form-label">Option 1 (Đáp án đúng)</label>
                <input type="text" class="form-control" placeholder="He wasn't ready..." data-field="option1">
            </div>
            <div class="mb-2">
                <label class="form-label">Option 2</label>
                <input type="text" class="form-control" placeholder="He couldn't afford..." data-field="option2">
            </div>
            <div class="mb-2">
                <label class="form-label">Option 3</label>
                <input type="text" class="form-control" placeholder="He didn't get..." data-field="option3">
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', questionHtml);
}

function removeListeningQuestion16Question(button) {
    const questionItem = button.closest('.question-item');
    if (questionItem) {
        questionItem.remove();
    }
}

function addListeningQuestion17Question() {
    const container = document.getElementById('listening-part17-questions-container');
    if (!container) return;
    
    const questionCount = container.children.length;
    if (questionCount >= 2) {
        alert('Tối đa 2 câu hỏi cho Question 17!');
        return;
    }
    
    const questionIndex = questionCount + 1;
    const questionHtml = `
        <div class="question-item mb-3" data-question-index="${questionIndex}">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Câu hỏi 17.${questionIndex}</h6>
                <button type="button" class="btn btn-sm btn-danger" onclick="removeListeningQuestion17Question(this)">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="mb-2">
                <label class="form-label">Question ID</label>
                <input type="text" class="form-control" value="17.${questionIndex}" data-field="id" readonly>
            </div>
            <div class="mb-2">
                <label class="form-label">Question</label>
                <input type="text" class="form-control" placeholder="Why do many readers find the book interesting?" data-field="question">
            </div>
            <div class="mb-2">
                <label class="form-label">Option 1 (Đáp án đúng)</label>
                <input type="text" class="form-control" placeholder="It uses simple language..." data-field="option1">
            </div>
            <div class="mb-2">
                <label class="form-label">Option 2</label>
                <input type="text" class="form-control" placeholder="It relies heavily..." data-field="option2">
            </div>
            <div class="mb-2">
                <label class="form-label">Option 3</label>
                <input type="text" class="form-control" placeholder="It avoids explaining..." data-field="option3">
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', questionHtml);
}

function removeListeningQuestion17Question(button) {
    const questionItem = button.closest('.question-item');
    if (questionItem) {
        questionItem.remove();
    }
}

// ============================================
// Upload Audio Functions
// ============================================

// Upload audio file to GitHub
async function uploadAudioFile(file, filePath) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                // Convert to base64
                const base64 = e.target.result.split(',')[1];
                
                const response = await fetch('/api/upload-audio', {
                    method: 'POST',
                    headers: getJsonAuthHeaders(),
                    body: JSON.stringify({
                        filePath: filePath,
                        content: base64,
                        message: `Upload audio file: ${filePath}`
                    })
                });
                
                const result = await response.json();
                
                if (!response.ok) {
                    throw new Error(result.error || 'Upload failed');
                }
                
                resolve(result);
            } catch (error) {
                reject(error);
            }
        };
        reader.readAsDataURL(file);
    });
}

// Handle audio file upload for a specific part
async function handleAudioUpload(part, audioInput, questionIndex = null) {
    const file = audioInput.files[0];
    if (!file) return null;
    
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('File size vượt quá 10MB!');
        return null;
    }
    
    // Validate file type
    if (!file.type.includes('audio/mpeg') && !file.name.endsWith('.mp3')) {
        alert('Chỉ chấp nhận file MP3!');
        return null;
    }
    
    // Generate file path
    let filePath = '';
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    if (part === '1_13') {
        filePath = `audio/question1_13/audio_q${questionIndex || timestamp}.mp3`;
    } else if (part === '14') {
        filePath = `audio/question14/audio_${timestamp}.mp3`;
    } else if (part === '15') {
        filePath = `audio/question15/audio_${timestamp}.mp3`;
    } else if (part === '16_17') {
        if (questionIndex === 16) {
            filePath = `audio/question16/audio_${timestamp}.mp3`;
        } else if (questionIndex === 17) {
            filePath = `audio/question17/audio_${timestamp}.mp3`;
        } else {
            filePath = `audio/question16_17/audio_${timestamp}.mp3`;
        }
    }
    
    try {
        const result = await uploadAudioFile(file, filePath);
        return result.rawUrl; // Return the raw URL for use in JS code
    } catch (error) {
        console.error('Upload audio error:', error);
        if (error.message !== 'AUTH_TOKEN_MISSING') {
        alert('Lỗi khi upload audio: ' + error.message);
        }
        return null;
    }
}

// ============================================
// Generate JS Code Functions
// ============================================

// Generate JS code for listening lesson
function generateListeningJSCode(part, sets) {
    if (part === '1_13') {
        return generateListeningJS1_13(sets);
    } else if (part === '14') {
        return generateListeningJS14(sets);
    } else if (part === '15') {
        return generateListeningJS15(sets);
    } else if (part === '16_17') {
        return generateListeningJS16_17(sets);
    }
    return '';
}

function generateListeningJS1_13(sets) {
    let code = `(function() {\n\n`;
    code += `// ===============================================================================================================\n`;
    code += `// ////////////// DANH SÁCH CÂU HỎI ///////////////\n`;
    code += `// ===============================================================================================================\n\n`;
    code += `window.listeningQuestions1 = [\n`;
    
    if (sets.length > 0 && sets[0].questions) {
        sets[0].questions.forEach((q, index) => {
            code += `  {\n`;
            code += `    heading: "${q.heading || `Question ${index + 1} of 17`}",\n`;
            code += `    audioUrl: "${q.audioUrl || `audio/question1_13/audio_q${index + 1}.mp3`}",\n`;
            code += `    question: "${escapeJS(q.question)}",\n`;
            code += `    options: [${q.options.map(opt => `"${escapeJS(opt)}"`).join(', ')}],\n`;
            code += `    correctAnswer: "${escapeJS(q.correctAnswer)}",\n`;
            code += `    transcript: "${escapeJS(q.transcript)}"\n`;
            code += `  }${index < sets[0].questions.length - 1 ? ',' : ''}\n`;
        });
    }
    
    code += `];\n\n`;
    
    // Add render function
    code += `// ===============================================================================================================\n`;
    code += `// ////////////// CÂU HỎI 1_13 ///////////////\n`;
    code += `// ===============================================================================================================\n`;
    code += `window.renderQuestion1_13 = function(data) {\n`;
    code += `  const radioButtons = document.querySelectorAll('input[name="answer"]');\n`;
    code += `  radioButtons.forEach(button => {\n`;
    code += `    button.checked = false;\n`;
    code += `  });\n\n`;
    code += `  document.getElementById("question1_13_id").innerText = data.heading;\n\n`;
    code += `  const audio = document.getElementById("audioPlayer");\n`;
    code += `  const questionText = document.getElementById("questionText");\n`;
    code += `  audio.src = data.audioUrl;\n`;
    code += `  questionText.innerText = data.question;\n\n`;
    code += `  data.options.forEach((option, index) => {\n`;
    code += `    const label = document.getElementById("label" + index);\n`;
    code += `    const input = document.getElementById("option" + index);\n`;
    code += `    if (label && input) {\n`;
    code += `      label.innerText = option;\n`;
    code += `      input.value = option;\n`;
    code += `    }\n`;
    code += `  });\n\n`;
    code += `  const storedAnswer = window.userAnswers[window.currentIndex];\n`;
    code += `  if (storedAnswer) {\n`;
    code += `    const savedInput = document.querySelector(\`input[name="answer"][value="\${storedAnswer}"]\`);\n`;
    code += `    if (savedInput) savedInput.checked = true;\n`;
    code += `  }\n\n`;
    code += `  const playBtn = document.getElementById("playButton");\n`;
    code += `  const playIcon = document.getElementById("playIcon");\n`;
    code += `  window.setupPlayButton(audio, playBtn, playIcon);\n\n`;
    code += `  const transcriptBox = document.getElementById("transcriptBox");\n`;
    code += `  const transcriptContent = document.getElementById("transcriptContent");\n`;
    code += `  transcriptContent.innerText = data.transcript;\n\n`;
    code += `  const showTranscriptButton = document.getElementById("showTranscriptButton");\n\n`;
    code += `  transcriptBox.style.display = "none";\n`;
    code += `  showTranscriptButton.innerText = "Show paragraph";\n\n`;
    code += `  showTranscriptButton.removeEventListener("click", window.toggleTranscript);\n`;
    code += `  showTranscriptButton.addEventListener("click", window.toggleTranscript);\n`;
    code += `}\n\n`;
    
    // Add toggle transcript function
    code += `window.toggleTranscript = function() {\n`;
    code += `  const transcriptBox = document.getElementById("transcriptBox");\n`;
    code += `  const showTranscriptButton = document.getElementById("showTranscriptButton");\n`;
    code += `  if (transcriptBox.style.display === "none") {\n`;
    code += `    transcriptBox.style.display = "block";\n`;
    code += `    showTranscriptButton.innerText = "Hide paragraph";\n`;
    code += `  } else {\n`;
    code += `    transcriptBox.style.display = "none";\n`;
    code += `    showTranscriptButton.innerText = "Show paragraph";\n`;
    code += `  }\n`;
    code += `}\n\n`;
    
    // Add setup play button function
    code += `window.setupPlayButton = function(audio, playBtn, playIcon) {\n`;
    code += `  if (playBtn.dataset.bound === "true") return;\n`;
    code += `  playBtn.dataset.bound = "true";\n\n`;
    code += `  playBtn.addEventListener("click", () => {\n`;
    code += `    if (audio.paused) {\n`;
    code += `      audio.play().then(() => {\n`;
    code += `        playIcon.classList.remove("bi-play-fill");\n`;
    code += `        playIcon.classList.add("bi-pause-fill");\n`;
    code += `      }).catch(err => console.error("Không phát được:", err));\n`;
    code += `    } else {\n`;
    code += `      audio.pause();\n`;
    code += `      playIcon.classList.remove("bi-pause-fill");\n`;
    code += `      playIcon.classList.add("bi-play-fill");\n`;
    code += `    }\n`;
    code += `  });\n\n`;
    code += `  audio.addEventListener("ended", () => {\n`;
    code += `    playIcon.classList.remove("bi-pause-fill");\n`;
    code += `    playIcon.classList.add("bi-play-fill");\n`;
    code += `  });\n`;
    code += `}\n\n`;
    
    // Add variables and event listeners (expose to global scope)
    code += `window.currentIndex = 0;\n`;
    code += `window.userAnswers = [];\n\n`;
    
    code += `window.storeUserAnswer = function(questionIndex, answer) {\n`;
    code += `  window.userAnswers[questionIndex] = answer;\n`;
    code += `}\n\n`;
    
    code += `document.querySelectorAll('input[name="answer"]').forEach((input, index) => {\n`;
    code += `  input.addEventListener('change', function() {\n`;
    code += `    window.storeUserAnswer(window.currentIndex, this.value);\n`;
    code += `  });\n`;
    code += `});\n\n`;
    
    // Add window.onload to render first question
    code += `window.onload = function() {\n`;
    code += `  window.renderQuestion1_13(window.listeningQuestions1[0]);\n`;
    code += `};\n\n`;
    
    // Add showResults function (expose to global scope) - only show in modal, not on page
    code += `window.showResults_question1_13 = function() {\n`;
    code += `  const comparisonTableBody = document.getElementById('comparisonTableBody');\n`;
    code += `  if (!comparisonTableBody) return;\n`;
    code += `  comparisonTableBody.innerHTML = '';\n\n`;
    code += `  let score = 0;\n\n`;
    code += `  window.listeningQuestions1.forEach((question, index) => {\n`;
    code += `    const userAnswer = window.userAnswers[index];\n`;
    code += `    const isCorrect = userAnswer === question.correctAnswer;\n`;
    code += `    const textColor = isCorrect ? 'text-success' : 'text-danger';\n\n`;
    code += `    if (isCorrect) {\n`;
    code += `      score += 2;\n`;
    code += `    }\n\n`;
    code += `    // Populate table in modal only (not on page) - format like Reading\n`;
    code += `    comparisonTableBody.innerHTML += \`\n`;
    code += `      <tr>\n`;
    code += `        <td class="\${textColor} fw-bold">\${userAnswer || 'Not answered'}</td>\n`;
    code += `        <td class="text-success fw-bold">\${question.correctAnswer}</td>\n`;
    code += `      </tr>\n`;
    code += `    \`;\n`;
    code += `  });\n\n`;
    code += `  window.question1_13Score = score;\n`;
    code += `  // Don't show result on page, only in modal\n`;
    code += `  // totalScoreDisplay.innerText = \`Score: \${score} / \${window.listeningQuestions1.length * 2}\`;\n`;
    code += `  // const resultContainer = document.getElementById('comparisonResult_question1');\n`;
    code += `  // if (resultContainer) resultContainer.style.display = "block";\n`;
    code += `}\n\n`;
    
    // Add calculateTotalScore function (expose to global scope)
    code += `window.question1_13Score = 0;\n`;
    code += `window.calculateTotalScore = function() {\n`;
    code += `  var totalScore = window.question1_13Score;\n`;
    code += `  const totalScoreEl = document.getElementById('totalScore');\n`;
    code += `  if (totalScoreEl) totalScoreEl.innerText = 'Your Score: ' + totalScore;\n`;
    code += `  window.classifyScore(totalScore);\n`;
    code += `}\n\n`;
    
    code += `window.classifyScore = function(score) {\n`;
    code += `  let classification = '';\n`;
    code += `  const totalQuestions = window.listeningQuestions1 ? window.listeningQuestions1.length : 13;\n`;
    code += `  const maxScore = totalQuestions * 2;\n`;
    code += `  const percentage = (score / maxScore) * 100;\n`;
    code += `  if (percentage >= 80) {\n`;
    code += `    classification = 'Excellent';\n`;
    code += `  } else if (percentage >= 50) {\n`;
    code += `    classification = 'Good';\n`;
    code += `  } else {\n`;
    code += `    classification = 'Cố gắng thêm nhé!';\n`;
    code += `  }\n`;
    code += `  const scoreEl = document.getElementById('scoreClassification');\n`;
    code += `  if (scoreEl) scoreEl.innerText = 'Classification: ' + classification;\n`;
    code += `}\n\n`;
    
    // Add Check result button event listener
    code += `const checkResultBtn = document.getElementById('checkResultButton');\n`;
    code += `if (checkResultBtn) {\n`;
    code += `  checkResultBtn.addEventListener('click', function() {\n`;
    code += `    console.log('Check result button clicked');\n`;
    code += `    try {\n`;
    code += `      window.showResults_question1_13();\n`;
    code += `      window.calculateTotalScore();\n`;
    code += `      // Keep question container visible (like Reading) - don't hide it\n`;
    code += `      // const questionContainer = document.getElementById("question1_13");\n`;
    code += `      // if (questionContainer) questionContainer.style.display = "none";\n`;
    code += `      // Don't show result container on page, only show modal\n`;
    code += `      // const resultContainer = document.getElementById('comparisonResult_question1');\n`;
    code += `      // if (resultContainer) resultContainer.style.display = "block";\n`;
    code += `      // Keep navigation buttons visible (don't hide them)\n`;
    code += `      // const backBtn = document.getElementById('backButton');\n`;
    code += `      // if (backBtn) backBtn.style.display = "none";\n`;
    code += `      // checkResultBtn.style.display = "none";\n`;
    code += `      // const nextBtn = document.getElementById('nextButton');\n`;
    code += `      // if (nextBtn) nextBtn.style.display = "none";\n`;
    code += `      // Show modal with results\n`;
    code += `      const resultModal = document.getElementById('resultModal');\n`;
    code += `      if (resultModal && typeof bootstrap !== 'undefined') {\n`;
    code += `        const modal = new bootstrap.Modal(resultModal);\n`;
    code += `        modal.show();\n`;
    code += `        console.log('Result modal shown');\n`;
    code += `      } else {\n`;
    code += `        console.error('resultModal not found or bootstrap not available');\n`;
    code += `      }\n`;
    code += `    } catch (error) {\n`;
    code += `      console.error('Error in check result button handler:', error);\n`;
    code += `    }\n`;
    code += `  });\n`;
    code += `}\n\n`;
    
    // Add Countdown Timer (only initialize once to prevent multiple timers)
    code += `// ===============================================================================================================\n`;
    code += `// ////////////// ĐẾM NGƯỢC THỜI GIAN --- COUNT DOWN ///////////////\n`;
    code += `// ===============================================================================================================\n`;
    code += `if (!window.countdownInitialized) {\n`;
    code += `  window.countdownInitialized = true;\n`;
    code += `  window.timeLeft = 40 * 60; // 40 minutes in seconds\n`;
    code += `  const countdownElement = document.getElementById('countdownTimer');\n\n`;
    code += `  // Clear any existing timer first\n`;
    code += `  if (window.countdownTimerId) {\n`;
    code += `    clearTimeout(window.countdownTimerId);\n`;
    code += `  }\n\n`;
    code += `  window.updateCountdown = function() {\n`;
    code += `    if (!countdownElement) return;\n`;
    code += `    const minutes = Math.floor(window.timeLeft / 60);\n`;
    code += `    const seconds = window.timeLeft % 60;\n`;
    code += `    countdownElement.textContent = \`\${minutes}:\${seconds < 10 ? '0' : ''}\${seconds}\`;\n`;
    code += `    if (window.timeLeft > 0) {\n`;
    code += `      window.timeLeft--;\n`;
    code += `      window.countdownTimerId = setTimeout(window.updateCountdown, 1000);\n`;
    code += `    }\n`;
    code += `  }\n\n`;
    code += `  window.updateCountdown();\n`;
    code += `}\n`;
    
    code += `})();\n`;
    
    return code;
}

function generateListeningJS14(sets) {
    // Use IIFE that executes immediately, but also handles DOMContentLoaded if needed
    let code = `(function() {\n`;
    code += `  // Execute immediately if DOM is ready, otherwise wait for DOMContentLoaded\n`;
    code += `  function init() {\n\n`;
    code += `// ===============================================================================================================\n`;
    code += `// ////////////// DANH SÁCH CÂU HỎI ///////////////\n`;
    code += `// ===============================================================================================================\n\n`;
    
    // Generate individual data objects
    sets.forEach((set, setIndex) => {
        const varName = setIndex === 0 ? 'question14Data_1' : `question14Data_${setIndex + 1}`;
        code += `const ${varName} = {\n`;
        code += `  audioUrl: "${set.audioUrl || `audio/question14/audio_q${setIndex + 1}.mp3`}",\n`;
        code += `  topic: "${escapeJS(set.topic)}",\n`;
        code += `  options: [\n`;
        set.options.forEach((opt, index) => {
            code += `    "${escapeJS(opt)}"${index < set.options.length - 1 ? ',' : ''}\n`;
        });
        code += `  ],\n`;
        code += `  transcript: \`${escapeJS(set.transcript)}\`\n`;
        code += `};\n\n`;
    });
    
    // Always create question14Data array and expose to window
        code += `const question14Data = [\n`;
        sets.forEach((set, index) => {
        const varName = `question14Data_${index + 1}`;
            code += `  ${varName}${index < sets.length - 1 ? ',' : ''}\n`;
        });
        code += `];\n\n`;
    code += `// Expose to window scope for external access\n`;
    code += `window.question14Data = question14Data;\n\n`;
    
    // Include full render code from template
    code += `// ===============================================================================================================\n`;
    code += `// ////////////// CÂU HỎI 2 (14 of 17) ///////////////\n`;
    code += `// ===============================================================================================================\n`;
    code += `let correctAnswer14 = [];\n`;
    code += `let shuffledOptions14 = [];\n`;
    code += `function renderQuestion14(data) {\n`;
    code += `  document.getElementById("audioPlayer2").src = data.audioUrl;\n`;
    code += `  document.getElementById("question14_topic").innerText = data.topic;\n`;
    code += `  const questionText_id = \`Question \${currentIndex + 1} of \${question14Data.length}\`;\n`;
    code += `  document.getElementById('question2_id').textContent = questionText_id;\n`;
    code += `  correctAnswer14 = data.options.slice(0, 4);\n`;
    code += `  shuffledOptions14 = [...data.options].sort(() => Math.random() - 0.5);\n`;
    code += `  const selectIds = ["person1", "person2", "person3", "person4"];\n`;
    code += `  selectIds.forEach((id, index) => {\n`;
    code += `    const select = document.getElementById(id);\n`;
    code += `    select.innerHTML = '<option value="">-- Select an answer --</option>';\n`;
    code += `    shuffledOptions14.forEach((opt, idx) => {\n`;
    code += `      const val = String.fromCharCode(65 + idx);\n`;
    code += `      const optionEl = document.createElement("option");\n`;
    code += `      optionEl.value = val;\n`;
    code += `      optionEl.innerText = opt;\n`;
    code += `      select.appendChild(optionEl);\n`;
    code += `    });\n`;
    code += `    const prevAnswer = userAnswers_question14[index];\n`;
    code += `    if (prevAnswer) {\n`;
    code += `      const selectedIndex = shuffledOptions14.indexOf(prevAnswer);\n`;
    code += `      select.selectedIndex = selectedIndex + 1;\n`;
    code += `    }\n`;
    code += `  });\n`;
    code += `  const audio = document.getElementById("audioPlayer2");\n`;
    code += `  const playBtn = document.getElementById("playButton2");\n`;
    code += `  const playIcon = document.getElementById("playIcon2");\n`;
    code += `  setupPlayButton(audio, playBtn, playIcon);\n`;
    code += `  const transcriptBox = document.getElementById("transcriptBox14");\n`;
    code += `  const transcriptContent = document.getElementById("transcriptContent14");\n`;
    code += `  transcriptContent.innerText = data.transcript;\n`;
    code += `  const showTranscriptButton = document.getElementById("showTranscriptButton14");\n`;
    code += `  transcriptBox.style.display = "none";\n`;
    code += `  showTranscriptButton.innerText = "Show paragraph";\n`;
    code += `  showTranscriptButton.removeEventListener("click", toggleTranscript14);\n`;
    code += `  showTranscriptButton.addEventListener("click", toggleTranscript14);\n`;
    code += `}\n`;
    code += `// Expose renderQuestion14 to window\n`;
    code += `window.renderQuestion14 = renderQuestion14;\n\n`;
    code += `function toggleTranscript14() {\n`;
    code += `  const transcriptBox = document.getElementById("transcriptBox14");\n`;
    code += `  const showTranscriptButton = document.getElementById("showTranscriptButton14");\n`;
    code += `  if (transcriptBox.style.display === "none") {\n`;
    code += `    transcriptBox.style.display = "block";\n`;
    code += `    showTranscriptButton.innerText = "Hide paragraph";\n`;
    code += `  } else {\n`;
    code += `    transcriptBox.style.display = "none";\n`;
    code += `    showTranscriptButton.innerText = "Show paragraph";\n`;
    code += `  }\n`;
    code += `}\n\n`;
    code += `document.querySelectorAll('select[id^="person"]').forEach((select, index) => {\n`;
    code += `  select.addEventListener('change', function() {\n`;
    code += `    storeUserAnswerQuestion14(index, this.value);\n`;
    code += `  });\n`;
    code += `});\n\n`;
    code += `let userAnswers_question14 = [];\n\n`;
    code += `function storeUserAnswerQuestion14(index, answerLetter) {\n`;
    code += `  const optionIndex = answerLetter.charCodeAt(0) - 65;\n`;
    code += `  const selectedAnswer = shuffledOptions14[optionIndex];\n`;
    code += `  userAnswers_question14[index] = selectedAnswer;\n`;
    code += `}\n\n`;
    code += `function showResults_question14() {\n`;
    code += `  const comparisonBody14 = document.getElementById('comparisonTableBody');\n`;
    code += `  const totalScoreEl = document.getElementById('totalScore');\n`;
    code += `  const scoreClassificationEl = document.getElementById('scoreClassification');\n`;
    code += `  comparisonBody14.innerHTML = '';\n`;
    code += `  let score = 0;\n`;
    code += `  let html14 = '';\n`;
    code += `  correctAnswer14.forEach((correctOption, index) => {\n`;
    code += `    const userAnswer = userAnswers_question14[index] || 'Not answered';\n`;
    code += `    const isCorrect = userAnswer === correctOption;\n`;
    code += `    const userAnswerColor = isCorrect ? 'text-success' : 'text-danger';\n`;
    code += `    if (isCorrect) score += 2;\n`;
    code += `    html14 += '<tr><td class="' + userAnswerColor + '">' + userAnswer + '</td><td class="text-success">' + correctOption + '</td></tr>';\n`;
    code += `  });\n`;
    code += `  comparisonBody14.innerHTML = html14;\n`;
    code += `  totalScoreEl.innerText = 'Score: ' + score + ' / 8';\n`;
    code += `  let classification = '';\n`;
    code += `  if (score >= 8) classification = 'Excellent';\n`;
    code += `  else if (score >= 6) classification = 'Good';\n`;
    code += `  else if (score >= 4) classification = 'Satisfactory';\n`;
    code += `  else classification = 'Needs Improvement';\n`;
    code += `  scoreClassificationEl.innerText = 'Classification: ' + classification;\n`;
    code += `  const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));\n`;
    code += `  resultModal.show();\n`;
    code += `}\n\n`;
    code += `document.getElementById('checkResultButton').addEventListener('click', showResults_question14);\n\n`;
    code += `let currentIndex = 0;\n`;
    code += `let userAnswers = [];\n\n`;
    code += `function renderQuestionByIndex(currentIndex) {\n`;
    code += `  if (currentIndex <= question14Data.length - 1) {\n`;
    code += `    renderQuestion14(question14Data[currentIndex]);\n`;
    code += `  }\n`;
    code += `  if (currentIndex === question14Data.length - 1) {\n`;
    code += `    document.getElementById('nextButton').textContent = "The end";\n`;
    code += `  }\n`;
    code += `}\n\n`;
    code += `document.getElementById('nextButton').addEventListener('click', function (e) {\n`;
    code += `  userAnswers_question14 = [];\n`;
    code += `  document.querySelectorAll('audio').forEach(audio => {\n`;
    code += `    if (!audio.paused) { audio.pause(); audio.currentTime = 0; }\n`;
    code += `  });\n`;
    code += `  document.querySelectorAll('i[id^="playIcon"]').forEach(icon => {\n`;
    code += `    icon.classList.remove("bi-pause-fill");\n`;
    code += `    icon.classList.add("bi-play-fill");\n`;
    code += `  });\n`;
    code += `  if (currentIndex < question14Data.length - 1) {\n`;
    code += `    currentIndex++;\n`;
    code += `    renderQuestionByIndex(currentIndex);\n`;
    code += `  }\n`;
    code += `});\n\n`;
    code += `document.getElementById('backButton').addEventListener('click', function () {\n`;
    code += `  userAnswers_question14 = [];\n`;
    code += `  document.querySelectorAll('audio').forEach(audio => {\n`;
    code += `    if (!audio.paused) { audio.pause(); audio.currentTime = 0; }\n`;
    code += `  });\n`;
    code += `  document.querySelectorAll('i[id^="playIcon"]').forEach(icon => {\n`;
    code += `    icon.classList.remove("bi-pause-fill");\n`;
    code += `    icon.classList.add("bi-play-fill");\n`;
    code += `  });\n`;
    code += `  document.getElementById('nextButton').textContent = "Next";\n`;
    code += `  if (currentIndex > 0) currentIndex--;\n`;
    code += `  renderQuestionByIndex(currentIndex);\n`;
    code += `});\n\n`;
    code += `window.onload = function() {\n`;
    code += `    renderQuestion14(question14Data[0]);\n`;
    code += `};\n\n`;
    code += `let timeLeft = 40 * 60;\n`;
    code += `const countdownElement = document.getElementById('countdownTimer');\n`;
    code += `function updateCountdown() {\n`;
    code += `    const minutes = Math.floor(timeLeft / 60);\n`;
    code += `    const seconds = timeLeft % 60;\n`;
    code += `    countdownElement.textContent = \`\${minutes}:\${seconds < 10 ? '0' : ''}\${seconds}\`;\n`;
    code += `    if (timeLeft > 0) {\n`;
    code += `        timeLeft--;\n`;
    code += `        setTimeout(updateCountdown, 1000);\n`;
    code += `    }\n`;
    code += `}\n`;
    code += `updateCountdown();\n\n`;
    code += `function setupPlayButton(audio, playBtn, playIcon) {\n`;
    code += `  if (playBtn.dataset.bound === "true") return;\n`;
    code += `  playBtn.dataset.bound = "true";\n`;
    code += `  playBtn.addEventListener("click", () => {\n`;
    code += `    if (audio.paused) {\n`;
    code += `      audio.play().then(() => {\n`;
    code += `        playIcon.classList.remove("bi-play-fill");\n`;
    code += `        playIcon.classList.add("bi-pause-fill");\n`;
    code += `      }).catch(err => console.error("Không phát được:", err));\n`;
    code += `    } else {\n`;
    code += `      audio.pause();\n`;
    code += `      playIcon.classList.remove("bi-pause-fill");\n`;
    code += `      playIcon.classList.add("bi-play-fill");\n`;
    code += `    }\n`;
    code += `  });\n`;
    code += `  audio.addEventListener("ended", () => {\n`;
    code += `    playIcon.classList.remove("bi-pause-fill");\n`;
    code += `    playIcon.classList.add("bi-play-fill");\n`;
    code += `  });\n`;
    code += `}\n\n`;
    code += `  } // End of init function\n\n`;
    code += `  // Execute immediately if DOM is ready, otherwise wait\n`;
    code += `  if (document.readyState === 'loading') {\n`;
    code += `    document.addEventListener('DOMContentLoaded', init);\n`;
    code += `  } else {\n`;
    code += `    init();\n`;
    code += `  }\n`;
    code += `})();\n`;
    
    return code;
}

function generateListeningJS15(sets) {
    // Use IIFE that executes immediately, but also handles DOMContentLoaded if needed
    let code = `(function() {\n`;
    code += `  // Execute immediately if DOM is ready, otherwise wait for DOMContentLoaded\n`;
    code += `  function init() {\n\n`;
    code += `// ===============================================================================================================\n`;
    code += `// ////////////// DANH SÁCH CÂU HỎI ///////////////\n`;
    code += `// ===============================================================================================================\n\n`;
    
    // Generate individual data objects
    sets.forEach((set, setIndex) => {
        const varName = `question15Data_${setIndex + 1}`;
        code += `const ${varName} = {\n`;
        code += `  audioUrl: "${set.audioUrl || `audio/question15/audio_q${setIndex + 1}.mp3`}",\n`;
        code += `  topic: "${escapeJS(set.topic)}",\n`;
        code += `  transcript: \`${escapeJS(set.transcript)}\`,\n`;
        code += `  questions: [\n`;
        set.questions.forEach((q, index) => {
            code += `    "${escapeJS(q)}"${index < set.questions.length - 1 ? ',' : ''}\n`;
        });
        code += `  ],\n`;
        code += `  correctAnswer: [${set.correctAnswer.map(ans => `"${ans}"`).join(', ')}]\n`;
        code += `};\n\n`;
    });
    
    // Always create question15Data array and expose to window
        code += `const question15Data = [\n`;
        sets.forEach((set, index) => {
        const varName = `question15Data_${index + 1}`;
            code += `  ${varName}${index < sets.length - 1 ? ',' : ''}\n`;
        });
        code += `];\n\n`;
    code += `// Expose to window scope for external access\n`;
    code += `window.question15Data = question15Data;\n\n`;
    
    // Include full render code
    code += `// ===============================================================================================================\n`;
    code += `// ////////////// CÂU HỎI 15 ///////////////\n`;
    code += `// ===============================================================================================================\n`;
    code += `let userAnswers_question15 = [];\n\n`;
    code += `function storeUserAnswerQuestion15(index, answer) {\n`;
    code += `  const options = ["Man", "Woman", "Both"];\n`;
    code += `  const selectedAnswer = options[answer.charCodeAt(0) - 65];\n`;
    code += `  userAnswers_question15[index] = selectedAnswer;\n`;
    code += `}\n\n`;
    code += `function renderQuestion15(data) {\n`;
    code += `  document.getElementById("audioPlayer3").src = data.audioUrl;\n`;
    code += `  document.getElementById("question15_id").innerText = data.topic;\n`;
    code += `  const questionText_id = \`Question \${currentIndex + 1} of \${question15Data.length}\`;\n`;
    code += `  document.getElementById('question2_id').textContent = questionText_id;\n`;
    code += `  data.questions.forEach((question, index) => {\n`;
    code += `    const label = document.getElementById("opinion" + (index + 1) + "_label");\n`;
    code += `    const select = document.getElementById("opinion" + (index + 1));\n`;
    code += `    if (label) label.innerText = question;\n`;
    code += `    if (select) {\n`;
    code += `      select.innerHTML = '<option value="">-- Select an answer --</option>';\n`;
    code += `      const options = ["Man", "Woman", "Both"];\n`;
    code += `      options.forEach((opt, i) => {\n`;
    code += `        const val = String.fromCharCode(65 + i);\n`;
    code += `        const optionEl = document.createElement("option");\n`;
    code += `        optionEl.value = val;\n`;
    code += `        optionEl.innerText = opt;\n`;
    code += `        select.appendChild(optionEl);\n`;
    code += `      });\n`;
    code += `    }\n`;
    code += `  });\n`;
    code += `  const audio = document.getElementById("audioPlayer3");\n`;
    code += `  const playBtn = document.getElementById("playButton3");\n`;
    code += `  const playIcon = document.getElementById("playIcon3");\n`;
    code += `  setupPlayButton(audio, playBtn, playIcon);\n`;
    code += `  const transcriptBox = document.getElementById("transcriptBox15");\n`;
    code += `  const transcriptContent = document.getElementById("transcriptContent15");\n`;
    code += `  transcriptContent.innerText = data.transcript;\n`;
    code += `  const showTranscriptButton = document.getElementById("showTranscriptButton15");\n`;
    code += `  transcriptBox.style.display = "none";\n`;
    code += `  showTranscriptButton.innerText = "Show paragraph";\n`;
    code += `  showTranscriptButton.removeEventListener("click", toggleTranscript15);\n`;
    code += `  showTranscriptButton.addEventListener("click", toggleTranscript15);\n`;
    code += `}\n`;
    code += `// Expose renderQuestion15 to window\n`;
    code += `window.renderQuestion15 = renderQuestion15;\n\n`;
    code += `function toggleTranscript15() {\n`;
    code += `  const transcriptBox = document.getElementById("transcriptBox15");\n`;
    code += `  const showTranscriptButton = document.getElementById("showTranscriptButton15");\n`;
    code += `  if (transcriptBox.style.display === "none") {\n`;
    code += `    transcriptBox.style.display = "block";\n`;
    code += `    showTranscriptButton.innerText = "Hide paragraph";\n`;
    code += `  } else {\n`;
    code += `    transcriptBox.style.display = "none";\n`;
    code += `    showTranscriptButton.innerText = "Show paragraph";\n`;
    code += `  }\n`;
    code += `}\n\n`;
    code += `document.querySelectorAll('select[id^="opinion"]').forEach((select, index) => {\n`;
    code += `  select.addEventListener('change', function() {\n`;
    code += `    storeUserAnswerQuestion15(index, this.value);\n`;
    code += `  });\n`;
    code += `});\n\n`;
    code += `function showResults_question15() {\n`;
    code += `  const comparisonBody15 = document.getElementById('comparisonTableBody');\n`;
    code += `  const totalScoreEl = document.getElementById('totalScore');\n`;
    code += `  comparisonBody15.innerHTML = '';\n`;
    code += `  const correctAnswer15 = question15Data[currentIndex].correctAnswer;\n`;
    code += `  let score = 0;\n`;
    code += `  let html15 = '';\n`;
    code += `  correctAnswer15.forEach((correctAns, index) => {\n`;
    code += `    const userAns = userAnswers_question15[index] || 'Not answered';\n`;
    code += `    const isCorrect = userAns === correctAns;\n`;
    code += `    const textColor = isCorrect ? 'text-success' : 'text-danger';\n`;
    code += `    if (isCorrect) score += 2;\n`;
    code += `    html15 += '<tr><td class="' + textColor + ' fw-bold">' + userAns + '</td><td class="text-success fw-bold">' + correctAns + '</td></tr>';\n`;
    code += `  });\n`;
    code += `  comparisonBody15.innerHTML = html15;\n`;
    code += `  totalScoreEl.innerText = 'Score: ' + score + ' / 8';\n`;
    code += `  const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));\n`;
    code += `  resultModal.show();\n`;
    code += `}\n\n`;
    code += `document.getElementById('checkResultButton').addEventListener('click', showResults_question15);\n\n`;
    code += `let currentIndex = 0;\n\n`;
    code += `function renderQuestionByIndex(currentIndex) {\n`;
    code += `  if (currentIndex <= question15Data.length - 1) {\n`;
    code += `    renderQuestion15(question15Data[currentIndex]);\n`;
    code += `  }\n`;
    code += `  if (currentIndex === question15Data.length - 1) {\n`;
    code += `    document.getElementById('nextButton').textContent = "The end";\n`;
    code += `  }\n`;
    code += `}\n\n`;
    code += `document.getElementById('nextButton').addEventListener('click', function (e) {\n`;
    code += `  userAnswers_question15 = [];\n`;
    code += `  document.querySelectorAll('audio').forEach(audio => {\n`;
    code += `    if (!audio.paused) { audio.pause(); audio.currentTime = 0; }\n`;
    code += `  });\n`;
    code += `  document.querySelectorAll('i[id^="playIcon"]').forEach(icon => {\n`;
    code += `    icon.classList.remove("bi-pause-fill");\n`;
    code += `    icon.classList.add("bi-play-fill");\n`;
    code += `  });\n`;
    code += `  if (currentIndex < question15Data.length - 1) {\n`;
    code += `    currentIndex++;\n`;
    code += `    renderQuestionByIndex(currentIndex);\n`;
    code += `  }\n`;
    code += `});\n\n`;
    code += `document.getElementById('backButton').addEventListener('click', function () {\n`;
    code += `  userAnswers_question15 = [];\n`;
    code += `  document.querySelectorAll('audio').forEach(audio => {\n`;
    code += `    if (!audio.paused) { audio.pause(); audio.currentTime = 0; }\n`;
    code += `  });\n`;
    code += `  document.querySelectorAll('i[id^="playIcon"]').forEach(icon => {\n`;
    code += `    icon.classList.remove("bi-pause-fill");\n`;
    code += `    icon.classList.add("bi-play-fill");\n`;
    code += `  });\n`;
    code += `  document.getElementById('nextButton').textContent = "Next";\n`;
    code += `  if (currentIndex > 0) currentIndex--;\n`;
    code += `  renderQuestionByIndex(currentIndex);\n`;
    code += `});\n\n`;
    code += `window.onload = function() {\n`;
    code += `    renderQuestionByIndex(0);\n`;
    code += `};\n\n`;
    code += `let timeLeft = 40 * 60;\n`;
    code += `const countdownElement = document.getElementById('countdownTimer');\n`;
    code += `function updateCountdown() {\n`;
    code += `    const minutes = Math.floor(timeLeft / 60);\n`;
    code += `    const seconds = timeLeft % 60;\n`;
    code += `    countdownElement.textContent = \`\${minutes}:\${seconds < 10 ? '0' : ''}\${seconds}\`;\n`;
    code += `    if (timeLeft > 0) {\n`;
    code += `        timeLeft--;\n`;
    code += `        setTimeout(updateCountdown, 1000);\n`;
    code += `    }\n`;
    code += `}\n`;
    code += `updateCountdown();\n\n`;
    code += `function setupPlayButton(audio, playBtn, playIcon) {\n`;
    code += `  if (playBtn.dataset.bound === "true") return;\n`;
    code += `  playBtn.dataset.bound = "true";\n`;
    code += `  playBtn.addEventListener("click", () => {\n`;
    code += `    if (audio.paused) {\n`;
    code += `      audio.play().then(() => {\n`;
    code += `        playIcon.classList.remove("bi-play-fill");\n`;
    code += `        playIcon.classList.add("bi-pause-fill");\n`;
    code += `      }).catch(err => console.error("Không phát được:", err));\n`;
    code += `    } else {\n`;
    code += `      audio.pause();\n`;
    code += `      playIcon.classList.remove("bi-pause-fill");\n`;
    code += `      playIcon.classList.add("bi-play-fill");\n`;
    code += `    }\n`;
    code += `  });\n`;
    code += `  audio.addEventListener("ended", () => {\n`;
    code += `    playIcon.classList.remove("bi-pause-fill");\n`;
    code += `    playIcon.classList.add("bi-play-fill");\n`;
    code += `  });\n`;
    code += `}\n\n`;
    code += `  } // End of init function\n\n`;
    code += `  // Execute immediately if DOM is ready, otherwise wait\n`;
    code += `  if (document.readyState === 'loading') {\n`;
    code += `    document.addEventListener('DOMContentLoaded', init);\n`;
    code += `  } else {\n`;
    code += `    init();\n`;
    code += `  }\n`;
    code += `})();\n`;
    
    return code;
}

function generateListeningJS16_17(sets) {
    // Use IIFE that executes immediately, but also handles DOMContentLoaded if needed
    let code = `(function() {\n`;
    code += `  // Execute immediately if DOM is ready, otherwise wait for DOMContentLoaded\n`;
    code += `  function init() {\n\n`;
    code += `// ===============================================================================================================\n`;
    code += `// ////////////// DANH SÁCH CÂU HỎI ///////////////\n`;
    code += `// ===============================================================================================================\n`;
    code += `const question16Data = [\n`;
    
    sets.forEach((set, setIndex) => {
        code += `  {\n`;
        code += `    audioUrl: "${set.question16?.audioUrl || `audio/question16/no_audio.mp3`}",\n`;
        code += `    topic: "${escapeJS(set.question16?.topic || '')}",\n`;
        code += `    questions: [\n`;
        if (set.question16?.questions) {
            set.question16.questions.forEach((q, index) => {
                code += `      {\n`;
                code += `        id: "${q.id}",\n`;
                code += `        question: "${escapeJS(q.question)}",\n`;
                code += `        options: [\n`;
                q.options.forEach((opt, optIndex) => {
                    code += `          "${escapeJS(opt)}"${optIndex < q.options.length - 1 ? ',' : ''}\n`;
                });
                code += `        ]\n`;
                code += `      }${index < set.question16.questions.length - 1 ? ',' : ''}\n`;
            });
        }
        code += `    ],\n`;
        code += `    transcript: "${escapeJS(set.question16?.transcript || '')}"\n`;
        code += `  },\n`;
        code += `  {\n`;
        code += `    audioUrl: "${set.question17?.audioUrl || `audio/question17/no_audio.mp3`}",\n`;
        code += `    topic: "${escapeJS(set.question17?.topic || '')}",\n`;
        code += `    questions: [\n`;
        if (set.question17?.questions) {
            set.question17.questions.forEach((q, index) => {
                code += `      {\n`;
                code += `        id: "${q.id}",\n`;
                code += `        question: "${escapeJS(q.question)}",\n`;
                code += `        options: [\n`;
                q.options.forEach((opt, optIndex) => {
                    code += `          "${escapeJS(opt)}"${optIndex < q.options.length - 1 ? ',' : ''}\n`;
                });
                code += `        ]\n`;
                code += `      }${index < set.question17.questions.length - 1 ? ',' : ''}\n`;
            });
        }
        code += `    ],\n`;
        code += `    transcript: "${escapeJS(set.question17?.transcript || '')}"\n`;
        code += `  }${setIndex < sets.length - 1 ? ',' : ''}\n`;
    });
    
    code += `];\n\n`;
    code += `// Expose to window scope for external access\n`;
    code += `window.question16Data = question16Data;\n\n`;
    
    // Include full render code
    code += `// ===============================================================================================================\n`;
    code += `// ////////////// CÂU HỎI 16 ///////////////\n`;
    code += `// ===============================================================================================================\n`;
    code += `let userAnswers_question16 = {};\n`;
    code += `let correctAnswers_question16 = {};\n`;
    code += `let shuffledOptionsMap_question16 = {};\n\n`;
    code += `function renderQuestion16(data) {\n`;
    code += `  document.getElementById("audioPlayer16").src = data.audioUrl;\n`;
    code += `  document.getElementById("question16_topic").innerText = 'Topic: ' + data.topic;\n`;
    code += `  document.getElementById("transcriptContent16").innerText = data.transcript;\n`;
    code += `  const questionText_id = \`Question \${currentIndex + 1} of \${question16Data.length}\`;\n`;
    code += `  document.getElementById('question16_id').textContent = questionText_id;\n`;
    code += `  data.questions.forEach((q, index) => {\n`;
    code += `    const qIndex = index + 1;\n`;
    code += `    const labelEl = document.getElementById('q16_opinion' + qIndex + '_label');\n`;
    code += `    labelEl.innerText = q.id + ' ' + q.question;\n`;
    code += `    correctAnswers_question16[q.id] = q.options[0];\n`;
    code += `    const shuffled = [...q.options].sort(() => Math.random() - 0.5);\n`;
    code += `    shuffledOptionsMap_question16[q.id] = shuffled;\n`;
    code += `    shuffled.forEach((text, optIndex) => {\n`;
    code += `      const letter = String.fromCharCode(65 + optIndex);\n`;
    code += `      const radio = document.getElementById('opinion' + qIndex + '_' + letter);\n`;
    code += `      const label = document.querySelector('label[for=opinion' + qIndex + '_' + letter + ']');\n`;
    code += `      if (radio && label) {\n`;
    code += `        label.innerText = text;\n`;
    code += `        radio.checked = false;\n`;
    code += `        radio.onchange = () => { userAnswers_question16[q.id] = letter; };\n`;
    code += `      }\n`;
    code += `    });\n`;
    code += `  });\n`;
    code += `  const audio = document.getElementById("audioPlayer16");\n`;
    code += `  const playBtn = document.getElementById("playButton16");\n`;
    code += `  const playIcon = document.getElementById("playIcon16");\n`;
    code += `  setupPlayButton(audio, playBtn, playIcon);\n`;
    code += `  const btn = document.getElementById("showTranscriptButton16");\n`;
    code += `  const box = document.getElementById("transcriptBox16");\n`;
    code += `  btn.innerText = "Show Paragraph";\n`;
    code += `  box.style.display = "none";\n`;
    code += `  btn.onclick = () => {\n`;
    code += `    if (box.style.display === "none") {\n`;
    code += `      box.style.display = "block";\n`;
    code += `      btn.innerText = "Hide Paragraph";\n`;
    code += `    } else {\n`;
    code += `      box.style.display = "none";\n`;
    code += `      btn.innerText = "Show Paragraph";\n`;
    code += `    }\n`;
    code += `  };\n`;
    code += `}\n`;
    code += `// Expose renderQuestion16 to window\n`;
    code += `window.renderQuestion16 = renderQuestion16;\n\n`;
    code += `function showResults_question16() {\n`;
    code += `  const tbody = document.getElementById("comparisonTableBody");\n`;
    code += `  const totalScoreEl = document.getElementById("totalScore");\n`;
    code += `  const scoreClassificationEl = document.getElementById("scoreClassification");\n`;
    code += `  tbody.innerHTML = "";\n`;
    code += `  let score = 0;\n`;
    code += `  if (currentIndex < 0 || currentIndex >= question16Data.length) return;\n`;
    code += `  const currentData = question16Data[currentIndex];\n`;
    code += `  currentData.questions.forEach(q => {\n`;
    code += `    const qid = q.id;\n`;
    code += `    const correctText = correctAnswers_question16[qid];\n`;
    code += `    const shuffled = shuffledOptionsMap_question16[qid];\n`;
    code += `    const userLetter = userAnswers_question16[qid];\n`;
    code += `    const userText = userLetter ? shuffled[userLetter.charCodeAt(0) - 65] : "Not answered";\n`;
    code += `    const isCorrect = userText === correctText;\n`;
    code += `    if (isCorrect) score += 2;\n`;
    code += `    const row = document.createElement("tr");\n`;
    code += `    const userClass = isCorrect ? "text-success fw-bold" : "text-danger fw-bold";\n`;
    code += `    row.innerHTML = '<td class="' + userClass + '">' + userText + '</td><td class="text-success fw-bold">' + correctText + '</td>';\n`;
    code += `    tbody.appendChild(row);\n`;
    code += `  });\n`;
    code += `  totalScoreEl.innerText = 'Score: ' + score + ' / 4';\n`;
    code += `  if (score === 4) scoreClassificationEl.innerText = "Excellent";\n`;
    code += `  else if (score >= 2) scoreClassificationEl.innerText = "Good";\n`;
    code += `  else scoreClassificationEl.innerText = "Needs Improvement";\n`;
    code += `  const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));\n`;
    code += `  resultModal.show();\n`;
    code += `}\n\n`;
    code += `const checkResultButton = document.getElementById('checkResultButton');\n`;
    code += `checkResultButton.addEventListener('click', showResults_question16);\n\n`;
    code += `let currentIndex = 0;\n\n`;
    code += `function renderQuestionByIndex(currentIndex) {\n`;
    code += `  if (currentIndex <= question16Data.length - 1) {\n`;
    code += `    renderQuestion16(question16Data[currentIndex]);\n`;
    code += `  }\n`;
    code += `  if (currentIndex === question16Data.length - 1) {\n`;
    code += `    document.getElementById('nextButton').textContent = "The end";\n`;
    code += `  }\n`;
    code += `}\n\n`;
    code += `document.getElementById('nextButton').addEventListener('click', function (e) {\n`;
    code += `  document.querySelectorAll('audio').forEach(audio => {\n`;
    code += `    if (!audio.paused) { audio.pause(); audio.currentTime = 0; }\n`;
    code += `  });\n`;
    code += `  document.querySelectorAll('i[id^="playIcon"]').forEach(icon => {\n`;
    code += `    icon.classList.remove("bi-pause-fill");\n`;
    code += `    icon.classList.add("bi-play-fill");\n`;
    code += `  });\n`;
    code += `  if (currentIndex < question16Data.length-1) {\n`;
    code += `    currentIndex++;\n`;
    code += `    renderQuestionByIndex(currentIndex);\n`;
    code += `  }\n`;
    code += `});\n\n`;
    code += `document.getElementById('backButton').addEventListener('click', function () {\n`;
    code += `  document.querySelectorAll('audio').forEach(audio => {\n`;
    code += `    if (!audio.paused) { audio.pause(); audio.currentTime = 0; }\n`;
    code += `  });\n`;
    code += `  document.querySelectorAll('i[id^="playIcon"]').forEach(icon => {\n`;
    code += `    icon.classList.remove("bi-pause-fill");\n`;
    code += `    icon.classList.add("bi-play-fill");\n`;
    code += `  });\n`;
    code += `  document.getElementById('nextButton').textContent = "Next";\n`;
    code += `  if (currentIndex > 0) currentIndex--;\n`;
    code += `  renderQuestionByIndex(currentIndex);\n`;
    code += `});\n\n`;
    code += `window.onload = function() {\n`;
    code += `    renderQuestionByIndex(0);\n`;
    code += `};\n\n`;
    code += `let timeLeft = 40 * 60;\n`;
    code += `const countdownElement = document.getElementById('countdownTimer');\n`;
    code += `function updateCountdown() {\n`;
    code += `    const minutes = Math.floor(timeLeft / 60);\n`;
    code += `    const seconds = timeLeft % 60;\n`;
    code += `    countdownElement.textContent = \`\${minutes}:\${seconds < 10 ? '0' : ''}\${seconds}\`;\n`;
    code += `    if (timeLeft > 0) {\n`;
    code += `        timeLeft--;\n`;
    code += `        setTimeout(updateCountdown, 1000);\n`;
    code += `    }\n`;
    code += `}\n`;
    code += `updateCountdown();\n\n`;
    code += `function setupPlayButton(audio, playBtn, playIcon) {\n`;
    code += `  if (playBtn.dataset.bound === "true") return;\n`;
    code += `  playBtn.dataset.bound = "true";\n`;
    code += `  playBtn.addEventListener("click", () => {\n`;
    code += `    if (audio.paused) {\n`;
    code += `      audio.play().then(() => {\n`;
    code += `        playIcon.classList.remove("bi-play-fill");\n`;
    code += `        playIcon.classList.add("bi-pause-fill");\n`;
    code += `      }).catch(err => console.error("Không phát được:", err));\n`;
    code += `    } else {\n`;
    code += `      audio.pause();\n`;
    code += `      playIcon.classList.remove("bi-pause-fill");\n`;
    code += `      playIcon.classList.add("bi-play-fill");\n`;
    code += `    }\n`;
    code += `  });\n`;
    code += `  audio.addEventListener("ended", () => {\n`;
    code += `    playIcon.classList.remove("bi-pause-fill");\n`;
    code += `    playIcon.classList.add("bi-play-fill");\n`;
    code += `  });\n`;
    code += `}\n\n`;
    code += `  } // End of init function\n\n`;
    code += `  // Execute immediately if DOM is ready, otherwise wait\n`;
    code += `  if (document.readyState === 'loading') {\n`;
    code += `    document.addEventListener('DOMContentLoaded', init);\n`;
    code += `  } else {\n`;
    code += `    init();\n`;
    code += `  }\n`;
    code += `})();\n`;
    
    return code;
}

// Escape JavaScript string
function escapeJS(str) {
    if (!str) return '';
    return str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/'/g, "\\'")
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
}

// Upload listening lesson to GitHub
async function uploadListeningLessonToGitHub() {
    if (window.currentLessonType !== 'listening') {
        alert('Vui lòng chọn Listening trước!');
        return;
    }
    
    const part = window.currentListeningPart;
    const sets = window.listeningQuestionSets[part] || [];
    
    if (sets.length === 0) {
        alert('Chưa có bộ đề nào để upload!');
        return;
    }
    
    // Generate file path and part number first
    const timestamp = Date.now();
    let filePath = '';
    let partNumber = '';
    
    if (part === '1_13') {
        filePath = `js/listening_question/listening_question1_13_lesson_${timestamp}.js`;
        partNumber = 'listening_1_13';
    } else if (part === '14') {
        filePath = `js/listening_question/listening_question14_lesson_${timestamp}.js`;
        partNumber = 'listening_14';
    } else if (part === '15') {
        filePath = `js/listening_question/listening_question15_lesson_${timestamp}.js`;
        partNumber = 'listening_15';
    } else if (part === '16_17') {
        filePath = `js/listening_question/listening_question16_17_lesson_${timestamp}.js`;
        partNumber = 'listening_16_17';
    }
    
    // Generate JS code
    let jsCode = generateListeningJSCode(part, sets);
    
    if (!jsCode) {
        alert('Không thể generate JS code!');
        return;
    }
    
    jsCode = appendLessonDataComment(jsCode, {
        version: 1,
        lessonType: 'listening',
        part: partNumber,
        sets
    });
    
    // Get title from first set
    const title = sets[0]?.title || `Listening ${part} Lesson`;
    const topic = sets[0]?.topic || '';
    
    try {
        const response = await fetch('/api/upload-lesson', {
            method: 'POST',
            headers: getJsonAuthHeaders(),
            body: JSON.stringify({
                filePath: filePath,
                content: jsCode,
                message: `Upload listening lesson: ${title}`,
                title: title,
                topic: topic,
                lessonType: 'listening',
                part: partNumber
            })
        });
        
        const rawResponse = await response.text();
        let result = null;
        try {
            result = rawResponse ? JSON.parse(rawResponse) : null;
        } catch (parseError) {
            console.warn('Không parse được JSON từ /api/upload-lesson:', parseError, rawResponse);
        }
        
        if (!response.ok) {
            const errorMessage = result?.error || result?.details || rawResponse || 'Upload failed';
            throw new Error(errorMessage);
        }
        
        alert('Upload thành công!');
        console.log('Upload result:', result || rawResponse);
        
    } catch (error) {
        console.error('Upload error:', error);
        if (error.message !== 'AUTH_TOKEN_MISSING') {
        alert('Lỗi khi upload: ' + error.message);
        }
    }
}

// Make upload function globally available
window.uploadListeningLessonToGitHub = uploadListeningLessonToGitHub;

// Global upload handler that routes to correct function
window.handleUploadToGitHub = async function() {
    const currentLessonType = window.currentLessonType || 'reading';
    
    if (currentLessonType === 'listening') {
        return await uploadListeningLessonToGitHub();
    } else {
        return await uploadLessonToGitHub();
    }
};

// ============================================
// Preview Functions
// ============================================

// Preview Listening Lesson Interface
function previewListeningLessonInterface() {
    const part = window.currentListeningPart || '14';
    const sets = window.listeningQuestionSets[part] || [];
    
    if (sets.length === 0) {
        alert('Chưa có bộ đề nào. Vui lòng thêm bộ đề trước khi preview.');
        return;
    }
    
    // Initialize preview state
    window.previewCurrentSetIndex = 0;
    window.previewSets = sets;
    window.previewPart = part;
    window.previewUserAnswers = {}; // Reset user answers
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('lessonPreviewModal'));
    const partLabel = part === '1_13' ? '1-13' : part === '16_17' ? '16-17' : part;
    document.getElementById('preview-part-number').textContent = `Listening ${partLabel}`;
    
    // Render preview content
    renderListeningPreview();
    
    modal.show();
}

// Render listening preview
function renderListeningPreview() {
    const previewContent = document.getElementById('lesson-preview-content');
    previewContent.innerHTML = '';
    
    const currentIndex = window.previewCurrentSetIndex || 0;
    const sets = window.previewSets || [];
    const part = window.previewPart || '14';
    
    if (sets.length === 0) {
        previewContent.innerHTML = '<div class="alert alert-warning">Không có bộ đề để hiển thị.</div>';
        return;
    }
    
    // Render based on part
    if (part === '1_13') {
        renderListening1_13Preview(previewContent, sets, currentIndex);
    } else if (part === '14') {
        renderListening14Preview(previewContent, sets, currentIndex);
    } else if (part === '15') {
        renderListening15Preview(previewContent, sets, currentIndex);
    } else if (part === '16_17') {
        renderListening16_17Preview(previewContent, sets, currentIndex);
    }
}

// Render Listening Question 1-13 Preview
function renderListening1_13Preview(container, sets, currentIndex) {
    if (sets.length === 0) return;
    
    const currentSet = sets[currentIndex] || sets[0];
    const questions = currentSet.questions || [];
    
    let html = `
        <div class="container-fluid p-4">
            <div class="row">
                <div class="col-12">
                    <h3 class="mb-4">${currentSet.title || 'Listening Question 1-13'}</h3>
                    <div class="card">
                        <div class="card-body">
    `;
    
    questions.forEach((q, index) => {
        html += `
            <div class="mb-4 p-3 border rounded" data-question-index="${index}">
                <h5 class="mb-2">${q.heading || `Question ${index + 1} of 17`}</h5>
                ${q.audioUrl ? `
                    <div class="mb-3">
                        <audio controls class="w-100">
                            <source src="${q.audioUrl}" type="audio/mpeg">
                        </audio>
                    </div>
                ` : ''}
                <p class="fw-bold mb-3">${q.question || ''}</p>
                <div class="mb-3">
        `;
        
        q.options.forEach((option, optIndex) => {
            html += `
                <div class="form-check mb-2">
                    <input class="form-check-input" type="radio" name="question_${index}" id="q${index}_opt${optIndex}" value="${option}">
                    <label class="form-check-label" for="q${index}_opt${optIndex}">
                        ${option}
                    </label>
                </div>
            `;
        });
        
        html += `
                </div>
                <button class="btn btn-sm btn-outline-secondary" onclick="toggleTranscript(${index})">
                    Show Transcript
                </button>
                <div id="transcript_${index}" class="mt-2 p-2 bg-light rounded" style="display: none;">
                    ${q.transcript || ''}
                </div>
            </div>
        `;
    });
    
    html += `
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Render Listening Question 14 Preview
function renderListening14Preview(container, sets, currentIndex) {
    if (sets.length === 0) return;
    
    const currentSet = sets[currentIndex] || sets[0];
    
    let html = `
        <div class="container-fluid p-4">
            <div class="row">
                <div class="col-12">
                    <h3 class="mb-4">${currentSet.title || 'Listening Question 14'}</h3>
                    <div class="card">
                        <div class="card-body">
                            <h5 class="mb-3">${currentSet.topic || ''}</h5>
                            ${currentSet.audioUrl ? `
                                <div class="mb-3">
                                    <audio controls class="w-100">
                                        <source src="${currentSet.audioUrl}" type="audio/mpeg">
                                    </audio>
                                </div>
                            ` : ''}
                            <p class="mb-3">Select 4 correct answers from the options below:</p>
                            <div class="row">
    `;
    
    currentSet.options.forEach((option, index) => {
        html += `
            <div class="col-md-6 mb-2">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="option_${index}" id="opt_${index}" value="${option}">
                    <label class="form-check-label" for="opt_${index}">
                        ${option}
                    </label>
                </div>
            </div>
        `;
    });
    
    html += `
                            </div>
                            <button class="btn btn-sm btn-outline-secondary mt-3" onclick="toggleTranscript14()">
                                Show Transcript
                            </button>
                            <div id="transcript_14" class="mt-2 p-2 bg-light rounded" style="display: none;">
                                ${currentSet.transcript || ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Render Listening Question 15 Preview
function renderListening15Preview(container, sets, currentIndex) {
    if (sets.length === 0) return;
    
    const currentSet = sets[currentIndex] || sets[0];
    
    let html = `
        <div class="container-fluid p-4">
            <div class="row">
                <div class="col-12">
                    <h3 class="mb-4">${currentSet.title || 'Listening Question 15'}</h3>
                    <div class="card">
                        <div class="card-body">
                            <h5 class="mb-3">${currentSet.topic || ''}</h5>
                            ${currentSet.audioUrl ? `
                                <div class="mb-3">
                                    <audio controls class="w-100">
                                        <source src="${currentSet.audioUrl}" type="audio/mpeg">
                                    </audio>
                                </div>
                            ` : ''}
    `;
    
    currentSet.questions.forEach((question, index) => {
        html += `
            <div class="mb-3">
                <p class="fw-bold">${question}</p>
                <select class="form-select" name="answer_${index}">
                    <option value="">-- Select an answer --</option>
                    <option value="Man">Man</option>
                    <option value="Woman">Woman</option>
                    <option value="Both">Both</option>
                </select>
            </div>
        `;
    });
    
    html += `
                            <button class="btn btn-sm btn-outline-secondary mt-3" onclick="toggleTranscript15()">
                                Show Transcript
                            </button>
                            <div id="transcript_15" class="mt-2 p-2 bg-light rounded" style="display: none;">
                                ${currentSet.transcript || ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Render Listening Question 16-17 Preview
function renderListening16_17Preview(container, sets, currentIndex) {
    if (sets.length === 0) return;
    
    const currentSet = sets[currentIndex] || sets[0];
    
    let html = `
        <div class="container-fluid p-4">
            <div class="row">
                <div class="col-12">
                    <h3 class="mb-4">${currentSet.title || 'Listening Question 16-17'}</h3>
    `;
    
    // Question 16
    if (currentSet.question16) {
        html += `
            <div class="card mb-4">
                <div class="card-header">
                    <h5>Question 16</h5>
                    <p class="mb-0">${currentSet.question16.topic || ''}</p>
                </div>
                <div class="card-body">
                    ${currentSet.question16.audioUrl ? `
                        <div class="mb-3">
                            <audio controls class="w-100">
                                <source src="${currentSet.question16.audioUrl}" type="audio/mpeg">
                            </audio>
                        </div>
                    ` : ''}
        `;
        
        currentSet.question16.questions.forEach((q, index) => {
            html += `
                <div class="mb-3">
                    <p class="fw-bold">${q.id}. ${q.question}</p>
                    <div class="ms-3">
            `;
            q.options.forEach((option, optIndex) => {
                html += `
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="radio" name="q16_${q.id}" id="q16_${q.id}_opt${optIndex}" value="${option}">
                        <label class="form-check-label" for="q16_${q.id}_opt${optIndex}">
                            ${option}
                        </label>
                    </div>
                `;
            });
            html += `
                    </div>
                </div>
            `;
        });
        
        html += `
                    <button class="btn btn-sm btn-outline-secondary" onclick="toggleTranscript16()">
                        Show Transcript
                    </button>
                    <div id="transcript_16" class="mt-2 p-2 bg-light rounded" style="display: none;">
                        ${currentSet.question16.transcript || ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Question 17
    if (currentSet.question17) {
        html += `
            <div class="card">
                <div class="card-header">
                    <h5>Question 17</h5>
                    <p class="mb-0">${currentSet.question17.topic || ''}</p>
                </div>
                <div class="card-body">
                    ${currentSet.question17.audioUrl ? `
                        <div class="mb-3">
                            <audio controls class="w-100">
                                <source src="${currentSet.question17.audioUrl}" type="audio/mpeg">
                            </audio>
                        </div>
                    ` : ''}
        `;
        
        currentSet.question17.questions.forEach((q, index) => {
            html += `
                <div class="mb-3">
                    <p class="fw-bold">${q.id}. ${q.question}</p>
                    <div class="ms-3">
            `;
            q.options.forEach((option, optIndex) => {
                html += `
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="radio" name="q17_${q.id}" id="q17_${q.id}_opt${optIndex}" value="${option}">
                        <label class="form-check-label" for="q17_${q.id}_opt${optIndex}">
                            ${option}
                        </label>
                    </div>
                `;
            });
            html += `
                    </div>
                </div>
            `;
        });
        
        html += `
                    <button class="btn btn-sm btn-outline-secondary" onclick="toggleTranscript17()">
                        Show Transcript
                    </button>
                    <div id="transcript_17" class="mt-2 p-2 bg-light rounded" style="display: none;">
                        ${currentSet.question17.transcript || ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    html += `
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Helper functions for transcript toggle
window.toggleTranscript = function(index) {
    const transcript = document.getElementById(`transcript_${index}`);
    if (transcript) {
        transcript.style.display = transcript.style.display === 'none' ? 'block' : 'none';
    }
};

window.toggleTranscript14 = function() {
    const transcript = document.getElementById('transcript_14');
    if (transcript) {
        transcript.style.display = transcript.style.display === 'none' ? 'block' : 'none';
    }
};

window.toggleTranscript15 = function() {
    const transcript = document.getElementById('transcript_15');
    if (transcript) {
        transcript.style.display = transcript.style.display === 'none' ? 'block' : 'none';
    }
};

window.toggleTranscript16 = function() {
    const transcript = document.getElementById('transcript_16');
    if (transcript) {
        transcript.style.display = transcript.style.display === 'none' ? 'block' : 'none';
    }
};

window.toggleTranscript17 = function() {
    const transcript = document.getElementById('transcript_17');
    if (transcript) {
        transcript.style.display = transcript.style.display === 'none' ? 'block' : 'none';
    }
};

// Make preview function globally available
window.previewListeningLessonInterface = previewListeningLessonInterface;

// Update next/previous preview functions to support listening
// Store original functions if they exist
if (!window._originalNextPreviewSet) {
    window._originalNextPreviewSet = window.nextPreviewSet;
}
if (!window._originalPreviousPreviewSet) {
    window._originalPreviousPreviewSet = window.previousPreviewSet;
}

// Override next/previous functions to support both reading and listening
window.nextPreviewSet = function() {
    const currentLessonType = window.currentLessonType || 'reading';
    
    if (currentLessonType === 'listening') {
        const currentIndex = window.previewCurrentSetIndex || 0;
        const sets = window.previewSets || [];
        
        if (currentIndex < sets.length - 1) {
            window.previewCurrentSetIndex = currentIndex + 1;
            renderListeningPreview();
            const previewContent = document.getElementById('lesson-preview-content');
            if (previewContent) {
                previewContent.scrollTop = 0;
            }
        }
    } else {
        // Use original reading preview function
        if (window._originalNextPreviewSet) {
            window._originalNextPreviewSet();
        }
    }
};

window.previousPreviewSet = function() {
    const currentLessonType = window.currentLessonType || 'reading';
    
    if (currentLessonType === 'listening') {
        const currentIndex = window.previewCurrentSetIndex || 0;
        
        if (currentIndex > 0) {
            window.previewCurrentSetIndex = currentIndex - 1;
            renderListeningPreview();
            const previewContent = document.getElementById('lesson-preview-content');
            if (previewContent) {
                previewContent.scrollTop = 0;
            }
        }
    } else {
        // Use original reading preview function
        if (window._originalPreviousPreviewSet) {
            window._originalPreviousPreviewSet();
        }
    }
};

// ============================================
// Save Question Sets Functions (Direct Input Forms)
// ============================================

function saveListeningPart1_13Set() {
    const titleInput = document.getElementById('listening-part1_13-title-input');
    const title = titleInput ? titleInput.value.trim() : '';
    
    // Collect questions from the direct input form
    const questions = [];
    const container = document.getElementById('listening-part1_13-questions-container');
    if (!container) {
        alert('Không tìm thấy container câu hỏi!');
        return;
    }
    
    container.querySelectorAll('.question-item').forEach((item, index) => {
        const heading = item.querySelector('[data-field="heading"]')?.value.trim() || `Question ${index + 1} of 17`;
        const question = item.querySelector('[data-field="question"]')?.value.trim() || '';
        const option1 = item.querySelector('[data-field="option1"]')?.value.trim() || '';
        const option2 = item.querySelector('[data-field="option2"]')?.value.trim() || '';
        const option3 = item.querySelector('[data-field="option3"]')?.value.trim() || '';
        const correctAnswerField = item.querySelector('[data-field="correctAnswer"]')?.value.trim() || '';
        const transcript = item.querySelector('[data-field="transcript"]')?.value.trim() || '';
        
        if (!question || !option1 || !option2 || !option3 || !correctAnswerField) {
            return; // Skip incomplete questions
        }
        
        // Determine correct answer
        let correctAnswer = '';
        if (correctAnswerField === option1) correctAnswer = option1;
        else if (correctAnswerField === option2) correctAnswer = option2;
        else if (correctAnswerField === option3) correctAnswer = option3;
        else correctAnswer = correctAnswerField;
        
        // Get audio URL if uploaded
        const audioInput = item.querySelector('[data-field="audio"]');
        let audioUrl = audioInput?.dataset.audioUrl || `audio/question1_13/audio_q${index + 1}.mp3`;
        
        questions.push({
            heading: heading,
            audioUrl: audioUrl,
            question: question,
            options: [option1, option2, option3],
            correctAnswer: correctAnswer,
            transcript: transcript
        });
    });
    
    if (questions.length === 0) {
        alert('Vui lòng nhập ít nhất một câu hỏi!');
        return;
    }
    
    // Create new set
    const newSet = {
        id: window.listeningQuestionSets['1_13'].length + 1,
        title: title || `Bộ đề ${window.listeningQuestionSets['1_13'].length + 1}`,
        questions: questions
    };
    
    // Add to storage
    window.listeningQuestionSets['1_13'].push(newSet);
    
    // Clear form
    if (titleInput) titleInput.value = '';
    container.innerHTML = '';
    addListeningQuestion1_13();
    
    // Render sets
    renderListeningQuestionSets('1_13');
    
    alert('Đã lưu bộ đề thành công!');
}

function saveListeningPart14Set() {
    const titleInput = document.getElementById('listening-part14-title-input');
    const topicInput = document.getElementById('listening-part14-topic-input');
    const transcriptInput = document.getElementById('listening-part14-transcript-input');
    const title = titleInput ? titleInput.value.trim() : '';
    const topic = topicInput ? topicInput.value.trim() : '';
    const transcript = transcriptInput ? transcriptInput.value.trim() : '';
    
    if (!topic || !transcript) {
        alert('Vui lòng điền đầy đủ Topic và Transcript!');
        return;
    }
    
    // Collect options
    const container = document.getElementById('listening-part14-options-container');
    if (!container) {
        alert('Không tìm thấy container options!');
        return;
    }
    
    const options = [];
    container.querySelectorAll('input[data-field^="option"]').forEach(input => {
        const value = input.value.trim();
        if (value) {
            options.push(value);
        }
    });
    
    if (options.length < 6) {
        alert('Vui lòng thêm đủ 6 options!');
        return;
    }
    
    // Get audio URL if uploaded
    const audioInput = document.getElementById('listening-part14-audio-input');
    const audioUrlInput = document.getElementById('listening-part14-audio-url-input');
    let audioUrl = audioInput?.dataset.audioUrl || audioUrlInput?.value.trim() || `audio/question14/audio_${Date.now()}.mp3`;
    
    // Create new set
    const newSet = {
        id: window.listeningQuestionSets['14'].length + 1,
        title: title || `Bộ đề ${window.listeningQuestionSets['14'].length + 1}`,
        topic: topic,
        audioUrl: audioUrl,
        options: options,
        transcript: transcript
    };
    
    // Add to storage
    window.listeningQuestionSets['14'].push(newSet);
    
    // Clear form
    if (titleInput) titleInput.value = '';
    if (topicInput) topicInput.value = '';
    if (transcriptInput) transcriptInput.value = '';
    if (audioInput) {
        audioInput.value = '';
        audioInput.dataset.audioUrl = '';
    }
    if (audioUrlInput) audioUrlInput.value = '';
    container.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        addListeningQuestion14Option();
    }
    
    // Render sets
    renderListeningQuestionSets('14');
    
    alert('Đã lưu bộ đề thành công!');
}

function saveListeningPart15Set() {
    const titleInput = document.getElementById('listening-part15-title-input');
    const topicInput = document.getElementById('listening-part15-topic-input');
    const transcriptInput = document.getElementById('listening-part15-transcript-input');
    const title = titleInput ? titleInput.value.trim() : '';
    const topic = topicInput ? topicInput.value.trim() : '';
    const transcript = transcriptInput ? transcriptInput.value.trim() : '';
    
    if (!topic || !transcript) {
        alert('Vui lòng điền đầy đủ Topic và Transcript!');
        return;
    }
    
    // Collect questions
    const questionsContainer = document.getElementById('listening-part15-questions-container');
    const answersContainer = document.getElementById('listening-part15-answers-container');
    
    if (!questionsContainer || !answersContainer) {
        alert('Không tìm thấy container câu hỏi hoặc đáp án!');
        return;
    }
    
    const questions = [];
    const correctAnswer = [];
    
    questionsContainer.querySelectorAll('input[data-field^="question"]').forEach((input, index) => {
        const question = input.value.trim();
        if (question) {
            questions.push(question);
        }
    });
    
    answersContainer.querySelectorAll('select[data-field^="answer"]').forEach((select, index) => {
        const answer = select.value;
        if (answer) {
            correctAnswer.push(answer);
        }
    });
    
    if (questions.length !== 4 || correctAnswer.length !== 4) {
        alert('Vui lòng thêm đủ 4 câu hỏi và 4 đáp án!');
        return;
    }
    
    // Get audio URL if uploaded
    const audioInput = document.getElementById('listening-part15-audio-input');
    const audioUrlInput = document.getElementById('listening-part15-audio-url-input');
    let audioUrl = audioInput?.dataset.audioUrl || audioUrlInput?.value.trim() || `audio/question15/audio_${Date.now()}.mp3`;
    
    // Create new set
    const newSet = {
        id: window.listeningQuestionSets['15'].length + 1,
        title: title || `Bộ đề ${window.listeningQuestionSets['15'].length + 1}`,
        topic: topic,
        audioUrl: audioUrl,
        questions: questions,
        correctAnswer: correctAnswer,
        transcript: transcript
    };
    
    // Add to storage
    window.listeningQuestionSets['15'].push(newSet);
    
    // Clear form
    if (titleInput) titleInput.value = '';
    if (topicInput) topicInput.value = '';
    if (transcriptInput) transcriptInput.value = '';
    if (audioInput) {
        audioInput.value = '';
        audioInput.dataset.audioUrl = '';
    }
    if (audioUrlInput) audioUrlInput.value = '';
    questionsContainer.innerHTML = '';
    answersContainer.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        addListeningQuestion15Question();
    }
    
    // Render sets
    renderListeningQuestionSets('15');
    
    alert('Đã lưu bộ đề thành công!');
}

function saveListeningPart16_17Set() {
    const titleInput = document.getElementById('listening-part16_17-title-input');
    const title = titleInput ? titleInput.value.trim() : '';
    
    if (!title) {
        alert('Vui lòng nhập tiêu đề bộ đề!');
        return;
    }
    
    // Question 16
    const topic16Input = document.getElementById('listening-part16-topic-input');
    const transcript16Input = document.getElementById('listening-part16-transcript-input');
    const container16 = document.getElementById('listening-part16-questions-container');
    const topic16 = topic16Input ? topic16Input.value.trim() : '';
    const transcript16 = transcript16Input ? transcript16Input.value.trim() : '';
    
    const questions16 = [];
    if (container16) {
        container16.querySelectorAll('.question-item').forEach(item => {
            const id = item.querySelector('[data-field="id"]')?.value.trim() || '';
            const question = item.querySelector('[data-field="question"]')?.value.trim() || '';
            const option1 = item.querySelector('[data-field="option1"]')?.value.trim() || '';
            const option2 = item.querySelector('[data-field="option2"]')?.value.trim() || '';
            const option3 = item.querySelector('[data-field="option3"]')?.value.trim() || '';
            
            if (id && question && option1 && option2 && option3) {
                questions16.push({
                    id: id,
                    question: question,
                    options: [option1, option2, option3]
                });
            }
        });
    }
    
    // Question 17
    const topic17Input = document.getElementById('listening-part17-topic-input');
    const transcript17Input = document.getElementById('listening-part17-transcript-input');
    const container17 = document.getElementById('listening-part17-questions-container');
    const topic17 = topic17Input ? topic17Input.value.trim() : '';
    const transcript17 = transcript17Input ? transcript17Input.value.trim() : '';
    
    const questions17 = [];
    if (container17) {
        container17.querySelectorAll('.question-item').forEach(item => {
            const id = item.querySelector('[data-field="id"]')?.value.trim() || '';
            const question = item.querySelector('[data-field="question"]')?.value.trim() || '';
            const option1 = item.querySelector('[data-field="option1"]')?.value.trim() || '';
            const option2 = item.querySelector('[data-field="option2"]')?.value.trim() || '';
            const option3 = item.querySelector('[data-field="option3"]')?.value.trim() || '';
            
            if (id && question && option1 && option2 && option3) {
                questions17.push({
                    id: id,
                    question: question,
                    options: [option1, option2, option3]
                });
            }
        });
    }
    
    if (questions16.length < 2 || questions17.length < 2) {
        alert('Vui lòng thêm đủ 2 câu hỏi cho mỗi Question 16 và 17!');
        return;
    }
    
    // Get audio URLs if uploaded
    const audio16Input = document.getElementById('listening-part16-audio-input');
    const audio16UrlInput = document.getElementById('listening-part16-audio-url-input');
    const audio17Input = document.getElementById('listening-part17-audio-input');
    const audio17UrlInput = document.getElementById('listening-part17-audio-url-input');
    
    const audio16Url = audio16Input?.dataset.audioUrl || audio16UrlInput?.value.trim() || 'audio/question16/no_audio.mp3';
    const audio17Url = audio17Input?.dataset.audioUrl || audio17UrlInput?.value.trim() || 'audio/question17/no_audio.mp3';
    
    // Create new set
    const newSet = {
        id: window.listeningQuestionSets['16_17'].length + 1,
        title: title,
        question16: {
            topic: topic16,
            audioUrl: audio16Url,
            questions: questions16,
            transcript: transcript16
        },
        question17: {
            topic: topic17,
            audioUrl: audio17Url,
            questions: questions17,
            transcript: transcript17
        }
    };
    
    // Add to storage
    window.listeningQuestionSets['16_17'].push(newSet);
    
    // Clear form
    if (titleInput) titleInput.value = '';
    if (topic16Input) topic16Input.value = '';
    if (transcript16Input) transcript16Input.value = '';
    if (topic17Input) topic17Input.value = '';
    if (transcript17Input) transcript17Input.value = '';
    if (container16) container16.innerHTML = '';
    if (container17) container17.innerHTML = '';
    if (audio16Input) {
        audio16Input.value = '';
        audio16Input.dataset.audioUrl = '';
    }
    if (audio16UrlInput) audio16UrlInput.value = '';
    if (audio17Input) {
        audio17Input.value = '';
        audio17Input.dataset.audioUrl = '';
    }
    if (audio17UrlInput) audio17UrlInput.value = '';
    
    // Reinitialize
    addListeningQuestion16Question();
    addListeningQuestion16Question();
    addListeningQuestion17Question();
    addListeningQuestion17Question();
    
    // Render sets
    renderListeningQuestionSets('16_17');
    
    alert('Đã lưu bộ đề thành công!');
}

