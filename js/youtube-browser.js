// YouTube Browser - Enhanced browsing and search capabilities
class YouTubeBrowser {
    constructor() {
        this.searchResults = [];
        this.currentPlaylist = [];
        this.isPlaying = false;
        this.init();
    }

    init() {
        this.setupYouTubeBrowser();
        this.attachYouTubeEventListeners();
    }

    setupYouTubeBrowser() {
        const youtubeSection = document.getElementById('youtube');
        if (!youtubeSection) return;

        // Enhance the YouTube section with search and browse features
        const browserHTML = `
            <div class="youtube-browser-enhanced" style="display: none; margin-top: 24px;">
                <div class="browser-tabs">
                    <button class="browser-tab-btn active" data-tab="search">
                        <i class="fas fa-search"></i> Search Music
                    </button>
                    <button class="browser-tab-btn" data-tab="trending">
                        <i class="fas fa-fire"></i> Trending
                    </button>
                    <button class="browser-tab-btn" data-tab="playlists">
                        <i class="fas fa-list-ul"></i> Playlists
                    </button>
                    <button class="browser-tab-btn" data-tab="history">
                        <i class="fas fa-history"></i> History
                    </button>
                </div>

                <div class="browser-content">
                    <!-- Search Tab -->
                    <div class="browser-tab-content active" id="searchTab">
                        <div class="search-input-enhanced">
                            <input type="text" id="youtubeSearchInput" placeholder="Search music, artists, playlists..." class="url-input">
                            <div class="search-filters">
                                <select id="youtubeSearchFilter" class="filter-select">
                                    <option value="all">All Results</option>
                                    <option value="video">Videos</option>
                                    <option value="playlist">Playlists</option>
                                    <option value="channel">Channels</option>
                                </select>
                            </div>
                        </div>
                        <div class="search-results-grid" id="youtubeSearchResults"></div>
                    </div>

                    <!-- Trending Tab -->
                    <div class="browser-tab-content" id="trendingTab">
                        <div class="trending-grid" id="youtubeTrending"></div>
                    </div>

                    <!-- Playlists Tab -->
                    <div class="browser-tab-content" id="playlistsTab">
                        <div class="playlists-grid" id="youtubePlaylists"></div>
                    </div>

                    <!-- History Tab -->
                    <div class="browser-tab-content" id="historyTab">
                        <div class="history-list" id="youtubeHistory"></div>
                    </div>
                </div>
            </div>
        `;

        const playerContainer = youtubeSection.querySelector('.player-container');
        if (playerContainer) {
            playerContainer.insertAdjacentHTML('afterend', browserHTML);
        }

        this.injectYouTubeBrowserStyles();
    }

    injectYouTubeBrowserStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .youtube-browser-enhanced {
                margin-top: 24px;
                animation: fadeIn 0.3s ease;
            }

            .browser-tabs {
                display: flex;
                gap: 12px;
                margin-bottom: 24px;
                padding-bottom: 12px;
                border-bottom: 2px solid rgba(255, 255, 255, 0.1);
                overflow-x: auto;
            }

            .browser-tab-btn {
                padding: 10px 20px;
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 8px;
                color: rgba(255, 255, 255, 0.7);
                cursor: pointer;
                transition: all 0.2s ease;
                white-space: nowrap;
                font-weight: 500;
            }

            .browser-tab-btn:hover {
                background: rgba(255, 255, 255, 0.12);
                color: white;
            }

            .browser-tab-btn.active {
                background: linear-gradient(135deg, #ff0000, #ff6b6b);
                border-color: transparent;
                color: white;
            }

            .browser-tab-content {
                display: none;
                animation: slideIn 0.3s ease;
            }

            .browser-tab-content.active {
                display: block;
            }

            @keyframes slideIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .search-input-enhanced {
                margin-bottom: 24px;
            }

            .search-filters {
                display: flex;
                gap: 12px;
                margin-top: 12px;
            }

            .filter-select {
                padding: 10px 14px;
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 8px;
                color: white;
                cursor: pointer;
            }

            .search-results-grid, .trending-grid, .playlists-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                gap: 16px;
                margin-top: 24px;
            }

