// Beautiful Toast Notifications System
class ToastNotifications {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createContainer();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .toast-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 3000;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            
            .toast {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 14px 18px;
                background: rgba(30, 30, 30, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(29, 185, 84, 0.4);
                border-radius: 10px;
                color: white;
                min-width: 300px;
                max-width: 450px;
                animation: toastSlideIn 0.3s ease;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
            }
            
            @keyframes toastSlideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes toastSlideOut {
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
            
            .toast.removing {
                animation: toastSlideOut 0.3s ease forwards;
            }
            
            .toast-icon {
                font-size: 18px;
                flex-shrink: 0;
            }
            
            .toast.success .toast-icon {
                color: #4ade80;
            }
            
            .toast.error .toast-icon {
                color: #ff6b6b;
            }
            
            .toast.info .toast-icon {
                color: #60a5fa;
            }
            
            .toast-message {
                flex: 1;
                font-size: 0.95rem;
            }
            
            .toast-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                font-size: 18px;
                transition: color 0.2s ease;
            }
            
            .toast-close:hover {
                color: var(--text-primary);
            }
            
            .toast-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 2px;
                background: var(--primary-color);
                animation: toastProgress 4s linear forwards;
                border-radius: 0 0 10px 0;
            }
            
            @keyframes toastProgress {
                from { width: 100%; }
                to { width: 0%; }
            }
        `;
        document.head.appendChild(style);
    }
    
    createContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        container.id = 'toastContainer';
        document.body.appendChild(container);
    }
    
    show(message, type = 'info', duration = 4000) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };
        
        toast.innerHTML = `
            <i class="toast-icon ${icons[type] || icons.info}"></i>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
            <div class="toast-progress"></div>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

window.toastNotifications = new ToastNotifications();

// Expose global function
window.showToast = (message, type = 'info') => {
    window.toastNotifications.show(message, type);
};

document.addEventListener('DOMContentLoaded', () => {
    // Test toast on page load
    window.toastNotifications.show('Welcome back to TuneLocal!', 'success', 3000);
});
