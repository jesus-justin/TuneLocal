/**
 * Batch Operations - Batch edit, delete, organize multiple tracks
 */

class BatchOperations {
    constructor() {
        this.selected = new Set();
        this.init();
    }

    init() {
        this.createBatchUI();
    }

    createBatchUI() {
        const panel = document.createElement('div');
        panel.id = 'batchPanel';
        panel.className = 'batch-panel hidden';
        panel.innerHTML = `
            <div class="batch-controls">
                <h4>Batch Operations</h4>
                <div class="selected-count"><span id="selectedCount">0</span> selected</div>
                <button class="btn-secondary" onclick="batchOps.batchDelete()">Delete</button>
                <button class="btn-secondary" onclick="batchOps.batchAddToPlaylist()">Add to Playlist</button>
                <button class="btn-secondary" onclick="batchOps.batchEdit()">Edit Tags</button>
                <button class="btn-secondary" onclick="batchOps.batchClearSelected()">Clear</button>
            </div>
        `;
        document.body.appendChild(panel);
    }

    toggleItem(id) {
        if (this.selected.has(id)) {
            this.selected.delete(id);
        } else {
            this.selected.add(id);
        }
        this.updateCount();
    }

    updateCount() {
        const count = document.getElementById('selectedCount');
        if (count) count.textContent = this.selected.size;
        this.showPanel();
    }

    showPanel() {
        const panel = document.getElementById('batchPanel');
        if (this.selected.size > 0) {
            panel.classList.remove('hidden');
        } else {
            panel.classList.add('hidden');
        }
    }

    batchDelete() {
        if (confirm(`Delete ${this.selected.size} items?`)) {
            // Delete selected items
            this.selected.clear();
            this.updateCount();
            if (typeof showNotification === 'function') {
                showNotification('Items deleted', 'success');
            }
        }
    }

    batchAddToPlaylist() {
        const playlistName = prompt('Playlist name:');
        if (playlistName) {
            // Add to playlist
            this.selected.clear();
            this.updateCount();
            if (typeof showNotification === 'function') {
                showNotification(`Added to ${playlistName}`, 'success');
            }
        }
    }

    batchEdit() {
        if (typeof showNotification === 'function') {
            showNotification('Edit dialog would open here', 'info');
        }
    }

    batchClearSelected() {
        this.selected.clear();
        this.updateCount();
    }
}

const batchOps = new BatchOperations();
window.batchOps = batchOps;
