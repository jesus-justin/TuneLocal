// User Badges and Achievements
class UserBadgesAchievements {
    constructor() {
        this.badges = this.loadBadges();
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createBadgesPanel();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .badges-panel { position: fixed; top: 950px; left: 320px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.5rem; max-width: 300px; z-index: 938; backdrop-filter: blur(10px); max-height: 400px; overflow-y: auto; }
            .badges-title { color: var(--primary-color); font-weight: bold; font-size: 14px; margin-bottom: 1rem; }
            .badges-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1rem; }
            .badge-item { background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 0.75rem; text-align: center; cursor: pointer; transition: all 0.2s; border: 1px solid rgba(255, 255, 255, 0.05); }
            .badge-item:hover { transform: scale(1.05); background: rgba(29, 185, 84, 0.05); border-color: var(--primary-color); }
            .badge-item.locked { opacity: 0.4; }
            .badge-icon { font-size: 32px; margin-bottom: 0.25rem; }
            .badge-name { color: var(--text-primary); font-size: 10px; font-weight: 500; margin-bottom: 0.25rem; }
            .badge-progress { color: var(--text-secondary); font-size: 9px; }
            .badge-unlocked { color: var(--primary-color); }
            .badges-stats { background: rgba(0, 0, 0, 0.2); padding: 0.75rem; border-radius: 8px; }
            .badges-stat { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 0.5rem; }
            .badges-stat:last-child { margin-bottom: 0; }
        `;
        document.head.appendChild(style);
    }
    
    createBadgesPanel() {
        const panel = document.createElement('div');
        panel.className = 'badges-panel';
        panel.innerHTML = `
            <div class="badges-title">🏆 Your Achievements</div>
            
            <div class="badges-grid" id="badgesGrid"></div>
            
            <div class="badges-stats">
                <div class="badges-stat">
                    <span>Badges Earned:</span>
                    <span class="badge-unlocked">${this.badges.filter(b => b.unlocked).length}/${this.badges.length}</span>
                </div>
                <div class="badges-stat">
                    <span>Progress:</span>
                    <span>${Math.round((this.badges.filter(b => b.unlocked).length / this.badges.length) * 100)}%</span>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        
        this.renderBadges();
    }
    
    renderBadges() {
        const grid = document.getElementById('badgesGrid');
        grid.innerHTML = this.badges.map(b => `
            <div class="badge-item ${b.unlocked ? '' : 'locked'}" title="${b.name}: ${b.description}">
                <div class="badge-icon">${b.icon}</div>
                <div class="badge-name">${b.name}</div>
                <div class="badge-progress">
                    ${b.unlocked ? '<span class="badge-unlocked">Unlocked</span>' : `${b.progress}%`}
                </div>
            </div>
        `).join('');
    }
    
    loadBadges() {
        return [
            { icon: '🎵', name: 'Music Lover', description: 'Play 100 songs', progress: 85, unlocked: false },
            { icon: '🔥', name: 'On Fire', description: '7-day streak', progress: 100, unlocked: true },
            { icon: '⭐', name: 'Superstar', description: 'Follow 50 artists', progress: 60, unlocked: false },
            { icon: '🎸', name: 'Genre Master', description: 'Listen to all genres', progress: 75, unlocked: false },
            { icon: '👥', name: 'Social Butterfly', description: 'Share 20 playlists', progress: 40, unlocked: false },
            { icon: '💾', name: 'Collector', description: 'Save 500 tracks', progress: 92, unlocked: false },
            { icon: '🌍', name: 'World Explorer', description: 'Listen to artists from 20 countries', progress: 65, unlocked: false },
            { icon: '🎉', name: 'Party Animal', description: 'Create 10 playlists', progress: 100, unlocked: true },
            { icon: '🏅', name: 'Dedicated Fan', description: 'Listen to 10 albums fully', progress: 50, unlocked: false }
        ];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new UserBadgesAchievements();
});
