// Enhanced Card Tilt Effect - 3D mouse tracking
class CardTiltEffect {
    constructor() {
        this.cards = [];
        this.init();
    }
    
    init() {
        // Select cards to apply tilt effect
        const cardSelectors = '.preset-card, .service-card, .stat-card';
        this.cards = document.querySelectorAll(cardSelectors);
        
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, card));
            card.style.transition = 'transform 0.1s ease';
        });
    }
    
    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale3d(1.05, 1.05, 1.05)
        `;
    }
    
    handleMouseLeave(e, card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CardTiltEffect();
});
