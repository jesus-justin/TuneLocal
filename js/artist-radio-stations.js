// Artist Radio Stations
class ArtistRadioStations {
    constructor() {
        this.stations = this.loadStations();
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createRadioPanel();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .radio-panel { position: fixed; top: 600px; left: 20px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.5rem; max-width: 300px; z-index: 943; backdrop-filter: blur(10px); max-height: 400px; overflow-y: auto; }
            .radio-title { color: var(--primary-color); font-weight: bold; font-size: 14px; margin-bottom: 1rem; }
            .radio-station { background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 0.75rem; margin-bottom: 0.75rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.75rem; }
            .radio-station:hover { transform: translateX(-4px); background: rgba(29, 185, 84, 0.05); border: 1px solid var(--primary-color); }
            .radio-icon { font-size: 24px; }
            .radio-info { flex: 1; }
            .radio-artist { color: var(--text-primary); font-size: 12px; font-weight: 500; margin-bottom: 0.25rem; }
            .radio-status { color: var(--text-secondary); font-size: 10px; }
            .radio-play-btn { background: var(--primary-color); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
            .radio-play-btn:hover { transform: scale(1.1); }
            .radio-add { background: linear-gradient(135deg, rgba(29, 185, 84, 0.1), rgba(74, 222, 128, 0.1)); border: 1px solid var(--primary-color); color: var(--primary-color); padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 12px; width: 100%; transition: all 0.2s; margin-top: 1rem; }
            .radio-add:hover { background: var(--primary-color); color: white; }
        `;
        document.head.appendChild(style);
    }
    
    createRadioPanel() {
        const panel = document.createElement('div');
        panel.className = 'radio-panel';
        panel.innerHTML = `
            <div class="radio-title">📻 Artist Radio</div>
            <div id="radioStationList"></div>
            <button class="radio-add" onclick="alert('Search for an artist to create radio')">+ Create Station</button>
        `;
        document.body.appendChild(panel);
        
        this.renderStations();
    }
    
    renderStations() {
        const list = document.getElementById('radioStationList');
        list.innerHTML = this.stations.map((station, idx) => `
            <div class="radio-station">
                <div class="radio-icon">${station.icon}</div>
                <div class="radio-info">
                    <div class="radio-artist">${station.name}</div>
                    <div class="radio-status">${station.status}</div>
                </div>
                <button class="radio-play-btn" title="Play">▶</button>
            </div>
        `).join('');
    }
    
    loadStations() {
        return [
            { name: 'The Weeknd Radio', icon: '🎤', status: 'Similar artists' },
            { name: 'Drake Radio', icon: '🎵', status: '48 similar tracks' },
            { name: 'Ariana Grande Radio', icon: '⭐', status: 'Curated playlist' },
            { name: 'Bad Bunny Radio', icon: '🎸', status: '35 recommendations' },
            { name: 'Taylor Swift Radio', icon: '💿', status: 'Genre mix' }
        ];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ArtistRadioStations();
});
