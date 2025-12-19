/**
 * Music History & Analytics for TuneLocal
 * Track listening history and display analytics
 */

class MusicHistory {
    constructor() {
        this.history = [];
        this.maxHistory = 1000; // Keep last 1000 plays
        this.init();
    }

    init() {
        this.loadHistory();
        this.createHistorySection();
        this.setupEventListeners();
    }

    createHistorySection() {
        // Add history link to navbar
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            const historyLink = document.createElement('a');
            historyLink.href = '#history';
            historyLink.className = 'nav-link';
            historyLink.dataset.section = 'history';
            historyLink.innerHTML = '<i class="fas fa-history"></i> History';
            navLinks.appendChild(historyLink);
        }

        // Create history section
        const mainContainer = document.querySelector('.main-container');
        if (!mainContainer) return;

        const historySection = document.createElement('section');
        historySection.id = 'history';
        historySection.className = 'section';
        historySection.innerHTML = `
            <div class="section-header">
                <h2><i class="fas fa-history"></i> Listening History & Analytics</h2>
                <div class="history-controls">
                    <button class="btn-secondary" onclick="musicHistory.exportHistory()">
                        <i class="fas fa-download"></i> Export
                    </button>
                    <button class="btn-secondary" onclick="musicHistory.clearHistory()">
                        <i class="fas fa-trash"></i> Clear
                    </button>
                </div>
            </div>

            <div class="history-stats-grid">
                <div class="stat-card">
                    <i class="fas fa-music"></i>
                    <div class="stat-value" id="totalPlaysCount">0</div>
                    <div class="stat-label">Total Plays</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-clock"></i>
                    <div class="stat-value" id="totalListeningTime">0h</div>
                    <div class="stat-label">Total Time</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-heart"></i>
                    <div class="stat-value" id="favoriteArtist">-</div>
                    <div class="stat-label">Top Artist</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-star"></i>
                    <div class="stat-value" id="topGenre">-</div>
                    <div class="stat-label">Top Genre</div>
                </div>
            </div>

            <div class="history-tabs">
                <button class="history-tab active" data-tab="recent">Recent Plays</button>
                <button class="history-tab" data-tab="top">Top Tracks</button>
                <button class="history-tab" data-tab="artists">Top Artists</button>
                <button class="history-tab" data-tab="timeline">Timeline</button>
            </div>

            <div class="history-content">
                <div class="history-tab-content active" id="recentTab">
                    <div class="history-list" id="recentPlaysList"></div>
                </div>
                <div class="history-tab-content" id="topTab">
                    <div class="history-list" id="topTracksList"></div>
                </div>
                <div class="history-tab-content" id="artistsTab">
                    <div class="history-list" id="topArtistsList"></div>
                </div>
                <div class="history-tab-content" id="timelineTab">
                    <canvas id="historyChart"></canvas>
                </div>
            </div>
        `;
        mainContainer.appendChild(historySection);
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.history-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.history-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.history-tab-content').forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                const tabName = tab.dataset.tab;
                document.getElementById(`${tabName}Tab`).classList.add('active');
                
