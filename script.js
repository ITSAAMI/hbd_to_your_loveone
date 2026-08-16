// ==========================================
// Birthday Wish Creator — Main Script (Redesign)
// ==========================================

// ---- STATE ----
const DEFAULT_MSG = "Wishing you the happiest of birthdays! May this day be as beautiful and special as you are.";
let birthdaySession = {
    recipientName: '',
    nickname: '',
    birthdayDate: '',
    creatorName: '',
    message: '',
    secret: '',
    photoObjectURL: null,
    photoFile: null
};

// ---- DOM REFS ----
const landingScreen = document.getElementById('landing-screen');
const creationScreen = document.getElementById('creation-screen');
const experienceScreen = document.getElementById('experience-screen');
const progressBar = document.getElementById('progressBar');

// ---- INITIALIZATION ----
(function init() {
    init3DTilt();
    // Check if we are loading into the final experience
    const saved = sessionStorage.getItem('finalBirthdayData');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (data && data.recipientName) {
                landingScreen.classList.remove('active');
                startExperience(data);
                return;
            }
        } catch (e) { console.error(e); }
    }
    // Otherwise stay on landing page
    initCreationFlow();
})();

// ==========================================
// CREATION FLOW LOGIC
// ==========================================
function initCreationFlow() {
    // Start Creation
    document.getElementById('startCreationBtn').addEventListener('click', () => {
        landingScreen.classList.remove('active');
        landingScreen.classList.add('fade-out');
        setTimeout(() => {
            landingScreen.style.display = 'none';
            creationScreen.classList.add('active', 'fade-in');
            updateProgress(1);
        }, 400);
    });

    // Navigation Buttons
    document.querySelectorAll('.next-step').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetStep = parseInt(e.target.getAttribute('data-target'));
            const currentStep = targetStep - 1;
            
            // Validation
            if (currentStep === 1) {
                const name = document.getElementById('recipientName').value.trim();
                if (!name) {
                    document.getElementById('nameError').style.display = 'block';
                    document.getElementById('recipientName').classList.add('input-error');
                    return;
                }
                birthdaySession.recipientName = name;
                birthdaySession.nickname = document.getElementById('recipientNickname').value.trim();
            } else if (currentStep === 3) {
                birthdaySession.birthdayDate = document.getElementById('birthdayDate').value;
                birthdaySession.creatorName = document.getElementById('creatorName').value.trim();
            } else if (currentStep === 4) {
                birthdaySession.message = document.getElementById('messageInput').value.trim() || DEFAULT_MSG;
            } else if (currentStep === 5) {
                birthdaySession.secret = document.getElementById('secretPhrase').value.trim();
                renderPreview();
            }

            goToStep(currentStep, targetStep);
        });
    });

    document.querySelectorAll('.prev-step').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetStep = parseInt(e.target.getAttribute('data-target'));
            goToStep(targetStep + 1, targetStep);
        });
    });

    // Clear error on type
    document.getElementById('recipientName').addEventListener('input', (e) => {
        e.target.classList.remove('input-error');
        document.getElementById('nameError').style.display = 'none';
    });

    // Message count
    const messageInput = document.getElementById('messageInput');
    const msgCount = document.getElementById('msgCount');
    messageInput.addEventListener('input', (e) => {
        msgCount.textContent = e.target.value.length;
    });

    // Message Suggestions
    document.querySelectorAll('.suggestion-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            messageInput.value = pill.textContent.replace(' 🎂', '').replace(' 🌟', '').replace(' ✨', '').replace(' ❤️', '').trim();
            msgCount.textContent = messageInput.value.length;
        });
    });

    // Photo Upload (Drag & Drop / Click)
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const photoPreviews = document.getElementById('photoPreviews');

    uploadZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

    uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
    uploadZone.addEventListener('dragleave', () => { uploadZone.classList.remove('drag-over'); });
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault(); uploadZone.classList.remove('drag-over');
        handleFile(e.dataTransfer.files[0]);
    });

    function handleFile(file) {
        if (!file) return;
        if (!file.type.startsWith('image/')) return alert("Please select an image file.");
        if (file.size > 5 * 1024 * 1024) return alert("File exceeds 5MB.");
        
        if (birthdaySession.photoObjectURL) URL.revokeObjectURL(birthdaySession.photoObjectURL);
        
        birthdaySession.photoFile = file;
        birthdaySession.photoObjectURL = URL.createObjectURL(file);
        
        photoPreviews.innerHTML = `
            <div class="photo-preview-item">
                <img src="${birthdaySession.photoObjectURL}" alt="Preview">
                <button class="remove-photo" id="removePhotoBtn">×</button>
            </div>
        `;
        document.getElementById('removePhotoBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            URL.revokeObjectURL(birthdaySession.photoObjectURL);
            birthdaySession.photoObjectURL = null;
            birthdaySession.photoFile = null;
            photoPreviews.innerHTML = '';
            fileInput.value = '';
        });
    }

    // Final Create
    document.getElementById('finalCreateBtn').addEventListener('click', async (e) => {
        const btn = e.target;
        btn.disabled = true;
        btn.textContent = 'Creating...';

        let base64Photo = null;
        if (birthdaySession.photoFile) {
            base64Photo = await new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(birthdaySession.photoFile);
            });
        }

        const finalData = {
            recipientName: birthdaySession.recipientName,
            nickname: birthdaySession.nickname,
            creatorName: birthdaySession.creatorName,
            message: birthdaySession.message,
            secret: birthdaySession.secret,
            photoBase64: base64Photo
        };

        try {
            sessionStorage.setItem('finalBirthdayData', JSON.stringify(finalData));
        } catch (err) {
            console.warn("Storage full, proceeding without refresh persistence.");
        }

        creationScreen.classList.remove('active');
        creationScreen.style.display = 'none';
        startExperience(finalData);
    });
}