            .youtube-result-card {
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 12px;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .youtube-result-card:hover {
                transform: translateY(-4px);
                background: rgba(255, 255, 255, 0.12);
                border-color: rgba(255, 0, 0, 0.5);
            }

            .result-thumbnail {
                width: 100%;
                aspect-ratio: 16/9;
                background: linear-gradient(135deg, #ff0000, #ff6b6b);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 48px;
                color: white;
                position: relative;
                overflow: hidden;
            }

            .result-thumbnail::after {
                content: '';
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .result-thumbnail .play-overlay {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.5);
                opacity: 0;
                transition: opacity 0.2s ease;
                font-size: 36px;
                color: white;
            }

            .youtube-result-card:hover .result-thumbnail .play-overlay {
                opacity: 1;
            }

            .result-info {
                padding: 12px;
            }

            .result-title {
                font-weight: 600;
                font-size: 14px;
                color: white;
                margin-bottom: 6px;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .result-meta {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.6);
            }

            .result-actions {
                padding: 12px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                gap: 8px;
            }

            .result-actions button {
                flex: 1;
                padding: 8px;
                background: rgba(255, 0, 0, 0.3);
                border: 1px solid rgba(255, 0, 0, 0.5);
                border-radius: 6px;
                color: white;
                cursor: pointer;
                font-size: 12px;
                font-weight: 600;
                transition: all 0.2s ease;
            }

            .result-actions button:hover {
                background: rgba(255, 0, 0, 0.5);
            }

            .history-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-top: 24px;
            }

            .history-item {
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 12px;
                padding: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .history-item:hover {
                background: rgba(255, 255, 255, 0.12);
                border-color: rgba(255, 0, 0, 0.5);
            }

            .history-item-info {
                flex: 1;
            }

            .history-item-title {
                font-weight: 600;
                color: white;
                margin-bottom: 4px;
            }

            .history-item-timestamp {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.6);
            }

            .history-item-actions {
                display: flex;
                gap: 8px;
            }

            .history-item-actions button {
                padding: 6px 12px;
                background: rgba(255, 0, 0, 0.3);
                border: none;
                border-radius: 6px;
                color: white;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s ease;
            }

            .history-item-actions button:hover {
                background: rgba(255, 0, 0, 0.5);
            }

            @media (max-width: 768px) {
                .search-results-grid, .trending-grid, .playlists-grid {
                    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                }

                .browser-tabs {
                    overflow-x: scroll;
                }
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    attachYouTubeEventListeners() {
        // Show browser on YouTube load button click
        const youtubeSection = document.getElementById('youtube');
        if (!youtubeSection) return;

        const loadBtn = youtubeSection.querySelector('button[onclick="loadYouTube()"]');
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                setTimeout(() => this.showBrowser(), 300);
            });
        }

