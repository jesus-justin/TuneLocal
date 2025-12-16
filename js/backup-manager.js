/**
 * TuneLocal Backup & Recovery System
 * Local backup and recovery of user data
 */

class BackupManager {
    constructor() {
        this.backups = [];
        this.maxBackups = 5;
        this.load();
    }

    /**
     * Create full backup
     */
    createBackup(name = null) {
        const backup = {
            id: this.generateId(),
            name: name || `Backup ${new Date().toLocaleString()}`,
            timestamp: Date.now(),
            data: {
                playlists: localStorage.getItem('tunelocal_playlists'),
                savedSongs: localStorage.getItem('tunelocal_saved_songs'),
                preferences: localStorage.getItem('tunelocal_preferences'),
                equalizer: localStorage.getItem('tunelocal_equalizer'),
                sleepTimer: localStorage.getItem('tunelocal_sleep_timer'),
                language: localStorage.getItem('tunelocal_language'),
                theme: localStorage.getItem('tunelocal_theme'),
                recentlyPlayed: localStorage.getItem('tunelocal_recently_played'),
                stats: localStorage.getItem('tunelocal_stats'),
                recommendations: localStorage.getItem('tunelocal_recommendations')
            }
        };

        this.backups.unshift(backup);

        // Keep only max backups
        if (this.backups.length > this.maxBackups) {
            this.backups = this.backups.slice(0, this.maxBackups);
        }

        this.save();
        return backup;
    }

    /**
     * Restore backup
     */
    restore(backupId) {
        const backup = this.backups.find(b => b.id === backupId);
        if (!backup) {
            console.error('Backup not found:', backupId);
            return false;
        }

        try {
            Object.entries(backup.data).forEach(([key, value]) => {
                if (value) {
                    localStorage.setItem(`tunelocal_${key.replace(/([A-Z])/g, '_$1').toLowerCase()}`, value);
                }
            });

            return true;
        } catch (e) {
            console.error('Failed to restore backup:', e);
            return false;
        }
    }

    /**
     * Get all backups
     */
    getBackups() {
        return this.backups;
    }

    /**
     * Delete backup
     */
    deleteBackup(backupId) {
        this.backups = this.backups.filter(b => b.id !== backupId);
        this.save();
    }

    /**
     * Export backup
     */
    exportBackup(backupId) {
        const backup = this.backups.find(b => b.id === backupId);
        if (!backup) return;

        const blob = new Blob([JSON.stringify(backup, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tunelocal_backup_${backup.id}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Import backup from file
     */
    importBackup(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const backup = JSON.parse(e.target.result);
                    
                    // Validate backup
                    if (!backup.id || !backup.data) {
                        throw new Error('Invalid backup format');
                    }

                    this.backups.unshift(backup);
                    if (this.backups.length > this.maxBackups) {
                        this.backups = this.backups.slice(0, this.maxBackups);
                    }

                    this.save();
                    resolve(backup);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };

            reader.readAsText(file);
        });
    }

    /**
     * Auto-backup on schedule
     */
    setupAutoBackup(intervalMinutes = 60) {
        // Create initial backup
        this.createBackup('Auto-backup');

        // Setup interval
        setInterval(() => {
            this.createBackup(`Auto-backup ${new Date().toLocaleTimeString()}`);
        }, intervalMinutes * 60 * 1000);
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Load backups from localStorage
     */
    load() {
        try {
            const saved = localStorage.getItem('tunelocal_backups');
            if (saved) {
                this.backups = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load backups:', e);
        }
    }

    /**
     * Save backups to localStorage
     */
    save() {
        try {
            localStorage.setItem('tunelocal_backups', JSON.stringify(this.backups));
        } catch (e) {
            console.error('Failed to save backups:', e);
        }
    }

    /**
     * Get backup size in bytes
     */
    getBackupSize(backup) {
        return new Blob([JSON.stringify(backup)]).size;
    }

    /**
     * Get formatted backup size
     */
    getFormattedSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
}

// Global instance
const backupManager = new BackupManager();

// Setup auto-backup on startup
document.addEventListener('DOMContentLoaded', () => {
    // Create initial backup if none exists
    if (backupManager.getBackups().length === 0) {
        backupManager.createBackup('Initial backup');
    }
});

/**
 * Render backups UI
 */
function renderBackupsUI(containerId = 'backups-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const backups = backupManager.getBackups();

    if (backups.length === 0) {
        container.innerHTML = '<p class="text-muted">No backups created yet</p>';
        return;
    }

    container.innerHTML = `
        <div class="backups-list">
            <div class="backups-actions">
                <button class="btn btn-primary" onclick="createNewBackup()">
                    <i class="fas fa-plus"></i> Create Backup
                </button>
                <button class="btn btn-secondary" onclick="openImportDialog()">
                    <i class="fas fa-upload"></i> Import
                </button>
            </div>

            <div class="backups-items">
                ${backups.map(backup => `
                    <div class="backup-item">
                        <div class="backup-info">
                            <h4>${backup.name}</h4>
                            <small>
                                ${new Date(backup.timestamp).toLocaleString()} 
                                (${backupManager.getFormattedSize(backupManager.getBackupSize(backup))})
                            </small>
                        </div>
                        <div class="backup-actions">
                            <button class="btn-icon" onclick="restoreBackup('${backup.id}')" title="Restore">
                                <i class="fas fa-redo"></i>
                            </button>
                            <button class="btn-icon" onclick="exportBackupFile('${backup.id}')" title="Export">
                                <i class="fas fa-download"></i>
                            </button>
                            <button class="btn-icon danger" onclick="deleteBackupConfirm('${backup.id}')" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Create new backup
 */
function createNewBackup() {
    const name = prompt('Backup name (optional):');
    if (name !== null) {
        backupManager.createBackup(name || null);
        renderBackupsUI();
        showNotification('Backup created successfully', 'success');
    }
}

/**
 * Restore backup confirmation
 */
function restoreBackup(backupId) {
    if (confirm('Are you sure you want to restore this backup? Current data may be overwritten.')) {
        if (backupManager.restore(backupId)) {
            showNotification('Backup restored successfully', 'success');
            setTimeout(() => location.reload(), 1000);
        } else {
            showNotification('Failed to restore backup', 'error');
        }
    }
}

/**
 * Export backup
 */
function exportBackupFile(backupId) {
    backupManager.exportBackup(backupId);
    showNotification('Backup exported', 'success');
}

/**
 * Delete backup confirmation
 */
function deleteBackupConfirm(backupId) {
    if (confirm('Are you sure you want to delete this backup?')) {
        backupManager.deleteBackup(backupId);
        renderBackupsUI();
        showNotification('Backup deleted', 'success');
    }
}

/**
 * Open import dialog
 */
function openImportDialog() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                await backupManager.importBackup(file);
                renderBackupsUI();
                showNotification('Backup imported successfully', 'success');
            } catch (error) {
                showNotification(`Import failed: ${error.message}`, 'error');
            }
        }
    };
    
    input.click();
}
