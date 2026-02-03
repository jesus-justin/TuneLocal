// Audio Quality Selector
class AudioQualitySelector {
    constructor() {
        this.currentQuality = this.loadQuality();
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createQualityWidget();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .quality-widget { position: fixed; bottom: 450px; right: 20px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.5rem; z-index: 947; backdrop-filter: blur(10px); min-width: 240px; }
            .quality-title { color: var(--text-primary); font-size: 14px; font-weight: bold; margin-bottom: 1rem; }
            .quality-options { display: flex; flex-direction: column; gap: 0.75rem; }
            .quality-option { background: rgba(0, 0, 0, 0.2); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 0.75rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: space-between; }
            .quality-option.active { border-color: var(--primary-color); background: rgba(29, 185, 84, 0.1); }
            .quality-option:hover { transform: translateX(-4px); }
            .quality-info { flex: 1; }
            .quality-name { color: var(--text-primary); font-size: 13px; font-weight: 500; margin-bottom: 0.25rem; }
            .quality-bitrate { color: var(--text-secondary); font-size: 11px; }
            .quality-check { color: var(--primary-color); font-size: 18px; }
            .quality-data { background: rgba(0, 0, 0, 0.3); padding: 0.75rem; border-radius: 6px; margin-top: 1rem; font-size: 11px; color: var(--text-secondary); }
            .quality-data-row { display: flex; justify-content: space-between; margin-bottom: 0.25rem; }
        `;
        document.head.appendChild(style);
    }
    
    createQualityWidget() {
        const widget = document.createElement('div');
        widget.className = 'quality-widget';
        widget.innerHTML = `
            <div class="quality-title">🎧 Audio Quality</div>
            
            <div class="quality-options" id="qualityOptions">
                <div class="quality-option ${this.currentQuality === 'low' ? 'active' : ''}" onclick="this.closest('.quality-widget').dispatchEvent(new CustomEvent('qualityChange', {detail: 'low', bubbles: true}))">
                    <div class="quality-info">
                        <div class="quality-name">Low</div>
                        <div class="quality-bitrate">64 kbps - Fast</div>
                    </div>
                    ${this.currentQuality === 'low' ? '<div class="quality-check">✓</div>' : ''}
                </div>
                
                <div class="quality-option ${this.currentQuality === 'normal' ? 'active' : ''}" onclick="this.closest('.quality-widget').dispatchEvent(new CustomEvent('qualityChange', {detail: 'normal', bubbles: true}))">
                    <div class="quality-info">
                        <div class="quality-name">Normal</div>
                        <div class="quality-bitrate">128 kbps - Balanced</div>
                    </div>
                    ${this.currentQuality === 'normal' ? '<div class="quality-check">✓</div>' : ''}
                </div>
                
                <div class="quality-option ${this.currentQuality === 'high' ? 'active' : ''}" onclick="this.closest('.quality-widget').dispatchEvent(new CustomEvent('qualityChange', {detail: 'high', bubbles: true}))">
                    <div class="quality-info">
                        <div class="quality-name">High</div>
                        <div class="quality-bitrate">320 kbps - Best</div>
                    </div>
                    ${this.currentQuality === 'high' ? '<div class="quality-check">✓</div>' : ''}
                </div>
                
                <div class="quality-option ${this.currentQuality === 'lossless' ? 'active' : ''}" onclick="this.closest('.quality-widget').dispatchEvent(new CustomEvent('qualityChange', {detail: 'lossless', bubbles: true}))">
                    <div class="quality-info">
                        <div class="quality-name">Lossless</div>
                        <div class="quality-bitrate">FLAC - Premium</div>
                    </div>
                    ${this.currentQuality === 'lossless' ? '<div class="quality-check">✓</div>' : ''}
                </div>
            </div>
            
            <div class="quality-data">
                <div class="quality-data-row">
                    <span>Current:</span>
                    <span>${this.currentQuality.toUpperCase()}</span>
                </div>
                <div class="quality-data-row">
                    <span>Data Used:</span>
                    <span>42 MB (Today)</span>
                </div>
                <div class="quality-data-row">
                    <span>Wifi Required:</span>
                    <span id="wifiReq">Off</span>
                </div>
            </div>
        `;
        document.body.appendChild(widget);
        
        this.attachQualityListener();
    }
    
    attachQualityListener() {
        const widget = document.querySelector('.quality-widget');
        widget.addEventListener('qualityChange', (e) => {
            this.setQuality(e.detail);
        });
    }
    
    setQuality(quality) {
        this.currentQuality = quality;
        this.saveQuality();
        
        // Refresh the widget
        const widget = document.querySelector('.quality-widget');
        widget.remove();
        this.createQualityWidget();
    }
    
    loadQuality() {
        const stored = localStorage.getItem('audioQuality');
        return stored || 'normal';
    }
    
    saveQuality() {
        localStorage.setItem('audioQuality', this.currentQuality);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AudioQualitySelector();
});
