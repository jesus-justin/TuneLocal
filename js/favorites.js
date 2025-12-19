/**
 * Favorites System for TuneLocal
 */

class FavoritesSystem {
    constructor() {
        this.favorites = [];
        this.init();
    }

    init() {
        this.loadFavorites();
        this.createFavoritesSection();
    }

    createFavoritesSection() {
        const mainContainer = document.querySelector('.main-container');
        if (!mainContainer) return;

        const section = document.createElement('section');
        section.id = 'favorites';
        section.className = 'section';
        section.innerHTML = `
            <div class="section-header">
                <h2><i class="fas fa-star"></i> Favorites</h2>
            </div>
            <div id="favoritesList" class="favorites-list"></div>
        `;
        mainContainer.appendChild(section);

        // Add to navbar
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            const link = document.createElement('a');
            link.href = '#favorites';
            link.className = 'nav-link';
            link.dataset.section = 'favorites';
            link.innerHTML = '<i class="fas fa-star"></i> Favorites';
            navLinks.appendChild(link);
        }
    }

    addFavorite(track) {
        const exists = this.favorites.some(f => f.title === track.title && f.artist === track.artist);
        if (!exists) {
            this.favorites.push({ ...track, favoritedAt: new Date().toISOString() });
            this.saveFavorites();
            if (typeof showNotification === 'function') {
                showNotification('Added to favorites', 'success');
            }
        }
    }

    removeFavorite(track) {
        this.favorites = this.favorites.filter(f => !(f.title === track.title && f.artist === track.artist));
        this.saveFavorites();
    }

    saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }

    loadFavorites() {
        try {
            const saved = localStorage.getItem('favorites');
            if (saved) this.favorites = JSON.parse(saved);
        } catch (e) {}
    }
}

const favoritesSystem = new FavoritesSystem();
window.favoritesSystem = favoritesSystem;
