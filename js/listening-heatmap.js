// Listening Heatmap - Visualize listening patterns over time
class ListeningHeatmap {
    constructor() {
        this.data = this.generateSampleData();
        this.init();
    }

    init() {
        this.injectStyles();
        this.createHeatmap();
        this.attachEventListeners();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .listening-heatmap-btn {
                position: fixed;
                bottom: 20px;
                right: 400px;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: linear-gradient(135deg, #ff6b6b, #feca57);
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 6px 24px rgba(255, 107, 107, 0.4);
                transition: all 0.3s ease;
                z-index: 1000;
            }

            .listening-heatmap-btn:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 32px rgba(255, 107, 107, 0.6);
            }

            .listening-heatmap-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 1100px;
                max-height: 85vh;
                background: linear-gradient(135deg, rgba(255, 107, 107, 0.98), rgba(254, 202, 87, 0.98));
                backdrop-filter: blur(20px);
                border-radius: 24px;
                padding: 32px;
                box-shadow: 0 16px 56px rgba(0, 0, 0, 0.5);
                z-index: 985;
                overflow-y: auto;
                border: 1px solid rgba(255, 255, 255, 0.2);
                display: none;
            }

            .listening-heatmap-panel.active {
                display: block;
            }

            .listening-heatmap-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                color: white;
            }

            .listening-heatmap-title {
                font-size: 28px;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .listening-heatmap-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                font-size: 20px;
                transition: all 0.2s ease;
            }

            .listening-heatmap-close:hover {
                background: rgba(255, 59, 48, 0.8);
                transform: scale(1.1);
            }

            .listening-heatmap-grid {
                display: grid;
                grid-template-columns: 40px repeat(24, 1fr);
                gap: 4px;
                margin-top: 20px;
            }

            .listening-heatmap-day-label {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding-right: 8px;
                font-size: 12px;
                color: white;
                font-weight: 600;
            }

            .listening-heatmap-hour-label {
                text-align: center;
                font-size: 10px;
                color: rgba(255, 255, 255, 0.8);
                padding: 4px 0;
            }

            .listening-heatmap-cell {
                aspect-ratio: 1;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
            }

            .listening-heatmap-cell:hover {
                transform: scale(1.2);
                z-index: 10;
            }

            .listening-heatmap-cell[data-intensity="0"] { background: rgba(255, 255, 255, 0.1); }
            .listening-heatmap-cell[data-intensity="1"] { background: rgba(255, 255, 255, 0.3); }
            .listening-heatmap-cell[data-intensity="2"] { background: rgba(255, 255, 255, 0.5); }
            .listening-heatmap-cell[data-intensity="3"] { background: rgba(255, 255, 255, 0.7); }
            .listening-heatmap-cell[data-intensity="4"] { background: rgba(255, 255, 255, 0.9); }

            .listening-heatmap-legend {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-top: 24px;
                justify-content: center;
                color: white;
                font-size: 13px;
            }

            .listening-heatmap-legend-item {
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .listening-heatmap-legend-box {
                width: 20px;
                height: 20px;
                border-radius: 4px;
            }

            @media (max-width: 768px) {
                .listening-heatmap-panel {
                    width: 95%;
                    padding: 20px;
                }
                .listening-heatmap-btn {
                    right: 20px;
                    bottom: 220px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createHeatmap() {
        const btn = document.createElement('button');
        btn.className = 'listening-heatmap-btn';
        btn.innerHTML = '<i class="fas fa-fire"></i>';
        btn.title = 'Listening Heatmap';
        document.body.appendChild(btn);

        const panel = document.createElement('div');
        panel.className = 'listening-heatmap-panel';
        panel.innerHTML = `
            <div class="listening-heatmap-header">
                <div class="listening-heatmap-title">
                    <i class="fas fa-chart-area"></i>
                    Your Listening Heatmap
                </div>
                <button class="listening-heatmap-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="listening-heatmap-grid" id="heatmapGrid"></div>
            <div class="listening-heatmap-legend">
                <span>Less</span>
                <div class="listening-heatmap-legend-item">
                    <div class="listening-heatmap-legend-box" style="background: rgba(255,255,255,0.1)"></div>
                </div>
                <div class="listening-heatmap-legend-item">
                    <div class="listening-heatmap-legend-box" style="background: rgba(255,255,255,0.3)"></div>
                </div>
                <div class="listening-heatmap-legend-item">
                    <div class="listening-heatmap-legend-box" style="background: rgba(255,255,255,0.5)"></div>
                </div>
                <div class="listening-heatmap-legend-item">
                    <div class="listening-heatmap-legend-box" style="background: rgba(255,255,255,0.7)"></div>
                </div>
                <div class="listening-heatmap-legend-item">
                    <div class="listening-heatmap-legend-box" style="background: rgba(255,255,255,0.9)"></div>
                </div>
                <span>More</span>
            </div>
        `;
        document.body.appendChild(panel);

        this.btn = btn;
        this.panel = panel;
        this.renderHeatmap();
    }

    attachEventListeners() {
        this.btn.addEventListener('click', () => {
            this.panel.classList.toggle('active');
        });

        this.panel.querySelector('.listening-heatmap-close').addEventListener('click', () => {
            this.panel.classList.remove('active');
        });
    }

    generateSampleData() {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const data = {};
        
        days.forEach(day => {
            data[day] = [];
            for (let hour = 0; hour < 24; hour++) {
                // More activity during typical listening hours
                let intensity = 0;
                if (hour >= 7 && hour <= 9) intensity = Math.floor(Math.random() * 5);
                else if (hour >= 12 && hour <= 14) intensity = Math.floor(Math.random() * 4);
                else if (hour >= 17 && hour <= 23) intensity = Math.floor(Math.random() * 5);
                else intensity = Math.floor(Math.random() * 2);
                
                data[day].push(intensity);
            }
        });
        
        return data;
    }

    renderHeatmap() {
        const grid = this.panel.querySelector('#heatmapGrid');
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        // Add corner cell
        grid.innerHTML = '<div></div>';
        
        // Add hour labels
        for (let hour = 0; hour < 24; hour++) {
            const label = document.createElement('div');
            label.className = 'listening-heatmap-hour-label';
            label.textContent = hour;
            grid.appendChild(label);
        }
        
        // Add day rows
        days.forEach(day => {
            const dayLabel = document.createElement('div');
            dayLabel.className = 'listening-heatmap-day-label';
            dayLabel.textContent = day;
            grid.appendChild(dayLabel);
            
            this.data[day].forEach((intensity, hour) => {
                const cell = document.createElement('div');
                cell.className = 'listening-heatmap-cell';
                cell.dataset.intensity = intensity;
                cell.title = `${day} ${hour}:00 - ${intensity * 20}% activity`;
                grid.appendChild(cell);
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ListeningHeatmap();
});
