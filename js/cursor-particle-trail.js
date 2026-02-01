// Cursor Particle Trail
class CursorParticleTrail {
    constructor() {
        this.particles = [];
        this.maxParticles = 30;
        this.canvas = null;
        this.ctx = null;
        this.mouse = { x: 0, y: 0 };
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.setupListeners();
        this.animate();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'cursorTrailCanvas';
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.cssText = 'position: fixed; top: 0; left: 0; z-index: 9999; pointer-events: none;';
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
        
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }
    
    setupListeners() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.createParticle();
        });
    }
    
    createParticle() {
        if (this.particles.length >= this.maxParticles) {
            this.particles.shift();
        }
        
        const colors = ['#1db954', '#1ed760', '#4ade80', '#22c55e'];
        this.particles.push({
            x: this.mouse.x,
            y: this.mouse.y,
            size: Math.random() * 5 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            particle.life -= 0.02;
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.size *= 0.98;
            
            if (particle.life <= 0 || particle.size < 0.5) {
                this.particles.splice(index, 1);
                return;
            }
            
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CursorParticleTrail();
});
