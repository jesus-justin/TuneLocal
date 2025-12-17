// Scroll-triggered Animations
class ScrollAnimations {
    constructor() {
        this.elements = [];
        this.init();
    }
    
    init() {
        // Add animation classes to elements
        this.setupAnimationElements();
        
        // Create Intersection Observer
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        // Observe all animation elements
        this.elements.forEach(el => this.observer.observe(el));
        
        // Add parallax effect to hero section
        this.setupParallax();
    }
    
    setupAnimationElements() {
        // Animate stat cards
        document.querySelectorAll('.stat-card').forEach((card, index) => {
            card.classList.add('scroll-animate', 'fade-in-up');
            card.style.animationDelay = `${index * 0.1}s`;
            this.elements.push(card);
        });
        
        // Animate preset cards
        document.querySelectorAll('.preset-card').forEach((card, index) => {
            card.classList.add('scroll-animate', 'fade-in-up');
            card.style.animationDelay = `${index * 0.1}s`;
            this.elements.push(card);
        });
        
        // Animate service cards
        document.querySelectorAll('.service-card').forEach((card, index) => {
            card.classList.add('scroll-animate', 'fade-in-up');
            card.style.animationDelay = `${index * 0.1}s`;
            this.elements.push(card);
        });
        
        // Animate discover cards
        document.querySelectorAll('.discover-card').forEach((card, index) => {
            card.classList.add('scroll-animate', 'fade-in-up');
            card.style.animationDelay = `${(index % 3) * 0.1}s`;
            this.elements.push(card);
        });
        
        // Animate section headers
        document.querySelectorAll('.section-header').forEach(header => {
            header.classList.add('scroll-animate', 'fade-in-down');
            this.elements.push(header);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Optionally unobserve after animation
                // this.observer.unobserve(entry.target);
            }
        });
    }
    
    setupParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            if (scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
            }
        });
    }
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', function() {
    new ScrollAnimations();
});
