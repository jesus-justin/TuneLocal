// Social Media Share Manager
class SocialShareManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createShareButton();
        this.createShareModal();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .share-btn { position: fixed; bottom: 200px; right: 20px; background: linear-gradient(135deg, var(--primary-color), #4ade80); color: white; width: 56px; height: 56px; border-radius: 50%; border: none; cursor: pointer; font-size: 24px; box-shadow: 0 4px 20px rgba(29, 185, 84, 0.4); transition: all 0.3s; z-index: 991; }
            .share-btn:hover { transform: scale(1.1); box-shadow: 0 6px 30px rgba(29, 185, 84, 0.6); }
            .share-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0); background: rgba(20, 20, 20, 0.98); border-radius: 16px; padding: 2rem; z-index: 1100; backdrop-filter: blur(20px); border: 1px solid rgba(29, 185, 84, 0.2); transition: transform 0.3s; max-width: 400px; width: 90%; }
            .share-modal.active { transform: translate(-50%, -50%) scale(1); }
            .share-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.7); z-index: 1099; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
            .share-overlay.active { opacity: 1; pointer-events: all; }
            .share-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
            .share-title { color: var(--text-primary); font-weight: bold; font-size: 18px; }
            .share-close { background: transparent; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer; }
            .share-platforms { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
            .share-platform { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.25rem; border-radius: 12px; cursor: pointer; transition: all 0.3s; border: 1px solid rgba(255, 255, 255, 0.1); }
            .share-platform:hover { transform: translateY(-4px); }
            .share-platform.twitter { background: linear-gradient(135deg, #1DA1F2, #0d8bd9); }
            .share-platform.facebook { background: linear-gradient(135deg, #1877F2, #0d5fb8); }
            .share-platform.whatsapp { background: linear-gradient(135deg, #25D366, #1da851); }
            .share-platform.telegram { background: linear-gradient(135deg, #0088cc, #006699); }
            .share-platform.reddit { background: linear-gradient(135deg, #FF4500, #cc3700); }
            .share-platform.email { background: linear-gradient(135deg, #EA4335, #c5331f); }
            .share-icon { font-size: 32px; margin-bottom: 0.5rem; }
            .share-label { color: white; font-size: 12px; font-weight: 500; }
            .share-track-info { background: rgba(0, 0, 0, 0.2); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; text-align: center; }
            .share-track-name { color: var(--primary-color); font-weight: bold; margin-bottom: 0.25rem; }
            .share-track-artist { color: var(--text-secondary); font-size: 14px; }
        `;
        document.head.appendChild(style);
    }
    
    createShareButton() {
        const btn = document.createElement('button');
        btn.className = 'share-btn';
        btn.innerHTML = '📤';
        btn.onclick = () => this.showModal();
        document.body.appendChild(btn);
    }
    
    createShareModal() {
        const overlay = document.createElement('div');
        overlay.className = 'share-overlay';
        overlay.id = 'shareOverlay';
        overlay.onclick = () => this.hideModal();
        
        const modal = document.createElement('div');
        modal.className = 'share-modal';
        modal.id = 'shareModal';
        modal.innerHTML = `
            <div class="share-header">
                <span class="share-title">Share Your Music</span>
                <button class="share-close" onclick="document.querySelector('#shareOverlay').click()">×</button>
            </div>
            <div class="share-track-info">
                <div class="share-track-name">Currently Playing</div>
                <div class="share-track-artist">TuneLocal - Your Music Platform</div>
            </div>
            <div class="share-platforms">
                <div class="share-platform twitter" onclick="window.open('https://twitter.com/intent/tweet?text=Check out this track on TuneLocal!', '_blank')">
                    <div class="share-icon">🐦</div>
                    <div class="share-label">Twitter</div>
                </div>
                <div class="share-platform facebook" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=tunelocal.com', '_blank')">
                    <div class="share-icon">📘</div>
                    <div class="share-label">Facebook</div>
                </div>
                <div class="share-platform whatsapp" onclick="window.open('https://wa.me/?text=Check out TuneLocal!', '_blank')">
                    <div class="share-icon">💬</div>
                    <div class="share-label">WhatsApp</div>
                </div>
                <div class="share-platform telegram" onclick="window.open('https://t.me/share/url?url=tunelocal.com', '_blank')">
                    <div class="share-icon">✈️</div>
                    <div class="share-label">Telegram</div>
                </div>
                <div class="share-platform reddit" onclick="window.open('https://reddit.com/submit?url=tunelocal.com', '_blank')">
                    <div class="share-icon">🤖</div>
                    <div class="share-label">Reddit</div>
                </div>
                <div class="share-platform email" onclick="window.location='mailto:?subject=Check out TuneLocal&body=I found this amazing music platform!'">
                    <div class="share-icon">📧</div>
                    <div class="share-label">Email</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    }
    
    showModal() {
        document.getElementById('shareOverlay').classList.add('active');
        document.getElementById('shareModal').classList.add('active');
    }
    
    hideModal() {
        document.getElementById('shareOverlay').classList.remove('active');
        document.getElementById('shareModal').classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SocialShareManager();
});
