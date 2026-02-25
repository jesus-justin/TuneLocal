// Playlist Analytics Dashboard - Detailed statistics for playlists
class PlaylistAnalytics {
    constructor() {
        this.currentPlaylist = null;
        this.init();
    }

    init() {
        this.injectStyles();
        this.createDashboard();
        this.attachEventListeners();
        this.loadSampleData();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .playlist-analytics-btn {
                position: fixed;
                bottom: 20px;
                right: 330px;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: linear-gradient(135deg, #11998e, #38ef7d);
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 6px 24px rgba(17, 153, 142, 0.4);
                transition: all 0.3s ease;
                z-index: 1000;
            }

            .playlist-analytics-btn:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 32px rgba(17, 153, 142, 0.6);
            }

            .playlist-analytics-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 900px;
                max-height: 85vh;
                background: linear-gradient(135deg, rgba(17, 153, 142, 0.98), rgba(56, 239, 125, 0.98));
                backdrop-filter: blur(20px);
                border-radius: 24px;
                padding: 32px;
                box-shadow: 0 16px 56px rgba(0, 0, 0, 0.5);
                z-index: 985;
                overflow-y: auto;
                border: 1px solid rgba(255, 255, 255, 0.2);
                display: none;
            }

            .playlist-analytics-panel.active {
                display: block;
            }

