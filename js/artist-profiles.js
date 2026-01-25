/**
 * Artist Profiles - Detailed artist profiles
 */

class ArtistProfiles {
    constructor() {
        this.artists = {};
        this.init();
    }

    init() {
        this.loadArtists();
    }

    loadArtists() {
        try {
            const history = JSON.parse(localStorage.getItem('musicHistory') || '[]');
            history.forEach(play => {
                if (!this.artists[play.artist]) {
                    this.artists[play.artist] = {
                        name: play.artist,
                        plays: 0,
                        tracks: new Set(),
                        firstPlayed: play.timestamp
                    };
                }
                this.artists[play.artist].plays++;
                this.artists[play.artist].tracks.add(play.title);
            });
        } catch (e) {}
    }

    getArtistProfile(artistName) {
        return this.artists[artistName] || null;
    }

    getTopArtists(limit = 10) {
        return Object.values(this.artists)
            .sort((a, b) => b.plays - a.plays)
            .slice(0, limit);
    }

    displayArtistProfile(artistName) {
        const profile = this.getArtistProfile(artistName);
        if (!profile) return;

        const modal = document.createElement('div');
        modal.className = 'artist-profile-modal';
        modal.innerHTML = `
            <div class="artist-profile-content">
                <h2>${profile.name}</h2>
                <div class="artist-stats">
                    <p>Total Plays: ${profile.plays}</p>
                    <p>Unique Tracks: ${profile.tracks.size}</p>
                    <p>First Played: ${new Date(profile.firstPlayed).toLocaleDateString()}</p>
                </div>
                <button class="btn-secondary" onclick="this.parentElement.parentElement.remove()">Close</button>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

const artistProfiles = new ArtistProfiles();
window.artistProfiles = artistProfiles;
