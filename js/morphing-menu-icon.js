// Morphing Menu Icon
class MorphingMenuIcon {
    constructor() {
        this.isOpen = false;
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createMenuIcon();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .morphing-menu-btn { position: fixed; top: 20px; right: 80px; width: 50px; height: 50px; background: linear-gradient(135deg, var(--primary-color), rgba(29, 185, 84, 0.7)); border: none; border-radius: 12px; cursor: pointer; z-index: 9998; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 12px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(29, 185, 84, 0.3); }
            .morphing-menu-btn:hover { transform: scale(1.1); box-shadow: 0 6px 20px rgba(29, 185, 84, 0.5); }
            .menu-line { width: 26px; height: 3px; background: white; border-radius: 2px; transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
            .morphing-menu-btn.open .menu-line:nth-child(1) { transform: translateY(9px) rotate(45deg); }
            .morphing-menu-btn.open .menu-line:nth-child(2) { opacity: 0; transform: translateX(-20px); }
            .morphing-menu-btn.open .menu-line:nth-child(3) { transform: translateY(-9px) rotate(-45deg); }
            .morphing-menu-panel { position: fixed; top: 0; right: -400px; width: 350px; height: 100vh; background: linear-gradient(135deg, rgba(30, 30, 30, 0.98), rgba(20, 20, 20, 0.98)); backdrop-filter: blur(20px); z-index: 9997; transition: right 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); padding: 5rem 2rem; box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5); }
            .morphing-menu-panel.open { right: 0; }
            .menu-item-morph { padding: 1rem; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 18px; cursor: pointer; border-radius: 8px; transition: all 0.3s; transform: translateX(50px); opacity: 0; }
            .morphing-menu-panel.open .menu-item-morph { transform: translateX(0); opacity: 1; }
            .morphing-menu-panel.open .menu-item-morph:nth-child(1) { transition-delay: 0.1s; }
            .morphing-menu-panel.open .menu-item-morph:nth-child(2) { transition-delay: 0.2s; }
            .morphing-menu-panel.open .menu-item-morph:nth-child(3) { transition-delay: 0.3s; }
            .morphing-menu-panel.open .menu-item-morph:nth-child(4) { transition-delay: 0.4s; }
            .menu-item-morph:hover { background: rgba(29, 185, 84, 0.2); color: var(--primary-color); transform: translateX(10px); }
        `;
        document.head.appendChild(style);
    }
    
    createMenuIcon() {
        const btn = document.createElement('button');
        btn.className = 'morphing-menu-btn';
        btn.innerHTML = `
            <span class="menu-line"></span>
            <span class="menu-line"></span>
            <span class="menu-line"></span>
        `;
        document.body.appendChild(btn);
        
        const panel = document.createElement('div');
        panel.className = 'morphing-menu-panel';
        panel.innerHTML = `
            <div class="menu-item-morph" onclick="showSection('home')">🏠 Home</div>
            <div class="menu-item-morph" onclick="showSection('spotify')">🎵 Spotify</div>
            <div class="menu-item-morph" onclick="showSection('youtube')">▶️ YouTube</div>
            <div class="menu-item-morph" onclick="showSection('playlists')">📋 Playlists</div>
        `;
        document.body.appendChild(panel);
        
        btn.addEventListener('click', () => {
            this.isOpen = !this.isOpen;
            btn.classList.toggle('open');
            panel.classList.toggle('open');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MorphingMenuIcon();
});
