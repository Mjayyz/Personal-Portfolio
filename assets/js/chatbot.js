document.addEventListener('DOMContentLoaded', function () {
    const config = window.CHATBOT_CONFIG || {};
    const API_ENDPOINT = config.apiEndpoint || '';
    const API_KEY = config.apiKey || '';

    let isChatOpen = false;
    let isWaiting = false;

    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');

    function toggleChat() {
        isChatOpen = !isChatOpen;
        chatbotContainer.style.display = isChatOpen ? 'flex' : 'none';
        chatbotButton.style.display = isChatOpen ? 'none' : 'flex';
        if (isChatOpen) chatbotInput.focus();
    }

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${isUser ? 'user-message' : 'bot-message'}`;

        const messageP = document.createElement('p');
        messageP.textContent = message;
        messageDiv.appendChild(messageP);

        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot-message typing-message';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const typing = document.querySelector('.typing-message');
        if (typing) typing.remove();
    }

    function setWaiting(waiting) {
        isWaiting = waiting;
        chatbotInput.disabled = waiting;
        chatbotSend.disabled = waiting;
    }

    function getSessionId() {
        let sessionId = localStorage.getItem('chatbot_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chatbot_session_id', sessionId);
        }
        return sessionId;
    }

    async function sendMessage(message) {
        if (message.length > 500) {
            addMessage('Message too long. Please keep it under 500 characters.');
            return;
        }

        addMessage(message, true);
        chatbotInput.value = '';
        setWaiting(true);
        showTypingIndicator();

        if (!API_ENDPOINT) {
            removeTypingIndicator();
            addMessage('Chat is temporarily unavailable.');
            setWaiting(false);
            chatbotInput.focus();
            return;
        }

        try {
            const res = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                    'accept': 'application/json'
                },
                body: JSON.stringify({
                    input: message,
                    session_id: getSessionId()
                })
            });

            if (!res.ok) {
                removeTypingIndicator();
                addMessage('Unable to reach assistant. Please try again.');
                setWaiting(false);
                chatbotInput.focus();
                return;
            }

            const data = await res.json();
            removeTypingIndicator();

            const reply = data.message || "Sorry, I couldn't process that.";
            addMessage(reply);

        } catch (err) {
            console.error('Chatbot error:', err);
            removeTypingIndicator();
            addMessage('Connection error. Try again later.');
        } finally {
            setWaiting(false);
            chatbotInput.focus();
        }
    }

    chatbotButton.addEventListener('click', toggleChat);
    chatbotClose.addEventListener('click', toggleChat);

    chatbotSend.addEventListener('click', function () {
        const message = chatbotInput.value.trim();
        if (message && !isWaiting) sendMessage(message);
    });

    chatbotInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const message = chatbotInput.value.trim();
            if (message && !isWaiting) sendMessage(message);
        }
    });
});
