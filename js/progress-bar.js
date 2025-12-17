// Top Progress Bar Handler
class ProgressBar {
    constructor() {
        this.bar = null;
        this.init();
    }
    
    init() {
        // Create progress bar HTML
        const barHTML = `
            <div class="progress-bar-container">
                <div class="progress-bar" id="topProgressBar"></div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', barHTML);
        this.bar = document.getElementById('topProgressBar');
        
        // Show on page load
        this.showPageLoad();
    }
    
    showPageLoad() {
        if (this.bar) {
            this.bar.classList.add('page-load');
            
            setTimeout(() => {
                this.bar.classList.remove('page-load');
                this.bar.style.width = '0%';
            }, 2000);
        }
    }
    
    show() {
        if (this.bar) {
            this.bar.classList.add('loading');
            this.bar.style.width = '0%';
        }
    }
    
    setProgress(percent) {
        if (this.bar) {
            this.bar.classList.remove('loading');
            this.bar.style.width = percent + '%';
        }
    }
    
    complete() {
        if (this.bar) {
            this.bar.classList.remove('loading');
            this.bar.style.width = '100%';
            
            setTimeout(() => {
                this.bar.style.width = '0%';
            }, 300);
        }
    }
    
    hide() {
        if (this.bar) {
            this.bar.classList.remove('loading');
            this.bar.style.width = '0%';
        }
    }
}

// Initialize progress bar
let progressBar;
document.addEventListener('DOMContentLoaded', function() {
    progressBar = new ProgressBar();
});

// Show progress bar for fetch requests
if (typeof window !== 'undefined') {
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        if (progressBar) {
            progressBar.show();
        }
        
        return originalFetch.apply(this, args)
            .then(response => {
                if (progressBar) {
                    progressBar.complete();
                }
                return response;
            })
            .catch(error => {
                if (progressBar) {
                    progressBar.hide();
                }
                throw error;
            });
    };
}
