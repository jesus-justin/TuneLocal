// Smart Notification System
class SmartNotificationSystem {
    constructor() {
        this.notifications = [];
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createNotificationCenter();
        this.startNotificationSchedule();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .notification-center { position: fixed; top: 100px; right: 340px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.5rem; max-width: 300px; z-index: 946; backdrop-filter: blur(10px); max-height: 500px; overflow-y: auto; }
            .notification-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
            .notification-center-title { color: var(--primary-color); font-weight: bold; font-size: 14px; }
            .notification-badge { background: #ef4444; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 11px; }
            .notification-item { background: rgba(0, 0, 0, 0.2); border-left: 3px solid var(--primary-color); border-radius: 6px; padding: 0.75rem; margin-bottom: 0.75rem; animation: slideIn 0.3s; }
            .notification-item.new { border-left-color: #10b981; }
            .notification-item.release { border-left-color: #f59e0b; }
            .notification-type { display: inline-block; background: var(--primary-color); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 9px; margin-bottom: 0.5rem; }
            .notification-msg { color: var(--text-primary); font-size: 12px; margin-bottom: 0.5rem; }
            .notification-time { color: var(--text-secondary); font-size: 10px; }
            .notification-action { margin-top: 0.5rem; }
            .notification-btn { background: rgba(29, 185, 84, 0.1); border: 1px solid var(--primary-color); color: var(--primary-color); padding: 0.35rem 0.75rem; border-radius: 4px; font-size: 10px; cursor: pointer; margin-right: 0.5rem; transition: all 0.2s; }
            .notification-btn:hover { background: var(--primary-color); color: white; }
            .notification-empty { color: var(--text-secondary); font-size: 12px; text-align: center; padding: 2rem 1rem; }
            @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        `;
        document.head.appendChild(style);
    }
    
    createNotificationCenter() {
        const center = document.createElement('div');
        center.className = 'notification-center';
        center.innerHTML = `
            <div class="notification-header">
                <span class="notification-center-title">🔔 Notifications</span>
                <span class="notification-badge" id="notificationCount">0</span>
            </div>
            <div id="notificationList"></div>
        `;
        document.body.appendChild(center);
    }
    
    startNotificationSchedule() {
        // Simulate receiving notifications
        setTimeout(() => this.addNotification('New Release', 'Your favorite artist dropped a new album!', 'release'), 5000);
        setTimeout(() => this.addNotification('Recommended', 'Try "Evening Vibes" playlist', 'recommended'), 10000);
        setTimeout(() => this.addNotification('Friend Activity', 'Alex liked your playlist', 'social'), 15000);
    }
    
    addNotification(type, message, category) {
        const notification = {
            id: Date.now(),
            type,
            message,
            category,
            time: new Date().toLocaleTimeString()
        };
        
        this.notifications.unshift(notification);
        this.renderNotifications();
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            this.removeNotification(notification.id);
        }, 8000);
    }
    
    removeNotification(id) {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.renderNotifications();
    }
    
    renderNotifications() {
        const list = document.getElementById('notificationList');
        const count = document.getElementById('notificationCount');
        
        count.textContent = this.notifications.length;
        
        if (this.notifications.length === 0) {
            list.innerHTML = '<div class="notification-empty">All caught up! 🎉</div>';
            return;
        }
        
        list.innerHTML = this.notifications.map(n => `
            <div class="notification-item ${n.category}">
                <span class="notification-type">${n.type}</span>
                <div class="notification-msg">${n.message}</div>
                <div class="notification-time">${n.time}</div>
                <div class="notification-action">
                    <button class="notification-btn">View</button>
                    <button class="notification-btn" onclick="this.closest('.notification-item').parentElement.removeChild(this.closest('.notification-item'))">✕</button>
                </div>
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SmartNotificationSystem();
});
