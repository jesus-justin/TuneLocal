// Smart Shuffle Modes
class SmartShuffleModes {
    constructor() {
        this.shuffleModes = ['Random', 'By Genre', 'By Decade', 'By Artist', 'By Energy', 'Discovery'];
        this.currentMode = localStorage.getItem('shuffleMode') || 'Random';
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createShuffleControl();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .shuffle-control { position: fixed; bottom: 180px; right: 20px; background: linear-gradient(135deg, rgba(29, 185, 84, 0.15), rgba(29, 185, 84, 0.05)); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1rem; min-width: 200px; z-index: 995; display: none; backdrop-filter: blur(10px); animation: slideUp 0.3s ease; }
            .shuffle-control.open { display: block; }
            .shuffle-title { color: var(--primary-color); font-weight: bold; margin-bottom: 0.75rem; font-size: 13px; }
            .shuffle-mode-btn { width: 100%; padding: 0.6rem; margin-bottom: 0.5rem; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(29, 185, 84, 0.2); border-radius: 6px; color: var(--text-secondary); cursor: pointer; font-size: 12px; transition: all 0.2s; }
            .shuffle-mode-btn:hover { background: rgba(29, 185, 84, 0.2); border-color: var(--primary-color); }
            .shuffle-mode-btn.active { background: rgba(29, 185, 84, 0.3); color: var(--primary-color); font-weight: bold; }
            .shuffle-toggle { width: 50px; height: 50px; background: linear-gradient(135deg, var(--primary-color), rgba(29, 185, 84, 0.6)); border: 2px solid var(--primary-color); border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; margin-bottom: 0; font-size: 20px; transition: all 0.3s; box-shadow: 0 4px 15px rgba(29, 185, 84, 0.3); }
            .shuffle-toggle:hover { transform: scale(1.1); }
            @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `;
        document.head.appendChild(style);
    }
    
    createShuffleControl() {
        const toggle = document.createElement('button');
        toggle.className = 'shuffle-toggle';
        toggle.innerHTML = '🔀';
        toggle.id = 'shuffleToggle';
        toggle.title = 'Shuffle Modes';
        document.body.appendChild(toggle);
        
        const control = document.createElement('div');
        control.className = 'shuffle-control';
        control.id = 'shuffleControl';
        
        let html = '<div class="shuffle-title">Shuffle Mode</div>';
        this.shuffleModes.forEach(mode => {
            const active = mode === this.currentMode ? 'active' : '';
            html += `<button class="shuffle-mode-btn ${active}" onclick="document.smartShuffle.setMode('${mode}')">${mode}</button>`;
        });
        
        control.innerHTML = html;
        document.body.appendChild(control);
        
        toggle.addEventListener('click', () => {
            control.classList.toggle('open');
        });
        
        document.smartShuffle = this;
    }
    
    setMode(mode) {
        this.currentMode = mode;
        localStorage.setItem('shuffleMode', mode);
        
        document.querySelectorAll('.shuffle-mode-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SmartShuffleModes();
});
