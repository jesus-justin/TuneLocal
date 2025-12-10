/**
 * TuneLocal - User Preferences Manager
 * Manages user preferences and settings
 */

class PreferencesManager {
    constructor() {
        this.storageKey = 'tunelocal_preferences';
        this.defaults = {
            theme: 'dark',
            volume: 0.8,
            autoplay: true,
            qualityPreference: 'high',
            language: 'en',
            notifications: true,
            analytics: false
        };
        this.loadPreferences();
    }

    /**
     * Load preferences from localStorage
     */
    loadPreferences() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            this.preferences = stored ? JSON.parse(stored) : this.defaults;
        } catch (e) {
            console.warn('Could not load preferences:', e);
            this.preferences = this.defaults;
        }
    }

    /**
     * Save preferences to localStorage
     */
    savePreferences() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
        } catch (e) {
            console.warn('Could not save preferences:', e);
        }
    }

    /**
     * Get preference value
     */
    get(key, defaultValue = null) {
        return this.preferences[key] ?? defaultValue;
    }

    /**
     * Set preference value
     */
    set(key, value) {
        this.preferences[key] = value;
        this.savePreferences();
    }

    /**
     * Update multiple preferences
     */
    update(updates) {
        Object.assign(this.preferences, updates);
        this.savePreferences();
    }

    /**
     * Reset to defaults
     */
    reset() {
        this.preferences = deepClone(this.defaults);
        this.savePreferences();
    }

    /**
     * Export preferences
     */
    export() {
        return JSON.stringify(this.preferences, null, 2);
    }

    /**
     * Import preferences
     */
    import(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            this.preferences = { ...this.defaults, ...imported };
            this.savePreferences();
            return true;
        } catch (e) {
            console.error('Could not import preferences:', e);
            return false;
        }
    }
}

// Initialize global preferences manager
const preferencesManager = new PreferencesManager();
