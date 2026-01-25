// Trending Tracks System
class TrendingTracks {
    constructor() {
        this.trendingData = JSON.parse(localStorage.getItem('trendingTracks')) || {};
        this.timeframes = ['24h', '7d', '30d', '3m'];
        this.init();
    }

    init() {
        this.loadTrendingTracks();
        this.setupEventListeners();
    }

    loadTrendingTracks() {
        const panel = document.createElement('div');
        panel.id = 'trendingTracksPanel';
        panel.className = 'trending-panel';
        panel.innerHTML = `
            <div class="trending-header">
                <h3>Trending Tracks</h3>
                <div class="timeframe-selector">
                    ${this.timeframes.map(tf => `
                        <button class="timeframe-btn" data-timeframe="${tf}">${tf}</button>
                    `).join('')}
                </div>
            </div>
            <div class="trending-content" id="trendingContent"></div>
        `;

        const existing = document.getElementById('trendingTracksPanel');
        if (existing) existing.remove();
        document.body.appendChild(panel);

        this.updateTrendingDisplay('24h');
        this.setupEventListeners();
    }

    updateTrendingDisplay(timeframe) {
        const content = document.getElementById('trendingContent');
        const trends = this.getTrends(timeframe);

        content.innerHTML = `
            <div class="trends-list">
                ${trends.slice(0, 20).map((track, idx) => `
                    <div class="trend-item" data-rank="${idx + 1}">
                        <span class="rank">#${idx + 1}</span>
                        <div class="track-info">
                            <span class="track-title">${track.title}</span>
                            <span class="track-artist">${track.artist}</span>
                        </div>
                        <span class="trend-score">${track.score} plays</span>
                        <span class="trend-arrow ${track.direction}">${track.direction === 'up' ? '📈' : '📉'}</span>
                    </div>
                `).join('')}
            </div>
        `;

        // Add timeframe button listeners
        document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-timeframe') === timeframe);
            btn.addEventListener('click', () => {
                document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateTrendingDisplay(btn.getAttribute('data-timeframe'));
            });
        });
    }

    getTrends(timeframe) {
        const cutoffTime = this.getTimeframeCutoff(timeframe);
        const plays = JSON.parse(localStorage.getItem('playHistory')) || [];
        const recentPlays = plays.filter(p => new Date(p.playedAt) > cutoffTime);

        const trackStats = {};
        recentPlays.forEach(play => {
            const key = `${play.title}-${play.artist}`;
            if (!trackStats[key]) {
                trackStats[key] = {
                    title: play.title,
                    artist: play.artist,
                    score: 0,
                    previousScore: 0
                };
            }
            trackStats[key].score++;
        });

        return Object.values(trackStats)
            .map(track => ({
                ...track,
                direction: track.score > track.previousScore ? 'up' : 'down'
            }))
            .sort((a, b) => b.score - a.score);
    }

    getTimeframeCutoff(timeframe) {
        const now = new Date();
        const timeframes = {
            '24h': () => new Date(now.getTime() - 24 * 60 * 60 * 1000),
            '7d': () => new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
            '30d': () => new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
            '3m': () => new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        };
        return (timeframes[timeframe] || timeframes['24h'])();
    }

    setupEventListeners() {
        document.querySelectorAll('.trend-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const title = item.querySelector('.track-title').textContent;
                showNotification(`Now playing: ${title}`, 'info');
            });
        });
    }
}

const trendingTracks = new TrendingTracks();
window.trendingTracks = trendingTracks;
