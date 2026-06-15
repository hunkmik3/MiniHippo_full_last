/**
 * VSTEP Lớp Học — SHARED BLUEPRINT model.
 *
 * Workflow (giống module Lớp Học Aptis):
 *   1. Admin soạn 18 content B1 + 24 content B2 ở panel "Bài học theo buổi"
 *      (1 lần, KHÔNG gắn lớp). Content phân biệt qua band + session_number.
 *   2. Tạo lớp B1/B2 → backend auto bind 18/24 content cùng band qua
 *      vstep_assignments (idempotent, dùng /api/vstep/classes/sync-assignments
 *      để re-bind sau khi soạn content mới).
 *   3. Mọi lớp B1 dùng chung 18 content, mọi lớp B2 dùng chung 24 content.
 *
 * Module này:
 *   - Bỏ flow "click lớp → grid riêng → soạn content per-class" (đã obsolete).
 *   - Render grid 18 B1 + 24 B2 ở panel vstep-class-sessions-panel (1 lần).
 *   - Click ô buổi → mở content editor với band+session hidden inputs.
 *   - Payload hook set band + session_number cho content (không class_id).
 *   - Filter HV nâng cao trong form tạo lớp (band, chưa-có-lớp, search).
 *
 * Giao tiếp với admin_vstep.js qua window event + hidden input + payload hook.
 */
