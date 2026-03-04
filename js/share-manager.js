/**
 * TuneLocal Share Feature
 * Share songs, playlists, and profiles
 * Version 1.0.1 - Enhanced sharing capabilities
 */

class ShareManager {
    constructor() {
        this.baseUrl = window.location.origin + window.location.pathname.replace(/\/$/, '');
    }

    /**
     * Generate shareable link for song/track
     */
    generateSongLink(data) {
        const encoded = btoa(JSON.stringify({
            type: 'song',
            url: data.url,
            title: data.title || 'Check this out',
            artist: data.artist || 'Unknown',
            platform: data.platform || 'spotify',
            timestamp: Date.now()
        }));
        
        return `${this.baseUrl}?share=${encoded}`;
    }

    /**
     * Generate shareable link for playlist
     */
    generatePlaylistLink(playlist) {
        const encoded = btoa(JSON.stringify({
            type: 'playlist',
            id: playlist.id,
            name: playlist.name,
            url: playlist.url,
            songs: playlist.songs || [],
            platform: playlist.type || 'custom',
            timestamp: Date.now()
        }));
        
        return `${this.baseUrl}?share=${encoded}`;
    }

    /**
     * Generate shareable user profile link
     */
    generateProfileLink() {
        const stats = statsDashboard ? statsDashboard.getSummary() : {};
        const encoded = btoa(JSON.stringify({
            type: 'profile',
            stats: stats,
            timestamp: Date.now()
        }));
        
        return `${this.baseUrl}?share=${encoded}`;
    }

    /**
     * Generate QR code for link
     */
    generateQRCode(url) {
        // Using QR server API (free, no dependencies)
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    }

    /**
     * Parse shared content
     */
    parseSharedContent(encoded) {
        try {
            return JSON.parse(atob(encoded));
        } catch (e) {
            console.error('Failed to parse shared content:', e);
            return null;
        }
    }

    /**
     * Check if page was opened from share link
     */
    checkShareLink() {
        const params = new URLSearchParams(window.location.search);
        const share = params.get('share');
        
        if (share) {
            const data = this.parseSharedContent(share);
            if (data) {
                this.handleSharedContent(data);
                // Clean up URL
                window.history.replaceState({}, document.title, this.baseUrl);
            }
        }
    }

    /**
     * Handle shared content
     */
    handleSharedContent(data) {
        switch (data.type) {
            case 'song':
                this.handleSharedSong(data);
                break;
            case 'playlist':
                this.handleSharedPlaylist(data);
                break;
            case 'profile':
                this.handleSharedProfile(data);
                break;
        }
    }

    /**
     * Handle shared song
     */
    handleSharedSong(data) {
        showNotification(`Shared: ${data.title} by ${data.artist}`, 'info');
        
        setTimeout(() => {
            if (data.platform === 'spotify') {
                document.getElementById('spotifyUrl').value = data.url;
                loadSpotify();
                showSection('spotify');
            } else if (data.platform === 'youtube') {
                document.getElementById('youtubeUrl').value = data.url;
                loadYouTube();
                showSection('youtube');
            }
        }, 500);
    }

    /**
     * Handle shared playlist
     */
    handleSharedPlaylist(data) {
        showNotification(`Playlist shared: ${data.name}`, 'info');
        
        setTimeout(() => {
            if (data.platform === 'spotify' || data.platform === 'youtube') {
                const type = data.platform === 'spotify' ? 'spotifyUrl' : 'youtubeUrl';
                document.getElementById(type).value = data.url;
                
                if (data.platform === 'spotify') {
                    loadSpotify();
                    showSection('spotify');
                } else {
                    loadYouTube();
                    showSection('youtube');
                }
            }
        }, 500);
    }

    /**
     * Handle shared profile
     */
    handleSharedProfile(data) {
        const summary = data.stats;
        const message = `
            Check out this awesome music profile!
            - Total Tracks: ${summary.totalTracks}
            - Total Time: ${summary.totalPlayTime}
            - Current Streak: ${summary.currentStreak} days
            - Favorite Platform: ${summary.favoritePlatform}
        `;
        
        showNotification(message, 'info');
    }

