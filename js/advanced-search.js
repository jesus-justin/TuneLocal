/**
 * Advanced Search Filtering for TuneLocal
 * Multi-criteria search with genre, artist, duration filters
 */

class AdvancedSearch {
    constructor() {
        this.results = [];
        this.currentFilters = {};
        this.init();
    }

    init() {
        this.createSearchPanel();
        this.setupEventListeners();
    }

    createSearchPanel() {
        const panel = document.createElement('div');
        panel.id = 'advancedSearchPanel';
        panel.className = 'advanced-search-panel hidden';
        panel.innerHTML = `
            <div class="search-filter-section">
                <h4><i class="fas fa-filter"></i> Filter Results</h4>
                <div class="filter-group">
                    <label>Genre:
                        <select id="genreFilter">
                            <option value="">All Genres</option>
                            <option value="pop">Pop</option>
                            <option value="rock">Rock</option>
                            <option value="hip-hop">Hip-Hop</option>
                            <option value="electronic">Electronic</option>
                            <option value="classical">Classical</option>
                        </select>
                    </label>
                </div>
                <div class="filter-group">
                    <label>Artist:
                        <input type="text" id="artistFilter" placeholder="Filter by artist">
                    </label>
                </div>
                <div class="filter-group">
                    <label>Duration (min): <input type="number" id="minDuration" min="0"></label>
                    <label>Duration (max): <input type="number" id="maxDuration" min="0"></label>
                </div>
                <div class="filter-group">
                    <label>Year: 
                        <input type="number" id="yearFilter" min="1900" max="2099">
                    </label>
                </div>
                <button class="btn-primary" onclick="advancedSearch.applyFilters()">Apply Filters</button>
                <button class="btn-secondary" onclick="advancedSearch.resetFilters()">Reset</button>
            </div>
        `;
        document.body.appendChild(panel);
    }

    setupEventListeners() {
        const searchInput = document.querySelector('[data-section="offline-music"] input');
        if (searchInput) {
            searchInput.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'f') {
                    this.togglePanel();
                }
            });
        }
    }

    togglePanel() {
        const panel = document.getElementById('advancedSearchPanel');
        panel.classList.toggle('hidden');
    }

    applyFilters() {
        this.currentFilters = {
            genre: document.getElementById('genreFilter').value,
            artist: document.getElementById('artistFilter').value,
            minDuration: parseInt(document.getElementById('minDuration').value) || 0,
            maxDuration: parseInt(document.getElementById('maxDuration').value) || Infinity,
            year: document.getElementById('yearFilter').value
        };
        if (typeof showNotification === 'function') {
            showNotification('Filters applied', 'success');
        }
    }

    resetFilters() {
        document.getElementById('genreFilter').value = '';
        document.getElementById('artistFilter').value = '';
        document.getElementById('minDuration').value = '';
        document.getElementById('maxDuration').value = '';
        document.getElementById('yearFilter').value = '';
        this.currentFilters = {};
    }

    filter(tracks) {
        return tracks.filter(track => {
            if (this.currentFilters.genre && track.genre !== this.currentFilters.genre) return false;
            if (this.currentFilters.artist && !track.artist?.includes(this.currentFilters.artist)) return false;
            if (track.duration < this.currentFilters.minDuration) return false;
            if (track.duration > this.currentFilters.maxDuration) return false;
            return true;
        });
    }
}

const advancedSearch = new AdvancedSearch();
window.advancedSearch = advancedSearch;
