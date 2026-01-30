// Recently Played Tracks Widget
class RecentlyPlayedWidget {
    constructor() {
        this.maxItems = 8;
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createWidget();
        this.loadRecentlyPlayed();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .recently-played-widget {
                position: fixed;
                bottom: 20px;
                left: 80px;
                background: rgba(30, 30, 30, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(29, 185, 84, 0.3);
                border-radius: 12px;
                padding: 1.5rem;
                max-width: 350px;
                z-index: 1000;
                opacity: 0;
                pointer-events: none;
                transform: translateY(20px);
                transition: all 0.3s ease;
                max-height: 400px;
                overflow-y: auto;
            }
            
            .recently-played-widget.active {
                opacity: 1;
                pointer-events: all;
                transform: translateY(0);
            }
            
            .widget-title {
                font-weight: 600;
                margin-bottom: 1rem;
                color: var(--primary-color);
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .recently-item {
                display: flex;
                gap: 12px;
                padding: 10px;
                border-radius: 8px;
                margin-bottom: 8px;
                cursor: pointer;
                transition: background 0.2s ease;
            }
            
            .recently-item:hover {
                background: rgba(29, 185, 84, 0.15);
            }
            
            .recently-thumbnail {
                width: 40px;
                height: 40px;
                border-radius: 6px;
                background: var(--gradient-1);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 18px;
                flex-shrink: 0;
            }
            
            .recently-info {
                flex: 1;
                min-width: 0;
            }
            
            .recently-title {
                font-weight: 500;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .recently-time {
                font-size: 12px;
                color: var(--text-secondary);
                margin-top: 2px;
            }
        `;
        document.head.appendChild(style);
    }
    
    createWidget() {
        const widget = document.createElement('div');
        widget.className = 'recently-played-widget';
        widget.id = 'recentlyPlayedWidget';
        widget.innerHTML = `
            <div class="widget-title">
                <i class="fas fa-history"></i>
                Recently Played
            </div>
            <div id="recentlyPlayedList"></div>
        `;
        document.body.appendChild(widget);
    }
    
    loadRecentlyPlayed() {
        const stored = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
        const listContainer = document.getElementById('recentlyPlayedList');
        
        listContainer.innerHTML = stored.slice(0, this.maxItems).map(item => `
            <div class="recently-item">
                <div class="recently-thumbnail">
                    <i class="fas fa-music"></i>
                </div>
                <div class="recently-info">
                    <div class="recently-title">${item.title || 'Unknown'}</div>
                    <div class="recently-time">${item.time || 'Today'}</div>
                </div>
            </div>
        `).join('');
    }
    
    addTrack(trackTitle) {
        let recent = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
        recent = recent.filter(t => t.title !== trackTitle);
        recent.unshift({ title: trackTitle, time: new Date().toLocaleTimeString() });
        localStorage.setItem('recentlyPlayed', JSON.stringify(recent.slice(0, 20)));
        this.loadRecentlyPlayed();
    }
}

window.recentlyPlayedWidget = new RecentlyPlayedWidget();

// Show widget on button click
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.accent-picker-btn');
    if (btn) {
        btn.insertAdjacentHTML('afterend', `
            <button style="position: fixed; bottom: 150px; left: 20px; width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #4facfe, #00f2fe); border: none; color: white; cursor: pointer; z-index: 1001; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); display: flex; align-items: center; justify-content: center; font-size: 20px; transition: transform 0.3s ease;" onclick="document.getElementById('recentlyPlayedWidget').classList.toggle('active')">
                <i class="fas fa-clock"></i>
            </button>
        `);
    }
});
