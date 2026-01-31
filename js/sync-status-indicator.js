// Spotify/YouTube Sync Status Indicator
class SyncStatusIndicator {
    constructor() {
        this.syncStatus = {
            spotify: { synced: true, lastSync: '2 min ago', count: 1247 },
            youtube: { synced: false, lastSync: '1 hour ago', count: 562 }
        };
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createIndicator();
        this.simulateSyncCheck();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .sync-status-bar { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: linear-gradient(90deg, rgba(29, 185, 84, 0.1), rgba(29, 185, 84, 0.05)); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 20px; padding: 0.75rem 1.5rem; z-index: 996; backdrop-filter: blur(10px); display: flex; gap: 2rem; align-items: center; }
            .sync-item { display: flex; align-items: center; gap: 0.75rem; font-size: 12px; }
            .sync-icon { font-size: 16px; }
            .sync-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
            .sync-dot.synced { background: #10b981; box-shadow: 0 0 6px #10b981; animation: pulse 2s infinite; }
            .sync-dot.syncing { background: #f59e0b; animation: blink 0.6s infinite; }
            .sync-dot.error { background: #ef4444; }
            .sync-label { color: var(--text-secondary); }
            .sync-time { color: var(--text-secondary); font-size: 11px; margin-left: 0.5rem; }
            @keyframes pulse { 0%, 100% { box-shadow: 0 0 6px #10b981; } 50% { box-shadow: 0 0 12px #10b981; } }
            @keyframes blink { 0%, 49%, 100% { opacity: 1; } 50%, 99% { opacity: 0.3; } }
        `;
        document.head.appendChild(style);
    }
    
    createIndicator() {
        const bar = document.createElement('div');
        bar.className = 'sync-status-bar';
        bar.id = 'syncStatusBar';
        
        let html = '';
        Object.entries(this.syncStatus).forEach(([service, data]) => {
            const statusClass = data.synced ? 'synced' : 'error';
            const statusText = data.synced ? 'Synced' : 'Out of Sync';
            html += `
                <div class="sync-item" title="${service}: ${data.count} items">
                    <span class="sync-icon">${service === 'spotify' ? '🎵' : '▶️'}</span>
                    <span class="sync-dot ${statusClass}"></span>
                    <span class="sync-label">${statusText}</span>
                    <span class="sync-time">${data.lastSync}</span>
                </div>
            `;
        });
        
        bar.innerHTML = html;
        document.body.appendChild(bar);
    }
    
    simulateSyncCheck() {
        setInterval(() => {
            Object.keys(this.syncStatus).forEach(service => {
                if (Math.random() > 0.7) {
                    this.syncStatus[service].lastSync = 'just now';
                }
            });
        }, 30000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SyncStatusIndicator();
});
