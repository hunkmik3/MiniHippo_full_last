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
    cardDiv.className = 'lesson-card mb-1';
    
    // Determine which page to link to
    // Support both string and number for backward compatibility
    const pageMap = {
        '1': 'reading_question1.html',
        '2': 'reading_question2.html',
        '4': 'reading_question4.html',
        '5': 'reading_question5.html',
        1: 'reading_question1.html', // Backward compatibility
        2: 'reading_question2.html',
        4: 'reading_question4.html',
        5: 'reading_question5.html'
    };
    
    const pageUrl = pageMap[part] || pageMap[String(part)] || 'reading_question1.html';
    
    // Map part to button style (matching Part buttons)
    const partStyleMap = {
        '1': { btnClass: 'btn-primary', icon: 'bi-book-fill' },
        '2': { btnClass: 'btn-info', icon: 'bi-puzzle-fill' },
        '4': { btnClass: 'btn-warning', icon: 'bi-clipboard-check' },
        '5': { btnClass: 'btn-success', icon: 'bi-lightbulb-fill' },
        1: { btnClass: 'btn-primary', icon: 'bi-book-fill' },
        2: { btnClass: 'btn-info', icon: 'bi-puzzle-fill' },
        4: { btnClass: 'btn-warning', icon: 'bi-clipboard-check' },
        5: { btnClass: 'btn-success', icon: 'bi-lightbulb-fill' }
    };
    
    const style = partStyleMap[part] || partStyleMap[String(part)] || { btnClass: 'btn-primary', icon: 'bi-book-fill' };
    
    // Create button/link matching Part button style
    const link = document.createElement('a');
    link.href = `${pageUrl}?lesson=${lesson.id}`;
    link.className = `btn ${style.btnClass} btn-lg w-100 mb-1 d-flex align-items-center justify-content-center text-decoration-none`;
    link.style.textDecoration = 'none';
    link.style.padding = '0.75rem';
    
    // Create icon
    const icon = document.createElement('i');
    icon.className = `${style.icon} me-2`;
    icon.style.fontSize = '1.5rem';
    
    // Card content - flex layout with title and badge
    const contentDiv = document.createElement('div');
    contentDiv.className = 'd-flex flex-column align-items-start flex-grow-1';
    contentDiv.style.minWidth = 0; // Allow text truncation
    
    const titleSpan = document.createElement('span');
    titleSpan.textContent = lesson.title || lesson.topic || `Bài học ${part}`;
    titleSpan.style.overflow = 'hidden';
    titleSpan.style.textOverflow = 'ellipsis';
    titleSpan.style.whiteSpace = 'nowrap';
    titleSpan.style.width = '100%';
    titleSpan.style.fontSize = '1rem';
    titleSpan.style.fontWeight = '500';
    
    const badgeSpan = document.createElement('small');
    badgeSpan.className = 'text-white-50 mt-1';
    badgeSpan.style.fontSize = '0.875rem';
    badgeSpan.style.opacity = '0.9';
    badgeSpan.textContent = `${lesson.num_sets || 1} sets`;
    
    contentDiv.appendChild(titleSpan);
    contentDiv.appendChild(badgeSpan);
    
    link.appendChild(icon);
    link.appendChild(contentDiv);
    cardDiv.appendChild(link);
    
    return cardDiv;
}

// Load lessons for all parts
// Use string values to match TEXT column type in database
function loadAllLessons() {
    const parts = ['1', '2', '4', '5'];
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

