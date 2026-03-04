/**
 * TuneLocal Notification System
 * Toast notifications and alerts
 * Version 1.0.1 - Enhanced notification features
 */

class NotificationSystem {
    constructor() {
        this.container = null;
        this.notifications = [];
        this.init();
    }

    /**
     * Initialize notification container
     */
    init() {
        this.container = document.createElement('div');
        this.container.id = 'notifications-container';
        this.container.className = 'notifications-container';
        document.body.appendChild(this.container);
    }

    /**
     * Show notification
     */
    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = this.getIcon(type);
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.remove(notification);
        });

        this.container.appendChild(notification);
        this.notifications.push(notification);

        // Auto remove
        if (duration > 0) {
            setTimeout(() => this.remove(notification), duration);
        }

        return notification;
    }

    /**
     * Get icon for notification type
     */
    getIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    /**
     * Remove notification
     */
    remove(notification) {
        notification.classList.add('hiding');
        setTimeout(() => {
            notification.remove();
            this.notifications = this.notifications.filter(n => n !== notification);
        }, 300);
    }

    /**
     * Clear all notifications
     */
    clearAll() {
        this.notifications.forEach(n => this.remove(n));
    }
}

// Global instance
const notificationSystem = new NotificationSystem();

/**
 * Global show notification function
 */
function showNotification(message, type = 'info', duration = 3000) {
    return notificationSystem.show(message, type, duration);
}
