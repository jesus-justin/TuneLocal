// Advanced Queue Manager
class AdvancedQueueManager {
    constructor() {
        this.queue = ['Track 1', 'Track 2', 'Track 3', 'Track 4', 'Track 5'];
        this.currentTrack = 0;
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createQueuePanel();
        this.setupDragDrop();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .queue-manager { position: fixed; right: 20px; top: 200px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1.5rem; max-width: 300px; z-index: 993; backdrop-filter: blur(10px); }
            .queue-title { color: var(--primary-color); font-weight: bold; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; }
            .queue-item { padding: 0.75rem; background: rgba(0, 0, 0, 0.2); border-radius: 6px; margin-bottom: 0.5rem; cursor: grab; display: flex; align-items: center; gap: 0.75rem; transition: all 0.2s; border-left: 3px solid transparent; }
            .queue-item:active { cursor: grabbing; }
            .queue-item.current { border-left-color: var(--primary-color); background: rgba(29, 185, 84, 0.15); }
            .queue-item:hover { background: rgba(29, 185, 84, 0.1); }
            .queue-item.dragging { opacity: 0.5; }
            .queue-number { color: var(--text-secondary); font-size: 12px; min-width: 20px; }
            .queue-name { color: var(--text-primary); font-size: 13px; flex: 1; }
            .queue-actions { display: flex; gap: 0.5rem; }
            .queue-btn { background: none; border: none; color: var(--primary-color); cursor: pointer; font-size: 16px; }
        `;
        document.head.appendChild(style);
    }
    
    createQueuePanel() {
        const panel = document.createElement('div');
        panel.className = 'queue-manager';
        panel.id = 'queueManager';
        
        let html = '<div class="queue-title"><span>📋 Queue</span><span style="font-size: 12px; color: var(--text-secondary);">' + this.queue.length + ' tracks</span></div>';
        
        this.queue.forEach((track, idx) => {
            const current = idx === this.currentTrack ? 'current' : '';
            html += `
                <div class="queue-item ${current}" draggable="true" data-idx="${idx}">
                    <span class="queue-number">${idx + 1}</span>
                    <span class="queue-name">${track}</span>
                    <div class="queue-actions">
                        <button class="queue-btn" onclick="document.queueMgr.remove(${idx})" title="Remove">✕</button>
                    </div>
                </div>
            `;
        });
        
        panel.innerHTML = html;
        document.body.appendChild(panel);
        document.queueMgr = this;
    }
    
    setupDragDrop() {
        let draggedItem = null;
        
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('queue-item')) {
                draggedItem = e.target;
                e.target.classList.add('dragging');
            }
        });
        
        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('queue-item')) {
                e.target.classList.remove('dragging');
            }
        });
        
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = this.getDragAfterElement(e.clientY);
            if (afterElement && draggedItem) {
                afterElement.parentNode.insertBefore(draggedItem, afterElement);
            }
        });
    }
    
    getDragAfterElement(y) {
        const draggableElements = [...document.querySelectorAll('.queue-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    remove(idx) {
        this.queue.splice(idx, 1);
        document.getElementById('queueManager').remove();
        this.createQueuePanel();
        this.setupDragDrop();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AdvancedQueueManager();
});
