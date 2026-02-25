// Music Journaling - Document your music experiences
class MusicJournal {
    constructor() {
        this.entries = this.loadEntries();
        this.init();
    }

    init() {
        this.injectStyles();
        this.createJournal();
        this.attachEventListeners();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .music-journal-btn {
                position: fixed;
                top: 340px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #a8edea, #fed6e3);
                border: none;
                color: #333;
                font-size: 22px;
                cursor: pointer;
                box-shadow: 0 6px 20px rgba(168, 237, 234, 0.4);
                transition: all 0.3s ease;
                z-index: 1000;
            }

            .music-journal-btn:hover {
                transform: scale(1.1);
            }

            .music-journal-panel {
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                width: 450px;
                max-height: 85vh;
                background: linear-gradient(135deg, rgba(168, 237, 234, 0.98), rgba(254, 214, 227, 0.98));
                backdrop-filter: blur(20px);
                border-radius: 24px;
                padding: 28px;
                box-shadow: 0 16px 56px rgba(0, 0, 0, 0.5);
                z-index: 985;
                overflow-y: auto;
                border: 1px solid rgba(255, 255, 255, 0.3);
                display: none;
            }

            .music-journal-panel.active {
                display: block;
            }

            .music-journal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                color: #333;
            }

            .music-journal-title {
                font-size: 24px;
                font-weight: 700;
            }

            .music-journal-close {
                background: rgba(255, 255, 255, 0.4);
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                color: #333;
                cursor: pointer;
            }

            .music-journal-form {
                background: rgba(255, 255, 255, 0.3);
                border-radius: 16px;
                padding: 20px;
                margin-bottom: 20px;
            }

            .music-journal-input {
                width: 100%;
                padding: 12px;
                background: rgba(255, 255, 255, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.6);
                border-radius: 10px;
                color: #333;
                margin-bottom: 12px;
                font-size: 14px;
            }

            .music-journal-textarea {
                width: 100%;
                padding: 12px;
                background: rgba(255, 255, 255, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.6);
                border-radius: 10px;
                color: #333;
                min-height: 100px;
                resize: vertical;
                font-size: 14px;
                font-family: inherit;
            }

            .music-journal-save-btn {
                width: 100%;
                padding: 12px;
                background: rgba(102, 126, 234, 0.8);
                border: none;
                border-radius: 10px;
                color: white;
                font-weight: 600;
                cursor: pointer;
            }

            .music-journal-entries {
                margin-top: 20px;
            }

            .music-journal-entry {
                background: rgba(255, 255, 255, 0.3);
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 12px;
            }

            .music-journal-entry-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
            }

            .music-journal-entry-song {
                font-weight: 700;
                color: #333;
            }

            .music-journal-entry-date {
                font-size: 12px;
                color: #666;
            }

            .music-journal-entry-text {
                color: #444;
                line-height: 1.6;
                font-size: 14px;
            }

            @media (max-width: 768px) {
                .music-journal-panel {
                    width: 95%;
                    right: 2.5%;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createJournal() {
        const btn = document.createElement('button');
        btn.className = 'music-journal-btn';
        btn.innerHTML = '<i class="fas fa-book"></i>';
        btn.title = 'Music Journal';
        document.body.appendChild(btn);

        const panel = document.createElement('div');
        panel.className = 'music-journal-panel';
        panel.innerHTML = `
            <div class="music-journal-header">
                <div class="music-journal-title">📖 My Music Journal</div>
                <button class="music-journal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="music-journal-form">
                <input type="text" class="music-journal-input" id="journalSong" placeholder="Song/Artist">
                <textarea class="music-journal-textarea" id="journalText" placeholder="How does this music make you feel? What memories does it bring?"></textarea>
                <button class="music-journal-save-btn" id="journalSave">Save Entry</button>
            </div>
            <div class="music-journal-entries" id="journalEntries"></div>
        `;
        document.body.appendChild(panel);

        this.btn = btn;
        this.panel = panel;
        this.renderEntries();
    }

    attachEventListeners() {
        this.btn.addEventListener('click', () => {
            this.panel.classList.toggle('active');
        });

        this.panel.querySelector('.music-journal-close').addEventListener('click', () => {
            this.panel.classList.remove('active');
        });

        this.panel.querySelector('#journalSave').addEventListener('click', () => {
            this.saveEntry();
        });
    }

    saveEntry() {
        const song = this.panel.querySelector('#journalSong').value;
        const text = this.panel.querySelector('#journalText').value;

        if (!song || !text) {
            alert('Please fill in both fields');
            return;
        }

        const entry = {
            id: Date.now(),
            song,
            text,
            date: new Date().toLocaleDateString()
        };

        this.entries.unshift(entry);
        localStorage.setItem('musicJournalEntries', JSON.stringify(this.entries));
        
        this.panel.querySelector('#journalSong').value = '';
        this.panel.querySelector('#journalText').value = '';
        this.renderEntries();
    }

    loadEntries() {
        const saved = localStorage.getItem('musicJournalEntries');
        return saved ? JSON.parse(saved) : [];
    }

    renderEntries() {
        const container = this.panel.querySelector('#journalEntries');
        container.innerHTML = '';

        this.entries.forEach(entry => {
            const entryEl = document.createElement('div');
            entryEl.className = 'music-journal-entry';
            entryEl.innerHTML = `
                <div class="music-journal-entry-header">
                    <div class="music-journal-entry-song">${entry.song}</div>
                    <div class="music-journal-entry-date">${entry.date}</div>
                </div>
                <div class="music-journal-entry-text">${entry.text}</div>
            `;
            container.appendChild(entryEl);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MusicJournal();
});
