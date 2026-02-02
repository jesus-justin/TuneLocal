// Floating Music Notes Animation
class FloatingMusicNotes {
    constructor() {
        this.notes = ['♪', '♫', '♬', '♩', '♭', '♮', '♯'];
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createNotesContainer();
        this.startAnimation();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .music-notes-container { position: fixed; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; }
            .music-note { position: absolute; font-size: 24px; color: var(--primary-color); opacity: 0; animation: floatUp 6s ease-in-out infinite; user-select: none; }
            .music-note:nth-child(2n) { color: #4ade80; animation-duration: 7s; }
            .music-note:nth-child(3n) { color: #22c55e; animation-duration: 8s; }
            .music-note:nth-child(4n) { font-size: 28px; }
            .music-note:nth-child(5n) { font-size: 20px; }
            
            @keyframes floatUp {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 0.6;
                }
                50% {
                    opacity: 0.8;
                }
                90% {
                    opacity: 0.3;
                }
                100% {
                    transform: translateY(-100vh) rotate(360deg);
                    opacity: 0;
                }
            }
            
            @keyframes sway {
                0%, 100% {
                    transform: translateX(0);
                }
                50% {
                    transform: translateX(30px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    createNotesContainer() {
        const container = document.createElement('div');
        container.className = 'music-notes-container';
        container.id = 'musicNotesContainer';
        document.body.appendChild(container);
    }
    
    createNote() {
        const container = document.getElementById('musicNotesContainer');
        const note = document.createElement('div');
        note.className = 'music-note';
        note.textContent = this.notes[Math.floor(Math.random() * this.notes.length)];
        note.style.left = Math.random() * 100 + '%';
        note.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(note);
        
        setTimeout(() => {
            note.remove();
        }, 8000);
    }
    
    startAnimation() {
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.createNote();
            }
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FloatingMusicNotes();
});
