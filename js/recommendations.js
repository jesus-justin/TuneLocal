/**
 * TuneLocal Recommendation Engine
 * AI-powered music recommendations based on listening habits
 */

class RecommendationEngine {
    constructor() {
        this.recommendations = [];
        this.userProfile = {
            preferences: {},
            history: [],
            ratings: {}
        };
        this.load();
    }

    /**
     * Generate recommendations based on listening history
     */
    generateRecommendations() {
        const stats = statsDashboard?.getSummary() || {};
        const history = recentlyPlayed?.getAll() || [];

        const recommendations = [];

        // Recommendation 1: Based on favorite platform
        if (stats.favoritePlatform === 'Spotify') {
            recommendations.push({
                id: 'rec_1',
                type: 'platform',
                title: 'Explore More Spotify',
                description: 'Since you love Spotify, try exploring curated playlists',
                icon: 'fa-spotify',
                action: () => showSection('spotify')
            });
        }

        // Recommendation 2: Based on listening time
        if (stats.topHour) {
            recommendations.push({
                id: 'rec_2',
                type: 'time',
                title: `Peak Listening Time: ${stats.topHour}`,
                description: 'You listen most during this time. Save your favorites!',
                icon: 'fa-clock',
                action: () => showSection('saved-songs')
            });
        }

        // Recommendation 3: Try offline library if exists
        const offlineCount = history.filter(h => h.type === 'offline').length;
        if (offlineCount === 0 && history.length > 0) {
            recommendations.push({
                id: 'rec_3',
                type: 'discover',
                title: 'Build Your Offline Library',
                description: 'Try uploading music for offline access',
                icon: 'fa-download',
                action: () => showSection('offline-music')
            });
        }

        // Recommendation 4: Use equalizer
        recommendations.push({
            id: 'rec_4',
            type: 'feature',
            title: 'Customize Your Sound',
            description: 'Use the equalizer to enhance your listening experience',
            icon: 'fa-sliders-h',
            action: () => {
                if (quickActions) quickActions.close();
                showNotification('Equalizer ready to use', 'info');
            }
        });

        // Recommendation 5: Create a playlist
        const playlistCount = JSON.parse(localStorage.getItem('tunelocal_playlists') || '[]').length;
        if (playlistCount === 0 && history.length > 5) {
            recommendations.push({
                id: 'rec_5',
                type: 'playlist',
                title: 'Organize with Playlists',
                description: 'Group your favorite songs into playlists',
                icon: 'fa-list-ul',
                action: () => {
                    showSection('playlists');
                    document.getElementById('playlistForm').style.display = 'block';
                }
            });
        }

        // Recommendation 6: Sleep timer
        recommendations.push({
            id: 'rec_6',
            type: 'feature',
            title: 'Use Sleep Timer',
            description: 'Let music fade away with the sleep timer feature',
            icon: 'fa-moon',
            action: () => quickActions?.showSleepTimer?.()
        });

        this.recommendations = recommendations;
        return recommendations;
    }

    /**
     * Get top N recommendations
     */
    getTopRecommendations(limit = 3) {
        return this.recommendations.slice(0, limit);
    }

    /**
     * Get recommendation by type
     */
    getByType(type) {
        return this.recommendations.filter(r => r.type === type);
    }

    /**
     * Rate recommendation
     */
    rateRecommendation(id, rating) {
        this.userProfile.ratings[id] = rating;
        this.save();
    }

    /**
     * Get personalized suggestions
     */
    getPersonalizedSuggestions() {
        const suggestions = [];

        // Check listening patterns
        const stats = statsDashboard?.getStats() || {};
        
        if (stats.sessions && stats.sessions.length > 0) {
            // Suggest visualizer if they haven't used it
            if (!sessionManager?.sessionData?.features?.visualizer) {
                suggestions.push({
                    title: 'Try the Visualizer',
                    description: 'Enhance your music with animated visualizations',
                    priority: 'medium'
                });
            }

            // Suggest sleep timer for late-night listeners
            const topHour = stats.playsByHour ? 
                stats.playsByHour.findIndex(max => Math.max(...stats.playsByHour)) : 0;
            if (topHour >= 22 || topHour <= 2) {
                suggestions.push({
                    title: 'Night Owl?',
                    description: 'Use sleep timer to protect your sleep schedule',
                    priority: 'high'
                });
            }
        }

        return suggestions;
    }

    /**
     * Load from localStorage
     */
    load() {
        try {
            const saved = localStorage.getItem('tunelocal_recommendations');
            if (saved) {
                this.userProfile = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load recommendations:', e);
        }
    }

    /**
     * Save to localStorage
     */
    save() {
        try {
            localStorage.setItem('tunelocal_recommendations', JSON.stringify(this.userProfile));
        } catch (e) {
            console.error('Failed to save recommendations:', e);
        }
    }

    /**
     * Clear recommendations cache
     */
    clear() {
        this.recommendations = [];
    }
}

// Global instance
const recommendationEngine = new RecommendationEngine();

/**
 * Render recommendations UI
 */
function renderRecommendations(containerId = 'recommendations-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const recs = recommendationEngine.generateRecommendations();
    const topRecs = recs.slice(0, 3);

    if (topRecs.length === 0) {
        container.innerHTML = '<p class="text-muted">No recommendations at this time</p>';
        return;
    }

    container.innerHTML = `
        <div class="recommendations-list">
            ${topRecs.map(rec => `
                <div class="recommendation-card">
                    <div class="rec-icon">
                        <i class="fas ${rec.icon}"></i>
                    </div>
                    <div class="rec-content">
                        <h4>${rec.title}</h4>
                        <p>${rec.description}</p>
                    </div>
                    <button class="btn-icon" onclick="handleRecommendation(${recs.indexOf(rec)})">
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Handle recommendation click
 */
function handleRecommendation(index) {
    const recs = recommendationEngine.recommendations;
    if (recs[index] && recs[index].action) {
        recs[index].action();
        recommendationEngine.rateRecommendation(recs[index].id, 1);
    }
}

/**
 * Show recommendation notifications periodically
 */
function showRandomRecommendation() {
    const suggestions = recommendationEngine.getPersonalizedSuggestions();
    if (suggestions.length > 0) {
        const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        showNotification(`${suggestion.title} - ${suggestion.description}`, 'info', 5000);
    }
}

// Show recommendation every 10 minutes
setInterval(() => {
    if (Math.random() > 0.7) { // 30% chance
        showRandomRecommendation();
    }
}, 600000); // 10 minutes
