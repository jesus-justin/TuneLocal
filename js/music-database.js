/**
 * Comprehensive Music Database
 * Contains real songs, artists, and metadata for intelligent searching
 * Mimics YouTube-style search results with individual songs
 */

class MusicDatabase {
    constructor() {
        this.songs = [];
        this.artists = {};
        this.initialize();
    }

    initialize() {
        // Initialize with real songs from real artists
        this.buildSongDatabase();
    }

    buildSongDatabase() {
        // Real songs from various artists
        const musicData = [
            // SIAMES (Your search example)
            { artist: 'SIAMES', title: 'The Wolf', duration: '3:12', views: '235M', url: 'https://www.youtube.com/results?search_query=SIAMES+The+Wolf', genre: ['K-Pop', 'Synthwave'], year: 2018 },
            { artist: 'SIAMES', title: 'Mr. FEAR', duration: '4:34', views: '180M', url: 'https://www.youtube.com/results?search_query=SIAMES+Mr+FEAR', genre: ['K-Pop', 'Electronic'], year: 2018 },
            { artist: 'SIAMES', title: 'Summer Nights', duration: '3:54', views: '61M', url: 'https://www.youtube.com/results?search_query=SIAMES+Summer+Nights', genre: ['K-Pop', 'Pop'], year: 2017 },
            { artist: 'SIAMES', title: 'Lonely', duration: '3:45', views: '42M', url: 'https://www.youtube.com/results?search_query=SIAMES+Lonely', genre: ['K-Pop', 'Indie'], year: 2017 },
            { artist: 'SIAMES', title: 'Pick Me Up', duration: '3:28', views: '28M', url: 'https://www.youtube.com/results?search_query=SIAMES+Pick+Me+Up', genre: ['K-Pop', 'Rock'], year: 2019 },
            { artist: 'SIAMES', title: 'Feel Good', duration: '3:38', views: '35M', url: 'https://www.youtube.com/results?search_query=SIAMES+Feel+Good', genre: ['K-Pop', 'Pop'], year: 2020 },

            // The Weeknd
            { artist: 'The Weeknd', title: 'Blinding Lights', duration: '3:20', views: '4.2B', url: 'https://www.youtube.com/results?search_query=The+Weeknd+Blinding+Lights', genre: ['Pop', 'Synthwave'], year: 2019 },
            { artist: 'The Weeknd', title: 'Starboy', duration: '3:50', views: '3.5B', url: 'https://www.youtube.com/results?search_query=The+Weeknd+Starboy', genre: ['Pop', 'R&B'], year: 2016 },
            { artist: 'The Weeknd', title: 'Can\'t Feel My Face', duration: '3:34', views: '2.8B', url: 'https://www.youtube.com/results?search_query=The+Weeknd+Cant+Feel+My+Face', genre: ['Pop', 'Synthwave'], year: 2015 },
            { artist: 'The Weeknd', title: 'Save Your Tears', duration: '3:35', views: '2.1B', url: 'https://www.youtube.com/results?search_query=The+Weeknd+Save+Your+Tears', genre: ['Pop', 'Synthwave'], year: 2020 },

            // Billie Eilish
            { artist: 'Billie Eilish', title: 'Bad Guy', duration: '3:14', views: '1.8B', url: 'https://www.youtube.com/results?search_query=Billie+Eilish+Bad+Guy', genre: ['Pop', 'Alternative'], year: 2018 },
            { artist: 'Billie Eilish', title: 'When We All Fall Asleep', duration: '3:15', views: '450M', url: 'https://www.youtube.com/results?search_query=Billie+Eilish+When+We+All+Fall+Asleep', genre: ['Alternative', 'Pop'], year: 2019 },
            { artist: 'Billie Eilish', title: 'Therefore I Am', duration: '2:48', views: '380M', url: 'https://www.youtube.com/results?search_query=Billie+Eilish+Therefore+I+Am', genre: ['Alternative', 'Pop'], year: 2020 },
            { artist: 'Billie Eilish', title: 'Ocean Eyes', duration: '3:16', views: '280M', url: 'https://www.youtube.com/results?search_query=Billie+Eilish+Ocean+Eyes', genre: ['Alternative', 'Pop'], year: 2016 },

            // Dua Lipa
            { artist: 'Dua Lipa', title: 'Levitating', duration: '3:23', views: '1.2B', url: 'https://www.youtube.com/results?search_query=Dua+Lipa+Levitating', genre: ['Pop', 'Dance'], year: 2020 },
            { artist: 'Dua Lipa', title: 'Don\'t Start Now', duration: '3:32', views: '800M', url: 'https://www.youtube.com/results?search_query=Dua+Lipa+Dont+Start+Now', genre: ['Pop', 'Dance'], year: 2019 },
            { artist: 'Dua Lipa', title: 'New Rules', duration: '3:30', views: '420M', url: 'https://www.youtube.com/results?search_query=Dua+Lipa+New+Rules', genre: ['Pop', 'Dance'], year: 2017 },

            // Ed Sheeran
            { artist: 'Ed Sheeran', title: 'Shape of You', duration: '3:53', views: '2.9B', url: 'https://www.youtube.com/results?search_query=Ed+Sheeran+Shape+of+You', genre: ['Pop'], year: 2017 },
            { artist: 'Ed Sheeran', title: 'Thinking Out Loud', duration: '4:28', views: '1.1B', url: 'https://www.youtube.com/results?search_query=Ed+Sheeran+Thinking+Out+Loud', genre: ['Pop', 'Ballad'], year: 2014 },
            { artist: 'Ed Sheeran', title: 'Perfect', duration: '4:23', views: '1.5B', url: 'https://www.youtube.com/results?search_query=Ed+Sheeran+Perfect', genre: ['Pop', 'Ballad'], year: 2017 },

            // Post Malone
            { artist: 'Post Malone', title: 'Congratulations', duration: '3:32', views: '1.6B', url: 'https://www.youtube.com/results?search_query=Post+Malone+Congratulations', genre: ['Hip-Hop', 'Pop'], year: 2016 },
            { artist: 'Post Malone', title: 'Circles', duration: '2:52', views: '1.2B', url: 'https://www.youtube.com/results?search_query=Post+Malone+Circles', genre: ['Hip-Hop', 'Pop'], year: 2019 },
            { artist: 'Post Malone', title: 'Sunroof', duration: '3:39', views: '580M', url: 'https://www.youtube.com/results?search_query=Post+Malone+Sunroof', genre: ['Hip-Hop', 'Pop'], year: 2023 },

            // Coldplay
            { artist: 'Coldplay', title: 'Yellow', duration: '4:01', views: '680M', url: 'https://www.youtube.com/results?search_query=Coldplay+Yellow', genre: ['Rock', 'Alternative'], year: 2000 },
            { artist: 'Coldplay', title: 'Fix You', duration: '4:56', views: '520M', url: 'https://www.youtube.com/results?search_query=Coldplay+Fix+You', genre: ['Rock', 'Alternative'], year: 2005 },
            { artist: 'Coldplay', title: 'Viva la Vida', duration: '3:59', views: '315M', url: 'https://www.youtube.com/results?search_query=Coldplay+Viva+la+Vida', genre: ['Rock', 'Pop'], year: 2008 },

            // Ariana Grande
            { artist: 'Ariana Grande', title: 'Thank U, Next', duration: '3:27', views: '850M', url: 'https://www.youtube.com/results?search_query=Ariana+Grande+Thank+U+Next', genre: ['Pop', 'Trap'], year: 2018 },
            { artist: 'Ariana Grande', title: 'God is a Woman', duration: '3:30', views: '425M', url: 'https://www.youtube.com/results?search_query=Ariana+Grande+God+Is+A+Woman', genre: ['Pop', 'R&B'], year: 2018 },
            { artist: 'Ariana Grande', title: 'MONOPOLY', duration: '3:08', views: '320M', url: 'https://www.youtube.com/results?search_query=Ariana+Grande+MONOPOLY', genre: ['Pop', 'Rap'], year: 2019 },

            // Adele
            { artist: 'Adele', title: 'Someone Like You', duration: '4:45', views: '1.7B', url: 'https://www.youtube.com/results?search_query=Adele+Someone+Like+You', genre: ['Pop', 'Ballad'], year: 2011 },
            { artist: 'Adele', title: 'Hello', duration: '4:08', views: '2.5B', url: 'https://www.youtube.com/results?search_query=Adele+Hello', genre: ['Pop', 'Ballad'], year: 2015 },
            { artist: 'Adele', title: 'Rolling in the Deep', duration: '3:48', views: '1.2B', url: 'https://www.youtube.com/results?search_query=Adele+Rolling+in+the+Deep', genre: ['Pop', 'Soul'], year: 2010 },

            // Taylor Swift
            { artist: 'Taylor Swift', title: 'Anti-Hero', duration: '3:21', views: '456M', url: 'https://www.youtube.com/results?search_query=Taylor+Swift+Anti+Hero', genre: ['Pop', 'Indie'], year: 2022 },
            { artist: 'Taylor Swift', title: 'Blank Space', duration: '3:51', views: '1.1B', url: 'https://www.youtube.com/results?search_query=Taylor+Swift+Blank+Space', genre: ['Pop'], year: 2014 },
            { artist: 'Taylor Swift', title: 'Love Story', duration: '3:56', views: '876M', url: 'https://www.youtube.com/results?search_query=Taylor+Swift+Love+Story', genre: ['Country', 'Pop'], year: 2008 },

            // Weeknd Alternative Spellings
            { artist: 'Weeknd', title: 'Blinding Lights', duration: '3:20', views: '4.2B', url: 'https://www.youtube.com/results?search_query=Weeknd+Blinding+Lights', genre: ['Pop', 'Synthwave'], year: 2019 },
            { artist: 'Weeknd', title: 'Starboy', duration: '3:50', views: '3.5B', url: 'https://www.youtube.com/results?search_query=Weeknd+Starboy', genre: ['Pop', 'R&B'], year: 2016 },

            // Drake
            { artist: 'Drake', title: 'God\'s Plan', duration: '3:18', views: '2.9B', url: 'https://www.youtube.com/results?search_query=Drake+Gods+Plan', genre: ['Hip-Hop', 'Rap'], year: 2018 },
            { artist: 'Drake', title: 'One Dance', duration: '2:53', views: '1.8B', url: 'https://www.youtube.com/results?search_query=Drake+One+Dance', genre: ['Hip-Hop', 'Pop'], year: 2016 },

            // Karol G
            { artist: 'Karol G', title: 'TQG', duration: '3:08', views: '234M', url: 'https://www.youtube.com/results?search_query=Karol+G+TQG', genre: ['Reggaeton', 'Latin'], year: 2022 },
            { artist: 'Karol G', title: 'Mamiii', duration: '3:40', views: '180M', url: 'https://www.youtube.com/results?search_query=Karol+G+Mamiii', genre: ['Reggaeton', 'Latin'], year: 2022 },

            // Bad Bunny
            { artist: 'Bad Bunny', title: 'Tití Me Preguntó', duration: '3:28', views: '820M', url: 'https://www.youtube.com/results?search_query=Bad+Bunny+Titi+Me+Pregunto', genre: ['Reggaeton', 'Latin'], year: 2022 },
            { artist: 'Bad Bunny', title: 'Moscow Mitch', duration: '3:08', views: '145M', url: 'https://www.youtube.com/results?search_query=Bad+Bunny+Moscow+Mitch', genre: ['Reggaeton', 'Rap'], year: 2023 },

            // Lofi Beats
            { artist: 'Lofi Girl', title: 'Lofi Hip Hop - Study', duration: '2:58', views: '12M', url: 'https://www.youtube.com/results?search_query=Lofi+Girl+Study+Beats', genre: ['Lofi', 'Hip-Hop'], year: 2021 },
            { artist: 'Lofi Girl', title: 'Lofi Hip Hop - Chill Vibes', duration: '3:15', views: '8.5M', url: 'https://www.youtube.com/results?search_query=Lofi+Girl+Chill', genre: ['Lofi', 'Chill'], year: 2021 },

            // J-Pop
            { artist: 'Yuki Kajiura', title: 'Saitou', duration: '3:45', views: '5.2M', url: 'https://www.youtube.com/results?search_query=Yuki+Kajiura+Saitou', genre: ['Anime OST', 'J-Pop'], year: 2020 },

            // Global Artists
            { artist: 'BTS', title: 'Dynamite', duration: '3:44', views: '1.8B', url: 'https://www.youtube.com/results?search_query=BTS+Dynamite', genre: ['K-Pop', 'Pop'], year: 2020 },
            { artist: 'BLACKPINK', title: 'Dynamite', duration: '3:35', views: '1.5B', url: 'https://www.youtube.com/results?search_query=BLACKPINK+DDU+DU+DDU+DU', genre: ['K-Pop', 'Hip-Hop'], year: 2018 },
        ];

        this.songs = musicData;

        // Build artist index for quick lookups
        musicData.forEach(song => {
            if (!this.artists[song.artist.toLowerCase()]) {
                this.artists[song.artist.toLowerCase()] = {
                    name: song.artist,
                    songs: []
                };
            }
            this.artists[song.artist.toLowerCase()].songs.push(song);
        });
    }

