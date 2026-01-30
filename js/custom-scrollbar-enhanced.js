// Custom Scrollbar Styling
class CustomScrollbar {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            ::-webkit-scrollbar {
                width: 10px;
                height: 10px;
            }
            
            ::-webkit-scrollbar-track {
                background: rgba(30, 30, 30, 0.5);
                border-radius: 10px;
            }
            
            ::-webkit-scrollbar-thumb {
                background: linear-gradient(to bottom, #1db954, #4ade80);
                border-radius: 10px;
                transition: background 0.2s ease;
                box-shadow: inset 0 0 6px rgba(29, 185, 84, 0.3);
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(to bottom, #4ade80, #22c55e);
                box-shadow: 0 0 10px rgba(29, 185, 84, 0.6);
            }
            
            ::-webkit-scrollbar-thumb:active {
                background: linear-gradient(to bottom, #16a34a, #15803d);
            }
        `;
        document.head.appendChild(style);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CustomScrollbar();
});
