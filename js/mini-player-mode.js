// Mini Player Mode
class MiniPlayerMode {
    constructor() {
        this.isMinimized = false;
        this.position = this.loadPosition();
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createMiniPlayer();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .mini-player { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, rgba(30, 30, 30, 0.98), rgba(20, 20, 20, 0.98)); border: 1px solid rgba(29, 185, 84, 0.4); border-radius: 16px; padding: 1rem 1.5rem; z-index: 1001; backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4); min-width: 400px; transition: all 0.3s; }
            .mini-player.dragging { cursor: move; opacity: 0.8; }
            .mini-player-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; cursor: move; }
            .mini-player-title { color: var(--primary-color); font-weight: bold; font-size: 13px; }
            .mini-player-controls { display: flex; gap: 0.5rem; }
            .mini-player-btn { background: transparent; border: 1px solid rgba(255, 255, 255, 0.2); color: var(--text-secondary); width: 24px; height: 24px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; transition: all 0.2s; }
            .mini-player-btn:hover { background: var(--primary-color); color: white; border-color: var(--primary-color); }
            .mini-player-track { display: flex; gap: 1rem; align-items: center; margin-bottom: 0.75rem; }
            .mini-player-artwork { width: 50px; height: 50px; border-radius: 8px; background: linear-gradient(135deg, var(--primary-color), #4ade80); display: flex; align-items: center; justify-content: center; font-size: 24px; }
            .mini-player-info { flex: 1; }
            .mini-player-track-name { color: var(--text-primary); font-size: 14px; font-weight: 500; margin-bottom: 0.25rem; }
            .mini-player-artist { color: var(--text-secondary); font-size: 12px; }
            .mini-player-playback { display: flex; gap: 0.75rem; align-items: center; justify-content: center; }
            .mini-player-play-btn { background: var(--primary-color); border: none; color: white; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; transition: all 0.2s; }
            .mini-player-play-btn:hover { transform: scale(1.1); box-shadow: 0 4px 12px rgba(29, 185, 84, 0.4); }
            .mini-player-time { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.75rem; }
            .mini-player-time-text { color: var(--text-secondary); font-size: 11px; }
            .mini-player-progress { flex: 1; height: 4px; background: rgba(0, 0, 0, 0.3); border-radius: 2px; overflow: hidden; }
            .mini-player-progress-fill { height: 100%; background: var(--primary-color); border-radius: 2px; width: 45%; transition: width 0.3s; }
            .mini-player-volume { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; }
            .mini-player-volume-icon { color: var(--text-secondary); font-size: 14px; }
            .mini-player-volume-slider { flex: 1; height: 4px; border-radius: 2px; background: rgba(0, 0, 0, 0.3); outline: none; -webkit-appearance: none; }
            .mini-player-volume-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; background: var(--primary-color); cursor: pointer; }
        `;
        document.head.appendChild(style);
    }
    
    createMiniPlayer() {
        const player = document.createElement('div');
        player.className = 'mini-player';
        player.id = 'miniPlayer';
        player.style.left = this.position.x;
        player.style.bottom = this.position.y;
        player.style.transform = 'none';
        
        player.innerHTML = `
            <div class="mini-player-header" id="miniPlayerHeader">
                <span class="mini-player-title">🎵 Mini Player</span>
                <div class="mini-player-controls">
                    <button class="mini-player-btn" title="Minimize">−</button>
                    <button class="mini-player-btn" title="Close" onclick="document.getElementById('miniPlayer').style.display='none'">×</button>
                </div>
            </div>
            
            <div class="mini-player-track">
                <div class="mini-player-artwork">🎸</div>
                <div class="mini-player-info">
                    <div class="mini-player-track-name">Summer Vibes</div>
                    <div class="mini-player-artist">DJ Cool</div>
                </div>
            </div>
            
            <div class="mini-player-playback">
                <button class="mini-player-btn">⏮</button>
                <button class="mini-player-play-btn">▶</button>
                <button class="mini-player-btn">⏭</button>
                <button class="mini-player-btn">🔀</button>
                <button class="mini-player-btn">🔁</button>
            </div>
            
            <div class="mini-player-time">
                <span class="mini-player-time-text">1:23</span>
                <div class="mini-player-progress">
                    <div class="mini-player-progress-fill"></div>
                </div>
                <span class="mini-player-time-text">3:45</span>
            </div>
            
            <div class="mini-player-volume">
                <span class="mini-player-volume-icon">🔊</span>
                <input type="range" class="mini-player-volume-slider" min="0" max="100" value="75">
            </div>
        `;
        document.body.appendChild(player);
        
        this.makeDraggable(player);
    }
    
    makeDraggable(element) {
        const header = document.getElementById('miniPlayerHeader');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            element.classList.add('dragging');
            initialX = e.clientX - element.offsetLeft;
            initialY = e.clientY - element.offsetTop;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                
                element.style.left = currentX + 'px';
                element.style.bottom = 'auto';
                element.style.top = currentY + 'px';
                element.style.transform = 'none';
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.classList.remove('dragging');
                this.position = {
                    x: element.style.left,
                    y: element.style.top
                };
                this.savePosition();
            }
        });
    }
    
    loadPosition() {
        const stored = localStorage.getItem('miniPlayerPosition');
        return stored ? JSON.parse(stored) : { x: '50%', y: '20px' };
    }
    
    savePosition() {
        localStorage.setItem('miniPlayerPosition', JSON.stringify(this.position));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MiniPlayerMode();
});
