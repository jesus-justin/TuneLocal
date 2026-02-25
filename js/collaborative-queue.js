// Collaborative Queue - Shared music queue with voting and suggestions
class CollaborativeQueue {
    constructor() {
        this.queue = [];
        this.suggestions = [];
        this.votes = {};
        this.userName = this.loadUserName();
        this.init();
    }

    init() {
        this.injectStyles();
        this.createPanel();
        this.attachEventListeners();
        this.loadQueue();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .collab-queue-btn {
                position: fixed;
                top: 580px;
                right: 20px;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: linear-gradient(135deg, #4facfe, #00f2fe);
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 6px 24px rgba(79, 172, 254, 0.4);
                transition: all 0.3s ease;
                z-index: 1000;
            }

            .collab-queue-btn:hover {
                transform: translateY(-4px);
            }

            .collab-queue-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 700px;
                max-height: 90vh;
                overflow-y: auto;
                background: linear-gradient(135deg, rgba(79, 172, 254, 0.98), rgba(0, 242, 254, 0.98));
                backdrop-filter: blur(20px);
                border-radius: 24px;
                padding: 32px;
                box-shadow: 0 16px 56px rgba(0, 0, 0, 0.5);
                z-index: 975;
                border: 1px solid rgba(255, 255, 255, 0.2);
                display: none;
            }

            .collab-queue-panel.active {
                display: block;
            }

            .collab-queue-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                color: white;
            }

            .collab-queue-title {
                font-size: 24px;
                font-weight: 700;
            }

