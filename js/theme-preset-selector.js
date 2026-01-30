// Theme Preset Selector
class ThemePresetSelector {
    constructor() {
        this.presets = {
            dark: { '--primary-color': '#1db954', '--bg-primary': '#121212', '--text-primary': '#ffffff' },
            midnight: { '--primary-color': '#7c3aed', '--bg-primary': '#0f0f1e', '--text-primary': '#e0e0e0' },
            ocean: { '--primary-color': '#06b6d4', '--bg-primary': '#0c2a3a', '--text-primary': '#e0f2fe' },
            sunset: { '--primary-color': '#f97316', '--bg-primary': '#2a1810', '--text-primary': '#fef5e7' },
            forest: { '--primary-color': '#10b981', '--bg-primary': '#0a2e1f', '--text-primary': '#ecfdf5' },
            neon: { '--primary-color': '#ec4899', '--bg-primary': '#1a0b2e', '--text-primary': '#fdf2f8' }
        };
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createSelector();
        this.loadSavedTheme();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .theme-preset-btn { position: fixed; bottom: 100px; right: 20px; width: 50px; height: 50px; background: linear-gradient(135deg, var(--primary-color), rgba(29, 185, 84, 0.6)); border: 2px solid var(--primary-color); border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 998; font-size: 20px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(29, 185, 84, 0.3); }
            .theme-preset-btn:hover { transform: scale(1.1); box-shadow: 0 6px 20px rgba(29, 185, 84, 0.5); }
            .theme-preset-menu { position: fixed; bottom: 160px; right: 20px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1rem; display: none; z-index: 999; min-width: 200px; backdrop-filter: blur(10px); }
            .theme-preset-menu.open { display: block; animation: slideUp 0.3s ease; }
            .preset-option { padding: 0.75rem; margin-bottom: 0.5rem; background: rgba(0, 0, 0, 0.3); border-radius: 8px; cursor: pointer; font-size: 13px; color: var(--text-secondary); transition: all 0.2s; }
            .preset-option:hover { background: rgba(29, 185, 84, 0.2); color: var(--primary-color); }
            .preset-option.active { background: rgba(29, 185, 84, 0.3); color: var(--primary-color); font-weight: bold; }
            @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `;
        document.head.appendChild(style);
    }
    
    createSelector() {
        const btn = document.createElement('button');
        btn.className = 'theme-preset-btn';
        btn.innerHTML = '🎨';
        btn.id = 'themePresetBtn';
        document.body.appendChild(btn);
        
        const menu = document.createElement('div');
        menu.className = 'theme-preset-menu';
        menu.id = 'themePresetMenu';
        menu.innerHTML = `<div style="color: var(--primary-color); font-weight: bold; margin-bottom: 0.75rem;">Themes</div>` + 
            Object.keys(this.presets).map(name => 
                `<div class="preset-option" data-theme="${name}">${name.charAt(0).toUpperCase() + name.slice(1)}</div>`
            ).join('');
        document.body.appendChild(menu);
        
        btn.addEventListener('click', () => {
            menu.classList.toggle('open');
        });
        
        menu.querySelectorAll('.preset-option').forEach(opt => {
            opt.addEventListener('click', (e) => {
                const theme = e.target.dataset.theme;
                this.applyTheme(theme);
                menu.querySelectorAll('.preset-option').forEach(o => o.classList.remove('active'));
                e.target.classList.add('active');
                localStorage.setItem('selectedTheme', theme);
            });
        });
    }
    
    applyTheme(themeName) {
        const theme = this.presets[themeName];
        if (!theme) return;
        
        Object.entries(theme).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });
    }
    
    loadSavedTheme() {
        const saved = localStorage.getItem('selectedTheme') || 'dark';
        this.applyTheme(saved);
        
        const option = document.querySelector(`[data-theme="${saved}"]`);
        if (option) option.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ThemePresetSelector();
});
