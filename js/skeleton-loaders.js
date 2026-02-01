// Skeleton Loading Screens
class SkeletonLoaders {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .skeleton { background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(29, 185, 84, 0.15) 50%, rgba(255,255,255,0.05) 75%); background-size: 200% 100%; animation: skeleton-loading 1.5s infinite; border-radius: 8px; }
            @keyframes skeleton-loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
            .skeleton-card { height: 200px; margin-bottom: 1rem; }
            .skeleton-text { height: 16px; margin-bottom: 0.5rem; }
            .skeleton-text.short { width: 60%; }
            .skeleton-circle { width: 60px; height: 60px; border-radius: 50%; }
            .skeleton-btn { height: 40px; width: 120px; border-radius: 20px; }
            .loading-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; padding: 2rem; }
        `;
        document.head.appendChild(style);
    }
    
    createCardSkeleton() {
        return `
            <div class="skeleton skeleton-card"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text short"></div>
        `;
    }
    
    showLoading(container, count = 4) {
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const div = document.createElement('div');
            div.innerHTML = this.createCardSkeleton();
            container.appendChild(div);
        }
    }
    
    hideLoading(container, content) {
        if (!container) return;
        setTimeout(() => {
            container.innerHTML = content;
        }, 800);
    }
}

document.skeletonLoader = new SkeletonLoaders();
