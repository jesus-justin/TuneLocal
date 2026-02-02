// Track Rating System
class TrackRatingSystem {
    constructor() {
        this.ratings = this.loadRatings();
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createRatingWidget();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .rating-widget { position: fixed; bottom: 260px; right: 20px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.5rem; z-index: 990; backdrop-filter: blur(10px); }
            .rating-title { color: var(--text-primary); font-size: 14px; margin-bottom: 1rem; font-weight: bold; }
            .rating-stars { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
            .rating-star { font-size: 32px; cursor: pointer; transition: all 0.2s; filter: grayscale(100%); opacity: 0.4; }
            .rating-star.active { filter: grayscale(0%); opacity: 1; transform: scale(1.1); }
            .rating-star:hover { transform: scale(1.2); filter: grayscale(0%); }
            .rating-info { color: var(--text-secondary); font-size: 12px; text-align: center; }
            .rating-count { color: var(--primary-color); font-weight: bold; }
            .rating-track { color: var(--text-primary); font-size: 13px; margin-bottom: 1rem; padding: 0.75rem; background: rgba(0, 0, 0, 0.2); border-radius: 8px; }
            .rating-average { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
            .rating-avg-num { color: var(--primary-color); font-size: 24px; font-weight: bold; }
            .rating-avg-stars { color: #fbbf24; font-size: 16px; }
        `;
        document.head.appendChild(style);
    }
    
    createRatingWidget() {
        const widget = document.createElement('div');
        widget.className = 'rating-widget';
        widget.innerHTML = `
            <div class="rating-title">⭐ Rate This Track</div>
            <div class="rating-track">Summer Vibes - DJ Cool</div>
            <div class="rating-average">
                <span class="rating-avg-num">4.5</span>
                <span class="rating-avg-stars">⭐⭐⭐⭐⭐</span>
            </div>
            <div class="rating-stars" id="ratingStars">
                <span class="rating-star" data-rating="1">⭐</span>
                <span class="rating-star" data-rating="2">⭐</span>
                <span class="rating-star" data-rating="3">⭐</span>
                <span class="rating-star" data-rating="4">⭐</span>
                <span class="rating-star" data-rating="5">⭐</span>
            </div>
            <div class="rating-info">
                Your rating: <span class="rating-count" id="userRating">Not rated</span>
            </div>
        `;
        document.body.appendChild(widget);
        
        this.attachStarEvents();
        this.loadUserRating();
    }
    
    attachStarEvents() {
        const stars = document.querySelectorAll('.rating-star');
        
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.dataset.rating);
                this.setRating(rating);
            });
            
            star.addEventListener('mouseenter', () => {
                const rating = parseInt(star.dataset.rating);
                this.highlightStars(rating);
            });
        });
        
        document.getElementById('ratingStars').addEventListener('mouseleave', () => {
            const currentRating = this.getCurrentRating();
            this.highlightStars(currentRating);
        });
    }
    
    highlightStars(rating) {
        const stars = document.querySelectorAll('.rating-star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
    
    setRating(rating) {
        this.ratings['current-track'] = rating;
        this.saveRatings();
        this.highlightStars(rating);
        document.getElementById('userRating').textContent = `${rating} star${rating > 1 ? 's' : ''}`;
    }
    
    getCurrentRating() {
        return this.ratings['current-track'] || 0;
    }
    
    loadUserRating() {
        const rating = this.getCurrentRating();
        if (rating > 0) {
            this.highlightStars(rating);
            document.getElementById('userRating').textContent = `${rating} star${rating > 1 ? 's' : ''}`;
        }
    }
    
    loadRatings() {
        const stored = localStorage.getItem('tuneLocalRatings');
        return stored ? JSON.parse(stored) : {};
    }
    
    saveRatings() {
        localStorage.setItem('tuneLocalRatings', JSON.stringify(this.ratings));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TrackRatingSystem();
});
