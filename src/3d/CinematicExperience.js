import * as THREE from 'three';
import gsap from 'gsap';

export function initCinematicExperience(data) {
    // Hide Creator UI elements
    document.getElementById('creation-screen')?.remove();

    const experienceScreen = document.getElementById('experience-screen');
    if (!experienceScreen) return;
    
    experienceScreen.classList.add('active');
    experienceScreen.innerHTML = ''; 
    
    // Inject HTML structure for Cinematic Overlay
    const overlay = document.createElement('div');
    overlay.id = 'cinematic-overlay';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none'; 
    overlay.style.zIndex = '10';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.color = '#fff';
    overlay.style.fontFamily = 'Montserrat, sans-serif';
    experienceScreen.appendChild(overlay);

    // Initial Start Button
    const startBtn = document.createElement('button');
    startBtn.className = 'premium-btn';
    startBtn.textContent = 'Open Your Surprise ✨';
    startBtn.style.pointerEvents = 'auto';
    overlay.appendChild(startBtn);

    // Setup Three.js Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0510, 0.015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0510, 1);
    
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '1';
    experienceScreen.appendChild(renderer.domElement);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2500;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 150;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const material = new THREE.PointsMaterial({
        size: 0.3,
        color: 0xff2a5f,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    // Photo Mesh in 3D
    let photoMesh = null;
    if (data.photoBase64) {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(data.photoBase64, (texture) => {
            const aspect = texture.image.width / texture.image.height;
            // Add a frame/border using a slightly larger plane behind it
            const frameGeo = new THREE.PlaneGeometry((12 * aspect) + 0.5, 12.5);
            const frameMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
            const frameMesh = new THREE.Mesh(frameGeo, frameMat);
            frameMesh.position.set(0, 0, -20.1);
            scene.add(frameMesh);

            const geo = new THREE.PlaneGeometry(12 * aspect, 12);
            const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0 });
            photoMesh = new THREE.Mesh(geo, mat);
            photoMesh.position.set(0, 0, -20);
            scene.add(photoMesh);

            // Group them to animate together
            const photoGroup = new THREE.Group();
            photoGroup.add(frameMesh);
            photoGroup.add(photoMesh);
            photoGroup.name = "photoGroup";
            scene.add(photoGroup);
        });
    }

    // Animation Loop
    let clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = elapsedTime * 0.02;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // GSAP Cinematic Journey
    startBtn.addEventListener('click', () => {
        startBtn.style.display = 'none';

        const tl = gsap.timeline();

        // 1. Move camera forward
        tl.to(camera.position, {
            z: 20,
            duration: 3,
            ease: "power2.inOut"
        }, 0);

        // 2. Show Name
        const nameEl = document.createElement('h1');
        nameEl.className = 'title huge-title';
        nameEl.textContent = `Happy Birthday, ${data.recipientName}!`;
        nameEl.style.opacity = 0;
        nameEl.style.position = 'absolute';
        overlay.appendChild(nameEl);

        tl.to(nameEl, { opacity: 1, duration: 2 }, 1);
        tl.to(nameEl, { opacity: 0, duration: 1 }, 4);

        // 3. Move Camera deeper to reveal photo
        tl.to(camera.position, {
            z: -5,
            duration: 4,
            ease: "power2.inOut"
        }, 5);

        if (data.photoBase64) {
            const photoGroup = scene.getObjectByName("photoGroup");
            if (photoGroup) {
                const meshes = photoGroup.children;
                tl.to(meshes[0].material, { opacity: 0.8, duration: 2 }, 6);
                tl.to(meshes[1].material, { opacity: 1, duration: 2 }, 6);
                
                // Slow drift in 3D
                tl.to(photoGroup.position, { z: 5, duration: 5, ease: "none" }, 6); 
                tl.to(photoGroup.rotation, { y: 0.2, x: -0.1, duration: 5, ease: "none" }, 6);

                tl.to(meshes[0].material, { opacity: 0, duration: 1 }, 10);
                tl.to(meshes[1].material, { opacity: 0, duration: 1 }, 10);
            }
        }

        // 4. Reveal Personalized Message
        const msgEl = document.createElement('p');
        msgEl.className = 'message-text';
        msgEl.style.maxWidth = '800px';
        msgEl.style.textAlign = 'center';
        msgEl.style.opacity = 0;
        msgEl.style.fontSize = '2rem';
        msgEl.style.position = 'absolute';
        msgEl.textContent = data.message;
        overlay.appendChild(msgEl);

        tl.to(msgEl, { opacity: 1, duration: 2 }, 11);
        tl.to(msgEl, { opacity: 0, duration: 1 }, 16);

        // 5. Final Climax
        tl.to(camera.position, {
            z: -40,
            duration: 5,
            ease: "power3.inOut"
        }, 17);

        // Speed up and recolor particles for climax
        tl.to(material, {
            size: 0.5,
            duration: 2
        }, 17);
        tl.to(material.color, {
            r: 1, g: 0.8, b: 0.8,
            duration: 2
        }, 17);

        const finalContainer = document.createElement('div');
        finalContainer.style.textAlign = 'center';
        finalContainer.style.position = 'absolute';
        
        const finalEl = document.createElement('h1');
        finalEl.className = 'title';
        finalEl.textContent = `Wishing You the Best!`;
        finalEl.style.opacity = 0;
        finalEl.style.fontSize = '3.5rem';
        finalContainer.appendChild(finalEl);
        
        if (data.creatorName) {
            const creditEl = document.createElement('p');
            creditEl.className = 'subtitle';
            creditEl.textContent = `Created with ❤️ by ${data.creatorName}`;
            creditEl.style.opacity = 0;
            creditEl.style.marginTop = '1rem';
            finalContainer.appendChild(creditEl);
            tl.to(creditEl, { opacity: 1, duration: 2 }, 20);
        }
        
        overlay.appendChild(finalContainer);
        tl.to(finalEl, { opacity: 1, duration: 2 }, 19);
    });
}
