// Drag-and-Drop Playlist Reordering
class PlaylistReorderManager {
    constructor() {
        this.draggedItem = null;
        this.init();
    }
    
    init() {
        this.addStyles();
        this.setupDragListeners();
        this.loadPlaylistOrder();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .playlist-item-draggable { cursor: grab; transition: all 0.2s; }
            .playlist-item-draggable:active { cursor: grabbing; }
            .playlist-item-draggable.dragging { opacity: 0.5; transform: scale(0.95); }
            .playlist-item-draggable.drag-over { background: rgba(29, 185, 84, 0.2); border-radius: 8px; }
            .drag-handle { display: inline-block; margin-right: 0.5rem; color: var(--primary-color); cursor: grab; }
        `;
        document.head.appendChild(style);
    }
    
    setupDragListeners() {
        document.addEventListener('dragstart', (e) => {
            if (e.target.closest('[data-playlist-id]')) {
                this.draggedItem = e.target.closest('[data-playlist-id]');
                this.draggedItem.classList.add('dragging');
            }
        });
        
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            const target = e.target.closest('[data-playlist-id]');
            if (target && target !== this.draggedItem) {
                target.classList.add('drag-over');
            }
        });
        
        document.addEventListener('dragleave', (e) => {
            if (e.target.classList.contains('drag-over')) {
                e.target.classList.remove('drag-over');
            }
        });
        
        document.addEventListener('drop', (e) => {
            const target = e.target.closest('[data-playlist-id]');
            if (target && this.draggedItem) {
                this.swapPlaylists(this.draggedItem, target);
            }
        });
        
        document.addEventListener('dragend', () => {
            document.querySelectorAll('.dragging, .drag-over').forEach(el => {
                el.classList.remove('dragging', 'drag-over');
            });
            this.draggedItem = null;
        });
    }
    
    swapPlaylists(item1, item2) {
        const parent = item1.parentNode;
        const allItems = Array.from(parent.querySelectorAll('[data-playlist-id]'));
        const idx1 = allItems.indexOf(item1);
        const idx2 = allItems.indexOf(item2);
        
        if (idx1 < idx2) {
            item2.parentNode.insertBefore(item1, item2.nextSibling);
        } else {
            item2.parentNode.insertBefore(item1, item2);
        }
        
        this.savePlaylistOrder();
    }
    
    savePlaylistOrder() {
        const order = Array.from(document.querySelectorAll('[data-playlist-id]')).map(el => el.dataset.playlistId);
        localStorage.setItem('playlistOrder', JSON.stringify(order));
    }
    
    loadPlaylistOrder() {
        const saved = localStorage.getItem('playlistOrder');
        if (saved) {
            const order = JSON.parse(saved);
            // Reorder DOM elements based on saved order
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PlaylistReorderManager();
});
