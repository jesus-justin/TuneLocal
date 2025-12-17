// Mobile Bottom Player functionality
class MobileBottomPlayer {
    constructor() {
        this.player = null;
        this.isActive = false;
        this.currentTrack = null;
        this.init();
    }
    
    init() {
        // Create player HTML
        const playerHTML = `
            <div class="mobile-bottom-player" id="mobileBottomPlayer">
                <div class="mobile-player-progress">
                    <div class="mobile-progress-bar" id="mobileProgressBar"></div>
                </div>
                <div class="mobile-player-content">
                    <div class="mobile-player-thumbnail">
                        <i class="fas fa-music"></i>
                    </div>
                    <div class="mobile-player-info">
                        <div class="mobile-player-title" id="mobilePlayerTitle">No track playing</div>
                        <div class="mobile-player-artist" id="mobilePlayerArtist">Select a song</div>
                    </div>
                    <div class="mobile-player-controls">
                        <button class="mobile-control-btn" onclick="mobilePlayerPrevious()">
                            <i class="fas fa-step-backward"></i>
                        </button>
                        <button class="mobile-control-btn play-btn" onclick="mobilePlayerTogglePlay()">
                            <i class="fas fa-play" id="mobilePlayIcon"></i>
                        </button>
                        <button class="mobile-control-btn" onclick="mobilePlayerNext()">
                            <i class="fas fa-step-forward"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', playerHTML);
        this.player = document.getElementById('mobileBottomPlayer');
        
        // Listen for audio player events if they exist
        this.setupAudioListeners();
    }
    
    setupAudioListeners() {
        const audioPlayer = document.getElementById('audioPlayer');
        if (audioPlayer) {
            audioPlayer.addEventListener('play', () => this.updatePlayState(true));
            audioPlayer.addEventListener('pause', () => this.updatePlayState(false));
            audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
        }
    }
    
    show(trackTitle, trackArtist) {
        this.isActive = true;
        this.currentTrack = { title: trackTitle, artist: trackArtist };
        
        document.getElementById('mobilePlayerTitle').textContent = trackTitle || 'Unknown Track';
        document.getElementById('mobilePlayerArtist').textContent = trackArtist || 'Unknown Artist';
        
        if (this.player) {
            this.player.classList.add('active');
        }
    }
    
    hide() {
        this.isActive = false;
        if (this.player) {
            this.player.classList.remove('active');
        }
    }
    
    updatePlayState(isPlaying) {
        const icon = document.getElementById('mobilePlayIcon');
        if (icon) {
            icon.classList.toggle('fa-play', !isPlaying);
            icon.classList.toggle('fa-pause', isPlaying);
        }
    }
    
    updateProgress() {
        const audioPlayer = document.getElementById('audioPlayer');
        const progressBar = document.getElementById('mobileProgressBar');
        
        if (audioPlayer && progressBar && audioPlayer.duration) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.style.width = progress + '%';
        }
    }
}

// Global functions for mobile player controls
function mobilePlayerTogglePlay() {
    const audioPlayer = document.getElementById('audioPlayer');
    if (audioPlayer) {
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    } else if (typeof togglePlay === 'function') {
        togglePlay();
    }
}

function mobilePlayerPrevious() {
    if (typeof previousTrack === 'function') {
        previousTrack();
    }
}

function mobilePlayerNext() {
    if (typeof nextTrack === 'function') {
        nextTrack();
    }
}

// Initialize mobile player
let mobilePlayer;
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on mobile devices
    if (window.innerWidth <= 768) {
        mobilePlayer = new MobileBottomPlayer();
    }
    
    // Re-initialize on resize if needed
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768 && !mobilePlayer) {
            mobilePlayer = new MobileBottomPlayer();
        }
    });
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileBottomPlayer;
}
