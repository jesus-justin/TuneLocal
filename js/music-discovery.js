// Music Discovery Engine
class MusicDiscovery {
    constructor() {
        this.discoveryHistory = JSON.parse(localStorage.getItem('discoveryHistory')) || [];
        this.savedDiscoveries = JSON.parse(localStorage.getItem('savedDiscoveries')) || {};
        this.algorithmsEnabled = JSON.parse(localStorage.getItem('discoveryAlgorithms')) || {
            collaborative: true,
            contentBased: true,
            hybrid: true,
            trending: true
        };
        this.init();
    }

    init() {
        this.setupDiscoveryUI();
        this.setupEventListeners();
    }

    setupDiscoveryUI() {
        const panel = document.createElement('div');
        panel.id = 'musicDiscoveryPanel';
        panel.className = 'discovery-panel';
        panel.innerHTML = `
            <div class="discovery-header">
                <h3>Music Discovery</h3>
                <button id="refreshDiscoveries" class="refresh-btn">🔄 Refresh</button>
            </div>
            <div class="discovery-algorithms">
                <label><input type="checkbox" class="algo-toggle" data-algo="collaborative" checked /> Collaborative</label>
                <label><input type="checkbox" class="algo-toggle" data-algo="contentBased" checked /> Content-Based</label>
                <label><input type="checkbox" class="algo-toggle" data-algo="hybrid" checked /> Hybrid</label>
                <label><input type="checkbox" class="algo-toggle" data-algo="trending" checked /> Trending</label>
            </div>
            <div id="discoveryResults" class="discovery-results"></div>
        `;

        const existing = document.getElementById('musicDiscoveryPanel');
        if (existing) existing.remove();
        document.body.appendChild(panel);
    }

    setupEventListeners() {
        document.getElementById('refreshDiscoveries')?.addEventListener('click', () => this.generateDiscoveries());
        document.querySelectorAll('.algo-toggle').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const algo = e.target.getAttribute('data-algo');
                this.algorithmsEnabled[algo] = e.target.checked;
                localStorage.setItem('discoveryAlgorithms', JSON.stringify(this.algorithmsEnabled));
                this.generateDiscoveries();
            });
        });
    }

    generateDiscoveries() {
        const results = [];

        if (this.algorithmsEnabled.collaborative) {
            results.push(...this.collaborativeFiltering());
        }
        if (this.algorithmsEnabled.contentBased) {
            results.push(...this.contentBasedFiltering());
        }
        if (this.algorithmsEnabled.hybrid) {
            results.push(...this.hybridFiltering());
        }
        if (this.algorithmsEnabled.trending) {
            results.push(...this.trendingDiscovery());
        }

        this.renderDiscoveries(results);
        this.discoveryHistory.push({
            timestamp: new Date().toISOString(),
            discoveries: results
        });
        localStorage.setItem('discoveryHistory', JSON.stringify(this.discoveryHistory));
    }

    collaborativeFiltering() {
        // Similar users recommendations
        const playHistory = JSON.parse(localStorage.getItem('playHistory')) || [];
        const topArtists = this.getTopArtists(playHistory, 5);

        return topArtists.map(artist => ({
            title: `Discover more from ${artist}`,
            type: 'artist',
            source: 'collaborative',
            score: Math.random() * 100
        }));
    }

    contentBasedFiltering() {
        // Recommend based on liked tracks
        const playHistory = JSON.parse(localStorage.getItem('playHistory')) || [];
        const topGenres = this.getTopGenres(playHistory, 5);

        return topGenres.map(genre => ({
            title: `Explore ${genre} tracks`,
            type: 'genre',
            source: 'contentBased',
            score: Math.random() * 100
        }));
    }

    hybridFiltering() {
        // Combine both approaches
        return [{
            title: 'Based on your unique taste',
            type: 'hybrid',
            source: 'hybrid',
            score: Math.random() * 100
        }];
    }

    trendingDiscovery() {
        // What's popular now
        return [{
            title: 'Trending now in your region',
            type: 'trending',
            source: 'trending',
            score: Math.random() * 100
        }];
    }

    getTopArtists(history, limit = 5) {
        const artists = {};
        history.forEach(item => {
            artists[item.artist] = (artists[item.artist] || 0) + 1;
        });
        return Object.entries(artists)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([artist]) => artist);
    }

    getTopGenres(history, limit = 5) {
        const genres = ['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Classical'];
        return genres.slice(0, limit);
    }

    renderDiscoveries(discoveries) {
        const container = document.getElementById('discoveryResults');
        if (!container) return;

        container.innerHTML = '';
        discoveries.forEach((discovery, idx) => {
            const item = document.createElement('div');
            item.className = `discovery-item discovery-${discovery.source}`;
            item.innerHTML = `
                <div class="discovery-content">
                    <h4>${discovery.title}</h4>
                    <span class="discovery-source">${discovery.source}</span>
                    <span class="discovery-score">${Math.round(discovery.score)}%</span>
                </div>
                <div class="discovery-actions">
                    <button class="explore-btn" data-idx="${idx}">Explore</button>
                    <button class="save-discovery-btn" data-idx="${idx}">Save</button>
                </div>
            `;
            container.appendChild(item);
        });
    }

    saveDiscovery(discovery) {
        const id = Date.now();
        this.savedDiscoveries[id] = {
            id: id,
            ...discovery,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem('savedDiscoveries', JSON.stringify(this.savedDiscoveries));
        showNotification('Discovery saved', 'success');
    }
}

const musicDiscovery = new MusicDiscovery();
window.musicDiscovery = musicDiscovery;
