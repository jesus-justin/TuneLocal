/**
 * Genre Explorer - Browse music by genre
 */

class GenreExplorer {
    constructor() {
        this.genres = [
            { name: 'Pop', icon: '🎤', color: '#FF6B9D' },
            { name: 'Rock', icon: '🎸', color: '#A569BD' },
            { name: 'Hip-Hop', icon: '🎙️', color: '#00D4FF' },
            { name: 'Electronic', icon: '🎛️', color: '#FFD700' },
            { name: 'Classical', icon: '🎻', color: '#87CEEB' },
            { name: 'Jazz', icon: '🎷', color: '#FF8C00' },
            { name: 'R&B', icon: '🎤', color: '#FF1493' },
            { name: 'Country', icon: '🤠', color: '#8B4513' }
        ];
        this.init();
    }

    init() {
        this.createGenreExplorer();
    }

    createGenreExplorer() {
        const mainContainer = document.querySelector('.main-container');
        if (!mainContainer) return;

        const section = document.createElement('section');
        section.id = 'genre-explorer';
        section.className = 'section';
        section.innerHTML = `
            <div class="section-header">
                <h2><i class="fas fa-compact-disc"></i> Genre Explorer</h2>
            </div>
            <div class="genre-grid">
                ${this.genres.map(genre => `
                    <div class="genre-card" style="background: linear-gradient(135deg, ${genre.color}, ${genre.color}99)">
                        <div class="genre-icon">${genre.icon}</div>
                        <h3>${genre.name}</h3>
                        <p>Explore ${genre.name} music</p>
                        <button class="btn-secondary" onclick="genreExplorer.browseGenre('${genre.name}')">Browse</button>
                    </div>
                `).join('')}
            </div>
        `;
        mainContainer.appendChild(section);

        // Add to navbar
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            const link = document.createElement('a');
            link.href = '#genre-explorer';
            link.className = 'nav-link';
            link.dataset.section = 'genre-explorer';
            link.innerHTML = '<i class="fas fa-compact-disc"></i> Genres';
            navLinks.appendChild(link);
        }
    }

    browseGenre(genreName) {
        if (typeof showNotification === 'function') {
            showNotification(`Browsing ${genreName}...`, 'success');
        }
    }
}

const genreExplorer = new GenreExplorer();
window.genreExplorer = genreExplorer;
