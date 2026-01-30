// Search Dropdown Suggestions
class SearchDropdownSuggestions {
    constructor() {
        this.searchInputs = document.querySelectorAll('.search-input');
        this.init();
    }
    
    init() {
        this.addStyles();
        this.setupListeners();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .search-suggestions-dropdown {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: rgba(30, 30, 30, 0.98);
                backdrop-filter: blur(15px);
                border: 1px solid rgba(29, 185, 84, 0.4);
                border-radius: 12px;
                margin-top: 8px;
                max-height: 350px;
                overflow-y: auto;
                z-index: 1001;
                opacity: 0;
                pointer-events: none;
                transform: translateY(-10px);
                transition: opacity 0.3s ease, transform 0.3s ease;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            }
            
            .search-suggestions-dropdown.active {
                opacity: 1;
                pointer-events: all;
                transform: translateY(0);
            }
            
            .suggestion-item {
                padding: 12px 16px;
                cursor: pointer;
                transition: background 0.2s ease, transform 0.2s ease;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .suggestion-item:hover {
                background: rgba(29, 185, 84, 0.2);
                transform: translateX(5px);
            }
            
            .suggestion-item i {
                color: var(--primary-color);
                font-size: 16px;
                min-width: 20px;
            }
            
            .suggestion-text {
                flex: 1;
            }
            
            .suggestion-title {
                font-weight: 500;
                color: var(--text-primary);
            }
            
            .suggestion-type {
                font-size: 12px;
                color: var(--text-secondary);
                margin-top: 2px;
            }
        `;
        document.head.appendChild(style);
    }
    
    setupListeners() {
        this.searchInputs.forEach(input => {
            const wrapper = input.parentElement;
            if (!wrapper.style.position) wrapper.style.position = 'relative';
            
            const suggestionsDiv = document.createElement('div');
            suggestionsDiv.className = 'search-suggestions-dropdown';
            wrapper.appendChild(suggestionsDiv);
            
            const suggestions = [
                { icon: 'fas fa-music', title: 'All Music', type: 'Search everywhere' },
                { icon: 'fas fa-compact-disc', title: 'Albums', type: 'Browse albums' },
                { icon: 'fas fa-user', title: 'Artists', type: 'Find artists' },
                { icon: 'fas fa-list', title: 'Playlists', type: 'Browse playlists' },
                { icon: 'fas fa-history', title: 'Recent', type: 'Recently played' }
            ];
            
            input.addEventListener('focus', () => {
                suggestionsDiv.classList.add('active');
                this.populateSuggestions(suggestionsDiv, suggestions);
            });
            
            document.addEventListener('click', (e) => {
                if (!input.contains(e.target) && !suggestionsDiv.contains(e.target)) {
                    suggestionsDiv.classList.remove('active');
                }
            });
        });
    }
    
    populateSuggestions(container, suggestions) {
        container.innerHTML = suggestions.map(s => `
            <div class="suggestion-item">
                <i class="${s.icon}"></i>
                <div class="suggestion-text">
                    <div class="suggestion-title">${s.title}</div>
                    <div class="suggestion-type">${s.type}</div>
                </div>
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SearchDropdownSuggestions();
});