            .playlist-analytics-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 28px;
                color: white;
            }

            .playlist-analytics-title {
                font-size: 28px;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .playlist-analytics-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                font-size: 20px;
                transition: all 0.2s ease;
            }

            .playlist-analytics-close:hover {
                background: rgba(255, 59, 48, 0.8);
                transform: scale(1.1);
            }

            .playlist-analytics-stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 16px;
                margin-bottom: 24px;
            }

            .playlist-analytics-stat-card {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 16px;
                padding: 20px;
                text-align: center;
                transition: all 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.3);
            }

            .playlist-analytics-stat-card:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-4px);
            }

            .playlist-analytics-stat-value {
                font-size: 36px;
                font-weight: 700;
                color: white;
                margin-bottom: 8px;
            }

            .playlist-analytics-stat-label {
                font-size: 13px;
                color: rgba(255, 255, 255, 0.9);
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .playlist-analytics-chart {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 16px;
                padding: 24px;
                margin-bottom: 20px;
            }

            .playlist-analytics-chart-title {
                font-size: 18px;
                font-weight: 600;
                color: white;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .playlist-analytics-genre-bar {
                margin-bottom: 12px;
            }

            .playlist-analytics-genre-label {
                display: flex;
                justify-content: space-between;
                color: white;
                font-size: 13px;
                margin-bottom: 6px;
            }

            .playlist-analytics-bar-track {
                width: 100%;
                height: 10px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 5px;
                overflow: hidden;
            }

            .playlist-analytics-bar-fill {
                height: 100%;
                background: linear-gradient(90deg, #fff, rgba(255, 255, 255, 0.7));
                border-radius: 5px;
                transition: width 0.6s ease;
            }

            .playlist-analytics-top-tracks {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 16px;
                padding: 24px;
            }

            .playlist-analytics-track-item {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 12px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                margin-bottom: 10px;
                transition: all 0.2s ease;
            }

            .playlist-analytics-track-item:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateX(4px);
            }

            .playlist-analytics-track-rank {
                font-size: 24px;
                font-weight: 700;
                color: rgba(255, 255, 255, 0.8);
                width: 40px;
                text-align: center;
            }

            .playlist-analytics-track-info {
                flex: 1;
            }

            .playlist-analytics-track-name {
                font-size: 15px;
                font-weight: 600;
                color: white;
                margin-bottom: 4px;
            }

            .playlist-analytics-track-artist {
                font-size: 13px;
                color: rgba(255, 255, 255, 0.8);
            }

            .playlist-analytics-track-plays {
                font-size: 14px;
                font-weight: 600;
                color: white;
                padding: 6px 12px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 20px;
            }

            @media (max-width: 768px) {
                .playlist-analytics-panel {
                    width: 95%;
                    padding: 20px;
                }
                
                .playlist-analytics-stats-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
                
                .playlist-analytics-btn {
                    right: 20px;
                    bottom: 150px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createDashboard() {
        // Toggle button
        const btn = document.createElement('button');
        btn.className = 'playlist-analytics-btn';
        btn.innerHTML = '<i class="fas fa-chart-pie"></i>';
        btn.title = 'Playlist Analytics';
        document.body.appendChild(btn);

        // Analytics panel
        const panel = document.createElement('div');
        panel.className = 'playlist-analytics-panel';
        panel.innerHTML = `
            <div class="playlist-analytics-header">
                <div class="playlist-analytics-title">
                    <i class="fas fa-chart-line"></i>
                    Playlist Analytics
                </div>
                <button class="playlist-analytics-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="playlist-analytics-stats-grid">
                <div class="playlist-analytics-stat-card">
                    <div class="playlist-analytics-stat-value" id="totalTracks">--</div>
                    <div class="playlist-analytics-stat-label">Total Tracks</div>
                </div>
                <div class="playlist-analytics-stat-card">
                    <div class="playlist-analytics-stat-value" id="totalDuration">--</div>
                    <div class="playlist-analytics-stat-label">Total Duration</div>
                </div>
                <div class="playlist-analytics-stat-card">
                    <div class="playlist-analytics-stat-value" id="totalPlays">--</div>
                    <div class="playlist-analytics-stat-label">Total Plays</div>
                </div>
                <div class="playlist-analytics-stat-card">
                    <div class="playlist-analytics-stat-value" id="avgRating">--</div>
                    <div class="playlist-analytics-stat-label">Avg Rating</div>
                </div>
            </div>

            <div class="playlist-analytics-chart">
                <div class="playlist-analytics-chart-title">
                    <i class="fas fa-music"></i> Genre Distribution
                </div>
                <div id="genreChart"></div>
            </div>

            <div class="playlist-analytics-top-tracks">
                <div class="playlist-analytics-chart-title">
                    <i class="fas fa-fire"></i> Top 5 Most Played Tracks
                </div>
                <div id="topTracksList"></div>
            </div>
        `;
        document.body.appendChild(panel);

        this.btn = btn;
        this.panel = panel;
    }

    attachEventListeners() {
        this.btn.addEventListener('click', () => {
            this.panel.classList.toggle('active');
        });

        this.panel.querySelector('.playlist-analytics-close').addEventListener('click', () => {
            this.panel.classList.remove('active');
        });
    }

    loadSampleData() {
        // Sample analytics data
        const stats = {
            totalTracks: 247,
            totalDuration: '16h 23m',
            totalPlays: '1.2K',
            avgRating: '4.8⭐'
        };

        const genres = [
            { name: 'Pop', percentage: 35 },
            { name: 'Rock', percentage: 28 },
            { name: 'Hip-Hop', percentage: 18 },
            { name: 'Electronic', percentage: 12 },
            { name: 'Jazz', percentage: 7 }
        ];

        const topTracks = [
            { name: 'Blinding Lights', artist: 'The Weeknd', plays: 342 },
            { name: 'Levitating', artist: 'Dua Lipa', plays: 318 },
            { name: 'Save Your Tears', artist: 'The Weeknd', plays: 285 },
            { name: 'Peaches', artist: 'Justin Bieber', plays: 267 },
            { name: 'Good 4 U', artist: 'Olivia Rodrigo', plays: 251 }
        ];

        // Update stats
        this.panel.querySelector('#totalTracks').textContent = stats.totalTracks;
        this.panel.querySelector('#totalDuration').textContent = stats.totalDuration;
        this.panel.querySelector('#totalPlays').textContent = stats.totalPlays;
        this.panel.querySelector('#avgRating').textContent = stats.avgRating;

        // Create genre chart
        const genreChart = this.panel.querySelector('#genreChart');
        genres.forEach(genre => {
            const bar = document.createElement('div');
            bar.className = 'playlist-analytics-genre-bar';
            bar.innerHTML = `
                <div class="playlist-analytics-genre-label">
                    <span>${genre.name}</span>
                    <span>${genre.percentage}%</span>
                </div>
                <div class="playlist-analytics-bar-track">
                    <div class="playlist-analytics-bar-fill" style="width: ${genre.percentage}%"></div>
                </div>
            `;
            genreChart.appendChild(bar);
        });

        // Create top tracks list
        const tracksList = this.panel.querySelector('#topTracksList');
        topTracks.forEach((track, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-analytics-track-item';
            item.innerHTML = `
                <div class="playlist-analytics-track-rank">#${index + 1}</div>
                <div class="playlist-analytics-track-info">
                    <div class="playlist-analytics-track-name">${track.name}</div>
                    <div class="playlist-analytics-track-artist">${track.artist}</div>
                </div>
                <div class="playlist-analytics-track-plays">${track.plays} plays</div>
            `;
            tracksList.appendChild(item);
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new PlaylistAnalytics();
});
