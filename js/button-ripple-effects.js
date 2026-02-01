// Button Ripple Effects
class ButtonRippleEffect {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
        this.setupButtons();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .ripple-btn { position: relative; overflow: hidden; }
            .ripple { position: absolute; border-radius: 50%; background: rgba(255, 255, 255, 0.6); transform: scale(0); animation: ripple-animation 0.6s ease-out; pointer-events: none; }
            @keyframes ripple-animation { to { transform: scale(4); opacity: 0; } }
        `;
        document.head.appendChild(style);
    }
    
    setupButtons() {
        const buttons = document.querySelectorAll('button, .btn, a.nav-link');
        buttons.forEach(btn => {
            if (!btn.classList.contains('ripple-btn')) {
                btn.classList.add('ripple-btn');
                btn.addEventListener('click', (e) => this.createRipple(e, btn));
            }
        });
    }
    
    createRipple(event, button) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ButtonRippleEffect();
});
