// Cursor Trail Effect
class CursorTrail {
    constructor() {
        this.dots = [];
        this.maxDots = 12;
        this.init();
    }
    
    init() {
        // Create trail container
        const container = document.createElement('div');
        container.className = 'cursor-trail-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
        `;
        document.body.appendChild(container);
        
        // Create dots
        for (let i = 0; i < this.maxDots; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail-dot';
            dot.style.cssText = `
                position: absolute;
                width: ${10 - i * 0.5}px;
                height: ${10 - i * 0.5}px;
                border-radius: 50%;
                background: rgba(29, 185, 84, ${1 - i * 0.08});
                pointer-events: none;
                transition: transform 0.2s ease, opacity 0.3s ease;
                opacity: 0;
                box-shadow: 0 0 10px rgba(29, 185, 84, 0.5);
            `;
            container.appendChild(dot);
            this.dots.push({
                element: dot,
                x: 0,
                y: 0
            });
        }
        
        // Track mouse movement
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Animate trail
        const animate = () => {
            this.dots.forEach((dot, index) => {
                if (index === 0) {
                    dot.x = mouseX;
                    dot.y = mouseY;
                } else {
                    const prevDot = this.dots[index - 1];
                    dot.x += (prevDot.x - dot.x) * 0.3;
                    dot.y += (prevDot.y - dot.y) * 0.3;
                }
                
                dot.element.style.transform = `translate(${dot.x}px, ${dot.y}px)`;
                dot.element.style.opacity = '1';
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
        
        // Hide on mobile
        if (window.innerWidth <= 768) {
            container.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Only on desktop
    if (window.innerWidth > 768) {
        new CursorTrail();
    }
});
