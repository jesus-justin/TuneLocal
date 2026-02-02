// Download Progress Tracker
class DownloadProgressTracker {
    constructor() {
        this.downloads = [];
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createTracker();
        this.addMockDownloads();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .download-tracker { position: fixed; top: 350px; right: 20px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.5rem; max-width: 320px; z-index: 992; backdrop-filter: blur(10px); max-height: 400px; overflow-y: auto; }
            .tracker-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
            .tracker-title { color: var(--primary-color); font-weight: bold; font-size: 14px; }
            .tracker-count { background: var(--primary-color); color: white; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 11px; }
            .download-entry { background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 0.75rem; margin-bottom: 0.75rem; }
            .download-name { color: var(--text-primary); font-size: 13px; margin-bottom: 0.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .download-bar { background: rgba(0, 0, 0, 0.3); height: 6px; border-radius: 3px; overflow: hidden; margin-bottom: 0.5rem; }
            .download-fill { background: linear-gradient(90deg, var(--primary-color), #4ade80); height: 100%; transition: width 0.3s; border-radius: 3px; }
            .download-stats { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-secondary); }
            .download-complete { color: #10b981; }
        `;
        document.head.appendChild(style);
    }
    
    createTracker() {
        const tracker = document.createElement('div');
        tracker.className = 'download-tracker';
        tracker.id = 'downloadTracker';
        tracker.innerHTML = `
            <div class="tracker-header">
                <span class="tracker-title">⬇️ Downloads</span>
                <span class="tracker-count" id="downloadCount">0</span>
            </div>
            <div id="downloadList"></div>
        `;
        document.body.appendChild(tracker);
    }
    
    addMockDownloads() {
        this.addDownload('Summer Vibes.mp3', 75);
        this.addDownload('Night Drive Mix.mp3', 100);
        this.addDownload('Chill Beats Vol.1.mp3', 45);
        
        document.getElementById('downloadCount').textContent = this.downloads.length;
    }
    
    addDownload(name, progress) {
        this.downloads.push({ name, progress });
        
        const list = document.getElementById('downloadList');
        const entry = document.createElement('div');
        entry.className = 'download-entry';
        entry.innerHTML = `
            <div class="download-name">${name}</div>
            <div class="download-bar">
                <div class="download-fill" style="width: ${progress}%"></div>
            </div>
            <div class="download-stats">
                <span>${progress}%</span>
                <span class="${progress === 100 ? 'download-complete' : ''}">${progress === 100 ? 'Complete' : 'Downloading...'}</span>
            </div>
        `;
        list.appendChild(entry);
        
        if (progress < 100) {
            this.simulateProgress(entry, progress);
        }
    }
    
    simulateProgress(entry, startProgress) {
        let progress = startProgress;
        const interval = setInterval(() => {
            progress += Math.random() * 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                entry.querySelector('.download-stats span:last-child').textContent = 'Complete';
                entry.querySelector('.download-stats span:last-child').className = 'download-complete';
            }
            entry.querySelector('.download-fill').style.width = progress + '%';
            entry.querySelector('.download-stats span:first-child').textContent = Math.floor(progress) + '%';
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DownloadProgressTracker();
});
