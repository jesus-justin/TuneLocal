// Volume Normalizer
class VolumeNormalizer {
    constructor() {
        this.isEnabled = this.loadState();
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createNormalizerToggle();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .normalizer-widget { position: fixed; bottom: 320px; right: 20px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.5rem; z-index: 987; backdrop-filter: blur(10px); min-width: 240px; }
            .normalizer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
            .normalizer-title { color: var(--text-primary); font-size: 14px; font-weight: bold; }
            .normalizer-toggle { position: relative; width: 50px; height: 26px; }
            .normalizer-toggle input { opacity: 0; width: 0; height: 0; }
            .normalizer-slider { position: absolute; cursor: pointer; inset: 0; background: rgba(0, 0, 0, 0.3); border-radius: 26px; transition: 0.3s; border: 1px solid rgba(255, 255, 255, 0.1); }
            .normalizer-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 4px; bottom: 3px; background: #888; border-radius: 50%; transition: 0.3s; }
            .normalizer-toggle input:checked + .normalizer-slider { background: var(--primary-color); border-color: var(--primary-color); }
            .normalizer-toggle input:checked + .normalizer-slider:before { transform: translateX(24px); background: white; }
            .normalizer-info { color: var(--text-secondary); font-size: 12px; line-height: 1.5; margin-bottom: 1rem; }
            .normalizer-level { margin-bottom: 0.75rem; }
            .normalizer-level-label { color: var(--text-primary); font-size: 12px; margin-bottom: 0.25rem; }
            .normalizer-level-bar { background: rgba(0, 0, 0, 0.3); height: 6px; border-radius: 3px; overflow: hidden; }
            .normalizer-level-fill { background: linear-gradient(90deg, var(--primary-color), #4ade80); height: 100%; transition: width 0.3s; border-radius: 3px; }
            .normalizer-status { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; background: rgba(0, 0, 0, 0.2); border-radius: 8px; }
            .normalizer-indicator { width: 8px; height: 8px; border-radius: 50%; background: #888; animation: pulse 2s infinite; }
            .normalizer-indicator.active { background: var(--primary-color); }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
            .normalizer-text { color: var(--text-secondary); font-size: 12px; }
        `;
        document.head.appendChild(style);
    }
    
    createNormalizerToggle() {
        const widget = document.createElement('div');
        widget.className = 'normalizer-widget';
        widget.innerHTML = `
            <div class="normalizer-header">
                <span class="normalizer-title">🔊 Volume Normalizer</span>
                <label class="normalizer-toggle">
                    <input type="checkbox" id="normalizerToggle" ${this.isEnabled ? 'checked' : ''}>
                    <span class="normalizer-slider"></span>
                </label>
            </div>
            
            <div class="normalizer-info">
                Automatically balances volume levels across tracks for consistent playback.
            </div>
            
            <div class="normalizer-level">
                <div class="normalizer-level-label">Target Level: -14 LUFS</div>
                <div class="normalizer-level-bar">
                    <div class="normalizer-level-fill" style="width: 70%"></div>
                </div>
            </div>
            
            <div class="normalizer-level">
                <div class="normalizer-level-label">Current Track: -12 LUFS</div>
                <div class="normalizer-level-bar">
                    <div class="normalizer-level-fill" style="width: 85%"></div>
                </div>
            </div>
            
            <div class="normalizer-status">
                <div class="normalizer-indicator ${this.isEnabled ? 'active' : ''}" id="normalizerIndicator"></div>
                <span class="normalizer-text" id="normalizerStatus">${this.isEnabled ? 'Active - Normalizing audio' : 'Inactive'}</span>
            </div>
        `;
        document.body.appendChild(widget);
        
        this.attachToggleListener();
    }
    
    attachToggleListener() {
        const toggle = document.getElementById('normalizerToggle');
        toggle.addEventListener('change', () => {
            this.isEnabled = toggle.checked;
            this.saveState();
            this.updateUI();
        });
    }
    
    updateUI() {
        const indicator = document.getElementById('normalizerIndicator');
        const status = document.getElementById('normalizerStatus');
        
        if (this.isEnabled) {
            indicator.classList.add('active');
            status.textContent = 'Active - Normalizing audio';
        } else {
            indicator.classList.remove('active');
            status.textContent = 'Inactive';
        }
    }
    
    loadState() {
        const stored = localStorage.getItem('volumeNormalizerEnabled');
        return stored === 'true';
    }
    
    saveState() {
        localStorage.setItem('volumeNormalizerEnabled', this.isEnabled);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VolumeNormalizer();
});
