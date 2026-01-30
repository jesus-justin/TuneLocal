// Ambient Background Generator
class AmbientBackgroundGenerator {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.generateParticles();
        this.animate();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'ambientBg';
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.cssText = `position: fixed; top: 0; left: 0; z-index: -1; opacity: 0.15;`;
        this.ctx = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.firstChild);
        
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }
    
    generateParticles() {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                color: `hsl(${Math.random() * 120 + 140}, 100%, 60%)`
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((p, idx) => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
            
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw connections
            for (let j = idx + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                if (dist < 100) {
                    this.ctx.strokeStyle = `rgba(29, 185, 84, ${0.2 * (1 - dist/100)})`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AmbientBackgroundGenerator();
});
