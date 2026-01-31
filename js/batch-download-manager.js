// Batch Download Manager
class BatchDownloadManager {
    constructor() {
        this.queue = [];
        this.downloading = false;
        this.completed = 0;
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createManager();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .batch-download-btn { position: fixed; bottom: 260px; right: 20px; width: 50px; height: 50px; background: linear-gradient(135deg, var(--primary-color), rgba(29, 185, 84, 0.6)); border: 2px solid var(--primary-color); border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 994; font-size: 20px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(29, 185, 84, 0.3); position: relative; }
            .batch-download-btn:hover { transform: scale(1.1); }
            .download-badge { position: absolute; top: -5px; right: -5px; background: #ef4444; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; }
            .download-manager { position: fixed; bottom: 320px; right: 20px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.5rem; min-width: 300px; max-height: 400px; z-index: 995; display: none; backdrop-filter: blur(10px); overflow-y: auto; }
            .download-manager.open { display: block; animation: slideDown 0.3s ease; }
            .manager-title { color: var(--primary-color); font-weight: bold; margin-bottom: 1rem; }
            .download-item { padding: 0.75rem; background: rgba(0, 0, 0, 0.2); border-radius: 6px; margin-bottom: 0.5rem; }
            .download-progress { background: rgba(0, 0, 0, 0.3); height: 4px; border-radius: 2px; overflow: hidden; margin-top: 0.5rem; }
            .download-fill { background: var(--primary-color); height: 100%; transition: width 0.3s; }
            .download-text { font-size: 11px; color: var(--text-secondary); margin-bottom: 0.3rem; }
        `;
        document.head.appendChild(style);
    }
    
    createManager() {
        const btn = document.createElement('button');
        btn.className = 'batch-download-btn';
        btn.innerHTML = '⬇️';
        btn.id = 'batchDownloadBtn';
        document.body.appendChild(btn);
        
        const manager = document.createElement('div');
        manager.className = 'download-manager';
        manager.id = 'downloadManager';
        manager.innerHTML = '<div class="manager-title">Download Queue</div><div id="downloadList"></div>';
        document.body.appendChild(manager);
        
        btn.addEventListener('click', () => {
            manager.classList.toggle('open');
        });
        
        this.addMockDownloads();
    }
    
    addMockDownloads() {
        const tracks = ['Summer Vibes.mp3', 'Night Drive.mp3', 'Focus Mode.mp3', 'Party Hits.mp3'];
        tracks.forEach((track, idx) => {
            this.addDownload(track, Math.random() * 100);
        });
    }
    
    addDownload(name, progress) {
        const list = document.getElementById('downloadList');
        if (!list) return;
        
        const item = document.createElement('div');
        item.className = 'download-item';
        const progressPercent = Math.floor(progress);
        item.innerHTML = `
            <div class="download-text">${name}</div>
            <div class="download-progress">
                <div class="download-fill" style="width: ${progressPercent}%"></div>
            </div>
            <div class="download-text">${progressPercent}%</div>
        `;
        list.appendChild(item);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BatchDownloadManager();
});
