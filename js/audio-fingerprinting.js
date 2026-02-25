// Audio Fingerprinting - Identify songs by audio signature
class AudioFingerprinting {
    constructor() {
        this.isRecording = false;
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
            .audio-fingerprint-btn {
                position: fixed;
                bottom: 160px;
                left: 20px;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: linear-gradient(135deg, #6a11cb, #2575fc);
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 6px 24px rgba(106, 17, 203, 0.4);
                transition: all 0.3s ease;
                z-index: 1000;
            }

            .audio-fingerprint-btn:hover {
                transform: translateY(-4px);
            }

            .audio-fingerprint-btn.recording {
                animation: recordPulse 1.5s ease-in-out infinite;
            }

            @keyframes recordPulse {
                0%, 100% { box-shadow: 0 6px 24px rgba(106, 17, 203, 0.4); }
                50% { box-shadow: 0 6px 44px rgba(106, 17, 203, 0.8), 0 0 60px rgba(37, 117, 252, 0.6); }
            }

            .audio-fingerprint-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 500px;
                background: linear-gradient(135deg, rgba(106, 17, 203, 0.98), rgba(37, 117, 252, 0.98));
                backdrop-filter: blur(20px);
                border-radius: 24px;
                padding: 32px;
                box-shadow: 0 16px 56px rgba(0, 0, 0, 0.5);
                z-index: 985;
                border: 1px solid rgba(255, 255, 255, 0.2);
                display: none;
            }

            .audio-fingerprint-panel.active {
                display: block;
            }

            .audio-fingerprint-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                color: white;
            }

            .audio-fingerprint-title {
                font-size: 24px;
                font-weight: 700;
            }

