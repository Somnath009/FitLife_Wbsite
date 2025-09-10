// client/script.js
document.addEventListener('DOMContentLoaded', () => {
    const chatIcon = document.getElementById('chat-icon');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatBody = document.getElementById('chat-body');

    let threadId = null;

    // --- Event Listeners ---
    chatIcon.addEventListener('click', toggleChatWindow);
    closeChat.addEventListener('click', toggleChatWindow);
    chatForm.addEventListener('submit', handleFormSubmit);

    // --- Core Functions ---
    function toggleChatWindow() {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden') && !threadId) {
            startNewSession();
        }
    }

    async function startNewSession() {
        try {
            const response = await fetch('http://localhost:3000/start', { method: 'POST' });
            const data = await response.json();
            threadId = data.threadId;
            addMessage('Hello! I am FitBot, your AI fitness coach. How can I help you transform your fitness journey today? \n\n<small>Disclaimer: I am an AI assistant. Please consult a healthcare professional before making significant changes to your fitness or diet.</small>', 'bot');
        } catch (error) {
            console.error('Failed to start a new session:', error);
            addMessage('Sorry, I am unable to connect right now. Please try again later.', 'bot');
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message || !threadId) return;

        addMessage(message, 'user');
        chatInput.value = '';
        
        try {
            const res = await fetch('http://localhost:3000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ threadId, message }),
            });

            if (!res.ok) throw new Error('Network response was not ok');

            const { response } = await res.json();
            addMessage(response, 'bot');
        } catch (error) {
            console.error('Chat error:', error);
            addMessage('Sorry, something went wrong. Please try again.', 'bot');
        }
    }

    // --- Helper Functions ---

    /**
     * Converts basic Markdown (bold and newlines) to HTML.
     * @param {string} text The text to convert.
     * @returns {string} The formatted HTML.
     */
    function markdownToHtml(text) {
        // Convert **bold** to <strong>bold</strong>
        let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Convert newlines to <br> tags
        html = html.replace(/\n/g, '<br>');
        return html;
    }

    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${sender}-message`);

        if (sender === 'bot') {
            // For bot messages, convert markdown and render as HTML
            messageElement.innerHTML = markdownToHtml(text);
        } else {
            // For user messages, just display plain text
            messageElement.textContent = text;
        }

        chatBody.appendChild(messageElement);
        chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll
    }
});
