// Song Recommender AI - Smart music recommendations
class SongRecommenderAI {
    constructor() {
        this.preferences = this.loadPreferences();
        this.recommendations = [];
        this.init();
    }

    init() {
        this.injectStyles();
        this.createPanel();
        this.attachEventListeners();
        this.generateRecommendations();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .ai-recommender-btn {
                position: fixed;
                top: 460px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #30cfd0, #330867);
                border: none;
                color: white;
                font-size: 22px;
                cursor: pointer;
                box-shadow: 0 6px 20px rgba(48, 207, 208, 0.4);
                transition: all 0.3s ease;
                z-index: 1000;
            }

            .ai-recommender-btn:hover {
                transform: scale(1.1);
            }

            .ai-recommender-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 650px;
                max-height: 85vh;
                background: linear-gradient(135deg, rgba(48, 207, 208, 0.98), rgba(51, 8, 103, 0.98));
                backdrop-filter: blur(20px);
                border-radius: 24px;
                padding: 28px;
                box-shadow: 0 16px 56px rgba(0, 0, 0, 0.5);
                z-index: 985;
                overflow-y: auto;
                border: 1px solid rgba(255, 255, 255, 0.2);
                display: none;
            }

            .ai-recommender-panel.active {
                display: block;
            }

            .ai-recommender-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                color: white;
            }

            .ai-recommender-title {
                font-size: 24px;
                font-weight: 700;
            }

            .ai-recommender-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                color: white;
                cursor: pointer;
            }

            .ai-recommender-mood-selector {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-bottom: 20px;
            }

            .ai-recommender-mood-btn {
                padding: 10px 18px;
                background: rgba(255, 255, 255, 0.2);
                border: 2px solid transparent;
                border-radius: 20px;
                color: white;
                cursor: pointer;
                transition: all 0.2s ease;
                font-weight: 500;
            }

            .ai-recommender-mood-btn:hover,
            .ai-recommender-mood-btn.active {
                background: rgba(255, 255, 255, 0.3);
                border-color: rgba(255, 255, 255, 0.6);
                transform: scale(1.05);
            }

            .ai-recommender-recommendations {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 16px;
                padding: 20px;
            }

            .ai-recommender-section-title {
                font-size: 18px;
                font-weight: 700;
                color: white;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .ai-recommender-song-card {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.2s ease;
            }

            .ai-recommender-song-card:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateX(4px);
            }

            .ai-recommender-song-info {
                flex: 1;
            }

            .ai-recommender-song-name {
                font-size: 16px;
                font-weight: 600;
                color: white;
                margin-bottom: 4px;
            }

            .ai-recommender-song-artist {
                font-size: 13px;
                color: rgba(255, 255, 255, 0.8);
            }

            .ai-recommender-match {
                padding: 6px 12px;
                background: rgba(56, 239, 125, 0.6);
                border-radius: 16px;
                font-size: 12px;
                font-weight: 700;
                color: white;
            }

            .ai-recommender-actions {
                display: flex;
                gap: 8px;
            }

            .ai-recommender-action-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                font-size: 16px;
            }

            .ai-recommender-refresh-btn {
                width: 100%;
                padding: 14px;
                background: rgba(255, 255, 255, 0.3);
                border: none;
                border-radius: 12px;
                color: white;
                font-weight: 700;
                cursor: pointer;
                margin-top: 16px;
            }
        `;
        document.head.appendChild(style);
    }

    createPanel() {
        const btn = document.createElement('button');
        btn.className = 'ai-recommender-btn';
        btn.innerHTML = '<i class="fas fa-robot"></i>';
        btn.title = 'AI Recommender';
        document.body.appendChild(btn);

        const panel = document.createElement('div');
        panel.className = 'ai-recommender-panel';
        panel.innerHTML = `
            <div class="ai-recommender-header">
                <div class="ai-recommender-title">🤖 AI Song Recommender</div>
                <button class="ai-recommender-close"><i class="fas fa-times"></i></button>
            </div>

            <div class="ai-recommender-mood-selector">
                <button class="ai-recommender-mood-btn active" data-mood="happy">😊 Happy</button>
                <button class="ai-recommender-mood-btn" data-mood="energetic">⚡ Energetic</button>
                <button class="ai-recommender-mood-btn" data-mood="chill">😌 Chill</button>
                <button class="ai-recommender-mood-btn" data-mood="sad">😢 Sad</button>
                <button class="ai-recommender-mood-btn" data-mood="focus">🎯 Focus</button>
            </div>

            <div class="ai-recommender-recommendations">
                <div class="ai-recommender-section-title">
                    <i class="fas fa-sparkles"></i> Recommended for You
                </div>
                <div id="aiRecommendations"></div>
                <button class="ai-recommender-refresh-btn" id="aiRefresh">
                    <i class="fas fa-sync"></i> Get New Recommendations
                </button>
            </div>
        `;
        document.body.appendChild(panel);

        this.btn = btn;
        this.panel = panel;
        this.renderRecommendations();
    }

    attachEventListeners() {
        this.btn.addEventListener('click', () => {
            this.panel.classList.toggle('active');
        });

        this.panel.querySelector('.ai-recommender-close').addEventListener('click', () => {
            this.panel.classList.remove('active');
        });

        this.panel.querySelectorAll('.ai-recommender-mood-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.panel.querySelectorAll('.ai-recommender-mood-btn').forEach(b => 
                    b.classList.remove('active'));
                btn.classList.add('active');
                this.generateRecommendations(btn.dataset.mood);
            });
        });

        this.panel.querySelector('#aiRefresh').addEventListener('click', () => {
            const activeMood = this.panel.querySelector('.ai-recommender-mood-btn.active');
            this.generateRecommendations(activeMood?.dataset.mood || 'happy');
        });
    }

    generateRecommendations(mood = 'happy') {
        const songs = {
            happy: [
                { name: "Happy", artist: "Pharrell Williams", match: 95 },
                { name: "Good Vibrations", artist: "The Beach Boys", match: 92 },
                { name: "Walking on Sunshine", artist: "Katrina & The Waves", match: 90 },
                { name: "Don't Stop Me Now", artist: "Queen", match: 88 },
                { name: "I Gotta Feeling", artist: "Black Eyed Peas", match: 85 }
            ],
            energetic: [
                { name: "Eye of the Tiger", artist: "Survivor", match: 96 },
                { name: "Thunderstruck", artist: "AC/DC", match: 94 },
                { name: "Till I Collapse", artist: "Eminem", match: 91 },
                { name: "Lose Yourself", artist: "Eminem", match: 89 },
                { name: "Pump It", artist: "Black Eyed Peas", match: 87 }
            ],
            chill: [
                { name: "Weightless", artist: "Marconi Union", match: 98 },
                { name: "Sunset Lover", artist: "Petit Biscuit", match: 93 },
                { name: "Electric Feel", artist: "MGMT", match: 90 },
                { name: "Stay", artist: "Rihanna", match: 87 },
                { name: "Redbone", artist: "Childish Gambino", match: 85 }
            ],
            sad: [
                { name: "Someone Like You", artist: "Adele", match: 97 },
                { name: "Fix You", artist: "Coldplay", match: 94 },
                { name: "The Night We Met", artist: "Lord Huron", match: 91 },
                { name: "Hurt", artist: "Johnny Cash", match: 89 },
                { name: "Mad World", artist: "Gary Jules", match: 86 }
            ],
            focus: [
                { name: "Clair de Lune", artist: "Debussy", match: 96 },
                { name: "Comptine d'un autre été", artist: "Yann Tiersen", match: 93 },
                { name: "Time", artist: "Hans Zimmer", match: 90 },
                { name: "Nuvole Bianche", artist: "Ludovico Einaudi", match: 88 },
                { name: "River Flows in You", artist: "Yiruma", match: 85 }
            ]
        };

        this.recommendations = songs[mood] || songs.happy;
        this.renderRecommendations();
    }

    renderRecommendations() {
        const container = this.panel.querySelector('#aiRecommendations');
        container.innerHTML = '';

        this.recommendations.forEach(song => {
            const card = document.createElement('div');
            card.className = 'ai-recommender-song-card';
            card.innerHTML = `
                <div class="ai-recommender-song-info">
                    <div class="ai-recommender-song-name">${song.name}</div>
                    <div class="ai-recommender-song-artist">${song.artist}</div>
                </div>
                <div class="ai-recommender-match">${song.match}%</div>
                <div class="ai-recommender-actions">
                    <button class="ai-recommender-action-btn" title="Play">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="ai-recommender-action-btn" title="Add to Queue">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    loadPreferences() {
        const saved = localStorage.getItem('aiRecommenderPrefs');
        return saved ? JSON.parse(saved) : { mood: 'happy' };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SongRecommenderAI();
});
