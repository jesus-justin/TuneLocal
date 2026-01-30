// Analytics Dashboard
class AnalyticsDashboard {
    constructor() {
        this.stats = {
            tracksPlayed: Math.floor(Math.random() * 500) + 100,
            totalPlaytime: Math.floor(Math.random() * 1000) + 100,
            favoritesCount: Math.floor(Math.random() * 100) + 20,
            playlistsCreated: Math.floor(Math.random() * 50) + 5,
            downloadedSongs: Math.floor(Math.random() * 200) + 50
        };
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createDashboard();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .analytics-btn { position: fixed; top: 20px; right: 200px; width: 45px; height: 45px; background: linear-gradient(135deg, var(--primary-color), rgba(29, 185, 84, 0.6)); border: 2px solid var(--primary-color); border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 998; font-size: 18px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(29, 185, 84, 0.3); }
            .analytics-btn:hover { transform: scale(1.1); }
            .analytics-modal { position: fixed; top: 80px; right: 200px; background: linear-gradient(135deg, rgba(29, 185, 84, 0.1), rgba(29, 185, 84, 0.05)); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 2rem; min-width: 320px; z-index: 999; display: none; backdrop-filter: blur(10px); }
            .analytics-modal.open { display: block; animation: slideDown 0.3s ease; }
            .stat-item { margin-bottom: 1.5rem; }
            .stat-label { color: var(--text-secondary); font-size: 12px; margin-bottom: 0.5rem; }
            .stat-value { color: var(--primary-color); font-size: 28px; font-weight: bold; }
            .stat-bar { background: rgba(0, 0, 0, 0.3); height: 4px; border-radius: 2px; margin-top: 0.5rem; overflow: hidden; }
            .stat-fill { background: linear-gradient(90deg, var(--primary-color), rgba(29, 185, 84, 0.5)); height: 100%; border-radius: 2px; }
        `;
        document.head.appendChild(style);
    }
    
    createDashboard() {
        const btn = document.createElement('button');
        btn.className = 'analytics-btn';
        btn.innerHTML = '📊';
        btn.id = 'analyticsBtn';
        document.body.appendChild(btn);
        
        const modal = document.createElement('div');
        modal.className = 'analytics-modal';
        modal.id = 'analyticsModal';
        
        let html = '<div style="color: var(--primary-color); font-weight: bold; margin-bottom: 1.5rem;">Your Stats</div>';
        
        const entries = Object.entries(this.stats);
        const maxValue = Math.max(...entries.map(e => e[1]));
        
        entries.forEach(([key, value]) => {
            const percentage = (value / maxValue) * 100;
            const label = key.replace(/([A-Z])/g, ' $1').trim();
            html += `
                <div class="stat-item">
                    <div class="stat-label">${label}</div>
                    <div class="stat-value">${value}</div>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        });
        
        modal.innerHTML = html;
        document.body.appendChild(modal);
        
        btn.addEventListener('click', () => {
            modal.classList.toggle('open');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AnalyticsDashboard();
});
