/**
 * Crossfade Feature for TuneLocal
 * Smooth transitions between tracks
 */

class Crossfade {
    constructor() {
        this.enabled = false;
        this.duration = 3; // seconds
        this.currentAudio = null;
        this.nextAudio = null;
        this.fadeInterval = null;
        this.init();
    }

    init() {
        this.loadSettings();
        this.createControlUI();
    }

    createControlUI() {
        // Add to player controls or settings
        const settingsBtn = document.createElement('button');
        settingsBtn.id = 'crossfadeSettingsBtn';
        settingsBtn.className = 'player-control-btn';
        settingsBtn.innerHTML = '<i class="fas fa-sliders-h"></i>';
        settingsBtn.title = 'Crossfade Settings';
        settingsBtn.onclick = () => this.showSettings();

        const playerControls = document.querySelector('.player-controls');
        if (playerControls) {
            playerControls.appendChild(settingsBtn);
        }

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'crossfadeModal';
        modal.className = 'crossfade-modal';
        modal.innerHTML = `
            <div class="crossfade-modal-content">
                <h3><i class="fas fa-sliders-h"></i> Crossfade Settings</h3>
                <div class="crossfade-toggle">
                    <label>
                        <input type="checkbox" id="crossfadeEnabled" ${this.enabled ? 'checked' : ''}>
                        <span>Enable Crossfade</span>
                    </label>
                </div>
                <div class="crossfade-slider">
                    <label>Duration: <span id="crossfadeDurationValue">${this.duration}s</span></label>
                    <input type="range" id="crossfadeDuration" min="0" max="12" step="1" value="${this.duration}">
                </div>
                <button class="btn-primary" onclick="crossfade.saveSettings()">Save</button>
                <button class="btn-secondary" onclick="crossfade.hideSettings()">Cancel</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('crossfadeDuration').oninput = (e) => {
            document.getElementById('crossfadeDurationValue').textContent = e.target.value + 's';
        };
    }

    showSettings() {
        document.getElementById('crossfadeModal').style.display = 'flex';
    }

    hideSettings() {
        document.getElementById('crossfadeModal').style.display = 'none';
    }

    saveSettings() {
        this.enabled = document.getElementById('crossfadeEnabled').checked;
        this.duration = parseInt(document.getElementById('crossfadeDuration').value);
        localStorage.setItem('crossfadeSettings', JSON.stringify({ enabled: this.enabled, duration: this.duration }));
        this.hideSettings();
        if (typeof showNotification === 'function') {
            showNotification(`Crossfade ${this.enabled ? 'enabled' : 'disabled'}`, 'success');
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('crossfadeSettings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.enabled = settings.enabled;
                this.duration = settings.duration;
            }
        } catch (e) {}
    }

    startCrossfade(currentAudio, nextAudio) {
        if (!this.enabled || !currentAudio || !nextAudio) return;

        const steps = 50;
        const stepTime = (this.duration * 1000) / steps;
        let step = 0;

        this.fadeInterval = setInterval(() => {
            step++;
            const progress = step / steps;
            currentAudio.volume = Math.max(0, 1 - progress);
            nextAudio.volume = Math.min(1, progress);

            if (step >= steps) {
                clearInterval(this.fadeInterval);
                currentAudio.pause();
            }
        }, stepTime);
    }
}

const crossfade = new Crossfade();
window.crossfade = crossfade;