            .audio-fingerprint-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                color: white;
                cursor: pointer;
            }

            .audio-fingerprint-visualizer {
                text-align: center;
                padding: 40px 20px;
                margin-bottom: 24px;
            }

            .audio-fingerprint-icon {
                font-size: 80px;
                color: white;
                margin-bottom: 16px;
            }

            .audio-fingerprint-icon.recording {
                animation: iconPulse 0.8s ease-in-out infinite;
            }

            @keyframes iconPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.15); }
            }

            .audio-fingerprint-status {
                font-size: 18px;
                color: white;
                font-weight: 600;
                margin-bottom: 24px;
            }

            .audio-fingerprint-result {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 16px;
                padding: 20px;
                margin-bottom: 20px;
                display: none;
            }

            .audio-fingerprint-result.active {
                display: block;
            }

            .audio-fingerprint-result-title {
                font-size: 22px;
                font-weight: 700;
                color: white;
                margin-bottom: 8px;
            }

            .audio-fingerprint-result-artist {
                font-size: 16px;
                color: rgba(255, 255, 255, 0.9);
                margin-bottom: 12px;
            }

            .audio-fingerprint-result-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-top: 16px;
            }

            .audio-fingerprint-detail {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                padding: 10px;
                text-align: center;
            }

            .audio-fingerprint-detail-label {
                font-size: 11px;
                color: rgba(255, 255, 255, 0.7);
                text-transform: uppercase;
                margin-bottom: 4px;
            }

            .audio-fingerprint-detail-value {
                font-size: 16px;
                font-weight: 600;
                color: white;
            }

            .audio-fingerprint-record-btn {
                width: 100%;
                padding: 16px;
                background: rgba(255, 255, 255, 0.3);
                border: none;
                border-radius: 12px;
                color: white;
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .audio-fingerprint-record-btn:hover {
                background: rgba(255, 255, 255, 0.4);
            }

            .audio-fingerprint-record-btn.recording {
                background: rgba(255, 59, 48, 0.6);
            }

            .audio-fingerprint-wave {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 4px;
                height: 60px;
                margin-bottom: 20px;
                display: none;
            }

            .audio-fingerprint-wave.active {
                display: flex;
            }

            .audio-fingerprint-bar {
                width: 4px;
                background: white;
                border-radius: 2px;
                animation: waveAnimation 1s ease-in-out infinite;
            }

            .audio-fingerprint-bar:nth-child(1) { animation-delay: 0s; }
            .audio-fingerprint-bar:nth-child(2) { animation-delay: 0.1s; }
            .audio-fingerprint-bar:nth-child(3) { animation-delay: 0.2s; }
            .audio-fingerprint-bar:nth-child(4) { animation-delay: 0.3s; }
            .audio-fingerprint-bar:nth-child(5) { animation-delay: 0.4s; }

            @keyframes waveAnimation {
                0%, 100% { height: 10px; }
                50% { height: 50px; }
            }
        `;
        document.head.appendChild(style);
    }

    createPanel() {
        const btn = document.createElement('button');
        btn.className = 'audio-fingerprint-btn';
        btn.innerHTML = '<i class="fas fa-fingerprint"></i>';
        btn.title = 'Audio Fingerprinting';
        document.body.appendChild(btn);

        const panel = document.createElement('div');
        panel.className = 'audio-fingerprint-panel';
        panel.innerHTML = `
            <div class="audio-fingerprint-header">
                <div class="audio-fingerprint-title">🎵 Song Identifier</div>
                <button class="audio-fingerprint-close"><i class="fas fa-times"></i></button>
            </div>

            <div class="audio-fingerprint-visualizer">
                <div class="audio-fingerprint-icon" id="fingerprintIcon">
                    <i class="fas fa-music"></i>
                </div>
                <div class="audio-fingerprint-status" id="fingerprintStatus">
                    Tap to identify song
                </div>
            </div>

            <div class="audio-fingerprint-wave" id="fingerprintWave">
                <div class="audio-fingerprint-bar"></div>
                <div class="audio-fingerprint-bar"></div>
                <div class="audio-fingerprint-bar"></div>
                <div class="audio-fingerprint-bar"></div>
                <div class="audio-fingerprint-bar"></div>
            </div>

            <div class="audio-fingerprint-result" id="fingerprintResult">
                <div class="audio-fingerprint-result-title" id="resultTitle"></div>
                <div class="audio-fingerprint-result-artist" id="resultArtist"></div>
                <div class="audio-fingerprint-result-details">
                    <div class="audio-fingerprint-detail">
                        <div class="audio-fingerprint-detail-label">Year</div>
                        <div class="audio-fingerprint-detail-value" id="resultYear"></div>
                    </div>
                    <div class="audio-fingerprint-detail">
                        <div class="audio-fingerprint-detail-label">Genre</div>
                        <div class="audio-fingerprint-detail-value" id="resultGenre"></div>
                    </div>
                    <div class="audio-fingerprint-detail">
                        <div class="audio-fingerprint-detail-label">Album</div>
                        <div class="audio-fingerprint-detail-value" id="resultAlbum"></div>
                    </div>
                    <div class="audio-fingerprint-detail">
                        <div class="audio-fingerprint-detail-label">Confidence</div>
                        <div class="audio-fingerprint-detail-value" id="resultConfidence"></div>
                    </div>
                </div>
            </div>

            <button class="audio-fingerprint-record-btn" id="fingerprintRecord">
                <i class="fas fa-circle"></i> Start Listening
            </button>
        `;
        document.body.appendChild(panel);

        this.btn = btn;
        this.panel = panel;
    }

    attachEventListeners() {
        this.btn.addEventListener('click', () => {
            this.panel.classList.toggle('active');
        });

        this.panel.querySelector('.audio-fingerprint-close').addEventListener('click', () => {
            this.panel.classList.remove('active');
        });

        this.panel.querySelector('#fingerprintRecord').addEventListener('click', () => {
            this.toggleRecording();
        });
    }

    toggleRecording() {
        this.isRecording = !this.isRecording;
        const recordBtn = this.panel.querySelector('#fingerprintRecord');
        const icon = this.panel.querySelector('#fingerprintIcon');
        const status = this.panel.querySelector('#fingerprintStatus');
        const wave = this.panel.querySelector('#fingerprintWave');
        const result = this.panel.querySelector('#fingerprintResult');

        if (this.isRecording) {
            recordBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Listening';
            recordBtn.classList.add('recording');
            this.btn.classList.add('recording');
            icon.classList.add('recording');
            wave.classList.add('active');
            result.classList.remove('active');
            status.textContent = 'Listening...';

            // Simulate identification after 3 seconds
            setTimeout(() => {
                if (this.isRecording) {
                    this.identifySong();
                }
            }, 3000);
        } else {
            recordBtn.innerHTML = '<i class="fas fa-circle"></i> Start Listening';
            recordBtn.classList.remove('recording');
            this.btn.classList.remove('recording');
            icon.classList.remove('recording');
            wave.classList.remove('active');
            status.textContent = 'Tap to identify song';
        }
    }

    identifySong() {
        // Simulate song identification
        const sampleSongs = [
            { title: "Blinding Lights", artist: "The Weeknd", year: "2019", genre: "Synth-Pop", album: "After Hours", confidence: "98%" },
            { title: "Shape of You", artist: "Ed Sheeran", year: "2017", genre: "Pop", album: "÷ (Divide)", confidence: "96%" },
            { title: "Starboy", artist: "The Weeknd ft. Daft Punk", year: "2016", genre: "R&B", album: "Starboy", confidence: "95%" },
            { title: "Hello", artist: "Adele", year: "2015", genre: "Soul", album: "25", confidence: "97%" }
        ];

        const song = sampleSongs[Math.floor(Math.random() * sampleSongs.length)];

        this.panel.querySelector('#resultTitle').textContent = song.title;
        this.panel.querySelector('#resultArtist').textContent = song.artist;
        this.panel.querySelector('#resultYear').textContent = song.year;
        this.panel.querySelector('#resultGenre').textContent = song.genre;
        this.panel.querySelector('#resultAlbum').textContent = song.album;
        this.panel.querySelector('#resultConfidence').textContent = song.confidence;

        this.panel.querySelector('#fingerprintResult').classList.add('active');
        this.panel.querySelector('#fingerprintStatus').textContent = '✓ Song Identified!';
        
        this.isRecording = false;
        const recordBtn = this.panel.querySelector('#fingerprintRecord');
        recordBtn.innerHTML = '<i class="fas fa-circle"></i> Start Listening';
        recordBtn.classList.remove('recording');
        this.btn.classList.remove('recording');
        this.panel.querySelector('#fingerprintIcon').classList.remove('recording');
        this.panel.querySelector('#fingerprintWave').classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AudioFingerprinting();
});
