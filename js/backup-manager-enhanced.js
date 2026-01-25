/**
 * Backup Manager - Complete backup and restore system
 */

class BackupManager {
    constructor() {
        this.init();
    }

    init() {
        this.createBackupUI();
    }

    createBackupUI() {
        const btn = document.createElement('button');
        btn.className = 'player-control-btn';
        btn.innerHTML = '<i class="fas fa-save"></i>';
        btn.title = 'Backup & Restore';
        btn.onclick = () => this.showBackupPanel();

        const playerControls = document.querySelector('.player-controls');
        if (playerControls) {
            playerControls.appendChild(btn);
        }

        const panel = document.createElement('div');
        panel.id = 'backupPanel';
        panel.className = 'backup-panel hidden';
        panel.innerHTML = `
            <div class="backup-controls">
                <h4><i class="fas fa-save"></i> Backup & Restore</h4>
                <button class="btn-primary" onclick="backupManager.createBackup()">
                    <i class="fas fa-save"></i> Create Backup
                </button>
                <button class="btn-secondary" onclick="backupManager.restoreBackup()">
                    <i class="fas fa-upload"></i> Restore
                </button>
                <div id="backupList"></div>
            </div>
        `;
        document.body.appendChild(panel);
    }

    showBackupPanel() {
        const panel = document.getElementById('backupPanel');
        panel.classList.toggle('hidden');
        this.listBackups();
    }

    createBackup() {
        const backup = {
            timestamp: new Date().toISOString(),
            data: {
                playlists: localStorage.getItem('playlists'),
                history: localStorage.getItem('musicHistory'),
                favorites: localStorage.getItem('favorites'),
                preferences: localStorage.getItem('userPreferences'),
                queue: localStorage.getItem('musicQueue'),
                library: localStorage.getItem('offlineMusicLibrary')
            }
        };

        const backups = JSON.parse(localStorage.getItem('backups') || '[]');
        backups.push(backup);
        localStorage.setItem('backups', JSON.stringify(backups));

        // Also download as file
        const dataStr = JSON.stringify(backup, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tunelocal-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();

        if (typeof showNotification === 'function') {
            showNotification('Backup created and downloaded!', 'success');
        }
    }

    restoreBackup() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const backup = JSON.parse(event.target.result);
                        this.restoreData(backup);
                    } catch (err) {
                        if (typeof showNotification === 'function') {
                            showNotification('Invalid backup file', 'error');
                        }
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    restoreData(backup) {
        const data = backup.data;
        if (data.playlists) localStorage.setItem('playlists', data.playlists);
        if (data.history) localStorage.setItem('musicHistory', data.history);
        if (data.favorites) localStorage.setItem('favorites', data.favorites);
        if (data.preferences) localStorage.setItem('userPreferences', data.preferences);
        if (data.queue) localStorage.setItem('musicQueue', data.queue);
        if (data.library) localStorage.setItem('offlineMusicLibrary', data.library);

        if (typeof showNotification === 'function') {
            showNotification('Backup restored successfully!', 'success');
        }
    }

    listBackups() {
        try {
            const backups = JSON.parse(localStorage.getItem('backups') || '[]');
            const list = document.getElementById('backupList');
            
            if (backups.length === 0) {
                list.innerHTML = '<p>No backups yet</p>';
                return;
            }

            list.innerHTML = backups.map((b, i) => `
                <div class="backup-item">
                    <span>${new Date(b.timestamp).toLocaleString()}</span>
                    <button class="btn-secondary" onclick="backupManager.downloadBackup(${i})">Download</button>
                </div>
            `).join('');
        } catch (e) {}
    }

    downloadBackup(index) {
        try {
            const backups = JSON.parse(localStorage.getItem('backups') || '[]');
            const backup = backups[index];
            const dataStr = JSON.stringify(backup, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tunelocal-backup-${backup.timestamp.split('T')[0]}.json`;
            a.click();
        } catch (e) {}
    }
}

const backupManager = new BackupManager();
window.backupManager = backupManager;
