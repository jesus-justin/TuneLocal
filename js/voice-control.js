// Voice Control Panel - Control music with voice commands
class VoiceControl {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.init();
    }

    init() {
        this.injectStyles();
        this.createPanel();
        this.attachEventListeners();
        this.initVoiceRecognition();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .voice-control-btn {
                position: fixed;
                top: 400px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #ee0979, #ff6a00);
                border: none;
                color: white;
                font-size: 22px;
                cursor: pointer;
                box-shadow: 0 6px 20px rgba(238, 9, 121, 0.4);
                transition: all 0.3s ease;
                z-index: 1000;
            }

            .voice-control-btn:hover {
                transform: scale(1.1);
            }

            .voice-control-btn.listening {
                animation: voicePulse 1s ease-in-out infinite;
            }

            @keyframes voicePulse {
                0%, 100% { box-shadow: 0 6px 20px rgba(238, 9, 121, 0.4); }
                50% { box-shadow: 0 6px 40px rgba(238, 9, 121, 0.8), 0 0 60px rgba(238, 9, 121, 0.6); }
            }

            .voice-control-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 500px;
                background: linear-gradient(135deg, rgba(238, 9, 121, 0.98), rgba(255, 106, 0, 0.98));
                backdrop-filter: blur(20px);
                border-radius: 24px;
                padding: 32px;
                box-shadow: 0 16px 56px rgba(0, 0, 0, 0.5);
                z-index: 985;
                border: 1px solid rgba(255, 255, 255, 0.2);
                display: none;
            }

            .voice-control-panel.active {
                display: block;
            }

            .voice-control-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                color: white;
            }

            .voice-control-title {
                font-size: 24px;
                font-weight: 700;
            }

            .voice-control-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                color: white;
                cursor: pointer;
            }

            .voice-control-visualizer {
                text-align: center;
                padding: 40px 20px;
                margin-bottom: 24px;
            }

            .voice-control-mic-icon {
                font-size: 80px;
                color: white;
                margin-bottom: 16px;
            }

            .voice-control-mic-icon.listening {
                animation: micPulse 0.8s ease-in-out infinite;
            }

            @keyframes micPulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.7; }
            }

            .voice-control-status {
                font-size: 18px;
                color: white;
                font-weight: 600;
            }

            .voice-control-commands {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 16px;
                padding: 20px;
                margin-bottom: 20px;
            }

            .voice-control-commands-title {
                font-size: 16px;
                color: white;
                font-weight: 600;
                margin-bottom: 12px;
            }

            .voice-control-command {
                padding: 10px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                margin-bottom: 8px;
                color: white;
                font-size: 14px;
            }

            .voice-control-toggle-btn {
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

            .voice-control-toggle-btn:hover {
                background: rgba(255, 255, 255, 0.4);
            }

            .voice-control-toggle-btn.active {
                background: rgba(56, 239, 125, 0.6);
            }
        `;
        document.head.appendChild(style);
    }

    createPanel() {
        const btn = document.createElement('button');
        btn.className = 'voice-control-btn';
        btn.innerHTML = '<i class="fas fa-microphone"></i>';
        btn.title = 'Voice Control';
        document.body.appendChild(btn);

        const panel = document.createElement('div');
        panel.className = 'voice-control-panel';
        panel.innerHTML = `
            <div class="voice-control-header">
                <div class="voice-control-title">🎤 Voice Control</div>
                <button class="voice-control-close"><i class="fas fa-times"></i></button>
            </div>

            <div class="voice-control-visualizer">
                <div class="voice-control-mic-icon" id="voiceMicIcon">
                    <i class="fas fa-microphone"></i>
                </div>
                <div class="voice-control-status" id="voiceStatus">Say a command...</div>
            </div>

            <div class="voice-control-commands">
                <div class="voice-control-commands-title">Available Commands:</div>
                <div class="voice-control-command">"Play music"</div>
                <div class="voice-control-command">"Pause" / "Stop"</div>
                <div class="voice-control-command">"Next song"</div>
                <div class="voice-control-command">"Previous song"</div>
                <div class="voice-control-command">"Volume up" / "Volume down"</div>
                <div class="voice-control-command">"Shuffle on/off"</div>
            </div>

            <button class="voice-control-toggle-btn" id="voiceToggle">
                <i class="fas fa-microphone-slash"></i> Start Listening
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

        this.panel.querySelector('.voice-control-close').addEventListener('click', () => {
            this.panel.classList.remove('active');
        });

        this.panel.querySelector('#voiceToggle').addEventListener('click', () => {
            this.toggleListening();
        });
    }

    initVoiceRecognition() {
        // Check if browser supports speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.log('Speech recognition not supported');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event) => {
            const last = event.results.length - 1;
            const command = event.results[last][0].transcript.toLowerCase();
            this.processCommand(command);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };
    }

    toggleListening() {
        if (!this.recognition) {
            alert('Voice recognition not supported in your browser');
            return;
        }

        this.isListening = !this.isListening;
        const toggleBtn = this.panel.querySelector('#voiceToggle');
        const micIcon = this.panel.querySelector('#voiceMicIcon');
        const status = this.panel.querySelector('#voiceStatus');

        if (this.isListening) {
            this.recognition.start();
            toggleBtn.innerHTML = '<i class="fas fa-microphone"></i> Listening...';
            toggleBtn.classList.add('active');
            this.btn.classList.add('listening');
            micIcon.classList.add('listening');
            status.textContent = 'Listening for commands...';
        } else {
            this.recognition.stop();
            toggleBtn.innerHTML = '<i class="fas fa-microphone-slash"></i> Start Listening';
            toggleBtn.classList.remove('active');
            this.btn.classList.remove('listening');
            micIcon.classList.remove('listening');
            status.textContent = 'Say a command...';
        }
    }

    processCommand(command) {
        const status = this.panel.querySelector('#voiceStatus');
        status.textContent = `Command: "${command}"`;

        // Simulate command processing
        if (command.includes('play')) {
            console.log('Playing music...');
            this.showFeedback('▶️ Playing music');
        } else if (command.includes('pause') || command.includes('stop')) {
            console.log('Pausing music...');
            this.showFeedback('⏸️ Paused');
        } else if (command.includes('next')) {
            console.log('Next song...');
            this.showFeedback('⏭️ Next song');
        } else if (command.includes('previous')) {
            console.log('Previous song...');
            this.showFeedback('⏮️ Previous song');
        } else if (command.includes('volume up')) {
            console.log('Volume up...');
            this.showFeedback('🔊 Volume increased');
        } else if (command.includes('volume down')) {
            console.log('Volume down...');
            this.showFeedback('🔉 Volume decreased');
        } else if (command.includes('shuffle')) {
            console.log('Toggle shuffle...');
            this.showFeedback('🔀 Shuffle toggled');
        } else {
            this.showFeedback('❓ Command not recognized');
        }
    }

    showFeedback(message) {
        const status = this.panel.querySelector('#voiceStatus');
        status.textContent = message;
        setTimeout(() => {
            if (this.isListening) {
                status.textContent = 'Listening for commands...';
            }
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VoiceControl();
});
