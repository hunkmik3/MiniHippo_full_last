(() => {
    const moduleRoot = document.getElementById('speaking-cauhoi-module');
    if (!moduleRoot) return;

    const PART_LABELS = { 1: 'Part 1 - Câu hỏi cá nhân', 2: 'Part 2 - Mô tả ảnh', 3: 'Part 3 - So sánh ảnh', 4: 'Part 4 - Trình bày quan điểm' };
    const PART_QUESTION_COUNTS = { 1: 3, 2: 2, 3: 2 };

    const refs = {
        list: document.getElementById('speaking-cauhoi-list'),
        empty: document.getElementById('speaking-cauhoi-empty'),
        formCard: document.getElementById('speaking-cauhoi-form-card'),
        formTitle: document.getElementById('speaking-cauhoi-form-title'),
        titleInput: document.getElementById('spch-title'),
        partSelect: document.getElementById('spch-part'),
        descriptionInput: document.getElementById('spch-description'),
        pagesContainer: document.getElementById('spch-pages-container'),
        addPageBtn: document.getElementById('spch-add-page-btn'),
        createBtn: document.getElementById('createSpeakingCauhoiBtn'),
        refreshBtn: document.getElementById('refreshSpeakingCauhoiBtn'),
        cancelBtn: document.getElementById('cancelSpeakingCauhoiBtn'),
        saveBtn: document.getElementById('saveSpeakingCauhoiBtn')
    };

    const state = { sets: [], editingId: null, initialized: false, pageCounter: 0 };

    function escapeHtml(v) {
        return String(v || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function buildAuthHeaders(extra = {}) {
        if (typeof window.buildAuthorizedHeaders === 'function') return window.buildAuthorizedHeaders(extra);
        const token = localStorage.getItem('auth_token');
        if (!token) throw new Error('AUTH_TOKEN_MISSING');
        return { Authorization: `Bearer ${token}`, ...extra };
    }

    // ─── Upload helpers ─────────────────────────────────────────────
    function sanitizeFileName(name) {
        const base = String(name || 'file').toLowerCase().replace(/[^\w.\-]+/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
        return base || 'file';
    }

    function getFileExtension(name) {
        const match = String(name || '').toLowerCase().match(/(\.[a-z0-9]+)$/);
        return match ? match[1] : '';
    }

    function isAcceptedFile(file, kind) {
        if (!file) return false;
        const ext = getFileExtension(file.name);
        if (kind === 'audio') return file.type.includes('audio/mpeg') || ext === '.mp3';
        return ['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext) || file.type.startsWith('image/');
    }

    function showUploadStatus(statusEl, type, message) {
        if (!statusEl) return;
        const cls = { loading: 'text-info', success: 'text-success', error: 'text-danger', info: 'text-muted' };
        statusEl.className = `small mt-1 ${cls[type] || 'text-muted'}`;
        statusEl.innerHTML = type === 'loading'
            ? `<i class="spinner-border spinner-border-sm me-1"></i>${message}`
            : message || '';
    }

    function createPreviewElement(url, kind) {
        if (!url) return null;
        if (kind === 'audio') {
            const a = document.createElement('audio');
            a.controls = true; a.src = url; a.style.width = '100%'; a.style.maxWidth = '420px';
            return a;
        }
        const img = document.createElement('img');
        img.src = url; img.alt = 'preview';
        img.style.cssText = 'max-width:220px;max-height:150px;border:1px solid #cbd5e1;border-radius:8px;object-fit:contain;background:#f8fafc;';
        return img;
    }

    function renderMediaPreview(previewEl, url, kind) {
        if (!previewEl) return;
        previewEl.innerHTML = '';
        const v = (url || '').trim();
        if (!v) return;
        const node = createPreviewElement(v, kind);
        if (node) previewEl.appendChild(node);
    }

    async function uploadMediaFile(file, filePath, message) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = String(reader.result || '').split(',')[1];
                if (!base64) { reject(new Error('Không thể đọc nội dung file.')); return; }
                try {
                    const resp = await fetch('/api/upload-audio', {
                        method: 'POST',
                        headers: buildAuthHeaders({ 'Content-Type': 'application/json' }),
                        body: JSON.stringify({ filePath, content: base64, message })
                    });
                    const text = await resp.text();
                    if (!resp.ok) {
                        let msg = `Upload thất bại (${resp.status})`;
                        try { const j = JSON.parse(text); msg = j.error || j.details || msg; } catch (_) { msg = text || msg; }
                        throw new Error(msg);
                    }
                    let result;
                    try { result = JSON.parse(text); } catch (_) { throw new Error('Phản hồi không hợp lệ.'); }
                    if (!result.rawUrl) throw new Error('Server không trả về URL file.');
                    resolve(result.rawUrl);
                } catch (e) { reject(e); }
            };
            reader.onerror = () => reject(new Error('Không thể đọc file từ máy.'));
            reader.readAsDataURL(file);
        });
    }

    /**
     * Enhance a URL text input with file upload + preview
     * @param {HTMLElement} urlInput - the text input for URL
     * @param {string} kind - 'audio' or 'image'
     * @param {string} dir - upload directory, e.g. 'audio/speaking/part1'
     */
    function enhanceWithUpload(urlInput, kind, dir) {
        if (!urlInput) return;

        const wrap = document.createElement('div');
        wrap.className = 'mt-1';

        const label = document.createElement('div');
        label.className = 'form-text';
        label.textContent = kind === 'audio' ? 'Hoặc upload audio từ máy:' : 'Hoặc upload ảnh từ máy:';

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.className = 'form-control form-control-sm mt-1';
        fileInput.accept = kind === 'audio'
            ? 'audio/mp3,audio/mpeg,.mp3'
            : 'image/png,image/jpeg,image/jpg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif';

        const statusEl = document.createElement('div');
        statusEl.className = 'small mt-1 text-muted';

        const previewEl = document.createElement('div');
        previewEl.className = 'mt-1';

        wrap.appendChild(label);
        wrap.appendChild(fileInput);
        wrap.appendChild(statusEl);
        wrap.appendChild(previewEl);

        urlInput.parentElement.appendChild(wrap);

        // Preview on URL input change
        const refreshPreview = () => renderMediaPreview(previewEl, urlInput.value, kind);
        urlInput.addEventListener('input', refreshPreview);

        // Upload on file select
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (!isAcceptedFile(file, kind)) {
                showUploadStatus(statusEl, 'error', kind === 'audio' ? 'Vui lòng chọn file MP3.' : 'Vui lòng chọn file ảnh (png/jpg/webp/gif).');
                fileInput.value = '';
                return;
            }

            const ext = getFileExtension(file.name);
            const fileName = `${Date.now()}_${sanitizeFileName(file.name)}`;
            const finalName = ext && !fileName.endsWith(ext) ? `${fileName}${ext}` : fileName;
            const filePath = `${dir}/${finalName}`;

            showUploadStatus(statusEl, 'loading', 'Đang upload...');
            try {
                const rawUrl = await uploadMediaFile(file, filePath, `Upload ${kind} speaking_cauhoi: ${filePath}`);
                urlInput.value = rawUrl;
                refreshPreview();
                showUploadStatus(statusEl, 'success', 'Upload thành công.');
            } catch (err) {
                showUploadStatus(statusEl, 'error', err.message || 'Upload thất bại.');
            } finally {
                fileInput.value = '';
            }
        });

        // Initial preview if URL already has value
        refreshPreview();
    }

    // ─── Page card builder ──────────────────────────────────────────
    function buildPageCard(pageIndex, part, pageData) {
        const p = Number(part);
        const d = pageData || {};
        const card = document.createElement('div');
        card.className = 'card mb-3 spch-page-card';
        card.dataset.pageIndex = pageIndex;

        // Header
        const header = document.createElement('div');
        header.className = 'card-header py-2 d-flex justify-content-between align-items-center';
        header.innerHTML = `
            <strong><i class="bi bi-file-earmark-text me-1"></i>Trang ${pageIndex}</strong>
            <button type="button" class="btn btn-outline-danger btn-sm spch-remove-page" title="Xóa trang này">
                <i class="bi bi-trash me-1"></i>Xóa trang
            </button>`;
        card.appendChild(header);

        const body = document.createElement('div');
        body.className = 'card-body';

        // ── Intro ──
        const introHtml = `
            <h6 class="fw-semibold text-primary mb-2"><i class="bi bi-megaphone me-1"></i>Giới thiệu</h6>
            <div class="row g-3 mb-3">
                <div class="col-md-8">
                    <label class="form-label fw-bold">Nội dung giới thiệu</label>
                    <textarea class="form-control spch-pg-intro-text" rows="2" placeholder="Ví dụ: Trả lời các câu hỏi sau.">${escapeHtml(d.introText || '')}</textarea>
                </div>
                <div class="col-md-4">
                    <label class="form-label fw-bold">Audio giới thiệu</label>
                    <input type="text" class="form-control spch-pg-intro-audio" placeholder="audio/speaking/..." value="${escapeHtml(d.introAudioUrl || '')}">
                </div>
            </div>`;
        body.innerHTML = introHtml;

        // ── Images (Part 2) ──
        if (p === 2) {
            body.innerHTML += `
                <h6 class="fw-semibold text-info mb-2"><i class="bi bi-image me-1"></i>Ảnh</h6>
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <label class="form-label fw-bold">URL ảnh</label>
                        <input type="text" class="form-control spch-pg-image-url" placeholder="images/speaking/..." value="${escapeHtml(d.imageUrl || '')}">
                    </div>
                </div>`;
        }

        // ── Images (Part 3) ──
        if (p === 3) {
            body.innerHTML += `
                <h6 class="fw-semibold text-warning mb-2"><i class="bi bi-images me-1"></i>Ảnh so sánh</h6>
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <label class="form-label fw-bold">Ảnh trái</label>
                        <input type="text" class="form-control spch-pg-image-left" placeholder="images/speaking/part3/left.png" value="${escapeHtml(d.leftImageUrl || '')}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-bold">Ảnh phải</label>
                        <input type="text" class="form-control spch-pg-image-right" placeholder="images/speaking/part3/right.png" value="${escapeHtml(d.rightImageUrl || '')}">
                    </div>
                </div>`;
        }

        // ── Questions (Part 1, 2, 3) ──
        if (p >= 1 && p <= 3) {
            const count = PART_QUESTION_COUNTS[p] || 3;
            const questions = Array.isArray(d.questions) ? d.questions : [];
            let qHtml = `<h6 class="fw-semibold text-success mb-2"><i class="bi bi-chat-dots me-1"></i>Câu hỏi (${count} câu)</h6>`;
            for (let i = 0; i < count; i++) {
                const q = questions[i] || {};
                qHtml += `
                    <div class="row g-3 mb-2">
                        <div class="col-md-8">
                            <label class="form-label fw-bold">Câu hỏi ${i + 1}</label>
                            <textarea class="form-control spch-pg-q-prompt" rows="2">${escapeHtml(q.prompt || '')}</textarea>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-bold">Audio câu ${i + 1}</label>
                            <input type="text" class="form-control spch-pg-q-audio" placeholder="audio/speaking/..." value="${escapeHtml(q.audioUrl || '')}">
                        </div>
                    </div>`;
            }
            body.innerHTML += qHtml;
        }

        // ── Part 4: Prep + Final ──
        if (p === 4) {
            const prep = d.prepPage || {};
            const fin = d.finalPage || {};
            body.innerHTML += `
                <h6 class="fw-semibold text-success mb-2"><i class="bi bi-clock-history me-1"></i>Phần chuẩn bị</h6>
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <label class="form-label fw-bold">Hướng dẫn chuẩn bị</label>
                        <textarea class="form-control spch-pg-prep-instruction" rows="2">${escapeHtml(prep.instruction || '')}</textarea>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-bold">Ảnh chuẩn bị</label>
                        <input type="text" class="form-control spch-pg-prep-image" placeholder="images/speaking/part4/..." value="${escapeHtml(prep.imageUrl || '')}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-bold">Audio câu hỏi</label>
                        <input type="text" class="form-control spch-pg-prep-question-audio" value="${escapeHtml(prep.questionAudioUrl || '')}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-bold">Audio chuẩn bị</label>
                        <input type="text" class="form-control spch-pg-prep-audio" value="${escapeHtml(prep.prepAudioUrl || '')}">
                    </div>
                </div>
                <hr>
                <h6 class="fw-semibold text-danger mb-2"><i class="bi bi-chat-square-text me-1"></i>Câu hỏi cuối</h6>
                <div class="row g-3 mb-3">
                    <div class="col-md-5">
                        <label class="form-label fw-bold">Nội dung câu hỏi</label>
                        <textarea class="form-control spch-pg-final-prompt" rows="2">${escapeHtml(fin.prompt || '')}</textarea>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label fw-bold">Ảnh</label>
                        <input type="text" class="form-control spch-pg-final-image" value="${escapeHtml(fin.imageUrl || '')}">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label fw-bold">Audio</label>
                        <input type="text" class="form-control spch-pg-final-audio" value="${escapeHtml(fin.audioUrl || '')}">
                    </div>
                </div>`;
        }

        card.appendChild(body);

        // ── Enhance all URL inputs with upload ──
        const audioDir = `audio/speaking/part${p}`;
        const imageDir = `images/speaking/part${p}`;

        // Intro audio
        enhanceWithUpload(body.querySelector('.spch-pg-intro-audio'), 'audio', audioDir);

        // Part 2 image
        if (p === 2) {
            enhanceWithUpload(body.querySelector('.spch-pg-image-url'), 'image', imageDir);
        }
        // Part 3 images
        if (p === 3) {
            enhanceWithUpload(body.querySelector('.spch-pg-image-left'), 'image', imageDir);
            enhanceWithUpload(body.querySelector('.spch-pg-image-right'), 'image', imageDir);
        }

        // Question audios (Part 1, 2, 3)
        if (p >= 1 && p <= 3) {
            body.querySelectorAll('.spch-pg-q-audio').forEach(el => {
                enhanceWithUpload(el, 'audio', audioDir);
            });
        }

        // Part 4 audios & images
        if (p === 4) {
            enhanceWithUpload(body.querySelector('.spch-pg-prep-image'), 'image', imageDir);
            enhanceWithUpload(body.querySelector('.spch-pg-prep-question-audio'), 'audio', audioDir);
            enhanceWithUpload(body.querySelector('.spch-pg-prep-audio'), 'audio', audioDir);
            enhanceWithUpload(body.querySelector('.spch-pg-final-image'), 'image', imageDir);
            enhanceWithUpload(body.querySelector('.spch-pg-final-audio'), 'audio', audioDir);
        }

        // Remove page event
        header.querySelector('.spch-remove-page').addEventListener('click', () => {
            const allCards = refs.pagesContainer.querySelectorAll('.spch-page-card');
            if (allCards.length <= 1) { alert('Cần ít nhất 1 trang.'); return; }
            card.remove();
            renumberPages();
        });

        return card;
    }

    function renumberPages() {
        const cards = refs.pagesContainer.querySelectorAll('.spch-page-card');
        cards.forEach((card, i) => {
            const num = i + 1;
            card.dataset.pageIndex = num;
            const title = card.querySelector('.card-header strong');
            if (title) title.innerHTML = `<i class="bi bi-file-earmark-text me-1"></i>Trang ${num}`;
        });
    }

    function addPage(pageData) {
        state.pageCounter++;
        const part = Number(refs.partSelect.value);
        const card = buildPageCard(state.pageCounter, part, pageData);
        refs.pagesContainer.appendChild(card);
    }

    function rebuildPages(pagesData) {
        refs.pagesContainer.innerHTML = '';
        state.pageCounter = 0;
        const pages = Array.isArray(pagesData) ? pagesData : [];
        if (pages.length === 0) {
            addPage(null);
        } else {
            pages.forEach(pd => addPage(pd));
        }
    }

    // ─── Collect / Fill ─────────────────────────────────────────────
    function collectFormData() {
        const part = Number(refs.partSelect.value);
        const data = {
            __practice_type: 'speaking_cauhoi',
            part: part,
            pages: []
        };

        const pageCards = refs.pagesContainer.querySelectorAll('.spch-page-card');
        pageCards.forEach(card => {
            const page = {
                introText: (card.querySelector('.spch-pg-intro-text')?.value || '').trim(),
                introAudioUrl: (card.querySelector('.spch-pg-intro-audio')?.value || '').trim()
            };

            if (part === 2) {
                page.imageUrl = (card.querySelector('.spch-pg-image-url')?.value || '').trim();
            }
            if (part === 3) {
                page.leftImageUrl = (card.querySelector('.spch-pg-image-left')?.value || '').trim();
                page.rightImageUrl = (card.querySelector('.spch-pg-image-right')?.value || '').trim();
            }

            if (part >= 1 && part <= 3) {
                page.questions = [];
                const prompts = card.querySelectorAll('.spch-pg-q-prompt');
                const audios = card.querySelectorAll('.spch-pg-q-audio');
                prompts.forEach((el, i) => {
                    page.questions.push({
                        prompt: (el.value || '').trim(),
                        audioUrl: (audios[i]?.value || '').trim()
                    });
                });
            }

            if (part === 4) {
                page.prepPage = {
                    instruction: (card.querySelector('.spch-pg-prep-instruction')?.value || '').trim(),
                    imageUrl: (card.querySelector('.spch-pg-prep-image')?.value || '').trim(),
                    questionAudioUrl: (card.querySelector('.spch-pg-prep-question-audio')?.value || '').trim(),
                    prepAudioUrl: (card.querySelector('.spch-pg-prep-audio')?.value || '').trim()
                };
                page.finalPage = {
                    prompt: (card.querySelector('.spch-pg-final-prompt')?.value || '').trim(),
                    imageUrl: (card.querySelector('.spch-pg-final-image')?.value || '').trim(),
                    audioUrl: (card.querySelector('.spch-pg-final-audio')?.value || '').trim()
                };
            }

            data.pages.push(page);
        });

        return data;
    }

    function fillForm(set) {
        const d = set?.data || {};
        const titleEl = document.getElementById('spch-title');
        const descEl = document.getElementById('spch-description');
        if (titleEl) titleEl.value = set?.title || '';
        if (descEl) descEl.value = set?.description || '';

        const part = Number(d.part) || 1;
        refs.partSelect.value = String(part);
        rebuildPages(d.pages || []);
    }

    function resetForm() {
        state.editingId = null;
        if (refs.formTitle) refs.formTitle.textContent = 'Tạo câu hỏi Speaking';
        fillForm({ title: '', description: '', data: { part: 1, pages: [] } });
    }

    function showForm() { if (refs.formCard) refs.formCard.style.display = 'block'; }
    function hideForm() { if (refs.formCard) refs.formCard.style.display = 'none'; }

    // ─── List rendering ─────────────────────────────────────────────
    function renderList() {
        if (!refs.list) return;
        if (!state.sets.length) {
            refs.list.innerHTML = '';
            if (refs.empty) refs.empty.style.display = 'block';
            return;
        }
        if (refs.empty) refs.empty.style.display = 'none';

        refs.list.innerHTML = state.sets.map(set => {
            const part = Number(set.data?.part) || 0;
            const partLabel = PART_LABELS[part] || 'Part ?';
            const pageCount = Array.isArray(set.data?.pages) ? set.data.pages.length : 0;
            const date = set.created_at ? new Date(set.created_at).toLocaleString('vi-VN') : '—';
            const badgeColors = { 1: 'bg-primary', 2: 'bg-info', 3: 'bg-warning', 4: 'bg-success' };
            return `
                <div class="card mb-2 border-0 shadow-sm">
                    <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 py-2">
                        <div>
                            <span class="badge ${badgeColors[part] || 'bg-secondary'} me-2">${escapeHtml(partLabel)}</span>
                            <strong>${escapeHtml(set.title || 'Câu hỏi Speaking')}</strong>
                            ${pageCount ? `<span class="badge bg-light text-dark ms-2">${pageCount} trang</span>` : ''}
                            <div class="small text-muted mt-1"><i class="bi bi-calendar3 me-1"></i>${escapeHtml(date)}</div>
                        </div>
                        <div class="d-flex gap-2">
                            <a href="speaking_cauhoi_part.html?set=${encodeURIComponent(set.id)}" target="_blank" class="btn btn-sm btn-outline-info">
                                <i class="bi bi-eye me-1"></i>Preview
                            </a>
                            <button class="btn btn-sm btn-outline-primary" onclick="window.editSpeakingCauhoi('${set.id}')">
                                <i class="bi bi-pencil me-1"></i>Sửa
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="window.deleteSpeakingCauhoi('${set.id}')">
                                <i class="bi bi-trash me-1"></i>Xóa
                            </button>
                        </div>
                    </div>
                </div>`;
        }).join('');
    }

    // ─── CRUD ───────────────────────────────────────────────────────
    async function loadSets() {
        if (!refs.list) return;
        refs.list.innerHTML = '<div class="text-center py-3 text-muted"><span class="spinner-border spinner-border-sm me-2"></span>Đang tải...</div>';
        if (refs.empty) refs.empty.style.display = 'none';

        try {
            const resp = await fetch('/api/practice_sets/list?type=speaking_cauhoi');
            const result = await resp.json();
            if (!resp.ok) throw new Error(result.error || 'Lỗi tải dữ liệu');
            state.sets = Array.isArray(result.sets) ? result.sets : [];
            renderList();
        } catch (e) {
            refs.list.innerHTML = `<div class="alert alert-danger mb-0">${escapeHtml(e.message)}</div>`;
        }
    }

    async function saveSet() {
        const title = document.getElementById('spch-title')?.value.trim();
        if (!title) { alert('Vui lòng nhập tiêu đề.'); return; }

        const payload = {
            title,
            type: 'reading',
            description: document.getElementById('spch-description')?.value.trim() || '',
            duration_minutes: 5,
            data: collectFormData()
        };

        const isUpdate = Boolean(state.editingId);
        const url = isUpdate
            ? `/api/practice_sets/update?id=${encodeURIComponent(state.editingId)}`
            : '/api/practice_sets/create';
        const method = isUpdate ? 'PUT' : 'POST';

        if (refs.saveBtn) { refs.saveBtn.disabled = true; refs.saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang lưu...'; }

        try {
            const resp = await fetch(url, {
                method,
                headers: buildAuthHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(payload)
            });
            const result = await resp.json().catch(() => ({}));
            if (!resp.ok || !result.success) throw new Error(result.error || 'Không thể lưu');

            alert('Đã lưu thành công.');
            hideForm();
            resetForm();
            await loadSets();
        } catch (e) {
            if (e.message === 'AUTH_TOKEN_MISSING') {
                alert('Bạn chưa đăng nhập hoặc phiên đã hết hạn.');
            } else {
                alert(e.message || 'Không thể lưu.');
            }
        } finally {
            if (refs.saveBtn) { refs.saveBtn.disabled = false; refs.saveBtn.innerHTML = '<i class="bi bi-save me-2"></i>Lưu câu hỏi Speaking'; }
        }
    }

    window.editSpeakingCauhoi = function (id) {
        const set = state.sets.find(s => s.id === id);
        if (!set) { alert('Không tìm thấy.'); return; }
        state.editingId = set.id;
        if (refs.formTitle) refs.formTitle.textContent = `Chỉnh sửa: ${set.title || ''}`;
        fillForm(set);
        showForm();
    };

    window.deleteSpeakingCauhoi = async function (id) {
        if (!confirm('Bạn có chắc muốn xóa?')) return;
        try {
            const resp = await fetch(`/api/practice_sets/delete?id=${encodeURIComponent(id)}`, {
                method: 'DELETE',
                headers: buildAuthHeaders()
            });
            const result = await resp.json().catch(() => ({}));
            if (!resp.ok || !result.success) throw new Error(result.error || 'Không thể xóa');
            await loadSets();
        } catch (e) {
            alert(e.message || 'Không thể xóa.');
        }
    };

    // ─── Events ─────────────────────────────────────────────────────
    function bindEvents() {
        refs.createBtn?.addEventListener('click', () => { resetForm(); showForm(); });
        refs.cancelBtn?.addEventListener('click', () => { hideForm(); resetForm(); });
        refs.refreshBtn?.addEventListener('click', loadSets);
        refs.saveBtn?.addEventListener('click', saveSet);
        refs.addPageBtn?.addEventListener('click', () => addPage(null));
        refs.partSelect?.addEventListener('change', () => {
            const currentCount = refs.pagesContainer.querySelectorAll('.spch-page-card').length || 1;
            refs.pagesContainer.innerHTML = '';
            state.pageCounter = 0;
            for (let i = 0; i < currentCount; i++) addPage(null);
        });
    }

    window.initSpeakingCauhoiModule = function () {
        if (!state.initialized) {
            bindEvents();
            resetForm();
            state.initialized = true;
        }
        loadSets();
    };

    document.addEventListener('DOMContentLoaded', () => {
        window.initSpeakingCauhoiModule();
    });
})();
