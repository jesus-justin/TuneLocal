/**
 * Mood Detector - Suggests songs based on mood
 */

class MoodDetector {
    constructor() {
        this.moodMappings = {
            happy: { tempo: 'high', energy: 'high', valence: 'positive' },
            sad: { tempo: 'low', energy: 'low', valence: 'negative' },
            focused: { tempo: 'medium', energy: 'high', valence: 'neutral' },
            calm: { tempo: 'low', energy: 'low', valence: 'positive' },
            energetic: { tempo: 'high', energy: 'high', valence: 'neutral' },
            relaxed: { tempo: 'medium', energy: 'low', valence: 'positive' }
        };
        this.init();
    }

    init() {
        this.createMoodSelector();
    }

    createMoodSelector() {
        const btn = document.createElement('button');
        btn.className = 'player-control-btn';
        btn.innerHTML = '<i class="fas fa-smile"></i>';
        btn.title = 'Mood Suggestions';
        btn.onclick = () => this.showMoodPanel();

        const playerControls = document.querySelector('.player-controls');
        if (playerControls) {
            playerControls.appendChild(btn);
        }

        const panel = document.createElement('div');
        panel.id = 'moodPanel';
        panel.className = 'mood-panel hidden';
        panel.innerHTML = `
            <div class="mood-selector">
                <h4>How are you feeling?</h4>
                <div class="mood-options">
                    ${Object.keys(this.moodMappings).map(mood => `
                        <button class="mood-btn" onclick="moodDetector.getSuggestionsForMood('${mood}')">
                            <i class="fas fa-${this.getMoodIcon(mood)}"></i>
                            ${mood}
                        </button>
                    `).join('')}
                </div>
            </div>
            <div id="moodSuggestions" class="mood-suggestions"></div>
        `;
        document.body.appendChild(panel);
    }

    showMoodPanel() {
        const panel = document.getElementById('moodPanel');
        panel.classList.toggle('hidden');
    }

    getMoodIcon(mood) {
        const icons = {
            happy: 'smile',
            sad: 'frown',
            focused: 'graduation-cap',
            calm: 'spa',
            energetic: 'bolt',
            relaxed: 'leaf'
        };
        return icons[mood] || 'music';
    }

    getSuggestionsForMood(mood) {
        const moodData = this.moodMappings[mood];
        const suggestions = document.getElementById('moodSuggestions');
        
        suggestions.innerHTML = `
            <div class="suggestion-item">
                <h5>Suggested for ${mood} mood:</h5>
                <ul>
                    <li>Tempo: ${moodData.tempo}</li>
                    <li>Energy: ${moodData.energy}</li>
                    <li>Vibe: ${moodData.valence}</li>
                </ul>
                <button class="btn-primary" onclick="moodDetector.playMoodPlaylist('${mood}')">
                    Play ${mood} Playlist
                </button>
            </div>
        `;
    }

    playMoodPlaylist(mood) {
        if (typeof showNotification === 'function') {
            showNotification(`Loading ${mood} playlist...`, 'success');
        }
    }
}

const moodDetector = new MoodDetector();
window.moodDetector = moodDetector;
