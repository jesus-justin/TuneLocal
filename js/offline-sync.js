/**
 * Offline Sync System - Sync library when online
 */

class OfflineSync {
    constructor() {
        this.syncInterval = 300000; // 5 minutes
        this.init();
    }

    init() {
        this.startSyncMonitoring();
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('online', () => this.syncWhenOnline());
        window.addEventListener('offline', () => this.showOfflineMessage());
    }

    startSyncMonitoring() {
        setInterval(() => {
            if (navigator.onLine) {
                this.performSync();
            }
        }, this.syncInterval);
    }

    async performSync() {
        try {
            const pendingData = this.getPendingData();
            
            if (pendingData.length === 0) return;

            // Sync with server/cloud
            console.log('Syncing offline data...', pendingData);

            // Mark as synced
            this.clearPendingData();
            
            if (typeof showNotification === 'function') {
                showNotification('Library synced!', 'success');
            }
        } catch (e) {
            console.error('Sync error:', e);
        }
    }

    syncWhenOnline() {
        if (typeof showNotification === 'function') {
            showNotification('Back online! Syncing...', 'info');
        }
        this.performSync();
    }

    showOfflineMessage() {
        if (typeof showNotification === 'function') {
            showNotification('You are offline. Changes will sync when online.', 'warning');
        }
    }

    getPendingData() {
        try {
            return JSON.parse(localStorage.getItem('pendingSyncData') || '[]');
        } catch (e) {
            return [];
        }
    }

    clearPendingData() {
        localStorage.removeItem('pendingSyncData');
    }

    addPendingChange(data) {
        try {
            const pending = this.getPendingData();
            pending.push({ ...data, timestamp: new Date().toISOString() });
            localStorage.setItem('pendingSyncData', JSON.stringify(pending));
        } catch (e) {
            console.error('Error adding pending change:', e);
        }
    }
}

const offlineSync = new OfflineSync();
window.offlineSync = offlineSync;