                if (tabName === 'timeline') {
                    this.renderTimeline();
                }
            });
        });

        // Listen for track plays
        document.addEventListener('trackPlayed', (e) => {
            if (e.detail) {
                this.recordPlay(e.detail);
            }
        });
    }

    recordPlay(track) {
        const play = {
            title: track.title || track.filename || 'Unknown',
            artist: track.artist || 'Unknown Artist',
            duration: track.duration || 0,
            timestamp: new Date().toISOString(),
            genre: track.genre || 'Unknown'
        };

        this.history.unshift(play);

        // Limit history size
        if (this.history.length > this.maxHistory) {
            this.history = this.history.slice(0, this.maxHistory);
        }

        this.saveHistory();
        this.updateStats();
    }

    updateStats() {
        // Total plays
        document.getElementById('totalPlaysCount').textContent = this.history.length;

        // Total listening time
        const totalSeconds = this.history.reduce((sum, play) => sum + (parseFloat(play.duration) || 0), 0);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        document.getElementById('totalListeningTime').textContent = `${hours}h ${minutes}m`;

        // Top artist
        const artistCounts = {};
        this.history.forEach(play => {
            artistCounts[play.artist] = (artistCounts[play.artist] || 0) + 1;
        });
        const topArtist = Object.entries(artistCounts).sort((a, b) => b[1] - a[1])[0];
        document.getElementById('favoriteArtist').textContent = topArtist ? topArtist[0] : '-';

        // Top genre
        const genreCounts = {};
        this.history.forEach(play => {
            genreCounts[play.genre] = (genreCounts[play.genre] || 0) + 1;
        });
        const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0];
        document.getElementById('topGenre').textContent = topGenre ? topGenre[0] : '-';

        // Update lists
        this.renderRecentPlays();
        this.renderTopTracks();
        this.renderTopArtists();
    }

    renderRecentPlays() {
        const list = document.getElementById('recentPlaysList');
        if (!list) return;

        if (this.history.length === 0) {
            list.innerHTML = '<div class="empty-state"><i class="fas fa-history"></i><p>No listening history yet</p></div>';
            return;
        }

        list.innerHTML = this.history.slice(0, 50).map((play, index) => `
            <div class="history-item">
                <div class="history-item-number">${index + 1}</div>
                <div class="history-item-info">
                    <div class="history-item-title">${play.title}</div>
                    <div class="history-item-artist">${play.artist}</div>
                </div>
                <div class="history-item-time">${this.formatTimeAgo(play.timestamp)}</div>
            </div>
        `).join('');
    }

    renderTopTracks() {
        const list = document.getElementById('topTracksList');
        if (!list) return;

        const trackCounts = {};
        this.history.forEach(play => {
            const key = `${play.title}|${play.artist}`;
            if (!trackCounts[key]) {
                trackCounts[key] = { ...play, count: 0 };
            }
            trackCounts[key].count++;
        });

        const topTracks = Object.values(trackCounts).sort((a, b) => b.count - a.count).slice(0, 20);

        if (topTracks.length === 0) {
            list.innerHTML = '<div class="empty-state"><i class="fas fa-music"></i><p>No data yet</p></div>';
            return;
        }

        list.innerHTML = topTracks.map((track, index) => `
            <div class="history-item">
                <div class="history-item-number">${index + 1}</div>
                <div class="history-item-info">
                    <div class="history-item-title">${track.title}</div>
                    <div class="history-item-artist">${track.artist}</div>
                </div>
                <div class="history-item-plays">
                    <i class="fas fa-play"></i> ${track.count} plays
                </div>
            </div>
        `).join('');
    }

    renderTopArtists() {
        const list = document.getElementById('topArtistsList');
        if (!list) return;

        const artistCounts = {};
        this.history.forEach(play => {
            if (!artistCounts[play.artist]) {
                artistCounts[play.artist] = { artist: play.artist, count: 0, totalTime: 0 };
            }
            artistCounts[play.artist].count++;
            artistCounts[play.artist].totalTime += parseFloat(play.duration) || 0;
        });

        const topArtists = Object.values(artistCounts).sort((a, b) => b.count - a.count).slice(0, 20);

        if (topArtists.length === 0) {
            list.innerHTML = '<div class="empty-state"><i class="fas fa-user"></i><p>No data yet</p></div>';
            return;
        }

        list.innerHTML = topArtists.map((artist, index) => `
            <div class="history-item">
                <div class="history-item-number">${index + 1}</div>
                <div class="history-item-info">
                    <div class="history-item-title">${artist.artist}</div>
                    <div class="history-item-artist">${this.formatDuration(artist.totalTime)} total</div>
                </div>
                <div class="history-item-plays">
                    <i class="fas fa-play"></i> ${artist.count} plays
                </div>
            </div>
        `).join('');
    }

    renderTimeline() {
        const canvas = document.getElementById('historyChart');
        if (!canvas || !canvas.getContext) return;

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = 400;

        // Group plays by day
        const playsByDay = {};
        this.history.forEach(play => {
            const date = new Date(play.timestamp).toLocaleDateString();
            playsByDay[date] = (playsByDay[date] || 0) + 1;
        });

        const days = Object.keys(playsByDay).slice(-30).reverse();
        const counts = days.map(day => playsByDay[day]);

        // Draw simple bar chart
        const maxCount = Math.max(...counts, 1);
        const barWidth = canvas.width / days.length;
        const chartHeight = canvas.height - 50;

        ctx.fillStyle = 'rgba(29, 185, 84, 0.7)';
        counts.forEach((count, index) => {
            const barHeight = (count / maxCount) * chartHeight;
            const x = index * barWidth;
            const y = canvas.height - barHeight - 30;
            
            ctx.fillRect(x + 5, y, barWidth - 10, barHeight);
        });

        // Draw labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        
        days.forEach((day, index) => {
            const x = index * barWidth + barWidth / 2;
            ctx.save();
            ctx.translate(x, canvas.height - 10);
            ctx.rotate(-Math.PI / 4);
            ctx.fillText(day.split('/').slice(0, 2).join('/'), 0, 0);
            ctx.restore();
        });
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const then = new Date(timestamp);
        const seconds = Math.floor((now - then) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return then.toLocaleDateString();
    }

    formatDuration(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    }

    exportHistory() {
        const data = JSON.stringify(this.history, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tunelocal-history-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        if (typeof showNotification === 'function') {
            showNotification('History exported successfully', 'success');
        }
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all listening history? This cannot be undone.')) {
            this.history = [];
            this.saveHistory();
            this.updateStats();
            
            if (typeof showNotification === 'function') {
                showNotification('History cleared', 'info');
            }
        }
    }

    saveHistory() {
        try {
            localStorage.setItem('musicHistory', JSON.stringify(this.history));
        } catch (e) {
            console.error('Failed to save history:', e);
        }
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('musicHistory');
            if (saved) {
                this.history = JSON.parse(saved);
                // Update stats after loading
                setTimeout(() => this.updateStats(), 500);
            }
        } catch (e) {
            console.error('Failed to load history:', e);
        }
    }
}

// Initialize music history
const musicHistory = new MusicHistory();
window.musicHistory = musicHistory;

// Helper to record plays from anywhere
window.recordTrackPlay = function(track) {
    musicHistory.recordPlay(track);
};
