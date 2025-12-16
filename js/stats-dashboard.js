/**
 * TuneLocal Statistics Dashboard
 * Analytics and insights about listening habits
 */

class StatsDashboard {
    constructor() {
        this.storageKey = 'tunelocal_stats';
        this.stats = this.load();
        this.initializeStats();
    }

    /**
     * Initialize default stats structure
     */
    initializeStats() {
        if (!this.stats.sessions) {
            this.stats = {
                sessions: [],
                totalPlayTime: 0,
                totalTracks: 0,
                favoriteGenres: {},
                favoritePlatforms: { spotify: 0, youtube: 0, offline: 0 },
                playsByDay: {},
                playsByHour: Array(24).fill(0),
                streaks: { current: 0, longest: 0 },
                lastUpdated: Date.now()
            };
            this.save();
        }
    }

    /**
     * Track a play session
     */
    trackSession(data) {
        const session = {
            id: this.generateId(),
            timestamp: Date.now(),
            type: data.type,
            duration: data.duration || 0,
            title: data.title || 'Unknown',
            artist: data.artist || 'Unknown',
            hour: new Date().getHours(),
            day: new Date().toDateString()
        };

        this.stats.sessions.push(session);
        this.stats.totalTracks++;
        this.stats.totalPlayTime += session.duration;
        this.stats.favoritePlatforms[data.type]++;

        // Track by hour
        this.stats.playsByHour[session.hour]++;

        // Track by day
        this.stats.playsByDay[session.day] = (this.stats.playsByDay[session.day] || 0) + 1;

        // Update streaks
        this.updateStreaks();

        // Limit sessions array size
        if (this.stats.sessions.length > 1000) {
            this.stats.sessions = this.stats.sessions.slice(-1000);
        }

        this.stats.lastUpdated = Date.now();
        this.save();
    }

    /**
     * Update listening streaks
     */
    updateStreaks() {
        const days = Object.keys(this.stats.playsByDay).sort();
        if (days.length === 0) return;

        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        // Check if today or yesterday has plays
        if (days.includes(today)) {
            this.stats.streaks.current++;
        } else if (!days.includes(yesterday)) {
            this.stats.streaks.current = 0;
        }

        // Update longest streak
        if (this.stats.streaks.current > this.stats.streaks.longest) {
            this.stats.streaks.longest = this.stats.streaks.current;
        }
    }

    /**
     * Get summary statistics
     */
    getSummary() {
        const today = new Date().toDateString();
        const thisWeek = this.getSessionsInLastDays(7);
        const thisMonth = this.getSessionsInLastDays(30);

        return {
            totalTracks: this.stats.totalTracks,
            totalPlayTime: this.formatDuration(this.stats.totalPlayTime),
            todayPlays: this.stats.playsByDay[today] || 0,
            weekPlays: thisWeek.length,
            monthPlays: thisMonth.length,
            currentStreak: this.stats.streaks.current,
            longestStreak: this.stats.streaks.longest,
            favoritePlatform: this.getFavoritePlatform(),
            topHour: this.getTopListeningHour(),
            averagePerDay: this.getAveragePerDay()
        };
    }

    /**
     * Get sessions from last N days
     */
    getSessionsInLastDays(days) {
        const cutoff = Date.now() - (days * 86400000);
        return this.stats.sessions.filter(s => s.timestamp >= cutoff);
    }

    /**
     * Get favorite platform
     */
    getFavoritePlatform() {
        const platforms = this.stats.favoritePlatforms;
        const entries = Object.entries(platforms);
        if (entries.length === 0) return 'None';
        
        const max = entries.reduce((a, b) => a[1] > b[1] ? a : b);
        return max[0].charAt(0).toUpperCase() + max[0].slice(1);
    }

    /**
     * Get top listening hour
     */
    getTopListeningHour() {
        const maxPlays = Math.max(...this.stats.playsByHour);
        const hour = this.stats.playsByHour.indexOf(maxPlays);
        return `${hour}:00 - ${hour + 1}:00`;
    }

    /**
     * Get average plays per day
     */
    getAveragePerDay() {
        const days = Object.keys(this.stats.playsByDay).length;
        if (days === 0) return 0;
        return Math.round(this.stats.totalTracks / days);
    }

    /**
     * Get hourly distribution data for chart
     */
    getHourlyData() {
        return this.stats.playsByHour.map((count, hour) => ({
            hour: `${hour}:00`,
            plays: count
        }));
    }

    /**
     * Get daily distribution data for chart (last 30 days)
     */
    getDailyData() {
        const data = [];
        const today = new Date();
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();
            const shortDate = `${date.getMonth() + 1}/${date.getDate()}`;
            
            data.push({
                date: shortDate,
                plays: this.stats.playsByDay[dateStr] || 0
            });
        }
        
