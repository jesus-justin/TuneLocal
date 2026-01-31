// Music Mood/Vibe Selector
class MusicMoodSelector {
    constructor() {
        this.moods = {
            energetic: { color: '#ff6b6b', icon: '⚡', description: 'High Energy Tracks' },
            relaxed: { color: '#4ecdc4', icon: '☁️', description: 'Chill & Relaxing' },
            romantic: { color: '#ff69b4', icon: '💕', description: 'Love & Romance' },
            focused: { color: '#4a90e2', icon: '🎯', description: 'Focus & Concentration' },
            party: { color: '#ffd700', icon: '🎉', description: 'Party Vibes' },
            melancholic: { color: '#9b59b6', icon: '🌙', description: 'Deep & Emotional' }
        };
        this.currentMood = localStorage.getItem('currentMood') || 'relaxed';
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createMoodSelector();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .mood-selector-container { position: fixed; left: 20px; top: 100px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.25rem; min-width: 200px; z-index: 997; backdrop-filter: blur(10px); }
            .mood-title { color: var(--primary-color); font-weight: bold; margin-bottom: 1rem; font-size: 13px; }
            .mood-button { width: 100%; padding: 0.75rem; margin-bottom: 0.5rem; border: 2px solid rgba(29, 185, 84, 0.2); border-radius: 8px; background: rgba(0, 0, 0, 0.2); color: var(--text-secondary); cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.75rem; }
            .mood-button:hover { border-color: var(--primary-color); background: rgba(29, 185, 84, 0.1); }
            .mood-button.active { background: rgba(29, 185, 84, 0.2); border-color: var(--primary-color); color: var(--primary-color); font-weight: bold; }
            .mood-icon { font-size: 16px; }
            .mood-label { flex: 1; font-size: 12px; }
        `;
        document.head.appendChild(style);
    }
    
    createMoodSelector() {
        const container = document.createElement('div');
        container.className = 'mood-selector-container';
        container.id = 'moodSelector';
        
        let html = '<div class="mood-title">🎵 Select Mood</div>';
        
        Object.entries(this.moods).forEach(([mood, data]) => {
            const active = mood === this.currentMood ? 'active' : '';
            html += `
                <button class="mood-button ${active}" onclick="document.moodSelector.setMood('${mood}')">
                    <span class="mood-icon">${data.icon}</span>
                    <span class="mood-label">${data.description}</span>
                </button>
            `;
        });
        
        container.innerHTML = html;
        document.body.appendChild(container);
        document.moodSelector = this;
    }
    
    setMood(mood) {
        this.currentMood = mood;
        localStorage.setItem('currentMood', mood);
        
        document.querySelectorAll('.mood-button').forEach(btn => btn.classList.remove('active'));
        event.target.closest('.mood-button').classList.add('active');
        
        const moodData = this.moods[mood];
        document.documentElement.style.setProperty('--mood-accent', moodData.color);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MusicMoodSelector();
});
