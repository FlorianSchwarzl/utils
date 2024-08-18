let ws;

let messages = [];

function updateStatus(status) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = status;

    if (status === 'Connected') {
        statusDiv.className = 'status-connected';
    } else if (status === 'Disconnected') {
        statusDiv.className = 'status-disconnected';
    } else if (status === 'Connecting...') {
        statusDiv.className = 'status-connecting';
    }
}

function connectWebSocket() {
    const urlInput = document.getElementById('wsUrl');
    const url = urlInput.value;

    if (ws) {
        ws.close(); // Close any existing connection
    }

    updateStatus('Connecting...');

    ws = new WebSocket(url);

    ws.onopen = function() {
        updateStatus('Connected');
    };

    ws.onmessage = function(event) {
        const receiveBox = document.getElementById('receiveBox');
        receiveBox.value += event.data + '\n';
    };

    ws.onerror = function(event) {
        console.error('WebSocket error observed:', event);
    };

    ws.onclose = function(event) {
        updateStatus('Disconnected');
    };
}

function sendMessage(message) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
    } else {
        console.error('WebSocket is not open');
    }
}

function generateButtons() {
    const buttonGrid = document.getElementById('buttonGrid');
    buttonGrid.innerHTML = ''; // Clear existing buttons

    messages.forEach((item, index) => {
        const button = document.createElement('button');
        button.textContent = item.name;
        button.className = 'message-button';
        button.onclick = () => {
            sendMessage(item.message);
            button.classList.add('pressed');
            setTimeout(() => button.classList.remove('pressed'), 200); // Remove class after 200ms
        };

        button.oncontextmenu = (e) => {
            e.preventDefault(); // Prevent the context menu from appearing
            removeButton(index);
        };

        buttonGrid.appendChild(button);
    });
}

function addButton() {
    const nameInput = document.getElementById('nameInput');
    const messageInput = document.getElementById('messageInput');
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (name && message) {
        messages.push({ name, message });
        generateButtons();
        nameInput.value = ''; // Clear the input fields
        messageInput.value = '';
    } else {
        alert('Please enter both a name and a message.');
    }
}

function removeButton(index) {
    messages.splice(index, 1);
    generateButtons();
}

window.onload = function() {
    const urlInput = document.getElementById('wsUrl');
    urlInput.value = 'ws://localhost:8080'; // Default WebSocket URL
    connectWebSocket(); // Automatically connect on load
};
