// Playlist Import/Export Porter
class PlaylistPorter {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createPorterPanel();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .porter-panel { position: fixed; top: 100px; right: 20px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.5rem; max-width: 300px; z-index: 988; backdrop-filter: blur(10px); }
            .porter-title { color: var(--primary-color); font-weight: bold; font-size: 14px; margin-bottom: 1.5rem; }
            .porter-section { margin-bottom: 1.5rem; }
            .porter-section-title { color: var(--text-primary); font-size: 13px; margin-bottom: 0.75rem; font-weight: 500; }
            .porter-buttons { display: flex; flex-direction: column; gap: 0.75rem; }
            .porter-btn { background: linear-gradient(135deg, rgba(29, 185, 84, 0.1), rgba(74, 222, 128, 0.1)); border: 1px solid var(--primary-color); color: var(--primary-color); padding: 0.75rem 1rem; border-radius: 8px; cursor: pointer; font-size: 13px; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
            .porter-btn:hover { background: linear-gradient(135deg, var(--primary-color), #4ade80); color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(29, 185, 84, 0.3); }
            .porter-format { background: rgba(0, 0, 0, 0.2); padding: 0.5rem; border-radius: 6px; color: var(--text-secondary); font-size: 11px; }
            .porter-file-input { display: none; }
            .porter-status { background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; color: #10b981; padding: 0.5rem; border-radius: 6px; font-size: 11px; text-align: center; margin-top: 0.75rem; }
            .porter-divider { height: 1px; background: rgba(255, 255, 255, 0.1); margin: 1.5rem 0; }
        `;
        document.head.appendChild(style);
    }
    
    createPorterPanel() {
        const panel = document.createElement('div');
        panel.className = 'porter-panel';
        panel.innerHTML = `
            <div class="porter-title">📦 Playlist Porter</div>
            
            <div class="porter-section">
                <div class="porter-section-title">Export Playlist</div>
                <div class="porter-buttons">
                    <button class="porter-btn" onclick="this.dispatchEvent(new CustomEvent('export', {detail: 'json', bubbles: true}))">
                        <span>📄</span>
                        <span>Export as JSON</span>
                    </button>
                    <button class="porter-btn" onclick="this.dispatchEvent(new CustomEvent('export', {detail: 'm3u', bubbles: true}))">
                        <span>📝</span>
                        <span>Export as M3U</span>
                    </button>
                    <button class="porter-btn" onclick="this.dispatchEvent(new CustomEvent('export', {detail: 'csv', bubbles: true}))">
                        <span>📊</span>
                        <span>Export as CSV</span>
                    </button>
                </div>
                <div class="porter-format">Format: Standard playlist metadata</div>
            </div>
            
            <div class="porter-divider"></div>
            
            <div class="porter-section">
                <div class="porter-section-title">Import Playlist</div>
                <div class="porter-buttons">
                    <input type="file" class="porter-file-input" id="jsonImport" accept=".json">
                    <button class="porter-btn" onclick="document.getElementById('jsonImport').click()">
                        <span>📥</span>
                        <span>Import JSON</span>
                    </button>
                    <input type="file" class="porter-file-input" id="m3uImport" accept=".m3u,.m3u8">
                    <button class="porter-btn" onclick="document.getElementById('m3uImport').click()">
                        <span>📥</span>
                        <span>Import M3U</span>
                    </button>
                    <input type="file" class="porter-file-input" id="csvImport" accept=".csv">
                    <button class="porter-btn" onclick="document.getElementById('csvImport').click()">
                        <span>📥</span>
                        <span>Import CSV</span>
                    </button>
                </div>
                <div class="porter-format">Supports: JSON, M3U, CSV formats</div>
            </div>
            
            <div class="porter-status" id="porterStatus" style="display: none;">
                ✅ Ready to import/export
            </div>
        `;
        document.body.appendChild(panel);
        
        this.attachExportListeners();
        this.attachImportListeners();
    }
    
    attachExportListeners() {
        document.addEventListener('export', (e) => {
            const format = e.detail;
            this.exportPlaylist(format);
        });
    }
    
    attachImportListeners() {
        document.getElementById('jsonImport').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.importPlaylist(e.target.files[0], 'json');
            }
        });
        
        document.getElementById('m3uImport').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.importPlaylist(e.target.files[0], 'm3u');
            }
        });
        
        document.getElementById('csvImport').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.importPlaylist(e.target.files[0], 'csv');
            }
        });
    }
    
    exportPlaylist(format) {
        const playlist = {
            name: 'My TuneLocal Playlist',
            tracks: [
                { title: 'Summer Vibes', artist: 'DJ Cool', duration: '3:45' },
                { title: 'Night Drive', artist: 'Synthwave Master', duration: '4:20' },
                { title: 'Chill Beats', artist: 'Lo-Fi Producer', duration: '2:55' }
            ]
        };
        
        let content, filename;
        
        if (format === 'json') {
            content = JSON.stringify(playlist, null, 2);
            filename = 'playlist.json';
        } else if (format === 'm3u') {
            content = '#EXTM3U\n' + playlist.tracks.map(t => `#EXTINF:${t.duration},${t.artist} - ${t.title}\n${t.title}.mp3`).join('\n');
            filename = 'playlist.m3u';
        } else if (format === 'csv') {
            content = 'Title,Artist,Duration\n' + playlist.tracks.map(t => `"${t.title}","${t.artist}","${t.duration}"`).join('\n');
            filename = 'playlist.csv';
        }
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        
        this.showStatus('Exported as ' + format.toUpperCase());
    }
    
    importPlaylist(file, format) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.showStatus('Imported ' + file.name);
        };
        reader.readAsText(file);
    }
    
    showStatus(message) {
        const status = document.getElementById('porterStatus');
        status.textContent = '✅ ' + message;
        status.style.display = 'block';
        setTimeout(() => { status.style.display = 'none'; }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PlaylistPorter();
});
