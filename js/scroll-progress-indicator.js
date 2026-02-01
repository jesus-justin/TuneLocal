// Scroll Progress Indicator
class ScrollProgressIndicator {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createIndicator();
        this.setupScroll();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .scroll-progress { position: fixed; top: 0; left: 0; width: 100%; height: 4px; z-index: 10000; background: rgba(29, 185, 84, 0.1); }
            .scroll-progress-bar { height: 100%; background: linear-gradient(90deg, #1db954, #1ed760, #4ade80); width: 0%; transition: width 0.1s; box-shadow: 0 0 10px rgba(29, 185, 84, 0.6); }
            .scroll-progress-circle { position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px; z-index: 9999; cursor: pointer; }
            .scroll-progress-ring { transform: rotate(-90deg); }
            .scroll-progress-ring circle { fill: none; stroke-width: 4; }
            .scroll-progress-ring .bg-circle { stroke: rgba(29, 185, 84, 0.2); }
            .scroll-progress-ring .progress-circle { stroke: #1db954; stroke-dasharray: 188; stroke-dashoffset: 188; transition: stroke-dashoffset 0.2s; stroke-linecap: round; }
            .scroll-progress-icon { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 24px; cursor: pointer; transition: transform 0.3s; }
            .scroll-progress-circle:hover .scroll-progress-icon { transform: translate(-50%, -50%) scale(1.2); }
        `;
        document.head.appendChild(style);
    }
    
    createIndicator() {
        // Linear progress bar
        const linearBar = document.createElement('div');
        linearBar.className = 'scroll-progress';
        linearBar.innerHTML = '<div class="scroll-progress-bar"></div>';
        document.body.appendChild(linearBar);
        
        // Circular progress
        const circleProgress = document.createElement('div');
        circleProgress.className = 'scroll-progress-circle';
        circleProgress.innerHTML = `
            <svg class="scroll-progress-ring" width="60" height="60">
                <circle class="bg-circle" cx="30" cy="30" r="26"></circle>
                <circle class="progress-circle" cx="30" cy="30" r="26"></circle>
            </svg>
            <div class="scroll-progress-icon">⬆️</div>
        `;
        document.body.appendChild(circleProgress);
        
        circleProgress.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    setupScroll() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            
            // Update linear bar
            const bar = document.querySelector('.scroll-progress-bar');
            if (bar) bar.style.width = scrollPercent + '%';
            
            // Update circular progress
            const circle = document.querySelector('.progress-circle');
            if (circle) {
                const circumference = 2 * Math.PI * 26;
                const offset = circumference - (scrollPercent / 100) * circumference;
                circle.style.strokeDashoffset = offset;
            }
            
            // Show/hide circle based on scroll
            const circleContainer = document.querySelector('.scroll-progress-circle');
            if (circleContainer) {
                circleContainer.style.opacity = scrollTop > 300 ? '1' : '0';
                circleContainer.style.pointerEvents = scrollTop > 300 ? 'auto' : 'none';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ScrollProgressIndicator();
});
