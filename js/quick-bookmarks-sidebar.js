// Quick Bookmarks Sidebar
class QuickBookmarksSidebar {
    constructor() {
        this.bookmarks = [
            { name: 'Favorites', icon: '❤️', section: 'saved-songs' },
            { name: 'Recently Played', icon: '⏱️', section: 'home' },
            { name: 'Playlists', icon: '📋', section: 'playlists' },
            { name: 'Offline Music', icon: '📱', section: 'offline-music' },
            { name: 'Spotify', icon: '🎵', section: 'spotify' },
            { name: 'YouTube', icon: '▶️', section: 'youtube' }
        ];
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createSidebar();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .quick-bookmarks-sidebar { position: fixed; right: -120px; top: 150px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px 0 0 12px; padding: 1rem 0.75rem; z-index: 994; transition: right 0.3s ease; backdrop-filter: blur(10px); }
            .quick-bookmarks-sidebar.open { right: 0; }
            .bookmarks-toggle { position: absolute; left: -45px; top: 50%; transform: translateY(-50%); width: 40px; height: 40px; background: linear-gradient(135deg, var(--primary-color), rgba(29, 185, 84, 0.6)); border: 2px solid var(--primary-color); border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; transition: all 0.3s; box-shadow: 0 4px 15px rgba(29, 185, 84, 0.3); }
            .bookmarks-toggle:hover { transform: translateY(-50%) scale(1.1); }
            .bookmark-item { padding: 0.75rem; margin-bottom: 0.5rem; background: rgba(0, 0, 0, 0.2); border-radius: 8px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 0.3rem; font-size: 11px; color: var(--text-secondary); transition: all 0.2s; }
            .bookmark-item:hover { background: rgba(29, 185, 84, 0.2); color: var(--primary-color); }
            .bookmark-icon { font-size: 20px; }
        `;
        document.head.appendChild(style);
    }
    
    createSidebar() {
        const sidebar = document.createElement('div');
        sidebar.className = 'quick-bookmarks-sidebar';
        sidebar.id = 'quickBookmarksSidebar';
        
        let html = '';
        this.bookmarks.forEach(bookmark => {
            html += `
                <div class="bookmark-item" onclick="showSection('${bookmark.section}')">
                    <span class="bookmark-icon">${bookmark.icon}</span>
                    <span>${bookmark.name}</span>
                </div>
            `;
        });
        
        sidebar.innerHTML = html;
        document.body.appendChild(sidebar);
        
        const toggle = document.createElement('button');
        toggle.className = 'bookmarks-toggle';
        toggle.innerHTML = '⭐';
        toggle.title = 'Quick Bookmarks';
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
        sidebar.appendChild(toggle);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new QuickBookmarksSidebar();
});
