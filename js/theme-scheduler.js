/**
 * Theme Scheduler for TuneLocal
 * Automatically switches between light and dark themes based on time
 */

class ThemeScheduler {
    constructor() {
        this.settings = {
            enabled: false,
            darkStart: '20:00',
            lightStart: '07:00',
            autoDetect: false
        };
        this.checkInterval = null;
        this.init();
    }

    init() {
        this.loadSettings();
        this.createSettingsUI();
        this.startScheduler();
    }

    createSettingsUI() {
        // Add to theme toggle button
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;

        // Add context menu on right-click
        themeToggle.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showSettingsModal();
        });

        // Add small settings icon
        const settingsIcon = document.createElement('div');
        settingsIcon.className = 'theme-scheduler-indicator';
        settingsIcon.innerHTML = '<i class="fas fa-clock"></i>';
        settingsIcon.title = 'Right-click theme button for auto-scheduler';
        settingsIcon.style.cssText = 'position:absolute;bottom:-5px;right:-5px;font-size:8px;opacity:0.5;';
        themeToggle.style.position = 'relative';
        themeToggle.appendChild(settingsIcon);

        this.createSettingsModal();
    }

    createSettingsModal() {
        const modal = document.createElement('div');
        modal.id = 'themeSchedulerModal';
        modal.className = 'theme-scheduler-modal';
        modal.innerHTML = `
            <div class="theme-scheduler-content">
                <div class="theme-scheduler-header">
                    <h3><i class="fas fa-clock"></i> Auto Theme Scheduler</h3>
                    <button id="closeThemeScheduler"><i class="fas fa-times"></i></button>
                </div>
                <div class="theme-scheduler-body">
                    <div class="scheduler-option">
                        <div class="scheduler-option-header">
                            <label class="scheduler-toggle">
                                <input type="checkbox" id="schedulerEnabled">
                                <span class="scheduler-slider"></span>
                            </label>
                            <span>Enable Auto-Switching</span>
                        </div>
                        <p class="scheduler-desc">Automatically switch between light and dark themes</p>
                    </div>

                    <div class="scheduler-divider"></div>

                    <div class="scheduler-option">
                        <div class="scheduler-option-header">
                            <label class="scheduler-toggle">
                                <input type="checkbox" id="schedulerAutoDetect">
                                <span class="scheduler-slider"></span>
                            </label>
                            <span>Auto-Detect Time</span>
                        </div>
                        <p class="scheduler-desc">Use sunrise/sunset times based on your location</p>
                    </div>

                    <div class="scheduler-divider"></div>

                    <div class="scheduler-time-settings" id="manualTimeSettings">
                        <h4>Manual Schedule</h4>
                        
                        <div class="time-input-group">
                            <label>
                                <i class="fas fa-moon"></i>
                                <span>Dark Mode Starts</span>
                                <input type="time" id="darkStartTime" value="20:00">
                            </label>
                        </div>

                        <div class="time-input-group">
                            <label>
                                <i class="fas fa-sun"></i>
                                <span>Light Mode Starts</span>
                                <input type="time" id="lightStartTime" value="07:00">
                            </label>
                        </div>
                    </div>

                    <div class="scheduler-preview">
                        <h4>Current Status</h4>
                        <div id="schedulerStatus" class="scheduler-status">
                            <i class="fas fa-info-circle"></i>
                            <span>Scheduler is disabled</span>
                        </div>
                    </div>
                </div>
                <div class="theme-scheduler-footer">
                    <button class="btn-secondary" id="resetScheduler">Reset to Default</button>
                    <button class="btn-primary" id="saveScheduler">Save Settings</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('closeThemeScheduler').onclick = () => this.hideSettingsModal();
        document.getElementById('schedulerEnabled').onchange = (e) => this.updateUIState(e.target.checked);
        document.getElementById('schedulerAutoDetect').onchange = (e) => this.toggleAutoDetect(e.target.checked);
        document.getElementById('saveScheduler').onclick = () => this.saveSettings();
        document.getElementById('resetScheduler').onclick = () => this.resetSettings();

        modal.onclick = (e) => {
            if (e.target.id === 'themeSchedulerModal') this.hideSettingsModal();
        };
    }

    showSettingsModal() {
        const modal = document.getElementById('themeSchedulerModal');
        modal.style.display = 'flex';
        this.populateSettings();
        this.updateUIState(this.settings.enabled);
    }

    hideSettingsModal() {
        const modal = document.getElementById('themeSchedulerModal');
        modal.style.display = 'none';
    }

    populateSettings() {
        document.getElementById('schedulerEnabled').checked = this.settings.enabled;
        document.getElementById('schedulerAutoDetect').checked = this.settings.autoDetect;
        document.getElementById('darkStartTime').value = this.settings.darkStart;
        document.getElementById('lightStartTime').value = this.settings.lightStart;
        this.updateStatus();
    }

    updateUIState(enabled) {
        const manualSettings = document.getElementById('manualTimeSettings');
        const autoDetect = document.getElementById('schedulerAutoDetect');
        
        if (enabled) {
            manualSettings.style.opacity = '1';
            manualSettings.style.pointerEvents = 'auto';
            autoDetect.disabled = false;
        } else {
            manualSettings.style.opacity = '0.5';
            manualSettings.style.pointerEvents = 'none';
            autoDetect.disabled = true;
        }
    }

    toggleAutoDetect(enabled) {
        const timeInputs = document.querySelectorAll('#manualTimeSettings input[type="time"]');
        timeInputs.forEach(input => input.disabled = enabled);
        
        if (enabled) {
            this.detectLocationTime();
        }
    }

    async detectLocationTime() {
        try {
            // Get user's timezone
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            
            // Approximate sunrise/sunset times based on timezone
            // In a real app, you'd use a geolocation API
            const now = new Date();
            const month = now.getMonth();
            
            // Simple approximation: summer vs winter
            const isDST = month >= 3 && month <= 9; // Apr-Oct
            
            const lightStart = isDST ? '06:00' : '07:00';
            const darkStart = isDST ? '21:00' : '18:00';
            
            document.getElementById('lightStartTime').value = lightStart;
            document.getElementById('darkStartTime').value = darkStart;
            
            if (typeof showNotification === 'function') {
                showNotification('Times adjusted for your timezone', 'success');
            }
        } catch (e) {
            console.error('Failed to detect location time:', e);
        }
    }

    saveSettings() {
        this.settings.enabled = document.getElementById('schedulerEnabled').checked;
        this.settings.autoDetect = document.getElementById('schedulerAutoDetect').checked;
        this.settings.darkStart = document.getElementById('darkStartTime').value;
        this.settings.lightStart = document.getElementById('lightStartTime').value;

        try {
            localStorage.setItem('themeSchedulerSettings', JSON.stringify(this.settings));
            
            if (this.settings.enabled) {
                this.startScheduler();
                this.checkAndApplyTheme(); // Apply immediately
            } else {
                this.stopScheduler();
            }

            this.updateStatus();
            
            if (typeof showNotification === 'function') {
                showNotification('Theme scheduler settings saved', 'success');
            }
        } catch (e) {
            console.error('Failed to save settings:', e);
            if (typeof showNotification === 'function') {
                showNotification('Failed to save settings', 'error');
            }
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('themeSchedulerSettings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.error('Failed to load settings:', e);
        }
    }

    resetSettings() {
        if (confirm('Reset theme scheduler to default settings?')) {
            this.settings = {
                enabled: false,
                darkStart: '20:00',
                lightStart: '07:00',
                autoDetect: false
            };
            this.populateSettings();
            this.saveSettings();
        }
    }

    startScheduler() {
        if (!this.settings.enabled) return;

        // Stop existing interval
        this.stopScheduler();

        // Check immediately
        this.checkAndApplyTheme();

        // Check every minute
        this.checkInterval = setInterval(() => {
            this.checkAndApplyTheme();
        }, 60000); // 1 minute

        console.log('Theme scheduler started');
    }

    stopScheduler() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
            console.log('Theme scheduler stopped');
        }
    }

    checkAndApplyTheme() {
        if (!this.settings.enabled) return;

        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const isDarkTime = this.isTimeInDarkRange(currentTime);
        const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        const targetTheme = isDarkTime ? 'dark' : 'light';

        if (currentTheme !== targetTheme) {
            if (typeof applyTheme === 'function') {
                applyTheme(targetTheme);
                console.log(`Theme auto-switched to ${targetTheme} mode at ${currentTime}`);
                
                if (typeof showNotification === 'function') {
                    showNotification(`Switched to ${targetTheme} mode`, 'info');
                }
            }
        }
    }

    isTimeInDarkRange(currentTime) {
        const [currentHour, currentMin] = currentTime.split(':').map(Number);
        const [darkHour, darkMin] = this.settings.darkStart.split(':').map(Number);
        const [lightHour, lightMin] = this.settings.lightStart.split(':').map(Number);

        const current = currentHour * 60 + currentMin;
        const darkStart = darkHour * 60 + darkMin;
        const lightStart = lightHour * 60 + lightMin;

        // Handle overnight range (e.g., 20:00 to 07:00)
        if (darkStart > lightStart) {
            return current >= darkStart || current < lightStart;
        } else {
            // Handle same-day range (unusual but supported)
            return current >= darkStart && current < lightStart;
        }
    }

    updateStatus() {
        const statusEl = document.getElementById('schedulerStatus');
        if (!statusEl) return;

        if (!this.settings.enabled) {
            statusEl.innerHTML = '<i class="fas fa-pause-circle"></i><span>Scheduler is disabled</span>';
            statusEl.className = 'scheduler-status disabled';
            return;
        }

        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const isDarkTime = this.isTimeInDarkRange(currentTime);
        const currentMode = isDarkTime ? 'Dark' : 'Light';
        const nextMode = isDarkTime ? 'Light' : 'Dark';
        const nextTime = isDarkTime ? this.settings.lightStart : this.settings.darkStart;

        statusEl.innerHTML = `
            <i class="fas fa-${isDarkTime ? 'moon' : 'sun'}"></i>
            <span>${currentMode} mode active. Switches to ${nextMode} at ${nextTime}</span>
        `;
        statusEl.className = `scheduler-status ${isDarkTime ? 'dark' : 'light'}`;
    }

    getNextSwitchTime() {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const isDarkTime = this.isTimeInDarkRange(currentTime);
        
        return isDarkTime ? this.settings.lightStart : this.settings.darkStart;
    }
}

// Initialize theme scheduler
const themeScheduler = new ThemeScheduler();

// Make it globally accessible
window.themeScheduler = themeScheduler;
