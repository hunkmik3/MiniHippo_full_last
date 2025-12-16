(function () {
    const moduleRoot = document.getElementById('listening-set-module');
    if (!moduleRoot && !document.getElementById('listening-set-list')) {
        return;
    }

    const refs = {
        list: document.getElementById('listening-set-list'),
        emptyState: document.getElementById('listening-set-empty'),
        formCard: document.getElementById('listening-set-form-card'),
        formTitle: document.getElementById('listening-set-form-title'),
        titleInput: document.getElementById('listening-set-title'),
        durationInput: document.getElementById('listening-set-duration'),
        descriptionInput: document.getElementById('listening-set-description'),
        part1Count: document.getElementById('listening-part1-count'),
        part1Container: document.getElementById('listening-part1-questions'),
        part2Topic: document.getElementById('listening-part2-topic'),
        part2Options: document.getElementById('listening-part2-options'),
        part2Answers: document.getElementById('listening-part2-answers'),
        part2Transcript: document.getElementById('listening-part2-transcript'),
        part3Topic: document.getElementById('listening-part3-topic'),
        part3Questions: document.getElementById('listening-part3-questions'),
        part3Answers: document.getElementById('listening-part3-answers'),
        part3Transcript: document.getElementById('listening-part3-transcript'),
        part4Container: document.getElementById('listening-part4-questions'),
        saveBtn: document.getElementById('saveListeningSetBtn'),
        createBtn: document.getElementById('createListeningSetBtn'),
        refreshBtn: document.getElementById('refreshListeningSetsBtn'),
        cancelBtn: document.getElementById('cancelListeningSetBtn'),
        cancelBtn2: document.getElementById('cancelListeningSetBtn2'),
        addPart1Btn: document.getElementById('addListeningPart1QuestionBtn'),
        addPart4Btn: document.getElementById('addListeningPart4QuestionBtn')
    };

    const state = {
        sets: [],
        editingId: null
    };

    // Helper function to build authorized headers
    function buildAuthHeaders(additionalHeaders = {}) {
        if (typeof window.buildAuthorizedHeaders === 'function') {
            return window.buildAuthorizedHeaders(additionalHeaders);
        }
        
        const token = localStorage.getItem('auth_token');
        if (!token) {
            alert('Bạn chưa đăng nhập. Vui lòng đăng nhập lại.');
            window.location.href = '/login.html';
            throw new Error('AUTH_TOKEN_MISSING');
        }
        
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...additionalHeaders
        };
    }

    // Part 1: Questions 1-13
    function createPart1QuestionRow(data = {}) {
        const wrapper = document.createElement('div');
        wrapper.className = 'question-item';
        const index = refs.part1Container.children.length + 1;
        wrapper.innerHTML = `
            <div class="d-flex justify-content-between mb-2">
                <h6 class="mb-0">Câu <span class="listening-part1-index">${index}</span></h6>
                <button type="button" class="btn btn-sm btn-outline-danger">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row g-2">
                <div class="col-12">
                    <label class="form-label small">Chọn file MP3</label>
                    <input type="file" class="form-control form-control-sm listening-part1-audio-file" accept="audio/mp3,audio/mpeg,.mp3">
                    <input type="hidden" class="listening-part1-audio" value="${data.audioUrl || ''}">
                    <div class="form-text small">Hoặc nhập URL: <input type="text" class="form-control form-control-sm mt-1 listening-part1-audio-url" 
                           value="${data.audioUrl || ''}" 
                           placeholder="audio/question1_13/audio_q1.mp3"></div>
                    <div class="listening-part1-audio-status small mt-1"></div>
                </div>
                <div class="col-12">
                    <label class="form-label small">Câu hỏi</label>
                    <input type="text" class="form-control form-control-sm listening-part1-question" 
                           value="${data.question || ''}" 
                           placeholder="What is not original?">
                </div>
                <div class="col-md-4">
                    <label class="form-label small">Option 1</label>
                    <input type="text" class="form-control form-control-sm listening-part1-option" 
                           value="${data.options?.[0] || ''}" 
                           placeholder="Option 1">
                </div>
                <div class="col-md-4">
                    <label class="form-label small">Option 2</label>
                    <input type="text" class="form-control form-control-sm listening-part1-option" 
                           value="${data.options?.[1] || ''}" 
                           placeholder="Option 2">
                </div>
                <div class="col-md-4">
                    <label class="form-label small">Option 3</label>
                    <input type="text" class="form-control form-control-sm listening-part1-option" 
                           value="${data.options?.[2] || ''}" 
                           placeholder="Option 3">
                </div>
                <div class="col-md-6">
                    <label class="form-label small">Đáp án đúng</label>
                    <input type="text" class="form-control form-control-sm listening-part1-answer" 
                           value="${data.correctAnswer || ''}" 
                           placeholder="Correct answer">
                </div>
                <div class="col-12">
                    <label class="form-label small">Transcript</label>
                    <textarea class="form-control form-control-sm listening-part1-transcript" rows="3" 
                              placeholder="Transcript text...">${data.transcript || ''}</textarea>
                </div>
            </div>
        `;
        
        wrapper.querySelector('.btn-outline-danger').addEventListener('click', () => {
            wrapper.remove();
            refreshPart1Indexes();
        });
        
        // Setup audio file upload
        const audioFileInput = wrapper.querySelector('.listening-part1-audio-file');
        const audioUrlInput = wrapper.querySelector('.listening-part1-audio');
        const audioUrlTextInput = wrapper.querySelector('.listening-part1-audio-url');
        const audioStatus = wrapper.querySelector('.listening-part1-audio-status');
        
        if (audioFileInput) {
            // Ensure it's a file input, not directory
            audioFileInput.removeAttribute('webkitdirectory');
            audioFileInput.removeAttribute('directory');
            audioFileInput.removeAttribute('multiple');
            audioFileInput.setAttribute('type', 'file');
            audioFileInput.setAttribute('accept', 'audio/mp3,audio/mpeg,.mp3');
            
            audioFileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                // Validate it's actually a file, not a directory
                if (file.size === 0 && file.type === '') {
                    audioStatus.innerHTML = '<span class="text-danger"><i class="bi bi-x-circle me-1"></i>Vui lòng chọn file MP3, không phải folder!</span>';
                    e.target.value = ''; // Clear selection
                    return;
                }
                
                audioStatus.innerHTML = '<span class="text-info"><i class="spinner-border spinner-border-sm me-1"></i>Đang upload...</span>';
                
                try {
                    const audioUrl = await uploadAudioFile(file, `audio/listening/question1_13/${file.name}`);
                    audioUrlInput.value = audioUrl;
                    if (audioUrlTextInput) audioUrlTextInput.value = audioUrl;
                    audioStatus.innerHTML = '<span class="text-success"><i class="bi bi-check-circle me-1"></i>Upload thành công!</span>';
                } catch (error) {
                    audioStatus.innerHTML = `<span class="text-danger"><i class="bi bi-x-circle me-1"></i>Lỗi: ${error.message}</span>`;
                }
            });
        }
        
        if (audioUrlTextInput) {
            audioUrlTextInput.addEventListener('input', (e) => {
                audioUrlInput.value = e.target.value.trim();
            });
        }
        
        return wrapper;
    }
    
    // Upload audio file function
    async function uploadAudioFile(file, filePath) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = reader.result.split(',')[1];
                try {
                    const response = await fetch('/api/upload-audio', {
                        method: 'POST',
                        headers: buildAuthHeaders(),
                        body: JSON.stringify({
                            filePath,
                            content: base64,
                            message: `Upload audio ${filePath}`
                        })
                    });
                    
                    // Get response text first (can only read once)
                    const responseText = await response.text();
                    
                    // Check if response is ok before parsing
                    if (!response.ok) {
                        let errorMessage = 'Upload failed';
                        try {
                            const errorData = JSON.parse(responseText);
                            errorMessage = errorData.error || errorData.details || errorMessage;
                        } catch (parseError) {
                            // If response is not JSON, use text as error message
                            errorMessage = responseText || `Server error: ${response.status} ${response.statusText}`;
                        }
                        throw new Error(errorMessage);
                    }
                    
                    // Parse JSON response
                    let result;
                    try {
                        result = JSON.parse(responseText);
                    } catch (parseError) {
                        throw new Error(`Invalid response from server: ${responseText.substring(0, 200)}`);
                    }
                    
                    if (!result.rawUrl) {
                        throw new Error('Server did not return audio URL');
                    }
                    
                    resolve(result.rawUrl);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }
    
    // Setup Part 2 audio upload
    function setupPart2AudioUpload() {
        const audioFileInput = document.getElementById('listening-part2-audio-file');
        const audioUrlInput = document.getElementById('listening-part2-audio');
        const audioUrlTextInput = document.getElementById('listening-part2-audio-url');
        const audioStatus = document.getElementById('listening-part2-audio-status');
        
        if (audioFileInput) {
            // Ensure it's a file input, not directory
            audioFileInput.removeAttribute('webkitdirectory');
            audioFileInput.removeAttribute('directory');
            audioFileInput.removeAttribute('multiple');
            audioFileInput.setAttribute('type', 'file');
            audioFileInput.setAttribute('accept', 'audio/mp3,audio/mpeg,.mp3');
            
            audioFileInput.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                // Validate it's actually a file, not a directory
                if (file.size === 0 && file.type === '') {
                    if (audioStatus) audioStatus.innerHTML = '<span class="text-danger"><i class="bi bi-x-circle me-1"></i>Vui lòng chọn file MP3, không phải folder!</span>';
                    e.target.value = ''; // Clear selection
                    return;
                }
                
                if (audioStatus) audioStatus.innerHTML = '<span class="text-info"><i class="spinner-border spinner-border-sm me-1"></i>Đang upload...</span>';
                
                try {
                    const audioUrl = await uploadAudioFile(file, `audio/listening/question14/${file.name}`);
                    if (audioUrlInput) audioUrlInput.value = audioUrl;
                    if (audioUrlTextInput) audioUrlTextInput.value = audioUrl;
                    if (audioStatus) audioStatus.innerHTML = '<span class="text-success"><i class="bi bi-check-circle me-1"></i>Upload thành công!</span>';
                } catch (error) {
                    if (audioStatus) audioStatus.innerHTML = `<span class="text-danger"><i class="bi bi-x-circle me-1"></i>Lỗi: ${error.message}</span>`;
                }
            };
        }
        
        if (audioUrlTextInput) {
            audioUrlTextInput.oninput = (e) => {
                if (audioUrlInput) audioUrlInput.value = e.target.value.trim();
            };
        }
    }
    
    // Setup Part 3 audio upload
    function setupPart3AudioUpload() {
        const audioFileInput = document.getElementById('listening-part3-audio-file');
        const audioUrlInput = document.getElementById('listening-part3-audio');
        const audioUrlTextInput = document.getElementById('listening-part3-audio-url');
        const audioStatus = document.getElementById('listening-part3-audio-status');
        
        if (audioFileInput) {
            // Ensure it's a file input, not directory
            audioFileInput.removeAttribute('webkitdirectory');
            audioFileInput.removeAttribute('directory');
            audioFileInput.removeAttribute('multiple');
            audioFileInput.setAttribute('type', 'file');
            audioFileInput.setAttribute('accept', 'audio/mp3,audio/mpeg,.mp3');
            
            audioFileInput.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                // Validate it's actually a file, not a directory
                if (file.size === 0 && file.type === '') {
                    if (audioStatus) audioStatus.innerHTML = '<span class="text-danger"><i class="bi bi-x-circle me-1"></i>Vui lòng chọn file MP3, không phải folder!</span>';
                    e.target.value = ''; // Clear selection
                    return;
                }
                
                if (audioStatus) audioStatus.innerHTML = '<span class="text-info"><i class="spinner-border spinner-border-sm me-1"></i>Đang upload...</span>';
                
                try {
                    const audioUrl = await uploadAudioFile(file, `audio/listening/question15/${file.name}`);
                    if (audioUrlInput) audioUrlInput.value = audioUrl;
                    if (audioUrlTextInput) audioUrlTextInput.value = audioUrl;
                    if (audioStatus) audioStatus.innerHTML = '<span class="text-success"><i class="bi bi-check-circle me-1"></i>Upload thành công!</span>';
                } catch (error) {
                    if (audioStatus) audioStatus.innerHTML = `<span class="text-danger"><i class="bi bi-x-circle me-1"></i>Lỗi: ${error.message}</span>`;
                }
            };
        }
        
        if (audioUrlTextInput) {
            audioUrlTextInput.oninput = (e) => {
                if (audioUrlInput) audioUrlInput.value = e.target.value.trim();
            };
        }
    }

    function refreshPart1Indexes() {
        const items = refs.part1Container.querySelectorAll('.question-item');
        items.forEach((item, index) => {
            const badge = item.querySelector('.listening-part1-index');
            if (badge) badge.textContent = index + 1;
        });
    }

    // Part 4: Questions 16-17
    function createPart4QuestionRow(data = {}) {
        const wrapper = document.createElement('div');
        wrapper.className = 'question-item mb-4';
        const questionNum = refs.part4Container.children.length === 0 ? '16' : '17';
        wrapper.innerHTML = `
            <div class="d-flex justify-content-between mb-3">
                <h6 class="mb-0">Question ${questionNum}</h6>
                <button type="button" class="btn btn-sm btn-outline-danger">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row g-2 mb-3">
                <div class="col-md-6">
                    <label class="form-label small">Chọn file MP3</label>
                    <input type="file" class="form-control form-control-sm listening-part4-audio-file" accept="audio/mp3,audio/mpeg,.mp3">
                    <input type="hidden" class="listening-part4-audio" value="${data.audioUrl || ''}">
                    <div class="form-text small">Hoặc nhập URL: <input type="text" class="form-control form-control-sm mt-1 listening-part4-audio-url" 
                           value="${data.audioUrl || ''}" 
                           placeholder="audio/question16/audio_q1.mp3"></div>
                    <div class="listening-part4-audio-status small mt-1"></div>
                </div>
                <div class="col-md-6">
                    <label class="form-label small">Topic</label>
                    <input type="text" class="form-control form-control-sm listening-part4-topic" 
                           value="${data.topic || ''}" 
                           placeholder="Topic">
                </div>
                <div class="col-12">
                    <label class="form-label small">Transcript</label>
                    <textarea class="form-control form-control-sm listening-part4-transcript" rows="3" 
                              placeholder="Transcript...">${data.transcript || ''}</textarea>
                </div>
            </div>
            <div class="listening-part4-subquestions"></div>
            <button type="button" class="btn btn-outline-primary btn-sm mt-2 add-subquestion-btn">
                <i class="bi bi-plus-circle me-1"></i>Thêm câu hỏi con
            </button>
        `;
        
        const subQuestionsContainer = wrapper.querySelector('.listening-part4-subquestions');
        if (data.questions && data.questions.length > 0) {
            data.questions.forEach(q => {
                subQuestionsContainer.appendChild(createPart4SubQuestionRow(q));
            });
        } else {
            // Add default 2 sub-questions
            subQuestionsContainer.appendChild(createPart4SubQuestionRow());
            subQuestionsContainer.appendChild(createPart4SubQuestionRow());
        }
        
        wrapper.querySelector('.add-subquestion-btn').addEventListener('click', () => {
            subQuestionsContainer.appendChild(createPart4SubQuestionRow());
        });
        
        wrapper.querySelector('.btn-outline-danger').addEventListener('click', () => {
            wrapper.remove();
        });
        
        // Setup audio file upload for Part 4
        const audioFileInput = wrapper.querySelector('.listening-part4-audio-file');
        const audioUrlInput = wrapper.querySelector('.listening-part4-audio');
        const audioUrlTextInput = wrapper.querySelector('.listening-part4-audio-url');
        const audioStatus = wrapper.querySelector('.listening-part4-audio-status');
        
        if (audioFileInput) {
            // Ensure it's a file input, not directory
            audioFileInput.removeAttribute('webkitdirectory');
            audioFileInput.removeAttribute('directory');
            audioFileInput.removeAttribute('multiple');
            audioFileInput.setAttribute('type', 'file');
            audioFileInput.setAttribute('accept', 'audio/mp3,audio/mpeg,.mp3');
            
            audioFileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                // Validate it's actually a file, not a directory
                if (file.size === 0 && file.type === '') {
                    if (audioStatus) audioStatus.innerHTML = '<span class="text-danger"><i class="bi bi-x-circle me-1"></i>Vui lòng chọn file MP3, không phải folder!</span>';
                    e.target.value = ''; // Clear selection
                    return;
                }
                
                if (audioStatus) audioStatus.innerHTML = '<span class="text-info"><i class="spinner-border spinner-border-sm me-1"></i>Đang upload...</span>';
                
                try {
                    const audioUrl = await uploadAudioFile(file, `audio/listening/question${questionNum}/${file.name}`);
                    if (audioUrlInput) audioUrlInput.value = audioUrl;
                    if (audioUrlTextInput) audioUrlTextInput.value = audioUrl;
                    if (audioStatus) audioStatus.innerHTML = '<span class="text-success"><i class="bi bi-check-circle me-1"></i>Upload thành công!</span>';
                } catch (error) {
                    if (audioStatus) audioStatus.innerHTML = `<span class="text-danger"><i class="bi bi-x-circle me-1"></i>Lỗi: ${error.message}</span>`;
                }
            });
        }
        
        if (audioUrlTextInput) {
            audioUrlTextInput.addEventListener('input', (e) => {
                if (audioUrlInput) audioUrlInput.value = e.target.value.trim();
            });
        }
        
        return wrapper;
    }

    function createPart4SubQuestionRow(data = {}) {
        // Xử lý tương thích với data cũ (A/B/C) và data mới (text)
        let correctAnswerValue = data.correctAnswer || '';
        if (['A', 'B', 'C'].includes(correctAnswerValue)) {
            // Convert A/B/C sang text của option
            const optionIndex = correctAnswerValue.charCodeAt(0) - 65; // A=0, B=1, C=2
            if (data.options && data.options[optionIndex]) {
                correctAnswerValue = data.options[optionIndex];
            }
        }
        
        const wrapper = document.createElement('div');
        wrapper.className = 'border rounded p-3 mb-2 bg-light';
        wrapper.innerHTML = `
            <div class="d-flex justify-content-between mb-2">
                <label class="form-label small mb-0">Câu hỏi con</label>
                <button type="button" class="btn btn-sm btn-outline-danger">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row g-2">
                <div class="col-12">
                    <label class="form-label small">ID (ví dụ: 16.1)</label>
                    <input type="text" class="form-control form-control-sm listening-part4-sub-id" 
                           value="${data.id || ''}" 
                           placeholder="16.1">
                </div>
                <div class="col-12">
                    <label class="form-label small">Câu hỏi</label>
                    <input type="text" class="form-control form-control-sm listening-part4-sub-question" 
                           value="${data.question || ''}" 
                           placeholder="Question text">
                </div>
                <div class="col-md-4">
                    <label class="form-label small">Option A</label>
                    <input type="text" class="form-control form-control-sm listening-part4-sub-option" 
                           value="${data.options?.[0] || ''}" 
                           placeholder="Option A">
                </div>
                <div class="col-md-4">
                    <label class="form-label small">Option B</label>
                    <input type="text" class="form-control form-control-sm listening-part4-sub-option" 
                           value="${data.options?.[1] || ''}" 
                           placeholder="Option B">
                </div>
                <div class="col-md-4">
                    <label class="form-label small">Option C</label>
                    <input type="text" class="form-control form-control-sm listening-part4-sub-option" 
                           value="${data.options?.[2] || ''}" 
                           placeholder="Option C">
                </div>
                <div class="col-md-6">
                    <label class="form-label small">Đáp án đúng (chọn option)</label>
                    <select class="form-control form-control-sm listening-part4-sub-answer">
                        <option value="">-- Chọn đáp án --</option>
                        <option value="${data.options?.[0] || ''}" ${correctAnswerValue === data.options?.[0] ? 'selected' : ''}>Option A: ${data.options?.[0] || ''}</option>
                        <option value="${data.options?.[1] || ''}" ${correctAnswerValue === data.options?.[1] ? 'selected' : ''}>Option B: ${data.options?.[1] || ''}</option>
                        <option value="${data.options?.[2] || ''}" ${correctAnswerValue === data.options?.[2] ? 'selected' : ''}>Option C: ${data.options?.[2] || ''}</option>
                    </select>
                </div>
            </div>
        `;
        
        wrapper.querySelector('.btn-outline-danger').addEventListener('click', () => {
            wrapper.remove();
        });
        
        // Cập nhật dropdown khi options thay đổi
        const optionInputs = wrapper.querySelectorAll('.listening-part4-sub-option');
        const answerSelect = wrapper.querySelector('.listening-part4-sub-answer');
        
        function updateAnswerDropdown() {
            const options = Array.from(optionInputs).map(input => input.value.trim()).filter(Boolean);
            const currentValue = answerSelect.value;
            
            answerSelect.innerHTML = '<option value="">-- Chọn đáp án --</option>';
            options.forEach((opt, idx) => {
                const option = document.createElement('option');
                option.value = opt;
                option.textContent = `Option ${String.fromCharCode(65 + idx)}: ${opt}`;
                if (opt === currentValue) {
                    option.selected = true;
                }
                answerSelect.appendChild(option);
            });
        }
        
        optionInputs.forEach(input => {
            input.addEventListener('input', updateAnswerDropdown);
        });
        
        return wrapper;
    }

    function resetForm() {
        state.editingId = null;
        refs.formTitle.textContent = 'Tạo bộ đề Listening';
        refs.titleInput.value = '';
        refs.durationInput.value = 35;
        refs.descriptionInput.value = '';
        refs.part1Count.value = 13;
        refs.part1Container.innerHTML = '';
        refs.part2Topic.value = '';
        const part2AudioUrlInput = document.getElementById('listening-part2-audio');
        const part2AudioUrlText = document.getElementById('listening-part2-audio-url');
        const part2AudioFile = document.getElementById('listening-part2-audio-file');
        if (part2AudioUrlInput) part2AudioUrlInput.value = '';
        if (part2AudioUrlText) part2AudioUrlText.value = '';
        if (part2AudioFile) part2AudioFile.value = '';
        refs.part2Options.value = '';
        refs.part2Answers.value = '';
        refs.part2Transcript.value = '';
        refs.part3Topic.value = '';
        const part3AudioUrlInput = document.getElementById('listening-part3-audio');
        const part3AudioUrlText = document.getElementById('listening-part3-audio-url');
        const part3AudioFile = document.getElementById('listening-part3-audio-file');
        if (part3AudioUrlInput) part3AudioUrlInput.value = '';
        if (part3AudioUrlText) part3AudioUrlText.value = '';
        if (part3AudioFile) part3AudioFile.value = '';
        refs.part3Questions.value = '';
        refs.part3Answers.value = '';
        refs.part3Transcript.value = '';
        refs.part4Container.innerHTML = '';
        
        // Setup audio uploads
        setupPart2AudioUpload();
        setupPart3AudioUpload();

        // Initialize with default questions
        for (let i = 0; i < 13; i += 1) {
            refs.part1Container.appendChild(createPart1QuestionRow());
        }
        refreshPart1Indexes();
    }

    async function loadListeningSets() {
        try {
            refs.list.innerHTML = '<div class="text-muted small"><i class="spinner-border spinner-border-sm me-2"></i>Đang tải bộ đề...</div>';
            const response = await fetch('/api/practice_sets/list?type=listening');
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Không thể tải danh sách');
            }
            state.sets = (result.sets || []).slice().sort((a, b) =>
                (a.title || '').localeCompare(b.title || '', 'vi', { sensitivity: 'base', numeric: true })
            );
            renderListeningSetList();
        } catch (error) {
            console.error('Load listening sets error:', error);
            refs.list.innerHTML = `<div class="alert alert-danger">Lỗi tải danh sách: ${error.message}</div>`;
        }
    }

    function renderListeningSetList() {
        refs.list.innerHTML = '';
        if (!state.sets.length) {
            refs.emptyState.style.display = 'block';
            return;
        }
        refs.emptyState.style.display = 'none';

        state.sets.forEach(set => {
            const card = document.createElement('div');
            card.className = 'card mb-3';
            card.innerHTML = `
                <div class="card-body">
                    <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                        <div>
                            <h5 class="mb-1">${set.title}</h5>
                            <p class="mb-1 text-muted small">Thời lượng: ${set.duration_minutes || 35} phút · Ngày tạo: ${new Date(set.created_at).toLocaleDateString('vi-VN')}</p>
                            ${set.description ? `<p class="mb-0">${set.description}</p>` : ''}
                        </div>
                        <div class="d-flex gap-2 flex-wrap">
                            <button class="btn btn-outline-primary btn-sm" data-action="edit" data-id="${set.id}">
                                <i class="bi bi-pencil me-1"></i>Chỉnh sửa
                            </button>
                            <button class="btn btn-outline-success btn-sm" data-action="view" data-id="${set.id}">
                                <i class="bi bi-box-arrow-up-right me-1"></i>Mở trang học
                            </button>
                            <button class="btn btn-outline-danger btn-sm" data-action="delete" data-id="${set.id}">
                                <i class="bi bi-trash me-1"></i>Xoá
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            card.querySelectorAll('[data-action]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const action = btn.dataset.action;
                    const id = btn.dataset.id;
                    if (action === 'edit') {
                        editListeningSet(id);
                    } else if (action === 'view') {
                        window.open(`/listening_bode_set.html?set=${id}`, '_blank');
                    } else if (action === 'delete') {
                        if (confirm('Bạn có chắc muốn xóa bộ đề này?')) {
                            deleteListeningSet(id);
                        }
                    }
                });
            });
            
            refs.list.appendChild(card);
        });
    }

    async function editListeningSet(setId) {
        try {
            const response = await fetch(`/api/practice_sets/get?id=${setId}`, {
                headers: buildAuthHeaders()
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Không thể tải bộ đề');
            }
            
            const set = result.set;
            state.editingId = setId;
            refs.formTitle.textContent = 'Chỉnh sửa bộ đề Listening';
            refs.titleInput.value = set.title || '';
            refs.durationInput.value = set.duration_minutes || 35;
            refs.descriptionInput.value = set.description || '';
            
            const data = set.data || {};
            
            // Load Part 1
            if (data.part1 && data.part1.questions) {
                refs.part1Container.innerHTML = '';
                refs.part1Count.value = data.part1.questions.length;
                data.part1.questions.forEach(q => {
                    refs.part1Container.appendChild(createPart1QuestionRow(q));
                });
                refreshPart1Indexes();
            }
            
            // Load Part 2
            if (data.part2) {
                refs.part2Topic.value = data.part2.topic || '';
                const part2AudioUrlInput = document.getElementById('listening-part2-audio');
                const part2AudioUrlText = document.getElementById('listening-part2-audio-url');
                if (part2AudioUrlInput) part2AudioUrlInput.value = data.part2.audioUrl || '';
                if (part2AudioUrlText) part2AudioUrlText.value = data.part2.audioUrl || '';
                refs.part2Options.value = (data.part2.options || []).join('\n');
                refs.part2Answers.value = (data.part2.correctAnswers || []).join('\n');
                refs.part2Transcript.value = data.part2.transcript || '';
            }
            
            // Setup Part 2 audio upload
            setupPart2AudioUpload();
            
            // Load Part 3
            if (data.part3) {
                refs.part3Topic.value = data.part3.topic || '';
                const part3AudioUrlInput = document.getElementById('listening-part3-audio');
                const part3AudioUrlText = document.getElementById('listening-part3-audio-url');
                if (part3AudioUrlInput) part3AudioUrlInput.value = data.part3.audioUrl || '';
                if (part3AudioUrlText) part3AudioUrlText.value = data.part3.audioUrl || '';
                refs.part3Questions.value = (data.part3.questions || []).join('\n');
                refs.part3Answers.value = (data.part3.correctAnswers || []).join('\n');
                refs.part3Transcript.value = data.part3.transcript || '';
            }
            
            // Setup Part 3 audio upload
            setupPart3AudioUpload();
            
            // Load Part 4
            if (data.part4 && data.part4.questions) {
                refs.part4Container.innerHTML = '';
                data.part4.questions.forEach(q => {
                    refs.part4Container.appendChild(createPart4QuestionRow(q));
                });
            }
            
            refs.formCard.style.display = 'block';
            refs.formCard.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Edit listening set error:', error);
            alert('Lỗi tải bộ đề: ' + error.message);
        }
    }

    async function deleteListeningSet(setId) {
        try {
            const response = await fetch(`/api/practice_sets/delete?id=${setId}`, {
                method: 'DELETE',
                headers: buildAuthHeaders()
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Không thể xóa bộ đề');
            }
            await loadListeningSets();
        } catch (error) {
            console.error('Delete listening set error:', error);
            alert('Lỗi xóa bộ đề: ' + error.message);
        }
    }

    function collectFormData() {
        const title = refs.titleInput.value.trim();
        if (!title) {
            throw new Error('Vui lòng nhập tiêu đề bộ đề');
        }

        // Part 1: Questions 1-13
        const part1Questions = Array.from(refs.part1Container.querySelectorAll('.question-item')).map(item => {
            const audioUrlInput = item.querySelector('.listening-part1-audio');
            const audioUrl = audioUrlInput?.value.trim() || item.querySelector('.listening-part1-audio-url')?.value.trim();
            const question = item.querySelector('.listening-part1-question')?.value.trim();
            const options = Array.from(item.querySelectorAll('.listening-part1-option'))
                .map(input => input.value.trim())
                .filter(Boolean);
            const correctAnswer = item.querySelector('.listening-part1-answer')?.value.trim();
            const transcript = item.querySelector('.listening-part1-transcript')?.value.trim();
            
            // Chỉ validate câu hỏi, options và đáp án. Audio và transcript là tùy chọn
            if (!question || options.length < 3 || !correctAnswer) {
                throw new Error('Part 1: Mỗi câu cần đủ câu hỏi, 3 options và đáp án đúng.');
            }
            
            return {
                audioUrl: audioUrl || '', // Audio là tùy chọn
                question,
                options: options.slice(0, 3),
                correctAnswer,
                transcript: transcript || ''
            };
        });

        if (part1Questions.length < 1) {
            throw new Error('Part 1 cần ít nhất 1 câu hỏi.');
        }

        // Part 2: Question 14
        const part2Topic = refs.part2Topic.value.trim();
        const part2AudioFile = document.getElementById('listening-part2-audio-file');
        const part2AudioUrlInput = document.getElementById('listening-part2-audio');
        const part2AudioUrlText = document.getElementById('listening-part2-audio-url');
        let part2Audio = part2AudioUrlInput?.value.trim() || part2AudioUrlText?.value.trim() || '';
        const part2Options = (refs.part2Options.value || '')
            .split(/\r?\n/)
            .map(opt => opt.trim())
            .filter(Boolean);
        const part2Answers = (refs.part2Answers.value || '')
            .split(/\r?\n/)
            .map(ans => ans.trim())
            .filter(Boolean);
        const part2Transcript = refs.part2Transcript.value.trim();
        
        // Chỉ validate options và answers. Audio và transcript là tùy chọn
        if (part2Topic && (part2Options.length < 6 || part2Answers.length !== 4)) {
            throw new Error('Part 2: Cần đủ 6 options và 4 đáp án đúng.');
        }

        // Part 3: Question 15
        const part3Topic = refs.part3Topic.value.trim();
        const part3AudioFile = document.getElementById('listening-part3-audio-file');
        const part3AudioUrlInput = document.getElementById('listening-part3-audio');
        const part3AudioUrlText = document.getElementById('listening-part3-audio-url');
        let part3Audio = part3AudioUrlInput?.value.trim() || part3AudioUrlText?.value.trim() || '';
        const part3Questions = (refs.part3Questions.value || '')
            .split(/\r?\n/)
            .map(q => q.trim())
            .filter(Boolean);
        const part3Answers = (refs.part3Answers.value || '')
            .split(/\r?\n/)
            .map(ans => ans.trim())
            .filter(Boolean);
        const part3Transcript = refs.part3Transcript.value.trim();
        
        // Chỉ validate questions và answers. Audio và transcript là tùy chọn
        if (part3Topic && (part3Questions.length !== 4 || part3Answers.length !== 4)) {
            throw new Error('Part 3: Cần đủ 4 câu hỏi và 4 đáp án đúng (Man/Woman/Both).');
        }

        // Part 4: Questions 16-17
        const part4Questions = Array.from(refs.part4Container.querySelectorAll('.question-item')).map(item => {
            const audioUrlInput = item.querySelector('.listening-part4-audio');
            const audioUrl = audioUrlInput?.value.trim() || item.querySelector('.listening-part4-audio-url')?.value.trim();
            const topic = item.querySelector('.listening-part4-topic')?.value.trim();
            const transcript = item.querySelector('.listening-part4-transcript')?.value.trim();
            
            const subQuestions = Array.from(item.querySelectorAll('.listening-part4-subquestions > .border')).map(subItem => {
                const id = subItem.querySelector('.listening-part4-sub-id')?.value.trim();
                const question = subItem.querySelector('.listening-part4-sub-question')?.value.trim();
                const options = Array.from(subItem.querySelectorAll('.listening-part4-sub-option'))
                    .map(input => input.value.trim())
                    .filter(Boolean);
                const correctAnswer = subItem.querySelector('.listening-part4-sub-answer')?.value.trim();
                
                if (!id || !question || options.length < 3 || !correctAnswer) {
                    throw new Error('Part 4: Mỗi câu hỏi con cần đủ ID, câu hỏi, 3 options và đáp án đúng.');
                }
                
                // Kiểm tra đáp án đúng phải là một trong các options
                if (!options.includes(correctAnswer)) {
                    throw new Error(`Part 4: Đáp án đúng phải là một trong các options đã nhập.`);
                }
                
                return {
                    id,
                    question,
                    options: options.slice(0, 3),
                    correctAnswer
                };
            });
            
            // Chỉ validate topic và sub-questions. Audio và transcript là tùy chọn
            if (!topic || subQuestions.length < 1) {
                throw new Error('Part 4: Mỗi câu hỏi cần đủ topic và ít nhất 1 câu hỏi con.');
            }
            
            return {
                audioUrl: audioUrl || '', // Audio là tùy chọn
                topic,
                transcript: transcript || '',
                questions: subQuestions
            };
        });

        return {
            title,
            description: refs.descriptionInput.value.trim(),
            duration_minutes: parseInt(refs.durationInput.value, 10) || 35,
            data: {
                part1: {
                    questions: part1Questions
                },
                ...(part2Topic && {
                    part2: {
                        topic: part2Topic,
                        audioUrl: part2Audio,
                        options: part2Options,
                        correctAnswers: part2Answers,
                        transcript: part2Transcript || '' // Transcript là tùy chọn
                    }
                }),
                ...(part3Topic && {
                    part3: {
                        topic: part3Topic,
                        audioUrl: part3Audio,
                        questions: part3Questions,
                        correctAnswers: part3Answers,
                        transcript: part3Transcript || '' // Transcript là tùy chọn
                    }
                }),
                ...(part4Questions.length > 0 && {
                    part4: {
                        questions: part4Questions
                    }
                })
            }
        };
    }

    async function saveListeningSet() {
        try {
            const formData = collectFormData();
            
            const url = state.editingId 
                ? `/api/practice_sets/update?id=${state.editingId}`
                : '/api/practice_sets/create';
            
            const response = await fetch(url, {
                method: state.editingId ? 'PUT' : 'POST',
                headers: buildAuthHeaders(),
                body: JSON.stringify({
                    ...formData,
                    type: 'listening'
                })
            });
            
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Không thể lưu bộ đề');
            }
            
            alert(state.editingId ? 'Cập nhật bộ đề thành công!' : 'Tạo bộ đề thành công!');
            resetForm();
            refs.formCard.style.display = 'none';
            await loadListeningSets();
        } catch (error) {
            console.error('Save listening set error:', error);
            alert('Lỗi lưu bộ đề: ' + error.message);
        }
    }

    // Event listeners
    if (refs.createBtn) {
        refs.createBtn.addEventListener('click', () => {
            resetForm();
            refs.formCard.style.display = 'block';
            refs.formCard.scrollIntoView({ behavior: 'smooth' });
            // Setup audio uploads after form is shown
            setTimeout(() => {
                setupPart2AudioUpload();
                setupPart3AudioUpload();
            }, 100);
        });
    }

    if (refs.refreshBtn) {
        refs.refreshBtn.addEventListener('click', () => {
            loadListeningSets();
        });
    }

    if (refs.cancelBtn) {
        refs.cancelBtn.addEventListener('click', () => {
            refs.formCard.style.display = 'none';
            resetForm();
        });
    }

    if (refs.cancelBtn2) {
        refs.cancelBtn2.addEventListener('click', () => {
            refs.formCard.style.display = 'none';
            resetForm();
        });
    }

    if (refs.saveBtn) {
        refs.saveBtn.addEventListener('click', () => {
            saveListeningSet();
        });
    }

    if (refs.addPart1Btn) {
        refs.addPart1Btn.addEventListener('click', () => {
            const count = parseInt(refs.part1Count.value, 10) || 13;
            if (refs.part1Container.children.length < count) {
                refs.part1Container.appendChild(createPart1QuestionRow());
                refreshPart1Indexes();
            } else {
                alert(`Tối đa ${count} câu hỏi cho Part 1.`);
            }
        });
    }

    if (refs.addPart4Btn) {
        refs.addPart4Btn.addEventListener('click', () => {
            if (refs.part4Container.children.length < 2) {
                refs.part4Container.appendChild(createPart4QuestionRow());
            } else {
                alert('Tối đa 2 câu hỏi cho Part 4 (Question 16 và 17).');
            }
        });
    }

    // Initialize
    if (refs.list) {
        loadListeningSets();
    }
})();

