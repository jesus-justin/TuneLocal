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

            // Real-time suggestions as user types
            searchInput.addEventListener('input', (e) => {
                this.showSearchSuggestions(e.target.value);
            });

            // Hide suggestions when clicking outside
            document.addEventListener('click', (e) => {
                if (e.target !== searchInput && e.target.closest('.search-suggestions') === null) {
                    const suggestions = document.querySelector('.search-suggestions');
                    if (suggestions) suggestions.style.display = 'none';
                }
            });
        }

        // Trending tag clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('trending-tag')) {
                if (searchInput) {
                    searchInput.value = e.target.textContent;
                }
                this.performWebSearch();
            }
        });

        // Setup related searches section
        this.setupRelatedSearches();
    }

    showSearchSuggestions(query) {
        if (!query || query.length < 1) {
            const existing = document.querySelector('.search-suggestions');
            if (existing) existing.style.display = 'none';
            return;
        }

        // Get suggestions from AI engine
        const suggestions = aiSearchEngine.getSuggestions(query);
        if (suggestions.length === 0) return;

        // Create or update suggestions dropdown
        let suggestionsBox = document.querySelector('.search-suggestions');
        if (!suggestionsBox) {
            suggestionsBox = document.createElement('div');
            suggestionsBox.className = 'search-suggestions';
            const searchInput = document.getElementById('discoverSearchInput');
            if (searchInput) {
                searchInput.parentElement.appendChild(suggestionsBox);
            }
            this.injectSuggestionsStyles();
        }

        suggestionsBox.innerHTML = suggestions.map(sugg => `
            <div class="suggestion-item" onclick="
                document.getElementById('discoverSearchInput').value = '${sugg.text}';
                advancedDiscover.performWebSearch();
                this.closest('.search-suggestions').style.display = 'none';
            ">
                <i class="${sugg.icon}"></i>
                <span>${sugg.text}</span>
                <small>${sugg.type}</small>
            </div>
        `).join('');

        suggestionsBox.style.display = 'block';
    }

    setupRelatedSearches() {
        const discoverSection = document.getElementById('discover');
        if (!discoverSection) return;

        let relatedSection = discoverSection.querySelector('.related-searches-section');
        if (!relatedSection) {
            relatedSection = document.createElement('div');
            relatedSection.className = 'related-searches-section';
            const container = discoverSection.querySelector('.discover-container');
            if (container) {
                container.appendChild(relatedSection);
            }
        }
    }

    updateRelatedSearches(query) {
        const related = aiSearchEngine.getRelatedSearches(query);
        const relatedSection = document.querySelector('.related-searches-section');
        
        if (!relatedSection || related.length === 0) return;

        relatedSection.innerHTML = `
            <h4 style="color: rgba(255, 255, 255, 0.8); margin-bottom: 12px;">
                <i class="fas fa-link"></i> Related Searches
            </h4>
            <div class="related-search-tags">
                ${related.map(tag => `
                    <div class="related-tag" onclick="
                        document.getElementById('discoverSearchInput').value = '${tag}';
                        advancedDiscover.performWebSearch();
                    ">${tag}</div>
                `).join('')}
            </div>
        `;
    }

    injectSuggestionsStyles() {
        if (document.getElementById('suggestionStyles')) return;

        const style = document.createElement('style');
        style.id = 'suggestionStyles';
        style.textContent = `
            .search-suggestions {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: rgba(20, 20, 40, 0.95);
                border: 1px solid rgba(29, 185, 84, 0.3);
                border-top: none;
                border-radius: 0 0 8px 8px;
                max-height: 300px;
                overflow-y: auto;
                z-index: 1000;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(10px);
            }

            .suggestion-item {
                padding: 12px 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                transition: all 0.2s ease;
            }

            .suggestion-item:hover {
                background: rgba(29, 185, 84, 0.2);
            }

            .suggestion-item i {
                color: rgba(29, 185, 84, 0.8);
                font-size: 14px;
            }

            .suggestion-item span {
                flex: 1;
                color: white;
                font-size: 14px;
                font-weight: 500;
            }

            .suggestion-item small {
                background: rgba(29, 185, 84, 0.2);
                padding: 2px 6px;
                border-radius: 4px;
                color: rgba(29, 185, 84, 0.9);
                font-size: 10px;
                text-transform: uppercase;
            }

            .related-searches-section {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 16px;
                margin-top: 24px;
                animation: slideUp 0.3s ease;
            }

            .related-search-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .related-tag {
                padding: 6px 12px;
                background: linear-gradient(135deg, rgba(100, 200, 255, 0.2), rgba(29, 185, 84, 0.1));
                border: 1px solid rgba(29, 185, 84, 0.3);
                border-radius: 16px;
                color: rgba(255, 255, 255, 0.9);
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s ease;
            }

            .related-tag:hover {
                background: linear-gradient(135deg, rgba(100, 200, 255, 0.4), rgba(29, 185, 84, 0.3));
                border-color: rgba(29, 185, 84, 0.6);
            }

            .search-input-discover {
                position: relative;
            }

            @keyframes slideUp {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    performWebSearch() {
        const searchInput = document.getElementById('discoverSearchInput');
        const searchType = document.getElementById('discoverSearchType');
        const query = searchInput ? searchInput.value.trim() : '';
        const source = searchType ? searchType.value : 'all';

        if (!query) {
            alert('Please enter a search query');
            return;
        }

        console.log(`Searching for "${query}" in ${source}`);

        // Use AI search engine for smarter results
        const aiResults = aiSearchEngine.search(query);
        console.log('AI Search Results:', aiResults);

        // Save to search history
        this.addToSearchHistory(query);

        // Update related searches
        this.updateRelatedSearches(query);

        // Convert AI results to displayable format and generate music results
        if (source === 'all') {
            // If AI found good results, use those; otherwise do web search
            if (aiResults.length > 0 && aiResults[0].relevanceScore > 60) {
                this.displayAIBasedResults(aiResults, query);
            } else {
                this.searchYouTube(query);
            }
        } else if (source === 'youtube') {
            this.searchYouTube(query);
        } else if (source === 'spotify') {
            this.searchSpotify(query);
        } else if (source === 'soundcloud') {
            this.searchSoundCloud(query);
        } else if (source === 'web') {
            this.searchWeb(query);
        }
    }

    displayAIBasedResults(aiResults, query) {
        // Generate smart music results based on AI understanding
        const results = [];

        aiResults.slice(0, 8).forEach((aiResult, index) => {
            results.push({
                id: `ai_${aiResult.type}_${index}`,
                title: aiResult.type === 'song' ? aiResult.term : 
                       aiResult.type === 'artist' ? `${aiResult.term} Top Tracks` :
                       aiResult.type === 'genre' ? `${this.capitalize(aiResult.term)} Mix` :
                       aiResult.type === 'playlist' ? aiResult.term :
                       `${this.capitalize(aiResult.term)} Collection`,
                artist: aiResult.artist || aiResult.category || 'Multiple Artists',
                source: 'Smart AI Search',
                duration: `${2 + index}:${(30 * index) % 60}`,
                views: `${(Math.random() * 900 + 100).toFixed(0)}K`,
                icon: aiSearchEngine.getTypeIcon(aiResult.type),
                color: this.getColorForType(aiResult.type),
                url: `https://youtube.com/watch?v=ai_${index}`,
                type: 'ai',
                aiMetadata: aiResult,
                relevanceScore: aiResult.relevanceScore
            });
        });

        this.displaySearchResults(results, 'AI Search');
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getColorForType(type) {
        const colors = {
            'artist': 'linear-gradient(135deg, #667eea, #764ba2)',
            'song': 'linear-gradient(135deg, #f093fb, #f5576c)',
            'genre': 'linear-gradient(135deg, #4facfe, #00f2fe)',
            'mood': 'linear-gradient(135deg, #43e97b, #38f9d7)',
            'playlist': 'linear-gradient(135deg, #fa709a, #fee140)'
        };
        return colors[type] || 'linear-gradient(135deg, #667eea, #764ba2)';
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
        if (!grid) {
            console.error('Discover grid not found');
            return;
        }

        console.log(`Displaying ${results.length} ${source} results`);

        grid.innerHTML = results.map(song => {
            // Use pre-defined color if available, otherwise generate random
            let bgColor = song.color;
            if (!bgColor) {
                const colors = [
                    'linear-gradient(135deg, #ff0000, #ff6b6b)',
                    'linear-gradient(135deg, #667eea, #764ba2)',
                    'linear-gradient(135deg, #f093fb, #f5576c)',
                    'linear-gradient(135deg, #4facfe, #00f2fe)',
                    'linear-gradient(135deg, #43e97b, #38f9d7)',
                    'linear-gradient(135deg, #fa709a, #fee140)',
                    'linear-gradient(135deg, #30cfd0, #330867)',
                    'linear-gradient(135deg, #a8edea, #fed6e3)'
                ];
                bgColor = colors[Math.floor(Math.random() * colors.length)];
            }

            // Add relevance badge if available
            const relevanceBadge = song.relevanceScore ? `
                <div class="relevance-badge" title="Match confidence">
                    <i class="fas fa-bolt"></i> ${song.relevanceScore}%
                </div>
            ` : '';

            return `
                <div class="discover-card-enhanced">
                    <div class="card-artwork" style="background: ${bgColor};">
                        <i class="${song.icon}" style="font-size: 50px;"></i>
                        <div class="card-play-overlay">
                            <i class="fas fa-play"></i>
                        </div>
                        ${relevanceBadge}
                    </div>
                    <div class="card-content">
                        <div class="card-title">${song.title}</div>
                        <div class="card-artist">${song.artist}</div>
                        <div class="card-meta">
                            <div>${song.duration} • ${song.views} views</div>
                        </div>
                        <span class="card-source-badge">${song.source}</span>
                        <div class="card-actions">
                            <button class="card-action-btn" onclick="advancedDiscover.playSong('${song.id}', '${song.title.replace(/'/g, "\\'")}', '${song.url}')">
                                <i class="fas fa-play"></i> Play
                            </button>
                            <button class="card-action-btn download" onclick="advancedDiscover.downloadSong('${song.id}', '${song.title.replace(/'/g, "\\'")}', '${song.url}', '${song.type}')">
                                <i class="fas fa-download"></i> Get
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        this.discoveries = results;

        // Add styles for relevance badge
        if (!document.getElementById('relevanceBadgeStyles')) {
            const style = document.createElement('style');
            style.id = 'relevanceBadgeStyles';
            style.textContent = `
                .relevance-badge {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: linear-gradient(135deg, rgba(255, 215, 0, 0.9), rgba(255, 165, 0, 0.9));
                    color: #1a1a1a;
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .relevance-badge i {
                    font-size: 10px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    playSong(id, title, url) {
        console.log(`Playing: ${title} from ${url}`);
        this.showPlayerModal(title, url);
    }

    showPlayerModal(title, url) {
        // Create or update player modal
        let modal = document.getElementById('discoverPlayModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'discoverPlayModal';
            modal.className = 'discover-play-modal';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="modal-overlay-discover" onclick="this.closest('.discover-play-modal').style.display='none'">
                <div class="modal-discover-content" onclick="event.stopPropagation()">
                    <div class="modal-discover-header">
                        <h3>${title}</h3>
                        <button class="close-btn" onclick="document.getElementById('discoverPlayModal').style.display='none'">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-discover-body">
                        <div class="player-embed">
                            <iframe width="100%" height="400" 
                                src="https://www.youtube.com/embed/${this.extractYouTubeId(url)}" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen>
                            </iframe>
                        </div>
                        <div class="player-info">
                            <h4>${title}</h4>
                            <p><small>Now Playing</small></p>
                            <div class="player-actions">
                                <button class="play-action-btn" onclick="advancedDiscover.downloadSong('${title}', '${title}', '${url}', 'YouTube')">
                                    <i class="fas fa-download"></i> Download to Offline
                                </button>
                                <button class="play-action-btn" onclick="advancedDiscover.addToPlaylist('${title}')">
                                    <i class="fas fa-plus-circle"></i> Add to Playlist
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Inject modal styles if not already there
        if (!document.getElementById('discoverPlayModalStyles')) {
            const style = document.createElement('style');
            style.id = 'discoverPlayModalStyles';
            style.textContent = `
                .discover-play-modal {
                    display: flex;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 2000;
                    align-items: center;
                    justify-content: center;
                }

                .modal-overlay-discover {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(10px);
                }

                .modal-discover-content {
                    position: relative;
                    background: linear-gradient(135deg, rgba(20, 20, 40, 0.98), rgba(30, 30, 60, 0.98));
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    max-width: 800px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
                    animation: slideUp 0.3s ease;
                }

                @keyframes slideUp {
                    from { transform: translateY(40px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                .modal-discover-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 24px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .modal-discover-header h3 {
                    margin: 0;
                    color: white;
                    font-size: 20px;
                }

                .close-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .close-btn:hover {
                    background: rgba(255, 255, 255, 0.15);
                }

                .modal-discover-body {
                    padding: 24px;
                }

                .player-embed {
                    margin-bottom: 24px;
                    border-radius: 12px;
                    overflow: hidden;
                }

                .player-embed iframe {
                    border-radius: 12px;
                }

                .player-info {
                    background: rgba(255, 255, 255, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 16px;
                }

                .player-info h4 {
                    margin: 0 0 8px 0;
                    color: white;
                    font-size: 16px;
                }

                .player-info p {
                    margin: 0 0 16px 0;
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 12px;
                }

                .player-actions {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .play-action-btn {
                    flex: 1;
                    min-width: 140px;
                    padding: 10px 14px;
                    background: linear-gradient(135deg, rgba(29, 185, 84, 0.3), rgba(29, 185, 84, 0.1));
                    border: 1px solid rgba(29, 185, 84, 0.5);
                    border-radius: 8px;
                    color: white;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 13px;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }

                .play-action-btn:hover {
                    background: linear-gradient(135deg, rgba(29, 185, 84, 0.5), rgba(29, 185, 84, 0.3));
                    border-color: rgba(29, 185, 84, 0.7);
                }

                @media (max-width: 768px) {
                    .modal-discover-content {
                        width: 95%;
                    }

                    .player-embed iframe {
                        height: 250px !important;
                    }

                    .player-actions {
                        flex-direction: column;
                    }

                    .play-action-btn {
                        min-width: auto;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        modal.style.display = 'flex';
    }

    extractYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : '0';
    }

    downloadSong(id, title, url, source) {
        console.log(`Download initiated: ${title} from ${source}`);
        
        // Use the download manager if available
        if (typeof downloadManager !== 'undefined') {
            downloadManager.createDownloadItem(id, title, url);
            
            // Show success notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, rgba(100, 200, 255, 0.9), rgba(29, 185, 84, 0.9));
                color: white;
                padding: 16px 24px;
                border-radius: 12px;
                z-index: 2001;
                animation: slideInRight 0.3s ease;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            `;
            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-check-circle" style="font-size: 20px;"></i>
                    <div>
                        <strong>Download Started!</strong><br>
                        <small>"${title}" is queued</small>
                    </div>
                </div>
            `;
            
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 4000);
        } else {
            console.warn('Download manager not available');
        }
    }

    addToPlaylist(title) {
        let playlists = JSON.parse(localStorage.getItem('userPlaylists') || '[]');
        playlists.push({
            title: title,
            addedAt: new Date().toLocaleString()
        });
        localStorage.setItem('userPlaylists', JSON.stringify(playlists));
        
        alert(`Added "${title}" to your playlist!`);
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

        // Load default discoveries on init - use small delay to ensure DOM is ready
        setTimeout(() => this.loadDefaultDiscoveries(), 100);
    }

    loadDefaultDiscoveries() {
        const grid = document.getElementById('discoverGrid');
        if (!grid) {
            console.warn('Discover grid not found, retrying...');
            setTimeout(() => this.loadDefaultDiscoveries(), 500);
            return;
        }

        if (grid.innerHTML.includes('discover-card-enhanced')) {
            return; // Already loaded
        }

        console.log('Loading default discoveries...');

        const defaults = [
            { title: 'Top 50 Lofi', artist: 'Spotify', source: 'Spotify', icon: 'fas fa-list-ul' },
            { title: 'Synthwave Classics', artist: 'Music Hub', source: 'YouTube', icon: 'fab fa-youtube' },
            { title: 'Ambient Meditation', artist: 'Relaxing Sounds', source: 'Spotify', icon: 'fas fa-spa' },
            { title: 'Electronic Vibes', artist: 'EDM Daily', source: 'YouTube', icon: 'fas fa-compact-disc' },
            { title: 'Jazz Classics', artist: 'Jazz Masters', source: 'Web', icon: 'fas fa-saxophone' },
            { title: 'K-Pop Hits 2024', artist: 'K-Pop Central', source: 'YouTube', icon: 'fas fa-microphone' },
            { title: 'Chill Beats Mix', artist: 'Chill Music', source: 'Spotify', icon: 'fas fa-cloud' },
            { title: 'Rock Anthems', artist: 'Rock Station', source: 'Web', icon: 'fas fa-guitar' }
        ];

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

        grid.innerHTML = defaults.map((song, i) => `
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
                        <button class="card-action-btn" onclick="advancedDiscover.playSong('default_${i}', '${song.title.replace(/'/g, "\\'")}', 'https://www.youtube.com/watch?v=${i}')">
                            <i class="fas fa-play"></i> Play
                        </button>
                        <button class="card-action-btn download" onclick="advancedDiscover.downloadSong('default_${i}', '${song.title.replace(/'/g, "\\'")}', 'https://www.youtube.com/watch?v=${i}', '${song.source}')">
                            <i class="fas fa-download"></i> Get
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        console.log(`Loaded ${defaults.length} default discoveries`);
    }
}

// Global instance
const advancedDiscover = new AdvancedDiscover();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Already initialized above
});
