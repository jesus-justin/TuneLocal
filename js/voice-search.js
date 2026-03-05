/**
 * Voice Search for TuneLocal
 */

class VoiceSearch {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.init();
    }

    init() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.log('Speech recognition not supported');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (e) => {
            const transcript = e.results[0][0].transcript;
            this.handleVoiceCommand(transcript);
        };

        this.recognition.onerror = (e) => {
            console.error('Speech recognition error:', e.error);
            this.isListening = false;
        };

        this.createVoiceButton();
    }

    createVoiceButton() {
        const btn = document.createElement('button');
        btn.id = 'voiceSearchBtn';
        btn.className = 'player-control-btn voice-btn';
        btn.innerHTML = '<i class="fas fa-microphone"></i>';
        btn.title = 'Voice Search';
        btn.onclick = () => this.toggleListening();

        const playerControls = document.querySelector('.player-controls');
        if (playerControls) {
            playerControls.appendChild(btn);
        }
    }

    toggleListening() {
        if (this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            document.getElementById('voiceSearchBtn').classList.remove('listening');
        } else {
            this.recognition.start();
            this.isListening = true;
            document.getElementById('voiceSearchBtn').classList.add('listening');
            if (typeof showNotification === 'function') {
                showNotification('Listening...', 'info');
            }
        }
    }

    handleVoiceCommand(transcript) {
        console.log('Voice command:', transcript);
        this.isListening = false;
        document.getElementById('voiceSearchBtn').classList.remove('listening');

        const lower = transcript.toLowerCase();
        
        if (lower.includes('play') || lower.includes('search')) {
            const query = transcript.replace(/play|search/gi, '').trim();
            // Trigger AI-powered discover search when available
            if (query) {
                if (typeof showNotification === 'function') {
                    showNotification(`Searching for: ${query}`, 'info');
                }
                try {
                    const discoverInput = document.getElementById('discoverSearchInput');
                    if (discoverInput) {
                        discoverInput.value = query;
                        // Switch to Discover section if helper exists
                        if (typeof showSection === 'function') {
                            showSection('discover');
                        }
                        if (typeof advancedDiscover !== 'undefined') {
                            advancedDiscover.performWebSearch();
                        }
                    }
                } catch (e) {
                    console.error('Voice search routing error:', e);
                }
            }
        } else if (lower.includes('pause')) {
            const audioPlayer = document.querySelector('audio');
            if (audioPlayer) audioPlayer.pause();
        } else if (lower.includes('next')) {
            if (typeof nextTrack === 'function') nextTrack();
        } else if (lower.includes('previous')) {
            if (typeof prevTrack === 'function') prevTrack();
        }
    }
}

const voiceSearch = new VoiceSearch();
window.voiceSearch = voiceSearch;
