// Playlist Scheduling and Auto-Play System
class PlaylistScheduler {
    constructor() {
        this.schedules = JSON.parse(localStorage.getItem('playlistSchedules')) || {};
        this.activeSchedules = [];
        this.init();
    }

    init() {
        this.setupSchedulerUI();
        this.loadSchedules();
        this.startScheduleChecker();
    }

    setupSchedulerUI() {
        const panel = document.createElement('div');
        panel.id = 'playlistSchedulerPanel';
        panel.className = 'scheduler-panel';
        panel.innerHTML = `
            <div class="scheduler-header">
                <h3>Playlist Scheduler</h3>
                <button id="closeScheduler" class="close-btn">×</button>
            </div>
            <div class="scheduler-content">
                <div class="schedule-form">
                    <h4>Create Schedule</h4>
                    <select id="schedulePlaylist">
                        <option>Select Playlist</option>
                    </select>
                    <input type="time" id="scheduleTime" />
                    <select id="scheduleFrequency">
                        <option value="once">Once</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                    <button id="createSchedule">Create Schedule</button>
                </div>
                <div class="active-schedules">
                    <h4>Active Schedules</h4>
                    <div id="schedulesList"></div>
                </div>
            </div>
        `;

        const existing = document.getElementById('playlistSchedulerPanel');
        if (existing) existing.remove();
        document.body.appendChild(panel);

        document.getElementById('closeScheduler').addEventListener('click', () => this.closePanel());
        document.getElementById('createSchedule').addEventListener('click', () => this.createNewSchedule());
    }

    createNewSchedule() {
        const playlist = document.getElementById('schedulePlaylist').value;
        const time = document.getElementById('scheduleTime').value;
        const frequency = document.getElementById('scheduleFrequency').value;

        if (!playlist || !time) {
            showNotification('Please fill all fields', 'error');
            return;
        }

        const schedule = {
            id: Date.now(),
            playlistId: playlist,
            time: time,
            frequency: frequency,
            createdAt: new Date().toISOString(),
            lastRun: null,
            enabled: true
        };

        this.schedules[schedule.id] = schedule;
        localStorage.setItem('playlistSchedules', JSON.stringify(this.schedules));
        showNotification('Schedule created', 'success');
        this.loadSchedules();
    }

    loadSchedules() {
        const container = document.getElementById('schedulesList');
        if (!container) return;

        container.innerHTML = '';
        Object.entries(this.schedules).forEach(([id, schedule]) => {
            if (schedule.enabled) {
                const item = document.createElement('div');
                item.className = 'schedule-item';
                item.innerHTML = `
                    <div class="schedule-info">
                        <span class="schedule-playlist">${schedule.playlistId}</span>
                        <span class="schedule-time">${schedule.time}</span>
                        <span class="schedule-freq">${schedule.frequency}</span>
                    </div>
                    <div class="schedule-actions">
                        <button class="disable-btn" data-id="${id}">Disable</button>
                        <button class="delete-btn" data-id="${id}">Delete</button>
                    </div>
                `;
                container.appendChild(item);
            }
        });

        document.querySelectorAll('.disable-btn').forEach(btn => {
            btn.addEventListener('click', () => this.disableSchedule(btn.getAttribute('data-id')));
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => this.deleteSchedule(btn.getAttribute('data-id')));
        });
    }

    disableSchedule(scheduleId) {
        if (this.schedules[scheduleId]) {
            this.schedules[scheduleId].enabled = false;
            localStorage.setItem('playlistSchedules', JSON.stringify(this.schedules));
            this.loadSchedules();
        }
    }

    deleteSchedule(scheduleId) {
        delete this.schedules[scheduleId];
        localStorage.setItem('playlistSchedules', JSON.stringify(this.schedules));
        this.loadSchedules();
    }

    startScheduleChecker() {
        setInterval(() => {
            const now = new Date();
            const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

            Object.entries(this.schedules).forEach(([id, schedule]) => {
                if (schedule.enabled && schedule.time === currentTime) {
                    if (!schedule.lastRun || this.shouldRunAgain(schedule)) {
                        this.executeSchedule(schedule);
                        schedule.lastRun = now.toISOString();
                        localStorage.setItem('playlistSchedules', JSON.stringify(this.schedules));
                    }
                }
            });
        }, 60000); // Check every minute
    }

    shouldRunAgain(schedule) {
        if (!schedule.lastRun) return true;

        const lastRun = new Date(schedule.lastRun);
        const now = new Date();

        switch (schedule.frequency) {
            case 'once':
                return false;
            case 'daily':
                return now.getDate() > lastRun.getDate() || now.getMonth() > lastRun.getMonth();
            case 'weekly':
                return Math.floor((now - lastRun) / (7 * 24 * 60 * 60 * 1000)) >= 1;
            case 'monthly':
                return now.getMonth() > lastRun.getMonth();
            default:
                return false;
        }
    }

    executeSchedule(schedule) {
        showNotification(`Playing scheduled playlist: ${schedule.playlistId}`, 'info');
        // Trigger playlist playback
        window.dispatchEvent(new CustomEvent('schedulePlaylist', { detail: schedule }));
    }

    closePanel() {
        const panel = document.getElementById('playlistSchedulerPanel');
        if (panel) panel.remove();
    }
}

const playlistScheduler = new PlaylistScheduler();
window.playlistScheduler = playlistScheduler;
