// Advanced Sound Visualizer
class AdvancedVisualizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createVisualizer();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `.sound-visualizer { display: flex; align-items: flex-end; gap: 4px; justify-content: center; height: 80px; padding: 1.5rem; background: rgba(30, 30, 30, 0.7); border-radius: 12px; margin: 1rem 0; backdrop-filter: blur(10px); border: 1px solid rgba(29, 185, 84, 0.2); } .viz-bar { width: 8px; background: linear-gradient(to top, #1db954, #4ade80); border-radius: 4px; min-height: 15px; animation: vizBounce 0.4s ease infinite; } @keyframes vizBounce { 0%, 100% { height: 15px; transform: scaleY(0.5); } 50% { height: 70px; transform: scaleY(1); } }`;
        document.head.appendChild(style);
    }
    
    createVisualizer() {
        let vizDiv = document.querySelector('.sound-visualizer');
        
        if (!vizDiv) {
            vizDiv = document.createElement('div');
            vizDiv.className = 'sound-visualizer';
            
            for (let i = 0; i < 20; i++) {
                const bar = document.createElement('div');
                bar.className = 'viz-bar';
                bar.style.animationDelay = (i * 0.05) + 's';
                vizDiv.appendChild(bar);
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => new AdvancedVisualizer(), 1500);
});
