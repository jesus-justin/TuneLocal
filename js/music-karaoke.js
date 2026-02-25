// Music Karaoke Mode - Display lyrics with vocal reduction
class MusicKaraoke {
    constructor() {
        this.isKaraokeMode = false;
        this.currentLyrics = [];
        this.currentLine = 0;
        this.init();
    }

    init() {
        this.injectStyles();
        this.createKaraokePanel();
        this.attachEventListeners();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .karaoke-toggle-btn {
                position: fixed;
                top: 220px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #fa709a, #fee140);
                border: none;
                color: white;
                font-size: 22px;
                cursor: pointer;
                box-shadow: 0 6px 20px rgba(250, 112, 154, 0.4);
                transition: all 0.3s ease;
                z-index: 1000;
            }

            .karaoke-toggle-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 8px 28px rgba(250, 112, 154, 0.6);
            }

            .karaoke-panel {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                height: 0;
                background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.95));
                transition: all 0.4s ease;
                z-index: 950;
                overflow: hidden;
            }

            .karaoke-panel.active {
                height: 300px;
            }

            .karaoke-lyrics-container {
                position: absolute;
                bottom: 80px;
                left: 50%;
                transform: translateX(-50%);
                width: 90%;
                max-width: 800px;
                text-align: center;
            }

            .karaoke-line {
                font-size: 42px;
                font-weight: 700;
                color: rgba(255, 255, 255, 0.4);
                margin: 16px 0;
                transition: all 0.5s ease;
                text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
            }

            .karaoke-line.current {
                color: white;
                font-size: 52px;
                text-shadow: 0 0 20px rgba(250, 112, 154, 0.8);
                animation: karaokeGlow 1s ease-in-out infinite;
            }

            .karaoke-line.past {
                color: rgba(255, 255, 255, 0.2);
                font-size: 32px;
            }

            @keyframes karaokeGlow {
                0%, 100% { text-shadow: 0 0 20px rgba(250, 112, 154, 0.8); }
                50% { text-shadow: 0 0 40px rgba(250, 112, 154, 1); }
            }

            .karaoke-controls {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 12px;
                background: rgba(255, 255, 255, 0.1);
                padding: 12px 24px;
                border-radius: 30px;
                backdrop-filter: blur(10px);
            }

            .karaoke-control-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                font-size: 18px;
                transition: all 0.2s ease;
            }

            .karaoke-control-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            .karaoke-progress {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
            }

            .karaoke-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #fa709a, #fee140);
                width: 0%;
                transition: width 0.3s linear;
            }

            @media (max-width: 768px) {
                .karaoke-line {
                    font-size: 28px;
                }
                .karaoke-line.current {
                    font-size: 36px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createKaraokePanel() {
        const btn = document.createElement('button');
        btn.className = 'karaoke-toggle-btn';
        btn.innerHTML = '<i class="fas fa-microphone"></i>';
        btn.title = 'Karaoke Mode';
        document.body.appendChild(btn);

        const panel = document.createElement('div');
        panel.className = 'karaoke-panel';
        panel.innerHTML = `
            <div class="karaoke-progress">
                <div class="karaoke-progress-bar" id="karaokeProgress"></div>
            </div>
            <div class="karaoke-lyrics-container" id="karaokeLyrics"></div>
            <div class="karaoke-controls">
                <button class="karaoke-control-btn" id="karaokePrev" title="Previous Line">
                    <i class="fas fa-backward"></i>
                </button>
                <button class="karaoke-control-btn" id="karaokePlay" title="Auto Scroll">
                    <i class="fas fa-play"></i>
                </button>
                <button class="karaoke-control-btn" id="karaokeNext" title="Next Line">
                    <i class="fas fa-forward"></i>
                </button>
                <button class="karaoke-control-btn" id="karaokeVocal" title="Reduce Vocals">
                    <i class="fas fa-volume-mute"></i>
                </button>
            </div>
        `;
        document.body.appendChild(panel);

        this.btn = btn;
        this.panel = panel;
        this.loadSampleLyrics();
    }

    attachEventListeners() {
        this.btn.addEventListener('click', () => {
            this.isKaraokeMode = !this.isKaraokeMode;
            this.panel.classList.toggle('active');
        });

        this.panel.querySelector('#karaokePrev').addEventListener('click', () => {
            this.previousLine();
        });

        this.panel.querySelector('#karaokeNext').addEventListener('click', () => {
            this.nextLine();
        });

        this.panel.querySelector('#karaokePlay').addEventListener('click', (e) => {
            this.toggleAutoScroll(e.target);
        });

        this.panel.querySelector('#karaokeVocal').addEventListener('click', (e) => {
            this.toggleVocalReduction(e.target);
        });
    }

    loadSampleLyrics() {
        this.currentLyrics = [
            "I'm walking on sunshine, oh yeah",
            "And don't it feel good",
            "I'm walking on sunshine",
            "I'm walking on sunshine, oh yeah",
            "And don't it feel good",
            "Hey, all right now",
            "And don't it feel good"
        ];
        this.renderLyrics();
    }

    renderLyrics() {
        const container = this.panel.querySelector('#karaokeLyrics');
        container.innerHTML = '';

        const start = Math.max(0, this.currentLine - 1);
        const end = Math.min(this.currentLyrics.length, this.currentLine + 2);

        for (let i = start; i < end; i++) {
            const line = document.createElement('div');
            line.className = 'karaoke-line';
            
            if (i < this.currentLine) line.classList.add('past');
            if (i === this.currentLine) line.classList.add('current');
            
            line.textContent = this.currentLyrics[i];
            container.appendChild(line);
        }

        // Update progress
        const progress = (this.currentLine / this.currentLyrics.length) * 100;
        this.panel.querySelector('#karaokeProgress').style.width = progress + '%';
    }

    nextLine() {
        if (this.currentLine < this.currentLyrics.length - 1) {
            this.currentLine++;
            this.renderLyrics();
        }
    }

    previousLine() {
        if (this.currentLine > 0) {
            this.currentLine--;
            this.renderLyrics();
        }
    }

    toggleAutoScroll(btn) {
        const icon = btn.querySelector('i');
        if (icon.classList.contains('fa-play')) {
            icon.className = 'fas fa-pause';
            this.startAutoScroll();
        } else {
            icon.className = 'fas fa-play';
            this.stopAutoScroll();
        }
    }

    startAutoScroll() {
        this.autoScrollInterval = setInterval(() => {
            this.nextLine();
            if (this.currentLine >= this.currentLyrics.length - 1) {
                this.stopAutoScroll();
            }
        }, 3000);
    }

    stopAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
        }
    }

    toggleVocalReduction(btn) {
        const icon = btn.querySelector('i');
        if (icon.classList.contains('fa-volume-mute')) {
            icon.className = 'fas fa-volume-up';
            btn.style.background = 'rgba(56, 239, 125, 0.6)';
        } else {
            icon.className = 'fas fa-volume-mute';
            btn.style.background = 'rgba(255, 255, 255, 0.2)';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MusicKaraoke();
});
