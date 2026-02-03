// Automatic Playlist Generation
class AutoPlaylistGenerator {
    constructor() {
        this.generatedPlaylists = this.loadPlaylists();
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createGeneratorPanel();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .autogen-panel { position: fixed; top: 350px; left: 340px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.5rem; max-width: 300px; z-index: 941; backdrop-filter: blur(10px); max-height: 500px; overflow-y: auto; }
            .autogen-title { color: var(--primary-color); font-weight: bold; font-size: 14px; margin-bottom: 1rem; }
            .autogen-playlist { background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 0.75rem; margin-bottom: 0.75rem; cursor: pointer; transition: all 0.2s; }
            .autogen-playlist:hover { transform: translateY(-2px); background: rgba(29, 185, 84, 0.05); border: 1px solid var(--primary-color); }
            .autogen-name { color: var(--text-primary); font-size: 12px; font-weight: 500; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }
            .autogen-icon { font-size: 16px; }
            .autogen-info { display: flex; justify-content: space-between; font-size: 10px; color: var(--text-secondary); margin-bottom: 0.5rem; }
            .autogen-actions { display: flex; gap: 0.5rem; }
            .autogen-btn { background: rgba(29, 185, 84, 0.1); border: 1px solid var(--primary-color); color: var(--primary-color); padding: 0.35rem 0.75rem; border-radius: 4px; font-size: 10px; cursor: pointer; flex: 1; transition: all 0.2s; }
            .autogen-btn:hover { background: var(--primary-color); color: white; }
            .autogen-generator { background: rgba(0, 0, 0, 0.3); padding: 1rem; border-radius: 8px; margin-top: 1rem; }
            .autogen-label { color: var(--text-primary); font-size: 12px; margin-bottom: 0.5rem; }
            .autogen-select { width: 100%; padding: 0.5rem; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 6px; color: var(--text-primary); font-size: 11px; margin-bottom: 0.75rem; }
            .autogen-generate-btn { background: var(--primary-color); border: none; color: white; padding: 0.5rem; border-radius: 6px; font-size: 12px; cursor: pointer; width: 100%; transition: all 0.2s; }
            .autogen-generate-btn:hover { transform: scale(1.02); box-shadow: 0 4px 12px rgba(29, 185, 84, 0.4); }
        `;
        document.head.appendChild(style);
    }
    
    createGeneratorPanel() {
        const panel = document.createElement('div');
        panel.className = 'autogen-panel';
        panel.innerHTML = `
            <div class="autogen-title">✨ Auto Playlists</div>
            <div id="autogenList"></div>
            
            <div class="autogen-generator">
                <div class="autogen-label">Generate New Playlist</div>
                <select class="autogen-select" id="moodSelect">
                    <option>Select mood...</option>
                    <option>Happy</option>
                    <option>Energetic</option>
                    <option>Chill</option>
                    <option>Focused</option>
                    <option>Workout</option>
                </select>
                <button class="autogen-generate-btn" onclick="alert('Generating playlist based on your preferences...')">🔄 Generate</button>
            </div>
        `;
        document.body.appendChild(panel);
        
        this.renderPlaylists();
    }
    
    renderPlaylists() {
        const list = document.getElementById('autogenList');
        list.innerHTML = this.generatedPlaylists.map(p => `
            <div class="autogen-playlist">
                <div class="autogen-name">
                    <span class="autogen-icon">${p.icon}</span>
                    <span>${p.name}</span>
                </div>
                <div class="autogen-info">
                    <span>🎵 ${p.songs} songs</span>
                    <span>⏱️ ${p.duration}</span>
                </div>
                <div class="autogen-actions">
                    <button class="autogen-btn">▶ Play</button>
                    <button class="autogen-btn">💾 Save</button>
                </div>
            </div>
        `).join('');
    }
    
    loadPlaylists() {
        return [
            { name: 'Focus Session', icon: '🧠', songs: 32, duration: '2h 15m' },
            { name: 'Morning Energy', icon: '☀️', songs: 24, duration: '1h 45m' },
            { name: 'Evening Chill', icon: '🌙', songs: 28, duration: '2h 30m' },
            { name: 'Workout Pump', icon: '💪', songs: 36, duration: '2h' },
            { name: 'Coffee Time', icon: '☕', songs: 20, duration: '1h 30m' }
        ];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AutoPlaylistGenerator();
});
