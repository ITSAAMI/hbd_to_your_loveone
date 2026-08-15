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
    }, 45);
}

function nextMessage() {
    typeMessage(messages[msgIndex], typedEl, () => {
        msgIndex = (msgIndex + 1) % messages.length;
        setTimeout(nextMessage, 2000);
    });
}

nextMessage();

// Hearts generator
const heartsContainer = document.getElementById('hearts');
function spawnHeart() {
    const h = document.createElement('div');
    h.className = 'heart';
    const size = 12 + Math.random() * 28;
    h.style.width = size + 'px';
    h.style.height = size + 'px';
    h.style.left = (Math.random() * 100) + 'vw';
    
    // randomize animation duration
    const dur = 4 + Math.random() * 6;
    h.style.animationDuration = dur + 's';
    
    heartsContainer.appendChild(h);
    setTimeout(() => h.remove(), dur * 1000);
}

setInterval(spawnHeart, 400);

// Reveal button: show a larger message animation and confetti
const revealBtn = document.getElementById('revealBtn');
const card = document.getElementById('card');

function spawnConfetti() {
    for (let i = 0; i < 60; i++) {
        const c = document.createElement('div');
        c.className = 'confetti';
        c.style.left = Math.random() * 100 + 'vw';
        c.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
        c.style.animationDuration = (Math.random() * 3 + 2) + 's';
        c.style.animationDelay = Math.random() * 0.5 + 's';
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 5000);
    }
}

revealBtn.addEventListener('click', () => {
    card.classList.add('popped');
    spawnConfetti();
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
	.card.popped{transform:scale(1.05) translateY(-15px);box-shadow:0 40px 80px rgba(255,8,68,0.3);transition:transform .3s cubic-bezier(0.175, 0.885, 0.32, 1.275)}
`;
document.head.appendChild(style);
