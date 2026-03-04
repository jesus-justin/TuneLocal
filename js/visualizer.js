/**
 * TuneLocal Audio Visualizer
 * Real-time audio waveform visualization
 * Version 1.0.1 - Enhanced visualization features
 */

class AudioVisualizer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.bufferLength = 0;
        this.animationId = null;
        this.isActive = false;
        this.colorScheme = 'gradient';
    }

    /**
     * Initialize visualizer
     */
    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas element not found');
            return false;
        }

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        return true;
    }

    /**
     * Resize canvas to fit container
     */
    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight || 200;
    }

    /**
     * Connect to audio element
     */
    connectAudio(audioElement) {
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.analyser = this.audioContext.createAnalyser();
                this.analyser.fftSize = 256;
                this.bufferLength = this.analyser.frequencyBinCount;
                this.dataArray = new Uint8Array(this.bufferLength);
            }

            const source = this.audioContext.createMediaElementSource(audioElement);
            source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            return true;
        } catch (error) {
            console.error('Failed to connect audio:', error);
            return false;
        }
    }

    /**
     * Start visualization
     */
    start() {
        if (this.isActive) return;
        this.isActive = true;
        this.draw();
    }

    /**
     * Stop visualization
     */
    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.clear();
    }

    /**
     * Clear canvas
     */
    clear() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    /**
     * Draw visualization
     */
    draw() {
        if (!this.isActive) return;

        this.animationId = requestAnimationFrame(() => this.draw());

        if (!this.analyser || !this.dataArray) return;

        this.analyser.getByteFrequencyData(this.dataArray);

        // Clear canvas with fade effect
        this.ctx.fillStyle = 'rgba(18, 18, 18, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const barWidth = (this.canvas.width / this.bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < this.bufferLength; i++) {
            barHeight = (this.dataArray[i] / 255) * this.canvas.height * 0.8;

            // Color based on scheme
            if (this.colorScheme === 'gradient') {
                const hue = (i / this.bufferLength) * 360;
                this.ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
            } else if (this.colorScheme === 'spotify') {
                this.ctx.fillStyle = '#1db954';
            } else {
                this.ctx.fillStyle = '#00f2fe';
            }

            // Draw bar with rounded top
            this.ctx.beginPath();
            this.ctx.roundRect(x, this.canvas.height - barHeight, barWidth - 2, barHeight, [5, 5, 0, 0]);
            this.ctx.fill();

            x += barWidth;
        }
    }

    /**
     * Set color scheme
     */
    setColorScheme(scheme) {
        this.colorScheme = scheme;
    }

    /**
     * Toggle visualizer
     */
    toggle() {
        if (this.isActive) {
            this.stop();
        } else {
            this.start();
        }
        return this.isActive;
    }
}

// Global instance
const visualizer = new AudioVisualizer();

// Polyfill for roundRect (older browsers)
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radii) {
        this.rect(x, y, width, height);
    };
}