function goToStep(from, to) {
    document.getElementById(`step-${from}`).classList.remove('active');
    document.getElementById(`step-${to}`).classList.add('active');
    updateProgress(to);
}

function updateProgress(stepNum) {
    const totalSteps = 6;
    progressBar.style.width = `${(stepNum / totalSteps) * 100}%`;
}

function renderPreview() {
    document.getElementById('previewName').textContent = birthdaySession.recipientName + (birthdaySession.nickname ? ` (${birthdaySession.nickname})` : '');
    document.getElementById('previewCreator').textContent = birthdaySession.creatorName || 'Anonymous';
    document.getElementById('previewSecret').textContent = birthdaySession.secret || 'None';
    
    const previewPhoto = document.getElementById('previewPhoto');
    if (birthdaySession.photoObjectURL) {
        previewPhoto.src = birthdaySession.photoObjectURL;
        previewPhoto.style.display = 'block';
    } else {
        previewPhoto.style.display = 'none';
    }
}

// ==========================================
// EXPERIENCE LOGIC
// ==========================================
function startExperience(data) {
    experienceScreen.classList.add('active');
    initBackgroundEffects();

    const scenes = Array.from(document.querySelectorAll('.exp-scene'));
    scenes.forEach(s => s.classList.remove('active'));

    document.title = `Surprise for ${data.recipientName}!`;

    // Setup DOM data
    document.getElementById('expTitle').textContent = `Happy Birthday, ${data.recipientName}!`;
    document.getElementById('expMessage').textContent = data.message;
    if (data.creatorName) document.getElementById('creatorCredit').textContent = `Created with ❤️ by ${data.creatorName}`;
    document.getElementById('finalMessageExcerpt').textContent = data.nickname ? `Love you, ${data.nickname}!` : `Hope you have a fantastic day!`;

    const photoEl = document.getElementById('expPhoto');
    if (data.photoBase64) {
        photoEl.src = data.photoBase64;
    } else {
        // Remove photo scene if no photo
        document.getElementById('scene-photo').remove();
    }

    // Determine first scene
    if (data.secret) {
        document.getElementById('scene-secret').classList.add('active');
        setupSecret(data.secret);
    } else {
        document.getElementById('scene-intro').classList.add('active');
    }

    // Generic next buttons
    document.querySelectorAll('.scene-next-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const nextId = e.target.getAttribute('data-next');
            advanceScene(e.target.closest('.exp-scene'), document.getElementById(nextId));
        });
    });

    // Intro open button
    document.getElementById('openSurpriseBtn').addEventListener('click', (e) => {
        advanceScene(document.getElementById('scene-intro'), document.getElementById('scene-name'));
    });

    // Restart button
    document.getElementById('restartBtn').addEventListener('click', () => {
        sessionStorage.clear();
        location.reload();
    });

    setupMessageTyping();
    setupBalloon();
}

function advanceScene(currentEl, nextEl) {
    currentEl.classList.remove('active');
    currentEl.style.display = 'none'; // force hide
    if (nextEl) {
        nextEl.classList.add('active');
        if (nextEl.id === 'scene-message') startTypingMessage();
        if (nextEl.id === 'scene-final') triggerFinalCelebration();
    }
}

