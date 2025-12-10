/**
 * TuneLocal - Keyboard Shortcuts Manager
 * Handles keyboard navigation and shortcuts
 */

class KeyboardShortcuts {
    constructor() {
        this.shortcuts = {
            'escape': () => this.closeModals(),
            '/': () => this.focusSearch(),
            '?': () => this.showShortcutsHelp(),
            'n': () => showSection('home'),
            's': () => showSection('spotify'),
            'y': () => showSection('youtube'),
            'd': () => showSection('discover'),
            'o': () => showSection('offline-music'),
            'p': () => showSection('playlists'),
            ' ': (e) => this.handleSpaceBar(e)
        };
        this.setupKeyboardListeners();
    }

    /**
     * Setup keyboard event listeners
     */
    setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            // Don't trigger shortcuts when typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            const key = e.key.toLowerCase();
            
            if (this.shortcuts[key]) {
                e.preventDefault();
                this.shortcuts[key](e);
            }
        });
    }

    /**
     * Close modals with Escape
     */
    closeModals() {
        const modal = document.getElementById('discoverPlayerModal');
        if (modal && modal.style.display === 'flex') {
            closeDiscoverPlayer();
        }
    }

    /**
     * Focus search with /
     */
    focusSearch() {
        const searchInput = document.getElementById('musicSearchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }

    /**
     * Show keyboard shortcuts help
     */
    showShortcutsHelp() {
        const shortcuts = [
            { key: 'Esc', action: 'Close modals' },
            { key: '/', action: 'Focus search' },
            { key: '?', action: 'Show this help' },
            { key: 'N', action: 'Go to Home' },
            { key: 'S', action: 'Go to Spotify' },
            { key: 'Y', action: 'Go to YouTube' },
            { key: 'D', action: 'Go to Discover' },
            { key: 'O', action: 'Go to Offline Music' },
            { key: 'P', action: 'Go to Playlists' },
            { key: 'Space', action: 'Play/Pause (in offline player)' }
        ];

        let helpText = '🎹 TuneLocal Keyboard Shortcuts\n\n';
        shortcuts.forEach(s => {
            helpText += `${s.key.padEnd(10)} → ${s.action}\n`;
        });

        showNotification(helpText, 'info');
    }

    /**
     * Handle space bar for play/pause
     */
    handleSpaceBar(e) {
        const audioPlayer = document.getElementById('audioPlayer');
        if (audioPlayer) {
            e.preventDefault();
            if (audioPlayer.paused) {
                audioPlayer.play();
            } else {
                audioPlayer.pause();
            }
        }
    }
}

// Initialize keyboard shortcuts
const keyboardShortcuts = new KeyboardShortcuts();
