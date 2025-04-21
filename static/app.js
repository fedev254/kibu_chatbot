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
        this.messages.push(userMessage);

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
                const botMessage = { name: 'Abel', message: data.answer };
                this.messages.push(botMessage);
                this.updateChatText(chatBox);
                inputField.value = '';
            })
            .catch(error => {
                console.error('Error:', error);
                this.updateChatText(chatBox);
                inputField.value = '';
            });
    }

    updateChatText(chatBox) {
        const chatMessageContainer = chatBox.querySelector('.chatbox__messages');
        chatMessageContainer.innerHTML = this.messages
            .slice()
            .reverse()
            .map(item => {
                if (item.name === 'Abel') {
                    return `<div class="messages__item messages__item--visitor">${item.message}</div>`;
                } else {
                    return `<div class="messages__item messages__item--operator">${item.message}</div>`;
                }
            })
            .join('');
    }
}

const chatbox = new Chatbox();
chatbox.display();