    /**
     * Copy to clipboard
     */
    copyToClipboard(text) {
        return navigator.clipboard.writeText(text).then(() => {
            return true;
        }).catch(err => {
            console.error('Failed to copy:', err);
            return false;
        });
    }

    /**
     * Share via native API (if available)
     */
    shareNative(data) {
        if (!navigator.share) {
            return false;
        }

        navigator.share(data).catch(err => {
            if (err.name !== 'AbortError') {
                console.error('Share failed:', err);
            }
        });

        return true;
    }
}

// Global instance
const shareManager = new ShareManager();

/**
 * Show share dialog
 */
function showShareDialog(type, data) {
    const dialog = document.createElement('div');
    dialog.className = 'share-dialog-overlay';
    
    let link = '';
    let qrCode = '';
    
    if (type === 'song') {
        link = shareManager.generateSongLink(data);
        qrCode = shareManager.generateQRCode(link);
    } else if (type === 'playlist') {
        link = shareManager.generatePlaylistLink(data);
        qrCode = shareManager.generateQRCode(link);
    } else if (type === 'profile') {
        link = shareManager.generateProfileLink();
        qrCode = shareManager.generateQRCode(link);
    }

    const content = `
        <div class="share-dialog">
            <div class="share-header">
                <h2><i class="fas fa-share-alt"></i> Share</h2>
                <button class="close-btn" onclick="this.closest('.share-dialog-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="share-content">
                <div class="share-section">
                    <h3><i class="fas fa-link"></i> Share Link</h3>
                    <div class="share-link-group">
                        <input 
                            type="text" 
                            class="share-link-input" 
                            value="${link}" 
                            readonly
                            onclick="this.select()"
                        >
                        <button class="btn btn-primary" onclick="copyShareLink(this)">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                </div>

                <div class="share-section">
                    <h3><i class="fas fa-qrcode"></i> QR Code</h3>
                    <div class="share-qr">
                        <img src="${qrCode}" alt="QR Code" class="qr-image">
                        <p class="text-muted">Scan to share</p>
                    </div>
                </div>

                <div class="share-section">
                    <h3><i class="fas fa-share-nodes"></i> Share To</h3>
                    <div class="share-buttons">
                        <button class="share-btn facebook" onclick="shareToFacebook('${encodeURIComponent(link)}')">
                            <i class="fab fa-facebook"></i> Facebook
                        </button>
                        <button class="share-btn twitter" onclick="shareToTwitter('${encodeURIComponent(link)}')">
                            <i class="fab fa-twitter"></i> Twitter
                        </button>
                        <button class="share-btn whatsapp" onclick="shareToWhatsApp('${encodeURIComponent(link)}')">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </button>
                        <button class="share-btn email" onclick="shareViaEmail('${encodeURIComponent(link)}')">
                            <i class="fas fa-envelope"></i> Email
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    dialog.innerHTML = content;
    document.body.appendChild(dialog);
    
    // Close on backdrop click
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            dialog.remove();
        }
    });
    
    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dialog.remove();
        }
    }, { once: true });
}

/**
 * Copy share link
 */
async function copyShareLink(button) {
    const input = button.previousElementSibling;
    const success = await shareManager.copyToClipboard(input.value);
    
    if (success) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
        showNotification('Link copied to clipboard!', 'success');
    }
}

/**
 * Share to Facebook
 */
function shareToFacebook(url) {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
}

/**
 * Share to Twitter
 */
function shareToTwitter(url) {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${url}&text=Check%20out%20my%20music%20on%20TuneLocal!`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
}

/**
 * Share to WhatsApp
 */
function shareToWhatsApp(url) {
    const whatsappUrl = `https://api.whatsapp.com/send?text=Check%20out%20my%20music:%20${url}`;
    window.open(whatsappUrl, '_blank');
}

/**
 * Share via Email
 */
function shareViaEmail(url) {
    const mailto = `mailto:?subject=Check%20out%20my%20music%20on%20TuneLocal&body=I%20found%20this%20great%20music%20on%20TuneLocal:%20${url}`;
    window.location.href = mailto;
}

/**
 * Quick song share
 */
function quickShareSong(url, title = 'Check this out', artist = 'Unknown') {
    showShareDialog('song', { url, title, artist, platform: 'spotify' });
}

/**
 * Check for share link on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    shareManager.checkShareLink();
});
