/**
 * TuneLocal - Global Error Handler
 * Manages application-wide error logging and user feedback
 */

class ErrorHandler {
    constructor() {
        this.errors = [];
        this.maxErrors = 100;
        this.setupGlobalErrorHandling();
    }

    /**
     * Setup global error handling
     */
    setupGlobalErrorHandling() {
        window.addEventListener('error', (e) => {
            this.logError('JavaScript Error', e.error?.message || e.message, {
                file: e.filename,
                line: e.lineno,
                column: e.colno,
                stack: e.error?.stack
            });
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.logError('Unhandled Promise', e.reason?.message || e.reason, {
                promise: e.promise,
                reason: e.reason?.stack
            });
        });
    }

    /**
     * Log an error
     */
    logError(type, message, details = {}) {
        const error = {
            type,
            message,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            ...details
        };

        this.errors.push(error);
        
        // Keep array size manageable
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }

        // Log to console in development
        if (process.env.NODE_ENV !== 'production') {
            console.error(`[${type}] ${message}`, details);
        }

        // Store in localStorage for debugging
        this.storeErrorLog(error);
    }

    /**
     * Store error in localStorage
     */
    storeErrorLog(error) {
        try {
            const errorLogs = JSON.parse(localStorage.getItem('tunelocal_error_logs') || '[]');
            errorLogs.push(error);
            
            // Keep only last 50 errors
            if (errorLogs.length > 50) {
                errorLogs.shift();
            }
            
            localStorage.setItem('tunelocal_error_logs', JSON.stringify(errorLogs));
        } catch (e) {
            console.warn('Could not store error log:', e);
        }
    }

    /**
     * Get all stored errors
     */
    getErrorLogs() {
        try {
            return JSON.parse(localStorage.getItem('tunelocal_error_logs') || '[]');
        } catch {
            return [];
        }
    }

    /**
     * Clear error logs
     */
    clearErrorLogs() {
        localStorage.removeItem('tunelocal_error_logs');
        this.errors = [];
    }

    /**
     * Export error logs as JSON
     */
    exportErrorLogs() {
        const logs = this.getErrorLogs();
        const dataStr = JSON.stringify(logs, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tunelocal-error-logs-${Date.now()}.json`;
        link.click();
    }
}

// Initialize global error handler
const errorHandler = new ErrorHandler();
