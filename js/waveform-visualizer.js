// Waveform Audio Visualizer
class WaveformVisualizer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.bars = 64;
        this.barData = [];
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createCanvas();
        this.animate();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .waveform-canvas { position: fixed; bottom: 200px; left: 50%; transform: translateX(-50%); width: 400px; height: 100px; border-radius: 12px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(29, 185, 84, 0.3); z-index: 990; }
        `;
        document.head.appendChild(style);
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'waveform-canvas';
        this.canvas.width = 400;
        this.canvas.height = 100;
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
        
        for (let i = 0; i < this.bars; i++) {
            this.barData.push(Math.random());
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const barWidth = this.canvas.width / this.bars;
        
        this.barData.forEach((height, i) => {
            this.barData[i] += (Math.random() - 0.5) * 0.2;
            this.barData[i] = Math.max(0.1, Math.min(1, this.barData[i]));
            
            const barHeight = this.barData[i] * this.canvas.height * 0.8;
            const x = i * barWidth;
            const y = (this.canvas.height - barHeight) / 2;
            
            const gradient = this.ctx.createLinearGradient(x, y, x, y + barHeight);
            gradient.addColorStop(0, '#1db954');
            gradient.addColorStop(0.5, '#1ed760');
            gradient.addColorStop(1, '#4ade80');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WaveformVisualizer();
});
