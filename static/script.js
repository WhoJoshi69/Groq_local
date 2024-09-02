document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const cursorSwirl = document.querySelector('.cursor-swirl');
    const chatBox = document.getElementById('chat-box');
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');

    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Theme toggle functionality
    themeToggleBtn.addEventListener('click', () => {
        const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeToggleBtn.innerHTML = '<span aria-hidden="true">🌙</span>';
            themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
        } else {
            body.classList.remove('dark-mode');
            themeToggleBtn.innerHTML = '<span aria-hidden="true">☀️</span>';
            themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
        }
        localStorage.setItem('theme', theme);
    }

    // Cursor swirl effect
    let cursorSwirlTimeout;
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const swirlSize = Math.random() * 20 + 30; // Random size between 30 and 50 pixels

        cursorSwirl.style.background = `radial-gradient(circle, ${getRandomColor()} 0%, transparent 70%)`;
        cursorSwirl.style.left = `${clientX - swirlSize / 2}px`;
        cursorSwirl.style.top = `${clientY - swirlSize / 2}px`;
        cursorSwirl.style.width = `${swirlSize}px`;
        cursorSwirl.style.height = `${swirlSize}px`;

        clearTimeout(cursorSwirlTimeout);
        cursorSwirl.style.opacity = '1';

        cursorSwirlTimeout = setTimeout(() => {
            cursorSwirl.style.opacity = '0';
        }, 1000);
    });

    // Chat functionality
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userMessage = userInput.value.trim();
        if (userMessage) {
            addMessage('user', userMessage);
            userInput.value = '';

            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        'user_input': userMessage
                    })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                addMessage('bot', data.bot_response);
            } catch (error) {
                console.error('Error:', error);
                addMessage('bot', 'Sorry, there was an error processing your request.');
            }
        }
    });

    function addMessage(role, content) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', role);
        messageElement.innerHTML = `<strong>${role.charAt(0).toUpperCase() + role.slice(1)}:</strong> <div class="content">${content}</div>`;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function getRandomColor() {
        const colors = ['#bb86fc', '#03dac6', '#cf6679'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
});