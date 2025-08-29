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
        return path.replace('http://localhost:8000', API_CONFIG.BASE_URL);
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

// ✅ NEW: Wrapper for API requests
export async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    return response;
}
