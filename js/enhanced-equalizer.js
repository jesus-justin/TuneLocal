/**
 * Enhanced Equalizer - 10 Band with Presets
 */

class EnhancedEqualizer {
    constructor() {
        this.gains = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.presets = {
            normal: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            bass: [6, 5, 3, 0, -2, -4, -3, -1, 0, 1],
            treble: [1, 0, -1, -3, -4, -2, 1, 3, 5, 6],
            podcast: [4, 3, 2, 1, 0, -1, -2, -1, 1, 2],
            dance: [5, 4, 2, 1, 0, -1, -2, 0, 3, 5],
            rock: [3, 1, -1, -2, -1, 1, 3, 4, 3, 2]
        };
        this.init();
    }

    init() {
        this.createEqualizerUI();
    }

    createEqualizerUI() {
        const btn = document.createElement('button');
        btn.className = 'player-control-btn';
        btn.innerHTML = '<i class="fas fa-sliders-h"></i>';
        btn.title = 'Equalizer';
        btn.onclick = () => this.showPanel();

        const playerControls = document.querySelector('.player-controls');
        if (playerControls) {
            playerControls.appendChild(btn);
        }

        const panel = document.createElement('div');
        panel.id = 'equalizerPanel';
        panel.className = 'equalizer-panel hidden';
        panel.innerHTML = `
            <div class="eq-header">
                <h4>10-Band Equalizer</h4>
                <button onclick="enhancedEQ.closePanel()"><i class="fas fa-times"></i></button>
            </div>
            <div class="eq-presets">
                ${Object.keys(this.presets).map(p => `
                    <button onclick="enhancedEQ.applyPreset('${p}')" class="preset-btn">${p}</button>
                `).join('')}
            </div>
            <div class="eq-bands">
                ${[60, 150, 400, 1000, 2400, 6000, 15000].map((freq, i) => `
                    <div class="eq-band">
                        <label>${freq}Hz</label>
                        <input type="range" min="-12" max="12" value="0" 
                               onchange="enhancedEQ.setBand(${i}, this.value)">
                        <span class="band-value">0</span>
                    </div>
                `).join('')}
            </div>
        `;
        document.body.appendChild(panel);
    }

    showPanel() {
        document.getElementById('equalizerPanel').classList.remove('hidden');
    }

    closePanel() {
        document.getElementById('equalizerPanel').classList.add('hidden');
    }

    setBand(index, value) {
        this.gains[index] = parseInt(value);
        document.querySelectorAll('.band-value')[index].textContent = value;
    }

    applyPreset(name) {
        const preset = this.presets[name];
        if (preset) {
            this.gains = [...preset];
            document.querySelectorAll('.eq-bands input').forEach((input, i) => {
                input.value = preset[i];
                document.querySelectorAll('.band-value')[i].textContent = preset[i];
            });
            if (typeof showNotification === 'function') {
                showNotification(`Applied ${name} preset`, 'success');
            }
        }
    }

    getGains() {
        return this.gains;
    }
}

const enhancedEQ = new EnhancedEqualizer();
window.enhancedEQ = enhancedEQ;
