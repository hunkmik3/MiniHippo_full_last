(function () {
    var CACHE_PREFIX = 'speaking_cauhoi_cache_';
    var PART_CONFIGS = {
        1: { containerId: 'part1-list', btnClass: 'btn-primary', icon: 'bi-person-fill' },
        2: { containerId: 'part2-list', btnClass: 'btn-info', icon: 'bi-image-fill' },
        3: { containerId: 'part3-list', btnClass: 'btn-warning', icon: 'bi-images' },
        4: { containerId: 'part4-list', btnClass: 'btn-success', icon: 'bi-chat-square-text-fill' }
    };

    function cacheSpeakingSet(set) {
        if (!set || !set.id) return;
        try { sessionStorage.setItem(CACHE_PREFIX + set.id, JSON.stringify(set)); } catch (e) { }
    }

    function createCard(set, config) {
        var cardDiv = document.createElement('div');
        cardDiv.className = 'mb-1';

        var link = document.createElement('a');
        link.href = 'speaking_cauhoi_part.html?set=' + encodeURIComponent(set.id);
        link.className = 'btn ' + config.btnClass + ' btn-lg w-100 mb-1 d-flex align-items-center justify-content-center text-decoration-none';
        link.style.padding = '0.75rem';
        link.addEventListener('click', function () { cacheSpeakingSet(set); });

        var icon = document.createElement('i');
        icon.className = config.icon + ' me-2';
        icon.style.fontSize = '1.5rem';

        var content = document.createElement('div');
        content.className = 'd-flex flex-column align-items-start flex-grow-1';
        content.style.minWidth = '0';

        var title = document.createElement('span');
        title.textContent = set.title || 'Câu hỏi Speaking';
        title.style.cssText = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%;font-size:1rem;font-weight:500;';

        content.appendChild(title);
        link.appendChild(icon);
        link.appendChild(content);
        cardDiv.appendChild(link);
        return cardDiv;
    }

    function renderPartList(partNum, sets) {
        var config = PART_CONFIGS[partNum];
        var container = document.getElementById(config.containerId);
        if (!container) return;

        var filtered = sets.filter(function (s) {
            return s.data && Number(s.data.part) === partNum;
        });

        if (!filtered.length) {
            container.innerHTML = '<p class="text-muted small text-center">Chưa có câu hỏi nào</p>';
            return;
        }

        container.innerHTML = '';
        filtered.forEach(function (set) {
            container.appendChild(createCard(set, config));
        });
    }

    async function loadSpeakingSets() {
        try {
            var response = await fetch('/api/practice_sets/list?type=speaking_cauhoi');
            var result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Không thể tải dữ liệu');

            var sets = result.sets || [];
            sets.sort(function (a, b) {
                return (a.title || '').localeCompare(b.title || '', 'vi', { numeric: true, sensitivity: 'base' });
            });

            [1, 2, 3, 4].forEach(function (part) { renderPartList(part, sets); });
        } catch (error) {
            console.error('speaking_cauhoi_list error:', error);
            [1, 2, 3, 4].forEach(function (part) {
                var c = document.getElementById(PART_CONFIGS[part].containerId);
                if (c) c.innerHTML = '<p class="text-danger small text-center">Không thể tải dữ liệu</p>';
            });
        }
    }

    document.addEventListener('DOMContentLoaded', loadSpeakingSets);
})();
