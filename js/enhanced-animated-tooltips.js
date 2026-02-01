// Enhanced Animated Tooltips
class EnhancedTooltips {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
        this.setupTooltips();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .tooltip-enhanced { position: relative; }
            .tooltip-content { position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%) translateY(10px); background: linear-gradient(135deg, rgba(29, 185, 84, 0.95), rgba(22, 163, 74, 0.95)); color: white; padding: 0.75rem 1rem; border-radius: 8px; font-size: 13px; white-space: nowrap; opacity: 0; pointer-events: none; transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); box-shadow: 0 10px 30px rgba(29, 185, 84, 0.3); z-index: 10001; }
            .tooltip-content::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 6px solid transparent; border-top-color: rgba(29, 185, 84, 0.95); }
            .tooltip-enhanced:hover .tooltip-content { opacity: 1; transform: translateX(-50%) translateY(0); }
            .tooltip-content.show { animation: tooltip-bounce 0.5s; }
            @keyframes tooltip-bounce { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-5px); } }
        `;
        document.head.appendChild(style);
    }
    
    setupTooltips() {
        const elements = document.querySelectorAll('[title], [data-tooltip]');
        elements.forEach(el => {
            const text = el.getAttribute('data-tooltip') || el.getAttribute('title');
            if (!text) return;
            
            el.removeAttribute('title');
            el.classList.add('tooltip-enhanced');
            
            const tooltip = document.createElement('span');
            tooltip.className = 'tooltip-content';
            tooltip.textContent = text;
            el.appendChild(tooltip);
            
            el.addEventListener('mouseenter', () => {
                tooltip.classList.add('show');
            });
            
            el.addEventListener('mouseleave', () => {
                tooltip.classList.remove('show');
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => new EnhancedTooltips(), 500);
});
