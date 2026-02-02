// Search History Tracker
class SearchHistoryTracker {
    constructor() {
        this.history = this.loadHistory();
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createHistoryPanel();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .search-history-panel { position: fixed; top: 200px; right: 20px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.5rem; max-width: 300px; z-index: 985; backdrop-filter: blur(10px); max-height: 400px; overflow-y: auto; }
            .search-history-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
            .search-history-title { color: var(--primary-color); font-weight: bold; font-size: 14px; }
            .search-history-clear { background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; padding: 0.25rem 0.75rem; border-radius: 6px; font-size: 11px; cursor: pointer; transition: all 0.2s; }
            .search-history-clear:hover { background: #ef4444; color: white; }
            .search-history-list { display: flex; flex-direction: column; gap: 0.5rem; }
            .search-history-item { background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 0.75rem; cursor: pointer; transition: all 0.2s; display: flex; justify-content: space-between; align-items: center; }
            .search-history-item:hover { background: rgba(29, 185, 84, 0.1); border: 1px solid var(--primary-color); transform: translateX(-4px); }
            .search-history-text { color: var(--text-primary); font-size: 13px; flex: 1; }
            .search-history-time { color: var(--text-secondary); font-size: 11px; }
            .search-history-delete { background: transparent; border: none; color: var(--text-secondary); cursor: pointer; padding: 0.25rem; font-size: 14px; transition: all 0.2s; }
            .search-history-delete:hover { color: #ef4444; transform: scale(1.2); }
            .search-history-empty { color: var(--text-secondary); font-size: 13px; text-align: center; padding: 2rem 1rem; }
            .search-history-category { color: var(--text-secondary); font-size: 11px; margin-bottom: 0.5rem; margin-top: 1rem; font-weight: 500; }
        `;
        document.head.appendChild(style);
    }
    
    createHistoryPanel() {
        const panel = document.createElement('div');
        panel.className = 'search-history-panel';
        panel.innerHTML = `
            <div class="search-history-header">
                <span class="search-history-title">🔍 Search History</span>
                <button class="search-history-clear" onclick="this.closest('.search-history-panel').dispatchEvent(new CustomEvent('clearHistory'))">Clear All</button>
            </div>
            <div id="searchHistoryList"></div>
        `;
        document.body.appendChild(panel);
        
        this.renderHistory();
        this.attachClearListener();
    }
    
    renderHistory() {
        const list = document.getElementById('searchHistoryList');
        
        if (this.history.length === 0) {
            list.innerHTML = '<div class="search-history-empty">No recent searches</div>';
            return;
        }
        
        const today = this.getTodaySearches();
        const yesterday = this.getYesterdaySearches();
        const older = this.getOlderSearches();
        
        let html = '';
        
        if (today.length > 0) {
            html += '<div class="search-history-category">Today</div>';
            html += this.renderSearches(today);
        }
        
        if (yesterday.length > 0) {
            html += '<div class="search-history-category">Yesterday</div>';
            html += this.renderSearches(yesterday);
        }
        
        if (older.length > 0) {
            html += '<div class="search-history-category">Older</div>';
            html += this.renderSearches(older);
        }
        
        list.innerHTML = html;
        this.attachDeleteListeners();
    }
    
    renderSearches(searches) {
        return searches.map(search => `
            <div class="search-history-item" onclick="this.dispatchEvent(new CustomEvent('searchClick', {detail: '${search.query}', bubbles: true}))">
                <span class="search-history-text">${search.query}</span>
                <span class="search-history-time">${this.formatTime(search.timestamp)}</span>
                <button class="search-history-delete" onclick="event.stopPropagation(); this.closest('.search-history-panel').dispatchEvent(new CustomEvent('deleteSearch', {detail: ${search.id}, bubbles: true}))">×</button>
            </div>
        `).join('');
    }
    
    getTodaySearches() {
        const today = new Date().toDateString();
        return this.history.filter(s => new Date(s.timestamp).toDateString() === today);
    }
    
    getYesterdaySearches() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return this.history.filter(s => new Date(s.timestamp).toDateString() === yesterday.toDateString());
    }
    
    getOlderSearches() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return this.history.filter(s => new Date(s.timestamp) < yesterday);
    }
    
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    
    attachClearListener() {
        const panel = document.querySelector('.search-history-panel');
        panel.addEventListener('clearHistory', () => {
            this.history = [];
            this.saveHistory();
            this.renderHistory();
        });
        
        panel.addEventListener('deleteSearch', (e) => {
            this.history = this.history.filter(s => s.id !== e.detail);
            this.saveHistory();
            this.renderHistory();
        });
        
        panel.addEventListener('searchClick', (e) => {
            console.log('Search clicked:', e.detail);
        });
    }
    
    attachDeleteListeners() {
        // Event delegation handled in renderSearches
    }
    
    addSearch(query) {
        this.history.unshift({
            id: Date.now(),
            query: query,
            timestamp: new Date().toISOString()
        });
        
        if (this.history.length > 20) {
            this.history = this.history.slice(0, 20);
        }
        
        this.saveHistory();
        this.renderHistory();
    }
    
    loadHistory() {
        const stored = localStorage.getItem('searchHistory');
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Add some mock data
        return [
            { id: 1, query: 'Summer hits 2024', timestamp: new Date().toISOString() },
            { id: 2, query: 'Jazz classics', timestamp: new Date(Date.now() - 3600000).toISOString() },
            { id: 3, query: 'Lo-fi beats', timestamp: new Date(Date.now() - 7200000).toISOString() },
            { id: 4, query: 'Indie rock playlist', timestamp: new Date(Date.now() - 86400000).toISOString() },
            { id: 5, query: 'Electronic dance', timestamp: new Date(Date.now() - 172800000).toISOString() }
        ];
    }
    
    saveHistory() {
        localStorage.setItem('searchHistory', JSON.stringify(this.history));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SearchHistoryTracker();
});
