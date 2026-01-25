/**
 * Smart Recommendations Engine
 */

class RecommendationEngine {
    constructor() {
        this.history = [];
        this.recommendations = [];
        this.init();
    }

    init() {
        this.loadHistory();
        this.generateRecommendations();
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('musicHistory');
            this.history = saved ? JSON.parse(saved) : [];
        } catch (e) {}
    }

    generateRecommendations() {
        if (this.history.length === 0) return [];

        // Analyze top artists and genres
        const artistCounts = {};
        const genreCounts = {};

        this.history.slice(0, 50).forEach(play => {
            artistCounts[play.artist] = (artistCounts[play.artist] || 0) + 1;
            genreCounts[play.genre] = (genreCounts[play.genre] || 0) + 1;
        });

        // Find similar artists and genres
        const topArtists = Object.entries(artistCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([artist]) => artist);

        const topGenres = Object.entries(genreCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([genre]) => genre);

        this.recommendations = { topArtists, topGenres };
        return this.recommendations;
    }

    getRecommendations() {
        return this.recommendations;
    }

    suggestSimilar(track) {
        // Recommend similar tracks based on genre and artist
        return {
            genre: track.genre,
            artist: track.artist
        };
    }
}

const recommendationEngine = new RecommendationEngine();
window.recommendationEngine = recommendationEngine;
