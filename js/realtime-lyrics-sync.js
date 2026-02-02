// Real-time Lyrics Sync Display
class RealTimeLyricsSync {
    constructor() {
        this.currentTime = 0;
        this.lyrics = [
            { time: 0, text: "♪ Welcome to TuneLocal ♪" },
            { time: 5, text: "Your music, your way" },
            { time: 10, text: "Stream anywhere, anytime" },
            { time: 15, text: "Enjoy the rhythm" }
        ];
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createLyricsDisplay();
        this.startSync();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .lyrics-sync-container { position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(30, 30, 30, 0.9)); backdrop-filter: blur(20px); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 16px; padding: 2rem; max-width: 500px; width: 90%; z-index: 992; display: none; }
            .lyrics-sync-container.show { display: block; animation: slideUp 0.5s ease; }
            .lyrics-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
            .lyrics-title { color: var(--primary-color); font-weight: bold; font-size: 14px; }
            .lyrics-close { background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 20px; }
            .lyrics-content { max-height: 200px; overflow-y: auto; }
            .lyrics-line { padding: 0.75rem; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 16px; text-align: center; transition: all 0.3s; border-radius: 8px; }
            .lyrics-line.active { color: var(--primary-color); font-weight: bold; font-size: 18px; background: rgba(29, 185, 84, 0.1); transform: scale(1.05); }
            .lyrics-toggle-btn { position: fixed; bottom: 50px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, var(--primary-color), rgba(29, 185, 84, 0.7)); border: none; border-radius: 25px; padding: 0.75rem 1.5rem; color: white; cursor: pointer; font-weight: bold; z-index: 991; box-shadow: 0 4px 15px rgba(29, 185, 84, 0.4); transition: all 0.3s; }
            .lyrics-toggle-btn:hover { transform: translateX(-50%) scale(1.1); }
            @keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        `;
        document.head.appendChild(style);
    }
    
    createLyricsDisplay() {
        const container = document.createElement('div');
        container.className = 'lyrics-sync-container';
        container.id = 'lyricsSyncContainer';
        
        let html = `
            <div class="lyrics-header">
                <span class="lyrics-title">🎤 Lyrics</span>
                <button class="lyrics-close" onclick="document.getElementById('lyricsSyncContainer').classList.remove('show')">✕</button>
            </div>
            <div class="lyrics-content" id="lyricsContent">
        `;
        
        this.lyrics.forEach((line, idx) => {
            html += `<div class="lyrics-line" data-time="${line.time}" data-idx="${idx}">${line.text}</div>`;
        });
        
        html += '</div>';
        container.innerHTML = html;
        document.body.appendChild(container);
        
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'lyrics-toggle-btn';
        toggleBtn.textContent = '🎤 Show Lyrics';
        toggleBtn.onclick = () => container.classList.toggle('show');
        document.body.appendChild(toggleBtn);
    }
    
    startSync() {
        setInterval(() => {
            this.currentTime += 0.1;
            this.updateActiveLyric();
        }, 100);
    }
    
    updateActiveLyric() {
        const lines = document.querySelectorAll('.lyrics-line');
        let activeIdx = 0;
        
        this.lyrics.forEach((line, idx) => {
            if (this.currentTime >= line.time) {
                activeIdx = idx;
            }
        });
        
        lines.forEach((line, idx) => {
            line.classList.toggle('active', idx === activeIdx);
        });
        
        if (lines[activeIdx]) {
            lines[activeIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RealTimeLyricsSync();
});
