/**
 * Error Recovery System - Auto-recovery from errors
 */

class ErrorRecoverySystem {
    constructor() {
        this.retryAttempts = 3;
        this.retryDelay = 1000; // 1 second
        this.init();
    }

    init() {
        this.setupErrorHandlers();
    }

    setupErrorHandlers() {
        window.addEventListener('error', (e) => {
            this.handleError(e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.handleError(e.reason);
        });
    }

    handleError(error) {
        console.error('Error caught:', error);
        
        // Try to recover
        if (error.message.includes('network') || error.message.includes('offline')) {
            this.retryNetworkOperation();
        } else if (error.message.includes('storage')) {
            this.recoverFromStorageError();
        }
    }

    async retryNetworkOperation(operation = null, attempts = 0) {
        if (attempts >= this.retryAttempts) {
            if (typeof showNotification === 'function') {
                showNotification('Network operation failed after retries', 'error');
            }
            return false;
        }

        await this.delay(this.retryDelay * Math.pow(2, attempts));
        
        if (navigator.onLine) {
            if (typeof showNotification === 'function') {
                showNotification('Connection restored, retrying...', 'success');
            }
            return true;
        }

        return this.retryNetworkOperation(operation, attempts + 1);
    }

    recoverFromStorageError() {
        try {
            // Try to clean up old cache
            const cache = JSON.parse(localStorage.getItem('appCache') || '{}');
            const cleaned = Object.keys(cache).length > 100;
            
            if (cleaned) {
                localStorage.setItem('appCache', JSON.stringify({}));
                if (typeof showNotification === 'function') {
                    showNotification('Cache cleared to free space', 'info');
                }
            }
        } catch (e) {
            console.error('Storage recovery failed:', e);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getRecoveryStats() {
        return {
            retryAttempts: this.retryAttempts,
            retryDelay: this.retryDelay,
            status: navigator.onLine ? 'online' : 'offline'
        };
    }
}

const errorRecoverySystem = new ErrorRecoverySystem();
window.errorRecoverySystem = errorRecoverySystem;
