/**
 * Mini Player for TuneLocal
 */

class MiniPlayer {
    constructor() {
        this.isMinimized = false;
        this.position = { bottom: '20px', right: '20px' };
        this.init();
    }

    init() {
        this.createMiniPlayer();
        this.setupEventListeners();
    }

    createMiniPlayer() {
        const mini = document.createElement('div');
        mini.id = 'miniPlayer';
        mini.className = 'mini-player hidden';
        mini.innerHTML = `
            <div class="mini-player-content">
                <img src="" id="miniPlayerArt" class="mini-player-art">
                <div class="mini-player-info">
                    <div class="mini-player-title">Not Playing</div>
                    <div class="mini-player-artist">-</div>
                </div>
                <div class="mini-player-controls">
                    <button onclick="miniPlayer.playPause()"><i class="fas fa-play"></i></button>
                    <button onclick="miniPlayer.next()"><i class="fas fa-step-forward"></i></button>
                    <button onclick="miniPlayer.close()"><i class="fas fa-times"></i></button>
                </div>
            </div>
        `;
        document.body.appendChild(mini);
    }

    setupEventListeners() {
        // Drag functionality
        const mini = document.getElementById('miniPlayer');
        let isDragging = false;
        let currentX, currentY, initialX, initialY;

        mini.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'I') return;
            isDragging = true;
            initialX = e.clientX - mini.offsetLeft;
            initialY = e.clientY - mini.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                mini.style.left = currentX + 'px';
                mini.style.top = currentY + 'px';
                mini.style.right = 'auto';
                mini.style.bottom = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    show() {
        document.getElementById('miniPlayer').classList.remove('hidden');
        this.isMinimized = true;
    }

    close() {
        document.getElementById('miniPlayer').classList.add('hidden');
        this.isMinimized = false;
    }

    updateInfo(track) {
        document.querySelector('.mini-player-title').textContent = track.title || 'Unknown';
        document.querySelector('.mini-player-artist').textContent = track.artist || 'Unknown Artist';
    }

    playPause() {
        const audio = document.querySelector('audio');
        if (audio) {
            if (audio.paused) audio.play();
            else audio.pause();
        }
    }

    next() {
        if (typeof nextTrack === 'function') nextTrack();
    }
}

const miniPlayer = new MiniPlayer();
window.miniPlayer = miniPlayer;
