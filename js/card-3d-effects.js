// 3D Card Hover Effects
class Card3DEffects {
    constructor() {
        this.cards = [];
        this.init();
    }
    
    init() {
        this.addStyles();
        this.setupCards();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .card-3d-effect { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-style: preserve-3d; perspective: 1000px; }
            .card-3d-effect:hover { transform: translateY(-15px) rotateX(5deg) rotateY(5deg) scale(1.05); box-shadow: 0 25px 50px rgba(29, 185, 84, 0.4), 0 0 30px rgba(29, 185, 84, 0.2); z-index: 10; }
            .card-3d-effect::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent); opacity: 0; transition: opacity 0.4s; pointer-events: none; border-radius: inherit; }
            .card-3d-effect:hover::before { opacity: 1; }
            .card-3d-effect::after { content: ''; position: absolute; inset: -2px; background: linear-gradient(45deg, var(--primary-color), transparent, var(--primary-color)); border-radius: inherit; z-index: -1; opacity: 0; transition: opacity 0.4s; filter: blur(10px); }
            .card-3d-effect:hover::after { opacity: 0.6; animation: glow-pulse 1.5s infinite; }
            @keyframes glow-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        `;
        document.head.appendChild(style);
    }
    
    setupCards() {
        // Add effect to common card elements
        const selectors = ['.card', '.feature-card', '.playlist-card', '.track-card', '.album-card'];
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(card => {
                card.classList.add('card-3d-effect');
                this.addMouseTracker(card);
            });
        });
    }
    
    addMouseTracker(card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `translateY(-15px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Card3DEffects();
});
