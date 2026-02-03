// Concert/Event Finder
class ConcertEventFinder {
    constructor() {
        this.events = this.loadEvents();
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createEventPanel();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .event-panel { position: fixed; top: 950px; left: 20px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.5rem; max-width: 300px; z-index: 939; backdrop-filter: blur(10px); max-height: 400px; overflow-y: auto; }
            .event-title { color: var(--primary-color); font-weight: bold; font-size: 14px; margin-bottom: 1rem; }
            .event-item { background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 0.75rem; margin-bottom: 0.75rem; cursor: pointer; transition: all 0.2s; }
            .event-item:hover { transform: translateY(-2px); background: rgba(29, 185, 84, 0.05); border: 1px solid var(--primary-color); }
            .event-artist { color: var(--text-primary); font-size: 12px; font-weight: 500; margin-bottom: 0.25rem; }
            .event-venue { color: var(--text-secondary); font-size: 10px; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.35rem; }
            .event-date { color: var(--text-secondary); font-size: 10px; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.35rem; }
            .event-actions { display: flex; gap: 0.5rem; }
            .event-btn { background: rgba(29, 185, 84, 0.1); border: 1px solid var(--primary-color); color: var(--primary-color); padding: 0.35rem 0.75rem; border-radius: 4px; font-size: 10px; cursor: pointer; flex: 1; transition: all 0.2s; }
            .event-btn:hover { background: var(--primary-color); color: white; }
            .event-empty { color: var(--text-secondary); font-size: 12px; text-align: center; padding: 2rem 1rem; }
            .event-search { margin-bottom: 1rem; }
            .event-search-input { width: 100%; padding: 0.5rem; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 6px; color: var(--text-primary); font-size: 11px; }
        `;
        document.head.appendChild(style);
    }
    
    createEventPanel() {
        const panel = document.createElement('div');
        panel.className = 'event-panel';
        panel.innerHTML = `
            <div class="event-title">🎪 Concerts & Events</div>
            
            <div class="event-search">
                <input type="text" class="event-search-input" placeholder="Search artist...">
            </div>
            
            <div id="eventList"></div>
        `;
        document.body.appendChild(panel);
        
        this.renderEvents();
    }
    
    renderEvents() {
        const list = document.getElementById('eventList');
        
        if (this.events.length === 0) {
            list.innerHTML = '<div class="event-empty">No upcoming events for your favorite artists</div>';
            return;
        }
        
        list.innerHTML = this.events.map(e => `
            <div class="event-item">
                <div class="event-artist">🎤 ${e.artist}</div>
                <div class="event-venue">📍 ${e.venue}</div>
                <div class="event-date">📅 ${e.date}</div>
                <div class="event-actions">
                    <button class="event-btn">📱 Tickets</button>
                    <button class="event-btn">🔔 Notify</button>
                </div>
            </div>
        `).join('');
    }
    
    loadEvents() {
        return [
            { artist: 'The Weeknd', venue: 'Madison Square Garden', date: 'Apr 15, 2026' },
            { artist: 'Drake', venue: 'Crypto.com Arena', date: 'May 3, 2026' },
            { artist: 'Ariana Grande', venue: 'Staples Center', date: 'Jun 12, 2026' },
            { artist: 'Bad Bunny', venue: 'MetLife Stadium', date: 'Jul 8, 2026' }
        ];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ConcertEventFinder();
});
