// Floating Mini Music Player
class FloatingMiniPlayer {
    constructor() {
        this.isVisible = false;
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createPlayer();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .floating-mini-player {
                position: fixed;
                bottom: 100px;
                right: 20px;
                width: 320px;
                background: rgba(30, 30, 30, 0.95);
                backdrop-filter: blur(15px);
                border: 1px solid rgba(29, 185, 84, 0.3);
                border-radius: 12px;
                padding: 1rem;
                z-index: 1000;
                opacity: 0;
                pointer-events: none;
                transform: translateY(20px) scale(0.9);
                transition: all 0.3s ease;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            }
            
            .floating-mini-player.active {
                opacity: 1;
                pointer-events: all;
                transform: translateY(0) scale(1);
            }
            
            .mini-player-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 0.75rem;
            }
            
            .mini-player-title {
                font-weight: 600;
                color: var(--primary-color);
                font-size: 0.95rem;
            }
            
            .mini-player-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                font-size: 18px;
            }
            
            .mini-track-info {
                text-align: center;
                margin-bottom: 1rem;
            }
            
            .mini-track-name {
                font-weight: 500;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-bottom: 0.25rem;
            }
            
            .mini-track-artist {
                font-size: 0.85rem;
                color: var(--text-secondary);
            }
            
            .mini-controls {
                display: flex;
                gap: 0.75rem;
                justify-content: center;
            }
            
            .mini-control-btn {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: rgba(29, 185, 84, 0.2);
                border: none;
                color: var(--primary-color);
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .mini-control-btn:hover {
                background: rgba(29, 185, 84, 0.4);
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(style);
    }
    
    createPlayer() {
        const player = document.createElement('div');
        player.className = 'floating-mini-player';
        player.id = 'floatingMiniPlayer';
        
        player.innerHTML = `
            <div class="mini-player-header">
                <span class="mini-player-title"><i class="fas fa-music"></i> Now Playing</span>
                <button class="mini-player-close" onclick="document.getElementById('floatingMiniPlayer').classList.remove('active')">✕</button>
            </div>
            <div class="mini-track-info">
                <div class="mini-track-name">Track Name</div>
                <div class="mini-track-artist">Artist</div>
            </div>
            <div class="mini-controls">
                <button class="mini-control-btn" onclick="previousTrack ? previousTrack() : null">
                    <i class="fas fa-step-backward"></i>
                </button>
                <button class="mini-control-btn" onclick="togglePlay ? togglePlay() : null">
                    <i class="fas fa-play"></i>
                </button>
                <button class="mini-control-btn" onclick="nextTrack ? nextTrack() : null">
                    <i class="fas fa-step-forward"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(player);
    }
}

window.floatingMiniPlayer = new FloatingMiniPlayer();

document.addEventListener('DOMContentLoaded', () => {
    // Add toggle button for floating player
    const fab = document.querySelector('.fab-button');
    if (fab) {
        fab.insertAdjacentHTML('afterend', `
            <button style="position: fixed; bottom: 130px; right: 20px; width: 45px; height: 45px; border-radius: 50%; background: linear-gradient(135deg, #f093fb, #f5576c); border: none; color: white; cursor: pointer; z-index: 1000; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); display: flex; align-items: center; justify-content: center; font-size: 18px; transition: transform 0.3s ease;" onclick="document.getElementById('floatingMiniPlayer').classList.toggle('active')">
                <i class="fas fa-play-circle"></i>
            </button>
        `);
    }
});
