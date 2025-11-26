// Load and display uploaded listening lessons on listening_question.html

// Map listening parts to their display names and page URLs
const listeningPartMap = {
    'listening_1_13': {
        displayName: '1-13',
        pageUrl: 'listening_question1_13.html',
        containerId: 'listening-1_13-lessons-list'
    },
    'listening_14': {
        displayName: '14',
        pageUrl: 'listening_question14.html',
        containerId: 'listening-14-lessons-list'
    },
    'listening_15': {
        displayName: '15',
        pageUrl: 'listening_question15.html',
        containerId: 'listening-15-lessons-list'
    },
    'listening_16_17': {
        displayName: '16-17',
        pageUrl: 'listening_question16_17.html',
        containerId: 'listening-16_17-lessons-list'
    }
};

// Load uploaded lessons for a specific listening part
async function loadUploadedListeningLessons(part) {
    const partInfo = listeningPartMap[part];
    if (!partInfo) {
        console.error(`Unknown listening part: ${part}`);
        return;
    }
    
    const container = document.getElementById(partInfo.containerId);
    if (!container) {
        console.error(`Container not found for part ${part}`);
        return;
    }
    
    // Show loading state
    container.innerHTML = '<div class="text-center text-muted small"><i class="spinner-border spinner-border-sm me-2"></i>Đang tải...</div>';
    
    try {
        const apiUrl = `/api/lessons/list?part=${encodeURIComponent(part)}`;
        console.log(`Loading lessons for part: ${part}, API URL: ${apiUrl}`);
        
        const response = await fetch(apiUrl);
        const result = await response.json();
        
        console.log(`API response for part ${part}:`, result);
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to load lessons');
        }
        
        const lessons = result.lessons || [];
        console.log(`Found ${lessons.length} lessons for part ${part}:`, lessons);
        
        renderListeningLessonsList(part, lessons);
        
    } catch (error) {
        console.error(`Error loading lessons for part ${part}:`, error);
        container.innerHTML = `<p class="text-muted small">Không thể tải danh sách bài học: ${error.message}</p>`;
    }
}

// Render lessons list for a specific listening part
function renderListeningLessonsList(part, lessons) {
    const partInfo = listeningPartMap[part];
    if (!partInfo) {
        return;
    }
    
    const container = document.getElementById(partInfo.containerId);
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
        const lessonCard = createListeningLessonCard(part, lesson);
        container.appendChild(lessonCard);
    });
}

// Create a listening lesson card element
function createListeningLessonCard(part, lesson) {
    const partInfo = listeningPartMap[part];
    if (!partInfo) {
        return document.createElement('div');
    }
    
    const cardDiv = document.createElement('div');
    cardDiv.className = 'lesson-card mb-1';
    
    const pageUrl = partInfo.pageUrl;
    
    // Map part to button style (matching Part buttons)
    const partStyleMap = {
        'listening_1_13': { btnClass: 'btn-primary', icon: 'bi-book-fill' },
        'listening_14': { btnClass: 'btn-info', icon: 'bi-puzzle-fill' },
        'listening_15': { btnClass: 'btn-warning', icon: 'bi-clipboard-check' },
        'listening_16_17': { btnClass: 'btn-success', icon: 'bi-lightbulb-fill' }
    };
    
    const style = partStyleMap[part] || { btnClass: 'btn-primary', icon: 'bi-book-fill' };
    
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
    titleSpan.textContent = lesson.title || lesson.topic || `Bài học ${partInfo.displayName}`;
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

// Load lessons for all listening parts
function loadAllListeningLessons() {
    const parts = Object.keys(listeningPartMap);
    parts.forEach(part => {
        loadUploadedListeningLessons(part);
    });
}

// Make functions globally accessible
window.loadUploadedListeningLessons = loadUploadedListeningLessons;
window.renderListeningLessonsList = renderListeningLessonsList;
window.loadAllListeningLessons = loadAllListeningLessons;

// Auto-load lessons when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllListeningLessons);
} else {
    loadAllListeningLessons();
}

