// Lyrics Enhancement System
class LyricsEnhancer {
    constructor() {
        this.lyricsCache = JSON.parse(localStorage.getItem('lyricsCache')) || {};
        this.syncedLyrics = JSON.parse(localStorage.getItem('syncedLyrics')) || {};
        this.init();
    }

    init() {
        this.setupLyricsUI();
        this.setupEventListeners();
    }

    setupLyricsUI() {
        const panel = document.createElement('div');
        panel.id = 'lyricsEnhancerPanel';
        panel.className = 'lyrics-enhancer-panel';
        panel.innerHTML = `
            <div class="lyrics-header">
                <h3>Lyrics Display</h3>
                <div class="lyrics-controls">
                    <button id="toggleSync" title="Toggle sync">🔄 Sync</button>
                    <button id="toggleTranslate" title="Translate">🌐 Translate</button>
                    <button id="toggleRomaji" title="Romanize">ローマ字</button>
                </div>
            </div>
            <div id="lyricsContent" class="lyrics-content"></div>
        `;

        const existing = document.getElementById('lyricsEnhancerPanel');
        if (existing) existing.remove();
        document.body.appendChild(panel);
    }

    setupEventListeners() {
        document.getElementById('toggleSync')?.addEventListener('click', () => this.toggleSync());
        document.getElementById('toggleTranslate')?.addEventListener('click', () => this.toggleTranslate());
        document.getElementById('toggleRomaji')?.addEventListener('click', () => this.toggleRomaji());
    }

    displayLyrics(track, currentTime = 0) {
        const key = `${track.title}-${track.artist}`;
        const lyrics = this.lyricsCache[key] || this.generateMockLyrics(track);

        const content = document.getElementById('lyricsContent');
        if (!content) return;

        content.innerHTML = '';
        const lines = lyrics.split('\n');

        lines.forEach((line, idx) => {
            const lineEl = document.createElement('p');
            lineEl.className = 'lyric-line';
            lineEl.textContent = line;
            lineEl.setAttribute('data-line-index', idx);
            content.appendChild(lineEl);
        });

        this.scrollToCurrentLine(currentTime, lyrics);
    }

    scrollToCurrentLine(currentTime, lyrics) {
        const synced = this.syncedLyrics[`${currentTime}`];
        if (synced) {
            const lines = document.querySelectorAll('.lyric-line');
            lines.forEach(line => line.classList.remove('active'));
            if (lines[synced]) {
                lines[synced].classList.add('active');
                lines[synced].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    generateMockLyrics(track) {
        return `♪ ${track.title} by ${track.artist}
[Verse 1]
Beautiful melodies flow through the night,
Music touches our souls with delight.

[Chorus]
Singing together, we feel alive,
Music brings joy to our lives.

[Verse 2]
Every note tells a story untold,
Melodies worth more than gold.

[Bridge]
Let the music take control,
Feel it deep within your soul.

[Outro]
Music is the universal language,
That brings us all together.`;
    }

    toggleSync() {
        const content = document.getElementById('lyricsContent');
        content?.classList.toggle('sync-enabled');
        showNotification('Lyric sync ' + (content?.classList.contains('sync-enabled') ? 'enabled' : 'disabled'), 'info');
    }

    toggleTranslate() {
        const content = document.getElementById('lyricsContent');
        content?.classList.toggle('translated');
        showNotification('Translation ' + (content?.classList.contains('translated') ? 'enabled' : 'disabled'), 'info');
    }

    toggleRomaji() {
        const content = document.getElementById('lyricsContent');
        content?.classList.toggle('romaji-enabled');
        showNotification('Romaji ' + (content?.classList.contains('romaji-enabled') ? 'enabled' : 'disabled'), 'info');
    }

    saveLyrics(track, lyricsText) {
        const key = `${track.title}-${track.artist}`;
        this.lyricsCache[key] = lyricsText;
        localStorage.setItem('lyricsCache', JSON.stringify(this.lyricsCache));
        showNotification('Lyrics saved', 'success');
    }

    saveSyncedLyrics(timestamps) {
        this.syncedLyrics = timestamps;
        localStorage.setItem('syncedLyrics', JSON.stringify(this.syncedLyrics));
        showNotification('Synced lyrics saved', 'success');
    }
}

const lyricsEnhancer = new LyricsEnhancer();
window.lyricsEnhancer = lyricsEnhancer;
