// Smart Wake Alarm - Wake up to music with gradual volume increase
class SmartWakeAlarm {
    constructor() {
        this.alarms = this.loadAlarms();
        this.init();
    }

    init() {
        this.injectStyles();
        this.createAlarmPanel();
        this.attachEventListeners();
        this.checkAlarms();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .smart-wake-alarm-btn {
                position: fixed;
                top: 160px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #f093fb, #f5576c);
                border: none;
                color: white;
                font-size: 22px;
                cursor: pointer;
                box-shadow: 0 6px 20px rgba(240, 147, 251, 0.4);
                transition: all 0.3s ease;
                z-index: 1000;
            }

            .smart-wake-alarm-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 8px 28px rgba(240, 147, 251, 0.6);
            }

            .smart-wake-alarm-panel {
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                width: 400px;
                max-height: 85vh;
                background: linear-gradient(135deg, rgba(240, 147, 251, 0.98), rgba(245, 87, 108, 0.98));
                backdrop-filter: blur(20px);
                border-radius: 20px;
                padding: 24px;
                box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5);
                z-index: 990;
                overflow-y: auto;
                border: 1px solid rgba(255, 255, 255, 0.2);
                display: none;
            }

            .smart-wake-alarm-panel.active {
                display: block;
            }

            .smart-wake-alarm-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                color: white;
            }

            .smart-wake-alarm-title {
                font-size: 22px;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .smart-wake-alarm-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                font-size: 18px;
                transition: all 0.2s ease;
            }

            .smart-wake-alarm-close:hover {
                background: rgba(255, 59, 48, 0.8);
                transform: scale(1.1);
            }

            .smart-wake-alarm-form {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 16px;
                padding: 20px;
                margin-bottom: 20px;
            }

            .smart-wake-alarm-input-group {
                margin-bottom: 16px;
            }

            .smart-wake-alarm-label {
                display: block;
                font-size: 13px;
                color: white;
                font-weight: 600;
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .smart-wake-alarm-input {
                width: 100%;
                padding: 12px 16px;
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 12px;
                color: white;
                font-size: 15px;
                font-weight: 500;
            }

            .smart-wake-alarm-input::placeholder {
                color: rgba(255, 255, 255, 0.6);
            }

            .smart-wake-alarm-time-input {
                font-size: 32px;
                text-align: center;
                font-weight: 700;
                padding: 16px;
            }

            .smart-wake-alarm-select {
                width: 100%;
                padding: 12px 16px;
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 12px;
                color: white;
                font-size: 14px;
                cursor: pointer;
            }

            .smart-wake-alarm-days {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            }

            .smart-wake-alarm-day-btn {
                flex: 1;
                min-width: 40px;
                padding: 10px;
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                color: white;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .smart-wake-alarm-day-btn:hover,
            .smart-wake-alarm-day-btn.active {
                background: rgba(255, 255, 255, 0.4);
                border-color: rgba(255, 255, 255, 0.6);
                transform: scale(1.1);
            }

            .smart-wake-alarm-add-btn {
                width: 100%;
                padding: 14px;
                background: rgba(255, 255, 255, 0.3);
                border: none;
                border-radius: 12px;
                color: white;
                font-size: 15px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s ease;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .smart-wake-alarm-add-btn:hover {
                background: rgba(255, 255, 255, 0.4);
                transform: translateY(-2px);
                box-shadow: 0 4px 16px rgba(255, 255, 255, 0.3);
            }

            .smart-wake-alarm-list {
                margin-top: 20px;
            }

            .smart-wake-alarm-item {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 16px;
                padding: 16px;
                margin-bottom: 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .smart-wake-alarm-item-time {
                font-size: 28px;
                font-weight: 700;
                color: white;
            }

            .smart-wake-alarm-item-label {
                font-size: 13px;
                color: rgba(255, 255, 255, 0.9);
                margin-top: 4px;
            }

            .smart-wake-alarm-item-controls {
                display: flex;
                gap: 8px;
            }

            .smart-wake-alarm-toggle {
                width: 54px;
                height: 28px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 14px;
                position: relative;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .smart-wake-alarm-toggle.active {
                background: rgba(56, 239, 125, 0.8);
            }

            .smart-wake-alarm-toggle-circle {
                width: 22px;
                height: 22px;
                background: white;
                border-radius: 50%;
                position: absolute;
                top: 3px;
                left: 3px;
                transition: all 0.3s ease;
            }

            .smart-wake-alarm-toggle.active .smart-wake-alarm-toggle-circle {
                left: 29px;
            }

            .smart-wake-alarm-delete-btn {
                background: rgba(255, 59, 48, 0.6);
                border: none;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s ease;
            }

            .smart-wake-alarm-delete-btn:hover {
                background: rgba(255, 59, 48, 0.9);
                transform: scale(1.1);
            }

            @media (max-width: 768px) {
                .smart-wake-alarm-panel {
                    width: 95%;
                    right: 2.5%;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createAlarmPanel() {
        // Toggle button
        const btn = document.createElement('button');
        btn.className = 'smart-wake-alarm-btn';
        btn.innerHTML = '<i class="fas fa-alarm-clock"></i>';
        btn.title = 'Smart Wake Alarm';
        document.body.appendChild(btn);

        // Alarm panel
        const panel = document.createElement('div');
        panel.className = 'smart-wake-alarm-panel';
        panel.innerHTML = `
            <div class="smart-wake-alarm-header">
                <div class="smart-wake-alarm-title">
                    <i class="fas fa-bell"></i>
                    Wake Alarm
                </div>
                <button class="smart-wake-alarm-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="smart-wake-alarm-form">
                <div class="smart-wake-alarm-input-group">
                    <label class="smart-wake-alarm-label">Set Time</label>
                    <input type="time" class="smart-wake-alarm-input smart-wake-alarm-time-input" id="alarmTime">
                </div>

                <div class="smart-wake-alarm-input-group">
                    <label class="smart-wake-alarm-label">Label</label>
                    <input type="text" class="smart-wake-alarm-input" id="alarmLabel" placeholder="Wake up!">
                </div>

                <div class="smart-wake-alarm-input-group">
                    <label class="smart-wake-alarm-label">Wake Sound</label>
                    <select class="smart-wake-alarm-select" id="alarmSound">
                        <option>Favorite Playlist</option>
                        <option>Gentle Piano</option>
                        <option>Nature Sounds</option>
                        <option>Upbeat Pop</option>
                        <option>Classical</option>
                    </select>
                </div>

                <div class="smart-wake-alarm-input-group">
                    <label class="smart-wake-alarm-label">Repeat</label>
                    <div class="smart-wake-alarm-days">
                        <button class="smart-wake-alarm-day-btn" data-day="M">M</button>
                        <button class="smart-wake-alarm-day-btn" data-day="T">T</button>
                        <button class="smart-wake-alarm-day-btn" data-day="W">W</button>
                        <button class="smart-wake-alarm-day-btn" data-day="T">T</button>
                        <button class="smart-wake-alarm-day-btn" data-day="F">F</button>
                        <button class="smart-wake-alarm-day-btn" data-day="S">S</button>
                        <button class="smart-wake-alarm-day-btn" data-day="S">S</button>
                    </div>
                </div>

                <button class="smart-wake-alarm-add-btn" id="addAlarmBtn">
                    <i class="fas fa-plus"></i> Create Alarm
                </button>
            </div>

            <div class="smart-wake-alarm-list" id="alarmList"></div>
        `;
        document.body.appendChild(panel);

        this.btn = btn;
        this.panel = panel;
        this.renderAlarms();
    }

    attachEventListeners() {
        this.btn.addEventListener('click', () => {
            this.panel.classList.toggle('active');
        });

        this.panel.querySelector('.smart-wake-alarm-close').addEventListener('click', () => {
            this.panel.classList.remove('active');
        });

        this.panel.querySelector('#addAlarmBtn').addEventListener('click', () => {
            this.addAlarm();
        });

        // Day toggle buttons
        this.panel.querySelectorAll('.smart-wake-alarm-day-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
            });
        });
    }

    addAlarm() {
        const time = this.panel.querySelector('#alarmTime').value;
        const label = this.panel.querySelector('#alarmLabel').value || 'Wake up!';
        const sound = this.panel.querySelector('#alarmSound').value;

        if (!time) {
            alert('Please set a time for the alarm');
            return;
        }

        const alarm = {
            id: Date.now(),
            time,
            label,
            sound,
            enabled: true
        };

        this.alarms.push(alarm);
        this.saveAlarms();
        this.renderAlarms();

        // Reset form
        this.panel.querySelector('#alarmTime').value = '';
        this.panel.querySelector('#alarmLabel').value = '';
    }

    renderAlarms() {
        const list = this.panel.querySelector('#alarmList');
        list.innerHTML = '';

        this.alarms.forEach(alarm => {
            const item = document.createElement('div');
            item.className = 'smart-wake-alarm-item';
            item.innerHTML = `
                <div>
                    <div class="smart-wake-alarm-item-time">${alarm.time}</div>
                    <div class="smart-wake-alarm-item-label">${alarm.label}</div>
                </div>
                <div class="smart-wake-alarm-item-controls">
                    <div class="smart-wake-alarm-toggle ${alarm.enabled ? 'active' : ''}" data-id="${alarm.id}">
                        <div class="smart-wake-alarm-toggle-circle"></div>
                    </div>
                    <button class="smart-wake-alarm-delete-btn" data-id="${alarm.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            list.appendChild(item);
        });

        // Add event listeners to delete and toggle buttons
        list.querySelectorAll('.smart-wake-alarm-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.deleteAlarm(parseInt(btn.dataset.id));
            });
        });

        list.querySelectorAll('.smart-wake-alarm-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                this.toggleAlarm(parseInt(toggle.dataset.id));
            });
        });
    }

    deleteAlarm(id) {
        this.alarms = this.alarms.filter(a => a.id !== id);
        this.saveAlarms();
        this.renderAlarms();
    }

    toggleAlarm(id) {
        const alarm = this.alarms.find(a => a.id === id);
        if (alarm) {
            alarm.enabled = !alarm.enabled;
            this.saveAlarms();
            this.renderAlarms();
        }
    }

    saveAlarms() {
        localStorage.setItem('smartWakeAlarms', JSON.stringify(this.alarms));
    }

    loadAlarms() {
        const saved = localStorage.getItem('smartWakeAlarms');
        return saved ? JSON.parse(saved) : [];
    }

    checkAlarms() {
        setInterval(() => {
            const now = new Date();
            const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            
            this.alarms.forEach(alarm => {
                if (alarm.enabled && alarm.time === currentTime) {
                    this.triggerAlarm(alarm);
                }
            });
        }, 30000); // Check every 30 seconds
    }

    triggerAlarm(alarm) {
        console.log('Alarm triggered:', alarm);
        alert(`⏰ ${alarm.label}\nPlaying: ${alarm.sound}`);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new SmartWakeAlarm();
});
