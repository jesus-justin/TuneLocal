/**
 * Settings Manager - Comprehensive settings panel
 */

class SettingsManager {
    constructor() {
        this.settings = {
            autoPlay: true,
            notifications: true,
            persistQueue: true,
            darkMode: true,
            language: 'en',
            volume: 100,
            repeatMode: 'off',
            qualityPreference: 'high'
        };
        this.init();
    }

    init() {
        this.loadSettings();
        this.createSettingsUI();
    }

    createSettingsUI() {
        const mainContainer = document.querySelector('.main-container');
        if (!mainContainer) return;

        const section = document.createElement('section');
        section.id = 'settings';
        section.className = 'section';
        section.innerHTML = `
            <div class="section-header">
                <h2><i class="fas fa-cog"></i> Settings</h2>
            </div>
            <div class="settings-grid">
                <div class="settings-category">
                    <h4>Playback</h4>
                    <label>
                        <input type="checkbox" id="autoPlaySetting" ${this.settings.autoPlay ? 'checked' : ''}>
                        Auto-play next track
                    </label>
                    <label>
                        Volume: <input type="range" id="volumeSetting" min="0" max="100" value="${this.settings.volume}">
                        <span id="volumeValue">${this.settings.volume}%</span>
                    </label>
                </div>
                <div class="settings-category">
                    <h4>Notifications</h4>
                    <label>
                        <input type="checkbox" id="notificationsSetting" ${this.settings.notifications ? 'checked' : ''}>
                        Enable notifications
                    </label>
                </div>
                <div class="settings-category">
                    <h4>Storage</h4>
                    <label>
                        <input type="checkbox" id="persistQueueSetting" ${this.settings.persistQueue ? 'checked' : ''}>
                        Save queue
                    </label>
                </div>
                <div class="settings-category">
                    <h4>Preferences</h4>
                    <label>Language:
                        <select id="languageSetting">
                            <option value="en" ${this.settings.language === 'en' ? 'selected' : ''}>English</option>
                            <option value="es" ${this.settings.language === 'es' ? 'selected' : ''}>Español</option>
                            <option value="fr" ${this.settings.language === 'fr' ? 'selected' : ''}>Français</option>
                        </select>
                    </label>
                </div>
            </div>
            <button class="btn-primary" onclick="settingsManager.saveAllSettings()">Save Settings</button>
        `;
        mainContainer.appendChild(section);

        // Add to navbar
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            const link = document.createElement('a');
            link.href = '#settings';
            link.className = 'nav-link';
            link.dataset.section = 'settings';
            link.innerHTML = '<i class="fas fa-cog"></i> Settings';
            navLinks.appendChild(link);
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('volumeSetting').addEventListener('input', (e) => {
            document.getElementById('volumeValue').textContent = e.target.value + '%';
        });
    }

    saveAllSettings() {
        this.settings.autoPlay = document.getElementById('autoPlaySetting').checked;
        this.settings.notifications = document.getElementById('notificationsSetting').checked;
        this.settings.persistQueue = document.getElementById('persistQueueSetting').checked;
        this.settings.volume = document.getElementById('volumeSetting').value;
        this.settings.language = document.getElementById('languageSetting').value;

        localStorage.setItem('appSettings', JSON.stringify(this.settings));
        if (typeof showNotification === 'function') {
            showNotification('Settings saved', 'success');
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('appSettings');
            if (saved) this.settings = { ...this.settings, ...JSON.parse(saved) };
        } catch (e) {}
    }

    getSetting(key) {
        return this.settings[key];
    }
}

const settingsManager = new SettingsManager();
window.settingsManager = settingsManager;
