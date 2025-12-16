/**
 * TuneLocal Recently Played Tracker
 * Track and display user's listening history
 */

class RecentlyPlayedTracker {
    constructor() {
        this.storageKey = 'tunelocal_recently_played';
        this.maxItems = 50;
        this.history = this.load();
    }

    /**
     * Add item to recently played
     */
    add(item) {
        const entry = {
            id: this.generateId(),
            timestamp: Date.now(),
            date: new Date().toISOString(),
            ...item
        };

        // Remove duplicates (same URL)
        this.history = this.history.filter(h => h.url !== item.url);

        // Add to beginning
        this.history.unshift(entry);

        // Limit size
        if (this.history.length > this.maxItems) {
            this.history = this.history.slice(0, this.maxItems);
        }

        this.save();
        return entry;
    }

    /**
     * Get all recently played items
     */
    getAll() {
        return this.history;
    }

    /**
     * Get recently played by type
     */
    getByType(type) {
        return this.history.filter(item => item.type === type);
    }

    /**
     * Get recent items (limit)
     */
    getRecent(limit = 10) {
        return this.history.slice(0, limit);
    }

    /**
     * Get today's plays
     */
    getToday() {
        const today = new Date().toDateString();
        return this.history.filter(item => {
            const itemDate = new Date(item.timestamp).toDateString();
            return itemDate === today;
        });
    }

    /**
     * Search history
     */
    search(query) {
        const lowerQuery = query.toLowerCase();
        return this.history.filter(item => {
            return (item.title || '').toLowerCase().includes(lowerQuery) ||
                   (item.artist || '').toLowerCase().includes(lowerQuery) ||
                   (item.url || '').toLowerCase().includes(lowerQuery);
        });
    }

    /**
     * Remove item from history
     */
    remove(id) {
        this.history = this.history.filter(item => item.id !== id);
        this.save();
    }

    /**
     * Clear all history
     */
    clear() {
        this.history = [];
        this.save();
    }

    /**
     * Get statistics
     */
    getStats() {
        const totalPlays = this.history.length;
        const todayPlays = this.getToday().length;
        
        // Count by type
        const byType = {};
        this.history.forEach(item => {
            byType[item.type] = (byType[item.type] || 0) + 1;
        });

        // Most played (by URL frequency)
        const urlCounts = {};
        this.history.forEach(item => {
            urlCounts[item.url] = (urlCounts[item.url] || 0) + 1;
        });
        const mostPlayed = Object.entries(urlCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([url, count]) => {
                const item = this.history.find(h => h.url === url);
                return { ...item, playCount: count };
            });

        return {
            totalPlays,
            todayPlays,
            byType,
            mostPlayed
        };
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Load from localStorage
     */
    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Failed to load recently played:', e);
            return [];
        }
    }

    /**
     * Save to localStorage
     */
    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.history));
        } catch (e) {
            console.error('Failed to save recently played:', e);
        }
    }

    /**
     * Export history as JSON
     */
    export() {
        const blob = new Blob([JSON.stringify(this.history, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tunelocal_history_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Import history from JSON
     */
    import(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            if (Array.isArray(imported)) {
                this.history = imported;
                this.save();
                return true;
            }
        } catch (e) {
            console.error('Failed to import history:', e);
        }
        return false;
    }
}

// Global instance
const recentlyPlayed = new RecentlyPlayedTracker();

/**
 * Track play event - call this whenever content is played
 */
function trackPlay(type, url, metadata = {}) {
    recentlyPlayed.add({
        type,
        url,
        title: metadata.title || 'Untitled',
        artist: metadata.artist || 'Unknown',
        thumbnail: metadata.thumbnail || null,
        source: metadata.source || type
    });
}

/**
 * Render recently played UI
 */
function renderRecentlyPlayed(containerId = 'recently-played-list', limit = 10) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const recent = recentlyPlayed.getRecent(limit);

    if (recent.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <p>No recently played tracks yet</p>
                <small>Your listening history will appear here</small>
            </div>
        `;
        return;
    }

    container.innerHTML = recent.map(item => {
        const timeAgo = formatTimeAgo(item.timestamp);
        const icon = item.type === 'spotify' ? 'fa-spotify' : 
                    item.type === 'youtube' ? 'fa-youtube' : 'fa-music';
        
        return `
            <div class="recently-played-item" data-id="${item.id}">
                <div class="item-icon">
                    <i class="fab ${icon}"></i>
                </div>
                <div class="item-info">
                    <div class="item-title">${escapeHtml(item.title)}</div>
                    <div class="item-meta">
                        ${escapeHtml(item.artist)} • ${timeAgo}
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn-icon" onclick="replayItem('${item.id}')" title="Play again">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="btn-icon" onclick="removeFromRecent('${item.id}')" title="Remove">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Replay item from history
 */
function replayItem(id) {
    const item = recentlyPlayed.getAll().find(h => h.id === id);
    if (!item) return;

    if (item.type === 'spotify') {
        document.getElementById('spotifyUrl').value = item.url;
        loadSpotify();
        showSection('spotify');
    } else if (item.type === 'youtube') {
        document.getElementById('youtubeUrl').value = item.url;
        loadYouTube();
        showSection('youtube');
    } else if (item.type === 'offline') {
        playOfflineTrack(item.id, item.title);
        showSection('offline-music');
    }

    showNotification(`Playing: ${item.title}`, 'success');
}

/**
 * Remove item from recent
 */
function removeFromRecent(id) {
    recentlyPlayed.remove(id);
    renderRecentlyPlayed();
    showNotification('Removed from history', 'info');
}

/**
 * Format timestamp to "time ago"
 */
function formatTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(timestamp).toLocaleDateString();
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
