// Music Queue Visualizer
class MusicQueueVisualizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createWidget();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .queue-visualizer { position: fixed; left: 20px; bottom: 20px; background: linear-gradient(135deg, rgba(29, 185, 84, 0.1), rgba(29, 185, 84, 0.05)); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1rem; min-width: 220px; max-width: 280px; color: var(--text-primary); z-index: 998; }
            .queue-header { font-weight: bold; color: var(--primary-color); margin-bottom: 0.75rem; font-size: 14px; }
            .queue-item { padding: 0.5rem; background: rgba(0, 0, 0, 0.2); border-left: 3px solid transparent; border-radius: 4px; margin-bottom: 0.5rem; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; transition: all 0.2s; }
            .queue-item:nth-child(2) { border-left-color: var(--primary-color); background: rgba(29, 185, 84, 0.1); }
            .queue-item:hover { background: rgba(29, 185, 84, 0.15); }
            .queue-position { color: var(--text-secondary); font-size: 11px; }
        `;
        document.head.appendChild(style);
    }
    
    createWidget() {
        const widget = document.createElement('div');
        widget.className = 'queue-visualizer';
        widget.id = 'queueVisualizer';
        
        const mockQueue = [
            'Current Track - Now Playing',
            'Next: Song Title 1',
            'Song Title 2',
            'Song Title 3',
            'Song Title 4'
        ];
        
        let html = '<div class="queue-header">Queue (5)</div>';
        mockQueue.forEach((track, idx) => {
            html += `<div class="queue-item">${track}</div>`;
        });
        
        widget.innerHTML = html;
        document.body.appendChild(widget);
        
        // Animate items
        widget.querySelectorAll('.queue-item').forEach((item, idx) => {
            item.style.animation = `slideIn 0.4s ease ${idx * 0.1}s both`;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MusicQueueVisualizer();
});
