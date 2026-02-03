// Playback Speed Controller
class PlaybackSpeedController {
    constructor() {
        this.speed = this.loadSpeed();
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createSpeedWidget();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .speed-widget { position: fixed; bottom: 550px; right: 20px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.5rem; z-index: 945; backdrop-filter: blur(10px); min-width: 250px; }
            .speed-title { color: var(--text-primary); font-size: 14px; font-weight: bold; margin-bottom: 1rem; }
            .speed-display { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; background: rgba(0, 0, 0, 0.2); padding: 1rem; border-radius: 8px; }
            .speed-value { color: var(--primary-color); font-size: 24px; font-weight: bold; }
            .speed-label { color: var(--text-secondary); font-size: 11px; }
            .speed-controls { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
            .speed-btn { background: rgba(29, 185, 84, 0.1); border: 1px solid var(--primary-color); color: var(--primary-color); padding: 0.5rem 0.75rem; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold; transition: all 0.2s; flex: 1; }
            .speed-btn:hover { background: var(--primary-color); color: white; }
            .speed-slider-container { margin-bottom: 1rem; }
            .speed-slider { width: 100%; height: 6px; border-radius: 3px; background: rgba(0, 0, 0, 0.3); outline: none; -webkit-appearance: none; appearance: none; }
            .speed-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--primary-color); cursor: pointer; }
            .speed-slider::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: var(--primary-color); cursor: pointer; border: none; }
            .speed-presets { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; }
            .speed-preset { background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); color: var(--text-primary); padding: 0.5rem; border-radius: 6px; cursor: pointer; font-size: 11px; text-align: center; transition: all 0.2s; }
            .speed-preset.active { background: var(--primary-color); color: white; border-color: var(--primary-color); }
            .speed-preset:hover { border-color: var(--primary-color); }
        `;
        document.head.appendChild(style);
    }
    
    createSpeedWidget() {
        const widget = document.createElement('div');
        widget.className = 'speed-widget';
        widget.innerHTML = `
            <div class="speed-title">⏱️ Playback Speed</div>
            
            <div class="speed-display">
                <div>
                    <div class="speed-value" id="speedValue">${this.speed}x</div>
                    <div class="speed-label">Current Speed</div>
                </div>
            </div>
            
            <div class="speed-controls">
                <button class="speed-btn" onclick="this.closest('.speed-widget').dispatchEvent(new CustomEvent('speedChange', {detail: Math.max(0.5, ${this.speed} - 0.25), bubbles: true}))">− Slow</button>
                <button class="speed-btn" onclick="this.closest('.speed-widget').dispatchEvent(new CustomEvent('speedChange', {detail: 1.0, bubbles: true}))">Reset</button>
                <button class="speed-btn" onclick="this.closest('.speed-widget').dispatchEvent(new CustomEvent('speedChange', {detail: Math.min(2.0, ${this.speed} + 0.25), bubbles: true}))">Fast +</button>
            </div>
            
            <div class="speed-slider-container">
                <input type="range" class="speed-slider" min="0.5" max="2.0" step="0.25" value="${this.speed}" id="speedSlider" oninput="this.closest('.speed-widget').dispatchEvent(new CustomEvent('speedChange', {detail: parseFloat(this.value), bubbles: true}))">
            </div>
            
            <div class="speed-presets">
                <div class="speed-preset ${this.speed === 0.5 ? 'active' : ''}" onclick="this.closest('.speed-widget').dispatchEvent(new CustomEvent('speedChange', {detail: 0.5, bubbles: true}))">0.5x</div>
                <div class="speed-preset ${this.speed === 0.75 ? 'active' : ''}" onclick="this.closest('.speed-widget').dispatchEvent(new CustomEvent('speedChange', {detail: 0.75, bubbles: true}))">0.75x</div>
                <div class="speed-preset ${this.speed === 1.0 ? 'active' : ''}" onclick="this.closest('.speed-widget').dispatchEvent(new CustomEvent('speedChange', {detail: 1.0, bubbles: true}))">Normal</div>
                <div class="speed-preset ${this.speed === 1.25 ? 'active' : ''}" onclick="this.closest('.speed-widget').dispatchEvent(new CustomEvent('speedChange', {detail: 1.25, bubbles: true}))">1.25x</div>
                <div class="speed-preset ${this.speed === 1.5 ? 'active' : ''}" onclick="this.closest('.speed-widget').dispatchEvent(new CustomEvent('speedChange', {detail: 1.5, bubbles: true}))">1.5x</div>
                <div class="speed-preset ${this.speed === 1.75 ? 'active' : ''}" onclick="this.closest('.speed-widget').dispatchEvent(new CustomEvent('speedChange', {detail: 1.75, bubbles: true}))">1.75x</div>
                <div class="speed-preset ${this.speed === 2.0 ? 'active' : ''}" onclick="this.closest('.speed-widget').dispatchEvent(new CustomEvent('speedChange', {detail: 2.0, bubbles: true}))">2x</div>
            </div>
        `;
        document.body.appendChild(widget);
        
        this.attachSpeedListener();
    }
    
    attachSpeedListener() {
        const widget = document.querySelector('.speed-widget');
        widget.addEventListener('speedChange', (e) => {
            this.setSpeed(e.detail);
        });
    }
    
    setSpeed(newSpeed) {
        this.speed = parseFloat(newSpeed).toFixed(2);
        this.saveSpeed();
        
        document.getElementById('speedValue').textContent = this.speed + 'x';
        document.getElementById('speedSlider').value = this.speed;
        
        // Update active preset
        document.querySelectorAll('.speed-preset').forEach(p => {
            p.classList.remove('active');
        });
        document.querySelectorAll('.speed-preset').forEach(p => {
            if (p.textContent.includes(this.speed.toString())) {
                p.classList.add('active');
            }
        });
    }
    
    loadSpeed() {
        const stored = localStorage.getItem('playbackSpeed');
        return stored || 1.0;
    }
    
    saveSpeed() {
        localStorage.setItem('playbackSpeed', this.speed);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PlaybackSpeedController();
});
