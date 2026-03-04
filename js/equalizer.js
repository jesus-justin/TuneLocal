/**
 * TuneLocal Audio Equalizer
 * Multi-band equalizer with presets
 * Version 1.0.1 - Enhanced equalizer features
 */

class AudioEqualizer {
    constructor() {
        this.audioContext = null;
        this.audioSource = null;
        this.filters = [];
        this.isActive = false;
        this.currentPreset = 'flat';
        
        // Frequency bands (Hz)
        this.bands = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];
        
        // Equalizer presets
        this.presets = {
            flat: { name: 'Flat', gains: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
            pop: { name: 'Pop', gains: [-1, -1, 0, 2, 4, 4, 2, 0, -1, -1] },
            rock: { name: 'Rock', gains: [5, 3, -3, -5, -2, 2, 5, 6, 6, 6] },
            jazz: { name: 'Jazz', gains: [4, 3, 1, 2, -2, -2, 0, 2, 3, 4] },
            classical: { name: 'Classical', gains: [5, 4, 3, 2, -2, -2, 0, 2, 3, 4] },
            bass: { name: 'Bass Boost', gains: [8, 6, 5, 3, 0, -2, -3, -3, -3, -3] },
            treble: { name: 'Treble Boost', gains: [-3, -3, -3, -2, 0, 3, 5, 6, 8, 8] },
            vocal: { name: 'Vocal', gains: [-2, -3, -2, 1, 3, 4, 4, 3, 1, 0] },
            electronic: { name: 'Electronic', gains: [5, 4, 1, 0, -2, 2, 1, 2, 5, 6] },
            acoustic: { name: 'Acoustic', gains: [5, 4, 3, 1, 2, 2, 3, 3, 4, 3] }
        };
    }

