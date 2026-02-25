// Music Timeline - Visual timeline of music history and eras
class MusicTimeline {
    constructor() {
        this.currentYear = new Date().getFullYear();
        this.selectedEra = null;
        this.init();
    }

    init() {
        this.injectStyles();
        this.createTimeline();
        this.attachEventListeners();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .music-timeline-container {
                position: fixed;
                top: 100px;
                left: 50%;
                transform: translateX(-50%);
                width: 90%;
                max-width: 1000px;
                background: linear-gradient(135deg, rgba(20, 20, 30, 0.98), rgba(40, 40, 60, 0.98));
                backdrop-filter: blur(20px);
                border-radius: 20px;
                padding: 24px;
                box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5);
                z-index: 965;
                max-height: 80vh;
                overflow-y: auto;
                border: 1px solid rgba(255, 255, 255, 0.1);
                display: none;
            }

            .music-timeline-container.active {
                display: block;
            }

            .music-timeline-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                color: white;
            }

            .music-timeline-title {
                font-size: 24px;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .music-timeline-close {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                font-size: 18px;
                transition: all 0.2s ease;
            }

            .music-timeline-close:hover {
                background: rgba(255, 59, 48, 0.8);
                transform: scale(1.1);
            }

            .music-timeline-track {
                position: relative;
                height: 100px;
                background: linear-gradient(90deg, 
                    #667eea 0%, #764ba2 20%, #f093fb 40%, 
                    #f5576c 60%, #4facfe 80%, #00f2fe 100%);
                border-radius: 50px;
                margin: 30px 0;
                box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
            }

            .music-timeline-marker {
                position: absolute;
                top: 50%;
                transform: translate(-50%, -50%);
                width: 20px;
                height: 20px;
                background: white;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.3);
            }

            .music-timeline-marker:hover {
                transform: translate(-50%, -50%) scale(1.5);
                box-shadow: 0 0 0 8px rgba(255, 255, 255, 0.5);
            }

            .music-timeline-marker.active {
                transform: translate(-50%, -50%) scale(1.8);
                background: gold;
                box-shadow: 0 0 20px gold;
            }

            .music-timeline-eras {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 16px;
                margin-top: 32px;
            }

            .music-timeline-era {
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
                border: 1px solid rgba(102, 126, 234, 0.4);
                border-radius: 16px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .music-timeline-era:hover {
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.4), rgba(118, 75, 162, 0.4));
                transform: translateY(-4px);
                box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
            }

            .music-timeline-era-period {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.7);
                font-weight: 600;
                margin-bottom: 8px;
            }

            .music-timeline-era-name {
                font-size: 20px;
                font-weight: 700;
                color: white;
                margin-bottom: 12px;
            }

            .music-timeline-era-description {
                font-size: 13px;
                color: rgba(255, 255, 255, 0.8);
                line-height: 1.6;
                margin-bottom: 12px;
            }

            .music-timeline-era-genres {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }

            .music-timeline-genre-tag {
                padding: 4px 10px;
                background: rgba(255, 255, 255, 0.15);
                border-radius: 12px;
                font-size: 11px;
                color: white;
            }

            .music-timeline-toggle-btn {
                position: fixed;
                bottom: 20px;
                right: 260px;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 6px 24px rgba(102, 126, 234, 0.4);
                transition: all 0.3s ease;
                z-index: 1000;
            }

            .music-timeline-toggle-btn:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 32px rgba(102, 126, 234, 0.6);
            }

            @media (max-width: 768px) {
                .music-timeline-container {
                    width: 95%;
                    padding: 16px;
                }
                
                .music-timeline-eras {
                    grid-template-columns: 1fr;
                }
                
                .music-timeline-toggle-btn {
                    right: 20px;
                    bottom: 80px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createTimeline() {
        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'music-timeline-toggle-btn';
        toggleBtn.innerHTML = '<i class="fas fa-clock-rotate-left"></i>';
        toggleBtn.title = 'Music Timeline';
        document.body.appendChild(toggleBtn);

        // Create timeline container
        const container = document.createElement('div');
        container.className = 'music-timeline-container';
        container.innerHTML = `
            <div class="music-timeline-header">
                <div class="music-timeline-title">
                    <i class="fas fa-timeline"></i>
                    Music History Timeline
                </div>
                <button class="music-timeline-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="music-timeline-track" id="timelineTrack"></div>
            <div class="music-timeline-eras" id="timelineEras"></div>
        `;
        document.body.appendChild(container);

        this.container = container;
        this.toggleBtn = toggleBtn;
        
        this.createMarkers();
        this.createEraCards();
    }

    createMarkers() {
        const track = this.container.querySelector('#timelineTrack');
        const eras = [
            { year: 1950, position: 10 },
            { year: 1970, position: 30 },
            { year: 1990, position: 50 },
            { year: 2000, position: 65 },
            { year: 2010, position: 80 },
            { year: 2020, position: 95 }
        ];

        eras.forEach(era => {
            const marker = document.createElement('div');
            marker.className = 'music-timeline-marker';
            marker.style.left = era.position + '%';
            marker.title = era.year;
            marker.dataset.year = era.year;
            track.appendChild(marker);

            marker.addEventListener('click', () => {
                track.querySelectorAll('.music-timeline-marker').forEach(m => 
                    m.classList.remove('active'));
                marker.classList.add('active');
            });
        });
    }

    createEraCards() {
        const erasContainer = this.container.querySelector('#timelineEras');
        const eras = [
            {
                period: '1950s-1960s',
                name: 'Rock & Roll Era',
                description: 'Birth of rock and roll, British Invasion, and the rise of iconic artists like Elvis Presley and The Beatles.',
                genres: ['Rock & Roll', 'Doo-wop', 'Soul', 'Surf Rock']
            },
            {
                period: '1970s',
                name: 'Disco & Punk',
                description: 'The disco revolution, punk rock emergence, and progressive rock experimentation defined this era.',
                genres: ['Disco', 'Punk', 'Funk', 'Prog Rock']
            },
            {
                period: '1980s',
                name: 'New Wave & MTV',
                description: 'Music videos revolutionized the industry. Synth-pop, new wave, and hip-hop began their mainstream ascent.',
                genres: ['New Wave', 'Synth-pop', 'Hip-Hop', 'Hair Metal']
            },
            {
                period: '1990s',
                name: 'Grunge & Hip-Hop Golden Age',
                description: 'Alternative rock dominated, while hip-hop reached its golden age with legendary artists and producers.',
                genres: ['Grunge', 'Hip-Hop', 'Alternative', 'Britpop']
            },
            {
                period: '2000s',
                name: 'Digital Revolution',
                description: 'Digital downloads and early streaming changed music consumption. Pop, R&B, and indie rock flourished.',
                genres: ['Pop-Punk', 'Indie Rock', 'R&B', 'Electro-pop']
            },
            {
                period: '2010s-Present',
                name: 'Streaming Era',
                description: 'Streaming platforms dominate. Genre-blending, viral hits, and global music diversity define modern music.',
                genres: ['EDM', 'Trap', 'K-Pop', 'Lo-fi', 'Hyperpop']
            }
        ];

        eras.forEach(era => {
            const card = document.createElement('div');
            card.className = 'music-timeline-era';
            card.innerHTML = `
                <div class="music-timeline-era-period">${era.period}</div>
                <div class="music-timeline-era-name">${era.name}</div>
                <div class="music-timeline-era-description">${era.description}</div>
                <div class="music-timeline-era-genres">
                    ${era.genres.map(g => `<span class="music-timeline-genre-tag">${g}</span>`).join('')}
                </div>
            `;
            erasContainer.appendChild(card);
        });
    }

    attachEventListeners() {
        this.toggleBtn.addEventListener('click', () => {
            this.container.classList.toggle('active');
        });

        this.container.querySelector('.music-timeline-close').addEventListener('click', () => {
            this.container.classList.remove('active');
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new MusicTimeline();
});
