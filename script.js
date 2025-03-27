document.addEventListener('DOMContentLoaded', () => {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    // Mobile menu toggle with accessibility improvements
    navbarToggle.addEventListener('click', () => {
        const isActive = navbarMenu.classList.toggle('active');
        navbarToggle.classList.toggle('active');
        navbarToggle.setAttribute('aria-expanded', isActive);
        
        // Optional: Close menu when clicking outside
        if (isActive) {
            document.addEventListener('click', closeMenuOnOutsideClick);
        } else {
            document.removeEventListener('click', closeMenuOnOutsideClick);
        }
    });

    // Function to close mobile menu when clicking outside
    function closeMenuOnOutsideClick(event) {
        if (!navbarMenu.contains(event.target) && 
            !navbarToggle.contains(event.target)) {
            navbarMenu.classList.remove('active');
            navbarToggle.classList.remove('active');
            navbarToggle.setAttribute('aria-expanded', 'false');
            document.removeEventListener('click', closeMenuOnOutsideClick);
        }
    }

    // Smooth scrolling for navigation links with offset handling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetElement = document.querySelector(this.getAttribute('href'));
            const offset = 70; // Adjust based on your navbar height
            
            window.scrollTo({
                top: targetElement.offsetTop - offset,
                behavior: 'smooth'
            });

            // Close mobile menu after navigation
            if (navbarMenu.classList.contains('active')) {
                navbarMenu.classList.remove('active');
                navbarToggle.classList.remove('active');
                navbarToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Enhanced form submission with validation
    const contactForm = document.querySelector('.contact-form');
    const formMessage = document.getElementById('formMessage') || 
        document.createElement('div');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic form validation
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        // Reset previous error states
        [name, email, message].forEach(field => {
            field.classList.remove('error');
        });

        // Validation checks
        let isValid = true;
        
        if (name.value.trim().length < 2) {
            name.classList.add('error');
            isValid = false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            email.classList.add('error');
            isValid = false;
        }
        
        if (message.value.trim().length < 10) {
            message.classList.add('error');
            isValid = false;
        }

        // Handle form submission
        if (isValid) {
            // Disable submit button to prevent multiple submissions
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            // Simulated form submission (replace with actual submission logic)
            setTimeout(() => {
                formMessage.textContent = 'Thank you for your message! I will get back to you soon.';
                formMessage.className = 'form-message success-message';
                contactForm.reset();
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }, 1500);
        } else {
            formMessage.textContent = 'Please correct the errors in the form.';
            formMessage.className = 'form-message error-message';
        }
    });

    // Optional: Add keyboard navigation for mobile menu
    navbarToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navbarToggle.click();
        }
    });
});

    // Toggle chatbox visibility
    function toggleChatbox() {
        const chatbox = document.getElementById('chatbox-container');
        chatbox.style.display = chatbox.style.display === 'none' || chatbox.style.display === '' ? 'flex' : 'none';
    }

    // Send message to the bot
    async function sendMessage() {
        const query = document.getElementById('user-query').value;
        if (!query) return;

        // Display the user message in the chat
        const messagesDiv = document.getElementById('messages');
        const userMessage = document.createElement('div');
        userMessage.classList.add('user-message');
        userMessage.textContent = `You: ${query}`;
        messagesDiv.appendChild(userMessage);
        document.getElementById('user-query').value = '';

        // Make a POST request to the Flask API
        const response = await fetch('http://127.0.0.1:5000/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query })
        });

        const data = await response.json();
        const botMessage = document.createElement('div');
        botMessage.classList.add('bot-message');
        botMessage.textContent = `Chatbot: ${data.response}`;
        messagesDiv.appendChild(botMessage);

        // Scroll to the bottom of the messages div
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
