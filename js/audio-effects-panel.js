// Audio Effects Panel
class AudioEffectsPanel {
    constructor() {
        this.effects = this.loadEffects();
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createEffectsPanel();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .effects-panel { position: fixed; bottom: 100px; left: 20px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.5rem; max-width: 320px; z-index: 986; backdrop-filter: blur(10px); }
            .effects-title { color: var(--primary-color); font-weight: bold; font-size: 14px; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }
            .effects-group { margin-bottom: 1.5rem; }
            .effects-label { color: var(--text-primary); font-size: 13px; margin-bottom: 0.75rem; display: flex; justify-content: space-between; }
            .effects-value { color: var(--primary-color); font-weight: bold; }
            .effects-slider { width: 100%; height: 8px; border-radius: 4px; background: rgba(0, 0, 0, 0.3); outline: none; -webkit-appearance: none; appearance: none; }
            .effects-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 50%; background: var(--primary-color); cursor: pointer; box-shadow: 0 2px 8px rgba(29, 185, 84, 0.4); }
            .effects-slider::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: var(--primary-color); cursor: pointer; box-shadow: 0 2px 8px rgba(29, 185, 84, 0.4); border: none; }
            .effects-preset { display: flex; gap: 0.5rem; flex-wrap: wrap; }
            .effects-preset-btn { background: rgba(29, 185, 84, 0.1); border: 1px solid var(--primary-color); color: var(--primary-color); padding: 0.5rem 1rem; border-radius: 6px; font-size: 11px; cursor: pointer; transition: all 0.2s; }
            .effects-preset-btn:hover { background: var(--primary-color); color: white; transform: scale(1.05); }
            .effects-preset-btn.active { background: var(--primary-color); color: white; }
            .effects-reset { background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; padding: 0.5rem; border-radius: 6px; font-size: 12px; cursor: pointer; text-align: center; transition: all 0.2s; }
            .effects-reset:hover { background: #ef4444; color: white; }
        `;
        document.head.appendChild(style);
    }
    
    createEffectsPanel() {
        const panel = document.createElement('div');
        panel.className = 'effects-panel';
        panel.innerHTML = `
            <div class="effects-title">
                <span>🎚️ Audio Effects</span>
            </div>
            
            <div class="effects-group">
                <div class="effects-label">
                    <span>Bass Boost</span>
                    <span class="effects-value" id="bassValue">${this.effects.bass}%</span>
                </div>
                <input type="range" class="effects-slider" id="bassSlider" min="0" max="100" value="${this.effects.bass}" oninput="document.getElementById('bassValue').textContent = this.value + '%'">
            </div>
            
            <div class="effects-group">
                <div class="effects-label">
                    <span>Treble</span>
                    <span class="effects-value" id="trebleValue">${this.effects.treble}%</span>
                </div>
                <input type="range" class="effects-slider" id="trebleSlider" min="0" max="100" value="${this.effects.treble}" oninput="document.getElementById('trebleValue').textContent = this.value + '%'">
            </div>
            
            <div class="effects-group">
                <div class="effects-label">
                    <span>Reverb</span>
                    <span class="effects-value" id="reverbValue">${this.effects.reverb}%</span>
                </div>
                <input type="range" class="effects-slider" id="reverbSlider" min="0" max="100" value="${this.effects.reverb}" oninput="document.getElementById('reverbValue').textContent = this.value + '%'">
            </div>
            
            <div class="effects-group">
                <div class="effects-label">
                    <span>Echo</span>
                    <span class="effects-value" id="echoValue">${this.effects.echo}%</span>
                </div>
                <input type="range" class="effects-slider" id="echoSlider" min="0" max="100" value="${this.effects.echo}" oninput="document.getElementById('echoValue').textContent = this.value + '%'">
            </div>
            
            <div class="effects-group">
                <div class="effects-label">
                    <span>Presets</span>
                </div>
                <div class="effects-preset">
                    <button class="effects-preset-btn" onclick="this.closest('.effects-panel').dispatchEvent(new CustomEvent('preset', {detail: 'flat'}))">Flat</button>
                    <button class="effects-preset-btn" onclick="this.closest('.effects-panel').dispatchEvent(new CustomEvent('preset', {detail: 'rock'}))">Rock</button>
                    <button class="effects-preset-btn" onclick="this.closest('.effects-panel').dispatchEvent(new CustomEvent('preset', {detail: 'jazz'}))">Jazz</button>
                    <button class="effects-preset-btn" onclick="this.closest('.effects-panel').dispatchEvent(new CustomEvent('preset', {detail: 'pop'}))">Pop</button>
                    <button class="effects-preset-btn" onclick="this.closest('.effects-panel').dispatchEvent(new CustomEvent('preset', {detail: 'classical'}))">Classical</button>
                </div>
            </div>
            
            <div class="effects-reset" onclick="this.closest('.effects-panel').dispatchEvent(new CustomEvent('reset'))">
                Reset All Effects
            </div>
        `;
        document.body.appendChild(panel);
        
        this.attachSliderListeners();
        this.attachPresetListener();
        this.attachResetListener();
    }
    
    attachSliderListeners() {
        ['bass', 'treble', 'reverb', 'echo'].forEach(effect => {
            const slider = document.getElementById(effect + 'Slider');
            slider.addEventListener('change', () => {
                this.effects[effect] = parseInt(slider.value);
                this.saveEffects();
            });
        });
    }
    
    attachPresetListener() {
        const panel = document.querySelector('.effects-panel');
        panel.addEventListener('preset', (e) => {
            const presets = {
                flat: { bass: 50, treble: 50, reverb: 0, echo: 0 },
                rock: { bass: 70, treble: 65, reverb: 20, echo: 10 },
                jazz: { bass: 45, treble: 60, reverb: 30, echo: 15 },
                pop: { bass: 60, treble: 70, reverb: 25, echo: 20 },
                classical: { bass: 40, treble: 55, reverb: 40, echo: 5 }
            };
            
            const preset = presets[e.detail];
            if (preset) {
                this.applyPreset(preset);
            }
        });
    }
    
    attachResetListener() {
        const panel = document.querySelector('.effects-panel');
        panel.addEventListener('reset', () => {
            this.applyPreset({ bass: 50, treble: 50, reverb: 0, echo: 0 });
        });
    }
    
    applyPreset(preset) {
        ['bass', 'treble', 'reverb', 'echo'].forEach(effect => {
            this.effects[effect] = preset[effect];
            document.getElementById(effect + 'Slider').value = preset[effect];
            document.getElementById(effect + 'Value').textContent = preset[effect] + '%';
        });
        this.saveEffects();
    }
    
    loadEffects() {
        const stored = localStorage.getItem('audioEffects');
        return stored ? JSON.parse(stored) : { bass: 50, treble: 50, reverb: 0, echo: 0 };
    }
    
    saveEffects() {
        localStorage.setItem('audioEffects', JSON.stringify(this.effects));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AudioEffectsPanel();
});
