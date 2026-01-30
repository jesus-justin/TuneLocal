// UI Sound Effects System
class UISoundEffects {
    constructor() {
        this.audioContext = null;
        this.masterVolume = 0.3;
        this.init();
    }
    
    init() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.setupListeners();
    }
    
    playSound(frequency, duration, type = 'sine') {
        try {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.type = type;
            osc.frequency.value = frequency;
            
            gain.gain.setValueAtTime(this.masterVolume, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            osc.start(this.audioContext.currentTime);
            osc.stop(this.audioContext.currentTime + duration);
        } catch (e) {
            // Audio context may not be available
        }
    }
    
    playClickSound() {
        this.playSound(800, 0.05);
    }
    
    playSuccessSound() {
        this.playSound(600, 0.1);
        setTimeout(() => this.playSound(800, 0.1), 75);
    }
    
    playHoverSound() {
        this.playSound(600, 0.03);
    }
    
    setupListeners() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button, a')) {
                this.playClickSound();
            }
        });
        
        document.addEventListener('mouseover', (e) => {
            const target = e.target;
            if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button, a')) {
                this.playHoverSound();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        new UISoundEffects();
    } catch (e) {
        // Audio context not supported
    }
});
