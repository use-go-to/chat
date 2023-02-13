const els = {
    welcomeScreen: null,
    chatScreen: null
};

let socket = null;
let nickname = '';

const init = () => {
    els.welcomeScreen = document.querySelector('.welcome-screen');
    els.chatScreen = document.querySelector('.chat-screen');

    socket = io();

    socket.on('message', ({ nickname, message, ts }) => {
        addMessage({ nickname, message, ts });
    });
    // Same as
    // socket.on('message', addMessage);

    els.welcomeScreen.querySelector('form')
        .addEventListener('submit', (e) => { e.preventDefault(); });
    els.chatScreen.querySelector('form')
        .addEventListener('submit', (e) => {e.preventDefault(); });

    els.welcomeScreen.querySelector('button')
        .addEventListener('click', (e) => {
            const inputEl = els.welcomeScreen.querySelector('input');
            if (inputEl.value.length === 0) {
                return;
            }
            nickname = inputEl.value;
            // els.welcomeScreen.style.display = 'none';
            
            els.welcomeScreen.classList.add('slideOutRight');
            els.welcomeScreen.classList.add('animated');

            setTimeout(() => {
                els.chatScreen.style.display = 'flex';
                els.welcomeScreen.style.display = 'none';
                els.chatScreen.classList.add('slideInLeft');
                els.chatScreen.classList.add('animated');
            }, 400);
            

            els.chatScreen.querySelector('h1').textContent = nickname;

            socket.emit('nickname', { nickname });
        });
    
    
    els.chatScreen.querySelector('button')
        .addEventListener('click', () => {
            const inputEl = els.chatScreen.querySelector('input');
            if (inputEl.value.length === 0) {
                return;
            }
            socket.emit('message', {
                nickname,
                message: inputEl.value
            });

            addMessage({ message: inputEl.value, nickname }, { isSender : true });
            inputEl.value =  '';
        });
};

const addMessage = ({ message, nickname, ts }, { isSender = false } = {}) => {
    const el = getMessageEl({ message, nickname }, { isSender });

    const messagesEl = els.chatScreen.querySelector('ul');
    
    messagesEl.insertAdjacentElement('beforeend', el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
};

const getMessageEl = ({ message, nickname }, { isSender = false } = {}) => {
    const container = document.createElement('li'); // <li></li>
    container.classList.add('message'); // <li class="message"></li>
    if (isSender === true) {
        container.classList.add('sender'); // <li class="message sender"></li>
    }
    
    const img = document.createElement('img');
    img.setAttribute('src', `https://avatars.dicebear.com/v2/human/${nickname}.svg`);
    img.setAttribute('alt', nickname);

    const textEl = document.createElement('span');
    textEl.textContent = message;

    /**
     * <li>
     *   <img alt="{nickname}" />
     *   <span>{message}</span>
     * </li>
     */
    if (isSender === false) {
        container.appendChild(img);
    }
    container.appendChild(textEl);
    if (isSender === true) {
        container.appendChild(img);
    }

    return container;
}

window.addEventListener('load', init);