// Enhanced Offline Player - Improved offline music playback and library management
class EnhancedOfflinePlayer {
    constructor() {
        this.currentTrack = null;
        this.isPlaying = false;
        this.shuffle = false;
        this.repeat = 0; // 0 = no repeat, 1 = repeat all, 2 = repeat one
        this.currentIndex = 0;
        this.playlist = [];
        this.init();
    }

    init() {
        // Start with any legacy localStorage library; MySQL sync can override it later
        this.loadOfflineLibrary();
        this.enhanceOfflineUI();
        this.attachPlayerEvents();
    }

    loadOfflineLibrary() {
        const library = JSON.parse(localStorage.getItem('offlineMusic') || '[]');
        this.playlist = library;
    }

    /**
     * Synchronize enhanced offline player with the MySQL-backed music library.
     * This is invoked from main.js after loadOfflineMusicFromMySQL() completes.
     */
    syncFromMySQL(tracks) {
        if (!Array.isArray(tracks)) return;

        this.playlist = tracks.map((track) => {
            const sizeBytes = parseInt(track.file_size, 10) || 0;
            const sizeMB = sizeBytes > 0 ? +(sizeBytes / 1024 / 1024).toFixed(1) : 0;
            return {
                id: track.id,
                name: track.name || track.file_name || 'Offline Track',
                artist: track.file_name || 'Offline Library',
                duration: 0,
                size: sizeMB,
                type: track.file_type || 'audio/*',
                date: track.date_added || '',
                source: 'mysql'
            };
        });

        this.displayLibrary();
    }

    enhanceOfflineUI() {
        const offlineSection = document.getElementById('offline-music');
        if (!offlineSection) return;

        // Enhance the music library display
        this.injectEnhancedStyles();
        this.setupLibraryEnhancements();
    }

    injectEnhancedStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .music-tracks {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .music-track-item {
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 12px;
                padding: 16px;
                display: grid;
                grid-template-columns: 50px 1fr auto;
                gap: 16px;
                align-items: center;
                cursor: pointer;
                transition: all 0.2s ease;
                animation: fadeIn 0.3s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .music-track-item:hover {
                background: rgba(255, 255, 255, 0.12);
                border-color: rgba(255, 255, 255, 0.25);
                transform: translateX(4px);
            }

            .music-track-item.playing {
                background: linear-gradient(135deg, rgba(29, 185, 84, 0.2), rgba(29, 185, 84, 0.1));
                border-color: rgba(29, 185, 84, 0.5);
            }

            .track-index {
                width: 50px;
                height: 50px;
                background: rgba(29, 185, 84, 0.2);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: 14px;
            }

            .music-track-item.playing .track-index {
                background: linear-gradient(135deg, #1dd954, #1aa34a);
            }

            .track-info {
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            .track-name {
                color: white;
                font-weight: 600;
                font-size: 15px;
                margin-bottom: 4px;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .track-meta {
                color: rgba(255, 255, 255, 0.6);
                font-size: 12px;
                display: flex;
                gap: 16px;
            }

            .track-controls {
                display: flex;
                gap: 8px;
            }

            .track-control-btn {
                width: 36px;
                height: 36px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                font-size: 14px;
            }

            .track-control-btn:hover {
                background: rgba(255, 255, 255, 0.15);
                transform: scale(1.05);
            }

            .track-control-btn.favorite {
                background: rgba(255, 0, 0, 0.2);
                color: #ff1744;
            }

            .track-control-btn.favorite.active {
                background: rgba(255, 0, 0, 0.5);
            }

            .library-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 12px;
                margin-top: 24px;
                padding-top: 24px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .stat-card {
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 12px;
                padding: 16px;
                text-align: center;
            }

            .stat-value {
                font-size: 24px;
                font-weight: 700;
                color: #1dd954;
                margin: 8px 0;
            }

            .stat-label {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.6);
                margin: 0;
            }

            .sort-controls {
                display: flex;
                gap: 8px;
                margin-top: 16px;
                flex-wrap: wrap;
            }

            .sort-btn {
                padding: 8px 14px;
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 8px;
                color: rgba(255, 255, 255, 0.8);
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s ease;
            }

            .sort-btn:hover, .sort-btn.active {
                background: rgba(29, 185, 84, 0.3);
                border-color: rgba(29, 185, 84, 0.5);
                color: white;
            }

            .queue-section {
                margin-top: 32px;
                padding-top: 24px;
                border-top: 2px solid rgba(255, 255, 255, 0.1);
            }

            .queue-title {
                color: white;
                font-size: 18px;
                font-weight: 700;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .queue-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
                max-height: 300px;
                overflow-y: auto;
            }

            .queue-list::-webkit-scrollbar {
                width: 8px;
            }

            .queue-list::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
            }

            .queue-list::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 4px;
            }

            .queue-list::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            .queue-item {
                background: rgba(255, 255, 255, 0.08);
                border-radius: 8px;
                padding: 10px 12px;
                color: rgba(255, 255, 255, 0.8);
                font-size: 13px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
            }

            .queue-item:hover {
                background: rgba(255, 255, 255, 0.12);
            }

            .queue-item.current {
                background: rgba(29, 185, 84, 0.3);
                color: white;
                font-weight: 600;
            }

            @media (max-width: 768px) {
                .music-track-item {
                    grid-template-columns: 40px 1fr auto;
                }

                .track-controls {
                    gap: 4px;
                }

                .track-control-btn {
                    width: 32px;
                    height: 32px;
                    font-size: 12px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupLibraryEnhancements() {
        const libraryHeader = document.querySelector('.library-header');
        if (libraryHeader) {
            const sortHTML = `
                <div class="sort-controls">
                    <button class="sort-btn active" onclick="enhancedOfflinePlayer.sortLibrary('date')">
                        <i class="fas fa-clock"></i> Recent
                    </button>
                    <button class="sort-btn" onclick="enhancedOfflinePlayer.sortLibrary('name')">
                        <i class="fas fa-sort-alpha-down"></i> Name
                    </button>
                    <button class="sort-btn" onclick="enhancedOfflinePlayer.sortLibrary('duration')">
                        <i class="fas fa-hourglass-half"></i> Duration
                    </button>
                    <button class="sort-btn" onclick="enhancedOfflinePlayer.sortLibrary('size')">
                        <i class="fas fa-database"></i> Size
                    </button>
                </div>
            `;
            libraryHeader.insertAdjacentHTML('afterend', sortHTML);
        }
    }

    displayLibrary() {
        const container = document.getElementById('musicTracks');
        if (!container) return;

        if (this.playlist.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: rgba(255, 255, 255, 0.5);">
                    <i class="fas fa-music" style="font-size: 48px; margin-bottom: 16px;"></i>
                    <h3>No music files yet</h3>
                    <p>Upload or download music to get started</p>
                </div>
            `;
            return;
        }

        const tracksList = this.playlist.map((track, index) => `
            <div class="music-track-item" onclick="enhancedOfflinePlayer.playTrack(${index})">
                <div class="track-index">${index + 1}</div>
                <div class="track-info">
                    <div class="track-name">${track.name || 'Unknown Track'}</div>
                    <div class="track-meta">
                        <span>${track.artist || 'Unknown Artist'}</span>
                        <span>${this.formatDuration(track.duration || 0)}</span>
                        <span>${track.size || '?'} MB</span>
                    </div>
                </div>
                <div class="track-controls">
                    <button class="track-control-btn favorite" onclick="event.stopPropagation(); enhancedOfflinePlayer.toggleFavorite('${track.id}')">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="track-control-btn" onclick="event.stopPropagation(); enhancedOfflinePlayer.playNext('${track.id}')">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="track-control-btn" onclick="event.stopPropagation(); enhancedOfflinePlayer.deleteTrack('${track.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        const statsHTML = `
            <div class="library-stats">
                <div class="stat-card">
                    <i class="fas fa-music" style="font-size: 20px;"></i>
                    <div class="stat-value">${this.playlist.length}</div>
                    <p class="stat-label">Total Tracks</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-clock" style="font-size: 20px;"></i>
                    <div class="stat-value">${this.getTotalDuration()}</div>
                    <p class="stat-label">Total Duration</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-database" style="font-size: 20px;"></i>
                    <div class="stat-value">${this.getTotalSize()}</div>
                    <p class="stat-label">Total Size</p>
                </div>
            </div>
        `;

        container.innerHTML = tracksList + statsHTML;
    }

    playTrack(index) {
        this.currentIndex = index;
        this.currentTrack = this.playlist[index];
        this.isPlaying = true;

        // Delegate actual audio playback to the existing MySQL-backed player when available
        try {
            if (typeof playOfflineTrackMySQL === 'function' && this.currentTrack && this.currentTrack.id != null) {
                let dbIndex = 0;
                if (Array.isArray(window.currentPlaylist)) {
                    const found = window.currentPlaylist.findIndex(t => String(t.id) === String(this.currentTrack.id));
                    if (found >= 0) dbIndex = found;
                }
                playOfflineTrackMySQL(this.currentTrack.id, dbIndex);
            }
        } catch (e) {
            console.error('EnhancedOfflinePlayer playback error:', e);
        }

        // Update UI
        this.updateNowPlaying();
        this.displayLibrary();
    }

    updateNowPlaying() {
        if (!this.currentTrack) return;

        const nowPlayingSection = document.getElementById('nowPlayingSection');
        if (nowPlayingSection) {
            nowPlayingSection.style.display = 'block';
            
            const nameEl = document.getElementById('currentTrackName');
            const artistEl = document.getElementById('currentTrackArtist');
            
            if (nameEl) nameEl.textContent = this.currentTrack.name || 'Unknown';
            if (artistEl) artistEl.textContent = this.currentTrack.artist || 'Unknown Artist';
        }
    }

    playNext(trackId) {
        const index = this.playlist.findIndex(t => t.id === trackId);
        if (index >= 0) {
            this.playTrack(index);
        }
    }

    deleteTrack(trackId) {
        if (confirm('Delete this track?')) {
            this.playlist = this.playlist.filter(t => t.id !== trackId);
            localStorage.setItem('offlineMusic', JSON.stringify(this.playlist));
            this.displayLibrary();
        }
    }

    toggleFavorite(trackId) {
        const track = this.playlist.find(t => t.id === trackId);
        if (track) {
            track.favorite = !track.favorite;
            localStorage.setItem('offlineMusic', JSON.stringify(this.playlist));
            this.displayLibrary();
        }
    }

    sortLibrary(sortBy) {
        const sorted = [...this.playlist];
        
        switch(sortBy) {
            case 'name':
                sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                break;
            case 'duration':
                sorted.sort((a, b) => (b.duration || 0) - (a.duration || 0));
                break;
            case 'size':
                sorted.sort((a, b) => (b.size || 0) - (a.size || 0));
                break;
            case 'date':
            default:
                sorted.reverse();
                break;
        }

        this.playlist = sorted;
        localStorage.setItem('offlineMusic', JSON.stringify(this.playlist));
        this.displayLibrary();
    }

    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    getTotalDuration() {
        const totalSeconds = this.playlist.reduce((acc, track) => acc + (track.duration || 0), 0);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    getTotalSize() {
        const totalMB = this.playlist.reduce((acc, track) => acc + (track.size || 0), 0);
        return `${totalMB.toFixed(1)} MB`;
    }

    attachPlayerEvents() {
        // Refresh display whenever page loads
        setTimeout(() => this.displayLibrary(), 500);
    }
}

// Global instance
const enhancedOfflinePlayer = new EnhancedOfflinePlayer();

// Override existing displayOfflineMusic function
function displayOfflineMusic() {
    enhancedOfflinePlayer.displayLibrary();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    enhancedOfflinePlayer.displayLibrary();
});
