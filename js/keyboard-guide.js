// Keyboard Shortcuts Guide Modal
class KeyboardShortcutsGuide {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createModal();
        this.setupListeners();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .shortcuts-modal {
                display: none;
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.7);
                z-index: 2000;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(5px);
            }
            
            .shortcuts-modal.active {
                display: flex;
            }
            
            .shortcuts-content {
                background: var(--bg-card);
                border-radius: 16px;
                padding: 2rem;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                border: 1px solid rgba(29, 185, 84, 0.3);
                animation: slideUp 0.3s ease;
            }
            
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .shortcuts-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
            }
            
            .shortcuts-close {
                background: none;
                border: none;
                color: var(--text-primary);
                font-size: 24px;
                cursor: pointer;
            }
            
            .shortcut-group {
                margin-bottom: 2rem;
            }
            
            .shortcut-group h3 {
                color: var(--primary-color);
                margin-bottom: 1rem;
                font-size: 1.2rem;
            }
            
            .shortcut-item {
                display: flex;
                justify-content: space-between;
                padding: 0.75rem 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .shortcut-key {
                background: rgba(29, 185, 84, 0.2);
                padding: 0.5rem 1rem;
                border-radius: 6px;
                font-family: monospace;
                color: var(--primary-color);
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
    }
    
    createModal() {
        const modal = document.createElement('div');
        modal.className = 'shortcuts-modal';
        modal.id = 'shortcutsModal';
        
        modal.innerHTML = `
            <div class="shortcuts-content">
                <div class="shortcuts-header">
                    <h2>Keyboard Shortcuts</h2>
                    <button class="shortcuts-close" onclick="document.getElementById('shortcutsModal').classList.remove('active')">✕</button>
                </div>
                
                <div class="shortcut-group">
                    <h3><i class="fas fa-music"></i> Navigation</h3>
                    <div class="shortcut-item">
                        <span>Home</span>
                        <span class="shortcut-key">H</span>
                    </div>
                    <div class="shortcut-item">
                        <span>Spotify</span>
                        <span class="shortcut-key">S</span>
                    </div>
                    <div class="shortcut-item">
                        <span>YouTube</span>
                        <span class="shortcut-key">Y</span>
                    </div>
                </div>
                
                <div class="shortcut-group">
                    <h3><i class="fas fa-play"></i> Playback</h3>
                    <div class="shortcut-item">
                        <span>Play/Pause</span>
                        <span class="shortcut-key">Space</span>
                    </div>
                    <div class="shortcut-item">
                        <span>Next Track</span>
                        <span class="shortcut-key">→</span>
                    </div>
                    <div class="shortcut-item">
                        <span>Previous Track</span>
                        <span class="shortcut-key">←</span>
                    </div>
                </div>
                
                <div class="shortcut-group">
                    <h3><i class="fas fa-search"></i> Search</h3>
                    <div class="shortcut-item">
                        <span>Focus Search</span>
                        <span class="shortcut-key">/</span>
                    </div>
                    <div class="shortcut-item">
                        <span>Show This Modal</span>
                        <span class="shortcut-key">?</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    setupListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === '?') {
                document.getElementById('shortcutsModal').classList.add('active');
            }
            if (e.key === 'Escape') {
                document.getElementById('shortcutsModal').classList.remove('active');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new KeyboardShortcutsGuide();
});
