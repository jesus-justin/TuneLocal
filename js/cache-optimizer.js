/**
 * Cache Optimizer - Optimize caching strategy
 */

class CacheOptimizer {
    constructor() {
        this.cacheStats = {
            totalItems: 0,
            totalSize: 0,
            lastCleaned: null
        };
        this.init();
    }

    init() {
        this.startMonitoring();
    }

    startMonitoring() {
        // Monitor cache regularly
        setInterval(() => this.optimizeCache(), 3600000); // Every hour
    }

    optimizeCache() {
        const now = Date.now();
        const cacheExpiry = 86400000; // 24 hours
        let itemsRemoved = 0;

        try {
            const cache = JSON.parse(localStorage.getItem('appCache') || '{}');
            
            Object.keys(cache).forEach(key => {
                if (now - cache[key].timestamp > cacheExpiry) {
                    delete cache[key];
                    itemsRemoved++;
                }
            });

            localStorage.setItem('appCache', JSON.stringify(cache));
            this.cacheStats.lastCleaned = new Date().toISOString();

            console.log(`Cache optimized: ${itemsRemoved} items removed`);
        } catch (e) {
            console.error('Cache optimization error:', e);
        }
    }

    getCacheSize() {
        let size = 0;
        try {
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    size += localStorage[key].length + key.length;
                }
            }
        } catch (e) {}
        return (size / 1024).toFixed(2); // KB
    }

    clearOldCache(hoursOld = 24) {
        const now = Date.now();
        const expiry = hoursOld * 3600000;
        let removed = 0;

        try {
            const cache = JSON.parse(localStorage.getItem('appCache') || '{}');
            Object.keys(cache).forEach(key => {
                if (now - cache[key].timestamp > expiry) {
                    delete cache[key];
                    removed++;
                }
            });
            localStorage.setItem('appCache', JSON.stringify(cache));
        } catch (e) {}

        return removed;
    }

    getStats() {
        return {
            ...this.cacheStats,
            currentSize: this.getCacheSize() + ' KB'
        };
    }
}

const cacheOptimizer = new CacheOptimizer();
window.cacheOptimizer = cacheOptimizer;