    /**
     * Initialize equalizer
     */
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createFilters();
            return true;
        } catch (error) {
            console.error('Failed to initialize equalizer:', error);
            return false;
        }
    }

    /**
     * Create filter nodes for each frequency band
     */
    createFilters() {
        this.filters = this.bands.map((frequency, index) => {
            const filter = this.audioContext.createBiquadFilter();
            
            if (index === 0) {
                filter.type = 'lowshelf';
            } else if (index === this.bands.length - 1) {
                filter.type = 'highshelf';
            } else {
                filter.type = 'peaking';
            }
            
            filter.frequency.value = frequency;
            filter.Q.value = 1;
            filter.gain.value = 0;
            
            return filter;
        });

        // Connect filters in series
        for (let i = 0; i < this.filters.length - 1; i++) {
            this.filters[i].connect(this.filters[i + 1]);
        }
    }

    /**
     * Connect audio element to equalizer
     */
    connectAudio(audioElement) {
        try {
            if (!this.audioContext) {
                this.init();
            }

            // Disconnect previous source if exists
            if (this.audioSource) {
                this.audioSource.disconnect();
            }

            // Create new source
            this.audioSource = this.audioContext.createMediaElementSource(audioElement);
            
            // Connect: source -> first filter -> ... -> last filter -> destination
            this.audioSource.connect(this.filters[0]);
            this.filters[this.filters.length - 1].connect(this.audioContext.destination);
            
            this.isActive = true;
            return true;
        } catch (error) {
            console.error('Failed to connect audio:', error);
            return false;
        }
    }

    /**
     * Set gain for specific band
     */
    setBandGain(bandIndex, gain) {
        if (bandIndex >= 0 && bandIndex < this.filters.length) {
            this.filters[bandIndex].gain.value = gain;
        }
    }

    /**
     * Get gain for specific band
     */
    getBandGain(bandIndex) {
        if (bandIndex >= 0 && bandIndex < this.filters.length) {
            return this.filters[bandIndex].gain.value;
        }
        return 0;
    }

    /**
     * Apply preset
     */
    applyPreset(presetName) {
        const preset = this.presets[presetName];
        if (!preset) {
            console.error('Preset not found:', presetName);
            return false;
        }

        preset.gains.forEach((gain, index) => {
            this.setBandGain(index, gain);
        });

        this.currentPreset = presetName;
        this.saveSettings();
        return true;
    }

    /**
     * Get current preset name
     */
    getCurrentPreset() {
        return this.currentPreset;
    }

    /**
     * Get all presets
     */
    getPresets() {
        return this.presets;
    }

    /**
     * Reset to flat (all gains to 0)
     */
    reset() {
        this.applyPreset('flat');
    }

    /**
     * Save custom settings
     */
    saveCustom(name) {
        const gains = this.filters.map(filter => filter.gain.value);
        this.presets[name.toLowerCase()] = {
            name: name,
            gains: gains
        };
        this.currentPreset = name.toLowerCase();
        this.saveSettings();
    }

    /**
     * Enable/disable equalizer
     */
    toggle() {
        this.isActive = !this.isActive;
        
        if (this.isActive) {
            // Restore previous settings
            this.applyPreset(this.currentPreset);
        } else {
            // Set all gains to 0
            this.filters.forEach(filter => {
                filter.gain.value = 0;
            });
        }
        
        return this.isActive;
    }

    /**
     * Check if equalizer is active
     */
    isEnabled() {
        return this.isActive;
    }

    /**
     * Get frequency bands
     */
    getBands() {
        return this.bands;
    }

    /**
     * Save settings to localStorage
     */
    saveSettings() {
        try {
            const settings = {
                preset: this.currentPreset,
                isActive: this.isActive,
                customPresets: Object.keys(this.presets)
                    .filter(key => !['flat', 'pop', 'rock', 'jazz', 'classical', 'bass', 'treble', 'vocal', 'electronic', 'acoustic'].includes(key))
                    .reduce((obj, key) => {
                        obj[key] = this.presets[key];
                        return obj;
                    }, {})
            };
            localStorage.setItem('tunelocal_equalizer', JSON.stringify(settings));
        } catch (e) {
            console.error('Failed to save equalizer settings:', e);
        }
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('tunelocal_equalizer');
            if (saved) {
                const settings = JSON.parse(saved);
                
                // Load custom presets
                if (settings.customPresets) {
                    Object.assign(this.presets, settings.customPresets);
                }
                
                // Apply saved preset
                if (settings.preset) {
                    this.applyPreset(settings.preset);
                }
                
                this.isActive = settings.isActive !== false;
            }
        } catch (e) {
            console.error('Failed to load equalizer settings:', e);
        }
    }

    /**
     * Export settings
     */
    export() {
        const settings = {
            preset: this.currentPreset,
            customPresets: this.presets
        };
        
        const blob = new Blob([JSON.stringify(settings, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tunelocal_equalizer_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Global instance
const audioEqualizer = new AudioEqualizer();

/**
 * Render equalizer UI
 */
function renderEqualizerUI(containerId = 'equalizer-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const bands = audioEqualizer.getBands();
    const presets = audioEqualizer.getPresets();

    container.innerHTML = `
        <div class="equalizer-controls">
            <div class="equalizer-header">
                <h3><i class="fas fa-sliders-h"></i> Equalizer</h3>
                <div class="equalizer-actions">
                    <button class="btn btn-sm" onclick="audioEqualizer.toggle(); updateEqualizerUI();">
                        <i class="fas fa-power-off"></i>
                        ${audioEqualizer.isEnabled() ? 'Disable' : 'Enable'}
                    </button>
                    <button class="btn btn-sm" onclick="audioEqualizer.reset(); updateEqualizerUI();">
                        <i class="fas fa-undo"></i> Reset
                    </button>
                </div>
            </div>

            <div class="equalizer-presets">
                <label>Presets:</label>
                <select id="eq-preset-select" onchange="applyEqualizerPreset(this.value)">
                    ${Object.entries(presets).map(([key, preset]) => `
                        <option value="${key}" ${key === audioEqualizer.getCurrentPreset() ? 'selected' : ''}>
                            ${preset.name}
                        </option>
                    `).join('')}
                </select>
            </div>

            <div class="equalizer-bands">
                ${bands.map((freq, index) => {
                    const gain = audioEqualizer.getBandGain(index);
                    const freqLabel = freq >= 1000 ? `${freq / 1000}k` : freq;
                    return `
                        <div class="eq-band">
                            <input 
                                type="range" 
                                class="eq-slider" 
                                id="eq-band-${index}"
                                min="-12" 
                                max="12" 
                                step="0.5"
                                value="${gain}"
                                orient="vertical"
                                oninput="updateEqualizerBand(${index}, this.value)"
                            >
                            <span class="eq-value" id="eq-value-${index}">${gain.toFixed(1)}</span>
                            <span class="eq-freq">${freqLabel}Hz</span>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

/**
 * Apply equalizer preset
 */
function applyEqualizerPreset(presetName) {
    audioEqualizer.applyPreset(presetName);
    updateEqualizerUI();
    showNotification(`Preset applied: ${audioEqualizer.getPresets()[presetName].name}`, 'success');
}

/**
 * Update equalizer band
 */
function updateEqualizerBand(bandIndex, value) {
    const gain = parseFloat(value);
    audioEqualizer.setBandGain(bandIndex, gain);
    document.getElementById(`eq-value-${bandIndex}`).textContent = gain.toFixed(1);
}

/**
 * Update equalizer UI
 */
function updateEqualizerUI() {
    audioEqualizer.getBands().forEach((freq, index) => {
        const slider = document.getElementById(`eq-band-${index}`);
        const valueDisplay = document.getElementById(`eq-value-${index}`);
        if (slider && valueDisplay) {
            const gain = audioEqualizer.getBandGain(index);
            slider.value = gain;
            valueDisplay.textContent = gain.toFixed(1);
        }
    });
}

// Load settings on page load
document.addEventListener('DOMContentLoaded', () => {
    audioEqualizer.init();
    audioEqualizer.loadSettings();
});
