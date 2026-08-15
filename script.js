// Typewriter messages
const messages = [
    "To my dearest — happy birthday.",
    "Every moment with you is magic.",
    "I love you more than words can say.",
    "Will you be my forever?"
];

const typedEl = document.getElementById('typed');
let msgIndex = 0;

function typeMessage(text, el, cb) {
    el.textContent = '';
    let i = 0;
    const t = setInterval(() => {
        el.textContent += text[i++] || '';
        if (i > text.length) { clearInterval(t); if (cb) cb(); }
    }, 38);
}

function nextMessage() {
    typeMessage(messages[msgIndex], typedEl, () => {
        msgIndex = (msgIndex + 1) % messages.length;
        setTimeout(nextMessage, 1600);
    });
}

nextMessage();

// Hearts generator
const heartsContainer = document.getElementById('hearts');
function spawnHeart() {
    const h = document.createElement('div');
    h.className = 'heart';
    const size = 12 + Math.random() * 28;
    h.style.width = h.style.height = size + 'px';
    h.style.left = (Math.random() * 100) + '%';
    h.style.bottom = '-10px';
    h.style.opacity = (0.6 + Math.random() * 0.4).toString();
    h.style.transform = 'rotate(45deg)';
    const dur = 6 + Math.random() * 8;
    h.style.animationDuration = dur + 's';
    heartsContainer.appendChild(h);
    setTimeout(() => h.remove(), (dur + 0.5) * 1000);
}

setInterval(spawnHeart, 600);

// Reveal button: show a larger message animation
const revealBtn = document.getElementById('revealBtn');
const card = document.getElementById('card');
revealBtn.addEventListener('click', () => {
    card.classList.add('popped');
    setTimeout(() => card.classList.remove('popped'), 2500);
});

// Audio controls
const song = document.getElementById('song');
const playBtn = document.getElementById('playBtn');
let playing = false;
playBtn.addEventListener('click', () => {
    if (!song.src || song.src.indexOf('song.mp3') === -1) {
        alert('Add a file named song.mp3 in the project folder to enable playback.');
        return;
    }
    if (!playing) { song.play(); playBtn.textContent = 'Pause Song'; playing = true }
    else { song.pause(); playBtn.textContent = 'Play Song'; playing = false }
});

// small visual punch when card pops
const style = document.createElement('style');
style.textContent = `
	.card.popped{transform:scale(1.03);box-shadow:0 30px 60px rgba(255,107,129,0.18);transition:transform .18s}
`;
document.head.appendChild(style);

