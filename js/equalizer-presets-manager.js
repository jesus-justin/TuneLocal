// Equalizer Presets Manager
class EqualizerPresetsManager {
    constructor() {
        this.presets = this.loadPresets();
        this.currentPreset = this.loadCurrentPreset();
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createPresetsPanel();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .eq-presets-panel { position: fixed; bottom: 650px; right: 20px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.5rem; z-index: 944; backdrop-filter: blur(10px); min-width: 280px; max-height: 450px; overflow-y: auto; }
            .eq-title { color: var(--primary-color); font-weight: bold; font-size: 14px; margin-bottom: 1rem; }
            .eq-current { background: rgba(0, 0, 0, 0.2); padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem; }
            .eq-current-label { color: var(--text-secondary); font-size: 11px; margin-bottom: 0.25rem; }
            .eq-current-name { color: var(--primary-color); font-weight: bold; font-size: 14px; }
            .eq-presets { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
            .eq-preset { background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 0.75rem; cursor: pointer; transition: all 0.2s; text-align: center; }
            .eq-preset.active { border-color: var(--primary-color); background: rgba(29, 185, 84, 0.1); }
            .eq-preset:hover { transform: translateY(-2px); }
            .eq-preset-name { color: var(--text-primary); font-size: 12px; font-weight: 500; margin-bottom: 0.25rem; }
            .eq-preset-desc { color: var(--text-secondary); font-size: 10px; }
            .eq-custom { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.1); }
            .eq-custom-btn { background: linear-gradient(135deg, rgba(29, 185, 84, 0.1), rgba(74, 222, 128, 0.1)); border: 1px solid var(--primary-color); color: var(--primary-color); padding: 0.5rem; border-radius: 6px; font-size: 11px; cursor: pointer; width: 100%; transition: all 0.2s; }
            .eq-custom-btn:hover { background: var(--primary-color); color: white; }
        `;
        document.head.appendChild(style);
    }
    
    createPresetsPanel() {
        const panel = document.createElement('div');
        panel.className = 'eq-presets-panel';
        panel.innerHTML = `
            <div class="eq-title">🎚️ EQ Presets</div>
            
            <div class="eq-current">
                <div class="eq-current-label">Currently Using</div>
                <div class="eq-current-name" id="currentPresetName">${this.currentPreset}</div>
            </div>
            
            <div class="eq-presets" id="eqPresets"></div>
            
            <div class="eq-custom">
                <button class="eq-custom-btn" onclick="alert('Custom EQ editor')">+ Create Custom</button>
                <button class="eq-custom-btn" style="margin-top: 0.5rem;" onclick="alert('Manage your presets')">⚙️ Manage</button>
            </div>
        `;
        document.body.appendChild(panel);
        
        this.renderPresets();
    }
    
    renderPresets() {
        const presetsEl = document.getElementById('eqPresets');
        presetsEl.innerHTML = this.presets.map(p => `
            <div class="eq-preset ${this.currentPreset === p.name ? 'active' : ''}" onclick="this.closest('.eq-presets-panel').dispatchEvent(new CustomEvent('presetSelect', {detail: '${p.name}', bubbles: true}))">
                <div class="eq-preset-name">${p.name}</div>
                <div class="eq-preset-desc">${p.description}</div>
            </div>
        `).join('');
        
        const panel = document.querySelector('.eq-presets-panel');
        panel.addEventListener('presetSelect', (e) => {
            this.selectPreset(e.detail);
        });
    }
    
    selectPreset(presetName) {
        this.currentPreset = presetName;
        this.saveCurrentPreset();
        document.getElementById('currentPresetName').textContent = presetName;
        this.renderPresets();
    }
    
    loadPresets() {
        return [
            { name: 'Flat', description: 'Normal response' },
            { name: 'Bass Boost', description: 'Enhanced bass' },
            { name: 'Treble Boost', description: 'Bright sound' },
            { name: 'Jazz', description: 'Warm tone' },
            { name: 'Pop', description: 'Balanced' },
            { name: 'Classical', description: 'Detailed' },
            { name: 'Rock', description: 'Power packed' },
            { name: 'Electronic', description: 'Punchy' }
        ];
    }
    
    loadCurrentPreset() {
        return localStorage.getItem('currentEQPreset') || 'Flat';
    }
    
    saveCurrentPreset() {
        localStorage.setItem('currentEQPreset', this.currentPreset);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new EqualizerPresetsManager();
});
