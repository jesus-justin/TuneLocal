// Animated SVG Icons
class AnimatedSVGIcons {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createAnimatedIcons();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .svg-icon-animated { display: inline-block; transition: all 0.3s; }
            .svg-icon-animated:hover { transform: scale(1.2) rotate(10deg); }
            .svg-icon-animated svg { width: 100%; height: 100%; }
            .svg-path-animated { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: svg-draw 2s ease forwards; }
            @keyframes svg-draw { to { stroke-dashoffset: 0; } }
            .pulse-icon { animation: pulse-scale 2s infinite; }
            @keyframes pulse-scale { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
            .rotate-icon { animation: rotate-360 3s linear infinite; }
            @keyframes rotate-360 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .bounce-icon { animation: bounce-up 1s infinite; }
            @keyframes bounce-up { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        `;
        document.head.appendChild(style);
    }
    
    createAnimatedIcons() {
        // Music note icon
        const musicIcon = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path class="svg-path-animated" d="M9 18V5l12-2v13M9 13l12-2"/>
                <circle cx="6" cy="18" r="3"/>
                <circle cx="18" cy="16" r="3"/>
            </svg>
        `;
        
        // Play icon
        const playIcon = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
            </svg>
        `;
        
        // Heart icon
        const heartIcon = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path class="svg-path-animated" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
        `;
        
        // Replace existing icons
        this.replaceIcons('.fa-music', musicIcon, 'pulse-icon');
        this.replaceIcons('.fa-play', playIcon, 'bounce-icon');
        this.replaceIcons('.fa-heart', heartIcon, 'pulse-icon');
    }
    
    replaceIcons(selector, svgContent, animationClass) {
        document.querySelectorAll(selector).forEach(icon => {
            if (!icon.classList.contains('svg-icon-replaced')) {
                const wrapper = document.createElement('span');
                wrapper.className = `svg-icon-animated ${animationClass}`;
                wrapper.style.width = '1em';
                wrapper.style.height = '1em';
                wrapper.innerHTML = svgContent;
                
                icon.parentNode.insertBefore(wrapper, icon);
                icon.style.display = 'none';
                icon.classList.add('svg-icon-replaced');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => new AnimatedSVGIcons(), 1000);
});
