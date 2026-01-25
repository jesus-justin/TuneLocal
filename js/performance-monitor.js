/**
 * Performance Monitor - Track app performance metrics
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            memoryUsage: 0,
            fps: 0,
            apiResponseTime: 0
        };
        this.init();
    }

    init() {
        this.measureLoadTime();
        this.startMonitoring();
    }

    measureLoadTime() {
        if (window.performance && window.performance.timing) {
            const timing = performance.timing;
            this.metrics.loadTime = timing.loadEventEnd - timing.navigationStart;
        }
    }

    startMonitoring() {
        // Monitor memory
        if (performance.memory) {
            setInterval(() => {
                this.metrics.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1048576);
            }, 5000);
        }

        // Monitor FPS
        this.measureFPS();
    }

    measureFPS() {
        let lastTime = performance.now();
        let frames = 0;

        const measure = () => {
            frames++;
            const currentTime = performance.now();
            if (currentTime >= lastTime + 1000) {
                this.metrics.fps = frames;
                frames = 0;
                lastTime = currentTime;
            }
            requestAnimationFrame(measure);
        };

        requestAnimationFrame(measure);
    }

    getMetrics() {
        return this.metrics;
    }

    logMetrics() {
        console.table(this.metrics);
    }

    trackAPICall(duration) {
        this.metrics.apiResponseTime = duration;
    }
}

const performanceMonitor = new PerformanceMonitor();
window.performanceMonitor = performanceMonitor;
