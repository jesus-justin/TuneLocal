// Music Equalizer UI
class MusicEqualizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createEqualizer();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `.music-equalizer { display: flex; gap: 1rem; padding: 1.5rem; background: rgba(30, 30, 30, 0.8); border-radius: 12px; backdrop-filter: blur(10px); margin: 1rem 0; } .eq-bar { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; flex: 1; } .eq-slider { width: 30px; height: 150px; -webkit-appearance: slider-vertical; appearance: slider-vertical; writing-mode: bt-lr; background: linear-gradient(to top, rgba(29, 185, 84, 0.3), rgba(29, 185, 84, 0.8)); outline: none; border-radius: 10px; cursor: pointer; } .eq-label { font-size: 0.75rem; color: var(--text-secondary); text-align: center; min-width: 40px; font-weight: 500; }`;
        document.head.appendChild(style);
    }
    
    createEqualizer() {
        const frequencies = ['60Hz', '250Hz', '1kHz', '4kHz', '16kHz'];
        let equalizerDiv = document.querySelector('.music-equalizer');
        
        if (!equalizerDiv) {
            equalizerDiv = document.createElement('div');
            equalizerDiv.className = 'music-equalizer';
            equalizerDiv.innerHTML = frequencies.map(freq => `
                <div class="eq-bar">
                    <input type="range" class="eq-slider" min="-12" max="12" value="0">
                    <span class="eq-label">${freq}</span>
                </div>
            `).join('');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => new MusicEqualizer(), 1000);
});
