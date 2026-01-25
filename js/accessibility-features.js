// Accessibility Enhancement System
class AccessibilityFeatures {
    constructor() {
        this.settings = JSON.parse(localStorage.getItem('accessibilitySettings')) || {
            highContrast: false,
            screenReader: false,
            fontSize: 100,
            keyboardNav: true,
            reducedMotion: false,
            colorBlindMode: 'none'
        };
        this.init();
    }

    init() {
        this.setupAccessibilityUI();
        this.applySettings();
        this.setupEventListeners();
    }

    setupAccessibilityUI() {
        const panel = document.createElement('div');
        panel.id = 'accessibilityPanel';
        panel.className = 'accessibility-panel';
        panel.innerHTML = `
            <div class="accessibility-header">
                <h3>Accessibility Settings</h3>
            </div>
            <div class="accessibility-options">
                <div class="accessibility-group">
                    <h4>Visual</h4>
                    <label><input type="checkbox" id="highContrastToggle" /> High Contrast Mode</label>
                    <label><input type="checkbox" id="reducedMotionToggle" /> Reduce Motion</label>
                    <label>Font Size: <input type="range" id="fontSizeSlider" min="75" max="200" value="100" />%</label>
                    <label>Color Blind Mode:
                        <select id="colorBlindSelect">
                            <option value="none">Normal</option>
                            <option value="protanopia">Protanopia (Red-Blind)</option>
                            <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
                            <option value="tritanopia">Tritanopia (Blue-Blind)</option>
                        </select>
                    </label>
                </div>
                <div class="accessibility-group">
                    <h4>Navigation</h4>
                    <label><input type="checkbox" id="keyboardNavToggle" checked /> Enable Keyboard Navigation</label>
                    <label><input type="checkbox" id="screenReaderToggle" /> Optimize for Screen Reader</label>
                    <label><input type="checkbox" id="focusHighlightToggle" /> Show Focus Highlights</label>
                </div>
                <div class="accessibility-group">
                    <h4>Audio</h4>
                    <label><input type="checkbox" id="captionsToggle" /> Show Captions</label>
                    <label><input type="checkbox" id="transcriptToggle" /> Show Transcript</label>
                    <label>Speech Rate: <input type="range" id="speechRateSlider" min="0.5" max="2" value="1" step="0.1" /></label>
                </div>
            </div>
        `;

        const existing = document.getElementById('accessibilityPanel');
        if (existing) existing.remove();
        document.body.appendChild(panel);
    }

    setupEventListeners() {
        document.getElementById('highContrastToggle').addEventListener('change', (e) => {
            this.settings.highContrast = e.target.checked;
            this.applySettings();
        });

        document.getElementById('reducedMotionToggle').addEventListener('change', (e) => {
            this.settings.reducedMotion = e.target.checked;
            this.applySettings();
        });

        document.getElementById('fontSizeSlider').addEventListener('change', (e) => {
            this.settings.fontSize = parseInt(e.target.value);
            this.applySettings();
        });

        document.getElementById('keyboardNavToggle').addEventListener('change', (e) => {
            this.settings.keyboardNav = e.target.checked;
            this.setupKeyboardNavigation();
        });

        document.getElementById('screenReaderToggle').addEventListener('change', (e) => {
            this.settings.screenReader = e.target.checked;
            this.optimizeForScreenReader();
        });

        document.getElementById('colorBlindSelect').addEventListener('change', (e) => {
            this.settings.colorBlindMode = e.target.value;
            this.applyColorBlindMode();
        });
    }

    applySettings() {
        const root = document.documentElement;

        if (this.settings.highContrast) {
            root.style.filter = 'contrast(1.5)';
        } else {
            root.style.filter = 'contrast(1)';
        }

        if (this.settings.reducedMotion) {
            root.style.transition = 'none';
            document.querySelectorAll('*').forEach(el => {
                el.style.animation = 'none';
            });
        }

        root.style.fontSize = `${this.settings.fontSize}%`;

        localStorage.setItem('accessibilitySettings', JSON.stringify(this.settings));
    }

    setupKeyboardNavigation() {
        if (!this.settings.keyboardNav) return;

        document.addEventListener('keydown', (e) => {
            // Tab through interactive elements
            if (e.key === 'Tab') {
                const interactive = document.querySelectorAll('button, a, input, select');
                const focused = document.activeElement;
                const index = Array.from(interactive).indexOf(focused);
                
                if (e.shiftKey && index > 0) {
                    interactive[index - 1].focus();
                } else if (!e.shiftKey && index < interactive.length - 1) {
                    interactive[index + 1].focus();
                }
            }

            // Enter to activate buttons
            if (e.key === 'Enter' && document.activeElement.tagName === 'BUTTON') {
                document.activeElement.click();
            }
        });
    }

    optimizeForScreenReader() {
        if (!this.settings.screenReader) return;

        document.querySelectorAll('[role]').forEach(el => {
            const role = el.getAttribute('role');
            el.setAttribute('aria-label', role + ': ' + (el.textContent || 'button'));
        });

        showNotification('Screen reader mode enabled', 'info');
    }

    applyColorBlindMode() {
        const modes = {
            'none': 'none',
            'protanopia': 'url(#protanopia-filter)',
            'deuteranopia': 'url(#deuteranopia-filter)',
            'tritanopia': 'url(#tritanopia-filter)'
        };

        document.documentElement.style.filter = modes[this.settings.colorBlindMode];
    }
}

const accessibilityFeatures = new AccessibilityFeatures();
window.accessibilityFeatures = accessibilityFeatures;