            .collab-queue-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                color: white;
                cursor: pointer;
            }

            .collab-queue-user {
                display: flex;
                gap: 8px;
                margin-bottom: 20px;
            }

            .collab-queue-user-input {
                flex: 1;
                padding: 10px 14px;
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 8px;
                color: white;
                font-size: 14px;
            }

            .collab-queue-user-input::placeholder {
                color: rgba(255, 255, 255, 0.6);
            }

            .collab-queue-user-btn {
                padding: 10px 16px;
                background: rgba(255, 255, 255, 0.3);
                border: none;
                border-radius: 8px;
                color: white;
                cursor: pointer;
                font-weight: 600;
            }

            .collab-queue-tabs {
                display: flex;
                gap: 8px;
                margin-bottom: 20px;
            }

            .collab-queue-tab {
                flex: 1;
                padding: 12px;
                background: rgba(255, 255, 255, 0.15);
                border: none;
                border-radius: 8px;
                color: white;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s ease;
            }

            .collab-queue-tab.active {
                background: rgba(255, 255, 255, 0.4);
            }

            .collab-queue-section {
                display: none;
            }

            .collab-queue-section.active {
                display: block;
            }

            .collab-queue-list {
                max-height: 350px;
                overflow-y: auto;
                margin-bottom: 20px;
            }

            .collab-queue-item {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 12px;
                padding: 14px;
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .collab-queue-item-content {
                flex: 1;
            }

            .collab-queue-item-song {
                font-weight: 600;
                color: white;
                font-size: 15px;
                margin-bottom: 4px;
            }

            .collab-queue-item-artist {
                font-size: 13px;
                color: rgba(255, 255, 255, 0.8);
            }

            .collab-queue-item-user {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.6);
                margin-top: 4px;
            }

            .collab-queue-item-actions {
                display: flex;
                gap: 8px;
            }

            .collab-queue-vote-btn {
                padding: 6px 10px;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                border-radius: 6px;
                color: white;
                cursor: pointer;
                font-weight: 600;
                font-size: 12px;
                transition: all 0.2s ease;
            }

            .collab-queue-vote-btn:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            .collab-queue-vote-btn.voted {
                background: rgba(255, 255, 255, 0.5);
            }

            .collab-queue-remove-btn {
                padding: 6px 10px;
                background: rgba(255, 59, 48, 0.4);
                border: none;
                border-radius: 6px;
                color: white;
                cursor: pointer;
                font-size: 12px;
            }

            .collab-queue-add-form {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 20px;
            }

            .collab-queue-add-input {
                width: 100%;
                padding: 12px;
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 8px;
                color: white;
                font-size: 14px;
                margin-bottom: 12px;
            }

            .collab-queue-add-input::placeholder {
                color: rgba(255, 255, 255, 0.6);
            }

            .collab-queue-add-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-bottom: 12px;
            }

            .collab-queue-add-btn {
                width: 100%;
                padding: 12px;
                background: rgba(255, 255, 255, 0.3);
                border: none;
                border-radius: 8px;
                color: white;
                cursor: pointer;
                font-weight: 600;
            }

            .collab-queue-empty {
                text-align: center;
                padding: 40px 20px;
                color: rgba(255, 255, 255, 0.7);
                font-size: 15px;
            }

            @media (max-width: 768px) {
                .collab-queue-btn {
                    top: auto;
                    bottom: 160px;
                }

                .collab-queue-panel {
                    max-width: 95%;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createPanel() {
        const btn = document.createElement('button');
        btn.className = 'collab-queue-btn';
        btn.innerHTML = '<i class="fas fa-users"></i>';
        btn.title = 'Collaborative Queue';
        document.body.appendChild(btn);

        const panel = document.createElement('div');
        panel.className = 'collab-queue-panel';
        panel.innerHTML = `
            <div class="collab-queue-header">
                <div class="collab-queue-title">👥 Collab Queue</div>
                <button class="collab-queue-close"><i class="fas fa-times"></i></button>
            </div>

            <div class="collab-queue-user">
                <input type="text" class="collab-queue-user-input" id="collabUserName" placeholder="Your name">
                <button class="collab-queue-user-btn" id="collabSetName">Set</button>
            </div>

            <div class="collab-queue-tabs">
                <button class="collab-queue-tab active" data-tab="queue">
                    <i class="fas fa-list"></i> Queue
                </button>
                <button class="collab-queue-tab" data-tab="suggest">
                    <i class="fas fa-plus"></i> Suggest
                </button>
                <button class="collab-queue-tab" data-tab="participants">
                    <i class="fas fa-users"></i> Participants
                </button>
            </div>

            <div class="collab-queue-section active" id="queueSection">
                <div class="collab-queue-list" id="queueList"></div>
            </div>

            <div class="collab-queue-section" id="suggestSection">
                <div class="collab-queue-add-form">
                    <input type="text" class="collab-queue-add-input" id="suggestSong" placeholder="Song name">
                    <input type="text" class="collab-queue-add-input" id="suggestArtist" placeholder="Artist name">
                    <div class="collab-queue-add-row">
                        <input type="text" class="collab-queue-add-input" id="suggestGenre" placeholder="Genre">
                        <input type="number" class="collab-queue-add-input" id="suggestDuration" placeholder="Duration (min)" step="0.1">
                    </div>
                    <button class="collab-queue-add-btn" id="suggestAddBtn">
                        <i class="fas fa-plus"></i> Add Suggestion
                    </button>
                </div>
                <div class="collab-queue-list" id="suggestionsList"></div>
            </div>

            <div class="collab-queue-section" id="participantsSection">
                <div id="participantsList"></div>
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

        this.panel.querySelector('.collab-queue-close').addEventListener('click', () => {
            this.panel.classList.remove('active');
        });

        // Tabs
        this.panel.querySelectorAll('.collab-queue-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.panel.querySelectorAll('.collab-queue-tab').forEach(t => t.classList.remove('active'));
                this.panel.querySelectorAll('.collab-queue-section').forEach(s => s.classList.remove('active'));
                
                e.target.closest('.collab-queue-tab').classList.add('active');
                const tabName = e.target.closest('.collab-queue-tab').dataset.tab;
                this.panel.querySelector(`#${tabName}Section`).classList.add('active');
            });
        });

        // User name
        this.panel.querySelector('#collabSetName').addEventListener('click', () => {
            const name = this.panel.querySelector('#collabUserName').value || 'Anonymous';
            this.userName = name;
            localStorage.setItem('collabUserName', name);
        });

        // Add suggestion
        this.panel.querySelector('#suggestAddBtn').addEventListener('click', () => {
            this.addSuggestion();
        });

        this.panel.querySelector('#collabUserName').value = this.userName;
    }

    addSuggestion() {
        const song = this.panel.querySelector('#suggestSong').value;
        const artist = this.panel.querySelector('#suggestArtist').value;
        const genre = this.panel.querySelector('#suggestGenre').value;
        const duration = this.panel.querySelector('#suggestDuration').value;

        if (!song || !artist) {
            alert('Please fill in song and artist');
            return;
        }

        const suggestion = {
            id: Date.now(),
            song, artist, genre, duration,
            user: this.userName,
            votes: 0,
            timestamp: new Date().toLocaleTimeString()
        };

        this.suggestions.push(suggestion);
        this.saveSuggestions();

        // Clear form
        this.panel.querySelector('#suggestSong').value = '';
        this.panel.querySelector('#suggestArtist').value = '';
        this.panel.querySelector('#suggestGenre').value = '';
        this.panel.querySelector('#suggestDuration').value = '';

        this.renderSuggestions();
    }

    saveSuggestions() {
        localStorage.setItem('collabQueueSuggestions', JSON.stringify(this.suggestions));
    }

    loadQueue() {
        // Sample initial queue
        this.queue = [
            { id: 1, song: "Blinding Lights", artist: "The Weeknd", user: "Alex", votes: 5 },
            { id: 2, song: "Shape of You", artist: "Ed Sheeran", user: "Jordan", votes: 3 },
            { id: 3, song: "Starboy", artist: "The Weeknd ft. Daft Punk", user: "Casey", votes: 7 }
        ];

        const saved = localStorage.getItem('collabQueueSuggestions');
        if (saved) {
            this.suggestions = JSON.parse(saved);
        }

        this.renderQueue();
    }

    renderQueue() {
        const queueList = this.panel.querySelector('#queueList');
        const sorted = [...this.queue].sort((a, b) => b.votes - a.votes);

        if (sorted.length === 0) {
            queueList.innerHTML = '<div class="collab-queue-empty">No songs in queue yet</div>';
            return;
        }

        queueList.innerHTML = sorted.map(item => `
            <div class="collab-queue-item">
                <div class="collab-queue-item-content">
                    <div class="collab-queue-item-song">${item.song}</div>
                    <div class="collab-queue-item-artist">${item.artist}</div>
                    <div class="collab-queue-item-user">Added by ${item.user}</div>
                </div>
                <div class="collab-queue-item-actions">
                    <button class="collab-queue-vote-btn ${this.votes[item.id] ? 'voted' : ''}" data-id="${item.id}">
                        👍 ${item.votes}
                    </button>
                </div>
            </div>
        `).join('');

        queueList.querySelectorAll('.collab-queue-vote-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const item = this.queue.find(q => q.id === id);
                if (item) {
                    if (this.votes[id]) {
                        item.votes--;
                        delete this.votes[id];
                    } else {
                        item.votes++;
                        this.votes[id] = true;
                    }
                    this.renderQueue();
                }
            });
        });
    }

    renderSuggestions() {
        const suggestionsList = this.panel.querySelector('#suggestionsList');
        
        if (this.suggestions.length === 0) {
            suggestionsList.innerHTML = '<div class="collab-queue-empty">No suggestions yet</div>';
            return;
        }

        const sorted = [...this.suggestions].sort((a, b) => b.votes - a.votes);

        suggestionsList.innerHTML = sorted.map(item => `
            <div class="collab-queue-item">
                <div class="collab-queue-item-content">
                    <div class="collab-queue-item-song">${item.song}</div>
                    <div class="collab-queue-item-artist">${item.artist}</div>
                    <div class="collab-queue-item-user">✨ ${item.genre} • ${item.duration} min • by ${item.user}</div>
                </div>
                <div class="collab-queue-item-actions">
                    <button class="collab-queue-vote-btn" data-suggest-id="${item.id}">
                        👍 ${item.votes}
                    </button>
                    <button class="collab-queue-vote-btn" data-promote-id="${item.id}">
                        ▶️ Queue
                    </button>
                </div>
            </div>
        `).join('');

        suggestionsList.querySelectorAll('[data-suggest-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.suggestionId);
                const item = this.suggestions.find(s => s.id === id);
                if (item) item.votes++;
                this.saveSuggestions();
                this.renderSuggestions();
            });
        });

        suggestionsList.querySelectorAll('[data-promote-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.promoteId);
                const item = this.suggestions.find(s => s.id === id);
                if (item) {
                    this.queue.push({
                        id: Date.now(),
                        song: item.song,
                        artist: item.artist,
                        user: item.user,
                        votes: item.votes
                    });
                    this.suggestions = this.suggestions.filter(s => s.id !== id);
                    this.saveSuggestions();
                    this.renderQueue();
                    this.renderSuggestions();
                }
            });
        });
    }

    loadUserName() {
        return localStorage.getItem('collabUserName') || 'Guest';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CollaborativeQueue();
});
