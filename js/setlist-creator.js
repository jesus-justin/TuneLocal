// Setlist Creator - Build and manage performance setlists
class SetlistCreator {
    constructor() {
        this.setlists = this.loadSetlists();
        this.currentSetlist = [];
        this.init();
    }

    init() {
        this.injectStyles();
        this.createPanel();
        this.attachEventListeners();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .setlist-creator-btn {
                position: fixed;
                bottom: 90px;
                left: 20px;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: linear-gradient(135deg, #8e44ad, #c39bd3);
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 6px 24px rgba(142, 68, 173, 0.4);
                transition: all 0.3s ease;
                z-index: 1000;
            }

            .setlist-creator-btn:hover {
                transform: translateY(-4px);
            }

            .setlist-creator-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 700px;
                max-height: 85vh;
                background: linear-gradient(135deg, rgba(142, 68, 173, 0.98), rgba(195, 155, 211, 0.98));
                backdrop-filter: blur(20px);
                border-radius: 24px;
                padding: 28px;
                box-shadow: 0 16px 56px rgba(0, 0, 0, 0.5);
                z-index: 985;
                overflow-y: auto;
                border: 1px solid rgba(255, 255, 255, 0.2);
                display: none;
            }

            .setlist-creator-panel.active {
                display: block;
            }

            .setlist-creator-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                color: white;
            }

            .setlist-creator-title {
                font-size: 26px;
                font-weight: 700;
            }

