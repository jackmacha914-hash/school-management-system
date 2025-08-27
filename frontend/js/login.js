import { authApi } from './api.js';

document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const roleSelect = document.getElementById('role');
    const classGroup = document.getElementById('class-group');

    // Toggle between login and register forms
    showRegisterLink?.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        document.getElementById('form-title').textContent = 'Create Account';
    });

    showLoginLink?.addEventListener('click', function(e) {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        document.getElementById('form-title').textContent = 'Login';
        document.getElementById('error-message').textContent = '';
        document.getElementById('register-message').textContent = '';
    });

    // Show/hide class field based on role selection
    roleSelect?.addEventListener('change', function() {
        if (this.value === 'student') {
            classGroup.style.display = 'block';
            document.getElementById('class').setAttribute('required', 'required');
        } else {
            classGroup.style.display = 'none';
            document.getElementById('class').removeAttribute('required');
        }
    });

    // Handle login form submission
    loginForm?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorMessage = document.getElementById('error-message');

        try {
            const data = await authApi.login(email, password);

            // Save token and role
            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.role);

            // Fetch full profile
            const profileData = await authApi.getProfile(data.role);
            localStorage.setItem('userProfile', JSON.stringify(profileData));

            // Redirect to dashboard
            window.location.href = getDashboardURL(data.role);
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.textContent = error.message || 'Invalid email or password';
        }
    });

    // Handle registration form submission
    registerForm?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const role = document.getElementById('role').value;
        const studentClass = role === 'student' ? document.getElementById('class').value : '';
        const registerMessage = document.getElementById('register-message');

        // Basic validation
        if (password !== confirmPassword) {
            registerMessage.textContent = 'Passwords do not match';
            return;
        }
        if (role === 'student' && !studentClass) {
            registerMessage.textContent = 'Please select a class';
            return;
        }

        try {
            await authApi.register({ 
                name, 
                email, 
                password, 
                role, 
                studentClass, 
                studentDob: '', 
                studentGender: '', 
                parentName: '', 
                parentEmail: '' 
            });

            registerMessage.textContent = 'Registration successful! Please login.';
            registerMessage.style.color = 'green';
            registerForm.reset();

            setTimeout(() => {
                registerForm.style.display = 'none';
                loginForm.style.display = 'block';
                document.getElementById('form-title').textContent = 'Login';
                registerMessage.textContent = '';
            }, 2000);
        } catch (error) {
            console.error('Registration error:', error);
            registerMessage.textContent = error.message || 'Registration failed';
            registerMessage.style.color = 'red';
        }
    });
});
