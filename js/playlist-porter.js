/**
 * Playlist Import/Export for TuneLocal
 */

class PlaylistPorter {
    exportToJSON(playlist) {
        const data = JSON.stringify(playlist, null, 2);
        this.downloadFile(data, `${playlist.name}.json`, 'application/json');
    }

    exportToM3U(playlist) {
        let m3u = '#EXTM3U\n';
        playlist.tracks.forEach(track => {
            m3u += `#EXTINF:${track.duration || -1},${track.artist} - ${track.title}\n`;
            m3u += `${track.url || track.filename}\n`;
        });
        this.downloadFile(m3u, `${playlist.name}.m3u`, 'audio/x-mpegurl');
    }

    importFromJSON(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const playlist = JSON.parse(e.target.result);
                this.saveImportedPlaylist(playlist);
            } catch (err) {
                if (typeof showNotification === 'function') {
                    showNotification('Invalid JSON file', 'error');
                }
            }
        };
        reader.readAsText(file);
    }

    saveImportedPlaylist(playlist) {
        const playlists = JSON.parse(localStorage.getItem('playlists') || '[]');
        playlist.id = Date.now();
        playlists.push(playlist);
        localStorage.setItem('playlists', JSON.stringify(playlists));
        if (typeof showNotification === 'function') {
            showNotification('Playlist imported successfully', 'success');
        }
        if (typeof loadSavedPlaylists === 'function') {
            loadSavedPlaylists();
        }
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
}

const playlistPorter = new PlaylistPorter();
window.playlistPorter = playlistPorter;
