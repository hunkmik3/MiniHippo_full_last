// Load and display uploaded lessons on reading_question-2.html

// Load uploaded lessons for a specific part
async function loadUploadedLessons(part) {
    const container = document.getElementById(`part${part}-lessons-list`);
    if (!container) {
        console.error(`Container not found for part ${part}`);
        return;
    }
    
    // Show loading state
    container.innerHTML = '<div class="text-center text-muted small"><i class="spinner-border spinner-border-sm me-2"></i>Đang tải...</div>';
    
    try {
        const response = await fetch(`/api/lessons/list?part=${part}`);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to load lessons');
        }
        
        const lessons = result.lessons || [];
        renderLessonsList(part, lessons);
        
    } catch (error) {
        console.error(`Error loading lessons for part ${part}:`, error);
        container.innerHTML = '<p class="text-muted small">Không thể tải danh sách bài học</p>';
    }
}

// Render lessons list for a specific part
function renderLessonsList(part, lessons) {
    const container = document.getElementById(`part${part}-lessons-list`);
    if (!container) {
        return;
    }
    
    if (lessons.length === 0) {
        container.innerHTML = '<p class="text-muted small">Chưa có bài học nào</p>';
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create lesson cards
    lessons.forEach(lesson => {
        const lessonCard = createLessonCard(part, lesson);
        container.appendChild(lessonCard);
    });
}

// Create a lesson card element
function createLessonCard(part, lesson) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'lesson-card mb-2';
    
    // Determine which page to link to
    const pageMap = {
        1: 'reading_question1.html',
        2: 'reading_question2.html',
        4: 'reading_question4.html',
        5: 'reading_question5.html'
    };
    
    const pageUrl = pageMap[part] || 'reading_question1.html';
    
    // Create button/link
    const link = document.createElement('a');
    link.href = pageUrl;
    link.className = 'btn btn-outline-primary btn-sm w-100 text-start';
    link.style.textDecoration = 'none';
    
    // Card content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'd-flex justify-content-between align-items-center';
    
    const titleSpan = document.createElement('span');
    titleSpan.textContent = lesson.title || lesson.topic || `Bài học ${part}`;
    titleSpan.style.flex = '1';
    titleSpan.style.overflow = 'hidden';
    titleSpan.style.textOverflow = 'ellipsis';
    titleSpan.style.whiteSpace = 'nowrap';
    
    const badgeSpan = document.createElement('small');
    badgeSpan.className = 'badge bg-secondary ms-2';
    badgeSpan.textContent = `${lesson.num_sets || 1} sets`;
    
    contentDiv.appendChild(titleSpan);
    contentDiv.appendChild(badgeSpan);
    link.appendChild(contentDiv);
    cardDiv.appendChild(link);
    
    return cardDiv;
}

// Load lessons for all parts
function loadAllLessons() {
    const parts = [1, 2, 4, 5];
    parts.forEach(part => {
        loadUploadedLessons(part);
    });
}

// Make functions globally accessible
window.loadUploadedLessons = loadUploadedLessons;
window.renderLessonsList = renderLessonsList;
window.loadAllLessons = loadAllLessons;

// Auto-load lessons when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllLessons);
} else {
    loadAllLessons();
}

