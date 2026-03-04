// Widget Layout Manager
class WidgetLayoutManager {
    constructor() {
        this.widgets = [
            { selector: '.mood-analyzer', title: 'Listening Mood', defaultOpen: true },
            { selector: '.collab-panel', title: 'Collaborative Playlists', defaultOpen: false },
            { selector: '.discovery-panel', title: 'Discovery Feed', defaultOpen: false },
            { selector: '.quality-widget', title: 'Audio Quality', defaultOpen: false },
            { selector: '.notification-center', title: 'Notifications', defaultOpen: false },
            { selector: '.speed-widget', title: 'Playback Speed', defaultOpen: false },
            { selector: '.eq-presets-panel', title: 'EQ Presets', defaultOpen: false },
            { selector: '.radio-panel', title: 'Artist Radio', defaultOpen: false },
            { selector: '.podcast-panel', title: 'Podcasts', defaultOpen: false },
            { selector: '.autogen-panel', title: 'Auto Playlists', defaultOpen: false },
            { selector: '.export-panel', title: 'Stats Export', defaultOpen: false },
            { selector: '.event-panel', title: 'Concerts & Events', defaultOpen: false },
            { selector: '.badges-panel', title: 'Badges', defaultOpen: false },
            { selector: '.taste-panel', title: 'Taste Profile', defaultOpen: false },
            { selector: '.download-tracker', title: 'Downloads', defaultOpen: false },
            { selector: '.rating-widget', title: 'Track Ratings', defaultOpen: false },
            { selector: '.filter-panel', title: 'Filters', defaultOpen: false },
            { selector: '.porter-panel', title: 'Playlist Porter', defaultOpen: false },
            { selector: '.normalizer-widget', title: 'Volume Normalizer', defaultOpen: false },
            { selector: '.effects-panel', title: 'Audio Effects', defaultOpen: false },
            { selector: '.mini-player', title: 'Mini Player', defaultOpen: true },
            { selector: '.search-history-panel', title: 'Search History', defaultOpen: false }
        ];

        this.init();
    }

    init() {
        this.addStyles();
        this.createDock();
        this.relocateWidgets();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .tl-dock-toggle { position: fixed; right: 16px; bottom: 16px; z-index: 1200; width: 48px; height: 48px; border-radius: 50%; border: none; background: linear-gradient(135deg, var(--primary-color), #4ade80); color: #fff; box-shadow: 0 8px 24px rgba(29, 185, 84, 0.45); cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center; }
            .tl-dock { position: fixed; top: 90px; right: 16px; bottom: 16px; width: 340px; background: rgba(18, 18, 18, 0.95); border: 1px solid rgba(29, 185, 84, 0.25); border-radius: 16px; backdrop-filter: blur(14px); z-index: 1199; transform: translateX(110%); transition: transform 0.3s ease; display: flex; flex-direction: column; }
            .tl-dock.open { transform: translateX(0); }
            .tl-dock-header { padding: 1rem 1rem 0.75rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
            .tl-dock-title { color: var(--primary-color); font-weight: 700; font-size: 14px; }
            .tl-dock-actions { display: flex; gap: 0.5rem; }
            .tl-dock-btn { background: rgba(29, 185, 84, 0.12); border: 1px solid rgba(29, 185, 84, 0.35); color: var(--primary-color); padding: 0.35rem 0.6rem; border-radius: 8px; font-size: 11px; cursor: pointer; }
            .tl-dock-btn:hover { background: var(--primary-color); color: #fff; }
            .tl-dock-content { padding: 0.75rem 1rem 1rem; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem; }
            .tl-dock-section { background: rgba(0, 0, 0, 0.25); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; overflow: hidden; }
            .tl-dock-section-header { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0.75rem; cursor: pointer; }
            .tl-dock-section-title { color: var(--text-primary); font-size: 12px; font-weight: 600; }
            .tl-dock-section-toggle { color: var(--text-secondary); font-size: 14px; }
            .tl-dock-section-body { padding: 0.75rem; display: none; }
            .tl-dock-section.open .tl-dock-section-body { display: block; }
            .tl-dock .tl-widget { position: static !important; width: 100% !important; max-width: 100% !important; margin: 0 !important; inset: auto !important; left: auto !important; right: auto !important; top: auto !important; bottom: auto !important; box-shadow: none !important; }
            .tl-dock .mini-player { min-width: auto !important; }
            .tl-dock .download-tracker { max-height: none !important; overflow: visible !important; }
            @media (max-width: 900px) { .tl-dock { width: 90vw; right: 5vw; } }
        `;
        document.head.appendChild(style);
    }

    createDock() {
        const toggle = document.createElement('button');
        toggle.className = 'tl-dock-toggle';
        toggle.id = 'tlDockToggle';
        toggle.title = 'Widgets';
        toggle.innerHTML = '🧩';

        const dock = document.createElement('div');
        dock.className = 'tl-dock';
        dock.id = 'tlDock';
        dock.innerHTML = `
            <div class="tl-dock-header">
                <div class="tl-dock-title">Widgets</div>
                <div class="tl-dock-actions">
                    <button class="tl-dock-btn" id="tlShowAll">Show all</button>
                    <button class="tl-dock-btn" id="tlHideAll">Hide all</button>
                </div>
            </div>
            <div class="tl-dock-content" id="tlDockContent"></div>
        `;

        document.body.appendChild(toggle);
        document.body.appendChild(dock);

        toggle.addEventListener('click', () => {
            dock.classList.toggle('open');
        });

        dock.querySelector('#tlShowAll').addEventListener('click', () => {
            dock.querySelectorAll('.tl-dock-section').forEach(section => section.classList.add('open'));
        });

        dock.querySelector('#tlHideAll').addEventListener('click', () => {
            dock.querySelectorAll('.tl-dock-section').forEach(section => section.classList.remove('open'));
        });
    }

    relocateWidgets() {
        const container = document.getElementById('tlDockContent');
        if (!container) return;

        this.widgets.forEach(widget => {
            const element = document.querySelector(widget.selector);
            if (!element) return;

            element.classList.add('tl-widget');
            element.style.position = 'static';
            element.style.left = 'auto';
            element.style.right = 'auto';
            element.style.top = 'auto';
            element.style.bottom = 'auto';
            element.style.transform = 'none';

            const section = document.createElement('div');
            section.className = `tl-dock-section${widget.defaultOpen ? ' open' : ''}`;
            section.innerHTML = `
                <div class="tl-dock-section-header">
                    <span class="tl-dock-section-title">${widget.title}</span>
                    <span class="tl-dock-section-toggle">${widget.defaultOpen ? '−' : '+'}</span>
                </div>
                <div class="tl-dock-section-body"></div>
            `;

            section.querySelector('.tl-dock-section-body').appendChild(element);
            section.querySelector('.tl-dock-section-header').addEventListener('click', () => {
                section.classList.toggle('open');
                section.querySelector('.tl-dock-section-toggle').textContent = section.classList.contains('open') ? '−' : '+';
            });

            container.appendChild(section);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WidgetLayoutManager();
});
