// Advanced Music Filters
class AdvancedMusicFilters {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createFilterPanel();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .filter-panel { position: fixed; top: 100px; left: 20px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.5rem; max-width: 280px; z-index: 989; backdrop-filter: blur(10px); }
            .filter-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
            .filter-title { color: var(--primary-color); font-weight: bold; font-size: 14px; }
            .filter-reset { background: rgba(29, 185, 84, 0.1); border: 1px solid var(--primary-color); color: var(--primary-color); padding: 0.25rem 0.75rem; border-radius: 6px; font-size: 11px; cursor: pointer; transition: all 0.2s; }
            .filter-reset:hover { background: var(--primary-color); color: white; }
            .filter-group { margin-bottom: 1.25rem; }
            .filter-label { color: var(--text-primary); font-size: 13px; margin-bottom: 0.5rem; display: block; }
            .filter-select { width: 100%; padding: 0.75rem; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; color: var(--text-primary); font-size: 13px; cursor: pointer; transition: all 0.2s; }
            .filter-select:hover { border-color: var(--primary-color); }
            .filter-select:focus { outline: none; border-color: var(--primary-color); background: rgba(0, 0, 0, 0.4); }
            .filter-range { width: 100%; }
            .filter-range-input { width: 100%; accent-color: var(--primary-color); }
            .filter-range-value { color: var(--text-secondary); font-size: 12px; text-align: center; margin-top: 0.25rem; }
            .filter-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }
            .filter-chip { background: rgba(29, 185, 84, 0.1); border: 1px solid var(--primary-color); color: var(--primary-color); padding: 0.4rem 0.8rem; border-radius: 16px; font-size: 11px; cursor: pointer; transition: all 0.2s; }
            .filter-chip.active { background: var(--primary-color); color: white; }
            .filter-results { color: var(--text-secondary); font-size: 12px; text-align: center; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.1); }
        `;
        document.head.appendChild(style);
    }
    
    createFilterPanel() {
        const panel = document.createElement('div');
        panel.className = 'filter-panel';
        panel.innerHTML = `
            <div class="filter-header">
                <span class="filter-title">🎛️ Filters</span>
                <button class="filter-reset" onclick="this.closest('.filter-panel').querySelectorAll('select').forEach(s => s.selectedIndex = 0); this.closest('.filter-panel').querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'))">Reset</button>
            </div>
            
            <div class="filter-group">
                <label class="filter-label">Genre</label>
                <select class="filter-select" id="genreFilter">
                    <option value="">All Genres</option>
                    <option value="pop">Pop</option>
                    <option value="rock">Rock</option>
                    <option value="jazz">Jazz</option>
                    <option value="electronic">Electronic</option>
                    <option value="hiphop">Hip Hop</option>
                    <option value="classical">Classical</option>
                    <option value="indie">Indie</option>
                </select>
            </div>
            
            <div class="filter-group">
                <label class="filter-label">Year Range</label>
                <select class="filter-select" id="yearFilter">
                    <option value="">All Years</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2020s">2020-2022</option>
                    <option value="2010s">2010s</option>
                    <option value="2000s">2000s</option>
                    <option value="1990s">1990s</option>
                    <option value="classic">Before 1990</option>
                </select>
            </div>
            
            <div class="filter-group">
                <label class="filter-label">Mood</label>
                <div class="filter-chips">
                    <span class="filter-chip" onclick="this.classList.toggle('active')">😊 Happy</span>
                    <span class="filter-chip" onclick="this.classList.toggle('active')">😌 Chill</span>
                    <span class="filter-chip" onclick="this.classList.toggle('active')">🔥 Energetic</span>
                    <span class="filter-chip" onclick="this.classList.toggle('active')">😢 Sad</span>
                    <span class="filter-chip" onclick="this.classList.toggle('active')">🎵 Acoustic</span>
                    <span class="filter-chip" onclick="this.classList.toggle('active')">💪 Workout</span>
                </div>
            </div>
            
            <div class="filter-group">
                <label class="filter-label">Duration (minutes)</label>
                <div class="filter-range">
                    <input type="range" class="filter-range-input" min="1" max="10" value="5" id="durationRange" oninput="document.getElementById('durationValue').textContent = this.value">
                    <div class="filter-range-value" id="durationValue">5</div>
                </div>
            </div>
            
            <div class="filter-group">
                <label class="filter-label">Popularity</label>
                <select class="filter-select" id="popularityFilter">
                    <option value="">All</option>
                    <option value="trending">Trending Now</option>
                    <option value="popular">Most Popular</option>
                    <option value="hidden">Hidden Gems</option>
                    <option value="new">New Releases</option>
                </select>
            </div>
            
            <div class="filter-results">
                📊 Showing <strong>247</strong> tracks
            </div>
        `;
        document.body.appendChild(panel);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AdvancedMusicFilters();
});
