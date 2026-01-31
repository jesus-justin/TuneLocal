// AI-Powered Recommendations Engine
class AIRecommendationsEngine {
    constructor() {
        this.recommendations = [];
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createRecommendations();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .ai-recommendations { position: fixed; bottom: 400px; right: 20px; background: linear-gradient(135deg, rgba(29, 185, 84, 0.1), rgba(29, 185, 84, 0.05)); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1rem; min-width: 280px; max-height: 300px; z-index: 993; display: none; backdrop-filter: blur(10px); overflow-y: auto; }
            .ai-recommendations.open { display: block; animation: slideDown 0.3s ease; }
            .rec-header { color: var(--primary-color); font-weight: bold; margin-bottom: 1rem; display: flex; gap: 0.5rem; align-items: center; }
            .rec-sparkle { animation: sparkle 0.6s infinite; }
            .rec-item { padding: 0.75rem; background: rgba(0, 0, 0, 0.2); border-radius: 6px; margin-bottom: 0.5rem; cursor: pointer; transition: all 0.2s; border-left: 3px solid transparent; }
            .rec-item:hover { background: rgba(29, 185, 84, 0.2); border-left-color: var(--primary-color); }
            .rec-title { font-size: 13px; color: var(--text-primary); margin-bottom: 0.2rem; }
            .rec-artist { font-size: 11px; color: var(--text-secondary); }
            .rec-score { font-size: 10px; color: var(--primary-color); margin-top: 0.3rem; }
            @keyframes sparkle { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        `;
        document.head.appendChild(style);
    }
    
    createRecommendations() {
        const container = document.createElement('div');
        container.className = 'ai-recommendations';
        container.id = 'aiRecommendations';
        
        const mockRecs = [
            { title: 'Sunset Melodies', artist: 'Chill Vibes Studio', score: 98 },
            { title: 'Electric Dreams', artist: 'Synth Masters', score: 95 },
            { title: 'Ocean Waves', artist: 'Ambient Sounds', score: 92 },
            { title: 'Urban Beats', artist: 'City Rhythm', score: 89 },
            { title: 'Mountain Peak', artist: 'Nature Sounds', score: 87 }
        ];
        
        let html = '<div class="rec-header">🤖 <span class="rec-sparkle">✨</span> AI Picks</div>';
        mockRecs.forEach(rec => {
            html += `
                <div class="rec-item">
                    <div class="rec-title">${rec.title}</div>
                    <div class="rec-artist">${rec.artist}</div>
                    <div class="rec-score">Match: ${rec.score}%</div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        document.body.appendChild(container);
        
        const btn = document.createElement('button');
        btn.style.cssText = 'position: fixed; bottom: 360px; right: 20px; width: 45px; height: 45px; background: linear-gradient(135deg, var(--primary-color), rgba(29, 185, 84, 0.6)); border: 2px solid var(--primary-color); border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 992; font-size: 18px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(29, 185, 84, 0.3);';
        btn.innerHTML = '🤖';
        btn.title = 'AI Recommendations';
        btn.onclick = () => container.classList.toggle('open');
        document.body.appendChild(btn);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AIRecommendationsEngine();
});
