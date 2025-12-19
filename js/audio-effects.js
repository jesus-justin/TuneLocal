/**
 * Audio Effects System for TuneLocal
 */

class AudioEffects {
    constructor() {
        this.audioContext = null;
        this.source = null;
        this.effects = {
            reverb: null,
            echo: null,
            bassBoost: null,
            panner: null
        };
        this.enabled = {
            reverb: false,
            echo: false,
            bassBoost: false,
            spatial3D: false
        };
        this.init();
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.setupEffects();
            this.createEffectsUI();
        } catch (e) {
            console.error('Web Audio API not supported:', e);
        }
    }

    setupEffects() {
        // Bass Boost
        this.effects.bassBoost = this.audioContext.createBiquadFilter();
        this.effects.bassBoost.type = 'lowshelf';
        this.effects.bassBoost.frequency.value = 200;
        this.effects.bassBoost.gain.value = 10;

        // Echo/Delay
        this.effects.echo = this.audioContext.createDelay();
        this.effects.echo.delayTime.value = 0.5;

        // 3D Panner
        this.effects.panner = this.audioContext.createStereoPanner();
        this.effects.panner.pan.value = 0;
    }

    createEffectsUI() {
        const btn = document.createElement('button');
        btn.className = 'player-control-btn';
        btn.innerHTML = '<i class="fas fa-magic"></i>';
        btn.title = 'Audio Effects';
        btn.onclick = () => this.showEffectsPanel();

        const playerControls = document.querySelector('.player-controls');
        if (playerControls) {
            playerControls.appendChild(btn);
        }

        // Create effects panel
        const panel = document.createElement('div');
        panel.id = 'audioEffectsPanel';
        panel.className = 'audio-effects-panel hidden';
        panel.innerHTML = `
            <h4><i class="fas fa-magic"></i> Audio Effects</h4>
            <label><input type="checkbox" onchange="audioEffects.toggleEffect('bassBoost', this.checked)"> Bass Boost</label>
            <label><input type="checkbox" onchange="audioEffects.toggleEffect('echo', this.checked)"> Echo</label>
            <label><input type="checkbox" onchange="audioEffects.toggleEffect('spatial3D', this.checked)"> 3D Sound</label>
            <button class="btn-secondary" onclick="audioEffects.hideEffectsPanel()">Close</button>
        `;
        document.body.appendChild(panel);
    }

    showEffectsPanel() {
        document.getElementById('audioEffectsPanel').classList.remove('hidden');
    }

    hideEffectsPanel() {
        document.getElementById('audioEffectsPanel').classList.add('hidden');
    }

    toggleEffect(effect, enabled) {
        this.enabled[effect] = enabled;
        if (typeof showNotification === 'function') {
            showNotification(`${effect} ${enabled ? 'enabled' : 'disabled'}`, 'info');
        }
    }

    connectAudioElement(audioElement) {
        if (!this.audioContext) return;
        
        try {
            this.source = this.audioContext.createMediaElementSource(audioElement);
            this.source.connect(this.audioContext.destination);
        } catch (e) {
            console.error('Failed to connect audio element:', e);
        }
    }
}

const audioEffects = new AudioEffects();
window.audioEffects = audioEffects;
