// Pinned Favorites Widget
class PinnedFavoritesWidget {
    constructor() {
        this.pinnedTracks = JSON.parse(localStorage.getItem('pinnedTracks') || '[]');
        this.maxPinned = 5;
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createWidget();
        this.loadPinned();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .pinned-favorites { position: fixed; left: 20px; bottom: 100px; background: linear-gradient(135deg, rgba(29, 185, 84, 0.1), rgba(29, 185, 84, 0.05)); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1rem; min-width: 240px; z-index: 995; backdrop-filter: blur(10px); }
            .pinned-title { color: var(--primary-color); font-weight: bold; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
            .pinned-item { padding: 0.6rem; background: rgba(0, 0, 0, 0.2); border-radius: 6px; margin-bottom: 0.5rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: space-between; }
            .pinned-item:hover { background: rgba(29, 185, 84, 0.2); }
            .pinned-info { flex: 1; overflow: hidden; }
            .pinned-name { font-size: 12px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .pinned-artist { font-size: 11px; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .pinned-btn { background: none; border: none; cursor: pointer; color: var(--primary-color); font-size: 14px; }
            .empty-state { text-align: center; color: var(--text-secondary); font-size: 12px; padding: 1rem; }
        `;
        document.head.appendChild(style);
    }
    
    createWidget() {
        const widget = document.createElement('div');
        widget.className = 'pinned-favorites';
        widget.id = 'pinnedFavorites';
        
        let html = '<div class="pinned-title">⭐ Quick Play</div>';
        
        if (this.pinnedTracks.length === 0) {
            html += '<div class="empty-state">No pinned tracks yet</div>';
        } else {
            this.pinnedTracks.slice(0, this.maxPinned).forEach((track, idx) => {
                html += `
                    <div class="pinned-item">
                        <div class="pinned-info">
                            <div class="pinned-name">${track.name}</div>
                            <div class="pinned-artist">${track.artist}</div>
                        </div>
                        <button class="pinned-btn" onclick="document.pinnedFaves.removePin(${idx})">✕</button>
                    </div>
                `;
            });
        }
        
        html += '<button style="width: 100%; margin-top: 0.75rem; padding: 0.5rem; background: rgba(29, 185, 84, 0.2); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 6px; color: var(--text-secondary); cursor: pointer; font-size: 12px;" onclick="document.pinnedFaves.addMockPin()">+ Add Track</button>';
        
        widget.innerHTML = html;
        document.body.appendChild(widget);
        document.pinnedFaves = this;
    }
    
    addPin(track) {
        if (this.pinnedTracks.length < this.maxPinned) {
            this.pinnedTracks.push(track);
            localStorage.setItem('pinnedTracks', JSON.stringify(this.pinnedTracks));
            this.recreateWidget();
        }
    }
    
    removePin(idx) {
        this.pinnedTracks.splice(idx, 1);
        localStorage.setItem('pinnedTracks', JSON.stringify(this.pinnedTracks));
        this.recreateWidget();
    }
    
    addMockPin() {
        const mockTracks = [
            { name: 'Summer Breeze', artist: 'The Harmonics' },
            { name: 'Midnight Thoughts', artist: 'Luna Echo' },
            { name: 'Electric Soul', artist: 'Neon Beats' },
            { name: 'Ocean Dreams', artist: 'Wave Riders' }
        ];
        const random = mockTracks[Math.floor(Math.random() * mockTracks.length)];
        this.addPin(random);
    }
    
    loadPinned() {
        if (this.pinnedTracks.length === 0) {
            this.addMockPin();
            this.addMockPin();
        }
    }
    
    recreateWidget() {
        const widget = document.getElementById('pinnedFavorites');
        if (widget) widget.remove();
        this.createWidget();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PinnedFavoritesWidget();
});