(function () {
    if (typeof window === 'undefined') return;
    if (window.__VSTEP_ADMIN_MODE__ !== 'lophoc') return;

    const $ = (id) => document.getElementById(id);

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function bandSessionCount(band) {
        return String(band || '').toUpperCase() === 'B2' ? 24 : 18;
    }

    function formatVnDate(value) {
        if (!value) return '';
        const d = new Date(`${value}T00:00:00`);
        if (!Number.isFinite(d.getTime())) return value;
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        return `${dayNames[d.getDay()]} ${dd}/${mm}/${d.getFullYear()}`;
    }

    // ===== Index content theo band+session (shared, không phụ thuộc lớp) =====
    const state = {
        activeBand: 'B1',
        activeSession: null,
        contentsByKey: new Map() // 'B1|7' -> content
    };

    function rebuildContentIndex() {
        state.contentsByKey.clear();
        const sets = window.__VSTEP_STATE__?.sets || [];
        sets.forEach(set => {
            const flow = set?.data?.vstep_flow || set?.flow;
            if (flow !== 'lesson_exam') return;
            // Ưu tiên column DB (set.band/session_number) — fallback data jsonb (content cũ).
            const band = set.band || set?.data?.vstep_band;
            const sessionNumber = Number(set.session_number || set?.data?.vstep_session_number);
            if (band && sessionNumber > 0) {
                state.contentsByKey.set(`${band}|${sessionNumber}`, set);
            }
        });
    }

    function findContent(band, sessionNumber) {
        return state.contentsByKey.get(`${band}|${sessionNumber}`) || null;
    }

    // ===== Render grid bài học theo buổi =====
    function renderGrid() {
        const panel = $('vstep-class-sessions-panel');
        if (!panel) return;

        const titleEl = $('vstep-class-sessions-title');
        if (titleEl) titleEl.textContent = 'Bài học theo buổi (Shared blueprint)';
        const subtitleEl = $('vstep-class-sessions-subtitle');
        if (subtitleEl) {
            subtitleEl.textContent = 'Soạn 1 lần — dùng chung mọi lớp cùng band. Mọi lớp B1 sẽ tự bind 18 buổi này, mọi lớp B2 sẽ tự bind 24 buổi.';
        }

        const gridEl = $('vstep-class-sessions-grid');
        if (!gridEl) return;

        // 2 tab band → admin chọn band đang xem (B1 hoặc B2).
        const band = state.activeBand;
        const total = bandSessionCount(band);

        // Tabs band: dùng inline-flex + inline-block để CHẮC CHẮN không bị
        // outer grid (nếu inherit) stretch theo column 220px. Mỗi button
        // có width: auto và bo gọn.
        const tabsHtml = `
            <div class="vstep-band-tabs" style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;">
                ${['B1', 'B2'].map(b => `
                    <button type="button" class="btn btn-sm ${b === band ? 'btn-primary' : 'btn-outline-primary'} vstep-band-tab"
                        data-band="${b}" style="width:auto;">
                        Band ${b} (${bandSessionCount(b)} buổi)
                    </button>
                `).join('')}
            </div>
        `;

        const cardsHtml = Array.from({ length: total }).map((_, i) => {
            const sessionNumber = i + 1;
            const existing = findContent(band, sessionNumber);
            const status = existing ? 'Đã có bài' : 'Chưa có bài';
            const statusClass = existing ? 'vstep-status-published' : 'vstep-status-draft';
            const action = existing
                ? '<i class="bi bi-pencil-square me-1"></i>Sửa bài'
                : '<i class="bi bi-plus-circle me-1"></i>Tạo bài';
            return `
                <button type="button" class="vstep-session-card" data-band="${band}" data-session="${sessionNumber}">
                    <div class="vstep-session-head">
                        <strong>${escapeHtml(band)} - Buổi ${sessionNumber}</strong>
                        <span class="vstep-status-pill ${statusClass}">${escapeHtml(status)}</span>
                    </div>
                    <div class="vstep-session-meta">
                        ${existing
                            ? `<span class="text-secondary small"><i class="bi bi-file-text"></i> ${escapeHtml(existing.title || '')}</span>`
                            : '<span class="text-muted small">Click để soạn</span>'
                        }
                    </div>
                    <div class="vstep-session-action">${action}</div>
                </button>
            `;
        }).join('');

        gridEl.innerHTML = tabsHtml + `<div class="vstep-session-grid">${cardsHtml}</div>`;

        gridEl.querySelectorAll('.vstep-band-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                state.activeBand = btn.dataset.band;
                renderGrid();
            });
        });
        gridEl.querySelectorAll('[data-session]').forEach(btn => {
            btn.addEventListener('click', () => {
                openSessionEditor(btn.dataset.band, Number(btn.dataset.session));
            });
        });
    }

    function showPanel(panelId) {
        document.querySelectorAll('.vstep-admin-section').forEach(section => {
            section.classList.toggle('active', section.id === panelId);
        });
        document.querySelectorAll('.vstep-admin-tab').forEach(btn => btn.classList.remove('active'));
    }

    function openSessionGrid(band) {
        state.activeBand = band || 'B1';
        rebuildContentIndex();
        renderGrid();
        showPanel('vstep-class-sessions-panel');
    }

    // ===== Mở content editor cho 1 buổi (band+session) =====
    function setSessionHiddenInputs(band, sessionNumber) {
        const setIfExists = (id, value) => {
            const el = $(id);
            if (el) el.value = value == null ? '' : String(value);
        };
        setIfExists('vstep-content-band', band || '');
        setIfExists('vstep-content-session-number', sessionNumber || '');
        // Giữ class-id input để backward compat — luôn để trống (shared, không gắn lớp).
        setIfExists('vstep-content-class-id', '');
        setIfExists('vstep-content-due-at', '');
    }

    function clearSessionHiddenInputs() {
        setSessionHiddenInputs('', '');
    }

    function openSessionEditor(band, sessionNumber) {
        if (!band || !sessionNumber) return;
        state.activeBand = band;
        state.activeSession = sessionNumber;
        setSessionHiddenInputs(band, sessionNumber);

        // Mở content panel qua sidebar button.
        const flowBtn = document.querySelector('[data-vstep-flow="lesson_exam"]');
        if (flowBtn) flowBtn.click();

        setTimeout(() => {
            const existing = findContent(band, sessionNumber);
            if (existing && window.__VSTEP_API__?.fillForm) {
                window.__VSTEP_API__.fillForm(existing);
                // Suy enabled skills + partCount từ content thực tế đã lưu.
                currentEnabledSkills = deriveEnabledSkillsFromContent(existing);
                applySkillVisibility();
                ALL_SKILLS.forEach(applyPartVisibility);
                renderSkillToolbar();
            } else {
                // Buổi chưa có content → reset form rồi pre-fill blueprint mặc định.
                // Admin vẫn tự do thêm part/câu/đáp án/skill khác sau đó (giống ôn thi).
                if (window.__VSTEP_API__?.resetForm) {
                    window.__VSTEP_API__.resetForm();
                }
                prefillFromBlueprint(band, sessionNumber);
            }
            updateContextBanner(band, sessionNumber);
        }, 50);
    }

    // ===== Pre-fill content editor theo blueprint =====
    // Blueprint là default suggestion (vd Buổi 1 = Reading 1+2). Sau khi pre-fill,
    // admin tự do edit/thêm/xoá part, thêm câu, đổi đáp án, thêm kỹ năng khác.
    // KHÔNG khoá UI — chỉ điền giá trị mặc định + ẩn skill không dùng (có toolbar
    // để bật/tắt skill như checkbox).
    const SKILL_META = {
        reading:   { icon: 'bi-book',            label: 'Reading'   },
        listening: { icon: 'bi-headphones',      label: 'Listening' },
        writing:   { icon: 'bi-pencil-square',   label: 'Writing'   },
        speaking:  { icon: 'bi-mic',             label: 'Speaking'  }
    };
    const ALL_SKILLS = ['reading', 'listening', 'writing', 'speaking'];
    // DOM render cứng: 3 listening, 4 reading, 2 writing, 3 speaking (admin_vstep.js initEditors).
    const MAX_PARTS = { listening: 3, reading: 4, writing: 2, speaking: 3 };

    // Set kỹ năng đang bật cho buổi hiện tại (mutable, refresh mỗi lần mở buổi).
    let currentEnabledSkills = new Set();
    // Số part đang dùng cho mỗi skill (1-based count). Vd reading=2 → hiện Part 1,2 ẩn Part 3,4.
    let currentPartCounts = { listening: 0, reading: 0, writing: 0, speaking: 0 };

    function prefillFromBlueprint(band, sessionNumber) {
        const bp = window.VSTEP_SESSION_BLUEPRINTS?.getBlueprint(band, sessionNumber);
        if (!bp) {
            const titleInput = $('vstep-title');
            if (titleInput && !titleInput.value) {
                titleInput.value = `${band} - Buổi ${sessionNumber}`;
            }
            // Không có blueprint → bật full 4 kỹ năng (giống ôn thi).
            currentEnabledSkills = new Set(ALL_SKILLS);
            applySkillVisibility();
            renderSkillToolbar();
            return;
        }

        // 1. Title gợi ý theo blueprint.
        const titleInput = $('vstep-title');
        if (titleInput) titleInput.value = bp.title || `${band} - Buổi ${sessionNumber}`;

        // 2. Tập kỹ năng mặc định + số part mặc định theo blueprint.
        const skillsInBp = ALL_SKILLS.filter(s => bp[s]?.parts?.length);
        currentEnabledSkills = new Set(skillsInBp);
        ALL_SKILLS.forEach(s => {
            const bpCount = bp[s]?.parts?.length || 0;
            currentPartCounts[s] = Math.min(bpCount, MAX_PARTS[s]);
        });

        // 3. Set contentSkill = full_test để collectPayload chạy hết các skill có dữ liệu.
        //    (Skill không bật sẽ KHÔNG có questions → vstep_exam.js skip empty parts).
        const skillBtn = document.querySelector('[data-vstep-practice-skill="full_test"]');
        if (skillBtn) skillBtn.click();

        // setPracticeSkill có thể re-init editors → đợi 80ms rồi mới fill từng part.
        setTimeout(() => {
            fillPartsByBlueprint(bp);
            applySkillVisibility();
            ALL_SKILLS.forEach(applyPartVisibility);
            renderSkillToolbar();
        }, 80);
    }

    function fillPartsByBlueprint(bp) {
        // Reading parts (DOM render 4 part — fill tối đa 4).
        (bp.reading?.parts || []).slice(0, 4).forEach((part, i) => {
            const idx = i + 1;
            const titleEl = $(`vstep-reading-${idx}-title`);
            if (titleEl) titleEl.value = part.title || `Part ${idx}`;
            triggerPlaceholderQuestions(`vstep-reading-${idx}-questions`, part.questionCount);
        });

        // Listening parts (DOM render 3 part — fill tối đa 3).
        (bp.listening?.parts || []).slice(0, 3).forEach((part, i) => {
            const idx = i + 1;
            const titleEl = $(`vstep-listening-${idx}-title`);
            if (titleEl) titleEl.value = part.title || `Part ${idx}`;
            triggerPlaceholderQuestions(`vstep-listening-${idx}-questions`, part.questionCount);
        });

        // Writing tasks (DOM render 2 part).
        (bp.writing?.parts || []).slice(0, 2).forEach((part, i) => {
            const idx = i + 1;
            const titleEl = $(`vstep-writing-${idx}-title`);
            if (titleEl) titleEl.value = part.title || `Part ${idx}`;
            const instrEl = $(`vstep-writing-${idx}-instructions`);
            if (instrEl && part.instructions) instrEl.value = part.instructions;
        });

        // Speaking parts (DOM render 3 part).
        (bp.speaking?.parts || []).slice(0, 3).forEach((part, i) => {
            const idx = i + 1;
            const titleEl = $(`vstep-speaking-${idx}-title`);
            if (titleEl) titleEl.value = part.title || `Part ${idx}`;
            if (Number.isFinite(part.prepSeconds)) {
                const prepEl = $(`vstep-speaking-${idx}-prep`);
                if (prepEl) prepEl.value = String(part.prepSeconds);
            }
            if (Number.isFinite(part.answerSeconds)) {
                const ansEl = $(`vstep-speaking-${idx}-answer`);
                if (ansEl) ansEl.value = String(part.answerSeconds);
            }
        });
    }

    // Trigger nút "Tạo placeholder câu hỏi" với count tùy chỉnh theo blueprint.
    // admin_vstep.js: button.dataset.count = ID của input số câu (KHÔNG phải số).
    // Set value của input số câu trước, rồi click button → handler đọc value đúng.
    function triggerPlaceholderQuestions(targetId, count) {
        if (!targetId || !count || count <= 0) return;
        const btn = document.querySelector(`.vstep-generate-question-lines[data-target="${targetId}"]`);
        if (!btn) return;
        const countInputId = btn.dataset.count;
        const countInput = document.getElementById(countInputId);
        if (countInput) countInput.value = String(count);
        // Skip confirm dialog: form vừa reset, không có rows nào → confirm() không trigger.
        btn.click();
    }

    // ===== Visibility + add/remove cho TỪNG PART trong 1 skill =====
    function applyPartVisibility(skill) {
        const container = document.getElementById(`vstep-${skill}-editors`);
        if (!container) return;
        const parts = Array.from(container.querySelectorAll(':scope > .vstep-part-editor'));
        parts.forEach((part, i) => {
            part.classList.toggle('d-none', i >= currentPartCounts[skill]);
        });
        injectPartControls(skill);
    }

    function clearPartData(skill, partIndex) {
        // partIndex 1-based — khớp id vstep-{skill}-{partIndex}-{field}.
        const container = document.getElementById(`vstep-${skill}-editors`);
        if (!container) return;
        const partEl = container.querySelectorAll(':scope > .vstep-part-editor')[partIndex - 1];
        if (!partEl) return;
        partEl.querySelectorAll('input, textarea').forEach(el => {
            if (el.type === 'checkbox' || el.type === 'radio') { el.checked = false; return; }
            if (el.type === 'file') { try { el.value = ''; } catch (_) {} return; }
            el.value = '';
        });
        partEl.querySelectorAll('.vstep-question-builder').forEach(b => { b.innerHTML = ''; });
    }

    function injectPartControls(skill) {
        const container = document.getElementById(`vstep-${skill}-editors`);
        if (!container) return;
        container.querySelector(':scope > .vstep-part-controls')?.remove();

        const max = MAX_PARTS[skill];
        const count = currentPartCounts[skill];

        const wrap = document.createElement('div');
        wrap.className = 'vstep-part-controls d-flex flex-wrap align-items-center gap-2 mt-2 p-2 border rounded bg-light';
        wrap.innerHTML = `
            <span class="small text-muted me-auto">
                <i class="bi ${SKILL_META[skill].icon} me-1"></i>
                ${SKILL_META[skill].label}: đang dùng <strong>${count}/${max}</strong> part
            </span>
            ${count > 0 ? `
                <button type="button" class="btn btn-sm btn-outline-warning vstep-remove-last-part-btn" data-skill="${skill}">
                    <i class="bi bi-dash-circle me-1"></i>Bỏ Part ${count}
                </button>
            ` : ''}
            ${count < max ? `
                <button type="button" class="btn btn-sm btn-outline-primary vstep-add-part-btn" data-skill="${skill}">
                    <i class="bi bi-plus-circle me-1"></i>Thêm Part ${count + 1}
                </button>
            ` : '<span class="badge bg-secondary">Đã dùng tối đa</span>'}
        `;
        container.appendChild(wrap);

        wrap.querySelector('.vstep-add-part-btn')?.addEventListener('click', () => {
            if (currentPartCounts[skill] < MAX_PARTS[skill]) {
                currentPartCounts[skill] += 1;
                // Nếu skill chưa bật → tự bật.
                if (!currentEnabledSkills.has(skill)) {
                    currentEnabledSkills.add(skill);
                    applySkillVisibility();
                    renderSkillToolbar();
                }
                applyPartVisibility(skill);
            }
        });
        wrap.querySelector('.vstep-remove-last-part-btn')?.addEventListener('click', () => {
            const idx = currentPartCounts[skill];
            if (idx <= 0) return;
            if (!window.confirm(`Bỏ Part ${idx} của ${SKILL_META[skill].label}? Dữ liệu Part ${idx} sẽ mất.`)) return;
            clearPartData(skill, idx);
            currentPartCounts[skill] -= 1;
            // Nếu hết part → coi như tắt skill luôn.
            if (currentPartCounts[skill] === 0) {
                currentEnabledSkills.delete(skill);
                applySkillVisibility();
                renderSkillToolbar();
            }
            applyPartVisibility(skill);
        });
    }

    // ===== Toolbar bật/tắt kỹ năng =====
    function applySkillVisibility() {
        ALL_SKILLS.forEach(skill => {
            const card = document.querySelector(`details.vstep-skill-card[data-vstep-skill="${skill}"]`);
            if (!card) return;
            const enabled = currentEnabledSkills.has(skill);
            card.classList.toggle('d-none', !enabled);
            if (enabled) {
                card.setAttribute('open', '');
            }
        });
    }

    function clearSkillData(skill) {
        const card = document.querySelector(`details.vstep-skill-card[data-vstep-skill="${skill}"]`);
        if (!card) return;
        // Clear input/textarea trong card. Skip ready-seconds/message (global Speaking).
        card.querySelectorAll('input, textarea').forEach(el => {
            if (el.id === 'vstep-speaking-ready-seconds' || el.id === 'vstep-speaking-ready-message') return;
            if (el.type === 'checkbox' || el.type === 'radio') { el.checked = false; return; }
            if (el.type === 'file') { try { el.value = ''; } catch (_) {} return; }
            el.value = '';
        });
        // Xoá question rows đã render.
        card.querySelectorAll('.vstep-question-builder').forEach(b => { b.innerHTML = ''; });
        // Reset count + ẩn toàn bộ part editor + redraw toolbar nhỏ.
        currentPartCounts[skill] = 0;
        applyPartVisibility(skill);
    }

    function renderSkillToolbar() {
        const stack = document.querySelector('.vstep-skill-stack');
        if (!stack) return;
        let toolbar = $('vstep-skills-toolbar');
        if (!toolbar) {
            toolbar = document.createElement('div');
            toolbar.id = 'vstep-skills-toolbar';
            toolbar.className = 'd-flex flex-wrap align-items-center gap-2 mb-3 p-2 border rounded bg-light';
            stack.parentNode.insertBefore(toolbar, stack);
        }
        const enabled = ALL_SKILLS.filter(s => currentEnabledSkills.has(s));
        const missing = ALL_SKILLS.filter(s => !currentEnabledSkills.has(s));

        const enabledHtml = enabled.length
            ? enabled.map(s => `
                <span class="badge bg-primary d-inline-flex align-items-center gap-1 py-2 px-2">
                    <i class="bi ${SKILL_META[s].icon}"></i>
                    <span>${SKILL_META[s].label}</span>
                    <button type="button" class="btn-close btn-close-white vstep-remove-skill-btn ms-1"
                        data-skill="${s}" aria-label="Bỏ kỹ năng" title="Bỏ kỹ năng ${SKILL_META[s].label}"
                        style="font-size:.55em;"></button>
                </span>
            `).join('')
            : '<span class="text-danger small">Chưa bật kỹ năng nào — bấm nút bên phải để thêm.</span>';

        const missingHtml = missing.length
            ? `<span class="small text-muted ms-2 me-1">|  Thêm:</span>` +
              missing.map(s => `
                <button type="button" class="btn btn-sm btn-outline-success vstep-add-skill-btn" data-skill="${s}">
                    <i class="bi bi-plus-circle me-1"></i><i class="bi ${SKILL_META[s].icon} me-1"></i>${SKILL_META[s].label}
                </button>
            `).join('')
            : '<span class="small text-success ms-2"><i class="bi bi-check2-circle me-1"></i>Đã bật đủ 4 kỹ năng</span>';

        toolbar.innerHTML = `
            <span class="small text-muted me-1"><i class="bi bi-layers me-1"></i>Kỹ năng trong buổi:</span>
            ${enabledHtml}
            ${missingHtml}
        `;

        toolbar.querySelectorAll('.vstep-add-skill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const s = btn.dataset.skill;
                if (!s) return;
                currentEnabledSkills.add(s);
                // Khi bật skill mới → mặc định hiện 1 part đầu để admin nhập.
                if (currentPartCounts[s] === 0) currentPartCounts[s] = 1;
                applySkillVisibility();
                applyPartVisibility(s);
                renderSkillToolbar();
            });
        });
        toolbar.querySelectorAll('.vstep-remove-skill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const s = btn.dataset.skill;
                if (!s) return;
                if (!window.confirm(`Bỏ kỹ năng ${SKILL_META[s].label} khỏi buổi này? Dữ liệu đã nhập sẽ bị xoá.`)) return;
                currentEnabledSkills.delete(s);
                clearSkillData(s);
                applySkillVisibility();
                renderSkillToolbar();
            });
        });
    }

    // ===== Khi load content có sẵn (existing) → suy enabled skills + partCount từ data =====
    function deriveEnabledSkillsFromContent(content) {
        const data = content?.data || {};
        const enabled = new Set();
        ALL_SKILLS.forEach(skill => {
            const parts = data?.[skill]?.parts || [];
            // Đếm part thực sự có dữ liệu (questions/prompt/passage/audioUrl).
            let lastMeaningful = 0;
            parts.forEach((p, i) => {
                const has = (p?.questions?.length || p?.prompt || p?.passage || p?.audioUrl);
                if (has) lastMeaningful = i + 1;
            });
            currentPartCounts[skill] = Math.min(lastMeaningful, MAX_PARTS[skill]);
            if (lastMeaningful > 0) enabled.add(skill);
        });
        // Fallback: nếu không suy được gì → bật full 4 skill với số part max.
        if (!enabled.size) {
            ALL_SKILLS.forEach(s => { currentPartCounts[s] = MAX_PARTS[s]; });
            return new Set(ALL_SKILLS);
        }
        return enabled;
    }

    function updateContextBanner(band, sessionNumber) {
        const banner = $('vstep-content-context-banner');
        if (!banner) return;
        banner.classList.remove('d-none');
        banner.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>Đang soạn ${escapeHtml(band)} - Buổi ${escapeHtml(String(sessionNumber))}</strong>
                    <div class="small text-secondary">Nội dung này dùng chung cho mọi lớp ${escapeHtml(band)}. Mọi lớp tạo sau sẽ tự bind buổi này.</div>
                </div>
                <button type="button" class="btn btn-sm btn-outline-secondary" id="vstep-content-back-to-grid">
                    <i class="bi bi-arrow-left me-1"></i> Về danh sách buổi
                </button>
            </div>
        `;
        $('vstep-content-back-to-grid')?.addEventListener('click', () => openSessionGrid(band));
    }

    function hideContextBanner() {
        const banner = $('vstep-content-context-banner');
        if (banner) {
            banner.classList.add('d-none');
            banner.innerHTML = '';
        }
        // Reset toolbar + un-hide skill cards + un-hide part editors về mặc định khi rời context buổi.
        const toolbar = $('vstep-skills-toolbar');
        if (toolbar) toolbar.remove();
        ALL_SKILLS.forEach(skill => {
            const card = document.querySelector(`details.vstep-skill-card[data-vstep-skill="${skill}"]`);
            if (card) card.classList.remove('d-none');
            const container = document.getElementById(`vstep-${skill}-editors`);
            if (container) {
                container.querySelector(':scope > .vstep-part-controls')?.remove();
                container.querySelectorAll(':scope > .vstep-part-editor').forEach(p => p.classList.remove('d-none'));
            }
        });
        currentEnabledSkills = new Set();
        currentPartCounts = { listening: 0, reading: 0, writing: 0, speaking: 0 };
    }

    // ===== Payload hook: gắn band + session_number vào content trước khi save =====
    window.__VSTEP_PAYLOAD_HOOK__ = function (payload) {
        const band = $('vstep-content-band')?.value || '';
        const sessionNumber = Number($('vstep-content-session-number')?.value || 0);
        if ((band === 'B1' || band === 'B2') && sessionNumber > 0) {
            payload.band = band;
            payload.session_number = sessionNumber;
            payload.data = payload.data || {};
            payload.data.vstep_band = band;
            payload.data.vstep_session_number = sessionNumber;
            // Title gợi ý nếu admin chưa nhập.
            if (!payload.title || !payload.title.trim()) {
                payload.title = `${band} - Buổi ${sessionNumber}`;
            }
        }
    };

    // ===== Sau khi save: refresh grid + auto re-sync assignments cho mọi lớp =====
    async function autoSyncAllClasses() {
        const classes = window.__VSTEP_STATE__?.classes || [];
        const token = localStorage.getItem('auth_token') || '';
        await Promise.all(classes.map(async (cls) => {
            try {
                await fetch(`/api/vstep/classes/sync-assignments?id=${encodeURIComponent(cls.id)}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
                });
            } catch (e) {
                console.warn(`Sync class ${cls.id} failed:`, e);
            }
        }));
    }

    window.addEventListener('vstep:content-saved', async (e) => {
        const content = e.detail?.content;
        const band = e.detail?.payload?.band || e.detail?.payload?.data?.vstep_band;
        const sessionNumber = e.detail?.payload?.session_number || e.detail?.payload?.data?.vstep_session_number;
        if (!band || !sessionNumber || !content) return;

        // Sync TỰ ĐỘNG tất cả lớp cùng band — đẩy content mới vào assignment.
        await autoSyncAllClasses();

        // Refresh state.sets trong admin_vstep.js (đã có loadSets() — admin_vstep.js
        // tự gọi sau saveSet success). Sau đó render grid lại.
        clearSessionHiddenInputs();
        hideContextBanner();
        setTimeout(() => openSessionGrid(band), 250);
    });

    // ===== Quick access: button "Bài học theo buổi" trong sidebar =====
    // Khi admin click data-vstep-flow="lesson_exam" lần đầu (chưa có context buổi),
    // chuyển hướng sang grid B1 thay vì mở blank content editor.
    document.addEventListener('click', (event) => {
        const flowBtn = event.target.closest('[data-vstep-flow="lesson_exam"]');
        if (!flowBtn) return;
        // Nếu admin đang trong context 1 buổi (hidden input band có giá trị) → để admin_vstep.js xử lý.
        const currentBand = $('vstep-content-band')?.value || '';
        if (!currentBand) {
            // Mặc định mở grid thay vì content editor trống.
            event.preventDefault();
            event.stopImmediatePropagation();
            openSessionGrid(state.activeBand);
        }
    }, true);

    // ===== Hook event tạo lớp: hiển thị summary auto-bind =====
    window.addEventListener('vstep:class-created', (e) => {
        const summary = e.detail?.syncSummary;
        if (!summary) return;
        const alertEl = $('vstepClassAlert');
        if (!alertEl) return;
        const msg = `Đã tạo lớp + tự bind ${summary.created} buổi (skip ${summary.skipped} đã có, thiếu content cho ${summary.missing?.length || 0} buổi).`;
        alertEl.className = 'alert alert-success small mb-0';
        alertEl.textContent = msg;
    });

    // ===== Holidays checkboxes — giữ nguyên =====
    function setupHolidayCheckboxes() {
        const textarea = $('vstep-class-holidays');
        const list = $('vstep-class-holidays-list');
        const addBtn = $('vstep-class-holiday-add-btn');
        const addInput = $('vstep-class-holiday-add-input');
        if (!textarea || !list || !addBtn || !addInput) return;
        function read() { try { return JSON.parse(textarea.value || '[]'); } catch { return []; } }
        function write(arr) {
            const cleaned = Array.from(new Set(arr.filter(Boolean))).sort();
            textarea.value = JSON.stringify(cleaned);
            render(cleaned);
        }
        function render(arr) {
            if (!arr.length) {
                list.innerHTML = '<div class="text-secondary small">Chưa có ngày nghỉ.</div>';
                return;
            }
            list.innerHTML = arr.map(date => `
                <div class="form-check form-check-inline me-3 mb-1">
                    <input class="form-check-input vstep-holiday-check" type="checkbox" checked data-date="${escapeHtml(date)}" id="vstep-holiday-${escapeHtml(date)}">
                    <label class="form-check-label small" for="vstep-holiday-${escapeHtml(date)}">${escapeHtml(formatVnDate(date))}</label>
                </div>
            `).join('');
            list.querySelectorAll('.vstep-holiday-check').forEach(cb => {
                cb.addEventListener('change', () => {
                    if (cb.checked) return;
                    write(read().filter(d => d !== cb.dataset.date));
                });
            });
        }
        addBtn.addEventListener('click', () => {
            const val = (addInput.value || '').trim();
            if (!val) return;
            const arr = read();
            if (!arr.includes(val)) arr.push(val);
            write(arr);
            addInput.value = '';
        });
        const form = $('vstepClassForm');
        if (form) form.addEventListener('reset', () => setTimeout(() => write([]), 0));
        render(read());
    }

    // ===== Filter HV nâng cao — band + chưa-có-lớp + search =====
    function setupStudentCheckboxesAdvanced() {
        const select = $('vstep-class-students');
        const list = $('vstep-class-students-list');
        const search = $('vstep-class-students-search');
        if (!select || !list) return;

        // Inject thêm 2 filter (band + chỉ-chưa-có-lớp) nếu chưa có.
        if (!$('vstep-class-students-band-filter')) {
            const filterBar = document.createElement('div');
            filterBar.className = 'd-flex gap-2 mb-2 flex-wrap align-items-center';
            filterBar.innerHTML = `
                <select class="form-select form-select-sm" id="vstep-class-students-band-filter" style="max-width:120px;">
                    <option value="">Mọi band</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                </select>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" id="vstep-class-students-unassigned-only">
                    <label class="form-check-label small" for="vstep-class-students-unassigned-only">Chỉ HV chưa có lớp</label>
                </div>
                <button type="button" class="btn btn-sm btn-outline-primary" id="vstep-class-students-select-all">
                    <i class="bi bi-check-all me-1"></i>Chọn tất cả đang lọc
                </button>
                <button type="button" class="btn btn-sm btn-outline-secondary" id="vstep-class-students-clear-all">
                    <i class="bi bi-x-square me-1"></i>Bỏ chọn hết
                </button>
            `;
            search?.parentNode?.insertBefore(filterBar, search.nextSibling);
        }

        function getStudentBand(opt) {
            // option value = student.id. Lookup band từ state.users.
            const users = window.__VSTEP_STATE__?.users || [];
            const u = users.find(x => String(x.id) === String(opt.value));
            return String(u?.band || '').toUpperCase();
        }
        function getStudentClassId(opt) {
            const users = window.__VSTEP_STATE__?.users || [];
            const u = users.find(x => String(x.id) === String(opt.value));
            return u?.class_id || '';
        }

        function render() {
            const keyword = ((search?.value) || '').toLowerCase().trim();
            const bandFilter = ($('vstep-class-students-band-filter')?.value || '').toUpperCase();
            const unassignedOnly = $('vstep-class-students-unassigned-only')?.checked;
            const opts = Array.from(select.options);
            if (!opts.length) {
                list.innerHTML = '<div class="text-secondary small">Chưa có học viên. Tạo HV ở tab "Học viên" trước.</div>';
                return;
            }
            const filtered = opts.filter(o => {
                if (keyword && !(o.textContent || '').toLowerCase().includes(keyword)) return false;
                if (bandFilter && getStudentBand(o) !== bandFilter) return false;
                if (unassignedOnly && getStudentClassId(o)) return false;
                return true;
            });
            if (!filtered.length) {
                list.innerHTML = '<div class="text-secondary small">Không có học viên nào khớp bộ lọc.</div>';
                return;
            }
            list.innerHTML = `
                <div class="small text-muted mb-2">${filtered.length} / ${opts.length} HV (lọc theo điều kiện)</div>
                ${filtered.map(o => {
                    const checked = o.selected ? 'checked' : '';
                    const cbId = `vstep-class-student-cb-${o.value}`;
                    const band = getStudentBand(o);
                    const cid = getStudentClassId(o);
                    const meta = [
                        band ? `<span class="badge bg-secondary">${escapeHtml(band)}</span>` : '',
                        cid ? '<span class="badge bg-warning text-dark">Đã có lớp</span>' : ''
                    ].filter(Boolean).join(' ');
                    return `
                        <div class="form-check d-flex align-items-center gap-2">
                            <input class="form-check-input vstep-class-student-check" type="checkbox" value="${escapeHtml(o.value)}" id="${escapeHtml(cbId)}" ${checked}>
                            <label class="form-check-label small flex-grow-1" for="${escapeHtml(cbId)}">${escapeHtml(o.textContent || '')}</label>
                            ${meta}
                        </div>
                    `;
                }).join('')}
            `;
            list.querySelectorAll('.vstep-class-student-check').forEach(cb => {
                cb.addEventListener('change', () => {
                    const opt = Array.from(select.options).find(o => o.value === cb.value);
                    if (opt) opt.selected = cb.checked;
                });
            });
        }

        const obs = new MutationObserver(render);
        obs.observe(select, { childList: true });
        search?.addEventListener('input', render);
        $('vstep-class-students-band-filter')?.addEventListener('change', render);
        $('vstep-class-students-unassigned-only')?.addEventListener('change', render);

        $('vstep-class-students-select-all')?.addEventListener('click', () => {
            list.querySelectorAll('.vstep-class-student-check').forEach(cb => {
                cb.checked = true;
                const opt = Array.from(select.options).find(o => o.value === cb.value);
                if (opt) opt.selected = true;
            });
        });
        $('vstep-class-students-clear-all')?.addEventListener('click', () => {
            Array.from(select.options).forEach(o => { o.selected = false; });
            render();
        });

        const form = $('vstepClassForm');
        if (form) {
            form.addEventListener('reset', () => {
                setTimeout(() => {
                    Array.from(select.options).forEach(o => { o.selected = false; });
                    render();
                }, 0);
            });
        }

        render();
    }

    function fixOverviewCounts() {
        const resultsEl = $('vstepOverviewResults');
        if (!resultsEl) return;
        let updating = false;
        function recompute() {
            if (updating) return;
            const results = window.__VSTEP_STATE__?.results || [];
            const lessonExamCount = results.filter(r => r?.metadata?.vstep_flow === 'lesson_exam').length;
            const desired = String(lessonExamCount);
            if (resultsEl.textContent === desired) return;
            updating = true;
            resultsEl.textContent = desired;
            setTimeout(() => { updating = false; }, 0);
        }
        const obs = new MutationObserver(recompute);
        obs.observe(resultsEl, { childList: true, characterData: true, subtree: true });
        recompute();
    }

    document.addEventListener('DOMContentLoaded', () => {
        setupHolidayCheckboxes();
        setupStudentCheckboxesAdvanced();
        fixOverviewCounts();
    });
})();
