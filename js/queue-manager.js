/**
 * Queue Management System for TuneLocal
 * Manage playback queue with drag-and-drop reordering
 */

class QueueManager {
    constructor() {
        this.queue = [];
        this.currentIndex = 0;
        this.isVisible = false;
        this.draggedItem = null;
        this.init();
    }

    init() {
        this.createQueueModal();
        this.setupEventListeners();
        this.loadQueue();
    }

    createQueueModal() {
        const modal = document.createElement('div');
        modal.id = 'queueModal';
        modal.className = 'queue-modal';
        modal.innerHTML = `
            <div class="queue-modal-content">
                <div class="queue-header">
                    <div class="queue-title-section">
                        <i class="fas fa-list-ol"></i>
                        <div>
                            <h3>Play Queue</h3>
                            <p id="queueSongCount">0 songs</p>
                        </div>
                    </div>
                    <div class="queue-controls">
                        <button class="queue-btn" id="shuffleQueueBtn" title="Shuffle Queue">
                            <i class="fas fa-random"></i>
                        </button>
                        <button class="queue-btn" id="clearQueueBtn" title="Clear Queue">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="queue-btn" id="saveQueueBtn" title="Save as Playlist">
                            <i class="fas fa-save"></i>
                        </button>
                        <button class="queue-btn" id="closeQueueBtn" title="Close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="queue-body" id="queueBody">
                    <div class="queue-placeholder">
                        <i class="fas fa-list-ol"></i>
                        <p>Queue is empty</p>
                        <small>Songs you add will appear here</small>
                    </div>
                </div>
                <div class="queue-footer">
                    <div class="queue-stats">
                        <span><i class="fas fa-clock"></i> <span id="queueTotalTime">0:00</span></span>
                        <span><i class="fas fa-music"></i> <span id="queueTrackCount">0</span> tracks</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    setupEventListeners() {
        // Queue toggle button in player
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'toggleQueueBtn';
        toggleBtn.className = 'player-control-btn queue-toggle-btn';
        toggleBtn.innerHTML = '<i class="fas fa-list-ol"></i>';
        toggleBtn.title = 'Show Queue';
        toggleBtn.onclick = () => this.toggle();

        const playerControls = document.querySelector('.player-controls');
        if (playerControls) {
            playerControls.appendChild(toggleBtn);
        }

        // Modal controls
        document.getElementById('closeQueueBtn').onclick = () => this.hide();
        document.getElementById('shuffleQueueBtn').onclick = () => this.shuffleQueue();
        document.getElementById('clearQueueBtn').onclick = () => this.clearQueue();
        document.getElementById('saveQueueBtn').onclick = () => this.saveAsPlaylist();

        // Close on overlay click
        document.getElementById('queueModal').onclick = (e) => {
            if (e.target.id === 'queueModal') this.hide();
        };

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'q' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.toggle();
            }
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });

        // Listen for track changes
        document.addEventListener('trackChange', (e) => {
            if (e.detail && e.detail.index !== undefined) {
                this.currentIndex = e.detail.index;
                this.renderQueue();
            }
        });
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    show() {
        const modal = document.getElementById('queueModal');
        modal.style.display = 'flex';
        this.isVisible = true;
        this.syncWithCurrentPlaylist();
        this.renderQueue();
    }

    hide() {
        const modal = document.getElementById('queueModal');
        modal.style.display = 'none';
        this.isVisible = false;
    }

    syncWithCurrentPlaylist() {
        // Sync with global currentPlaylist if available
        if (window.currentPlaylist && window.currentPlaylist.length > 0) {
            this.queue = [...window.currentPlaylist];
            this.currentIndex = window.currentTrackIndex || 0;
        }
    }

    addToQueue(track) {
        this.queue.push(track);
        this.saveQueue();
        this.renderQueue();
        
        if (typeof showNotification === 'function') {
            showNotification(`Added "${track.title || track.filename}" to queue`, 'success');
        }
        
        // Update badge count
        this.updateQueueBadge();
    }

    addMultipleToQueue(tracks) {
        this.queue.push(...tracks);
        this.saveQueue();
        this.renderQueue();
        
        if (typeof showNotification === 'function') {
            showNotification(`Added ${tracks.length} songs to queue`, 'success');
        }
        
        this.updateQueueBadge();
    }

    removeFromQueue(index) {
        const removed = this.queue.splice(index, 1);
        
        // Adjust current index if needed
        if (index < this.currentIndex) {
            this.currentIndex--;
        } else if (index === this.currentIndex && this.currentIndex >= this.queue.length) {
            this.currentIndex = Math.max(0, this.queue.length - 1);
        }
        
        this.saveQueue();
        this.renderQueue();
        
        if (removed.length > 0 && typeof showNotification === 'function') {
            showNotification(`Removed "${removed[0].title || removed[0].filename}" from queue`, 'info');
        }
        
        this.updateQueueBadge();
    }

    moveTrack(fromIndex, toIndex) {
        if (fromIndex === toIndex) return;
        
        const [track] = this.queue.splice(fromIndex, 1);
        this.queue.splice(toIndex, 0, track);
        
        // Adjust current index
        if (fromIndex === this.currentIndex) {
            this.currentIndex = toIndex;
        } else if (fromIndex < this.currentIndex && toIndex >= this.currentIndex) {
            this.currentIndex--;
        } else if (fromIndex > this.currentIndex && toIndex <= this.currentIndex) {
            this.currentIndex++;
        }
        
        this.saveQueue();
        this.renderQueue();
    }

    playFromQueue(index) {
        if (index < 0 || index >= this.queue.length) return;
        
        this.currentIndex = index;
        const track = this.queue[index];
        
        // Update global playlist if it exists
        if (window.currentPlaylist) {
            window.currentPlaylist = [...this.queue];
            window.currentTrackIndex = index;
        }
        
        // Trigger play
        if (typeof playTrack === 'function') {
            playTrack(track);
        } else if (typeof loadTrack === 'function') {
            loadTrack(track);
        }
        
        this.renderQueue();
    }

    shuffleQueue() {
        if (this.queue.length <= 1) return;
        
        // Keep current track, shuffle the rest
        const currentTrack = this.queue[this.currentIndex];
        const remaining = this.queue.filter((_, i) => i !== this.currentIndex);
        
        // Fisher-Yates shuffle
        for (let i = remaining.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
        }
        
        this.queue = [currentTrack, ...remaining];
        this.currentIndex = 0;
        
        this.saveQueue();
        this.renderQueue();
        
        if (typeof showNotification === 'function') {
            showNotification('Queue shuffled', 'success');
        }
    }

    clearQueue() {
        if (confirm('Are you sure you want to clear the entire queue?')) {
            this.queue = [];
            this.currentIndex = 0;
            this.saveQueue();
            this.renderQueue();
            this.updateQueueBadge();
            
            if (typeof showNotification === 'function') {
                showNotification('Queue cleared', 'info');
            }
        }
    }

    saveAsPlaylist() {
        if (this.queue.length === 0) {
            if (typeof showNotification === 'function') {
                showNotification('Queue is empty', 'error');
            }
            return;
        }

        const playlistName = prompt('Enter playlist name:', 'Queue ' + new Date().toLocaleDateString());
        if (!playlistName) return;

        const playlist = {
            id: Date.now(),
            name: playlistName,
            tracks: [...this.queue],
            created: new Date().toISOString()
        };

        // Save to playlists
        try {
            const playlists = JSON.parse(localStorage.getItem('playlists') || '[]');
            playlists.push(playlist);
            localStorage.setItem('playlists', JSON.stringify(playlists));
            
            if (typeof showNotification === 'function') {
                showNotification(`Saved queue as "${playlistName}"`, 'success');
            }
            
            // Reload playlists if function exists
            if (typeof loadSavedPlaylists === 'function') {
                loadSavedPlaylists();
            }
        } catch (e) {
            console.error('Failed to save playlist:', e);
            if (typeof showNotification === 'function') {
                showNotification('Failed to save playlist', 'error');
            }
        }
    }

    renderQueue() {
        const queueBody = document.getElementById('queueBody');
        const queueSongCount = document.getElementById('queueSongCount');
        const queueTrackCount = document.getElementById('queueTrackCount');
        const queueTotalTime = document.getElementById('queueTotalTime');

        if (this.queue.length === 0) {
            queueBody.innerHTML = `
                <div class="queue-placeholder">
                    <i class="fas fa-list-ol"></i>
                    <p>Queue is empty</p>
                    <small>Songs you add will appear here</small>
                </div>
            `;
            queueSongCount.textContent = '0 songs';
            queueTrackCount.textContent = '0';
            queueTotalTime.textContent = '0:00';
            return;
        }

        queueBody.innerHTML = this.queue.map((track, index) => `
            <div class="queue-item ${index === this.currentIndex ? 'playing' : ''}" 
                 draggable="true" 
                 data-index="${index}">
                <div class="queue-item-drag">
                    <i class="fas fa-grip-vertical"></i>
                </div>
                <div class="queue-item-number">
                    ${index === this.currentIndex ? '<i class="fas fa-play"></i>' : index + 1}
                </div>
                <div class="queue-item-info" onclick="queueManager.playFromQueue(${index})">
                    <div class="queue-item-title">${track.title || track.filename || 'Unknown'}</div>
                    <div class="queue-item-artist">${track.artist || 'Unknown Artist'}</div>
                </div>
                <div class="queue-item-duration">${this.formatDuration(track.duration)}</div>
                <button class="queue-item-remove" onclick="queueManager.removeFromQueue(${index})" title="Remove">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        // Update counts
        queueSongCount.textContent = `${this.queue.length} song${this.queue.length !== 1 ? 's' : ''}`;
        queueTrackCount.textContent = this.queue.length;
        queueTotalTime.textContent = this.calculateTotalDuration();

        // Setup drag and drop
        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        const items = document.querySelectorAll('.queue-item');
        
        items.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.draggedItem = item;
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });

            item.addEventListener('dragend', (e) => {
                item.classList.remove('dragging');
                this.draggedItem = null;
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                const afterElement = this.getDragAfterElement(e.clientY);
                const dragging = document.querySelector('.dragging');
                
                if (afterElement == null) {
                    document.getElementById('queueBody').appendChild(dragging);
                } else {
                    document.getElementById('queueBody').insertBefore(dragging, afterElement);
                }
            });

            item.addEventListener('drop', (e) => {
                e.preventDefault();
                if (!this.draggedItem) return;

                const fromIndex = parseInt(this.draggedItem.dataset.index);
                const toIndex = parseInt(item.dataset.index);
                
                this.moveTrack(fromIndex, toIndex);
            });
        });
    }

    getDragAfterElement(y) {
        const draggableElements = [...document.querySelectorAll('.queue-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    formatDuration(seconds) {
        if (!seconds || isNaN(seconds)) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    calculateTotalDuration() {
        const total = this.queue.reduce((sum, track) => {
            return sum + (parseFloat(track.duration) || 0);
        }, 0);
        
        const hours = Math.floor(total / 3600);
        const mins = Math.floor((total % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    }

    updateQueueBadge() {
        const badge = document.getElementById('queueBadge');
        if (!badge && this.queue.length > 0) {
            const toggleBtn = document.getElementById('toggleQueueBtn');
            if (toggleBtn) {
                const badgeEl = document.createElement('span');
                badgeEl.id = 'queueBadge';
                badgeEl.className = 'queue-badge';
                badgeEl.textContent = this.queue.length;
                toggleBtn.appendChild(badgeEl);
            }
        } else if (badge) {
            if (this.queue.length > 0) {
                badge.textContent = this.queue.length;
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    saveQueue() {
        try {
            localStorage.setItem('musicQueue', JSON.stringify(this.queue));
            localStorage.setItem('queueIndex', this.currentIndex.toString());
        } catch (e) {
            console.error('Failed to save queue:', e);
        }
    }

    loadQueue() {
        try {
            const saved = localStorage.getItem('musicQueue');
            const savedIndex = localStorage.getItem('queueIndex');
            
            if (saved) {
                this.queue = JSON.parse(saved);
                this.currentIndex = savedIndex ? parseInt(savedIndex) : 0;
                this.updateQueueBadge();
            }
        } catch (e) {
            console.error('Failed to load queue:', e);
        }
    }

    getNextTrack() {
        if (this.currentIndex < this.queue.length - 1) {
            return this.queue[this.currentIndex + 1];
        }
        return null;
    }

    getPreviousTrack() {
        if (this.currentIndex > 0) {
            return this.queue[this.currentIndex - 1];
        }
        return null;
    }
}

// Initialize queue manager
const queueManager = new QueueManager();

// Make it globally accessible
window.queueManager = queueManager;

// Add helper function to add songs to queue from anywhere
window.addToQueue = function(track) {
    queueManager.addToQueue(track);
};

window.addMultipleToQueue = function(tracks) {
    queueManager.addMultipleToQueue(tracks);
};
