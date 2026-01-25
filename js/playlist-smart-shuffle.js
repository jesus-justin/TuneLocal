// Smart Playlist Shuffle System
class PlaylistSmartShuffle {
    constructor() {
        this.shuffleStrategies = ['random', 'genre', 'artist', 'mood', 'tempo', 'energy'];
        this.currentStrategy = 'random';
        this.trackData = JSON.parse(localStorage.getItem('trackMetadata')) || {};
        this.init();
    }

    init() {
        this.setupShuffleUI();
        this.setupEventListeners();
    }

    setupShuffleUI() {
        const panel = document.createElement('div');
        panel.id = 'shuffleStrategyPanel';
        panel.className = 'shuffle-strategy-panel';
        panel.innerHTML = `
            <div class="shuffle-header">
                <h3>Smart Shuffle Modes</h3>
            </div>
            <div class="shuffle-strategies">
                ${this.shuffleStrategies.map(strategy => `
                    <button class="strategy-btn" data-strategy="${strategy}">
                        ${strategy.charAt(0).toUpperCase() + strategy.slice(1)}
                    </button>
                `).join('')}
            </div>
            <div id="shuffleInfo" class="shuffle-info"></div>
        `;

        const existing = document.getElementById('shuffleStrategyPanel');
        if (existing) existing.remove();
        document.body.appendChild(panel);
    }

    setupEventListeners() {
        document.querySelectorAll('.strategy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const strategy = btn.getAttribute('data-strategy');
                this.currentStrategy = strategy;
                document.querySelectorAll('.strategy-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateStrategyInfo(strategy);
            });
        });
    }

    shufflePlaylist(playlist, strategy = this.currentStrategy) {
        const tracks = [...playlist.tracks || []];

        switch (strategy) {
            case 'random':
                return this.randomShuffle(tracks);
            case 'genre':
                return this.genreGroupShuffle(tracks);
            case 'artist':
                return this.artistGroupShuffle(tracks);
            case 'mood':
                return this.moodShuffle(tracks);
            case 'tempo':
                return this.tempoShuffle(tracks);
            case 'energy':
                return this.energyShuffle(tracks);
            default:
                return this.randomShuffle(tracks);
        }
    }

    randomShuffle(tracks) {
        return tracks.sort(() => Math.random() - 0.5);
    }

    genreGroupShuffle(tracks) {
        const grouped = {};
        tracks.forEach(track => {
            const genre = this.trackData[`${track.title}-${track.artist}`]?.genre || 'Unknown';
            if (!grouped[genre]) grouped[genre] = [];
            grouped[genre].push(track);
        });

        const result = [];
        const genres = Object.keys(grouped);
        let trackIndex = 0;

        while (result.length < tracks.length) {
            genres.forEach(genre => {
                if (grouped[genre].length > 0) {
                    const idx = Math.floor(Math.random() * grouped[genre].length);
                    result.push(grouped[genre][idx]);
                    grouped[genre].splice(idx, 1);
                }
            });
        }

        return result;
    }

    artistGroupShuffle(tracks) {
        const grouped = {};
        tracks.forEach(track => {
            if (!grouped[track.artist]) grouped[track.artist] = [];
            grouped[track.artist].push(track);
        });

        const result = [];
        const artists = Object.keys(grouped);
        let artistIndex = 0;

        while (result.length < tracks.length) {
            artists.forEach(artist => {
                if (grouped[artist].length > 0) {
                    result.push(grouped[artist].shift());
                }
            });
        }

        return result;
    }

    moodShuffle(tracks) {
        const moodMap = {
            'happy': 1, 'energetic': 2, 'focused': 3,
            'calm': 4, 'relaxed': 5, 'sad': 6
        };

        return tracks.sort((a, b) => {
            const moodA = this.trackData[`${a.title}-${a.artist}`]?.mood || 'calm';
            const moodB = this.trackData[`${b.title}-${b.artist}`]?.mood || 'calm';
            return (moodMap[moodA] || 3) - (moodMap[moodB] || 3);
        });
    }

    tempoShuffle(tracks) {
        return tracks.sort((a, b) => {
            const tempoA = this.trackData[`${a.title}-${a.artist}`]?.bpm || 120;
            const tempoB = this.trackData[`${b.title}-${b.artist}`]?.bpm || 120;
            return tempoA - tempoB;
        });
    }

    energyShuffle(tracks) {
        return tracks.sort((a, b) => {
            const energyA = this.trackData[`${a.title}-${a.artist}`]?.energy || 0.5;
            const energyB = this.trackData[`${b.title}-${b.artist}`]?.energy || 0.5;
            return energyB - energyA; // High to low energy
        });
    }

    updateStrategyInfo(strategy) {
        const infoDiv = document.getElementById('shuffleInfo');
        const descriptions = {
            'random': 'Completely random order for maximum variety',
            'genre': 'Groups similar genres together for coherent listening',
            'artist': 'Alternates between different artists',
            'mood': 'Orders by mood progression: happy → energetic → calm → sad',
            'tempo': 'Gradual tempo increase from slow to fast',
            'energy': 'High energy tracks first, tapering down'
        };

        infoDiv.innerHTML = `<p>${descriptions[strategy]}</p>`;
    }
}

const playlistSmartShuffle = new PlaylistSmartShuffle();
window.playlistSmartShuffle = playlistSmartShuffle;
