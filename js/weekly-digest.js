/**
 * Weekly Digest Generator
 */

class WeeklyDigest {
    constructor() {
        this.digestDay = 1; // Monday
        this.digestTime = '09:00';
        this.init();
    }

    init() {
        this.checkAndGenerateDigest();
        this.setupSchedule();
    }

    setupSchedule() {
        // Check daily
        setInterval(() => this.checkAndGenerateDigest(), 86400000);
    }

    checkAndGenerateDigest() {
        const lastDigest = localStorage.getItem('lastDigestDate');
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        if (lastDigest !== todayStr && today.getDay() === this.digestDay) {
            this.generateDigest();
            localStorage.setItem('lastDigestDate', todayStr);
        }
    }

    generateDigest() {
        try {
            const history = JSON.parse(localStorage.getItem('musicHistory') || '[]');
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);

            const weekPlays = history.filter(h => {
                const date = new Date(h.timestamp);
                return date >= weekAgo;
            });

            const digest = {
                generatedDate: new Date().toISOString(),
                totalPlays: weekPlays.length,
                topTracks: this.getTopTracks(weekPlays, 5),
                topArtists: this.getTopArtists(weekPlays, 5),
                listeningTime: this.calculateListeningTime(weekPlays),
                favoriteGenre: this.getFavoriteGenre(weekPlays)
            };

            localStorage.setItem('weeklyDigest', JSON.stringify(digest));
            this.showDigestNotification(digest);

        } catch (e) {
            console.error('Error generating digest:', e);
        }
    }

    getTopTracks(plays, limit) {
        const counts = {};
        plays.forEach(p => {
            const key = `${p.title}|${p.artist}`;
            counts[key] = (counts[key] || 0) + 1;
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([key]) => key);
    }

    getTopArtists(plays, limit) {
        const counts = {};
        plays.forEach(p => {
            counts[p.artist] = (counts[p.artist] || 0) + 1;
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([artist]) => artist);
    }

    calculateListeningTime(plays) {
        const total = plays.reduce((sum, p) => sum + (p.duration || 0), 0);
        return `${Math.floor(total / 3600)}h ${Math.floor((total % 3600) / 60)}m`;
    }

    getFavoriteGenre(plays) {
        const counts = {};
        plays.forEach(p => {
            counts[p.genre] = (counts[p.genre] || 0) + 1;
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';
    }

    showDigestNotification(digest) {
        if (typeof showNotification === 'function') {
            showNotification(`Your weekly digest is ready! ${digest.totalPlays} plays this week.`, 'info');
        }
    }

    getDigest() {
        try {
            return JSON.parse(localStorage.getItem('weeklyDigest') || 'null');
        } catch (e) {
            return null;
        }
    }
}

const weeklyDigest = new WeeklyDigest();
window.weeklyDigest = weeklyDigest;
