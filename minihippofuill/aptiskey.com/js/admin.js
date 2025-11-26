// Admin Panel - Unified Management for Reading and Listening
(function() {
    'use strict';

    // Check if we're on the admin page
    if (!document.getElementById('adminTabs')) {
        return;
    }

    const refs = {
        readingSetsListContainer: document.getElementById('reading-sets-list-container'),
        listeningSetsListContainer: document.getElementById('listening-sets-list-container'),
        refreshReadingSetsBtn: document.getElementById('refreshReadingSetsBtn'),
        createReadingSetBtn: document.getElementById('createReadingSetBtn'),
        refreshListeningSetsBtn: document.getElementById('refreshListeningSetsBtn'),
        createListeningSetBtn: document.getElementById('createListeningSetBtn')
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

    // Sub-tab management
    function initSubTabs() {
        const subTabButtons = document.querySelectorAll('.sub-tab-btn');
        subTabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const subtab = btn.dataset.subtab;
                
                // Remove active class from all buttons in the same group
                const parent = btn.closest('.sub-tabs');
                parent.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Hide all sub-tab contents in the same tab pane
                const tabPane = btn.closest('.tab-pane');
                tabPane.querySelectorAll('.sub-tab-content').forEach(content => {
                    content.style.display = 'none';
                });
                
                // Show selected sub-tab content
                const contentId = subtab + '-content';
                const content = document.getElementById(contentId);
                if (content) {
                    content.style.display = 'block';
                    
                    // Load data when switching to sets tab
                    if (subtab === 'reading-sets') {
                        loadReadingSets();
                    } else if (subtab === 'listening-sets') {
                        loadListeningSets();
                    }
                }
            });
        });
    }

    // Load Reading Sets List
    async function loadReadingSets() {
        if (!refs.readingSetsListContainer) return;
        
        try {
            refs.readingSetsListContainer.innerHTML = `
                <div class="empty-state">
                    <div class="spinner-modern mx-auto mb-3"></div>
                    <p>Đang tải danh sách...</p>
                </div>
            `;

            const response = await fetch('/api/practice_sets/list?type=reading', {
                headers: buildAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to load reading sets');
            }

            const data = await response.json();
            const sets = Array.isArray(data) ? data : (data.sets || []);

            if (!Array.isArray(sets) || sets.length === 0) {
                refs.readingSetsListContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="bi bi-inbox"></i>
                        <h4>Chưa có bộ đề nào</h4>
                        <p>Hãy tạo bộ đề Reading đầu tiên của bạn</p>
                    </div>
                `;
                return;
            }

            const html = `
                <div class="items-list">
                    ${sets.map(set => `
                        <div class="item-card">
                            <div class="item-info">
                                <h5>${set.title || 'Untitled'}</h5>
                                <p>
                                    <i class="bi bi-clock me-1"></i>
                                    ${set.duration || 'N/A'} phút
                                    ${set.description ? ` • ${set.description.substring(0, 50)}...` : ''}
                                </p>
                            </div>
                            <div class="item-actions">
                                <button class="btn btn-icon" style="background: var(--success-color); color: white;" onclick="viewReadingSet('${set.id}')" title="Vào bài học">
                                    <i class="bi bi-eye"></i>
                                </button>
                                <button class="btn btn-icon btn-edit" onclick="editReadingSetInline('${set.id}')" title="Chỉnh sửa">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-icon btn-delete" onclick="deleteReadingSet('${set.id}')" title="Xóa">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            refs.readingSetsListContainer.innerHTML = html;
        } catch (error) {
            console.error('Error loading reading sets:', error);
            refs.readingSetsListContainer.innerHTML = `
                <div class="alert alert-danger-modern alert-modern">
                    <i class="bi bi-exclamation-triangle"></i>
                    <div>
                        <strong>Lỗi!</strong> Không thể tải danh sách bộ đề Reading. Vui lòng thử lại.
                    </div>
                </div>
            `;
        }
    }

    // Load Listening Sets List
    async function loadListeningSets() {
        if (!refs.listeningSetsListContainer) return;
        
        try {
            refs.listeningSetsListContainer.innerHTML = `
                <div class="empty-state">
                    <div class="spinner-modern mx-auto mb-3"></div>
                    <p>Đang tải danh sách...</p>
                </div>
            `;

            const response = await fetch('/api/practice_sets/list?type=listening', {
                headers: buildAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to load listening sets');
            }

            const data = await response.json();
            const sets = Array.isArray(data) ? data : (data.sets || []);

            if (!Array.isArray(sets) || sets.length === 0) {
                refs.listeningSetsListContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="bi bi-inbox"></i>
                        <h4>Chưa có bộ đề nào</h4>
                        <p>Hãy tạo bộ đề Listening đầu tiên của bạn</p>
                    </div>
                `;
                return;
            }

            const html = `
                <div class="items-list">
                    ${sets.map(set => `
                        <div class="item-card">
                            <div class="item-info">
                                <h5>${set.title || 'Untitled'}</h5>
                                <p>
                                    <i class="bi bi-clock me-1"></i>
                                    ${set.duration || 'N/A'} phút
                                    ${set.description ? ` • ${set.description.substring(0, 50)}...` : ''}
                                </p>
                            </div>
                            <div class="item-actions">
                                <button class="btn btn-icon" style="background: var(--success-color); color: white;" onclick="viewListeningSet('${set.id}')" title="Vào bài học">
                                    <i class="bi bi-eye"></i>
                                </button>
                                <button class="btn btn-icon btn-edit" onclick="editListeningSetInline('${set.id}')" title="Chỉnh sửa">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-icon btn-delete" onclick="deleteListeningSet('${set.id}')" title="Xóa">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            refs.listeningSetsListContainer.innerHTML = html;
        } catch (error) {
            console.error('Error loading listening sets:', error);
            refs.listeningSetsListContainer.innerHTML = `
                <div class="alert alert-danger-modern alert-modern">
                    <i class="bi bi-exclamation-triangle"></i>
                    <div>
                        <strong>Lỗi!</strong> Không thể tải danh sách bộ đề Listening. Vui lòng thử lại.
                    </div>
                </div>
            `;
        }
    }

    // Create Reading Set - Show form inline
    function createReadingSet() {
        showReadingSetForm(null);
    }

    // Create Listening Set - Show form inline
    function createListeningSet() {
        showListeningSetForm(null);
    }

    // Edit Reading Set - Redirect (old method, kept for compatibility)
    function editReadingSet(id) {
        window.location.href = `admin_upload.html?edit=${id}`;
    }

    // Edit Reading Set Inline
    async function editReadingSetInline(id) {
        showReadingSetForm(id);
    }

    // Edit Listening Set - Redirect (old method, kept for compatibility)
    function editListeningSet(id) {
        window.location.href = `admin_listening_sets.html?edit=${id}`;
    }

    // Edit Listening Set Inline
    async function editListeningSetInline(id) {
        showListeningSetForm(id);
    }

    // View Reading Set - Open in new tab
    function viewReadingSet(id) {
        window.open(`reading_bode_set.html?id=${id}`, '_blank');
    }

    // View Listening Set - Open in new tab
    function viewListeningSet(id) {
        window.open(`listening_bode_set.html?id=${id}`, '_blank');
    }

    // Show Reading Set Form
    async function showReadingSetForm(setId) {
        const formContainer = document.getElementById('reading-set-form-container');
        const formContent = document.getElementById('reading-set-form-content');
        const formTitle = document.getElementById('reading-set-form-title');
        
        if (!formContainer || !formContent) return;

        formContainer.style.display = 'block';
        formTitle.innerHTML = `<i class="bi bi-pencil-square"></i>${setId ? 'Chỉnh sửa' : 'Tạo'} Bộ Đề Reading`;
        
        // Scroll to form
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Load form content in iframe or embed
        if (setId) {
            formContent.innerHTML = `
                <iframe src="admin_upload.html?edit=${setId}" style="width: 100%; min-height: 800px; border: none; border-radius: 1rem;"></iframe>
            `;
        } else {
            formContent.innerHTML = `
                <iframe src="admin_upload.html" style="width: 100%; min-height: 800px; border: none; border-radius: 1rem;"></iframe>
            `;
        }
    }

    // Show Listening Set Form
    async function showListeningSetForm(setId) {
        const formContainer = document.getElementById('listening-set-form-container');
        const formContent = document.getElementById('listening-set-form-content');
        const formTitle = document.getElementById('listening-set-form-title');
        
        if (!formContainer || !formContent) return;

        formContainer.style.display = 'block';
        formTitle.innerHTML = `<i class="bi bi-pencil-square"></i>${setId ? 'Chỉnh sửa' : 'Tạo'} Bộ Đề Listening`;
        
        // Scroll to form
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Load form content in iframe or embed
        if (setId) {
            formContent.innerHTML = `
                <iframe src="admin_listening_sets.html?edit=${setId}" style="width: 100%; min-height: 800px; border: none; border-radius: 1rem;"></iframe>
            `;
        } else {
            formContent.innerHTML = `
                <iframe src="admin_listening_sets.html" style="width: 100%; min-height: 800px; border: none; border-radius: 1rem;"></iframe>
            `;
        }
    }

    // Close Reading Set Form
    function closeReadingSetForm() {
        const formContainer = document.getElementById('reading-set-form-container');
        if (formContainer) {
            formContainer.style.display = 'none';
        }
    }

    // Close Listening Set Form
    function closeListeningSetForm() {
        const formContainer = document.getElementById('listening-set-form-container');
        if (formContainer) {
            formContainer.style.display = 'none';
        }
    }

    // Delete Reading Set
    async function deleteReadingSet(id) {
        if (!confirm('Bạn có chắc chắn muốn xóa bộ đề này không?')) {
            return;
        }

        try {
            const response = await fetch(`/api/practice_sets/delete?id=${id}`, {
                method: 'DELETE',
                headers: buildAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to delete reading set');
            }

            // Show success message
            const alert = document.createElement('div');
            alert.className = 'alert alert-success-modern alert-modern';
            alert.innerHTML = `
                <i class="bi bi-check-circle"></i>
                <div>
                    <strong>Thành công!</strong> Đã xóa bộ đề Reading.
                </div>
            `;
            if (refs.readingSetsListContainer) {
                refs.readingSetsListContainer.insertBefore(alert, refs.readingSetsListContainer.firstChild);
            }

            // Reload list
            setTimeout(() => {
                loadReadingSets();
            }, 1500);
        } catch (error) {
            console.error('Error deleting reading set:', error);
            alert('Có lỗi xảy ra khi xóa bộ đề. Vui lòng thử lại.');
        }
    }

    // Delete Listening Set
    async function deleteListeningSet(id) {
        if (!confirm('Bạn có chắc chắn muốn xóa bộ đề này không?')) {
            return;
        }

        try {
            const response = await fetch(`/api/practice_sets/delete?id=${id}`, {
                method: 'DELETE',
                headers: buildAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to delete listening set');
            }

            // Show success message
            const alert = document.createElement('div');
            alert.className = 'alert alert-success-modern alert-modern';
            alert.innerHTML = `
                <i class="bi bi-check-circle"></i>
                <div>
                    <strong>Thành công!</strong> Đã xóa bộ đề Listening.
                </div>
            `;
            if (refs.listeningSetsListContainer) {
                refs.listeningSetsListContainer.insertBefore(alert, refs.listeningSetsListContainer.firstChild);
            }

            // Reload list
            setTimeout(() => {
                loadListeningSets();
            }, 1500);
        } catch (error) {
            console.error('Error deleting listening set:', error);
            alert('Có lỗi xảy ra khi xóa bộ đề. Vui lòng thử lại.');
        }
    }

    // Load Reading Lessons (using functions from admin_lessons.js)
    function loadAllReadingLessons() {
        if (typeof loadLessonsForPart === 'function') {
            loadLessonsForPart('1');
            loadLessonsForPart('2');
            loadLessonsForPart('4');
            loadLessonsForPart('5');
        }
    }

    // Load Listening Lessons (using functions from admin_lessons.js)
    function loadAllListeningLessons() {
        if (typeof loadLessonsForPart === 'function') {
            loadLessonsForPart('listening_1_13');
            loadLessonsForPart('listening_14');
            loadLessonsForPart('listening_15');
            loadLessonsForPart('listening_16_17');
        }
    }

    // Make functions global for onclick handlers
    window.editReadingSet = editReadingSet;
    window.editReadingSetInline = editReadingSetInline;
    window.deleteReadingSet = deleteReadingSet;
    window.viewReadingSet = viewReadingSet;
    window.editListeningSet = editListeningSet;
    window.editListeningSetInline = editListeningSetInline;
    window.deleteListeningSet = deleteListeningSet;
    window.viewListeningSet = viewListeningSet;
    window.loadAllReadingLessons = loadAllReadingLessons;
    window.loadAllListeningLessons = loadAllListeningLessons;
    window.closeReadingSetForm = closeReadingSetForm;
    window.closeListeningSetForm = closeListeningSetForm;

    // Event Listeners
    if (refs.refreshReadingSetsBtn) {
        refs.refreshReadingSetsBtn.addEventListener('click', loadReadingSets);
    }

    if (refs.createReadingSetBtn) {
        refs.createReadingSetBtn.addEventListener('click', createReadingSet);
    }

    if (refs.refreshListeningSetsBtn) {
        refs.refreshListeningSetsBtn.addEventListener('click', loadListeningSets);
    }

    if (refs.createListeningSetBtn) {
        refs.createListeningSetBtn.addEventListener('click', createListeningSet);
    }

    // Initialize sub-tabs
    document.addEventListener('DOMContentLoaded', () => {
        initSubTabs();
        
        // Load reading lessons by default (since it's the active tab and sub-tab)
        if (typeof loadAllLessons === 'function') {
            // Use the function from admin_lessons.js if available
            loadAllLessons();
        } else {
            // Otherwise load reading lessons manually
            loadAllReadingLessons();
        }
    });

    // Load data when main tabs are switched
    const readingTab = document.getElementById('reading-tab');
    const listeningTab = document.getElementById('listening-tab');

    if (readingTab) {
        readingTab.addEventListener('shown.bs.tab', () => {
            // Check which sub-tab is active
            const activeSubTab = document.querySelector('#reading-pane .sub-tab-btn.active');
            if (activeSubTab && activeSubTab.dataset.subtab === 'reading-sets') {
                loadReadingSets();
            } else if (activeSubTab && activeSubTab.dataset.subtab === 'reading-lessons') {
                loadAllReadingLessons();
            }
        });
    }

    if (listeningTab) {
        listeningTab.addEventListener('shown.bs.tab', () => {
            // Check which sub-tab is active
            const activeSubTab = document.querySelector('#listening-pane .sub-tab-btn.active');
            if (activeSubTab && activeSubTab.dataset.subtab === 'listening-sets') {
                loadListeningSets();
            } else if (activeSubTab && activeSubTab.dataset.subtab === 'listening-lessons') {
                loadAllListeningLessons();
            }
        });
    }
})();
