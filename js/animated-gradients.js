// Animated Gradient Backgrounds
class AnimatedGradients {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createGradientLayer();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .animated-gradient-bg { position: fixed; inset: 0; z-index: -2; overflow: hidden; }
            .gradient-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.3; }
            .gradient-blob-1 { width: 500px; height: 500px; background: linear-gradient(45deg, #1db954, #1ed760); top: -250px; left: -250px; animation: float-1 20s infinite ease-in-out; }
            .gradient-blob-2 { width: 400px; height: 400px; background: linear-gradient(135deg, #22c55e, #4ade80); bottom: -200px; right: -200px; animation: float-2 25s infinite ease-in-out; }
            .gradient-blob-3 { width: 350px; height: 350px; background: linear-gradient(90deg, #10b981, #14b8a6); top: 50%; left: 50%; transform: translate(-50%, -50%); animation: float-3 30s infinite ease-in-out; }
            @keyframes float-1 { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 33% { transform: translate(100px, 100px) rotate(120deg); } 66% { transform: translate(-50px, 150px) rotate(240deg); } }
            @keyframes float-2 { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 33% { transform: translate(-150px, -100px) rotate(-120deg); } 66% { transform: translate(80px, -80px) rotate(-240deg); } }
            @keyframes float-3 { 0%, 100% { transform: translate(-50%, -50%) scale(1); } 50% { transform: translate(-50%, -50%) scale(1.2); } }
        `;
        document.head.appendChild(style);
    }
    
    createGradientLayer() {
        const container = document.createElement('div');
        container.className = 'animated-gradient-bg';
        container.innerHTML = `
            <div class="gradient-blob gradient-blob-1"></div>
            <div class="gradient-blob gradient-blob-2"></div>
            <div class="gradient-blob gradient-blob-3"></div>
        `;
        document.body.insertBefore(container, document.body.firstChild);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AnimatedGradients();
});
