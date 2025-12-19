/**
 * Lyrics Display System for TuneLocal
 * Displays synchronized lyrics for currently playing songs
 */

class LyricsDisplay {
    constructor() {
        this.currentLyrics = null;
        this.isVisible = false;
        this.autoScroll = true;
        this.fontSize = 'medium';
        this.init();
    }

    init() {
        this.createLyricsModal();
        this.setupEventListeners();
        this.loadPreferences();
    }

    createLyricsModal() {
        const modal = document.createElement('div');
        modal.id = 'lyricsModal';
        modal.className = 'lyrics-modal';
        modal.innerHTML = `
            <div class="lyrics-modal-content">
                <div class="lyrics-header">
                    <div class="lyrics-title-section">
                        <i class="fas fa-music"></i>
                        <div class="lyrics-song-info">
                            <h3 id="lyricsSongTitle">No song playing</h3>
                            <p id="lyricsSongArtist">-</p>
                        </div>
                    </div>
                    <div class="lyrics-controls">
                        <button class="lyrics-btn" id="lyricsAutoScrollBtn" title="Toggle Auto-scroll">
                            <i class="fas fa-arrows-alt-v"></i>
                        </button>
                        <button class="lyrics-btn" id="lyricsFontSizeBtn" title="Font Size">
                            <i class="fas fa-text-height"></i>
                        </button>
                        <button class="lyrics-btn" id="lyricsSearchBtn" title="Search Lyrics">
                            <i class="fas fa-search"></i>
                        </button>
                        <button class="lyrics-btn" id="closeLyricsBtn" title="Close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="lyrics-body" id="lyricsBody">
                    <div class="lyrics-placeholder">
                        <i class="fas fa-music"></i>
                        <p>No lyrics available</p>
                        <button class="btn-primary" id="searchLyricsNowBtn">
                            <i class="fas fa-search"></i> Search Lyrics
                        </button>
                    </div>
                </div>
                <div class="lyrics-footer">
                    <button class="btn-secondary" id="copyLyricsBtn">
                        <i class="fas fa-copy"></i> Copy Lyrics
                    </button>
                    <button class="btn-secondary" id="shareLyricsBtn">
                        <i class="fas fa-share-alt"></i> Share
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    setupEventListeners() {
        // Toggle lyrics button in player
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'toggleLyricsBtn';
        toggleBtn.className = 'player-control-btn lyrics-toggle-btn';
        toggleBtn.innerHTML = '<i class="fas fa-quote-right"></i>';
        toggleBtn.title = 'Show Lyrics';
        toggleBtn.onclick = () => this.toggle();

        // Add to player controls
        const playerControls = document.querySelector('.player-controls');
        if (playerControls) {
            playerControls.appendChild(toggleBtn);
        }

        // Modal controls
        document.getElementById('closeLyricsBtn').onclick = () => this.hide();
        document.getElementById('lyricsAutoScrollBtn').onclick = () => this.toggleAutoScroll();
        document.getElementById('lyricsFontSizeBtn').onclick = () => this.cycleFontSize();
        document.getElementById('lyricsSearchBtn').onclick = () => this.searchLyricsOnline();
        document.getElementById('searchLyricsNowBtn').onclick = () => this.searchLyricsOnline();
        document.getElementById('copyLyricsBtn').onclick = () => this.copyLyrics();
        document.getElementById('shareLyricsBtn').onclick = () => this.shareLyrics();

        // Close on overlay click
        document.getElementById('lyricsModal').onclick = (e) => {
            if (e.target.id === 'lyricsModal') this.hide();
        };

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.toggle();
            }
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
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
        const modal = document.getElementById('lyricsModal');
        modal.style.display = 'flex';
        this.isVisible = true;
        
        // Get current song info
        const songInfo = this.getCurrentSongInfo();
        if (songInfo) {
            this.displaySongInfo(songInfo);
            this.fetchLyrics(songInfo);
        }
    }

    hide() {
        const modal = document.getElementById('lyricsModal');
        modal.style.display = 'none';
        this.isVisible = false;
    }

    getCurrentSongInfo() {
        // Try to get info from audio element
        const audioPlayer = document.querySelector('audio');
        if (audioPlayer && audioPlayer.src) {
            return {
                title: audioPlayer.getAttribute('data-title') || 'Unknown Title',
                artist: audioPlayer.getAttribute('data-artist') || 'Unknown Artist'
            };
        }

        // Try to get from current track in playlist
        if (window.currentPlaylist && window.currentPlaylist.length > 0 && window.currentTrackIndex !== undefined) {
            const track = window.currentPlaylist[window.currentTrackIndex];
            return {
                title: track.title || track.filename || 'Unknown Title',
                artist: track.artist || 'Unknown Artist'
            };
        }

        return null;
    }

    displaySongInfo(songInfo) {
        document.getElementById('lyricsSongTitle').textContent = songInfo.title;
        document.getElementById('lyricsSongArtist').textContent = songInfo.artist;
    }

    async fetchLyrics(songInfo) {
        const lyricsBody = document.getElementById('lyricsBody');
        lyricsBody.innerHTML = '<div class="lyrics-loading"><i class="fas fa-spinner fa-spin"></i><p>Loading lyrics...</p></div>';

        try {
            // Try local storage first
            const cachedLyrics = this.getCachedLyrics(songInfo);
            if (cachedLyrics) {
                this.displayLyrics(cachedLyrics);
                return;
            }

            // Attempt to fetch from API (you can integrate with lyrics APIs)
            const lyrics = await this.fetchLyricsFromAPI(songInfo);
            
            if (lyrics) {
                this.cacheLyrics(songInfo, lyrics);
                this.displayLyrics(lyrics);
            } else {
                this.showNoLyrics();
            }
        } catch (error) {
            console.error('Error fetching lyrics:', error);
            this.showNoLyrics();
        }
    }

    async fetchLyricsFromAPI(songInfo) {
        // This is a placeholder - integrate with actual lyrics APIs
        // Options: lyrics.ovh, musixmatch, genius, etc.
        
        // Simulated sample lyrics for demonstration
        return this.generateSampleLyrics(songInfo);
    }

    generateSampleLyrics(songInfo) {
        // Generate sample lyrics for demonstration
        return {
            lines: [
                { time: 0, text: `♪ ${songInfo.title} ♪`, class: 'lyrics-title-line' },
                { time: 2, text: `by ${songInfo.artist}`, class: 'lyrics-artist-line' },
                { time: 5, text: '' },
                { time: 8, text: 'Lyrics are being loaded from your music metadata...' },
                { time: 12, text: '' },
                { time: 15, text: 'If no lyrics are embedded in the file,' },
                { time: 18, text: 'you can search for them online using the search button.' },
                { time: 22, text: '' },
                { time: 25, text: 'Enjoy your music! 🎵' }
            ],
            full: `${songInfo.title}\nby ${songInfo.artist}\n\nLyrics are being loaded from your music metadata...\n\nIf no lyrics are embedded in the file,\nyou can search for them online using the search button.\n\nEnjoy your music! 🎵`
        };
    }

    displayLyrics(lyrics) {
        const lyricsBody = document.getElementById('lyricsBody');
        lyricsBody.innerHTML = '';
        lyricsBody.className = `lyrics-body lyrics-font-${this.fontSize}`;

        if (lyrics.lines && lyrics.lines.length > 0) {
            lyrics.lines.forEach((line, index) => {
                const lineElement = document.createElement('div');
                lineElement.className = `lyrics-line ${line.class || ''}`;
                lineElement.textContent = line.text;
                lineElement.dataset.time = line.time;
                lineElement.dataset.index = index;
                lyricsBody.appendChild(lineElement);
            });

            this.currentLyrics = lyrics;
            this.setupLyricsSync();
        } else {
            lyricsBody.innerHTML = `<div class="lyrics-text">${lyrics.full || lyrics}</div>`;
            this.currentLyrics = lyrics;
        }
    }

    setupLyricsSync() {
        // Sync lyrics with audio playback
        const audioPlayer = document.querySelector('audio');
        if (!audioPlayer) return;

        audioPlayer.addEventListener('timeupdate', () => {
            if (!this.autoScroll) return;
            
            const currentTime = audioPlayer.currentTime;
            const lines = document.querySelectorAll('.lyrics-line');
            
            lines.forEach(line => {
                const lineTime = parseFloat(line.dataset.time);
                if (currentTime >= lineTime && currentTime < lineTime + 3) {
                    line.classList.add('active');
                    if (this.autoScroll) {
                        line.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                } else {
                    line.classList.remove('active');
                }
            });
        });
    }

    showNoLyrics() {
        const lyricsBody = document.getElementById('lyricsBody');
        lyricsBody.innerHTML = `
            <div class="lyrics-placeholder">
                <i class="fas fa-music"></i>
                <p>No lyrics found</p>
                <button class="btn-primary" onclick="lyricsDisplay.searchLyricsOnline()">
                    <i class="fas fa-search"></i> Search Online
                </button>
            </div>
        `;
    }

    toggleAutoScroll() {
        this.autoScroll = !this.autoScroll;
        const btn = document.getElementById('lyricsAutoScrollBtn');
        btn.classList.toggle('active', this.autoScroll);
        this.savePreferences();
        
        if (typeof showNotification === 'function') {
            showNotification(`Auto-scroll ${this.autoScroll ? 'enabled' : 'disabled'}`, 'info');
        }
    }

    cycleFontSize() {
        const sizes = ['small', 'medium', 'large', 'x-large'];
        const currentIndex = sizes.indexOf(this.fontSize);
        this.fontSize = sizes[(currentIndex + 1) % sizes.length];
        
        const lyricsBody = document.getElementById('lyricsBody');
        lyricsBody.className = `lyrics-body lyrics-font-${this.fontSize}`;
        
        this.savePreferences();
        
        if (typeof showNotification === 'function') {
            showNotification(`Font size: ${this.fontSize}`, 'info');
        }
    }

    searchLyricsOnline() {
        const songInfo = this.getCurrentSongInfo();
        if (songInfo) {
            const query = encodeURIComponent(`${songInfo.artist} ${songInfo.title} lyrics`);
            window.open(`https://www.google.com/search?q=${query}`, '_blank');
        }
    }

    copyLyrics() {
        if (!this.currentLyrics) return;

        const text = this.currentLyrics.full || 
                     (this.currentLyrics.lines ? this.currentLyrics.lines.map(l => l.text).join('\n') : '');
        
        navigator.clipboard.writeText(text).then(() => {
            if (typeof showNotification === 'function') {
                showNotification('Lyrics copied to clipboard!', 'success');
            }
        }).catch(err => {
            console.error('Failed to copy lyrics:', err);
        });
    }

    shareLyrics() {
        const songInfo = this.getCurrentSongInfo();
        if (!songInfo) return;

        const shareData = {
            title: `Lyrics: ${songInfo.title}`,
            text: `Check out the lyrics for "${songInfo.title}" by ${songInfo.artist}`,
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData).catch(err => console.log('Share failed:', err));
        } else {
            // Fallback: copy link
            navigator.clipboard.writeText(window.location.href);
            if (typeof showNotification === 'function') {
                showNotification('Link copied to clipboard!', 'success');
            }
        }
    }

    getCachedLyrics(songInfo) {
        try {
            const key = `lyrics_${songInfo.artist}_${songInfo.title}`.toLowerCase().replace(/\s/g, '_');
            const cached = localStorage.getItem(key);
            return cached ? JSON.parse(cached) : null;
        } catch (e) {
            return null;
        }
    }

    cacheLyrics(songInfo, lyrics) {
        try {
            const key = `lyrics_${songInfo.artist}_${songInfo.title}`.toLowerCase().replace(/\s/g, '_');
            localStorage.setItem(key, JSON.stringify(lyrics));
        } catch (e) {
            console.error('Failed to cache lyrics:', e);
        }
    }

    loadPreferences() {
        try {
            const prefs = JSON.parse(localStorage.getItem('lyricsPreferences') || '{}');
            this.autoScroll = prefs.autoScroll !== false;
            this.fontSize = prefs.fontSize || 'medium';
            
            const btn = document.getElementById('lyricsAutoScrollBtn');
            if (btn) btn.classList.toggle('active', this.autoScroll);
        } catch (e) {
            console.error('Failed to load lyrics preferences:', e);
        }
    }

    savePreferences() {
        try {
            const prefs = {
                autoScroll: this.autoScroll,
                fontSize: this.fontSize
            };
            localStorage.setItem('lyricsPreferences', JSON.stringify(prefs));
        } catch (e) {
            console.error('Failed to save lyrics preferences:', e);
        }
    }
}

// Initialize lyrics display
const lyricsDisplay = new LyricsDisplay();

// Make it globally accessible
window.lyricsDisplay = lyricsDisplay;
