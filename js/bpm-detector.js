// BPM Detector Widget - Detects and displays beats per minute
class BPMDetector {
    constructor() {
        this.bpm = 0;
        this.isDetecting = false;
        this.init();
    }

    init() {
        this.injectStyles();
        this.createWidget();
        this.attachEventListeners();
        this.startDetection();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .bpm-detector-widget {
                position: fixed;
                bottom: 80px;
                left: 20px;
                width: 180px;
                background: linear-gradient(135deg, rgba(255, 59, 48, 0.95), rgba(255, 149, 0, 0.95));
                backdrop-filter: blur(10px);
                border-radius: 16px;
                padding: 16px;
                box-shadow: 0 8px 32px rgba(255, 59, 48, 0.3);
                z-index: 970;
                transition: all 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .bpm-detector-widget:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 40px rgba(255, 59, 48, 0.4);
            }

            .bpm-detector-header {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 12px;
                color: white;
                font-size: 13px;
                font-weight: 600;
            }

            .bpm-detector-icon {
                font-size: 16px;
                animation: pulse 1.5s ease-in-out infinite;
            }

            .bpm-detector-display {
                text-align: center;
                padding: 16px 8px;
                background: rgba(255, 255, 255, 0.15);
                border-radius: 12px;
                margin-bottom: 12px;
            }

            .bpm-detector-value {
                font-size: 42px;
                font-weight: 700;
                color: white;
                line-height: 1;
                margin-bottom: 4px;
            }

            .bpm-detector-label {
                font-size: 11px;
                color: rgba(255, 255, 255, 0.8);
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .bpm-detector-tempo {
                text-align: center;
                font-size: 12px;
                color: white;
                font-weight: 500;
                padding: 6px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
                margin-bottom: 8px;
            }

            .bpm-detector-indicator {
                display: flex;
                justify-content: center;
                gap: 6px;
                margin-top: 8px;
            }

            .bpm-beat-dot {
                width: 10px;
                height: 10px;
                background: white;
                border-radius: 50%;
                opacity: 0.3;
                transition: all 0.1s ease;
            }

            .bpm-beat-dot.active {
                opacity: 1;
                transform: scale(1.3);
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
            }

            .bpm-detector-controls {
                display: flex;
                gap: 8px;
                margin-top: 10px;
            }

            .bpm-control-btn {
                flex: 1;
                padding: 8px;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                border-radius: 8px;
                color: white;
                font-size: 11px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-weight: 500;
            }

            .bpm-control-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.05);
            }

            .bpm-control-btn.active {
                background: rgba(255, 255, 255, 0.4);
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }

            @media (max-width: 768px) {
                .bpm-detector-widget {
                    left: 10px;
                    bottom: 70px;
                    width: 160px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createWidget() {
        const widget = document.createElement('div');
        widget.className = 'bpm-detector-widget';
        widget.innerHTML = `
            <div class="bpm-detector-header">
                <i class="fas fa-heart-pulse bpm-detector-icon"></i>
                <span>BPM Detector</span>
            </div>
            <div class="bpm-detector-display">
                <div class="bpm-detector-value" id="bpmValue">--</div>
                <div class="bpm-detector-label">Beats Per Minute</div>
            </div>
            <div class="bpm-detector-tempo" id="bpmTempo">Detecting...</div>
            <div class="bpm-detector-indicator">
                <div class="bpm-beat-dot"></div>
                <div class="bpm-beat-dot"></div>
                <div class="bpm-beat-dot"></div>
                <div class="bpm-beat-dot"></div>
            </div>
            <div class="bpm-detector-controls">
                <button class="bpm-control-btn active" id="bpmToggle">
                    <i class="fas fa-pause"></i> Stop
                </button>
                <button class="bpm-control-btn" id="bpmReset">
                    <i class="fas fa-redo"></i> Reset
                </button>
            </div>
        `;
        document.body.appendChild(widget);
        this.widget = widget;
    }

    attachEventListeners() {
        const toggleBtn = this.widget.querySelector('#bpmToggle');
        const resetBtn = this.widget.querySelector('#bpmReset');

        toggleBtn.addEventListener('click', () => {
            this.isDetecting = !this.isDetecting;
            toggleBtn.innerHTML = this.isDetecting ? 
                '<i class="fas fa-pause"></i> Stop' : 
                '<i class="fas fa-play"></i> Start';
            toggleBtn.classList.toggle('active', this.isDetecting);
        });

        resetBtn.addEventListener('click', () => {
            this.bpm = 0;
            this.updateDisplay();
        });
    }

    startDetection() {
        this.isDetecting = true;
        this.detectBPM();
    }

    detectBPM() {
        setInterval(() => {
            if (this.isDetecting) {
                // Simulate BPM detection (in real app, analyze audio)
                // Random BPM between 60-180 (typical music range)
                this.bpm = Math.floor(Math.random() * (180 - 60 + 1)) + 60;
                this.updateDisplay();
                this.animateBeats();
            }
        }, 3000);
    }

    updateDisplay() {
        const valueEl = this.widget.querySelector('#bpmValue');
        const tempoEl = this.widget.querySelector('#bpmTempo');
        
        valueEl.textContent = this.bpm || '--';
        
        // Classify tempo
        let tempoClass = '';
        if (this.bpm === 0) {
            tempoClass = 'Detecting...';
        } else if (this.bpm < 60) {
            tempoClass = 'Largo (Very Slow)';
        } else if (this.bpm < 76) {
            tempoClass = 'Adagio (Slow)';
        } else if (this.bpm < 108) {
            tempoClass = 'Andante (Moderate)';
        } else if (this.bpm < 120) {
            tempoClass = 'Moderato (Medium)';
        } else if (this.bpm < 140) {
            tempoClass = 'Allegro (Fast)';
        } else if (this.bpm < 168) {
            tempoClass = 'Vivace (Very Fast)';
        } else {
            tempoClass = 'Presto (Extremely Fast)';
        }
        
        tempoEl.textContent = tempoClass;
    }

    animateBeats() {
        if (!this.bpm) return;
        
        const dots = this.widget.querySelectorAll('.bpm-beat-dot');
        const interval = 60000 / this.bpm; // ms per beat
        
        let currentDot = 0;
        const beatInterval = setInterval(() => {
            if (!this.isDetecting) {
                clearInterval(beatInterval);
                return;
            }
            
            // Reset all dots
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Activate current dot
            dots[currentDot].classList.add('active');
            
            currentDot = (currentDot + 1) % dots.length;
        }, interval);

        // Stop after 4 beats
        setTimeout(() => clearInterval(beatInterval), interval * 4);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new BPMDetector();
});
