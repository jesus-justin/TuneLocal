// Global Keyboard Shortcuts
class GlobalKeyboardShortcuts {
    constructor() {
        this.shortcuts = {
            ' ': 'Play/Pause',
            'ArrowRight': 'Next Track',
            'ArrowLeft': 'Previous Track',
            'ArrowUp': 'Volume Up',
            'ArrowDown': 'Volume Down',
            'm': 'Mute/Unmute',
            'l': 'Toggle Lyrics',
            'q': 'Toggle Queue',
            'f': 'Toggle Fullscreen'
        };
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createShortcutsPanel();
        this.setupListeners();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .shortcuts-panel { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.9); z-index: 10000; display: none; align-items: center; justify-content: center; }
            .shortcuts-panel.show { display: flex; }
            .shortcuts-content { background: linear-gradient(135deg, rgba(30, 30, 30, 0.98), rgba(20, 20, 20, 0.98)); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 16px; padding: 2rem; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto; }
            .shortcuts-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
            .shortcuts-title { color: var(--primary-color); font-size: 20px; font-weight: bold; }
            .shortcuts-close { background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 24px; }
            .shortcut-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(0, 0, 0, 0.3); border-radius: 8px; margin-bottom: 0.75rem; }
            .shortcut-key { background: rgba(29, 185, 84, 0.2); border: 1px solid var(--primary-color); color: var(--primary-color); padding: 0.5rem 1rem; border-radius: 6px; font-family: monospace; font-weight: bold; }
            .shortcut-desc { color: var(--text-secondary); font-size: 14px; }
            .shortcuts-hint { position: fixed; bottom: 20px; right: 140px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 8px; padding: 0.5rem 1rem; font-size: 12px; color: var(--text-secondary); z-index: 999; }
        `;
        document.head.appendChild(style);
    }
    
    createShortcutsPanel() {
        const panel = document.createElement('div');
        panel.className = 'shortcuts-panel';
        panel.id = 'shortcutsPanel';
        
        let html = `
            <div class="shortcuts-content">
                <div class="shortcuts-header">
                    <span class="shortcuts-title">⌨️ Keyboard Shortcuts</span>
                    <button class="shortcuts-close" onclick="document.getElementById('shortcutsPanel').classList.remove('show')">✕</button>
                </div>
        `;
        
        Object.entries(this.shortcuts).forEach(([key, desc]) => {
            const displayKey = key === ' ' ? 'Space' : key;
            html += `
                <div class="shortcut-item">
                    <span class="shortcut-desc">${desc}</span>
                    <span class="shortcut-key">${displayKey}</span>
                </div>
            `;
        });
        
        html += '</div>';
        panel.innerHTML = html;
        document.body.appendChild(panel);
        
        const hint = document.createElement('div');
        hint.className = 'shortcuts-hint';
        hint.textContent = 'Press ? for shortcuts';
        document.body.appendChild(hint);
    }
    
    setupListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            if (e.key === '?') {
                document.getElementById('shortcutsPanel').classList.toggle('show');
                e.preventDefault();
            }
            
            if (this.shortcuts[e.key]) {
                console.log('Shortcut activated:', this.shortcuts[e.key]);
                e.preventDefault();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GlobalKeyboardShortcuts();
});