        return data;
    }

    /**
     * Get platform distribution data
     */
    getPlatformData() {
        return Object.entries(this.stats.favoritePlatforms).map(([platform, count]) => ({
            platform: platform.charAt(0).toUpperCase() + platform.slice(1),
            count
        }));
    }

    /**
     * Get top tracks
     */
    getTopTracks(limit = 10) {
        const trackCounts = {};
        
        this.stats.sessions.forEach(session => {
            const key = `${session.title}|||${session.artist}`;
            if (!trackCounts[key]) {
                trackCounts[key] = {
                    title: session.title,
                    artist: session.artist,
                    count: 0
                };
            }
            trackCounts[key].count++;
        });

        return Object.values(trackCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }

    /**
     * Format duration (seconds to readable format)
     */
    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m`;
        } else {
            return `${seconds}s`;
        }
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Reset all statistics
     */
    reset() {
        this.stats = {
            sessions: [],
            totalPlayTime: 0,
            totalTracks: 0,
            favoriteGenres: {},
            favoritePlatforms: { spotify: 0, youtube: 0, offline: 0 },
            playsByDay: {},
            playsByHour: Array(24).fill(0),
            streaks: { current: 0, longest: 0 },
            lastUpdated: Date.now()
        };
        this.save();
    }

    /**
     * Export statistics
     */
    export() {
        const blob = new Blob([JSON.stringify(this.stats, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tunelocal_stats_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Load from localStorage
     */
    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('Failed to load stats:', e);
            return {};
        }
    }

    /**
     * Save to localStorage
     */
    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.stats));
        } catch (e) {
            console.error('Failed to save stats:', e);
        }
    }
}

// Global instance
const statsDashboard = new StatsDashboard();

/**
 * Render stats dashboard UI
 */
function renderStatsDashboard(containerId = 'stats-dashboard') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const summary = statsDashboard.getSummary();
    const platformData = statsDashboard.getPlatformData();
    const topTracks = statsDashboard.getTopTracks(5);

    container.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card-large">
                <i class="fas fa-music"></i>
                <div class="stat-value">${summary.totalTracks}</div>
                <div class="stat-label">Total Tracks Played</div>
            </div>
            
            <div class="stat-card-large">
                <i class="fas fa-clock"></i>
                <div class="stat-value">${summary.totalPlayTime}</div>
                <div class="stat-label">Total Listening Time</div>
            </div>
            
            <div class="stat-card-large">
                <i class="fas fa-fire"></i>
                <div class="stat-value">${summary.currentStreak}</div>
                <div class="stat-label">Day Streak</div>
            </div>
            
            <div class="stat-card-large">
                <i class="fas fa-star"></i>
                <div class="stat-value">${summary.longestStreak}</div>
                <div class="stat-label">Longest Streak</div>
            </div>
        </div>

        <div class="stats-row">
            <div class="stats-section">
                <h3><i class="fas fa-chart-bar"></i> This Period</h3>
                <div class="stats-list">
                    <div class="stats-item">
                        <span>Today</span>
                        <strong>${summary.todayPlays} plays</strong>
                    </div>
                    <div class="stats-item">
                        <span>This Week</span>
                        <strong>${summary.weekPlays} plays</strong>
                    </div>
                    <div class="stats-item">
                        <span>This Month</span>
                        <strong>${summary.monthPlays} plays</strong>
                    </div>
                    <div class="stats-item">
                        <span>Average/Day</span>
                        <strong>${summary.averagePerDay} plays</strong>
                    </div>
                </div>
            </div>

            <div class="stats-section">
                <h3><i class="fas fa-trophy"></i> Top Tracks</h3>
                <div class="top-tracks-list">
                    ${topTracks.length > 0 ? topTracks.map(track => `
                        <div class="top-track-item">
                            <div class="track-info">
                                <div class="track-title">${track.title}</div>
                                <div class="track-artist">${track.artist}</div>
                            </div>
                            <div class="track-plays">${track.count} plays</div>
                        </div>
                    `).join('') : '<p class="empty-message">No tracks played yet</p>'}
                </div>
            </div>
        </div>

        <div class="stats-actions">
            <button class="btn btn-secondary" onclick="statsDashboard.export()">
                <i class="fas fa-download"></i> Export Stats
            </button>
            <button class="btn btn-danger" onclick="confirmResetStats()">
                <i class="fas fa-trash"></i> Reset Stats
            </button>
        </div>
    `;
}

/**
 * Confirm reset statistics
 */
function confirmResetStats() {
    if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
        statsDashboard.reset();
        renderStatsDashboard();
        showNotification('Statistics reset successfully', 'success');
    }
}
