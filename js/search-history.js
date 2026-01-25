/**
 * Search History Manager
 */

class SearchHistory {
    constructor() {
        this.maxItems = 20;
        this.history = [];
        this.init();
    }

    init() {
        this.loadHistory();
        this.setupSearchListeners();
    }

    setupSearchListeners() {
        const searchInputs = document.querySelectorAll('input[type="search"], input[type="text"]');
        searchInputs.forEach(input => {
            if (input.placeholder.toLowerCase().includes('search')) {
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && input.value) {
                        this.addToHistory(input.value);
                    }
                });
            }
        });
    }

    addToHistory(query) {
        if (!query.trim()) return;

        // Remove duplicate if exists
        this.history = this.history.filter(h => h.query !== query);

        // Add to beginning
        this.history.unshift({
            query: query,
            timestamp: new Date().toISOString()
        });

        // Limit size
        if (this.history.length > this.maxItems) {
            this.history = this.history.slice(0, this.maxItems);
        }

        this.saveHistory();
    }

    getHistory() {
        return this.history;
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
    }

    saveHistory() {
        localStorage.setItem('searchHistory', JSON.stringify(this.history));
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('searchHistory');
            this.history = saved ? JSON.parse(saved) : [];
        } catch (e) {}
    }
}

const searchHistory = new SearchHistory();
window.searchHistory = searchHistory;
