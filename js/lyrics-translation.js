// Lyrics Translation Widget
class LyricsTranslation {
    constructor() {
        this.languages = [
            { code: 'en', name: 'English' },
            { code: 'es', name: 'Spanish' },
            { code: 'fr', name: 'French' },
            { code: 'de', name: 'German' },
            { code: 'it', name: 'Italian' },
            { code: 'pt', name: 'Portuguese' },
            { code: 'ja', name: 'Japanese' },
            { code: 'ko', name: 'Korean' },
            { code: 'zh', name: 'Chinese' },
            { code: 'ar', name: 'Arabic' }
        ];
        this.currentLang = 'en';
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
            .lyrics-translation-panel {
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                width: 380px;
                max-height: 80vh;
                background: linear-gradient(135deg, rgba(30, 30, 30, 0.98), rgba(50, 50, 50, 0.98));
                backdrop-filter: blur(20px);
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                z-index: 980;
                overflow: hidden;
                transition: all 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .lyrics-translation-panel.collapsed {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                cursor: pointer;
            }

            .lyrics-translation-header {
                padding: 16px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
            }

            .lyrics-translation-panel.collapsed .lyrics-translation-header {
                padding: 0;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                justify-content: center;
            }

            .lyrics-translation-panel.collapsed .lyrics-translation-content,
            .lyrics-translation-panel.collapsed .lyrics-translation-title {
                display: none;
            }

            .lyrics-translation-title {
                font-weight: 600;
                font-size: 16px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .lyrics-translation-controls {
                display: flex;
                gap: 8px;
            }

            .lyrics-translation-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .lyrics-translation-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            .lyrics-translation-content {
                padding: 16px;
                overflow-y: auto;
                max-height: calc(80vh - 170px);
            }

            .lyrics-translation-language-selector {
                display: flex;
                gap: 8px;
                margin-bottom: 16px;
                flex-wrap: wrap;
            }

            .lyrics-translation-lang-btn {
                padding: 6px 12px;
                background: rgba(102, 126, 234, 0.2);
                border: 1px solid rgba(102, 126, 234, 0.4);
                border-radius: 20px;
                color: white;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s ease;
            }

            .lyrics-translation-lang-btn:hover,
            .lyrics-translation-lang-btn.active {
                background: rgba(102, 126, 234, 0.6);
                border-color: rgba(102, 126, 234, 0.8);
                transform: scale(1.05);
            }

            .lyrics-translation-section {
                margin-bottom: 16px;
                padding: 12px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
            }

            .lyrics-translation-label {
                font-size: 11px;
                color: rgba(255, 255, 255, 0.6);
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .lyrics-translation-text {
                color: white;
                line-height: 1.8;
                font-size: 14px;
                white-space: pre-wrap;
            }

            .lyrics-translation-loading {
                text-align: center;
                padding: 20px;
                color: rgba(255, 255, 255, 0.6);
            }

            .lyrics-translation-spinner {
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-top: 2px solid #667eea;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                animation: spin 1s linear infinite;
                margin: 0 auto 10px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            @media (max-width: 768px) {
                .lyrics-translation-panel {
                    width: 320px;
                    right: 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createPanel() {
        const panel = document.createElement('div');
        panel.className = 'lyrics-translation-panel collapsed';
        panel.innerHTML = `
            <div class="lyrics-translation-header">
                <div class="lyrics-translation-title">
                    <i class="fas fa-language"></i>
                    <span>Lyrics Translation</span>
                </div>
                <div class="lyrics-translation-controls">
                    <button class="lyrics-translation-btn" id="lyricsTranslationToggle" title="Toggle">
                        <i class="fas fa-chevron-up"></i>
                    </button>
                </div>
            </div>
            <div class="lyrics-translation-content">
                <div class="lyrics-translation-language-selector"></div>
                <div class="lyrics-translation-section">
                    <div class="lyrics-translation-label">
                        <i class="fas fa-microphone"></i> Original Lyrics
                    </div>
                    <div class="lyrics-translation-text" id="originalLyrics">
                        No lyrics available. Play a song to see lyrics.
                    </div>
                </div>
                <div class="lyrics-translation-section">
                    <div class="lyrics-translation-label">
                        <i class="fas fa-globe"></i> Translated (<span id="targetLangName">English</span>)
                    </div>
                    <div class="lyrics-translation-text" id="translatedLyrics">
                        Translation will appear here...
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        this.panel = panel;
        this.createLanguageButtons();
    }

    createLanguageButtons() {
        const container = this.panel.querySelector('.lyrics-translation-language-selector');
        this.languages.forEach(lang => {
            const btn = document.createElement('button');
            btn.className = `lyrics-translation-lang-btn ${lang.code === 'en' ? 'active' : ''}`;
            btn.textContent = lang.name;
            btn.dataset.code = lang.code;
            btn.onclick = () => this.selectLanguage(lang.code);
            container.appendChild(btn);
        });
    }

    attachEventListeners() {
        const toggleBtn = this.panel.querySelector('#lyricsTranslationToggle');
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.panel.classList.toggle('collapsed');
            const icon = toggleBtn.querySelector('i');
            icon.className = this.panel.classList.contains('collapsed') ? 
                'fas fa-chevron-up' : 'fas fa-chevron-down';
        });

        // Make panel draggable
        this.makeDraggable();

        // Simulate lyrics update when playing
        this.simulateLyricsUpdate();
    }

    makeDraggable() {
        const header = this.panel.querySelector('.lyrics-translation-header');
        let isDragging = false;
        let currentX, currentY, initialX, initialY;

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.lyrics-translation-btn')) return;
            isDragging = true;
            initialX = e.clientX - this.panel.offsetLeft;
            initialY = e.clientY - this.panel.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            this.panel.style.left = currentX + 'px';
            this.panel.style.top = currentY + 'px';
            this.panel.style.right = 'auto';
            this.panel.style.transform = 'none';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    selectLanguage(langCode) {
        this.currentLang = langCode;
        const langName = this.languages.find(l => l.code === langCode)?.name || 'English';
        
        // Update active button
        this.panel.querySelectorAll('.lyrics-translation-lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.code === langCode);
        });

        // Update target language name
        this.panel.querySelector('#targetLangName').textContent = langName;

        // Translate lyrics
        this.translateLyrics();
    }

    async translateLyrics() {
        const translatedEl = this.panel.querySelector('#translatedLyrics');
        const originalText = this.panel.querySelector('#originalLyrics').textContent;

        if (originalText === 'No lyrics available. Play a song to see lyrics.') {
            translatedEl.textContent = 'No lyrics to translate.';
            return;
        }

        translatedEl.innerHTML = '<div class="lyrics-translation-loading"><div class="lyrics-translation-spinner"></div>Translating...</div>';

        // Simulate translation (in real app, use translation API)
        await new Promise(resolve => setTimeout(resolve, 1000));

        const sampleTranslations = {
            'es': 'Estoy caminando bajo el sol brillante\nSintiendo el ritmo de la música\nCada latido trae una nueva delicia\nBailando a través del día y la noche',
            'fr': 'Je marche sous le soleil éclatant\nSentant le rythme de la musique\nChaque battement apporte un nouveau plaisir\nDansant à travers le jour et la nuit',
            'de': 'Ich gehe unter der strahlenden Sonne\nFühle den Rhythmus der Musik\nJeder Schlag bringt eine neue Freude\nTanzend durch Tag und Nacht',
            'ja': '輝く太陽の下を歩いています\n音楽のリズムを感じながら\nすべてのビートが新しい喜びをもたらします\n昼夜を問わず踊っています',
            'ko': '빛나는 태양 아래를 걷고 있어요\n음악의 리듬을 느끼며\n모든 비트가 새로운 기쁨을 가져다줍니다\n밤낮으로 춤추며',
            'zh': '在明媚的阳光下行走\n感受音乐的节奏\n每一拍都带来新的喜悦\n日夜舞蹈',
            'pt': 'Estou caminhando sob o sol brilhante\nSentindo o ritmo da música\nCada batida traz uma nova delícia\nDançando através do dia e da noite',
            'it': 'Sto camminando sotto il sole splendente\nSentendo il ritmo della musica\nOgni battito porta una nuova gioia\nBallando attraverso il giorno e la notte',
            'ar': 'أنا أمشي تحت الشمس الساطعة\nأشعر بإيقاع الموسيقى\nكل نبضة تجلب متعة جديدة\nأرقص طوال النهار والليل'
        };

        translatedEl.textContent = sampleTranslations[this.currentLang] || originalText;
    }

    simulateLyricsUpdate() {
        // Simulate updating lyrics when a song is playing
        setTimeout(() => {
            const originalLyrics = `I'm walking in the bright sunshine
Feeling the rhythm of the music
Every beat brings a new delight
Dancing through the day and night`;
            
            this.panel.querySelector('#originalLyrics').textContent = originalLyrics;
            if (this.currentLang !== 'en') {
                this.translateLyrics();
            }
        }, 2000);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new LyricsTranslation();
});
