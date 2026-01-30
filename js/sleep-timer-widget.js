// Sleep Timer Widget
class SleepTimerWidget {
    constructor() {
        this.timerDuration = 0;
        this.timerInterval = null;
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createWidget();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .sleep-timer-btn { position: fixed; top: 20px; right: 140px; width: 45px; height: 45px; background: linear-gradient(135deg, var(--primary-color), rgba(29, 185, 84, 0.6)); border: 2px solid var(--primary-color); border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 998; font-size: 18px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(29, 185, 84, 0.3); }
            .sleep-timer-btn:hover { transform: scale(1.1); box-shadow: 0 6px 20px rgba(29, 185, 84, 0.5); }
            .sleep-timer-popup { position: fixed; top: 80px; right: 140px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.5rem; min-width: 250px; z-index: 999; display: none; backdrop-filter: blur(10px); }
            .sleep-timer-popup.open { display: block; animation: slideDown 0.3s ease; }
            .timer-options { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin: 1rem 0; }
            .timer-btn { padding: 0.5rem; background: rgba(29, 185, 84, 0.2); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 6px; color: var(--text-secondary); cursor: pointer; font-size: 12px; transition: all 0.2s; }
            .timer-btn:hover { background: rgba(29, 185, 84, 0.4); color: var(--primary-color); }
            .timer-display { color: var(--primary-color); font-size: 18px; font-weight: bold; text-align: center; margin: 1rem 0; }
            @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        `;
        document.head.appendChild(style);
    }
    
    createWidget() {
        const btn = document.createElement('button');
        btn.className = 'sleep-timer-btn';
        btn.innerHTML = '⏱️';
        btn.id = 'sleepTimerBtn';
        document.body.appendChild(btn);
        
        const popup = document.createElement('div');
        popup.className = 'sleep-timer-popup';
        popup.id = 'sleepTimerPopup';
        popup.innerHTML = `
            <div style="color: var(--primary-color); font-weight: bold;">Sleep Timer</div>
            <div class="timer-display" id="timerDisplay">--:--</div>
            <div class="timer-options">
                <button class="timer-btn" onclick="document.sleepTimer.setTimer(5)">5 min</button>
                <button class="timer-btn" onclick="document.sleepTimer.setTimer(10)">10 min</button>
                <button class="timer-btn" onclick="document.sleepTimer.setTimer(15)">15 min</button>
                <button class="timer-btn" onclick="document.sleepTimer.setTimer(30)">30 min</button>
            </div>
            <button class="timer-btn" style="width: 100%;" onclick="document.sleepTimer.cancelTimer()">Cancel</button>
        `;
        document.body.appendChild(popup);
        
        document.sleepTimer = this;
        
        btn.addEventListener('click', () => {
            popup.classList.toggle('open');
        });
    }
    
    setTimer(minutes) {
        this.timerDuration = minutes * 60;
        this.countdownTimer();
        document.getElementById('sleepTimerPopup').classList.remove('open');
    }
    
    countdownTimer() {
        const display = document.getElementById('timerDisplay');
        const interval = setInterval(() => {
            this.timerDuration--;
            const mins = Math.floor(this.timerDuration / 60);
            const secs = this.timerDuration % 60;
            display.textContent = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
            
            if (this.timerDuration <= 0) {
                clearInterval(interval);
                display.textContent = '--:--';
                this.pauseMusic();
            }
        }, 1000);
    }
    
    pauseMusic() {
        const audioElement = document.querySelector('audio');
        if (audioElement) audioElement.pause();
    }
    
    cancelTimer() {
        this.timerDuration = 0;
        document.getElementById('timerDisplay').textContent = '--:--';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SleepTimerWidget();
});
