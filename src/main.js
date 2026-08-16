import { StorageService } from './services/StorageService.js';
import { initCreatorFlow } from './ui/CreatorUI.js';
import { initCinematicExperience } from './3d/CinematicExperience.js';

async function bootstrap() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        // We are in Recipient Mode
        const landingScreen = document.getElementById('landing-screen');
        if (landingScreen) {
            landingScreen.classList.remove('active');
            landingScreen.style.display = 'none';
        }
        
        try {
            const data = await StorageService.loadSurprise(id);
            if (data) {
                initCinematicExperience(data);
            } else {
                alert("Surprise not found! The link might be invalid.");
                window.location.search = ''; // reset
            }
        } catch (e) {
            console.error("Failed to load surprise", e);
            alert("Error loading the surprise.");
        }
    } else {
        // We are in Creator Mode
        initCreatorFlow();
    }
}

document.addEventListener('DOMContentLoaded', bootstrap);
