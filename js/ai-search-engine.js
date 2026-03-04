// AI Search Engine - Smart search with fuzzy matching and recommendations
class AISearchEngine {
    constructor() {
        this.searchIndex = [];
        this.searchHistory = [];
        this.userPreferences = {};
        this.init();
    }

    init() {
        this.buildSearchIndex();
        this.loadSearchHistory();
    }

    buildSearchIndex() {
        // Comprehensive music database index
        this.searchIndex = [
            // Artists
            { term: 'the weeknd', type: 'artist', category: 'r&b', tags: ['r&b', 'pop', 'hip-hop', 'canadian'] },
            { term: 'billie eilish', type: 'artist', category: 'pop', tags: ['pop', 'dark', 'indie', 'american'] },
            { term: 'dua lipa', type: 'artist', category: 'pop', tags: ['pop', 'dance', 'british'] },
            { term: 'post malone', type: 'artist', category: 'hip-hop', tags: ['hip-hop', 'rap', 'pop', 'american'] },
            { term: 'coldplay', type: 'artist', category: 'rock', tags: ['rock', 'alternative', 'british'] },
            { term: 'ed sheeran', type: 'artist', category: 'pop', tags: ['pop', 'singer-songwriter', 'british'] },
            { term: 'taylor swift', type: 'artist', category: 'pop', tags: ['pop', 'country', 'singer-songwriter'] },
            { term: 'ariana grande', type: 'artist', category: 'pop', tags: ['pop', 'r&b', 'american'] },
            
            // Songs
            { term: 'blinding lights', type: 'song', category: 'pop', artist: 'the weeknd', tags: ['synth-pop', 'dance', '2019'] },
            { term: 'shape of you', type: 'song', category: 'pop', artist: 'ed sheeran', tags: ['pop', 'danceable'] },
            { term: 'bad guy', type: 'song', category: 'pop', artist: 'billie eilish', tags: ['dark', 'pop', 'indie'] },
            { term: 'levitating', type: 'song', category: 'pop', artist: 'dua lipa', tags: ['dance-pop', 'disco'] },
            { term: 'someone like you', type: 'song', category: 'pop', artist: 'adele', tags: ['ballad', 'emotional'] },
            { term: 'bohemian rhapsody', type: 'song', category: 'rock', artist: 'queen', tags: ['rock', 'classic', 'epic'] },
            
            // Genres
            { term: 'lofi', type: 'genre', category: 'electronic', tags: ['chill', 'study', 'ambient', 'hip-hop'] },
            { term: 'synthwave', type: 'genre', category: 'electronic', tags: ['80s', 'ambient', 'atmospheric', 'retro'] },
            { term: 'ambient', type: 'genre', category: 'electronic', tags: ['chill', 'meditation', 'relaxing'] },
            { term: 'jazz', type: 'genre', category: 'jazz', tags: ['instrumental', 'classic', 'smooth'] },
            { term: 'electronic', type: 'genre', category: 'electronic', tags: ['edm', 'dance', 'synth'] },
            { term: 'indie', type: 'genre', category: 'alternative', tags: ['alternative', 'unique', 'artistic'] },
            { term: 'rock', type: 'genre', category: 'rock', tags: ['guitar', 'classic', 'loud'] },
            { term: 'hip-hop', type: 'genre', category: 'hip-hop', tags: ['rap', 'beats', 'urban'] },
            { term: 'pop', type: 'genre', category: 'pop', tags: ['mainstream', 'catchy', 'popular'] },
            { term: 'k-pop', type: 'genre', category: 'pop', tags: ['korean', 'dance', 'synchronized'] },
            
            // Moods
            { term: 'chill', type: 'mood', category: 'relaxing', tags: ['relaxing', 'ambient', 'lofi', 'instrumental'] },
            { term: 'energetic', type: 'mood', category: 'upbeat', tags: ['dance', 'workout', 'fast', 'upbeat'] },
            { term: 'sad', type: 'mood', category: 'emotional', tags: ['melancholic', 'ballad', 'emotional', 'acoustic'] },
            { term: 'happy', type: 'mood', category: 'upbeat', tags: ['cheerful', 'upbeat', 'positive', 'fun'] },
            { term: 'focus', type: 'mood', category: 'study', tags: ['concentration', 'instrumental', 'lofi', 'ambient'] },
            { term: 'party', type: 'mood', category: 'upbeat', tags: ['dance', 'club', 'high-energy', 'fun'] },
            { term: 'workout', type: 'mood', category: 'upbeat', tags: ['fast', 'pump', 'energetic', 'intense'] },
            
            // Playlists
            { term: 'top 50', type: 'playlist', category: 'charts', tags: ['popular', 'mainstream', 'trending'] },
            { term: 'new releases', type: 'playlist', category: 'charts', tags: ['new', 'latest', 'recent'] },
            { term: 'study beats', type: 'playlist', category: 'study', tags: ['focus', 'lofi', 'instrumental'] },
            { term: 'workout mix', type: 'playlist', category: 'fitness', tags: ['exercise', 'energetic', 'pump'] },
        ];
    }