        // Tab switching
        document.querySelectorAll('.browser-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all tabs
                document.querySelectorAll('.browser-tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.browser-tab-content').forEach(c => c.classList.remove('active'));

                // Add active to clicked
                e.target.closest('.browser-tab-btn').classList.add('active');
                const tabName = e.target.closest('.browser-tab-btn').dataset.tab;
                document.getElementById(`${tabName}Tab`).classList.add('active');

                // Load content
                if (tabName === 'trending') this.loadTrendingContent();
                if (tabName === 'history') this.loadHistoryContent();
                if (tabName === 'playlists') this.loadPlaylistsContent();
            });
        });

        // Search functionality
        const searchInput = document.getElementById('youtubeSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.performYouTubeSearch(e.target.value);
            });
        }
    }

    showBrowser() {
        const browser = document.querySelector('.youtube-browser-enhanced');
        if (browser) {
            browser.style.display = 'block';
            this.loadTrendingContent();
        }
    }

    performYouTubeSearch(query) {
        if (!query.trim()) {
            document.getElementById('youtubeSearchResults').innerHTML = '';
            return;
        }

        // Simulated YouTube search results
        const mockResults = this.generateMockSearchResults(query);
        this.displaySearchResults(mockResults);
        this.saveToHistory(query, 'search');
    }

    generateMockSearchResults(query) {
        const categories = {
            'lofi': [
                { title: 'Lofi Hip Hop Study Mix', channel: 'ChilledCow', duration: '12:34:56', views: '1.2M' },
                { title: 'Lofi Beats Chill Mix', channel: 'The Vibe Station', duration: '2:45:30', views: '856K' },
            ],
            'jazz': [
                { title: 'Smooth Jazz Evening', channel: 'Jazz Masters', duration: '1:23:45', views: '432K' },
                { title: 'Jazz Piano Collection', channel: 'Relaxing Piano', duration: '56:30', views: '678K' },
            ],
            'electronic': [
                { title: 'Electronic Dance Music Mix', channel: 'EDM Daily', duration: '1:02:15', views: '543K' },
                { title: 'Synthwave Compilation', channel: 'Neon Nights', duration: '47:20', views: '892K' },
            ],
        };

        const key = Object.keys(categories).find(k => query.toLowerCase().includes(k));
        const results = key ? categories[key] : [
            { title: `${query} Mix Part 1`, channel: 'Music Channel', duration: '1:00:00', views: '500K' },
            { title: `${query} Mix Part 2`, channel: 'Music Channel', duration: '1:05:30', views: '420K' },
            { title: `Best of ${query}`, channel: 'Top Music', duration: '45:00', views: '780K' },
            { title: `${query} Playlist 2024`, channel: 'Playlist Master', duration: '2:30:00', views: '250K' },
        ];

        return results.map((r, i) => ({
            id: `video_${Date.now()}_${i}`,
            ...r,
            thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/sddefault.jpg`,
            url: `https://www.youtube.com/watch?v=${i}`,
            type: 'video'
        }));
    }

    displaySearchResults(results) {
        const container = document.getElementById('youtubeSearchResults');
        if (!container) return;

        container.innerHTML = results.map(result => `
            <div class="youtube-result-card">
                <div class="result-thumbnail">
                    <i class="fab fa-youtube"></i>
                    <div class="play-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="result-info">
                    <div class="result-title">${result.title}</div>
                    <div class="result-meta">
                        <div>${result.channel}</div>
                        <div>${result.views} views • ${result.duration}</div>
                    </div>
                </div>
                <div class="result-actions">
                    <button onclick="youtubePlayVideo('${result.url}', '${result.title}')">
                        <i class="fas fa-play"></i> Play
                    </button>
                    <button onclick="downloadYouTubeVideo('${result.url}', '${result.title}')">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadTrendingContent() {
        const trendingContent = [
            { title: 'Top 50 Global', channel: 'Spotify', views: '2.3M', type: 'playlist' },
            { title: 'New Music Daily', channel: 'Spotify', views: '1.8M', type: 'playlist' },
            { title: 'RapCaviar 2024', channel: 'Spotify', views: '956K', type: 'playlist' },
            { title: 'Pop Rising', channel: 'Spotify', views: '734K', type: 'playlist' },
            { title: 'Today\'s Top Hits', channel: 'Spotify', views: '1.2M', type: 'playlist' },
            { title: 'Today\'s Top Podcasts', channel: 'Spotify', views: '543K', type: 'playlist' },
        ];

        const container = document.getElementById('youtubeTrending');
        if (container) {
            container.innerHTML = trendingContent.map((item, i) => `
                <div class="youtube-result-card">
                    <div class="result-thumbnail">
                        <i class="fas fa-${item.type === 'playlist' ? 'list-ul' : 'music'}"></i>
                    </div>
                    <div class="result-info">
                        <div class="result-title">${item.title}</div>
                        <div class="result-meta">
                            <div>${item.channel}</div>
                            <div>${item.views} views</div>
                        </div>
                    </div>
                    <div class="result-actions">
                        <button onclick="youtubePlayVideo('https://youtube.com/watch?v=trending${i}', '${item.title}')">
                            <i class="fas fa-play"></i> Play
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    loadHistoryContent() {
        const history = JSON.parse(localStorage.getItem('youtubeHistory') || '[]').slice(0, 20);
        const container = document.getElementById('youtubeHistory');
        if (!container) return;

        if (history.length === 0) {
            container.innerHTML = '<p style="color: rgba(255,255,255,0.6); text-align: center; padding: 40px;">No history yet</p>';
            return;
        }

        container.innerHTML = history.map(item => `
            <div class="history-item">
                <div class="history-item-info">
                    <div class="history-item-title">${item.title}</div>
                    <div class="history-item-timestamp">${item.timestamp}</div>
                </div>
                <div class="history-item-actions">
                    <button onclick="youtubePlayVideo('${item.url}', '${item.title}')">
                        <i class="fas fa-play"></i> Play
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadPlaylistsContent() {
        const playlists = [
            { title: 'My Favorites', count: 42, lastUpdated: '2 hours ago' },
            { title: 'Workout Mix', count: 28, lastUpdated: '1 day ago' },
            { title: 'Chill Vibes', count: 65, lastUpdated: '3 days ago' },
            { title: 'Party Hits', count: 53, lastUpdated: '1 week ago' },
        ];

        const container = document.getElementById('youtubePlaylists');
        if (container) {
            container.innerHTML = playlists.map((playlist, i) => `
                <div class="youtube-result-card">
                    <div class="result-thumbnail">
                        <i class="fas fa-list-ul"></i>
                    </div>
                    <div class="result-info">
                        <div class="result-title">${playlist.title}</div>
                        <div class="result-meta">
                            <div>${playlist.count} songs</div>
                            <div>Updated ${playlist.lastUpdated}</div>
                        </div>
                    </div>
                    <div class="result-actions">
                        <button onclick="playPlaylistFromHistory('${i}')">
                            <i class="fas fa-play"></i> Play
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    saveToHistory(title, type) {
        let history = JSON.parse(localStorage.getItem('youtubeHistory') || '[]');
        history.unshift({
            title,
            type,
            url: `https://youtube.com/watch?v=${Date.now()}`,
            timestamp: new Date().toLocaleString()
        });
        history = history.slice(0, 50); // Keep only 50 items
        localStorage.setItem('youtubeHistory', JSON.stringify(history));
    }
}

// Global functions for event handlers
function youtubePlayVideo(url, title) {
    const player = document.getElementById('youtubePlayer');
    if (player) {
        player.innerHTML = `<div style="text-align: center; color: white; padding: 40px;">
            <i class="fab fa-youtube" style="font-size: 48px; color: #ff0000;"></i>
            <h3 style="margin: 16px 0;">Now Playing: ${title}</h3>
            <p>Playing in browser...</p>
        </div>`;
    }

    const browser = new YouTubeBrowser();
    browser.saveToHistory(title, 'video');
}

function downloadYouTubeVideo(url, title) {
    alert(`Download feature: Ready to download "${title}"\n\nIn production, this would:\n1. Extract audio from YouTube\n2. Convert to MP3\n3. Save to offline library`);
}

function playPlaylistFromHistory(index) {
    alert(`Playing playlist ${index + 1}`);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new YouTubeBrowser();
});
