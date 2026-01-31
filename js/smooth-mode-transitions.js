// Smooth Dark/Light Mode Transitions
class SmoothModeTransitions {
    constructor() {
        this.isDarkMode = localStorage.getItem('darkMode') !== 'false';
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createToggle();
        this.applyMode();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            body { transition: background-color 0.6s ease, color 0.6s ease; }
            * { transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease; }
            .mode-toggle-btn { position: fixed; top: 20px; left: 20px; width: 50px; height: 50px; background: linear-gradient(135deg, var(--primary-color), rgba(29, 185, 84, 0.6)); border: 2px solid var(--primary-color); border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 997; font-size: 22px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(29, 185, 84, 0.3); }
            .mode-toggle-btn:hover { transform: scale(1.1) rotate(20deg); box-shadow: 0 6px 20px rgba(29, 185, 84, 0.5); }
            body.light-mode { --bg-primary: #f5f5f5; --bg-secondary: #ffffff; --text-primary: #333333; --text-secondary: #666666; }
            body.dark-mode { --bg-primary: #121212; --bg-secondary: #1e1e1e; --text-primary: #ffffff; --text-secondary: #a0a0a0; }
        `;
        document.head.appendChild(style);
    }
    
    createToggle() {
        const btn = document.createElement('button');
        btn.className = 'mode-toggle-btn';
        btn.id = 'modeToggle';
        btn.innerHTML = this.isDarkMode ? '🌙' : '☀️';
        document.body.appendChild(btn);
        
        btn.addEventListener('click', () => {
            this.toggleMode();
        });
    }
    
    toggleMode() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('darkMode', this.isDarkMode);
        this.applyMode();
        
        const btn = document.getElementById('modeToggle');
        btn.innerHTML = this.isDarkMode ? '🌙' : '☀️';
        btn.style.transform = 'scale(1.1) rotate(20deg)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 300);
    }
    
    applyMode() {
        if (this.isDarkMode) {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SmoothModeTransitions();
});
