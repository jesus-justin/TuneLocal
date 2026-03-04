/**
 * TuneLocal Session Manager
 * User session tracking and activity monitoring
 * Version 1.0.1 - Enhanced session tracking
 */

class SessionManager {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.lastActivity = Date.now();
        this.sessionData = {
            id: this.sessionId,
            startTime: this.startTime,
            endTime: null,
            duration: 0,
            tracksPlayed: 0,
            features: {
                visualizer: false,
                equalizer: false,
                sleepTimer: false
            },
            actions: [],
            errors: []
        };
    }

    /**
     * Generate unique session ID
     */
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Track activity
     */
    trackActivity(action, data = {}) {
        this.lastActivity = Date.now();
        
        this.sessionData.actions.push({
            timestamp: Date.now(),
            action,
            data
        });

        // Keep only last 1000 actions
        if (this.sessionData.actions.length > 1000) {
            this.sessionData.actions = this.sessionData.actions.slice(-1000);
        }
    }

    /**
     * Track error
     */
    trackError(error, context = {}) {
        this.sessionData.errors.push({
            timestamp: Date.now(),
            message: error.message || String(error),
            stack: error.stack || '',
            context
        });

        // Keep only last 100 errors
        if (this.sessionData.errors.length > 100) {
            this.sessionData.errors = this.sessionData.errors.slice(-100);
        }
    }

    /**
     * Track feature usage
     */
    trackFeature(feature, active) {
        if (this.sessionData.features.hasOwnProperty(feature)) {
            this.sessionData.features[feature] = active;
            this.trackActivity(`feature_${feature}`, { active });
        }
    }

    /**
     * Track track play
     */
    trackTrackPlay() {
        this.sessionData.tracksPlayed++;
        this.trackActivity('track_played');
    }

    /**
     * Get session duration
     */
    getDuration() {
        const end = this.sessionData.endTime || Date.now();
        return end - this.startTime;
    }

    /**
     * Get idle time
     */
    getIdleTime() {
        return Date.now() - this.lastActivity;
    }

    /**
     * Check if session is idle
     */
    isIdle(threshold = 300000) { // 5 minutes default
        return this.getIdleTime() > threshold;
    }

    /**
     * Get session summary
     */
    getSummary() {
        return {
            id: this.sessionId,
            duration: this.getDuration(),
            durationFormatted: this.formatDuration(this.getDuration()),
            tracksPlayed: this.sessionData.tracksPlayed,
            actionsPerformed: this.sessionData.actions.length,
            errorsOccurred: this.sessionData.errors.length,
            featuresUsed: Object.entries(this.sessionData.features)
                .filter(([_, used]) => used)
                .map(([feature]) => feature),
            startTime: new Date(this.startTime).toISOString(),
            lastActivity: new Date(this.lastActivity).toISOString()
        };
    }

    /**
     * Format duration
     */
    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    /**
     * End session
     */
    end() {
        this.sessionData.endTime = Date.now();
        this.sessionData.duration = this.getDuration();
        return this.sessionData;
    }

    /**
     * Export session data
     */
    export() {
        const data = {
            ...this.sessionData,
            duration: this.getDuration(),
            summary: this.getSummary()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tunelocal_session_${this.sessionId}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Get full session data
     */
    getFullData() {
        return {
            ...this.sessionData,
            duration: this.getDuration(),
            summary: this.getSummary()
        };
    }
}

// Global instance
const sessionManager = new SessionManager();

/**
 * Auto-end session on page unload
 */
window.addEventListener('beforeunload', () => {
    sessionManager.end();
    
    // Try to save session summary
    try {
        const saved = JSON.parse(localStorage.getItem('tunelocal_sessions') || '[]');
        saved.push(sessionManager.getSummary());
        
        // Keep only last 100 sessions
        if (saved.length > 100) {
            saved.pop();
        }
        
        localStorage.setItem('tunelocal_sessions', JSON.stringify(saved));
    } catch (e) {
        console.error('Failed to save session:', e);
    }
});

/**
 * Setup activity tracking
 */
document.addEventListener('DOMContentLoaded', () => {
    // Track clicks
    document.addEventListener('click', (e) => {
        if (e.target.className.includes('btn') || e.target.className.includes('nav-link')) {
            sessionManager.trackActivity('button_click', {
                element: e.target.textContent
            });
        }
    });

    // Track navigation
    document.addEventListener('section_change', (e) => {
        sessionManager.trackActivity('section_changed', {
            section: e.detail?.section
        });
    });
});
