// Staggered Grid Animations
class StaggeredAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.observeGrids();
    }
    
    observeGrids() {
        const grids = document.querySelectorAll('.preset-cards, .discover-grid, .music-tracks, .stats-container');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateChildren(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        grids.forEach(grid => {
            const children = grid.children;
            Array.from(children).forEach((child, index) => {
                child.style.opacity = '0';
                child.style.transform = 'translateY(30px) scale(0.9)';
                child.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
            });
            observer.observe(grid);
        });
    }
    
    animateChildren(grid) {
        const children = grid.children;
        Array.from(children).forEach(child => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0) scale(1)';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Delay initialization to let DOM fully load
    setTimeout(() => {
        new StaggeredAnimations();
    }, 500);
});
