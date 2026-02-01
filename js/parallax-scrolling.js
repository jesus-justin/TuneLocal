// Parallax Scrolling Effects
class ParallaxScrolling {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
        this.setupParallax();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .parallax-container { position: relative; overflow: hidden; }
            .parallax-layer { position: absolute; width: 100%; height: 100%; }
            .parallax-bg { transform: translateZ(-1px) scale(2); }
            .parallax-mid { transform: translateZ(-0.5px) scale(1.5); }
            .parallax-fg { transform: translateZ(0); }
            .parallax-element { transition: transform 0.1s ease-out; will-change: transform; }
        `;
        document.head.appendChild(style);
    }
    
    setupParallax() {
        // Add parallax to hero sections
        const heroes = document.querySelectorAll('.hero, [class*="hero"]');
        heroes.forEach(hero => {
            hero.classList.add('parallax-container');
            this.createParallaxLayers(hero);
        });
        
        // Scroll listener for parallax effect
        window.addEventListener('scroll', () => {
            this.updateParallax();
        });
        
        // Mouse move for subtle parallax
        document.addEventListener('mousemove', (e) => {
            this.updateMouseParallax(e);
        });
    }
    
    createParallaxLayers(container) {
        const elements = container.querySelectorAll('h1, h2, p, img, .btn');
        elements.forEach((el, idx) => {
            el.classList.add('parallax-element');
            el.setAttribute('data-parallax-speed', (idx % 3 + 1) * 0.3);
        });
    }
    
    updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax-speed') || 0.5);
            const yPos = -(scrolled * speed);
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }
    
    updateMouseParallax(e) {
        const cards = document.querySelectorAll('.card, .feature-card');
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardX = (rect.left + rect.width / 2) / window.innerWidth - 0.5;
            const cardY = (rect.top + rect.height / 2) / window.innerHeight - 0.5;
            
            const deltaX = (mouseX - cardX) * 20;
            const deltaY = (mouseY - cardY) * 20;
            
            card.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParallaxScrolling();
});
