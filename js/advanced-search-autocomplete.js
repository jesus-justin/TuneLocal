// Advanced Search History & Autocomplete
class AdvancedSearchAutocomplete {
    constructor() {
        this.searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        this.suggestions = ['Chill Vibes', 'Rock Classics', 'Jazz Tonight', 'EDM Mix', 'Acoustic Set', 'Pop Hits'];
        this.init();
    }
    
    init() {
        this.addStyles();
        this.setupSearch();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .search-autocomplete { position: absolute; top: 100%; left: 0; right: 0; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-top: none; border-radius: 0 0 8px 8px; max-height: 300px; overflow-y: auto; z-index: 10000; display: none; backdrop-filter: blur(10px); }
            .search-autocomplete.show { display: block; animation: slideDown 0.2s ease; }
            .search-result { padding: 0.75rem 1rem; cursor: pointer; border-bottom: 1px solid rgba(29, 185, 84, 0.1); transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem; }
            .search-result:hover { background: rgba(29, 185, 84, 0.2); }
            .search-result-icon { color: var(--primary-color); font-size: 14px; }
            .search-result-text { color: var(--text-secondary); flex: 1; }
            .search-result-recent { color: var(--text-secondary); font-size: 11px; }
            @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        `;
        document.head.appendChild(style);
    }
    
    setupSearch() {
        const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]');
        
        searchInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                if (query.length > 0) {
                    this.showAutocomplete(input, query);
                } else {
                    this.hideAutocomplete(input);
                }
            });
            
            input.addEventListener('blur', () => {
                setTimeout(() => this.hideAutocomplete(input), 200);
            });
        });
    }
    
    showAutocomplete(input, query) {
        let dropdown = input.nextElementSibling;
        if (!dropdown || !dropdown.classList.contains('search-autocomplete')) {
            dropdown = document.createElement('div');
            dropdown.className = 'search-autocomplete';
            input.parentNode.insertBefore(dropdown, input.nextSibling);
        }
        
        let results = '';
        
        const filtered = this.suggestions.filter(s => s.toLowerCase().includes(query));
        filtered.forEach(suggestion => {
            results += `<div class="search-result"><span class="search-result-icon">🔍</span><span class="search-result-text">${suggestion}</span></div>`;
        });
        
        this.searchHistory.filter(h => h.includes(query)).slice(0, 3).forEach(history => {
            results += `<div class="search-result"><span class="search-result-icon">⏱️</span><span class="search-result-text">${history}</span></div>`;
        });
        
        dropdown.innerHTML = results;
        dropdown.classList.add('show');
    }
    
    hideAutocomplete(input) {
        const dropdown = input.nextElementSibling;
        if (dropdown && dropdown.classList.contains('search-autocomplete')) {
            dropdown.classList.remove('show');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AdvancedSearchAutocomplete();
});
