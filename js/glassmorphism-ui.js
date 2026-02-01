// Glassmorphism UI Effects
class GlassmorphismUI {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
        this.applyGlassEffect();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .glass-effect { background: rgba(255, 255, 255, 0.05) !important; backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1); }
            .glass-effect-strong { background: rgba(255, 255, 255, 0.08) !important; backdrop-filter: blur(30px) saturate(200%); -webkit-backdrop-filter: blur(30px) saturate(200%); border: 1px solid rgba(255, 255, 255, 0.15); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15); }
            .glass-card { position: relative; overflow: hidden; }
            .glass-card::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); transition: left 0.6s; }
            .glass-card:hover::before { left: 100%; }
            .glass-shine { position: absolute; top: -50%; right: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); pointer-events: none; animation: glass-shine-rotate 10s linear infinite; }
            @keyframes glass-shine-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `;
        document.head.appendChild(style);
    }
    
    applyGlassEffect() {
        // Apply to cards and panels
        const glassElements = document.querySelectorAll('.card, .panel, .modal, .dropdown, .sidebar');
        glassElements.forEach(el => {
            if (!el.classList.contains('glass-effect')) {
                el.classList.add('glass-effect', 'glass-card');
                
                const shine = document.createElement('div');
                shine.className = 'glass-shine';
                el.appendChild(shine);
            }
        });
        
        // Apply strong effect to modals
        const modals = document.querySelectorAll('.modal, .overlay, [class*="popup"]');
        modals.forEach(modal => {
            modal.classList.add('glass-effect-strong');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GlassmorphismUI();
});
