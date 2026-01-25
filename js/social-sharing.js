/**
 * Social Sharing System
 */

class SocialSharing {
    constructor() {
        this.init();
    }

    init() {
        this.createShareButtons();
    }

    createShareButtons() {
        // Add share buttons to player
        const btn = document.createElement('button');
        btn.className = 'player-control-btn';
        btn.innerHTML = '<i class="fas fa-share-alt"></i>';
        btn.title = 'Share Track';
        btn.onclick = () => this.shareCurrentTrack();

        const playerControls = document.querySelector('.player-controls');
        if (playerControls) {
            playerControls.appendChild(btn);
        }
    }

    shareCurrentTrack() {
        const track = this.getCurrentTrack();
        if (!track) return;

        const shareData = {
            title: `Now Playing: ${track.title}`,
            text: `Check out "${track.title}" by ${track.artist}`,
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData);
        } else {
            this.fallbackShare(shareData);
        }
    }

    shareToSocial(platform) {
        const track = this.getCurrentTrack();
        if (!track) return;

        const text = `Check out "${track.title}" by ${track.artist} on TuneLocal 🎵`;
        const url = window.location.href;

        const urls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
        };

        if (urls[platform]) {
            window.open(urls[platform], '_blank');
        }
    }

    getCurrentTrack() {
        if (window.currentPlaylist && window.currentTrackIndex !== undefined) {
            return window.currentPlaylist[window.currentTrackIndex];
        }
        return null;
    }

    fallbackShare(data) {
        const text = `${data.text}\n${data.url}`;
        navigator.clipboard.writeText(text);
        if (typeof showNotification === 'function') {
            showNotification('Copied to clipboard!', 'success');
        }
    }
}

const socialSharing = new SocialSharing();
window.socialSharing = socialSharing;
