// Listening Stats Exporter
class ListeningStatsExporter {
    constructor() {
        this.stats = this.generateStats();
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createExporterPanel();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .export-panel { position: fixed; bottom: 750px; right: 20px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.5rem; z-index: 940; backdrop-filter: blur(10px); min-width: 280px; }
            .export-title { color: var(--primary-color); font-weight: bold; font-size: 14px; margin-bottom: 1rem; }
            .export-stats { background: rgba(0, 0, 0, 0.2); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
            .export-stat-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 12px; }
            .export-stat-row:last-child { border-bottom: none; }
            .export-label { color: var(--text-secondary); }
            .export-value { color: var(--primary-color); font-weight: bold; }
            .export-formats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
            .export-btn { background: linear-gradient(135deg, rgba(29, 185, 84, 0.1), rgba(74, 222, 128, 0.1)); border: 1px solid var(--primary-color); color: var(--primary-color); padding: 0.75rem; border-radius: 8px; cursor: pointer; font-size: 11px; font-weight: 500; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; }
            .export-btn:hover { background: var(--primary-color); color: white; transform: translateY(-2px); }
            .export-icon { font-size: 18px; }
            .export-period { background: rgba(0, 0, 0, 0.2); padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; }
            .export-period-select { width: 100%; padding: 0.5rem; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 4px; color: var(--text-primary); font-size: 11px; }
        `;
        document.head.appendChild(style);
    }
    
    createExporterPanel() {
        const panel = document.createElement('div');
        panel.className = 'export-panel';
        panel.innerHTML = `
            <div class="export-title">📊 Export Your Stats</div>
            
            <div class="export-period">
                <select class="export-period-select" id="exportPeriod">
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                    <option value="all">All Time</option>
                </select>
            </div>
            
            <div class="export-stats">
                <div class="export-stat-row">
                    <span class="export-label">Total Hours</span>
                    <span class="export-value">${this.stats.hours}</span>
                </div>
                <div class="export-stat-row">
                    <span class="export-label">Songs Played</span>
                    <span class="export-value">${this.stats.songs}</span>
                </div>
                <div class="export-stat-row">
                    <span class="export-label">Unique Artists</span>
                    <span class="export-value">${this.stats.artists}</span>
                </div>
                <div class="export-stat-row">
                    <span class="export-label">Top Genre</span>
                    <span class="export-value">${this.stats.topGenre}</span>
                </div>
            </div>
            
            <div class="export-formats">
                <button class="export-btn" onclick="alert('Exported as PDF')">
                    <span class="export-icon">📄</span>
                    <span>PDF</span>
                </button>
                <button class="export-btn" onclick="alert('Exported as CSV')">
                    <span class="export-icon">📊</span>
                    <span>CSV</span>
                </button>
                <button class="export-btn" onclick="alert('Exported as JSON')">
                    <span class="export-icon">🔗</span>
                    <span>JSON</span>
                </button>
                <button class="export-btn" onclick="alert('Shared to social media')">
                    <span class="export-icon">📤</span>
                    <span>Share</span>
                </button>
            </div>
        `;
        document.body.appendChild(panel);
    }
    
    generateStats() {
        return {
            hours: Math.floor(Math.random() * 500) + 50,
            songs: Math.floor(Math.random() * 2000) + 200,
            artists: Math.floor(Math.random() * 500) + 50,
            topGenre: ['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Electronic'][Math.floor(Math.random() * 5)]
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ListeningStatsExporter();
});
