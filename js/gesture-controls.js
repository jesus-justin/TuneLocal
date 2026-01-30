// Gesture-Based Volume and Brightness Control
class GestureBasedControls {
    constructor() {
        this.currentVolume = 0.7;
        this.currentBrightness = 1;
        this.gestureStartX = 0;
        this.gestureStartY = 0;
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createIndicators();
        this.setupGestureListeners();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .gesture-indicator { position: fixed; z-index: 10000; background: linear-gradient(135deg, var(--primary-color), rgba(29, 185, 84, 0.6)); border-radius: 8px; padding: 1rem; color: white; font-weight: bold; font-size: 14px; display: none; animation: popIn 0.3s ease; }
            .volume-indicator { top: 50%; right: 40px; transform: translateY(-50%); }
            .brightness-indicator { top: 50%; left: 40px; transform: translateY(-50%); }
            @keyframes popIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
            .gesture-bar { background: rgba(255, 255, 255, 0.3); width: 150px; height: 8px; border-radius: 4px; margin-top: 0.5rem; overflow: hidden; }
            .gesture-fill { background: white; height: 100%; border-radius: 4px; transition: width 0.1s; }
        `;
        document.head.appendChild(style);
    }
    
    createIndicators() {
        const volumeInd = document.createElement('div');
        volumeInd.className = 'gesture-indicator volume-indicator';
        volumeInd.id = 'volumeIndicator';
        volumeInd.innerHTML = `Volume<div class="gesture-bar"><div class="gesture-fill" style="width: 70%"></div></div>`;
        document.body.appendChild(volumeInd);
        
        const brightnessInd = document.createElement('div');
        brightnessInd.className = 'gesture-indicator brightness-indicator';
        brightnessInd.id = 'brightnessIndicator';
        brightnessInd.innerHTML = `Brightness<div class="gesture-bar"><div class="gesture-fill" style="width: 100%"></div></div>`;
        document.body.appendChild(brightnessInd);
    }
    
    setupGestureListeners() {
        let isGesturing = false;
        
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                isGesturing = true;
                this.gestureStartY = e.touches[0].clientY;
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length !== 2 || !isGesturing) return;
            
            const deltaY = e.touches[0].clientY - this.gestureStartY;
            
            if (Math.abs(deltaY) > 10) {
                this.currentVolume = Math.max(0, Math.min(1, this.currentVolume - deltaY * 0.01));
                this.showVolumeControl();
                this.gestureStartY = e.touches[0].clientY;
            }
        });
        
        document.addEventListener('touchend', () => {
            isGesturing = false;
            setTimeout(() => {
                document.getElementById('volumeIndicator').style.display = 'none';
                document.getElementById('brightnessIndicator').style.display = 'none';
            }, 1500);
        });
    }
    
    showVolumeControl() {
        const indicator = document.getElementById('volumeIndicator');
        indicator.style.display = 'block';
        indicator.querySelector('.gesture-fill').style.width = (this.currentVolume * 100) + '%';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GestureBasedControls();
});
