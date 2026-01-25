/**
 * Statistics Export - Export stats in multiple formats
 */

class StatisticsExport {
    constructor() {
        this.init();
    }

    init() {
        this.createExportUI();
    }

    createExportUI() {
        const btn = document.createElement('button');
        btn.className = 'player-control-btn';
        btn.innerHTML = '<i class="fas fa-download"></i>';
        btn.title = 'Export Stats';
        btn.onclick = () => this.showExportOptions();

        const playerControls = document.querySelector('.player-controls');
        if (playerControls) {
            playerControls.appendChild(btn);
        }

        const panel = document.createElement('div');
        panel.id = 'exportPanel';
        panel.className = 'export-panel hidden';
        panel.innerHTML = `
            <div class="export-options">
                <h4>Export Statistics</h4>
                <button class="btn-secondary" onclick="statsExport.exportAsJSON()">Export as JSON</button>
                <button class="btn-secondary" onclick="statsExport.exportAsCSV()">Export as CSV</button>
                <button class="btn-secondary" onclick="statsExport.exportAsHTML()">Export as HTML</button>
            </div>
        `;
        document.body.appendChild(panel);
    }

    showExportOptions() {
        document.getElementById('exportPanel').classList.toggle('hidden');
    }

    exportAsJSON() {
        const stats = this.getStatistics();
        const dataStr = JSON.stringify(stats, null, 2);
        this.downloadFile(dataStr, 'statistics.json', 'application/json');
    }

    exportAsCSV() {
        const stats = this.getStatistics();
        let csv = 'Metric,Value\n';
        Object.entries(stats).forEach(([key, value]) => {
            csv += `"${key}","${value}"\n`;
        });
        this.downloadFile(csv, 'statistics.csv', 'text/csv');
    }

    exportAsHTML() {
        const stats = this.getStatistics();
        let html = `<html><head><title>Statistics</title></head><body>
            <h1>TuneLocal Statistics</h1>
            <table border="1">
                <tr><th>Metric</th><th>Value</th></tr>`;
        Object.entries(stats).forEach(([key, value]) => {
            html += `<tr><td>${key}</td><td>${value}</td></tr>`;
        });
        html += `</table></body></html>`;
        this.downloadFile(html, 'statistics.html', 'text/html');
    }

    getStatistics() {
        try {
            const history = JSON.parse(localStorage.getItem('musicHistory') || '[]');
            return {
                totalPlays: history.length,
                favoriteArtist: this.getTopArtist(history),
                favoriteGenre: this.getTopGenre(history),
                totalListeningTime: this.getTotalTime(history),
                exportDate: new Date().toISOString()
            };
        } catch (e) {
            return {};
        }
    }

    getTopArtist(history) {
        const counts = {};
        history.forEach(h => {
            counts[h.artist] = (counts[h.artist] || 0) + 1;
        });
        return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    }

    getTopGenre(history) {
        const counts = {};
        history.forEach(h => {
            counts[h.genre] = (counts[h.genre] || 0) + 1;
        });
        return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    }

    getTotalTime(history) {
        const total = history.reduce((sum, h) => sum + (h.duration || 0), 0);
        return `${Math.floor(total / 3600)}h ${Math.floor((total % 3600) / 60)}m`;
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        if (typeof showNotification === 'function') {
            showNotification('File downloaded!', 'success');
        }
    }
}

const statsExport = new StatisticsExport();
window.statsExport = statsExport;
