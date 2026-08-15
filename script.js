// Typewriter effect
const messages = [
    "Every moment with you is magic.",
    "You are my forever and always.",
    "To the queen of my heart.",
    "Happy Birthday, my love."
];

const typedEl = document.getElementById('typed');
let msgIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentMsg = messages[msgIndex];
    
    if (isDeleting) {
        typedEl.textContent = currentMsg.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedEl.textContent = currentMsg.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentMsg.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        msgIndex = (msgIndex + 1) % messages.length;
        typeSpeed = 500; // Pause before next
    }

    setTimeout(typeEffect, typeSpeed);
}

setTimeout(typeEffect, 1000);

// 3D Tilt Effect
const container = document.getElementById('tilt-container');
document.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    container.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

// Reset tilt on mouse leave
document.addEventListener('mouseleave', () => {
    container.style.transform = `rotateY(0deg) rotateX(0deg)`;
    container.style.transition = 'transform 0.5s ease';
});
document.addEventListener('mouseenter', () => {
    container.style.transition = 'none';
});

// Particles background
function createParticles() {
    const particlesContainer = document.getElementById('particles-js');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 3 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(255, 255, 255, ' + (Math.random() * 0.5 + 0.1) + ')';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.animation = `pulse ${Math.random() * 3 + 2}s infinite alternate`;
        particlesContainer.appendChild(particle);
    }
}
createParticles();

// Floating Hearts
const heartsContainer = document.getElementById('hearts-container');
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    
    const size = Math.random() * 20 + 10;
    heart.style.width = size + 'px';
    heart.style.height = size + 'px';
    
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.top = '100vh';
    
    const duration = Math.random() * 5 + 4;
    heart.style.animationDuration = duration + 's';
    
    heartsContainer.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}
setInterval(createHeart, 800);

// Firework Explosion
function spawnFireworks(x, y) {
    const colors = ['#ff2a5f', '#ff758c', '#ffffff', '#ffb6c1', '#ff1493'];
    for (let i = 0; i < 60; i++) {
        const fw = document.createElement('div');
        fw.classList.add('firework');
        fw.style.left = x + 'px';
        fw.style.top = y + 'px';
        fw.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 100 + Math.random() * 200;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        fw.style.setProperty('--tx', tx + 'px');
        fw.style.setProperty('--ty', ty + 'px');
        fw.style.animationDuration = (Math.random() * 0.8 + 0.5) + 's';
        
        document.body.appendChild(fw);
        setTimeout(() => fw.remove(), 1500);
    }
}

// Reveal Button Interaction
const revealBtn = document.getElementById('revealBtn');
const card = document.getElementById('card');
const message = document.getElementById('message');

revealBtn.addEventListener('click', (e) => {
    // Spawn fireworks from button click position
    const rect = revealBtn.getBoundingClientRect();
    spawnFireworks(rect.left + rect.width / 2, rect.top + rect.height / 2);
    
    // Animate Card
    card.style.transform = 'translateZ(120px) scale(1.05)';
    card.style.boxShadow = '0 40px 80px rgba(255, 42, 95, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
    
    // Change text with fade
    message.style.opacity = 0;
    setTimeout(() => {
        message.innerHTML = "SURPRISE! 🎉<br><br>I love you more than words can express. You make every day feel like a beautiful dream.";
        message.style.opacity = 1;
        message.style.color = '#ff758c';
        message.style.fontWeight = '600';
    }, 300);

    // Lots of hearts
    for(let i=0; i<15; i++) {
        setTimeout(createHeart, i * 100);
    }
// Typewriter effect
const messages = [
    "Every moment with you is magic.",
    "You are my forever and always.",
    "To the queen of my heart.",
    "Happy Birthday, my love."
];

const typedEl = document.getElementById('typed');
let msgIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentMsg = messages[msgIndex];
    
    if (isDeleting) {
        typedEl.textContent = currentMsg.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedEl.textContent = currentMsg.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentMsg.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        msgIndex = (msgIndex + 1) % messages.length;
        typeSpeed = 500; // Pause before next
    }

    setTimeout(typeEffect, typeSpeed);
}

setTimeout(typeEffect, 1000);

// 3D Tilt Effect
const container = document.getElementById('tilt-container');
document.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    container.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

// Reset tilt on mouse leave
document.addEventListener('mouseleave', () => {
    container.style.transform = `rotateY(0deg) rotateX(0deg)`;
    container.style.transition = 'transform 0.5s ease';
});
document.addEventListener('mouseenter', () => {
    container.style.transition = 'none';
});

// Particles background
function createParticles() {
    const particlesContainer = document.getElementById('particles-js');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 3 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(255, 255, 255, ' + (Math.random() * 0.5 + 0.1) + ')';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.animation = `pulse ${Math.random() * 3 + 2}s infinite alternate`;
        particlesContainer.appendChild(particle);
    }
}
createParticles();

