// Admin Lessons Management Script

let deleteLessonId = null;

// Load all lessons on page load
document.addEventListener('DOMContentLoaded', function() {
    loadAllLessons();
});

// Load lessons for all parts
async function loadAllLessons() {
    const parts = [1, 2, 4, 5];
    for (const part of parts) {
        await loadLessonsForPart(part);
    }
}

// Load lessons for a specific part
async function loadLessonsForPart(part) {
    const container = document.getElementById(`part${part}-lessons-container`);
    if (!container) return;
    
    // Show loading state
    container.innerHTML = `
        <div class="text-center text-muted">
            <i class="spinner-border spinner-border-sm me-2"></i>
            Đang tải...
        </div>
    `;
    
    try {
        const response = await fetch(`/api/lessons/list?part=${part}`);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to load lessons');
        }
        
        const lessons = result.lessons || [];
        renderLessons(part, lessons);
        
    } catch (error) {
        console.error(`Error loading lessons for part ${part}:`, error);
        container.innerHTML = `
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-circle me-2"></i>
                Không thể tải danh sách bài học: ${error.message}
            </div>
        `;
    }
}

// Render lessons for a part
function renderLessons(part, lessons) {
    const container = document.getElementById(`part${part}-lessons-container`);
    if (!container) return;
    
    if (lessons.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-inbox"></i>
                <p class="mb-0">Chưa có bài học nào cho Part ${part}</p>
                <a href="admin_upload.html" class="btn btn-primary mt-3">
                    <i class="bi bi-plus-circle me-2"></i>
                    Upload bài học đầu tiên
                </a>
            </div>
        `;
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create lesson cards
    lessons.forEach(lesson => {
        const card = createLessonCard(part, lesson);
        container.appendChild(card);
    });
}

// Create a lesson card
function createLessonCard(part, lesson) {
    const card = document.createElement('div');
    card.className = 'lesson-card';
    card.id = `lesson-${lesson.id}`;
    
    const formattedDate = lesson.created_at 
        ? new Date(lesson.created_at).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
        : 'N/A';
    
    card.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">
            <div class="lesson-info">
                <div class="lesson-title">
                    ${lesson.title || lesson.topic || `Bài học Part ${part}`}
                </div>
                <div class="lesson-meta">
                    <span>
                        <i class="bi bi-file-text me-1"></i>
                        <strong>File:</strong> ${lesson.file_path || 'N/A'}
                    </span>
                    <span>
                        <i class="bi bi-stack me-1"></i>
                        <strong>Số bộ đề:</strong> ${lesson.num_sets || 1}
                    </span>
                    ${lesson.topic ? `
                        <span>
                            <i class="bi bi-tag me-1"></i>
                            <strong>Topic:</strong> ${lesson.topic}
                        </span>
                    ` : ''}
                    <span>
                        <i class="bi bi-calendar me-1"></i>
                        <strong>Ngày tạo:</strong> ${formattedDate}
                    </span>
                </div>
            </div>
            <div class="lesson-actions">
                <button class="btn btn-sm btn-outline-primary" onclick="viewLesson(${part}, '${lesson.id}')" title="Xem chi tiết">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning" onclick="editLesson(${part}, '${lesson.id}')" title="Sửa bài học">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="confirmDeleteLesson('${lesson.id}', '${(lesson.title || lesson.topic || 'Bài học này').replace(/'/g, "\\'")}', ${part})" title="Xóa bài học">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// View lesson details
function viewLesson(part, lessonId) {
    // Redirect to the lesson page
    const pageMap = {
        1: 'reading_question1.html',
        2: 'reading_question2.html',
        4: 'reading_question4.html',
        5: 'reading_question5.html'
    };
    
    const pageUrl = pageMap[part] || 'reading_question1.html';
    window.open(pageUrl, '_blank');
}

// Edit lesson - redirect to upload page with lesson ID
function editLesson(part, lessonId) {
    // Store lesson ID in localStorage to load in admin_upload.html
    localStorage.setItem('editLessonId', lessonId);
    localStorage.setItem('editLessonPart', part);
    
    // Redirect to upload page
    window.location.href = `admin_upload.html?edit=${lessonId}&part=${part}`;
}

// Confirm delete lesson
function confirmDeleteLesson(lessonId, lessonTitle, part) {
    deleteLessonId = lessonId;
    window.lastDeletedPart = part; // Store part for reload
    
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    const modalBody = document.querySelector('#deleteModal .modal-body p:first-child');
    if (modalBody) {
        modalBody.textContent = `Bạn có chắc chắn muốn xóa bài học "${lessonTitle}" không?`;
    }
    
    modal.show();
}

// Delete lesson
async function deleteLesson() {
    if (!deleteLessonId) {
        alert('Không tìm thấy ID bài học cần xóa');
        return;
    }
    
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="spinner-border spinner-border-sm me-2"></i>Đang xóa...';
    }
    
    try {
        const response = await fetch(`/api/lessons/delete?id=${deleteLessonId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to delete lesson');
        }
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        if (modal) {
            modal.hide();
        }
        
        // Show success message
        alert('Xóa bài học thành công!');
        
        // Reload lessons for the part that was deleted
        const part = window.lastDeletedPart || 1;
        await loadLessonsForPart(part);
        
        // Clear deleteLessonId
        deleteLessonId = null;
        
    } catch (error) {
        console.error('Error deleting lesson:', error);
        alert('Lỗi khi xóa bài học: ' + error.message);
    } finally {
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = '<i class="bi bi-trash me-2"></i>Xóa';
        }
    }
}

// Set up delete button event listener
document.addEventListener('DOMContentLoaded', function() {
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', deleteLesson);
    }
});

// Make functions globally accessible
window.viewLesson = viewLesson;
window.editLesson = editLesson;
window.confirmDeleteLesson = confirmDeleteLesson;
window.loadLessonsForPart = loadLessonsForPart;
window.loadAllLessons = loadAllLessons;