function setupSecret(secret) {
    const btn = document.getElementById('unlockBtn');
    const input = document.getElementById('unlockInput');
    const error = document.getElementById('unlockError');

    const checkSecret = () => {
        if (input.value.trim().toLowerCase() === secret.toLowerCase()) {
            error.style.display = 'none';
            advanceScene(document.getElementById('scene-secret'), document.getElementById('scene-intro'));
        } else {
            error.style.display = 'block';
        }
    };

    btn.addEventListener('click', checkSecret);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') checkSecret();
    });
}

// Typing effect for message
function setupMessageTyping() {
    // Prep
}
function startTypingMessage() {
    const el = document.getElementById('expMessage');
    const text = el.textContent;
    el.textContent = '';
    let i = 0;
    
    function typeChar() {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(typeChar, 30);
        } else {
            document.getElementById('msgNextBtn').style.opacity = '1';
            document.getElementById('msgNextBtn').style.pointerEvents = 'auto';
        }
    }
    setTimeout(typeChar, 500);
}

function setupBalloon() {
    const balloonWrap = document.getElementById('interactiveBalloon');
    const balloon = balloonWrap.querySelector('.balloon');
    
    balloonWrap.addEventListener('click', () => {
        // Wobble first
        balloon.classList.add('wobble');
        
        setTimeout(() => {
            // Pop
            balloon.classList.remove('wobble');
            balloon.classList.add('pop');
            spawnConfetti();
            
            setTimeout(() => {
                advanceScene(document.getElementById('scene-balloon'), document.getElementById('scene-final'));
            }, 600);
        }, 800);
    });
}

function triggerFinalCelebration() {
    const song = document.getElementById('song');
    if (song) {
        song.currentTime = 56;
        song.play().catch(e => console.log('Audio autoplay blocked', e));
    }

    // Launch heavy fireworks
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    for(let i=0; i<3; i++) {
        setTimeout(() => spawnFireworks(cx + (Math.random()*200-100), cy + (Math.random()*200-100)), i*400);
    }
}

// ==========================================
// EFFECTS (Preserved/Adapted)
// ==========================================
function initBackgroundEffects() {
    // Particles
    const particlesContainer = document.getElementById('particles-js');
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.style.position = 'absolute';
        p.style.width = Math.random() * 3 + 1 + 'px';
        p.style.height = p.style.width;
        p.style.background = `rgba(255,255,255,${Math.random() * 0.5 + 0.1})`;
        p.style.borderRadius = '50%';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.top = Math.random() * 100 + 'vh';
        p.style.animation = `pulseOrb ${Math.random() * 3 + 2}s infinite alternate`;
        particlesContainer.appendChild(p);
    }

    // Hearts
    const heartsContainer = document.getElementById('hearts-container');
    setInterval(() => {
        if(document.hidden) return;
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
        setTimeout(() => heart.remove(), duration * 1000);
    }, 1500);
}

function spawnFireworks(x, y) {
    const colors = ['#ff2a5f', '#ff758c', '#ffffff', '#ffb6c1', '#ff1493'];
    for (let i = 0; i < 50; i++) {
        const fw = document.createElement('div');
        fw.classList.add('firework');
        fw.style.left = x + 'px';
        fw.style.top = y + 'px';
        fw.style.background = colors[Math.floor(Math.random() * colors.length)];
        const angle = Math.random() * Math.PI * 2;
        const velocity = 80 + Math.random() * 150;
        fw.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
        fw.style.setProperty('--ty', Math.sin(angle) * velocity + 'px');
        fw.style.animationDuration = (Math.random() * 0.8 + 0.5) + 's';
        document.body.appendChild(fw);
        setTimeout(() => fw.remove(), 1500);
    }
}

function spawnConfetti() {
    const colors = ['#ff2a5f', '#ff758c', '#ffffff', '#ffd700', '#00ff00'];
    for (let i = 0; i < 100; i++) {
        const c = document.createElement('div');
        c.classList.add('confetti');
        c.style.left = Math.random() * 100 + 'vw';
        c.style.top = -10 + 'px';
        c.style.background = colors[Math.floor(Math.random() * colors.length)];
        c.style.animationDuration = (Math.random() * 2 + 2) + 's';
        c.style.animationDelay = (Math.random() * 0.5) + 's';
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 5000);
    }
}

function init3DTilt() {
    const cards = document.querySelectorAll('.step-card, .glass-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation between -10 and 10 degrees
            const rotateX = ((y - centerY) / centerY) * -10; 
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease';
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease-out';
        });
    });
}
