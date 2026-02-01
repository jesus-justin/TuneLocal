// Animated Counters for Statistics
class AnimatedCounters {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
        this.observeCounters();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .counter-animated { font-variant-numeric: tabular-nums; }
            .counter-container { display: inline-block; }
        `;
        document.head.appendChild(style);
    }
    
    observeCounters() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    this.animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        document.querySelectorAll('[data-count]').forEach(el => {
            observer.observe(el);
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count') || element.textContent.replace(/[^0-9]/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    }
    
    createDemoCounters() {
        const stats = document.querySelector('.stats-section, .statistics');
        if (!stats) return;
        
        const counters = stats.querySelectorAll('.stat-number, .count, [class*="number"]');
        counters.forEach(counter => {
            const value = counter.textContent.trim();
            if (/^\d+$/.test(value)) {
                counter.setAttribute('data-count', value);
                counter.classList.add('counter-animated');
                counter.textContent = '0';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const counters = new AnimatedCounters();
    counters.createDemoCounters();
});
