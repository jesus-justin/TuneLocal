// Now Playing Overlay
class NowPlayingOverlay {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createOverlay();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .now-playing-overlay { position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, rgba(29, 185, 84, 0.15), rgba(29, 185, 84, 0.05)); border: 2px solid var(--primary-color); border-radius: 12px; padding: 1.5rem; min-width: 300px; z-index: 997; backdrop-filter: blur(10px); animation: slideIn 0.5s ease; }
            .np-header { color: var(--text-secondary); font-size: 11px; font-weight: bold; margin-bottom: 0.5rem; letter-spacing: 1px; }
            .np-title { color: var(--primary-color); font-size: 18px; font-weight: bold; margin-bottom: 0.5rem; }
            .np-artist { color: var(--text-secondary); font-size: 13px; margin-bottom: 1rem; }
            .np-progress { background: rgba(0, 0, 0, 0.3); height: 3px; border-radius: 2px; margin-bottom: 0.5rem; overflow: hidden; }
            .np-progress-fill { background: linear-gradient(90deg, var(--primary-color), rgba(29, 185, 84, 0.7)); height: 100%; width: 45%; border-radius: 2px; animation: widthPulse 3s ease-in-out infinite; }
            .np-time { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-secondary); }
            .np-controls { display: flex; gap: 0.75rem; margin-top: 1rem; }
            .np-btn { background: rgba(29, 185, 84, 0.2); border: 1px solid var(--primary-color); color: var(--primary-color); padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 12px; transition: all 0.2s; }
            .np-btn:hover { background: rgba(29, 185, 84, 0.3); }
            @keyframes slideIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes widthPulse { 0%, 100% { width: 45%; } 50% { width: 55%; } }
        `;
        document.head.appendChild(style);
    }
    
    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'now-playing-overlay';
        overlay.id = 'nowPlayingOverlay';
        overlay.innerHTML = `
            <div class="np-header">NOW PLAYING</div>
            <div class="np-title">Summer Vibes</div>
            <div class="np-artist">by The Music Collective</div>
            <div class="np-progress">
                <div class="np-progress-fill"></div>
            </div>
            <div class="np-time">
                <span>2:15</span>
                <span>5:00</span>
            </div>
            <div class="np-controls">
                <button class="np-btn">← Prev</button>
                <button class="np-btn">⏸ Pause</button>
                <button class="np-btn">Next →</button>
            </div>
        `;
        document.body.appendChild(overlay);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NowPlayingOverlay();
});
