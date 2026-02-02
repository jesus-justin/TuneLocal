// Crossfade Track Transitions
class CrossfadeTransitions {
    constructor() {
        this.fadeDuration = 3000; // 3 seconds
        this.enabled = localStorage.getItem('crossfadeEnabled') !== 'false';
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createControls();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .crossfade-control { position: fixed; top: 140px; right: 20px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1rem; z-index: 994; backdrop-filter: blur(10px); min-width: 200px; }
            .crossfade-title { color: var(--primary-color); font-weight: bold; margin-bottom: 0.75rem; font-size: 13px; }
            .crossfade-toggle { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
            .crossfade-label { color: var(--text-secondary); font-size: 12px; }
            .toggle-switch { position: relative; width: 50px; height: 26px; background: rgba(0, 0, 0, 0.3); border-radius: 13px; cursor: pointer; transition: background 0.3s; }
            .toggle-switch.active { background: var(--primary-color); }
            .toggle-slider { position: absolute; width: 22px; height: 22px; background: white; border-radius: 50%; top: 2px; left: 2px; transition: transform 0.3s; }
            .toggle-switch.active .toggle-slider { transform: translateX(24px); }
            .crossfade-slider { width: 100%; margin-top: 0.5rem; }
            .crossfade-value { color: var(--primary-color); font-size: 12px; text-align: center; margin-top: 0.5rem; }
        `;
        document.head.appendChild(style);
    }
    
    createControls() {
        const control = document.createElement('div');
        control.className = 'crossfade-control';
        control.id = 'crossfadeControl';
        control.innerHTML = `
            <div class="crossfade-title">🎚️ Crossfade</div>
            <div class="crossfade-toggle">
                <span class="crossfade-label">Enable</span>
                <div class="toggle-switch ${this.enabled ? 'active' : ''}" onclick="document.crossfadeManager.toggle()">
                    <div class="toggle-slider"></div>
                </div>
            </div>
            <div>
                <label class="crossfade-label">Duration</label>
                <input type="range" class="crossfade-slider" min="1" max="10" value="${this.fadeDuration / 1000}" oninput="document.crossfadeManager.setDuration(this.value)">
                <div class="crossfade-value">${this.fadeDuration / 1000}s</div>
            </div>
        `;
        document.body.appendChild(control);
        document.crossfadeManager = this;
    }
    
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('crossfadeEnabled', this.enabled);
        document.querySelector('.toggle-switch').classList.toggle('active');
    }
    
    setDuration(seconds) {
        this.fadeDuration = seconds * 1000;
        document.querySelector('.crossfade-value').textContent = seconds + 's';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CrossfadeTransitions();
});
