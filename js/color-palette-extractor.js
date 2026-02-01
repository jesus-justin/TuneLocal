// Dynamic Color Palette Extractor
class ColorPaletteExtractor {
    constructor() {
        this.currentPalette = [];
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createPaletteDisplay();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .color-palette-display { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 30px; padding: 0.75rem 1.5rem; z-index: 994; backdrop-filter: blur(10px); display: flex; gap: 0.75rem; align-items: center; transition: all 0.3s; }
            .palette-color { width: 35px; height: 35px; border-radius: 50%; cursor: pointer; transition: all 0.3s; border: 2px solid rgba(255,255,255,0.2); position: relative; }
            .palette-color:hover { transform: scale(1.3); box-shadow: 0 0 20px currentColor; }
            .palette-color::after { content: ''; position: absolute; inset: -4px; border-radius: 50%; border: 2px solid transparent; transition: border-color 0.3s; }
            .palette-color:hover::after { border-color: rgba(255,255,255,0.3); animation: pulse-ring 1s infinite; }
            @keyframes pulse-ring { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.7; } }
            .palette-label { color: var(--text-secondary); font-size: 12px; font-weight: bold; }
        `;
        document.head.appendChild(style);
    }
    
    createPaletteDisplay() {
        const display = document.createElement('div');
        display.className = 'color-palette-display';
        display.id = 'colorPaletteDisplay';
        
        const colors = ['#1db954', '#1ed760', '#4ade80', '#22c55e', '#10b981'];
        
        let html = '<span class="palette-label">🎨 Theme</span>';
        colors.forEach((color, idx) => {
            html += `<div class="palette-color" style="background: ${color};" data-color="${color}" title="Click to apply"></div>`;
        });
        
        display.innerHTML = html;
        document.body.appendChild(display);
        
        display.querySelectorAll('.palette-color').forEach(colorEl => {
            colorEl.addEventListener('click', () => {
                this.applyColor(colorEl.getAttribute('data-color'));
            });
        });
        
        this.animateColors();
    }
    
    applyColor(color) {
        document.documentElement.style.setProperty('--primary-color', color);
        
        // Create visual feedback
        const flash = document.createElement('div');
        flash.style.cssText = `position: fixed; inset: 0; background: ${color}; opacity: 0.3; z-index: 99999; pointer-events: none; animation: color-flash 0.5s;`;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 500);
        
        const style = document.createElement('style');
        style.textContent = `@keyframes color-flash { 0%, 100% { opacity: 0; } 50% { opacity: 0.3; } }`;
        document.head.appendChild(style);
    }
    
    animateColors() {
        const colors = document.querySelectorAll('.palette-color');
        colors.forEach((color, idx) => {
            color.style.animation = `float 3s ease-in-out ${idx * 0.2}s infinite`;
        });
        
        const style = document.createElement('style');
        style.textContent = `@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }`;
        document.head.appendChild(style);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ColorPaletteExtractor();
});
