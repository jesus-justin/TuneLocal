// Notification Audio Cues System
class NotificationAudioCues {
    constructor() {
        this.audioContext = null;
        this.soundEnabled = localStorage.getItem('soundCuesEnabled') !== 'false';
        this.init();
    }
    
    init() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.addStyles();
        this.createToggle();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .audio-cues-toggle { position: fixed; top: 80px; left: 20px; width: 45px; height: 45px; background: linear-gradient(135deg, var(--primary-color), rgba(29, 185, 84, 0.6)); border: 2px solid var(--primary-color); border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 995; font-size: 18px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(29, 185, 84, 0.3); }
            .audio-cues-toggle:hover { transform: scale(1.1); }
            .audio-cues-toggle.disabled { opacity: 0.5; }
        `;
        document.head.appendChild(style);
    }
    
    createToggle() {
        const btn = document.createElement('button');
        btn.className = 'audio-cues-toggle';
        if (!this.soundEnabled) btn.classList.add('disabled');
        btn.innerHTML = this.soundEnabled ? '🔊' : '🔇';
        btn.id = 'audioCuesToggle';
        btn.title = 'Toggle Audio Cues';
        document.body.appendChild(btn);
        
        btn.addEventListener('click', () => {
            this.soundEnabled = !this.soundEnabled;
            localStorage.setItem('soundCuesEnabled', this.soundEnabled);
            btn.innerHTML = this.soundEnabled ? '🔊' : '🔇';
            btn.classList.toggle('disabled');
        });
        
        document.audioCues = this;
    }
    
    playNotificationSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const time = this.audioContext.currentTime;
        
        // Play ascending notes
        [800, 1000, 1200].forEach((freq, idx) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.3, time + idx * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, time + idx * 0.1 + 0.1);
            
            osc.start(time + idx * 0.1);
            osc.stop(time + idx * 0.1 + 0.1);
        });
    }
    
    playSuccessSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const time = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.frequency.setValueAtTime(1200, time);
        osc.frequency.exponentialRampToValueAtTime(1600, time + 0.2);
        
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
        
        osc.start(time);
        osc.stop(time + 0.2);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        new NotificationAudioCues();
    } catch (e) {
        // Audio context not supported
    }
});
