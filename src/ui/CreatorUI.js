import { StorageService } from '../services/StorageService.js';

let birthdaySession = {
    recipientName: '',
    nickname: '',
    birthdayDate: '',
    creatorName: '',
    message: '',
    secret: '',
    photoBase64: null,
};

export function initCreatorFlow() {
    const landingScreen = document.getElementById('landing-screen');
    const creationScreen = document.getElementById('creation-screen');
    const progressBar = document.getElementById('progressBar');

    if (!landingScreen || !creationScreen) return;

    // Start Creation
    document.getElementById('startCreationBtn')?.addEventListener('click', () => {
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
                birthdaySession.message = document.getElementById('messageInput').value.trim();
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

    // Clear error
    document.getElementById('recipientName')?.addEventListener('input', (e) => {
        e.target.classList.remove('input-error');
        document.getElementById('nameError').style.display = 'none';
    });

    // Message count and suggestions
    const messageInput = document.getElementById('messageInput');
    const msgCount = document.getElementById('msgCount');
    if (messageInput) {
        messageInput.addEventListener('input', (e) => {
            msgCount.textContent = e.target.value.length;
        });
        
        document.querySelectorAll('.suggestion-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                messageInput.value = pill.textContent.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '').trim();
                msgCount.textContent = messageInput.value.length;
            });
        });
    }

    // Photo Upload
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const photoPreviews = document.getElementById('photoPreviews');

    if (uploadZone && fileInput) {
        uploadZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
        
        uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
        uploadZone.addEventListener('dragleave', () => { uploadZone.classList.remove('drag-over'); });
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault(); uploadZone.classList.remove('drag-over');
            handleFile(e.dataTransfer.files[0]);
        });
    }

    function handleFile(file) {
        if (!file) return;
        if (!file.type.startsWith('image/')) return alert("Please select an image file.");
        
        const reader = new FileReader();
        reader.onload = () => {
            birthdaySession.photoBase64 = reader.result;
            if (photoPreviews) {
                photoPreviews.innerHTML = `
                    <div class="photo-preview-item">
                        <img src="${birthdaySession.photoBase64}" alt="Preview">
                        <button class="remove-photo" id="removePhotoBtn">×</button>
                    </div>
                `;
                uploadZone.style.display = 'none';
                
                document.getElementById('removePhotoBtn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    birthdaySession.photoBase64 = null;
                    photoPreviews.innerHTML = '';
                    fileInput.value = '';
                    uploadZone.style.display = 'block';
                });
            }
        };
        reader.readAsDataURL(file);
    }

    // Final Create
    document.getElementById('finalCreateBtn')?.addEventListener('click', async (e) => {
        const btn = e.target;
        btn.disabled = true;
        btn.textContent = 'Generating Link...';

        try {
            // Save to StorageService
            const id = await StorageService.saveSurprise(birthdaySession);
            
            // Generate Link
            const shareUrl = new URL(window.location.href);
            shareUrl.searchParams.set('id', id);
            
            // Update UI to show the link
            creationScreen.innerHTML = `
                <div class="step-card active" style="text-align:center;">
                    <h2>Your Surprise is Ready! ✨</h2>
                    <p class="subtitle" style="margin-bottom: 2rem;">Copy this link and send it to ${birthdaySession.recipientName || 'them'}.</p>
                    <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; border: 1px solid var(--primary); margin-bottom: 2rem; overflow-wrap: break-word; color: #fff;">
                        ${shareUrl.toString()}
                    </div>
                    <button id="copyLinkBtn" class="premium-btn">Copy Link</button>
                    <button id="previewBtn" class="premium-btn ghost" style="margin-top: 1rem;">Preview Experience</button>
                </div>
            `;
            
            document.getElementById('copyLinkBtn').addEventListener('click', () => {
                navigator.clipboard.writeText(shareUrl.toString());
                document.getElementById('copyLinkBtn').textContent = 'Copied! 🎉';
            });
            
            document.getElementById('previewBtn').addEventListener('click', () => {
                window.location.href = shareUrl.toString();
            });

        } catch (err) {
            console.error(err);
            btn.disabled = false;
            btn.textContent = 'Create Surprise';
            alert('Failed to generate surprise. Please try again.');
        }
    });

    init3DTilt();
}

function goToStep(from, to) {
    document.getElementById(`step-${from}`)?.classList.remove('active');
    document.getElementById(`step-${to}`)?.classList.add('active');
    updateProgress(to);
}

function updateProgress(stepNum) {
    const totalSteps = 6;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = `${(stepNum / totalSteps) * 100}%`;
    }
}

function renderPreview() {
    const pName = document.getElementById('previewName');
    const pCreator = document.getElementById('previewCreator');
    const pSecret = document.getElementById('previewSecret');
    const pPhoto = document.getElementById('previewPhoto');

    if(pName) pName.textContent = birthdaySession.recipientName + (birthdaySession.nickname ? ` (${birthdaySession.nickname})` : '');
    if(pCreator) pCreator.textContent = birthdaySession.creatorName || 'Anonymous';
    if(pSecret) pSecret.textContent = birthdaySession.secret || 'None';
    
    if (birthdaySession.photoBase64 && pPhoto) {
        pPhoto.src = birthdaySession.photoBase64;
        pPhoto.style.display = 'block';
    } else if (pPhoto) {
        pPhoto.style.display = 'none';
    }
}

export function init3DTilt() {
    const cards = document.querySelectorAll('.step-card, .glass-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
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
