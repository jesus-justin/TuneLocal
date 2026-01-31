// Daily Listening Time Tracker
class ListeningTimeTracker {
    constructor() {
        this.dailyGoal = parseInt(localStorage.getItem('listeningGoal') || '120');
        this.todayListened = parseInt(localStorage.getItem('todayListened') || '45');
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createTracker();
        this.startTracking();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .listening-tracker { position: fixed; top: 100px; left: 20px; background: linear-gradient(135deg, rgba(29, 185, 84, 0.15), rgba(29, 185, 84, 0.05)); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1rem; min-width: 240px; z-index: 996; backdrop-filter: blur(10px); }
            .tracker-title { color: var(--primary-color); font-weight: bold; margin-bottom: 0.75rem; }
            .tracker-time { font-size: 28px; font-weight: bold; color: var(--primary-color); margin-bottom: 0.5rem; }
            .tracker-goal { font-size: 12px; color: var(--text-secondary); margin-bottom: 0.75rem; }
            .tracker-bar { background: rgba(0, 0, 0, 0.3); height: 8px; border-radius: 4px; overflow: hidden; }
            .tracker-fill { background: linear-gradient(90deg, var(--primary-color), rgba(29, 185, 84, 0.7)); height: 100%; border-radius: 4px; transition: width 0.3s; }
            .tracker-actions { display: flex; gap: 0.5rem; margin-top: 0.75rem; }
            .tracker-btn { flex: 1; padding: 0.4rem; background: rgba(29, 185, 84, 0.2); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 6px; color: var(--text-secondary); cursor: pointer; font-size: 11px; transition: all 0.2s; }
            .tracker-btn:hover { background: rgba(29, 185, 84, 0.3); color: var(--primary-color); }
        `;
        document.head.appendChild(style);
    }
    
    createTracker() {
        const tracker = document.createElement('div');
        tracker.className = 'listening-tracker';
        tracker.id = 'listeningTracker';
        
        const percentage = (this.todayListened / this.dailyGoal) * 100;
        
        tracker.innerHTML = `
            <div class="tracker-title">⏱️ Today's Listening</div>
            <div class="tracker-time">${Math.floor(this.todayListened / 60)}h ${this.todayListened % 60}m</div>
            <div class="tracker-goal">Goal: ${this.dailyGoal} minutes</div>
            <div class="tracker-bar">
                <div class="tracker-fill" style="width: ${Math.min(percentage, 100)}%"></div>
            </div>
            <div class="tracker-actions">
                <button class="tracker-btn" onclick="document.listeningTracker.addTime(15)">+15m</button>
                <button class="tracker-btn" onclick="document.listeningTracker.addTime(30)">+30m</button>
                <button class="tracker-btn" onclick="document.listeningTracker.reset()">Reset</button>
            </div>
        `;
        
        document.body.appendChild(tracker);
        document.listeningTracker = this;
    }
    
    addTime(minutes) {
        this.todayListened += minutes;
        localStorage.setItem('todayListened', this.todayListened);
        this.updateDisplay();
    }
    
    reset() {
        this.todayListened = 0;
        localStorage.setItem('todayListened', '0');
        this.updateDisplay();
    }
    
    updateDisplay() {
        const tracker = document.getElementById('listeningTracker');
        if (!tracker) return;
        
        const percentage = (this.todayListened / this.dailyGoal) * 100;
        tracker.querySelector('.tracker-time').textContent = `${Math.floor(this.todayListened / 60)}h ${this.todayListened % 60}m`;
        tracker.querySelector('.tracker-fill').style.width = Math.min(percentage, 100) + '%';
    }
    
    startTracking() {
        setInterval(() => {
            this.addTime(1);
        }, 60000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ListeningTimeTracker();
});
