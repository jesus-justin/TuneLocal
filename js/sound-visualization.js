// Advanced Sound Visualization
class SoundVisualization {
    constructor() {
        this.visualizations = {
            'bars': this.createBarsVisualizer,
            'wave': this.createWaveVisualizer,
            'circle': this.createCircleVisualizer,
            'frequency': this.createFrequencyVisualizer,
            'spectrum': this.createSpectrumVisualizer
        };
        this.currentVis = 'bars';
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.init();
    }

    init() {
        this.setupVisualization();
        this.setupControls();
    }

    setupVisualization() {
        const canvas = document.createElement('canvas');
        canvas.id = 'soundVisualizerCanvas';
        canvas.width = 800;
        canvas.height = 400;
        canvas.className = 'sound-visualizer';
        
        const existing = document.getElementById('soundVisualizerCanvas');
        if (existing) existing.remove();
        
        const container = document.querySelector('.player-container') || document.body;
        container.appendChild(canvas);

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        } catch (e) {
            console.warn('Web Audio API not available', e);
        }
    }

    setupControls() {
        const controlPanel = document.createElement('div');
        controlPanel.className = 'visualizer-controls';
        controlPanel.innerHTML = `
            <div class="vis-selector">
                ${Object.keys(this.visualizations).map(key => `
                    <button class="vis-btn" data-vis="${key}">${key}</button>
                `).join('')}
            </div>
            <div class="vis-settings">
                <label>Speed: <input type="range" id="visSpeed" min="0.1" max="3" value="1" step="0.1" /></label>
                <label>Scale: <input type="range" id="visScale" min="0.5" max="2" value="1" step="0.1" /></label>
                <label><input type="checkbox" id="visSmooth" /> Smooth</label>
            </div>
        `;

        document.body.appendChild(controlPanel);

        document.querySelectorAll('.vis-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentVis = btn.getAttribute('data-vis');
                document.querySelectorAll('.vis-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.startVisualization();
            });
        });
    }

    startVisualization() {
        const canvas = document.getElementById('soundVisualizerCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const animate = () => {
            ctx.fillStyle = 'rgba(20, 20, 30, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (this.analyser) {
                this.analyser.getByteFrequencyData(this.dataArray);
            } else {
                // Generate mock data if Web Audio API unavailable
                for (let i = 0; i < this.dataArray.length; i++) {
                    this.dataArray[i] = Math.sin(Date.now() / 1000 + i) * 128 + 128;
                }
            }

            const method = this.visualizations[this.currentVis];
            method.call(this, ctx, canvas, this.dataArray);

            requestAnimationFrame(animate);
        };

        animate();
    }

    createBarsVisualizer(ctx, canvas, data) {
        const barWidth = canvas.width / data.length;
        const scale = parseFloat(document.getElementById('visScale')?.value || 1);

        data.forEach((value, i) => {
            const barHeight = (value / 255) * canvas.height * scale;
            const hue = (i / data.length * 360);
            
            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
            ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
        });
    }

    createWaveVisualizer(ctx, canvas, data) {
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        ctx.beginPath();

        const sliceWidth = canvas.width / data.length;
        let x = 0;

        for (let i = 0; i < data.length; i++) {
            const v = data[i] / 128;
            const y = (v * canvas.height) / 2;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);

            x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
    }

    createCircleVisualizer(ctx, canvas, data) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 50;

        data.forEach((value, i) => {
            const angle = (i / data.length) * Math.PI * 2;
            const barLength = (value / 255) * 100;

            const x1 = centerX + Math.cos(angle) * radius;
            const y1 = centerY + Math.sin(angle) * radius;
            const x2 = centerX + Math.cos(angle) * (radius + barLength);
            const y2 = centerY + Math.sin(angle) * (radius + barLength);

            const hue = (angle * 180 / Math.PI);
            ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        });
    }

    createFrequencyVisualizer(ctx, canvas, data) {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#ff0088');
        gradient.addColorStop(0.5, '#0088ff');
        gradient.addColorStop(1, '#00ff88');

        ctx.fillStyle = gradient;
        const barWidth = canvas.width / data.length;

        for (let i = 0; i < data.length; i++) {
            const barHeight = (data[i] / 255) * canvas.height;
            ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
        }
    }

    createSpectrumVisualizer(ctx, canvas, data) {
        ctx.fillStyle = 'rgba(0, 255, 136, 0.3)';
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;

        const step = Math.floor(data.length / 64);
        ctx.beginPath();

        for (let i = 0; i < data.length; i += step) {
            const x = (i / data.length) * canvas.width;
            const y = canvas.height - (data[i] / 255) * canvas.height;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}

const soundVisualization = new SoundVisualization();
window.soundVisualization = soundVisualization;
