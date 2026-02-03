// Collaborative Playlists
class CollaborativePlaylists {
    constructor() {
        this.playlists = this.loadPlaylists();
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createCollaborativePanel();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .collab-panel { position: fixed; top: 250px; left: 20px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.5rem; max-width: 300px; z-index: 949; backdrop-filter: blur(10px); max-height: 500px; overflow-y: auto; }
            .collab-title { color: var(--primary-color); font-weight: bold; font-size: 14px; margin-bottom: 1rem; }
            .collab-playlist { background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 1rem; margin-bottom: 0.75rem; }
            .collab-playlist-name { color: var(--text-primary); font-weight: bold; font-size: 13px; margin-bottom: 0.5rem; }
            .collab-collaborators { display: flex; gap: 0.25rem; margin-bottom: 0.5rem; }
            .collab-avatar { width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, var(--primary-color), #4ade80); display: flex; align-items: center; justify-content: center; font-size: 10px; color: white; border: 2px solid rgba(30, 30, 30, 0.95); }
            .collab-stats { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-secondary); }
            .collab-button { background: linear-gradient(135deg, rgba(29, 185, 84, 0.1), rgba(74, 222, 128, 0.1)); border: 1px solid var(--primary-color); color: var(--primary-color); padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 12px; width: 100%; transition: all 0.2s; margin-top: 1rem; }
            .collab-button:hover { background: var(--primary-color); color: white; }
            .collab-empty { color: var(--text-secondary); font-size: 12px; text-align: center; padding: 2rem 1rem; }
        `;
        document.head.appendChild(style);
    }
    
    createCollaborativePanel() {
        const panel = document.createElement('div');
        panel.className = 'collab-panel';
        panel.innerHTML = `
            <div class="collab-title">👥 Collaborative Playlists</div>
            <div id="collabPlaylistList"></div>
            <button class="collab-button" onclick="alert('Create new collaborative playlist')">+ New Collab</button>
        `;
        document.body.appendChild(panel);
        
        this.renderPlaylists();
    }
    
    renderPlaylists() {
        const list = document.getElementById('collabPlaylistList');
        
        if (this.playlists.length === 0) {
            list.innerHTML = '<div class="collab-empty">No collaborative playlists yet<br>Create one to get started!</div>';
            return;
        }
        
        list.innerHTML = this.playlists.map(p => `
            <div class="collab-playlist">
                <div class="collab-playlist-name">${p.name}</div>
                <div class="collab-collaborators">
                    ${p.collaborators.map(c => `<div class="collab-avatar" title="${c}">${c.charAt(0).toUpperCase()}</div>`).join('')}
                </div>
                <div class="collab-stats">
                    <span>🎵 ${p.songs} songs</span>
                    <span>👥 ${p.collaborators.length} members</span>
                </div>
            </div>
        `).join('');
    }
    
    loadPlaylists() {
        const stored = localStorage.getItem('collaborativePlaylists');
        if (stored) return JSON.parse(stored);
        
        return [
            { name: 'Road Trip Vibes', collaborators: ['You', 'Alex', 'Sam'], songs: 24 },
            { name: 'Workout Playlist', collaborators: ['You', 'Jordan'], songs: 18 }
        ];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CollaborativePlaylists();
});
