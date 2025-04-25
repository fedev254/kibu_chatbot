class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        };

        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, chatBox, sendButton } = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox));
        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        const inputField = chatBox.querySelector('input');
        inputField.addEventListener('keyup', ({ key }) => {
            if (key === 'Enter') {
                this.onSendButton(chatBox);
            }
        });
    }

    toggleState(chatBox) {
        this.state = !this.state;

        if (this.state) {
            chatBox.classList.add('chatbox--active');
        } else {
            chatBox.classList.remove('chatbox--active');
        }
    }

    onSendButton(chatBox) {
        const inputField = chatBox.querySelector('input');
        const userText = inputField.value;

        if (userText === '') return;

        const userMessage = { name: 'User', message: userText };
        this.messages.push(userMessage); // Add user's message first

        fetch('/predict', {
            method: 'POST',
            body: JSON.stringify({ message: userText }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            // Ensure that the response is handled properly (handling multiple bot responses)
            let botResponses = [];
            if (Array.isArray(data.answer)) {
                botResponses = data.answer;
            } else if (typeof data.answer === 'string' && data.answer.includes('\n')) {
                botResponses = data.answer.split('\n').map(s => s.trim()).filter(Boolean);
            } else {
                botResponses = [data.answer];
            }

            // Append each bot response after the user message
            botResponses.forEach(res => {
                const botMessage = { name: 'Abel', message: res };
                this.messages.push(botMessage); // Ensure bot message comes after user message
            });

            // Update the chat display
            this.updateChatText(chatBox);
            inputField.value = ''; // Clear the input field
        });
    }

    updateChatText(chatBox) {
        const chatMessageContainer = chatBox.querySelector('.chatbox__messages');

        // Create new message elements and append to the container
        this.messages.forEach(item => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('messages__item');
            messageElement.classList.add(item.name === 'Abel' ? 'messages__item--visitor' : 'messages__item--operator');
            messageElement.innerHTML = item.message;
            chatMessageContainer.appendChild(messageElement);
        });

        // Scroll to the bottom after adding new messages
        chatMessageContainer.scrollTop = chatMessageContainer.scrollHeight;
    }
}

const chatbox = new Chatbox();
chatbox.display();
