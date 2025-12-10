/**
 * TuneLocal - Cache Manager
 * Manages API response caching to improve performance
 */

class CacheManager {
    constructor(maxAge = 3600000) { // 1 hour default
        this.cache = new Map();
        this.maxAge = maxAge;
        this.loadFromStorage();
    }

    /**
     * Set cache item
     */
    set(key, value, ttl = this.maxAge) {
        const item = {
            data: value,
            timestamp: Date.now(),
            ttl
        };
        
        this.cache.set(key, item);
        this.saveToStorage();
    }

    /**
     * Get cache item if not expired
     */
    get(key) {
        if (!this.cache.has(key)) {
            return null;
        }

        const item = this.cache.get(key);
        const age = Date.now() - item.timestamp;

        if (age > item.ttl) {
            this.cache.delete(key);
            this.saveToStorage();
            return null;
        }

        return item.data;
    }

    /**
     * Check if key exists and is valid
     */
    has(key) {
        return this.get(key) !== null;
    }

    /**
     * Clear all cache
     */
    clear() {
        this.cache.clear();
        localStorage.removeItem('tunelocal_cache');
    }

    /**
     * Remove specific item
     */
    delete(key) {
        this.cache.delete(key);
        this.saveToStorage();
    }

    /**
     * Save cache to localStorage
     */
    saveToStorage() {
        try {
            const data = Array.from(this.cache.entries());
            localStorage.setItem('tunelocal_cache', JSON.stringify(data));
        } catch (e) {
            console.warn('Could not save cache to storage:', e);
        }
    }

    /**
     * Load cache from localStorage
     */
    loadFromStorage() {
        try {
            const data = JSON.parse(localStorage.getItem('tunelocal_cache') || '[]');
            data.forEach(([key, item]) => {
                const age = Date.now() - item.timestamp;
                if (age < item.ttl) {
                    this.cache.set(key, item);
                }
            });
        } catch (e) {
            console.warn('Could not load cache from storage:', e);
        }
    }

    /**
     * Get cache statistics
     */
    getStats() {
        return {
            size: this.cache.size,
            items: Array.from(this.cache.entries()).map(([key, item]) => ({
                key,
                age: Date.now() - item.timestamp,
                ttl: item.ttl,
                expired: (Date.now() - item.timestamp) > item.ttl
            }))
        };
    }
}

// Initialize global cache manager
const cacheManager = new CacheManager();
