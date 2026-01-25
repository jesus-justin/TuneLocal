/**
 * Album Details - Album view with metadata
 */

class AlbumDetails {
    constructor() {
        this.albums = {};
        this.init();
    }

    init() {
        this.loadAlbums();
    }

    loadAlbums() {
        try {
            const library = JSON.parse(localStorage.getItem('offlineMusicLibrary') || '[]');
            library.forEach(track => {
                if (!this.albums[track.album]) {
                    this.albums[track.album] = {
                        name: track.album,
                        artist: track.artist,
                        year: track.year,
                        tracks: [],
                        coverArt: track.coverArt
                    };
                }
                this.albums[track.album].tracks.push(track);
            });
        } catch (e) {}
    }

    getAlbum(albumName) {
        return this.albums[albumName] || null;
    }

    displayAlbum(albumName) {
        const album = this.getAlbum(albumName);
        if (!album) return;

        const modal = document.createElement('div');
        modal.className = 'album-details-modal';
        modal.innerHTML = `
            <div class="album-content">
                <img src="${album.coverArt || 'data:image/svg+xml,%3Csvg%3E%3C/svg%3E'}" class="album-art">
                <h2>${album.name}</h2>
                <p class="artist">${album.artist}</p>
                <p class="year">${album.year || 'N/A'}</p>
                <div class="tracklist">
                    ${album.tracks.map((track, i) => `
                        <div class="track-item">
                            <span>${i + 1}</span>
                            <span>${track.title}</span>
                            <span>${this.formatDuration(track.duration)}</span>
                        </div>
                    `).join('')}
                </div>
                <button class="btn-secondary" onclick="this.parentElement.parentElement.remove()">Close</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

const albumDetails = new AlbumDetails();
window.albumDetails = albumDetails;
