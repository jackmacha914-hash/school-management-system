// API Configuration
var API_CONFIG = {
    BASE_URL: 'https://school-management-system-av07.onrender.com',
    API_BASE_URL: 'https://school-management-system-av07.onrender.com/api',
    AUTH_URL: 'https://school-management-system-av07.onrender.com/api/auth',
    PAYMENTS_URL: 'https://school-management-system-av07.onrender.com/api/payments',
    CLASSES_URL: 'https://school-management-system-av07.onrender.com/api/classes',
    CLUBS_URL: 'https://school-management-system-av07.onrender.com/api/clubs',
    BOOKS_URL: 'https://school-management-system-av07.onrender.com/api/books'
};

// Make it available globally
window.API_CONFIG = API_CONFIG;

// Helper function to get resource URL
function getResourceUrl(path) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('data:')) return path;
    
    const cleanPath = path.replace(/^\/|^uploads\//g, '');
    if (path.includes('profile-photos/')) {
        return `${API_CONFIG.BASE_URL}/uploads/profile-photos/${cleanPath}`;
    }
    return `${API_CONFIG.BASE_URL}/uploads/${cleanPath}`;
}

// Wrapper for API requests with proper error handling
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
