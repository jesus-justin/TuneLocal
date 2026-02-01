// Smooth Page Transitions
class PageTransitions {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
        this.setupTransitions();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .section { opacity: 0; transform: translateY(50px); transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
            .section.active { opacity: 1; transform: translateY(0); }
            .section.slide-out { opacity: 0; transform: translateX(-100px); }
            .page-transition-overlay { position: fixed; inset: 0; background: linear-gradient(135deg, rgba(29, 185, 84, 0.95), rgba(16, 163, 127, 0.95)); z-index: 99999; display: flex; align-items: center; justify-content: center; pointer-events: none; opacity: 0; transition: opacity 0.4s; }
            .page-transition-overlay.active { opacity: 1; }
            .transition-logo { font-size: 48px; animation: bounce 0.6s infinite; }
            @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        `;
        document.head.appendChild(style);
    }
    
    setupTransitions() {
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.innerHTML = '<div class="transition-logo">🎵</div>';
        document.body.appendChild(overlay);
        
        // Observe section changes
        const originalShowSection = window.showSection;
        if (originalShowSection) {
            window.showSection = (sectionId) => {
                this.transitionTo(sectionId, originalShowSection);
            };
        }
    }
    
    transitionTo(sectionId, callback) {
        const overlay = document.querySelector('.page-transition-overlay');
        const currentSection = document.querySelector('.section.active');
        
        // Show overlay
        overlay.classList.add('active');
        
        // Slide out current section
        if (currentSection) {
            currentSection.classList.add('slide-out');
        }
        
        setTimeout(() => {
            // Execute original function
            if (callback) callback(sectionId);
            
            // Hide overlay
            overlay.classList.remove('active');
            
            // Remove slide-out class
            if (currentSection) {
                currentSection.classList.remove('slide-out');
            }
        }, 400);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PageTransitions();
});
