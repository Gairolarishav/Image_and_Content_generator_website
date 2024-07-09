let currentConversationId = null;
let accessToken = localStorage.getItem('accessToken');

function updateUIForLoggedInUser(loggedIn) {
    document.querySelector('a[data-bs-target="#loginModal"]').style.display = loggedIn ? 'none' : 'block';
    document.querySelector('a[data-bs-target="#signupModal"]').style.display = loggedIn ? 'none' : 'block';
    document.getElementById('logoutLink').style.display = loggedIn ? 'block' : 'none';
    document.getElementById('chatForm').style.display = loggedIn ? 'block' : 'none';
    document.getElementById('newChatBtn').style.display = loggedIn ? 'block' : 'none';
}

updateUIForLoggedInUser(!!accessToken);

document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    
    fetch('/api/users/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Signup successful! Please login.');
        bootstrap.Modal.getInstance(document.getElementById('signupModal')).hide();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Signup failed. Please try again.');
    });
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    fetch('/api/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        const expirationTime = Date.now() + 55 * 60 * 1000; // 55 minutes from now
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('tokenExpiration', expirationTime);
        accessToken = data.access;
        updateUIForLoggedInUser(true);
        bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
        getChatHistory();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Login failed. Please try again.');
    });
});

document.getElementById('logoutLink').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiration');
    accessToken = null;
    updateUIForLoggedInUser(false);
    document.getElementById('chatHistory').innerHTML = '';
    document.getElementById('chatContainer').innerHTML = '';
    currentConversationId = null;
});

document.getElementById('chatForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    if (message && currentConversationId) {
        sendMessage(message);
        userInput.value = '';
    }
});

document.getElementById('newChatBtn').addEventListener('click', function() {
    startNewChat();
});

function getValidToken() {
    const token = localStorage.getItem('accessToken');
    const expiration = localStorage.getItem('tokenExpiration');
    
    if (!token || !expiration) {
        return Promise.reject('No token available');
    }

    if (Date.now() > parseInt(expiration)) {
        // Token is expired, try to refresh it
        return fetch('/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh: localStorage.getItem('refreshToken')
            }),
        })
        .then(response => response.json())
        .then(data => {
            const newExpirationTime = Date.now() + 55 * 60 * 1000; // 55 minutes from now
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('tokenExpiration', newExpirationTime);
            accessToken = data.access;
            return data.access;
        });
    } else {
        return Promise.resolve(token);
    }
}

function sendMessage(message) {
    addMessageToChat('user', message);
    getValidToken()
        .then(token => {
            return fetch(`/api/conversations/${currentConversationId}/send_message/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ message }),
            });
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(data => {
            addMessageToChat('assistant', data.message);
        })
        .catch(error => {
            console.error('Error:', error);
            if (error.message.includes('token_not_valid')) {
                alert('Your session has expired. Please log in again.');
                // Perform logout actions here
            } else {
                alert('Failed to send message. Please try again.');
            }
        });
}

function addMessageToChat(sender, message) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    messageDiv.innerHTML = `<div class="chat-bubble">${message}</div>`;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function addChatToHistory(chatId, chatTitle) {
    const chatHistory = document.getElementById('chatHistory');
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.textContent = chatTitle;
    listItem.addEventListener('click', function() {
        loadChat(chatId);
    });
    chatHistory.appendChild(listItem);
}

function startNewChat() {
    getValidToken()
        .then(token => {
            return fetch('/api/conversations/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title: 'New Conversation' }),
            });
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(data => {
            currentConversationId = data.id;
            addChatToHistory(data.id, data.title);
            document.getElementById('chatContainer').innerHTML = '';
        })
        .catch(error => {
            console.error('Error:', error);
            if (error.message.includes('token_not_valid')) {
                alert('Your session has expired. Please log in again.');
                // Perform logout actions here
            } else {
                alert('Failed to start new chat. Please try again.');
            }
        });
}

function loadChat(chatId) {
    getValidToken()
        .then(token => {
            return fetch(`/api/conversations/${chatId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
        })
        .then(response => {
            console.log(response)
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(data => {
            currentConversationId = data.id;
            document.getElementById('chatContainer').innerHTML = '';
            data.messages.forEach(message => {
                addMessageToChat(message.role, message.content);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            if (error.message.includes('token_not_valid')) {
                alert('Your session has expired. Please log in again.');
                // Perform logout actions here
            } else {
                alert('Failed to load chat. Please try again.');
            }
        });
}

function getChatHistory() {
    getValidToken()
        .then(token => {
            return fetch('/api/conversations/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('chatHistory').innerHTML = '';
            data.forEach(chat => {
                addChatToHistory(chat.id, chat.title);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            if (error.message.includes('token_not_valid')) {
                alert('Your session has expired. Please log in again.');
                // Perform logout actions here
            } else {
                alert('Failed to get chat history. Please try again.');
            }
        });
}

if (accessToken) {
    getChatHistory();
}