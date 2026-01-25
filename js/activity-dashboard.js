/**
 * Activity Dashboard - User activity and listening patterns
 */

class ActivityDashboard {
    constructor() {
        this.init();
    }

    init() {
        this.createDashboard();
    }

    createDashboard() {
        const mainContainer = document.querySelector('.main-container');
        if (!mainContainer) return;

        const section = document.createElement('section');
        section.id = 'activity-dashboard';
        section.className = 'section';
        section.innerHTML = `
            <div class="section-header">
                <h2><i class="fas fa-chart-bar"></i> Activity Dashboard</h2>
            </div>
            <div class="activity-grid">
                <div class="activity-card">
                    <h4>Today's Plays</h4>
                    <div class="activity-value" id="todayPlays">0</div>
                </div>
                <div class="activity-card">
                    <h4>This Week</h4>
                    <div class="activity-value" id="weekPlays">0</div>
                </div>
                <div class="activity-card">
                    <h4>This Month</h4>
                    <div class="activity-value" id="monthPlays">0</div>
                </div>
                <div class="activity-card">
                    <h4>Most Active Hour</h4>
                    <div class="activity-value" id="activeHour">--</div>
                </div>
                <div class="activity-card">
                    <h4>Streak Days</h4>
                    <div class="activity-value" id="streakDays">0</div>
                </div>
                <div class="activity-card">
                    <h4>Favorite Day</h4>
                    <div class="activity-value" id="favoriteDay">--</div>
                </div>
            </div>
            <canvas id="activityChart"></canvas>
        `;
        mainContainer.appendChild(section);

        // Add to navbar
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            const link = document.createElement('a');
            link.href = '#activity-dashboard';
            link.className = 'nav-link';
            link.dataset.section = 'activity-dashboard';
            link.innerHTML = '<i class="fas fa-chart-bar"></i> Activity';
            navLinks.appendChild(link);
        }

        this.updateMetrics();
    }

    updateMetrics() {
        try {
            const history = JSON.parse(localStorage.getItem('musicHistory') || '[]');
            const today = new Date().toDateString();
            
            // Today's plays
            const todayPlays = history.filter(h => {
                return new Date(h.timestamp).toDateString() === today;
            }).length;

            // Week plays
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const weekPlays = history.filter(h => {
                return new Date(h.timestamp) >= weekAgo;
            }).length;

            // Month plays
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            const monthPlays = history.filter(h => {
                return new Date(h.timestamp) >= monthAgo;
            }).length;

            document.getElementById('todayPlays').textContent = todayPlays;
            document.getElementById('weekPlays').textContent = weekPlays;
            document.getElementById('monthPlays').textContent = monthPlays;
            document.getElementById('streakDays').textContent = this.calculateStreak(history);

        } catch (e) {
            console.error('Error updating metrics:', e);
        }
    }

    calculateStreak(history) {
        const dates = new Set();
        history.forEach(h => {
            const date = new Date(h.timestamp).toDateString();
            dates.add(date);
        });

        let streak = 0;
        let currentDate = new Date();
        while (dates.has(currentDate.toDateString())) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        }
        return streak;
    }
}

const activityDashboard = new ActivityDashboard();
window.activityDashboard = activityDashboard;
