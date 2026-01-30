// Performance Monitor Widget
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createWidget();
        this.trackPerformance();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .perf-monitor { position: fixed; top: 80px; right: 20px; background: rgba(30, 30, 30, 0.9); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 10px; padding: 1rem; font-family: monospace; font-size: 12px; color: #4ade80; z-index: 999; min-width: 180px; max-width: 250px; }
            .perf-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
            .perf-label { color: var(--text-secondary); }
            .perf-value { color: #1db954; font-weight: bold; }
        `;
        document.head.appendChild(style);
    }
    
    createWidget() {
        const widget = document.createElement('div');
        widget.className = 'perf-monitor';
        widget.id = 'perfMonitor';
        widget.innerHTML = `
            <div style="color: var(--primary-color); margin-bottom: 0.75rem; font-weight: bold;">Performance</div>
            <div class="perf-row">
                <span class="perf-label">FPS:</span>
                <span class="perf-value" id="fpsValue">60</span>
            </div>
            <div class="perf-row">
                <span class="perf-label">Memory:</span>
                <span class="perf-value" id="memValue">0MB</span>
            </div>
            <div class="perf-row">
                <span class="perf-label">Load:</span>
                <span class="perf-value" id="loadValue">0%</span>
            </div>
        `;
        document.body.appendChild(widget);
    }
    
    trackPerformance() {
        let frames = 0;
        let lastTime = Date.now();
        
        const updateStats = () => {
            frames++;
            const now = Date.now();
            const elapsed = now - lastTime;
            
            if (elapsed >= 1000) {
                document.getElementById('fpsValue').textContent = Math.round(frames * 1000 / elapsed);
                
                if (performance.memory) {
                    const mb = Math.round(performance.memory.usedJSHeapSize / 1048576);
                    document.getElementById('memValue').textContent = mb + 'MB';
                }
                
                frames = 0;
                lastTime = now;
            }
            
            requestAnimationFrame(updateStats);
        };
        
        updateStats();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PerformanceMonitor();
});
