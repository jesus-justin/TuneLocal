// Enhanced Tooltip System
class EnhancedTooltips {
    constructor() {
        this.tooltip = null;
        this.init();
    }
    
    init() {
        // Create tooltip element
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'enhanced-tooltip';
        document.body.appendChild(this.tooltip);
        
        // Add styles
        this.addStyles();
        
        // Setup listeners for all elements with title or data-tooltip
        this.setupListeners();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .enhanced-tooltip {
                position: fixed;
                padding: 0.5rem 1rem;
                background: rgba(20, 20, 20, 0.95);
                backdrop-filter: blur(10px);
                color: white;
                border-radius: 8px;
                font-size: 0.875rem;
                pointer-events: none;
                z-index: 10000;
                opacity: 0;
                transform: translateY(5px);
                transition: opacity 0.2s ease, transform 0.2s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                white-space: nowrap;
                max-width: 250px;
            }
            
            .enhanced-tooltip.show {
                opacity: 1;
                transform: translateY(0);
            }
            
            .enhanced-tooltip::before {
                content: '';
                position: absolute;
                top: -4px;
                left: 50%;
                transform: translateX(-50%);
                width: 8px;
                height: 8px;
                background: rgba(20, 20, 20, 0.95);
                transform: translateX(-50%) rotate(45deg);
            }
        `;
        document.head.appendChild(style);
    }
    
    setupListeners() {
        // Find all elements with title or data-tooltip
        const updateTooltips = () => {
            const elements = document.querySelectorAll('[title], [data-tooltip]');
            elements.forEach(el => {
                // Store original title
                if (el.title && !el.dataset.tooltip) {
                    el.dataset.tooltip = el.title;
                    el.removeAttribute('title');
                }
                
                // Remove old listeners to avoid duplicates
                el.removeEventListener('mouseenter', this.show);
                el.removeEventListener('mouseleave', this.hide);
                el.removeEventListener('mousemove', this.move);
                
                // Add new listeners
                el.addEventListener('mouseenter', this.show.bind(this));
                el.addEventListener('mouseleave', this.hide.bind(this));
                el.addEventListener('mousemove', this.move.bind(this));
            });
        };
        
        // Initial setup
        updateTooltips();
        
        // Re-scan on DOM changes
        const observer = new MutationObserver(updateTooltips);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    show(e) {
        const text = e.currentTarget.dataset.tooltip;
        if (!text) return;
        
        this.tooltip.textContent = text;
        this.tooltip.classList.add('show');
        this.move(e);
    }
    
    hide() {
        this.tooltip.classList.remove('show');
    }
    
    move(e) {
        const x = e.clientX;
        const y = e.clientY;
        
        // Position tooltip above cursor
        this.tooltip.style.left = x + 'px';
        this.tooltip.style.top = (y - this.tooltip.offsetHeight - 10) + 'px';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedTooltips();
});
