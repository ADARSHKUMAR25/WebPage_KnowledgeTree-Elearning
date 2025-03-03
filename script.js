// Header Scroll Effect
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const mobileNav = document.querySelector('.mobile-nav');

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    mobileMenuBtn?.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileNav?.classList.contains('active') &&
            !mobileNav.contains(e.target) &&
            !mobileMenuBtn.contains(e.target)) {
            mobileNav.classList.remove('active');
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu after clicking a link
                mobileNav?.classList.remove('active');
            }
        });
    });
});

// Login Form Submission
document.getElementById('loginForm')?.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Clear previous error message
    errorMessage.textContent = '';

    // Send login request to the server
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(response => {
            console.log('Response status:', response.status); // Log for debugging
            if (response.ok) {
                return response.text();
            } else if (response.status === 401) {
                throw new Error('Invalid username or password');
            } else {
                throw new Error('Login failed. Please try again.');
            }
        })
        .then(message => {
            alert(message);
            window.location.href = 'Dashboard.html'; // Ensure this matches the correct file name
        })
        .catch(error => {
            console.error('Login error:', error); // Log error for debugging
            errorMessage.textContent = error.message; // Display error message
        });
});

// Registration Form Submission
document.getElementById('registrationForm')?.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting

    const newUsername = document.getElementById('new-username').value;
    const email = document.getElementById('email').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const registrationErrorMessage = document.getElementById('registration-error-message');

    // Clear previous error message
    registrationErrorMessage.textContent = '';

    // Password validation
    if (newPassword.length < 8) {
        registrationErrorMessage.textContent = 'Password must be at least 8 characters long';
    } else if (!/[A-Z]/.test(newPassword)) {
        registrationErrorMessage.textContent = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(newPassword)) {
        registrationErrorMessage.textContent = 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(newPassword)) {
        registrationErrorMessage.textContent = 'Password must contain at least one number';
    } else if (newPassword !== confirmPassword) {
        registrationErrorMessage.textContent = 'Passwords do not match';
    } else {
        // Send registration data to the backend
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: newUsername,
                password: newPassword,
                email: email
            })
        })
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else if (response.status === 409) {
                    throw new Error('Username or email already exists');
                } else if (response.status === 500) {
                    throw new Error('Server error. Please try again later.');
                } else {
                    throw new Error(response.statusText);
                }
            })
            .then(message => {
                alert(message); // Notify user of success
                window.location.href = 'login.html'; // Redirect to login page
            })
            .catch(error => {
                console.error('Registration error:', error); // Log error for debugging
                registrationErrorMessage.textContent = error.message; // Display error message
            });
    }
});

// Forgot Password Form Submission
document.getElementById('forgotPasswordForm')?.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting

    const email = document.getElementById('forgot-email').value; // Ensure this ID matches your HTML
    const forgotPasswordMessage = document.getElementById('forgot-password-message');

    // Clear previous messages
    forgotPasswordMessage.textContent = '';

    // Send recovery email request to the server
    fetch('http://localhost:5500/recover-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email })
    })
        .then(response => {
            if (response.ok) {
                return response.text(); // Get success message
            } else {
                throw new Error('Error sending recovery email');
            }
        })
        .then(message => {
            alert(message); // Notify user of success
        })
        .catch(error => {
            console.error('Forgot password error:', error); // Log error for debugging
            forgotPasswordMessage.textContent = error.message; // Display error message
        });
});

// Tab Switch Function
function switchTAB() {
    const loginFormContainer = document.getElementById('loginFormContainer');
    const registrationFormContainer = document.getElementById('registrationFormContainer');
    const forgotPasswordFormContainer = document.getElementById('forgotPasswordFormContainer');

    // Toggle visibility of forms
    loginFormContainer.classList.toggle('hidden');
    registrationFormContainer.classList.toggle('hidden');
    forgotPasswordFormContainer.classList.toggle('hidden');
}
