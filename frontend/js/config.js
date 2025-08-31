// API Configuration
var API_CONFIG = window.API_CONFIG || {};
API_CONFIG.BASE_URL = 'https://school-management-system-av07.onrender.com';
API_CONFIG.UPLOADS_PATH = '/uploads';
API_CONFIG.PROFILE_PHOTOS_PATH = '/uploads/profile-photos';
API_CONFIG.RESOURCES_PATH = '/uploads/resources';
// Add API endpoints
API_CONFIG.API_BASE_URL = 'https://school-management-system-av07.onrender.com/api';
API_CONFIG.AUTH_URL = 'https://school-management-system-av07.onrender.com/api/auth';
API_CONFIG.STUDENTS_URL = 'https://school-management-system-av07.onrender.com/api/students';
API_CONFIG.TEACHERS_URL = 'https://school-management-system-av07.onrender.com/api/teachers';
API_CONFIG.ATTENDANCE_URL = 'https://school-management-system-av07.onrender.com/api/attendance';
API_CONFIG.FEES_URL = 'https://school-management-system-av07.onrender.com/api/fees';
API_CONFIG.PAYMENTS_URL = 'https://school-management-system-av07.onrender.com/api/payments';
API_CONFIG.CLASSES_URL = 'https://school-management-system-av07.onrender.com/api/classes';
API_CONFIG.CLUBS_URL = 'https://school-management-system-av07.onrender.com/api/clubs';
API_CONFIG.BOOKS_URL = 'https://school-management-system-av07.onrender.com/api/books';

// Make it available globally
window.API_CONFIG = API_CONFIG;

// Helper function to get the full URL for a resource
function getResourceUrl(path) {
    if (!path) return '';

    // If it's already a full URL, return as is
    if (path.startsWith('http')) {
        return path.replace(/^http:\/\/localhost(:\d+)?/, 
            (window.API_CONFIG || {}).BASE_URL || 'https://school-management-system-av07.onrender.com');
    }

    if (path.startsWith('data:')) {
        return path;
    }

    let cleanPath = path.replace(/^\/+/g, '');
    cleanPath = cleanPath.replace(/^uploads\//, '');

    if (cleanPath.includes('profile-photos/')) {
        return `${API_CONFIG.BASE_URL}/${cleanPath}`;
    }

    return `${API_CONFIG.BASE_URL}/uploads/profile-photos/${cleanPath}`;
}

// ✅ Wrapper for API requests with proper error handling
async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.API_BASE_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...(options.headers || {})
    };

    const config = {
        ...options,
        headers,
        credentials: 'include'  // Important for cookies and auth
    };

    try {
        const response = await fetch(url, config);
        
        // Handle non-2xx responses
        if (!response.ok) {
            const error = new Error(`HTTP error! status: ${response.status}`);
            error.status = response.status;
            error.response = response;
            throw error;
        }
        
        // Try to parse JSON, but handle non-JSON responses
        try {
            return await response.json();
        } catch (e) {
            return response.text();
        }
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}
