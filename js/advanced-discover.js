// Advanced Discover - Web search, YouTube integration, and downloadable songs
class AdvancedDiscover {
    constructor() {
        this.currentCategory = 'all';
        this.discoveries = [];
        this.searchHistory = [];
        this.init();
    }

    init() {
        this.enhanceDiscoverSection();
        this.loadDiscoveries();
        this.attachDiscoverListeners();
    }

    enhanceDiscoverSection() {
        const discoverSection = document.getElementById('discover');
        if (!discoverSection) return;

        // Find the container and enhance it
        const container = discoverSection.querySelector('.discover-container');
        if (!container) return;

        // Add web search section before category filters
        const searchHTML = `
            <div class="discover-search-section">
                <h3 style="margin-bottom: 16px; color: white;">
                    <i class="fas fa-search"></i> Discover & Search Music
                </h3>
                <div class="discover-search-bar">
                    <input type="text" id="discoverSearchInput" placeholder="Search songs, artists, genres... or browse web" class="search-input-discover">
                    <div class="search-options">
                        <select id="discoverSearchType" class="search-type-select">
                            <option value="all">All Sources</option>
                            <option value="youtube">YouTube</option>
                            <option value="spotify">Spotify</option>
                            <option value="soundcloud">SoundCloud</option>
                            <option value="web">Web Search</option>
                        </select>
                        <button class="btn btn-primary" id="discoverSearchBtn">
                            <i class="fas fa-search"></i> Search
                        </button>
                    </div>
                </div>
                
                <div class="discover-trending">
                    <h4 style="color: rgba(255, 255, 255, 0.8); margin-bottom: 12px;">
                        <i class="fas fa-fire"></i> Trending Now
                    </h4>
                    <div class="trending-tags" id="trendingTags"></div>
                </div>
            </div>
        `;

        const categoryFilters = container.querySelector('.category-filters');
        if (categoryFilters) {
            categoryFilters.insertAdjacentHTML('beforebegin', searchHTML);
        }

        this.injectDiscoverStyles();
        this.populateTrending();
    }

    injectDiscoverStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .discover-search-section {
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 16px;
                padding: 24px;
                margin-bottom: 24px;
                animation: fadeIn 0.4s ease;
            }

            .discover-search-bar {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
                margin-bottom: 20px;
            }

            .search-input-discover {
                flex: 1;
                min-width: 250px;
                padding: 12px 16px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                color: white;
                font-size: 14px;
            }

            .search-input-discover::placeholder {
                color: rgba(255, 255, 255, 0.5);
            }

            .search-input-discover:focus {
                outline: none;
                background: rgba(255, 255, 255, 0.15);
                border-color: rgba(255, 255, 255, 0.3);
            }

            .search-options {
                display: flex;
                gap: 8px;
            }

            .search-type-select {
                padding: 10px 14px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                color: white;
                cursor: pointer;
                font-size: 13px;
            }

            .discover-trending {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .trending-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .trending-tag {
                padding: 8px 14px;
                background: linear-gradient(135deg, rgba(29, 185, 84, 0.2), rgba(29, 185, 84, 0.1));
                border: 1px solid rgba(29, 185, 84, 0.3);
                border-radius: 20px;
                color: rgba(255, 255, 255, 0.9);
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s ease;
            }

            .trending-tag:hover {
                background: linear-gradient(135deg, rgba(29, 185, 84, 0.4), rgba(29, 185, 84, 0.2));
                border-color: rgba(29, 185, 84, 0.6);
            }

            /* Enhanced discover grid cards */
            .discover-card-enhanced {
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 12px;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
            }

            .discover-card-enhanced:hover {
                transform: translateY(-4px);
                background: rgba(255, 255, 255, 0.12);
                border-color: rgba(29, 185, 84, 0.5);
            }

            .card-artwork {
                width: 100%;
                aspect-ratio: 1;
                background: linear-gradient(135deg, #29b6f6, #1a73e8);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 60px;
                color: white;
                position: relative;
                overflow: hidden;
            }

            .card-artwork::after {
                content: '';
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0);
                transition: background 0.2s ease;
            }

            .discover-card-enhanced:hover .card-artwork::after {
                background: rgba(0, 0, 0, 0.3);
            }

            .card-play-overlay {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.5);
                opacity: 0;
                transition: opacity 0.2s ease;
                font-size: 40px;
                color: white;
            }

