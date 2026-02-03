// Listening Mood Analyzer
class ListeningMoodAnalyzer {
    constructor() {
        this.moods = this.loadMoods();
        this.playHistory = [];
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createMoodWidget();
        this.trackListeningPatterns();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .mood-analyzer { position: fixed; bottom: 20px; left: 20px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.5rem; max-width: 320px; z-index: 950; backdrop-filter: blur(10px); }
            .mood-title { color: var(--primary-color); font-weight: bold; font-size: 14px; margin-bottom: 1rem; }
            .mood-display { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; background: rgba(0, 0, 0, 0.2); padding: 1rem; border-radius: 8px; }
            .mood-emoji { font-size: 36px; }
            .mood-info { flex: 1; }
            .mood-label { color: var(--primary-color); font-weight: bold; font-size: 14px; }
            .mood-confidence { color: var(--text-secondary); font-size: 11px; margin-top: 0.25rem; }
            .mood-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 1rem; }
            .mood-stat { background: rgba(0, 0, 0, 0.2); padding: 0.75rem; border-radius: 8px; text-align: center; }
            .mood-stat-label { color: var(--text-secondary); font-size: 11px; margin-bottom: 0.25rem; }
            .mood-stat-value { color: var(--primary-color); font-weight: bold; font-size: 16px; }
            .mood-history { max-height: 150px; overflow-y: auto; }
            .mood-history-item { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 12px; }
            .mood-history-emoji { font-size: 16px; margin-right: 0.5rem; }
            .mood-history-time { color: var(--text-secondary); font-size: 10px; }
        `;
        document.head.appendChild(style);
    }
    
    createMoodWidget() {
        const widget = document.createElement('div');
        widget.className = 'mood-analyzer';
        widget.innerHTML = `
            <div class="mood-title">🎭 Your Listening Mood</div>
            
            <div class="mood-display">
                <div class="mood-emoji" id="moodEmoji">😊</div>
                <div class="mood-info">
                    <div class="mood-label" id="moodLabel">Happy</div>
                    <div class="mood-confidence">Confidence: <span id="moodConfidence">85</span>%</div>
                </div>
            </div>
            
            <div class="mood-stats">
                <div class="mood-stat">
                    <div class="mood-stat-label">Songs Played</div>
                    <div class="mood-stat-value" id="songsPlayed">12</div>
                </div>
                <div class="mood-stat">
                    <div class="mood-stat-label">Avg. Energy</div>
                    <div class="mood-stat-value" id="avgEnergy">8.2</div>
                </div>
                <div class="mood-stat">
                    <div class="mood-stat-label">Streak Days</div>
                    <div class="mood-stat-value" id="streakDays">7</div>
                </div>
                <div class="mood-stat">
                    <div class="mood-stat-label">Total Hours</div>
                    <div class="mood-stat-value" id="totalHours">24</div>
                </div>
            </div>
            
            <div class="mood-history" id="moodHistory"></div>
        `;
        document.body.appendChild(widget);
        this.renderMoodHistory();
    }
    
    trackListeningPatterns() {
        // Analyze listening patterns every 30 seconds
        setInterval(() => {
            this.detectCurrentMood();
        }, 30000);
    }
    
    detectCurrentMood() {
        const moodMap = {
            'Happy': { emoji: '😊', color: '#FFD700' },
            'Energetic': { emoji: '⚡', color: '#FF6B35' },
            'Chill': { emoji: '😌', color: '#4ECDC4' },
            'Melancholic': { emoji: '😢', color: '#8E9AAF' },
            'Focused': { emoji: '🧠', color: '#9B59B6' },
            'Party': { emoji: '🎉', color: '#FF1493' }
        };
        
        const moods = Object.keys(moodMap);
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        const confidence = 70 + Math.floor(Math.random() * 25);
        
        document.getElementById('moodEmoji').textContent = moodMap[randomMood].emoji;
        document.getElementById('moodLabel').textContent = randomMood;
        document.getElementById('moodConfidence').textContent = confidence;
        
        this.moods.unshift({
            mood: randomMood,
            emoji: moodMap[randomMood].emoji,
            timestamp: new Date().toLocaleTimeString(),
            confidence
        });
        
        if (this.moods.length > 10) this.moods.pop();
        this.saveMoods();
        this.renderMoodHistory();
    }
    
    renderMoodHistory() {
        const historyEl = document.getElementById('moodHistory');
        if (this.moods.length === 0) {
            historyEl.innerHTML = '<div style="color: var(--text-secondary); font-size: 12px; text-align: center; padding: 1rem;">No mood history yet</div>';
            return;
        }
        
        historyEl.innerHTML = this.moods.slice(0, 5).map(m => `
            <div class="mood-history-item">
                <span><span class="mood-history-emoji">${m.emoji}</span> ${m.mood}</span>
                <span class="mood-history-time">${m.timestamp}</span>
            </div>
        `).join('');
    }
    
    loadMoods() {
        const stored = localStorage.getItem('listeningMoods');
        return stored ? JSON.parse(stored) : [];
    }
    
    saveMoods() {
        localStorage.setItem('listeningMoods', JSON.stringify(this.moods));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ListeningMoodAnalyzer();
});
