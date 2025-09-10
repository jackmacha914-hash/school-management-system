// Helper function to get dashboard URL based on user role
function getDashboardURL(role) {
    // Ensure role is lowercase for consistent comparison
    const userRole = (role || '').toLowerCase();
    
    switch (userRole) {
        case 'admin':
            return '/index.html';
        case 'teacher':
            return '/pages/teacher.html';
        case 'student':
            return '/pages/student.html';
        default:
            console.warn('Unknown role, redirecting to login');
            return '/login.html';
    }
}

// Helper function to show error messages
function showError(message, elementId = 'error-message') {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.style.color = 'red';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const roleSelect = document.getElementById('role');
    const classGroup = document.getElementById('class-group');
    const formTitle = document.getElementById('form-title');

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email')?.value;
            const password = document.getElementById('login-password')?.value;
            
            if (!email || !password) {
                showError('Please enter both email and password');
                return;
            }

            try {
                console.log('Attempting login with:', { email });
                const API_URL = (window.API_CONFIG || API_CONFIG || {}).AUTH_URL || 'https://school-management-system-av07.onrender.com/api/auth';
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Origin': window.location.origin
                    },
                    body: JSON.stringify({ email, password }),
                    credentials: 'include'
                });
                
                console.log('Login response status:', response.status);
                let responseData = {};
                try {
                    responseData = await response.json();
                    console.log('Login response data:', responseData);
                } catch (e) {
                    console.error('Failed to parse login response:', e);
                    throw new Error('Invalid response from server');
                }
                
                if (!response.ok) {
                    const errorMsg = responseData.msg || responseData.message || 'Login failed';
                    console.error('Login failed:', errorMsg);
                    throw new Error(errorMsg);
                }
                
                // Save token and user data
                if (responseData.token) {
                    console.log('Login successful, saving token and user data');
                    localStorage.setItem('token', responseData.token);
                    if (responseData.user) {
                        localStorage.setItem('user', JSON.stringify(responseData.user));
                    }
                    
                    // Redirect based on user role
                    const role = responseData.user?.role || 'student';
                    console.log('Redirecting to dashboard for role:', role);
                    window.location.href = getDashboardURL(role);
                } else {
                    console.error('No token in response:', responseData);
                    throw new Error('No authentication token received');
                }
                
            } catch (error) {
                console.error('Login error:', error);
                // Show error to user
                const errorMessage = error.message.includes('Failed to fetch') 
                    ? 'Unable to connect to server. Please check your connection.'
                    : error.message || 'Login failed. Please check your credentials and try again.';
                showError(errorMessage);
                
                // Clear password field on error
                const passwordField = document.getElementById('login-password');
                if (passwordField) passwordField.value = '';
            }
        });
    }

    // Toggle between login and register forms
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            formTitle.textContent = 'Create Account';
            document.getElementById('error-message').textContent = '';
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
            formTitle.textContent = 'Login';
            document.getElementById('register-message').textContent = '';
        });
    }

    // Show/hide class field based on role selection
    if (roleSelect && classGroup) {
        roleSelect.addEventListener('change', function() {
            if (this.value === 'student') {
                classGroup.style.display = 'block';
                const classInput = document.getElementById('class');
                if (classInput) classInput.setAttribute('required', 'required');
            } else {
                classGroup.style.display = 'none';
                const classInput = document.getElementById('class');
                if (classInput) classInput.removeAttribute('required');
            }
        });
    }

    // Registration form submission
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('register-name')?.value;
            const email = document.getElementById('register-email')?.value;
            const password = document.getElementById('register-password')?.value;
            const confirmPassword = document.getElementById('confirm-password')?.value;
            const role = document.getElementById('role')?.value;
            const studentClass = role === 'student' ? document.getElementById('class')?.value : '';
            
            // Basic validation
            if (password !== confirmPassword) {
                showError('Passwords do not match', 'register-message');
                return;
            }
            
            if (role === 'student' && !studentClass) {
                showError('Please select a class', 'register-message');
                return;
            }

            try {
                const API_BASE_URL = window.API_CONFIG?.API_BASE_URL || 'https://school-management-system-av07.onrender.com/api';
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password,
                        role: role,
                        studentClass: role === 'student' ? studentClass : undefined
                    })
                });
                
                let data;
                try {
                    data = await response.json();
                } catch (e) {
                    console.error('Failed to parse response:', e);
                    throw new Error('Invalid response from server');
                }
                
                if (!response.ok) {
                    throw new Error(data.message || data.msg || 'Registration failed');
                }
                
                // Show success message
                const registerMessage = document.getElementById('register-message');
                if (registerMessage) {
                    registerMessage.textContent = 'Registration successful! Please login.';
                    registerMessage.style.color = 'green';
                    registerForm.reset();
                    
                    // Auto switch to login form after 2 seconds
                    setTimeout(() => {
                        registerForm.style.display = 'none';
                        loginForm.style.display = 'block';
                        formTitle.textContent = 'Login';
                        registerMessage.textContent = '';
                    }, 2000);
                }
                
            } catch (error) {
                console.error('Registration error:', error);
                showError(error.message || 'Registration failed. Please try again.', 'register-message');
            }
        });
    }
});