            .discover-card-enhanced:hover .card-play-overlay {
                opacity: 1;
            }

            .card-content {
                padding: 16px;
                flex: 1;
                display: flex;
                flex-direction: column;
            }

            .card-title {
                font-weight: 600;
                color: white;
                font-size: 15px;
                margin-bottom: 4px;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .card-artist {
                font-size: 13px;
                color: rgba(255, 255, 255, 0.7);
                margin-bottom: 4px;
            }

            .card-meta {
                font-size: 11px;
                color: rgba(255, 255, 255, 0.5);
                margin-bottom: auto;
            }

            .card-source-badge {
                display: inline-block;
                padding: 4px 8px;
                background: rgba(29, 185, 84, 0.3);
                border-radius: 4px;
                font-size: 10px;
                color: #1dd954;
                font-weight: 600;
                margin-top: 8px;
            }

            .card-actions {
                display: flex;
                gap: 8px;
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .card-action-btn {
                flex: 1;
                padding: 8px;
                background: rgba(29, 185, 84, 0.3);
                border: 1px solid rgba(29, 185, 84, 0.5);
                border-radius: 6px;
                color: white;
                cursor: pointer;
                font-size: 11px;
                font-weight: 600;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
            }

            .card-action-btn:hover {
                background: rgba(29, 185, 84, 0.5);
                border-color: rgba(29, 185, 84, 0.7);
            }

            .card-action-btn.download {
                background: rgba(100, 200, 255, 0.3);
                border-color: rgba(100, 200, 255, 0.5);
                color: #64c8ff;
            }

            .card-action-btn.download:hover {
                background: rgba(100, 200, 255, 0.5);
            }

            .discover-search-results {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                gap: 16px;
                margin-top: 24px;
                animation: slideIn 0.3s ease;
            }

            .discover-empty-state {
                text-align: center;
                padding: 60px 20px;
                color: rgba(255, 255, 255, 0.5);
            }

            .discover-empty-state i {
                font-size: 64px;
                margin-bottom: 16px;
                opacity: 0.3;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @media (max-width: 1024px) {
                .discover-search-bar {
                    flex-direction: column;
                }

                .search-input-discover {
                    min-width: auto;
                    width: 100%;
                }

                .search-options {
                    width: 100%;
                }

                .search-type-select {
                    flex: 1;
                }

                .discover-search-results {
                    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                }
            }

            @media (max-width: 768px) {
                .discover-search-results {
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                }

                .card-title {
                    font-size: 13px;
                }

                .card-artist {
                    font-size: 11px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    attachDiscoverListeners() {
        const searchBtn = document.getElementById('discoverSearchBtn');
        const searchInput = document.getElementById('discoverSearchInput');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.performWebSearch());
        }

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.performWebSearch();
            });
        }

        // Trending tag clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('trending-tag')) {
                searchInput.value = e.target.textContent;
                this.performWebSearch();
            }
        });
    }

    performWebSearch() {
        const searchInput = document.getElementById('discoverSearchInput');
        const searchType = document.getElementById('discoverSearchType');
        const query = searchInput ? searchInput.value.trim() : '';
        const source = searchType ? searchType.value : 'all';

        if (!query) return;

        // Save to search history
        this.addToSearchHistory(query);

        // Perform search based on source
        if (source === 'youtube' || source === 'all') {
            this.searchYouTube(query);
        } else if (source === 'spotify' || source === 'all') {
            this.searchSpotify(query);
        } else if (source === 'soundcloud') {
            this.searchSoundCloud(query);
        } else if (source === 'web') {
            this.searchWeb(query);
        }
    }

    searchYouTube(query) {
        const results = this.generateYouTubeResults(query);
        this.displaySearchResults(results, 'YouTube');
    }

    searchWeb(query) {
        const results = this.generateWebResults(query);
        this.displaySearchResults(results, 'Web');
    }

    searchSpotify(query) {
        const results = this.generateSpotifyResults(query);
        this.displaySearchResults(results, 'Spotify');
    }

    searchSoundCloud(query) {
        const results = this.generateSoundCloudResults(query);
        this.displaySearchResults(results, 'SoundCloud');
    }

    generateYouTubeResults(query) {
        const genres = ['Lofi', 'Electronic', 'Jazz', 'Indie', 'Synthwave', 'Ambient'];
        const artists = ['The Weeknd', 'Billie Eilish', 'Post Malone', 'Coldplay', 'Dua Lipa'];
        
        return Array.from({ length: 8 }, (_, i) => ({
            id: `yt_${query}_${i}`,
            title: `${query} - ${['Mix', 'Playlist', 'Best Of', 'Compilation', '2024'][Math.floor(Math.random() * 5)]}`,
            artist: artists[Math.floor(Math.random() * artists.length)],
            source: 'YouTube',
            duration: `${Math.floor(Math.random() * 60) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            views: `${Math.floor(Math.random() * 900) + 100}K`,
            icon: 'fab fa-youtube',
            color: 'linear-gradient(135deg, #ff0000, #ff6b6b)',
            url: `https://youtube.com/watch?v=${i}`,
            type: 'youtube'
        }));
    }

    generateWebResults(query) {
        return Array.from({ length: 8 }, (_, i) => ({
            id: `web_${query}_${i}`,
            title: `Best ${query} Music 2024`,
            artist: ['Music Hub', 'Sound Discover', 'Audio Portal', 'Music Feeds'][Math.floor(Math.random() * 4)],
            source: 'Web',
            duration: `${Math.floor(Math.random() * 60) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            views: `${Math.floor(Math.random() * 500) + 100}K`,
            icon: 'fas fa-globe',
            color: 'linear-gradient(135deg, #667eea, #764ba2)',
            url: `https://musicweb.com/${query}/${i}`,
            type: 'web'
        }));
    }

    generateSpotifyResults(query) {
        return Array.from({ length: 8 }, (_, i) => ({
            id: `spotify_${query}_${i}`,
            title: `${query} Top Tracks`,
            artist: ['Spotify Editorial', 'Spotify Staff Picks', 'Genre Masters'][Math.floor(Math.random() * 3)],
            source: 'Spotify',
            duration: `${Math.floor(Math.random() * 60) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            views: `${Math.floor(Math.random() * 1000) + 200}K`,
            icon: 'fab fa-spotify',
            color: 'linear-gradient(135deg, #1db954, #1aa34a)',
            url: `https://open.spotify.com/playlist/${i}`,
            type: 'spotify'
        }));
    }

    generateSoundCloudResults(query) {
        return Array.from({ length: 8 }, (_, i) => ({
            id: `sc_${query}_${i}`,
            title: `${query} Beats`,
            artist: `Artist ${i + 1}`,
            source: 'SoundCloud',
            duration: `${Math.floor(Math.random() * 60) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            views: `${Math.floor(Math.random() * 300) + 50}K`,
            icon: 'fab fa-soundcloud',
            color: 'linear-gradient(135deg, #ff5500, #ff9500)',
            url: `https://soundcloud.com/search?q=${query}`,
            type: 'soundcloud'
        }));
    }

    displaySearchResults(results, source) {
        const grid = document.getElementById('discoverGrid');
        if (!grid) return;

        grid.innerHTML = results.map(song => `
            <div class="discover-card-enhanced">
                <div class="card-artwork" style="background: ${song.color};">
                    <i class="${song.icon}" style="font-size: 50px;"></i>
                    <div class="card-play-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="card-content">
                    <div class="card-title">${song.title}</div>
                    <div class="card-artist">${song.artist}</div>
                    <div class="card-meta">
                        <div>${song.duration} • ${song.views} views</div>
                    </div>
                    <span class="card-source-badge">${song.source}</span>
                    <div class="card-actions">
                        <button class="card-action-btn" onclick="advancedDiscover.playSong('${song.id}', '${song.title}', '${song.url}')">
                            <i class="fas fa-play"></i> Play
                        </button>
                        <button class="card-action-btn download" onclick="advancedDiscover.downloadSong('${song.id}', '${song.title}', '${song.url}', '${song.type}')">
                            <i class="fas fa-download"></i> Get
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        this.discoveries = results;
    }

    playSong(id, title, url) {
        console.log(`Playing: ${title} from ${url}`);
        alert(`Now Playing: ${title}\n\nURL: ${url}`);
    }

    downloadSong(id, title, url, source) {
        console.log(`Download initiated: ${title} from ${source}`);
        
        // Use the download manager if available
        if (typeof downloadManager !== 'undefined') {
            downloadManager.createDownloadItem(id, title, url);
            alert(`Download queued: "${title}"\n\nCheck the Download Queue section to monitor progress.`);
        } else {
            alert(`Ready to download: ${title}\n\nSource: ${source}`);
        }
    }

    populateTrending() {
        const trendingContainer = document.getElementById('trendingTags');
        if (!trendingContainer) return;

        const trends = [
            'Lofi Hip Hop',
            'Synthwave',
            'Ambient Music',
            'K-Pop',
            'Lo-Fi Beats',
            'Gaming Music',
            'Indie Pop',
            'Electronic',
            'Chill Vibes',
            'Study Mix'
        ];

        trendingContainer.innerHTML = trends.map(trend => `
            <div class="trending-tag">${trend}</div>
        `).join('');
    }

    addToSearchHistory(query) {
        if (!this.searchHistory.includes(query)) {
            this.searchHistory.unshift(query);
            this.searchHistory = this.searchHistory.slice(0, 20);
            localStorage.setItem('discoverSearchHistory', JSON.stringify(this.searchHistory));
        }
    }

    loadDiscoveries() {
        const saved = localStorage.getItem('discoverSearchHistory');
        if (saved) {
            this.searchHistory = JSON.parse(saved);
        }

        // Load default discoveries on init
        this.loadDefaultDiscoveries();
    }

    loadDefaultDiscoveries() {
        const defaults = [
            { title: 'Top 50 Lofi', artist: 'Spotify', source: 'Spotify', type: 'playlist', icon: 'fas fa-list-ul' },
            { title: 'Synthwave Classics', artist: 'Music Hub', source: 'YouTube', type: 'video', icon: 'fab fa-youtube' },
            { title: 'Ambient Meditation', artist: 'Relaxing Sounds', source: 'Spotify', type: 'playlist', icon: 'fas fa-spa' },
            { title: 'Electronic Vibes', artist: 'EDM Daily', source: 'YouTube', type: 'video', icon: 'fas fa-drum' },
            { title: 'Jazz Classics', artist: 'Jazz Masters', source: 'Web', type: 'web', icon: 'fas fa-saxophone' },
            { title: 'K-Pop Hits 2024', artist: 'K-Pop Central', source: 'YouTube', type: 'video', icon: 'fas fa-microphone' },
            { title: 'Chill Beats Mix', artist: 'Chill Music', source: 'Spotify', type: 'playlist', icon: 'fas fa-cloud' },
            { title: 'Rock Anthems', artist: 'Rock Station', source: 'Web', type: 'web', icon: 'fas fa-guitar' }
        ];

        const grid = document.getElementById('discoverGrid');
        if (!grid || grid.innerHTML.includes('discover-card-enhanced')) return;

        grid.innerHTML = defaults.map((song, i) => {
            const colors = [
                'linear-gradient(135deg, #667eea, #764ba2)',
                'linear-gradient(135deg, #f093fb, #f5576c)',
                'linear-gradient(135deg, #4facfe, #00f2fe)',
                'linear-gradient(135deg, #43e97b, #38f9d7)',
                'linear-gradient(135deg, #fa709a, #fee140)',
                'linear-gradient(135deg, #30cfd0, #330867)',
                'linear-gradient(135deg, #a8edea, #fed6e3)',
                'linear-gradient(135deg, #ff9a56, #ff6a88)'
            ];

            return `
                <div class="discover-card-enhanced">
                    <div class="card-artwork" style="background: ${colors[i % colors.length]};">
                        <i class="${song.icon}" style="font-size: 50px;"></i>
                        <div class="card-play-overlay">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="card-title">${song.title}</div>
                        <div class="card-artist">${song.artist}</div>
                        <div class="card-meta">
                            <div>${['Playlist', 'Video', 'Mix'][Math.floor(Math.random() * 3)]} • ${Math.floor(Math.random() * 500) + 100}K</div>
                        </div>
                        <span class="card-source-badge">${song.source}</span>
                        <div class="card-actions">
                            <button class="card-action-btn" onclick="advancedDiscover.playSong('${i}', '${song.title}', '')">
                                <i class="fas fa-play"></i> Play
                            </button>
                            <button class="card-action-btn download" onclick="advancedDiscover.downloadSong('default_${i}', '${song.title}', '', '${song.source}')">
                                <i class="fas fa-download"></i> Get
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Global instance
const advancedDiscover = new AdvancedDiscover();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Already initialized above
});
