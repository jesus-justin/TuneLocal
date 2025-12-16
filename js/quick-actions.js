/**
 * TuneLocal Quick Actions Menu
 * Floating action button with common shortcuts
 */

class QuickActionsMenu {
    constructor() {
        this.isOpen = false;
        this.fab = null;
        this.menu = null;
        this.actions = [
            {
                icon: 'fa-play',
                label: 'Resume Last',
                action: () => this.resumeLast(),
                color: '#1db954'
            },
            {
                icon: 'fa-random',
                label: 'Random Song',
                action: () => this.playRandom(),
                color: '#ff0050'
            },
            {
                icon: 'fa-clock',
                label: 'Sleep Timer',
                action: () => this.showSleepTimer(),
                color: '#667eea'
            },
            {
                icon: 'fa-wave-square',
                label: 'Visualizer',
                action: () => this.toggleVisualizer(),
                color: '#00f2fe'
            },
            {
                icon: 'fa-share-alt',
                label: 'Share',
                action: () => this.share(),
                color: '#f5576c'
            },
            {
                icon: 'fa-download',
                label: 'Quick Download',
                action: () => this.quickDownload(),
                color: '#764ba2'
            }
        ];
    }

    /**
     * Initialize quick actions menu
     */
    init() {
        this.createFAB();
        this.createMenu();
        this.attachEventListeners();
    }

    /**
     * Create floating action button
     */
    createFAB() {
        this.fab = document.createElement('button');
        this.fab.id = 'quick-actions-fab';
        this.fab.className = 'quick-actions-fab';
        this.fab.innerHTML = '<i class="fas fa-magic"></i>';
        this.fab.setAttribute('aria-label', 'Quick Actions');
        this.fab.setAttribute('aria-expanded', 'false');
        document.body.appendChild(this.fab);
    }

    /**
     * Create actions menu
     */
    createMenu() {
        this.menu = document.createElement('div');
        this.menu.id = 'quick-actions-menu';
        this.menu.className = 'quick-actions-menu';
        
        this.actions.forEach((action, index) => {
            const item = document.createElement('button');
            item.className = 'quick-action-item';
            item.style.setProperty('--item-index', index);
            item.style.setProperty('--item-color', action.color);
            item.innerHTML = `
                <i class="fas ${action.icon}"></i>
                <span class="quick-action-label">${action.label}</span>
            `;
            item.setAttribute('aria-label', action.label);
            item.addEventListener('click', () => {
                action.action();
                this.close();
            });
            this.menu.appendChild(item);
        });

        document.body.appendChild(this.menu);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        this.fab.addEventListener('click', () => this.toggle());
        
        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.fab.contains(e.target) && !this.menu.contains(e.target)) {
                this.close();
            }
        });
    }

    /**
     * Toggle menu
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Open menu
     */
    open() {
        this.isOpen = true;
        this.fab.classList.add('active');
        this.menu.classList.add('active');
        this.fab.setAttribute('aria-expanded', 'true');
        this.fab.querySelector('i').classList.replace('fa-magic', 'fa-times');
    }

    /**
     * Close menu
     */
    close() {
        this.isOpen = false;
        this.fab.classList.remove('active');
        this.menu.classList.remove('active');
        this.fab.setAttribute('aria-expanded', 'false');
        this.fab.querySelector('i').classList.replace('fa-times', 'fa-magic');
    }

    /**
     * Action: Resume last played
     */
    resumeLast() {
        try {
            const savedSongs = JSON.parse(localStorage.getItem('tunelocal_saved_songs') || '[]');
            if (savedSongs.length > 0) {
                const last = savedSongs[0];
                if (last.type === 'spotify') {
                    document.getElementById('spotifyUrl').value = last.url;
                    loadSpotify();
                    showSection('spotify');
                } else if (last.type === 'youtube') {
                    document.getElementById('youtubeUrl').value = last.url;
                    loadYouTube();
                    showSection('youtube');
                }
                showNotification('Resumed last played content', 'success');
            } else {
                showNotification('No recent content found', 'info');
            }
        } catch (e) {
            showNotification('Could not resume last played', 'error');
        }
    }

    /**
     * Action: Play random song from offline library
     */
    playRandom() {
        try {
            fetch(`${API_BASE_URL}?action=list`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.tracks.length > 0) {
                        const random = data.tracks[Math.floor(Math.random() * data.tracks.length)];
                        playOfflineTrack(random.id, random.name);
                        showSection('offline-music');
                        showNotification(`Playing: ${random.name}`, 'success');
                    } else {
                        showNotification('No offline tracks available', 'info');
                    }
                });
        } catch (e) {
            showNotification('Could not play random track', 'error');
        }
    }

    /**
     * Action: Show sleep timer dialog
     */
    showSleepTimer() {
        const minutes = prompt('Sleep timer duration (minutes):', '30');
        if (minutes && !isNaN(minutes) && minutes > 0) {
            sleepTimer.start(parseInt(minutes), {
                onStart: (min) => showNotification(`Sleep timer set for ${min} minutes`, 'success'),
                onEnd: () => showNotification('Sleep timer ended', 'info')
            });
        }
    }

    /**
     * Action: Toggle visualizer
     */
    toggleVisualizer() {
        if (typeof visualizer !== 'undefined') {
            const isActive = visualizer.toggle();
            showNotification(isActive ? 'Visualizer enabled' : 'Visualizer disabled', 'info');
        } else {
            showNotification('Visualizer not available', 'error');
        }
    }

    /**
     * Action: Share current page
     */
    share() {
        if (navigator.share) {
            navigator.share({
                title: 'TuneLocal - My Music Hub',
                text: 'Check out my personal music streaming platform!',
                url: window.location.href
            }).then(() => {
                showNotification('Shared successfully!', 'success');
            }).catch(() => {
                this.fallbackShare();
            });
        } else {
            this.fallbackShare();
        }
    }

    /**
     * Fallback share (copy to clipboard)
     */
    fallbackShare() {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Could not copy link', 'error');
        });
    }

    /**
     * Action: Quick download
     */
    quickDownload() {
        showSection('downloader');
        document.getElementById('ytUrl')?.focus();
        showNotification('Quick download opened', 'info');
    }

    /**
     * Destroy menu
     */
    destroy() {
        if (this.fab) this.fab.remove();
        if (this.menu) this.menu.remove();
    }
}

// Global instance
let quickActions = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    quickActions = new QuickActionsMenu();
    quickActions.init();
});
