(function () {
    const query = new URLSearchParams(window.location.search);
    const allowedSkills = ['reading', 'listening', 'writing', 'speaking'];
    const skill = allowedSkills.includes(String(query.get('skill') || '').toLowerCase())
        ? String(query.get('skill')).toLowerCase()
        : 'reading';
    const mode = 'set';

    const skillMeta = {
        reading: {
            label: 'Reading',
            icon: 'bi-book',
            description: 'Luyện Reading VSTEP theo bộ đề từ thư viện đề ôn thi.',
            setCta: 'Luyện Reading'
        },
        listening: {
            label: 'Listening',
            icon: 'bi-headphones',
            description: 'Luyện Listening VSTEP theo bộ đề có audio.',
            setCta: 'Luyện Listening'
        },
        writing: {
            label: 'Writing',
            icon: 'bi-pencil-square',
            description: 'Luyện Writing VSTEP theo bộ đề placeholder, có lưu bài để giáo viên chấm thủ công.',
            setCta: 'Luyện Writing'
        },
        speaking: {
            label: 'Speaking',
            icon: 'bi-mic',
            description: 'Luyện Speaking VSTEP theo bộ đề, thu âm và nộp bài để giáo viên chấm.',
            setCta: 'Luyện Speaking'
        }
    };

    const refs = {
        title: document.getElementById('vstepSkillTitle'),
        description: document.getElementById('vstepSkillDescription'),
        icon: document.getElementById('vstepSkillIcon'),
        listTitle: document.getElementById('vstepSkillListTitle'),
        state: document.getElementById('vstepSkillState'),
        grid: document.getElementById('vstepSkillGrid'),
        reload: document.getElementById('reloadVstepSkillBtn'),
        setCount: document.getElementById('vstepSkillSetCount'),
        partCount: document.getElementById('vstepSkillPartCount'),
        questionCount: document.getElementById('vstepSkillQuestionCount')
    };

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function authorizedHeaders(extra = {}) {
        const token = typeof getAuthToken === 'function' ? getAuthToken() : '';
        const headers = { ...extra };
        if (token) headers.Authorization = `Bearer ${token}`;
        if (typeof buildDeviceHeaders === 'function') {
            return buildDeviceHeaders(headers);
        }
        return headers;
    }

    function setState(message, type = 'info') {
        if (!refs.state) return;
        refs.state.className = `alert alert-${type}`;
        refs.state.textContent = message;
        refs.state.style.display = message ? 'block' : 'none';
    }

    function getParts(set) {
        const data = set?.data || {};
        const parts = data?.[skill]?.parts;
        return Array.isArray(parts) ? parts : [];
    }

    function countQuestions(parts) {
        if (skill === 'writing' || skill === 'speaking') return parts.length;
        return parts.reduce((sum, part) => sum + (Array.isArray(part.questions) ? part.questions.length : 0), 0);
    }

    function totalDuration(set) {
        const durations = set?.data?.durations || {};
        return Number(durations[skill]) || Number(set?.duration_minutes) || 0;
    }

    function cacheSet(set) {
        if (!set?.id) return;
        try {
            sessionStorage.setItem('vstep_last_set_id', set.id);
            if (set.assignment?.id) {
                sessionStorage.setItem('vstep_last_assignment_id', set.assignment.id);
            }
            sessionStorage.setItem(`practice_set_cache_vstep_${set.id}`, JSON.stringify(set));
        } catch (error) {
            console.warn('Không thể cache đề VSTEP:', error);
        }
    }

    function buildExamUrl(set, partIndex = null) {
        const params = new URLSearchParams({
            set: set.id,
            skill,
            mode
        });
        if (Number.isInteger(partIndex)) {
            params.set('part', String(partIndex + 1));
        }
        if (set.assignment?.id) {
            params.set('assignment', set.assignment.id);
        }
        return `/vstep_exam?${params.toString()}`;
    }

    function formatDate(value) {
        const date = value ? new Date(value) : null;
        return date && Number.isFinite(date.getTime()) ? date.toLocaleDateString('vi-VN') : '';
    }

    function renderSetMode(sets) {
        const meta = skillMeta[skill];
        refs.grid.innerHTML = sets.map(set => {
            const parts = getParts(set);
            const questionCount = countQuestions(parts);
            const dateText = formatDate(set.created_at);
            return `
                <div class="col-sm-6 col-xl-4">
                    <article class="vstep-skill-library-card h-100">
                        <div class="vstep-skill-library-card-top">
                            <span>${escapeHtml(meta.label)} theo bộ đề</span>
                            <i class="bi ${escapeHtml(meta.icon)}"></i>
                        </div>
                        <h3>${escapeHtml(set.title || 'VSTEP practice set')}</h3>
                        <p>${escapeHtml(set.description || `${meta.label} practice placeholder`)}</p>
                        <div class="vstep-skill-library-card-meta">
                            <span><i class="bi bi-list-check"></i>${parts.length} part</span>
                            <span><i class="bi bi-question-circle"></i>${questionCount} câu/task</span>
                            <span><i class="bi bi-clock"></i>${totalDuration(set) || '-'} phút</span>
                            ${dateText ? `<span><i class="bi bi-calendar3"></i>${escapeHtml(dateText)}</span>` : ''}
                        </div>
                        <a href="${escapeHtml(buildExamUrl(set))}" class="btn btn-primary fw-bold w-100 vstep-skill-start-link" data-id="${escapeHtml(set.id)}">
                            ${escapeHtml(meta.setCta)}
                        </a>
                    </article>
                </div>
            `;
        }).join('');
    }

    function bindStartLinks(sets) {
        refs.grid.querySelectorAll('.vstep-skill-start-link').forEach(link => {
            link.addEventListener('click', event => {
                const set = sets.find(item => item.id === link.dataset.id);
                if (!set) return;
                event.preventDefault();
                cacheSet(set);
                window.location.href = link.getAttribute('href');
            });
        });
    }

    function render(sets) {
        const usableSets = sets.filter(set => getParts(set).length);
        const totalParts = usableSets.reduce((sum, set) => sum + getParts(set).length, 0);
        const totalQuestions = usableSets.reduce((sum, set) => sum + countQuestions(getParts(set)), 0);
        refs.setCount.textContent = String(usableSets.length);
        refs.partCount.textContent = String(totalParts);
        refs.questionCount.textContent = String(totalQuestions);

        if (!usableSets.length) {
            refs.grid.innerHTML = '';
            setState(`Chưa có nội dung ${skillMeta[skill].label} VSTEP published. Admin có thể thêm bộ đề placeholder trước.`, 'warning');
            return;
        }

        setState('', 'info');
        renderSetMode(usableSets);
        bindStartLinks(usableSets);
    }

    async function load() {
        setState(`Đang tải ${skillMeta[skill].label} VSTEP...`, 'info');
        refs.grid.innerHTML = '';
        try {
            const response = await fetch('/api/vstep/contents/list?flow=practice&status=published', {
                headers: authorizedHeaders()
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.error || 'Không thể tải nội dung VSTEP.');
            const sets = (result.sets || [])
                .sort((a, b) => String(a.title || '').localeCompare(String(b.title || ''), 'vi', { numeric: true }));
            render(sets);
        } catch (error) {
            setState(error.message, 'danger');
        }
    }

    function setupPage() {
        const meta = skillMeta[skill];
        const modeLabel = 'theo bộ đề';
        document.title = `${meta.label} VSTEP ${modeLabel} - Mini Hippo`;
        refs.title.textContent = `${meta.label} VSTEP - ${modeLabel}`;
        refs.description.textContent = meta.description;
        refs.icon.innerHTML = `<i class="bi ${escapeHtml(meta.icon)}"></i>`;
        refs.listTitle.innerHTML = `<i class="bi bi-folder2-open me-2"></i>${meta.label} ${modeLabel}`;
        document.querySelector(`[data-skill-nav="${skill}-${mode}"]`)?.classList.add('active');
    }

    document.addEventListener('DOMContentLoaded', () => {
        setupPage();
        refs.reload?.addEventListener('click', load);
        load();
    });
})();
