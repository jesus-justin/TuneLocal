// Music Podcast Integration
class MusicPodcastIntegration {
    constructor() {
        this.podcasts = this.loadPodcasts();
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createPodcastPanel();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .podcast-panel { position: fixed; top: 600px; left: 320px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.5rem; max-width: 300px; z-index: 942; backdrop-filter: blur(10px); max-height: 400px; overflow-y: auto; }
            .podcast-title { color: var(--primary-color); font-weight: bold; font-size: 14px; margin-bottom: 1rem; }
            .podcast-item { background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 0.75rem; margin-bottom: 0.75rem; cursor: pointer; transition: all 0.2s; }
            .podcast-item:hover { transform: translateY(-2px); background: rgba(29, 185, 84, 0.05); }
            .podcast-cover { width: 100%; height: 140px; background: linear-gradient(135deg, var(--primary-color), #4ade80); border-radius: 6px; margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: center; font-size: 48px; }
            .podcast-name { color: var(--text-primary); font-size: 12px; font-weight: 500; margin-bottom: 0.25rem; }
            .podcast-host { color: var(--text-secondary); font-size: 10px; margin-bottom: 0.5rem; }
            .podcast-progress { display: flex; align-items: center; gap: 0.5rem; }
            .podcast-progress-bar { flex: 1; height: 4px; background: rgba(0, 0, 0, 0.3); border-radius: 2px; overflow: hidden; }
            .podcast-progress-fill { height: 100%; background: var(--primary-color); width: 35%; }
            .podcast-time { color: var(--text-secondary); font-size: 9px; }
            .podcast-actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
            .podcast-btn { background: rgba(29, 185, 84, 0.1); border: 1px solid var(--primary-color); color: var(--primary-color); padding: 0.35rem 0.75rem; border-radius: 4px; font-size: 10px; cursor: pointer; flex: 1; transition: all 0.2s; }
            .podcast-btn:hover { background: var(--primary-color); color: white; }
            .podcast-add { background: linear-gradient(135deg, rgba(29, 185, 84, 0.1), rgba(74, 222, 128, 0.1)); border: 1px solid var(--primary-color); color: var(--primary-color); padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 12px; width: 100%; transition: all 0.2s; margin-top: 1rem; }
            .podcast-add:hover { background: var(--primary-color); color: white; }
        `;
        document.head.appendChild(style);
    }
    
    createPodcastPanel() {
        const panel = document.createElement('div');
        panel.className = 'podcast-panel';
        panel.innerHTML = `
            <div class="podcast-title">🎙️ My Podcasts</div>
            <div id="podcastList"></div>
            <button class="podcast-add" onclick="alert('Subscribe to podcasts')">+ Subscribe</button>
        `;
        document.body.appendChild(panel);
        
        this.renderPodcasts();
    }
    
    renderPodcasts() {
        const list = document.getElementById('podcastList');
        list.innerHTML = this.podcasts.map(p => `
            <div class="podcast-item">
                <div class="podcast-cover">${p.icon}</div>
                <div class="podcast-name">${p.name}</div>
                <div class="podcast-host">Host: ${p.host}</div>
                <div class="podcast-progress">
                    <div class="podcast-progress-bar">
                        <div class="podcast-progress-fill"></div>
                    </div>
                    <span class="podcast-time">${p.time}</span>
                </div>
                <div class="podcast-actions">
                    <button class="podcast-btn">▶ Play</button>
                    <button class="podcast-btn">...Save</button>
                </div>
            </div>
        `).join('');
    }
    
    loadPodcasts() {
        return [
            { name: 'Music Talk Daily', host: 'Alex', icon: '🎙️', time: '0:42' },
            { name: 'Behind the Beat', host: 'Jordan', icon: '🎵', time: '1:25' },
            { name: 'Artist Stories', host: 'Sam', icon: '⭐', time: '2:10' }
        ];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MusicPodcastIntegration();
});
