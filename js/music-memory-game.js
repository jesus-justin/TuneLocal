// Music Memory Game - Match artist names and album covers
class MusicMemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.timer = null;
        this.seconds = 0;
        this.init();
    }

    init() {
        this.injectStyles();
        this.createPanel();
        this.attachEventListeners();
        this.initializeGame();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .music-memory-btn {
                position: fixed;
                top: 520px;
                right: 20px;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: linear-gradient(135deg, #f093fb, #f5576c);
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 6px 24px rgba(240, 147, 251, 0.4);
                transition: all 0.3s ease;
                z-index: 1000;
            }

            .music-memory-btn:hover {
                transform: translateY(-4px);
            }

            .music-memory-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 650px;
                max-height: 90vh;
                overflow-y: auto;
                background: linear-gradient(135deg, rgba(240, 147, 251, 0.98), rgba(245, 87, 108, 0.98));
                backdrop-filter: blur(20px);
                border-radius: 24px;
                padding: 32px;
                box-shadow: 0 16px 56px rgba(0, 0, 0, 0.5);
                z-index: 980;
                border: 1px solid rgba(255, 255, 255, 0.2);
                display: none;
            }

            .music-memory-panel.active {
                display: block;
            }

            .music-memory-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                color: white;
            }

            .music-memory-title {
                font-size: 24px;
                font-weight: 700;
            }

            .music-memory-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                color: white;
                cursor: pointer;
            }

            .music-memory-stats {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 12px;
                margin-bottom: 24px;
            }

            .music-memory-stat {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                padding: 12px;
                text-align: center;
            }

            .music-memory-stat-label {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.8);
                text-transform: uppercase;
                margin-bottom: 4px;
            }

            .music-memory-stat-value {
                font-size: 24px;
                font-weight: 700;
                color: white;
            }

            .music-memory-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 12px;
                margin-bottom: 24px;
            }

            .memory-card {
                aspect-ratio: 1;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                cursor: pointer;
                position: relative;
                transform-style: preserve-3d;
                transition: transform 0.4s ease;
            }

            .memory-card.flipped {
                transform: rotateY(180deg);
            }

            .memory-card.matched {
                opacity: 0.6;
                cursor: default;
            }

            .memory-card-face {
                position: absolute;
                width: 100%;
                height: 100%;
                backface-visibility: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 12px;
                font-size: 14px;
                font-weight: 600;
                text-align: center;
                padding: 8px;
                color: white;
            }

            .memory-card-back {
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
                font-size: 32px;
            }

            .memory-card-front {
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
                color: #f5576c;
                transform: rotateY(180deg);
            }

            .music-memory-controls {
                display: flex;
                gap: 12px;
            }

            .music-memory-btn-control {
                flex: 1;
                padding: 14px;
                background: rgba(255, 255, 255, 0.3);
                border: none;
                border-radius: 12px;
                color: white;
                font-size: 15px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .music-memory-btn-control:hover {
                background: rgba(255, 255, 255, 0.4);
            }

            .music-memory-win {
                text-align: center;
                padding: 20px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 16px;
                margin-bottom: 20px;
                display: none;
            }

            .music-memory-win.active {
                display: block;
            }

            .music-memory-win-title {
                font-size: 32px;
                margin-bottom: 12px;
            }

            .music-memory-win-text {
                font-size: 18px;
                color: white;
                font-weight: 600;
            }

            @media (max-width: 768px) {
                .music-memory-btn {
                    top: auto;
                    bottom: 100px;
                }

                .music-memory-grid {
                    grid-template-columns: repeat(3, 1fr);
                }
            }
        `;
        document.head.appendChild(style);
    }

    createPanel() {
        const btn = document.createElement('button');
        btn.className = 'music-memory-btn';
        btn.innerHTML = '<i class="fas fa-brain"></i>';
        btn.title = 'Music Memory Game';
        document.body.appendChild(btn);

        const panel = document.createElement('div');
        panel.className = 'music-memory-panel';
        panel.innerHTML = `
            <div class="music-memory-header">
                <div class="music-memory-title">🧠 Memory Match</div>
                <button class="music-memory-close"><i class="fas fa-times"></i></button>
            </div>

            <div class="music-memory-stats">
                <div class="music-memory-stat">
                    <div class="music-memory-stat-label">Time</div>
                    <div class="music-memory-stat-value" id="memoryTimer">0:00</div>
                </div>
                <div class="music-memory-stat">
                    <div class="music-memory-stat-label">Moves</div>
                    <div class="music-memory-stat-value" id="memoryMoves">0</div>
                </div>
                <div class="music-memory-stat">
                    <div class="music-memory-stat-label">Pairs</div>
                    <div class="music-memory-stat-value" id="memoryPairs">0/8</div>
                </div>
            </div>

            <div class="music-memory-win" id="memoryWin">
                <div class="music-memory-win-title">🎉</div>
                <div class="music-memory-win-text">Congratulations! You won!</div>
            </div>

            <div class="music-memory-grid" id="memoryGrid"></div>

            <div class="music-memory-controls">
                <button class="music-memory-btn-control" id="memoryNewGame">
                    <i class="fas fa-redo"></i> New Game
                </button>
            </div>
        `;
        document.body.appendChild(panel);

        this.btn = btn;
        this.panel = panel;
    }

    attachEventListeners() {
        this.btn.addEventListener('click', () => {
            this.panel.classList.toggle('active');
        });

        this.panel.querySelector('.music-memory-close').addEventListener('click', () => {
            this.panel.classList.remove('active');
        });

        this.panel.querySelector('#memoryNewGame').addEventListener('click', () => {
            this.initializeGame();
        });
    }

    initializeGame() {
        this.matchedPairs = 0;
        this.moves = 0;
        this.seconds = 0;
        this.flippedCards = [];
        
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.seconds++;
            this.updateTimer();
        }, 1000);

        this.updateStats();
        this.panel.querySelector('#memoryWin').classList.remove('active');

        const artists = [
            'The Beatles', 'Queen', 'Led Zeppelin', 'Pink Floyd',
            'The Rolling Stones', 'Nirvana', 'Radiohead', 'Arctic Monkeys'
        ];

        // Create pairs
        this.cards = [...artists, ...artists].map((artist, index) => ({
            id: index,
            artist: artist,
            matched: false
        }));

        // Shuffle cards
        this.cards.sort(() => Math.random() - 0.5);

        this.renderCards();
    }

    renderCards() {
        const grid = this.panel.querySelector('#memoryGrid');
        grid.innerHTML = '';

        this.cards.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'memory-card';
            cardEl.dataset.index = index;
            cardEl.innerHTML = `
                <div class="memory-card-face memory-card-back">
                    <i class="fas fa-music"></i>
                </div>
                <div class="memory-card-face memory-card-front">
                    ${card.artist}
                </div>
            `;
            
            cardEl.addEventListener('click', () => this.flipCard(index));
            grid.appendChild(cardEl);
        });
    }

    flipCard(index) {
        if (this.flippedCards.length >= 2) return;
        if (this.cards[index].matched) return;
        if (this.flippedCards.includes(index)) return;

        const cardEl = this.panel.querySelectorAll('.memory-card')[index];
        cardEl.classList.add('flipped');
        this.flippedCards.push(index);

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateStats();
            setTimeout(() => this.checkMatch(), 800);
        }
    }

    checkMatch() {
        const [index1, index2] = this.flippedCards;
        const card1 = this.cards[index1];
        const card2 = this.cards[index2];

        if (card1.artist === card2.artist) {
            card1.matched = true;
            card2.matched = true;
            this.matchedPairs++;
            this.updateStats();

            const cardEls = this.panel.querySelectorAll('.memory-card');
            cardEls[index1].classList.add('matched');
            cardEls[index2].classList.add('matched');

            if (this.matchedPairs === 8) {
                this.gameWon();
            }
        } else {
            const cardEls = this.panel.querySelectorAll('.memory-card');
            cardEls[index1].classList.remove('flipped');
            cardEls[index2].classList.remove('flipped');
        }

        this.flippedCards = [];
    }

    updateStats() {
        this.panel.querySelector('#memoryMoves').textContent = this.moves;
        this.panel.querySelector('#memoryPairs').textContent = `${this.matchedPairs}/8`;
    }

    updateTimer() {
        const minutes = Math.floor(this.seconds / 60);
        const secs = this.seconds % 60;
        this.panel.querySelector('#memoryTimer').textContent = 
            `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    gameWon() {
        clearInterval(this.timer);
        this.panel.querySelector('#memoryWin').classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MusicMemoryGame();
});
