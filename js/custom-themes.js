/**
 * Custom Themes System
 */

class CustomThemes {
    constructor() {
        this.themes = {
            dark: {
                primary: '#1db954',
                secondary: '#1a1a2e',
                accent: '#667eea'
            },
            light: {
                primary: '#1db954',
                secondary: '#ffffff',
                accent: '#764ba2'
            },
            midnight: {
                primary: '#00d4ff',
                secondary: '#0a0e27',
                accent: '#ff006e'
            },
            sunset: {
                primary: '#ff6b35',
                secondary: '#1a1a2e',
                accent: '#f7931e'
            }
        };
        this.init();
    }

    init() {
        this.createThemeManager();
        this.loadCustomThemes();
    }

    createThemeManager() {
        const btn = document.createElement('button');
        btn.className = 'player-control-btn';
        btn.innerHTML = '<i class="fas fa-palette"></i>';
        btn.title = 'Themes';
        btn.onclick = () => this.showThemeManager();

        const playerControls = document.querySelector('.player-controls');
        if (playerControls) {
            playerControls.appendChild(btn);
        }

        const panel = document.createElement('div');
        panel.id = 'themeManager';
        panel.className = 'theme-manager hidden';
        panel.innerHTML = `
            <div class="theme-panel">
                <h4><i class="fas fa-palette"></i> Themes</h4>
                <div class="theme-list">
                    ${Object.keys(this.themes).map(name => `
                        <button class="theme-item" onclick="customThemes.applyTheme('${name}')">
                            <div class="theme-preview">
                                <div style="background: ${this.themes[name].primary}"></div>
                                <div style="background: ${this.themes[name].secondary}"></div>
                                <div style="background: ${this.themes[name].accent}"></div>
                            </div>
                            <span>${name}</span>
                        </button>
                    `).join('')}
                </div>
                <button class="btn-primary" onclick="customThemes.createCustom()">Create Custom</button>
            </div>
        `;
        document.body.appendChild(panel);
    }

    showThemeManager() {
        document.getElementById('themeManager').classList.toggle('hidden');
    }

    applyTheme(name) {
        const theme = this.themes[name];
        if (theme) {
            document.documentElement.style.setProperty('--primary-color', theme.primary);
            document.documentElement.style.setProperty('--secondary-color', theme.secondary);
            document.documentElement.style.setProperty('--accent-color', theme.accent);
            
            localStorage.setItem('currentTheme', name);
            if (typeof showNotification === 'function') {
                showNotification(`Applied ${name} theme`, 'success');
            }
        }
    }

    createCustom() {
        const primary = prompt('Primary color (hex):');
        const secondary = prompt('Secondary color (hex):');
        const accent = prompt('Accent color (hex):');

        if (primary && secondary && accent) {
            const name = prompt('Theme name:');
            if (name) {
                this.themes[name] = { primary, secondary, accent };
                this.saveCustomThemes();
                this.applyTheme(name);
            }
        }
    }

    saveCustomThemes() {
        localStorage.setItem('customThemes', JSON.stringify(this.themes));
    }

    loadCustomThemes() {
        try {
            const saved = localStorage.getItem('customThemes');
            if (saved) this.themes = { ...this.themes, ...JSON.parse(saved) };
        } catch (e) {}
    }
}

const customThemes = new CustomThemes();
window.customThemes = customThemes;
