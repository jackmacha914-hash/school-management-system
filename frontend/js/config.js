// API Configuration
export const API_CONFIG = {
    BASE_URL: 'https://school-management-system-av07.onrender.com',
    UPLOADS_PATH: '/uploads',
    PROFILE_PHOTOS_PATH: '/uploads/profile-photos',
    RESOURCES_PATH: '/uploads/resources',
    // Add API endpoints
    API_BASE_URL: 'https://school-management-system-av07.onrender.com/api',
    AUTH_URL: 'https://school-management-system-av07.onrender.com/api/auth',
    STUDENTS_URL: 'https://school-management-system-av07.onrender.com/api/students',
    TEACHERS_URL: 'https://school-management-system-av07.onrender.com/api/teachers',
    ATTENDANCE_URL: 'https://school-management-system-av07.onrender.com/api/attendance',
    FEES_URL: 'https://school-management-system-av07.onrender.com/api/fees',
    PAYMENTS_URL: 'https://school-management-system-av07.onrender.com/api/payments',
    CLASSES_URL: 'https://school-management-system-av07.onrender.com/api/classes',
    CLUBS_URL: 'https://school-management-system-av07.onrender.com/api/clubs',
    BOOKS_URL: 'https://school-management-system-av07.onrender.com/api/books'
};

// Helper function to get the full URL for a resource
export function getResourceUrl(path) {
    if (!path) return '';

    // If it's already a full URL, return as is
    if (path.startsWith('http')) {
        return path.replace(/^http:\/\/localhost(:\d+)?/, window.API_CONFIG?.BASE_URL || 'https://school-management-system-av07.onrender.com');
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
export async function apiFetch(endpoint, options = {}) {
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
