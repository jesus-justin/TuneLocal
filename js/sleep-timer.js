/**
 * TuneLocal Sleep Timer
 * Auto-pause music after specified duration
 * Version 1.0.1 - Enhanced sleep timer features
 */

class SleepTimer {
    constructor() {
        this.timerId = null;
        this.endTime = null;
        this.duration = 0;
        this.isActive = false;
        this.callbacks = {
            onStart: null,
            onTick: null,
            onEnd: null,
            onCancel: null
        };
    }

    /**
     * Start sleep timer
     * @param {number} minutes - Duration in minutes
     * @param {object} callbacks - Callback functions
     */
    start(minutes, callbacks = {}) {
        if (this.isActive) {
            this.cancel();
        }

        this.duration = minutes * 60 * 1000; // Convert to milliseconds
        this.endTime = Date.now() + this.duration;
        this.isActive = true;
        this.callbacks = { ...this.callbacks, ...callbacks };

        // Start countdown
        this.tick();

        // Call onStart callback
        if (this.callbacks.onStart) {
            this.callbacks.onStart(minutes);
        }

        // Save to preferences
        this.saveState();
    }

    /**
     * Tick function - updates every second
     */
    tick() {
        if (!this.isActive) return;

        const remaining = this.endTime - Date.now();

        if (remaining <= 0) {
            // Timer finished
            this.finish();
        } else {
            // Update UI
            if (this.callbacks.onTick) {
                const minutes = Math.floor(remaining / 60000);
                const seconds = Math.floor((remaining % 60000) / 1000);
                this.callbacks.onTick(minutes, seconds, remaining);
            }

            // Schedule next tick
            this.timerId = setTimeout(() => this.tick(), 1000);
        }
    }

    /**
     * Finish timer
     */
    finish() {
        this.isActive = false;
        
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }

        // Call onEnd callback
        if (this.callbacks.onEnd) {
            this.callbacks.onEnd();
        }

        // Pause all media
        this.pauseAllMedia();

        // Clear saved state
        this.clearState();

        // Show notification
        showNotification('Sleep timer ended - Music paused', 'info');
    }

    /**
     * Cancel timer
     */
    cancel() {
        if (!this.isActive) return;

        this.isActive = false;

        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }

        // Call onCancel callback
        if (this.callbacks.onCancel) {
            this.callbacks.onCancel();
        }

        // Clear saved state
        this.clearState();
    }

    /**
     * Get remaining time
     */
    getRemaining() {
        if (!this.isActive) return 0;
        return Math.max(0, this.endTime - Date.now());
    }

    /**
     * Get remaining time formatted
     */
    getRemainingFormatted() {
        const remaining = this.getRemaining();
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Check if timer is active
     */
    isRunning() {
        return this.isActive;
    }

    /**
     * Pause all media elements
     */
    pauseAllMedia() {
        // Pause HTML5 audio/video
        document.querySelectorAll('audio, video').forEach(media => {
            if (!media.paused) {
                media.pause();
            }
        });

        // Try to pause Spotify iframe (if possible)
        const spotifyIframe = document.querySelector('#spotifyPlayer iframe');
        if (spotifyIframe) {
            try {
                spotifyIframe.contentWindow.postMessage({
                    command: 'pause'
                }, '*');
            } catch (e) {
                console.log('Could not control Spotify iframe');
            }
        }

        // Try to pause YouTube iframe
        const youtubeIframe = document.querySelector('#youtubePlayer iframe');
        if (youtubeIframe) {
            try {
                youtubeIframe.contentWindow.postMessage(JSON.stringify({
                    event: 'command',
                    func: 'pauseVideo'
                }), '*');
            } catch (e) {
                console.log('Could not control YouTube iframe');
            }
        }
    }

    /**
     * Save timer state to localStorage
     */
    saveState() {
        try {
            localStorage.setItem('tunelocal_sleep_timer', JSON.stringify({
                endTime: this.endTime,
                isActive: this.isActive
            }));
        } catch (e) {
            console.error('Failed to save sleep timer state:', e);
        }
    }

    /**
     * Clear timer state from localStorage
     */
    clearState() {
        try {
            localStorage.removeItem('tunelocal_sleep_timer');
        } catch (e) {
            console.error('Failed to clear sleep timer state:', e);
        }
    }

    /**
     * Restore timer from localStorage
     */
    restore() {
        try {
            const saved = localStorage.getItem('tunelocal_sleep_timer');
            if (saved) {
                const state = JSON.parse(saved);
                if (state.isActive && state.endTime > Date.now()) {
                    this.endTime = state.endTime;
                    this.isActive = true;
                    this.tick();
                    return true;
                } else {
                    this.clearState();
                }
            }
        } catch (e) {
            console.error('Failed to restore sleep timer:', e);
        }
        return false;
    }
}

// Global instance
const sleepTimer = new SleepTimer();

// Auto-restore on page load
document.addEventListener('DOMContentLoaded', () => {
    sleepTimer.restore();
});
