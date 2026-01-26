// Top Loading Progress Bar
class TopProgressBar {
    constructor() {
        this.progress = 0;
        this.isLoading = false;
        this.init();
    }
    
    init() {
        // Create progress bar element
        const progressBar = document.createElement('div');
        progressBar.className = 'top-progress-bar';
        progressBar.innerHTML = '<div class="top-progress-fill"></div>';
        document.body.insertBefore(progressBar, document.body.firstChild);
        
        this.bar = progressBar;
        this.fill = progressBar.querySelector('.top-progress-fill');
        
        // Add CSS
        this.addStyles();
        
        // Listen for page load events
        this.setupListeners();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .top-progress-bar {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                z-index: 9999;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .top-progress-bar.active {
                opacity: 1;
            }
            
            .top-progress-fill {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #1db954, #1ed760, #4facfe);
                box-shadow: 0 0 10px rgba(29, 185, 84, 0.5);
                transition: width 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }
    
    setupListeners() {
        // Show progress on navigation
        const links = document.querySelectorAll('.nav-link, a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', () => {
                this.start();
                setTimeout(() => this.complete(), 500);
            });
        });
        
        // Show progress on button clicks
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                if (!button.onclick || button.onclick.toString().includes('showSection')) {
                    return;
                }
                this.start();
                setTimeout(() => this.complete(), 800);
            });
        });
    }
    
    start() {
        this.isLoading = true;
        this.progress = 0;
        this.bar.classList.add('active');
        this.update(30);
        
        // Simulate progress
        this.interval = setInterval(() => {
            if (this.progress < 90) {
                this.update(this.progress + Math.random() * 10);
            }
        }, 200);
    }
    
    update(progress) {
        this.progress = Math.min(progress, 100);
        this.fill.style.width = this.progress + '%';
    }
    
    complete() {
        clearInterval(this.interval);
        this.update(100);
        setTimeout(() => {
            this.bar.classList.remove('active');
            this.isLoading = false;
        }, 300);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.topProgressBar = new TopProgressBar();
});
