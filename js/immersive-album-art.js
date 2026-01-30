// Immersive Album Art Display
class ImmersiveAlbumArtDisplay {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createDisplay();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .album-art-container { position: fixed; bottom: 20px; right: 20px; width: 160px; height: 160px; perspective: 1000px; z-index: 996; }
            .album-art { width: 100%; height: 100%; background: linear-gradient(135deg, var(--primary-color), rgba(29, 185, 84, 0.4)); border-radius: 16px; box-shadow: 0 20px 60px rgba(29, 185, 84, 0.4); display: flex; align-items: center; justify-content: center; font-size: 60px; animation: float 3s ease-in-out infinite; position: relative; overflow: hidden; }
            .album-art::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent); pointer-events: none; }
            .album-art::after { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(45deg, transparent 40%, rgba(29, 185, 84, 0.1) 100%); pointer-events: none; }
            @keyframes float { 0%, 100% { transform: translateY(0px) rotateZ(-2deg); } 50% { transform: translateY(-10px) rotateZ(2deg); } }
            .album-info { position: absolute; bottom: -40px; left: 0; right: 0; background: rgba(0, 0, 0, 0.8); padding: 0.75rem; border-radius: 0 0 16px 16px; color: var(--text-secondary); font-size: 11px; transition: bottom 0.3s; }
            .album-art-container:hover .album-info { bottom: 0; }
        `;
        document.head.appendChild(style);
    }
    
    createDisplay() {
        const container = document.createElement('div');
        container.className = 'album-art-container';
        container.id = 'albumArtContainer';
        
        const albumArt = document.createElement('div');
        albumArt.className = 'album-art';
        albumArt.innerHTML = `
            💿
            <div class="album-info" style="position: absolute; bottom: -40px; left: 0; right: 0; background: rgba(0, 0, 0, 0.9); padding: 0.75rem; border-radius: 0 0 16px 16px; color: var(--text-secondary); font-size: 10px;">
                <div style="color: var(--primary-color); font-weight: bold;">Album Title</div>
                <div>Artist Name</div>
            </div>
        `;
        
        container.appendChild(albumArt);
        document.body.appendChild(container);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ImmersiveAlbumArtDisplay();
});
