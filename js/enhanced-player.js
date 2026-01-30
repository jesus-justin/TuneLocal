// Enhanced Music Player Controls
class EnhancedPlayerControls {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createControlsUI();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .enhanced-player-controls {
                display: flex;
                align-items: center;
                gap: 1.5rem;
                padding: 1rem;
                background: rgba(40, 40, 40, 0.7);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                margin: 1rem 0;
            }
            
            .control-group {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .volume-control {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                min-width: 150px;
            }
            
            .volume-slider {
                flex: 1;
                height: 4px;
                border-radius: 2px;
                background: rgba(29, 185, 84, 0.3);
                outline: none;
                cursor: pointer;
                transition: background 0.2s ease;
            }
            
            .volume-slider:hover {
                background: rgba(29, 185, 84, 0.5);
            }
            
            .volume-value {
                min-width: 35px;
                text-align: right;
                color: var(--text-secondary);
                font-size: 0.9rem;
            }
            
            .speed-control {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                background: rgba(29, 185, 84, 0.15);
                border-radius: 8px;
            }
            
            .speed-btn {
                background: none;
                border: none;
                color: var(--text-primary);
                cursor: pointer;
                padding: 0.25rem 0.5rem;
                font-size: 0.9rem;
                transition: color 0.2s ease;
            }
            
            .speed-btn:hover {
                color: var(--primary-color);
            }
        `;
        document.head.appendChild(style);
    }
    
    createControlsUI() {
        const player = document.getElementById('audioPlayer');
        if (!player) return;
        
        const container = player.parentElement;
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'enhanced-player-controls';
        
        controlsDiv.innerHTML = `
            <div class="control-group">
                <i class="fas fa-volume-up" style="color: var(--primary-color)"></i>
                <div class="volume-control">
                    <input type="range" class="volume-slider" id="volumeSlider" min="0" max="100" value="100">
                    <span class="volume-value" id="volumeValue">100%</span>
                </div>
            </div>
            
            <div class="control-group">
                <span style="color: var(--text-secondary); font-size: 0.9rem;">Speed</span>
                <div class="speed-control">
                    <button class="speed-btn" onclick="setPlaybackSpeed(0.75)">0.75x</button>
                    <button class="speed-btn" onclick="setPlaybackSpeed(1)" style="color: var(--primary-color);">1x</button>
                    <button class="speed-btn" onclick="setPlaybackSpeed(1.25)">1.25x</button>
                    <button class="speed-btn" onclick="setPlaybackSpeed(1.5)">1.5x</button>
                </div>
            </div>
        `;
        
        container.insertBefore(controlsDiv, player);
        
        // Setup volume control
        const volumeSlider = controlsDiv.querySelector('#volumeSlider');
        const volumeValue = controlsDiv.querySelector('#volumeValue');
        
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value;
            player.volume = volume / 100;
            volumeValue.textContent = volume + '%';
        });
    }
}

function setPlaybackSpeed(speed) {
    const player = document.getElementById('audioPlayer');
    if (player) {
        player.playbackRate = speed;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new EnhancedPlayerControls();
    }, 500);
});
