// Music Discovery Feed
class MusicDiscoveryFeed {
    constructor() {
        this.feed = this.generateFeed();
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createFeedPanel();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .discovery-panel { position: fixed; top: 100px; left: 340px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.5rem; max-width: 320px; z-index: 948; backdrop-filter: blur(10px); max-height: 600px; overflow-y: auto; }
            .discovery-title { color: var(--primary-color); font-weight: bold; font-size: 14px; margin-bottom: 1rem; }
            .discovery-item { background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 0.75rem; margin-bottom: 0.75rem; transition: all 0.2s; }
            .discovery-item:hover { transform: translateX(-4px); background: rgba(29, 185, 84, 0.05); border: 1px solid var(--primary-color); }
            .discovery-tag { background: var(--primary-color); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 9px; }
            .discovery-track { color: var(--text-primary); font-size: 12px; font-weight: 500; margin-bottom: 0.25rem; }
            .discovery-artist { color: var(--text-secondary); font-size: 11px; margin-bottom: 0.5rem; }
            .discovery-action { display: flex; gap: 0.5rem; }
            .discovery-btn { background: rgba(29, 185, 84, 0.1); border: 1px solid var(--primary-color); color: var(--primary-color); padding: 0.35rem 0.75rem; border-radius: 4px; font-size: 10px; cursor: pointer; flex: 1; transition: all 0.2s; }
            .discovery-btn:hover { background: var(--primary-color); color: white; }
        `;
        document.head.appendChild(style);
    }
    
    createFeedPanel() {
        const panel = document.createElement('div');
        panel.className = 'discovery-panel';
        panel.innerHTML = `
            <div class="discovery-title">🌟 Discover New Music</div>
            <div id="discoveryFeed"></div>
        `;
        document.body.appendChild(panel);
        
        this.renderFeed();
    }
    
    generateFeed() {
        return [
            { track: 'Neon Dreams', artist: 'Synthwave Collective', tag: 'Trending', type: '⭐' },
            { track: 'Midnight Jazz', artist: 'Luna Studios', tag: 'New Release', type: '🆕' },
            { track: 'Electric Paradise', artist: 'Future Sound', tag: 'Recommended', type: '💡' },
            { track: 'Golden Hour', artist: 'Indie Wave', tag: 'Popular', type: '🔥' },
            { track: 'Cosmic Echo', artist: 'Space Beats', tag: 'Trending', type: '⭐' },
            { track: 'Summer Breeze', artist: 'Feel Good Music', tag: 'Playlist', type: '🎵' }
        ];
    }
    
    renderFeed() {
        const feed = document.getElementById('discoveryFeed');
        feed.innerHTML = this.feed.map(item => `
            <div class="discovery-item">
                <div style="margin-bottom: 0.5rem;">
                    <span class="discovery-tag" style="margin-right: 0.5rem;">${item.type}</span>
                    <span class="discovery-tag">${item.tag}</span>
                </div>
                <div class="discovery-track">${item.track}</div>
                <div class="discovery-artist">by ${item.artist}</div>
                <div class="discovery-action">
                    <button class="discovery-btn">▶ Play</button>
                    <button class="discovery-btn">♥ Like</button>
                </div>
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MusicDiscoveryFeed();
});
