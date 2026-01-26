// Card Hover Parallax Effect
class CardParallax {
    constructor() {
        this.init();
    }
    
    init() {
        const cards = document.querySelectorAll('.music-card, .discover-card, .playlist-item');
        
        cards.forEach(card => {
            // Add parallax layer
            const content = card.querySelector('h3, h4, .discover-card-title');
            if (content) {
                content.style.transition = 'transform 0.3s ease';
            }
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const moveX = ((x - centerX) / centerX) * 10;
                const moveY = ((y - centerY) / centerY) * 10;
                
                if (content) {
                    content.style.transform = `translate(${moveX}px, ${moveY}px)`;
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (content) {
                    content.style.transform = 'translate(0, 0)';
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new CardParallax();
    }, 1000);
});
