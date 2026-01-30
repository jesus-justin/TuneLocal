// Playlist Quick Preview on Hover
class PlaylistQuickPreview {
    constructor() {
        this.previewBox = null;
        this.currentHover = null;
        this.init();
    }
    
    init() {
        this.addStyles();
        this.setupListeners();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .playlist-preview-container { position: fixed; background: linear-gradient(135deg, rgba(29, 185, 84, 0.15), rgba(29, 185, 84, 0.05)); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1rem; min-width: 280px; max-width: 350px; color: var(--text-primary); z-index: 10000; box-shadow: 0 8px 32px rgba(29, 185, 84, 0.2); backdrop-filter: blur(10px); }
            .preview-title { font-weight: bold; font-size: 14px; color: var(--primary-color); margin-bottom: 0.75rem; }
            .preview-item { padding: 0.5rem; background: rgba(0, 0, 0, 0.3); border-radius: 6px; margin-bottom: 0.5rem; font-size: 12px; animation: slideIn 0.3s ease; }
            .preview-count { color: var(--text-secondary); font-size: 11px; margin-top: 0.75rem; }
            @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        `;
        document.head.appendChild(style);
    }
    
    setupListeners() {
        document.addEventListener('mouseover', (e) => {
            const playlistEl = e.target.closest('[data-playlist-id]');
            if (playlistEl && playlistEl !== this.currentHover) {
                this.showPreview(playlistEl, e);
                this.currentHover = playlistEl;
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.playlist-preview-container')) return;
            if (this.previewBox) {
                this.previewBox.remove();
                this.previewBox = null;
                this.currentHover = null;
            }
        });
    }
    
    showPreview(element, event) {
        if (this.previewBox) this.previewBox.remove();
        
        const playlistId = element.dataset.playlistId;
        const playlistName = element.textContent.trim();
        const mockTracks = ['Track 1', 'Track 2', 'Track 3', 'Track 4', 'Track 5'];
        
        this.previewBox = document.createElement('div');
        this.previewBox.className = 'playlist-preview-container';
        
        const tracksHtml = mockTracks.map(t => `<div class="preview-item">♪ ${t}</div>`).join('');
        this.previewBox.innerHTML = `
            <div class="preview-title">${playlistName}</div>
            ${tracksHtml}
            <div class="preview-count">${mockTracks.length} tracks</div>
        `;
        
        document.body.appendChild(this.previewBox);
        
        const rect = element.getBoundingClientRect();
        this.previewBox.style.left = (rect.right + 10) + 'px';
        this.previewBox.style.top = rect.top + 'px';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PlaylistQuickPreview();
});