// Floating Hearts
const heartsContainer = document.getElementById('hearts-container');
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    
    const size = Math.random() * 20 + 10;
    heart.style.width = size + 'px';
    heart.style.height = size + 'px';
    
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.top = '100vh';
    
    const duration = Math.random() * 5 + 4;
    heart.style.animationDuration = duration + 's';
    
    heartsContainer.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}
setInterval(createHeart, 800);

// Firework Explosion
function spawnFireworks(x, y) {
    const colors = ['#ff2a5f', '#ff758c', '#ffffff', '#ffb6c1', '#ff1493'];
    for (let i = 0; i < 60; i++) {
        const fw = document.createElement('div');
        fw.classList.add('firework');
        fw.style.left = x + 'px';
        fw.style.top = y + 'px';
        fw.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 100 + Math.random() * 200;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        fw.style.setProperty('--tx', tx + 'px');
        fw.style.setProperty('--ty', ty + 'px');
        fw.style.animationDuration = (Math.random() * 0.8 + 0.5) + 's';
        
        document.body.appendChild(fw);
        setTimeout(() => fw.remove(), 1500);
    }
}

// Reveal Button Interaction
const revealBtn = document.getElementById('revealBtn');
const card = document.getElementById('card');
const message = document.getElementById('message');

revealBtn.addEventListener('click', (e) => {
    // Spawn fireworks from button click position
    const rect = revealBtn.getBoundingClientRect();
    spawnFireworks(rect.left + rect.width / 2, rect.top + rect.height / 2);
    
    // Animate Card
    card.style.transform = 'translateZ(120px) scale(1.05)';
    card.style.boxShadow = '0 40px 80px rgba(255, 42, 95, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
    
    // Change text with fade
    message.style.opacity = 0;
    setTimeout(() => {
        message.innerHTML = "SURPRISE! 🎉<br><br>I love you more than words can express. You make every day feel like a beautiful dream.";
        message.style.opacity = 1;
        message.style.color = '#ff758c';
        message.style.fontWeight = '600';
    }, 300);

    // Lots of hearts
    for(let i=0; i<15; i++) {
        setTimeout(createHeart, i * 100);
    }

    setTimeout(() => {
        card.style.transform = 'translateZ(80px)';
    }, 2000);
});

// Audio Controls (Local File)
const song = document.getElementById('song');
const playBtn = document.getElementById('playBtn');
let isPlaying = false;
let hasStarted = false;

playBtn.addEventListener('click', () => {
    if (!song) return;

    if (!hasStarted) {
        // Start precisely at 56 seconds
        song.currentTime = 56;
        hasStarted = true;
    }

    if (isPlaying) {
        song.pause();
        playBtn.querySelector('.btn-text').textContent = 'Play Song';
    } else {
        song.play();
        playBtn.querySelector('.btn-text').textContent = 'Pause Song';
    }
    isPlaying = !isPlaying;
});