            .setlist-creator-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                color: white;
                cursor: pointer;
            }

            .setlist-creator-input-group {
                display: flex;
                gap: 12px;
                margin-bottom: 20px;
            }

            .setlist-creator-input {
                flex: 1;
                padding: 14px;
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 12px;
                color: white;
                font-size: 15px;
            }

            .setlist-creator-input::placeholder {
                color: rgba(255, 255, 255, 0.6);
            }

            .setlist-creator-add-btn {
                padding: 14px 24px;
                background: rgba(255, 255, 255, 0.3);
                border: none;
                border-radius: 12px;
                color: white;
                font-weight: 600;
                cursor: pointer;
            }

            .setlist-creator-list {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 16px;
                padding: 20px;
                margin-bottom: 20px;
                min-height: 200px;
            }

            .setlist-creator-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                margin-bottom: 8px;
                color: white;
            }

            .setlist-creator-number {
                font-weight: 700;
                font-size: 18px;
                width: 30px;
            }

            .setlist-creator-song-info {
                flex: 1;
            }

            .setlist-creator-song-name {
                font-weight: 600;
            }

            .setlist-creator-delete {
                background: rgba(255, 59, 48, 0.6);
                border: none;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                color: white;
                cursor: pointer;
            }

            .setlist-creator-actions {
                display: flex;
                gap: 12px;
            }

            .setlist-creator-action-btn {
                flex: 1;
                padding: 14px;
                background: rgba(255, 255, 255, 0.3);
                border: none;
                border-radius: 12px;
                color: white;
                font-weight: 600;
                cursor: pointer;
            }

            .setlist-creator-stats {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 20px;
                display: flex;
                justify-content: space-around;
                color: white;
            }

            .setlist-creator-stat {
                text-align: center;
            }

            .setlist-creator-stat-value {
                font-size: 24px;
                font-weight: 700;
            }

            .setlist-creator-stat-label {
                font-size: 12px;
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);
    }

    createPanel() {
        const btn = document.createElement('button');
        btn.className = 'setlist-creator-btn';
        btn.innerHTML = '<i class="fas fa-list-music"></i>';
        btn.title = 'Setlist Creator';
        document.body.appendChild(btn);

        const panel = document.createElement('div');
        panel.className = 'setlist-creator-panel';
        panel.innerHTML = `
            <div class="setlist-creator-header">
                <div class="setlist-creator-title">🎸 Setlist Creator</div>
                <button class="setlist-creator-close"><i class="fas fa-times"></i></button>
            </div>

            <div class="setlist-creator-stats">
                <div class="setlist-creator-stat">
                    <div class="setlist-creator-stat-value" id="setlistCount">0</div>
                    <div class="setlist-creator-stat-label">Songs</div>
                </div>
                <div class="setlist-creator-stat">
                    <div class="setlist-creator-stat-value" id="setlistDuration">0:00</div>
                    <div class="setlist-creator-stat-label">Duration</div>
                </div>
            </div>

            <div class="setlist-creator-input-group">
                <input type="text" class="setlist-creator-input" id="setlistSongInput" placeholder="Song - Artist">
                <button class="setlist-creator-add-btn" id="setlistAddBtn">
                    <i class="fas fa-plus"></i> Add
                </button>
            </div>

            <div class="setlist-creator-list" id="setlistSongs"></div>

            <div class="setlist-creator-actions">
                <button class="setlist-creator-action-btn" id="setlistSave">
                    <i class="fas fa-save"></i> Save Setlist
                </button>
                <button class="setlist-creator-action-btn" id="setlistClear">
                    <i class="fas fa-trash"></i> Clear All
                </button>
                <button class="setlist-creator-action-btn" id="setlistExport">
                    <i class="fas fa-download"></i> Export
                </button>
            </div>
        `;
        document.body.appendChild(panel);

        this.btn = btn;
        this.panel = panel;
        this.renderSetlist();
    }

    attachEventListeners() {
        this.btn.addEventListener('click', () => {
            this.panel.classList.toggle('active');
        });

        this.panel.querySelector('.setlist-creator-close').addEventListener('click', () => {
            this.panel.classList.remove('active');
        });

        this.panel.querySelector('#setlistAddBtn').addEventListener('click', () => {
            this.addSong();
        });

        this.panel.querySelector('#setlistSongInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addSong();
        });

        this.panel.querySelector('#setlistClear').addEventListener('click', () => {
            if (confirm('Clear entire setlist?')) {
                this.currentSetlist = [];
                this.renderSetlist();
            }
        });

        this.panel.querySelector('#setlistSave').addEventListener('click', () => {
            this.saveSetlist();
        });

        this.panel.querySelector('#setlistExport').addEventListener('click', () => {
            this.exportSetlist();
        });
    }

    addSong() {
        const input = this.panel.querySelector('#setlistSongInput');
        const song = input.value.trim();

        if (!song) return;

        this.currentSetlist.push({
            id: Date.now(),
            name: song,
            duration: Math.floor(Math.random() * 5) + 2 // 2-7 minutes
        });

        input.value = '';
        this.renderSetlist();
    }

    renderSetlist() {
        const container = this.panel.querySelector('#setlistSongs');
        container.innerHTML = '';

        if (this.currentSetlist.length === 0) {
            container.innerHTML = '<div style="text-align:center;color:white;padding:20px;opacity:0.6">No songs added yet. Add songs to build your setlist!</div>';
        } else {
            this.currentSetlist.forEach((song, index) => {
                const item = document.createElement('div');
                item.className = 'setlist-creator-item';
                item.innerHTML = `
                    <div class="setlist-creator-number">${index + 1}</div>
                    <div class="setlist-creator-song-info">
                        <div class="setlist-creator-song-name">${song.name}</div>
                    </div>
                    <button class="setlist-creator-delete" data-id="${song.id}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                container.appendChild(item);

                item.querySelector('.setlist-creator-delete').addEventListener('click', () => {
                    this.removeSong(song.id);
                });
            });
        }

        // Update stats
        const totalDuration = this.currentSetlist.reduce((sum, song) => sum + song.duration, 0);
        this.panel.querySelector('#setlistCount').textContent = this.currentSetlist.length;
        this.panel.querySelector('#setlistDuration').textContent = 
            `${Math.floor(totalDuration / 60)}:${String(totalDuration % 60).padStart(2, '0')}`;
    }

    removeSong(id) {
        this.currentSetlist = this.currentSetlist.filter(s => s.id !== id);
        this.renderSetlist();
    }

    saveSetlist() {
        if (this.currentSetlist.length === 0) {
            alert('Add songs before saving!');
            return;
        }

        const name = prompt('Setlist name:');
        if (!name) return;

        this.setlists.push({
            name,
            songs: [...this.currentSetlist],
            date: new Date().toLocaleDateString()
        });

        localStorage.setItem('performanceSetlists', JSON.stringify(this.setlists));
        alert('Setlist saved!');
    }

    loadSetlists() {
        const saved = localStorage.getItem('performanceSetlists');
        return saved ? JSON.parse(saved) : [];
    }

    exportSetlist() {
        const text = this.currentSetlist.map((song, i) => `${i + 1}. ${song.name}`).join('\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'setlist.txt';
        a.click();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SetlistCreator();
});