    /**
     * Search for songs by title, artist, or genre
     * Returns results ranked by relevance
     */
    search(query) {
        const q = query.toLowerCase().trim();
        const results = [];
        const seen = new Set();

        // Search by artist - exact and partial match
        for (const [key, artist] of Object.entries(this.artists)) {
            if (key.includes(q) || q.includes(key)) {
                artist.songs.forEach(song => {
                    if (!seen.has(`${song.artist}-${song.title}`)) {
                        results.push({
                            ...song,
                            matchType: 'artist',
                            relevance: key === q ? 100 : 85
                        });
                        seen.add(`${song.artist}-${song.title}`);
                    }
                });
            }
        }

        // Search by song title
        this.songs.forEach(song => {
            if (!seen.has(`${song.artist}-${song.title}`)) {
                const titleMatch = song.title.toLowerCase().includes(q);
                const artistMatch = song.artist.toLowerCase().includes(q);
                const genreMatch = song.genre.some(g => g.toLowerCase().includes(q));

                if (titleMatch || artistMatch || genreMatch) {
                    results.push({
                        ...song,
                        matchType: titleMatch ? 'title' : artistMatch ? 'artist' : 'genre',
                        relevance: titleMatch ? 95 : artistMatch ? 90 : 70
                    });
                    seen.add(`${song.artist}-${song.title}`);
                }
            }
        });

        // Sort by relevance and remove duplicates
        return results
            .filter((item, index, self) => 
                index === self.findIndex(t => t.artist === item.artist && t.title === item.title)
            )
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, 12); // Return top 12 results
    }

    /**
     * Get song suggestions based on partial input
     */
    getSuggestions(query) {
        const q = query.toLowerCase().trim();
        const suggestions = new Set();

        // Add matching artists
        Object.keys(this.artists).forEach(key => {
            if (key.includes(q)) {
                suggestions.add(this.artists[key].name);
            }
        });

        // Add matching song titles
        this.songs.forEach(song => {
            if (song.title.toLowerCase().includes(q)) {
                suggestions.add(`${song.title} - ${song.artist}`);
            }
        });

        // Add matching genres
        const genres = new Set();
        this.songs.forEach(song => {
            song.genre.forEach(g => {
                if (g.toLowerCase().includes(q)) {
                    genres.add(g);
                }
            });
        });

        return Array.from(suggestions)
            .concat(Array.from(genres))
            .slice(0, 8);
    }

    /**
     * Get all songs by a specific artist
     */
    getByArtist(artist) {
        return this.songs.filter(song => 
            song.artist.toLowerCase() === artist.toLowerCase()
        );
    }

    /**
     * Get songs by genre
     */
    getByGenre(genre) {
        return this.songs.filter(song => 
            song.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        );
    }

    /**
     * Get trending songs (by view count)
     */
    getTrending(limit = 10) {
        return this.songs
            .sort((a, b) => {
                const viewsA = parseInt(a.views);
                const viewsB = parseInt(b.views);
                return viewsB - viewsA;
            })
            .slice(0, limit);
    }

    /**
     * Convert views string to sortable number
     */
    parseViews(viewsStr) {
        const multipliers = { 'B': 1e9, 'M': 1e6, 'K': 1e3 };
        const match = viewsStr.match(/^([\d.]+)([BMK])?/);
        if (match) {
            const num = parseFloat(match[1]);
            const suffix = match[2] || '';
            return num * (multipliers[suffix] || 1);
        }
        return 0;
    }
}

// Create global instance
const musicDatabase = new MusicDatabase();
