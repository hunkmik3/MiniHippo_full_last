(function () {
    const CACHE_PREFIX = 'practice_set_cache_speaking_';
    const listContainer = document.getElementById('speaking-upload-sets');
    const placeholder = document.getElementById('speaking-upload-placeholder');

    if (!listContainer) {
        return;
    }

    function setPlaceholder(message) {
        if (placeholder) {
            placeholder.textContent = message;
            placeholder.style.display = 'block';
        } else {
            listContainer.innerHTML = `<div class="col-12 text-center text-muted small">${message}</div>`;
        }
    }

    function hidePlaceholder() {
        if (placeholder) {
            placeholder.style.display = 'none';
        }
    }

    function cachePracticeSet(set) {
        if (!set || !set.id) {
            return;
        }
        try {
            sessionStorage.setItem(`${CACHE_PREFIX}${set.id}`, JSON.stringify(set));
        } catch (error) {
            console.warn('Không thể cache bộ đề Speaking:', error);
        }
    }

    function createSetCard(set) {
        const col = document.createElement('div');
        col.className = 'col-sm-6 col-lg-4 col-xl-3 mb-3';

        const card = document.createElement('div');
        card.className = 'p-3 h-100 rounded-3 text-white d-flex flex-column justify-content-between';
        card.style.background = 'linear-gradient(135deg, #0ea5e9, #0369a1)';
        card.style.boxShadow = '0 12px 24px rgba(14, 165, 233, 0.25)';

        const title = document.createElement('div');
        title.className = 'fw-semibold';
        title.textContent = set.title || 'Bộ đề Speaking';

        const meta = document.createElement('div');
        meta.className = 'text-white-50 small';
        meta.textContent = `${set.duration_minutes || 15} phút · ${new Date(set.created_at).toLocaleDateString('vi-VN')}`;

        const button = document.createElement('a');
        button.href = `speaking_question.html?set=${set.id}`;
        button.className = 'btn btn-light text-primary fw-semibold mt-3';
        button.textContent = 'Vào bộ đề';
        button.addEventListener('click', () => cachePracticeSet(set));

        card.appendChild(title);
        card.appendChild(meta);
        card.appendChild(button);
        col.appendChild(card);
        return col;
    }

    async function loadSpeakingPracticeSets() {
        setPlaceholder('Đang tải danh sách bộ đề upload...');
        try {
            const response = await fetch('/api/practice_sets/list?type=speaking');
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Không thể tải dữ liệu');
            }

            const sets = result.sets || [];
            listContainer.innerHTML = '';

            if (!sets.length) {
                setPlaceholder('Chưa có bộ đề Speaking nào.');
                return;
            }

            sets.sort((a, b) => {
                const titleA = (a.title || '').toLowerCase();
                const titleB = (b.title || '').toLowerCase();
                return titleA.localeCompare(titleB, 'vi', { numeric: true, sensitivity: 'base' });
            });

            hidePlaceholder();
            sets.forEach(set => listContainer.appendChild(createSetCard(set)));
        } catch (error) {
            console.error('speaking_practice_sets error:', error);
            setPlaceholder('Không thể tải bộ đề upload. Vui lòng thử lại sau.');
        }
    }

    document.addEventListener('DOMContentLoaded', loadSpeakingPracticeSets);
})();
