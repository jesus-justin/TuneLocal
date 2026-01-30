// Theme Color Accent Customizer
class ThemeAccentPicker {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createPicker();
        this.loadSavedAccent();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .accent-picker-btn {
                position: fixed;
                bottom: 80px;
                left: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border: none;
                color: white;
                cursor: pointer;
                z-index: 1001;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                transition: transform 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
            }
            
            .accent-picker-btn:hover {
                transform: scale(1.1);
            }
            
            .accent-picker-panel {
                position: fixed;
                bottom: 150px;
                left: 20px;
                background: var(--bg-card);
                border: 1px solid rgba(29, 185, 84, 0.3);
                border-radius: 12px;
                padding: 1rem;
                z-index: 1000;
                opacity: 0;
                pointer-events: none;
                transform: translateY(20px);
                transition: all 0.3s ease;
                min-width: 200px;
            }
            
            .accent-picker-panel.active {
                opacity: 1;
                pointer-events: all;
                transform: translateY(0);
            }
            
            .accent-picker-title {
                font-weight: 600;
                margin-bottom: 1rem;
                color: var(--primary-color);
            }
            
            .accent-color-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
            }
            
            .accent-color-btn {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 3px solid transparent;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .accent-color-btn:hover {
                transform: scale(1.1);
            }
            
            .accent-color-btn.active {
                border-color: white;
                box-shadow: 0 0 10px currentColor;
            }
        `;
        document.head.appendChild(style);
    }
    
    createPicker() {
        const btn = document.createElement('button');
        btn.className = 'accent-picker-btn';
        btn.innerHTML = '<i class="fas fa-palette"></i>';
        btn.onclick = () => this.togglePanel();
        document.body.appendChild(btn);
        
        const panel = document.createElement('div');
        panel.className = 'accent-picker-panel';
        panel.id = 'accentPickerPanel';
        
        const accents = [
            '#1db954', '#ff0050', '#ff0000', '#4facfe',
            '#667eea', '#764ba2', '#f093fb', '#f5576c',
            '#00f2fe', '#ffa500', '#ff1493', '#20b2aa'
        ];
        
        panel.innerHTML = `
            <div class="accent-picker-title">Theme Accent</div>
            <div class="accent-color-grid">
                ${accents.map(color => `
                    <button class="accent-color-btn" 
                            style="background: ${color}" 
                            onclick="setThemeAccent('${color}')"
                            data-color="${color}">
                    </button>
                `).join('')}
            </div>
        `;
        
        document.body.appendChild(panel);
    }
    
    togglePanel() {
        const panel = document.getElementById('accentPickerPanel');
        panel.classList.toggle('active');
    }
    
    loadSavedAccent() {
        const saved = localStorage.getItem('themeAccent') || '#1db954';
        setThemeAccent(saved);
    }
}

function setThemeAccent(color) {
    document.documentElement.style.setProperty('--primary-color', color);
    localStorage.setItem('themeAccent', color);
    
    // Update active button
    document.querySelectorAll('.accent-color-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.color === color);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    new ThemeAccentPicker();
});