    // Calculate similarity score between two strings (0-100)
    calculateSimilarity(str1, str2) {
        const s1 = str1.toLowerCase();
        const s2 = str2.toLowerCase();

        // Exact match
        if (s1 === s2) return 100;

        // Contains match
        if (s1.includes(s2) || s2.includes(s1)) return 85;

        // Levenshtein distance based matching
        const longer = s1.length > s2.length ? s1 : s2;
        const shorter = s1.length > s2.length ? s2 : s1;

        if (longer.length === 0) return 100;

        const editDistance = this.levenshteinDistance(longer, shorter);
        return ((longer.length - editDistance) / longer.length) * 100;
    }

    // Levenshtein distance algorithm
    levenshteinDistance(s1, s2) {
        const costs = [];
        for (let i = 0; i <= s1.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= s2.length; j++) {
                if (i === 0) {
                    costs[j] = j;
                } else if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    }
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
            if (i > 0) costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    }

    // Smart search with AI-like relevance ranking
    search(query) {
        if (!query || query.length === 0) return [];

        const q = query.toLowerCase().trim();
        const results = [];

        // Score each item in the index
        this.searchIndex.forEach(item => {
            let score = 0;
            let matchType = null;

            // Primary term matching
            const similarity = this.calculateSimilarity(item.term, q);
            if (similarity > 50) {
                score = similarity;
                matchType = 'primary';
            }

            // Tag matching (secondary)
            if (item.tags) {
                item.tags.forEach(tag => {
                    const tagSimilarity = this.calculateSimilarity(tag, q);
                    if (tagSimilarity > 60 && tagSimilarity > score) {
                        score = tagSimilarity * 0.8; // Slightly lower weight for tag matches
                        matchType = 'tag';
                    }
                });
            }

            // Category matching
            if (item.category && this.calculateSimilarity(item.category, q) > 70) {
                score = Math.max(score, 60);
                matchType = matchType || 'category';
            }

            // Artist matching
            if (item.artist && this.calculateSimilarity(item.artist, q) > 70) {
                score = Math.max(score, 75);
                matchType = matchType || 'artist';
            }

            if (score > 50) {
                results.push({
                    ...item,
                    relevanceScore: Math.round(score),
                    matchType
                });
            }
        });

        // Sort by relevance score
        results.sort((a, b) => b.relevanceScore - a.relevanceScore);

        // Save to search history for learning
        this.addToHistory(q, results);

        return results;
    }

    // Get smart suggestions as user types
    getSuggestions(query) {
        if (!query || query.length < 2) return [];

        const q = query.toLowerCase();
        const suggestions = this.searchIndex
            .filter(item => item.term.startsWith(q) || item.term.includes(q))
            .sort((a, b) => a.term.length - b.term.length)
            .slice(0, 8)
            .map(item => ({
                text: item.term,
                type: item.type,
                icon: this.getTypeIcon(item.type)
            }));

        return suggestions;
    }

    // Get related searches based on current query
    getRelatedSearches(query) {
        const results = this.search(query);
        if (results.length === 0) return [];

        const relatedTerms = new Set();
        results.slice(0, 3).forEach(result => {
            if (result.tags) {
                result.tags.forEach(tag => relatedTerms.add(tag));
            }
            if (result.category) {
                relatedTerms.add(result.category);
            }
        });

        return Array.from(relatedTerms).slice(0, 5);
    }

    // Get recommendations based on search history
    getRecommendations() {
        const recentSearches = this.searchHistory.slice(0, 5);
        const recommendations = [];

        recentSearches.forEach(search => {
            if (search.results && search.results.length > 0) {
                search.results.forEach(result => {
                    if (result.tags) {
                        result.tags.forEach(tag => {
                            const similar = this.searchIndex.filter(
                                item => item.tags && item.tags.includes(tag) && item.term !== result.term
                            );
                            recommendations.push(...similar);
                        });
                    }
                });
            }
        });

        // Remove duplicates and return top 6
        const unique = [...new Map(recommendations.map(item => [item.term, item])).values()];
        return unique.slice(0, 6);
    }

    // Add to search history for learning patterns
    addToHistory(query, results) {
        this.searchHistory.unshift({
            query,
            results: results.slice(0, 3),
            timestamp: new Date().getTime()
        });

        // Keep only last 20 searches
        this.searchHistory = this.searchHistory.slice(0, 20);
        this.saveSearchHistory();
    }

    // Load search history from localStorage
    loadSearchHistory() {
        const saved = localStorage.getItem('aiSearchHistory');
        if (saved) {
            try {
                this.searchHistory = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to load search history:', e);
            }
        }
    }

    // Save search history to localStorage
    saveSearchHistory() {
        localStorage.setItem('aiSearchHistory', JSON.stringify(this.searchHistory));
    }

    // Get icon for result type
    getTypeIcon(type) {
        const icons = {
            'artist': 'fas fa-user-music',
            'song': 'fas fa-music',
            'genre': 'fas fa-guitar',
            'mood': 'fas fa-smile',
            'playlist': 'fas fa-list-ul'
        };
        return icons[type] || 'fas fa-music';
    }

    // Get display emoji for result type
    getTypeEmoji(type) {
        const emojis = {
            'artist': '🎤',
            'song': '🎵',
            'genre': '🎸',
            'mood': '😊',
            'playlist': '📋'
        };
        return emojis[type] || '♫';
    }

    // Correct typos using similar terms
    autoCorrect(query) {
        const results = this.search(query);
        if (results.length > 0 && results[0].relevanceScore > 60) {
            return results[0].term;
        }
        return query;
    }
}

// Create global instance
const aiSearchEngine = new AISearchEngine();
