// Music Taste Profile Visualizer
class MusicTasteProfile {
    constructor() {
        this.profile = this.generateProfile();
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createProfilePanel();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .taste-panel { position: fixed; bottom: 20px; right: 340px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.5rem; max-width: 320px; z-index: 937; backdrop-filter: blur(10px); }
            .taste-title { color: var(--primary-color); font-weight: bold; font-size: 14px; margin-bottom: 1rem; }
            .taste-radar { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem; }
            .taste-dimension { display: flex; align-items: center; gap: 0.75rem; }
            .taste-label { color: var(--text-primary); font-size: 11px; min-width: 70px; }
            .taste-bar { flex: 1; height: 6px; background: rgba(0, 0, 0, 0.3); border-radius: 3px; overflow: hidden; }
            .taste-bar-fill { height: 100%; background: linear-gradient(90deg, var(--primary-color), #4ade80); border-radius: 3px; }
            .taste-genres { background: rgba(0, 0, 0, 0.2); padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem; }
            .taste-genres-title { color: var(--text-secondary); font-size: 11px; margin-bottom: 0.5rem; }
            .taste-genres-list { display: flex; flex-wrap: wrap; gap: 0.35rem; }
            .taste-genre-tag { background: rgba(29, 185, 84, 0.1); border: 1px solid var(--primary-color); color: var(--primary-color); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 9px; }
            .taste-profile-type { background: rgba(29, 185, 84, 0.1); padding: 0.75rem; border-radius: 8px; text-align: center; }
            .taste-type { color: var(--primary-color); font-weight: bold; font-size: 14px; margin-bottom: 0.25rem; }
            .taste-description { color: var(--text-secondary); font-size: 10px; }
        `;
        document.head.appendChild(style);
    }
    
    createProfilePanel() {
        const panel = document.createElement('div');
        panel.className = 'taste-panel';
        panel.innerHTML = `
            <div class="taste-title">🎨 Music Taste Profile</div>
            
            <div class="taste-radar">
                <div class="taste-dimension">
                    <span class="taste-label">Energy</span>
                    <div class="taste-bar">
                        <div class="taste-bar-fill" style="width: ${this.profile.energy}%"></div>
                    </div>
                </div>
                <div class="taste-dimension">
                    <span class="taste-label">Acoustics</span>
                    <div class="taste-bar">
                        <div class="taste-bar-fill" style="width: ${this.profile.acoustics}%"></div>
                    </div>
                </div>
                <div class="taste-dimension">
                    <span class="taste-label">Danceability</span>
                    <div class="taste-bar">
                        <div class="taste-bar-fill" style="width: ${this.profile.danceability}%"></div>
                    </div>
                </div>
                <div class="taste-dimension">
                    <span class="taste-label">Valence</span>
                    <div class="taste-bar">
                        <div class="taste-bar-fill" style="width: ${this.profile.valence}%"></div>
                    </div>
                </div>
                <div class="taste-dimension">
                    <span class="taste-label">Instrumentals</span>
                    <div class="taste-bar">
                        <div class="taste-bar-fill" style="width: ${this.profile.instrumentals}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="taste-genres">
                <div class="taste-genres-title">Top Genres</div>
                <div class="taste-genres-list">
                    ${this.profile.topGenres.map(g => `<span class="taste-genre-tag">${g}</span>`).join('')}
                </div>
            </div>
            
            <div class="taste-profile-type">
                <div class="taste-type">${this.profile.type}</div>
                <div class="taste-description">${this.profile.description}</div>
            </div>
        `;
        document.body.appendChild(panel);
    }
    
    generateProfile() {
        const types = [
            { type: 'Eclectic Explorer', description: 'You love diverse music across genres' },
            { type: 'Pop Enthusiast', description: 'Mainstream hits and chart toppers' },
            { type: 'Indie Connoisseur', description: 'Underground and alternative vibes' },
            { type: 'Classical Admirer', description: 'Refined taste in instrumental music' },
            { type: 'Hip-Hop Devotee', description: 'Rhythm and lyrical excellence' }
        ];
        
        const selectedType = types[Math.floor(Math.random() * types.length)];
        
        return {
            energy: 65 + Math.floor(Math.random() * 30),
            acoustics: 40 + Math.floor(Math.random() * 40),
            danceability: 55 + Math.floor(Math.random() * 35),
            valence: 50 + Math.floor(Math.random() * 40),
            instrumentals: 30 + Math.floor(Math.random() * 40),
            topGenres: ['Pop', 'Indie', 'Electronic', 'Hip-Hop', 'R&B'],
            type: selectedType.type,
            description: selectedType.description
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MusicTasteProfile();
});
