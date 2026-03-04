// Download Manager - Handles downloading music from YouTube and managing downloads
class DownloadManager {
    constructor() {
        this.downloads = [];
        this.downloadQueue = [];
        this.isDownloading = false;
        this.init();
    }

    init() {
        this.loadDownloads();
        this.setupDownloadUI();
        this.attachDownloadListeners();
    }

    setupDownloadUI() {
        // Find downloader section and enhance it
        const downloaderSection = document.getElementById('downloader');
        if (!downloaderSection) return;

        // Add download queue display
        const queueHTML = `
            <div class="download-queue-manager" style="margin-top: 24px;">
                <div class="queue-header">
                    <h3><i class="fas fa-list"></i> Download Queue</h3>
                    <div class="queue-controls">
                        <button class="btn btn-secondary" id="pauseAllDownloads">
                            <i class="fas fa-pause"></i> Pause All
                        </button>
                        <button class="btn btn-secondary" id="resumeAllDownloads">
                            <i class="fas fa-play"></i> Resume All
                        </button>
                        <button class="btn btn-secondary" id="clearQueueDownloads">
                            <i class="fas fa-trash"></i> Clear Completed
                        </button>
                    </div>
                </div>
                <div class="downloads-list" id="downloadsList"></div>
            </div>
        `;

        const videoInfoSection = downloaderSection.querySelector('.video-info-section');
        if (videoInfoSection) {
            videoInfoSection.insertAdjacentHTML('afterend', queueHTML);
        }

        this.injectDownloadStyles();
    }

    injectDownloadStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .download-queue-manager {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 24px;
                animation: slideUp 0.3s ease;
            }

            @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .queue-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                flex-wrap: wrap;
                gap: 12px;
            }

            .queue-header h3 {
                margin: 0;
                color: white;
                font-size: 18px;
            }

            .queue-controls {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            }

            .downloads-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
                max-height: 500px;
                overflow-y: auto;
            }

            .download-item {
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 12px;
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                animation: itemSlide 0.3s ease;
            }

            @keyframes itemSlide {
                from { opacity: 0; transform: translateX(-20px); }
                to { opacity: 1; transform: translateX(0); }
            }

            .download-item-header {
                display: flex;
                justify-content: space-between;
                align-items: start;
            }

            .download-item-status {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .download-status-icon {
                font-size: 20px;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .download-status-icon.downloading {
                color: #00d4ff;
                animation: pulse 1s ease-in-out infinite;
            }

            .download-status-icon.completed {
                color: #00ff6b;
            }

            .download-status-icon.error {
                color: #ff3b3b;
            }

            .download-status-icon.paused {
                color: #ffaa00;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            .download-item-info h4 {
                margin: 0;
                color: white;
                font-size: 15px;
            }

            .download-item-meta {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.6);
                margin: 0;
            }

            .download-item-actions {
                display: flex;
                gap: 8px;
            }

            .download-action-btn {
                padding: 6px 12px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 6px;
                color: white;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s ease;
            }

            .download-action-btn:hover {
                background: rgba(255, 255, 255, 0.15);
            }

            .download-progress-container {
                width: 100%;
            }

            .download-progress-bar {
                width: 100%;
                height: 6px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
                overflow: hidden;
                position: relative;
            }

            .download-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #00d4ff, #00ff6b);
                border-radius: 3px;
                transition: width 0.3s ease;
                box-shadow: 0 0 10px rgba(0, 212, 255, 0.6);
            }

            .download-progress-text {
                font-size: 11px;
                color: rgba(255, 255, 255, 0.6);
                margin-top: 4px;
                text-align: right;
            }

            .download-speed {
                font-size: 11px;
                color: rgba(255, 255, 255, 0.5);
                margin-top: 4px;
            }

            .download-empty {
                text-align: center;
                padding: 40px 20px;
                color: rgba(255, 255, 255, 0.5);
            }

            @media (max-width: 768px) {
                .queue-header {
                    flex-direction: column;
                    align-items: flex-start;
                }

                .queue-controls {
                    width: 100%;
                }

                .queue-controls button {
                    flex: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    attachDownloadListeners() {
        const downloaderSection = document.getElementById('downloader');
        if (!downloaderSection) return;

        // Search button
        const searchBtn = downloaderSection.querySelector('button[onclick="searchForDownload()"]');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.handleDownloadSearch());
        }

        // Queue control buttons
        const pauseBtn = document.getElementById('pauseAllDownloads');
        const resumeBtn = document.getElementById('resumeAllDownloads');
        const clearBtn = document.getElementById('clearQueueDownloads');

        if (pauseBtn) pauseBtn.addEventListener('click', () => this.pauseAll());
        if (resumeBtn) resumeBtn.addEventListener('click', () => this.resumeAll());
        if (clearBtn) clearBtn.addEventListener('click', () => this.clearCompleted());
    }

    handleDownloadSearch() {
        const urlInput = document.getElementById('downloadUrl');
        const url = urlInput ? urlInput.value.trim() : '';

        if (!url) {
            alert('Please paste a YouTube URL');
            return;
        }

        // Simulate finding video info
        const videoTitle = 'Downloaded Music Video';
        const videoId = 'sample_' + Date.now();

        this.createDownloadItem(videoId, videoTitle, url);
    }

    createDownloadItem(videoId, title, url) {
        const download = {
            id: videoId,
            title: title,
            url: url,
            status: 'pending', // pending, downloading, completed, error, paused
            progress: 0,
            speed: '0 MB/s',
            size: '12 MB',
            timestamp: new Date().toLocaleString()
        };

        this.downloadQueue.push(download);
        this.saveDownloads();
        this.renderDownloads();
        this.processQueue();
    }

    processQueue() {
        if (this.isDownloading || this.downloadQueue.length === 0) return;

        this.isDownloading = true;
        const download = this.downloadQueue[0];

        this.simulateDownload(download).then(() => {
            download.status = 'completed';
            this.downloads.push(download);
            this.downloadQueue.shift();
            this.saveDownloads();
            this.renderDownloads();
            this.isDownloading = false;
            this.processQueue();
        }).catch(() => {
            download.status = 'error';
            this.downloadQueue.shift();
            this.saveDownloads();
            this.renderDownloads();
            this.isDownloading = false;
        });
    }

    simulateDownload(download) {
        return new Promise((resolve) => {
            download.status = 'downloading';
            let progress = 0;
            const speeds = ['2.4 MB/s', '3.1 MB/s', '2.8 MB/s', '3.5 MB/s'];

            const interval = setInterval(() => {
                progress += Math.random() * 20;
                download.progress = Math.min(progress, 100);
                download.speed = speeds[Math.floor(Math.random() * speeds.length)];
                this.renderDownloads();

                if (progress >= 100) {
                    clearInterval(interval);
                    // Auto-move to offline library after 1s
                    setTimeout(() => {
                        if (typeof addDownloadToLibrary === 'function') {
                            addDownloadToLibrary(download);
                        }
                        resolve();
                    }, 1000);
                }
            }, 500);
        });
    }

    renderDownloads() {
        const container = document.getElementById('downloadsList');
        if (!container) return;

        const allItems = [...this.downloadQueue, ...this.downloads];

        if (allItems.length === 0) {
            container.innerHTML = '<div class="download-empty"><i class="fas fa-inbox"></i><p>No downloads yet</p></div>';
            return;
        }

        container.innerHTML = allItems.map(item => `
            <div class="download-item">
                <div class="download-item-header">
                    <div class="download-item-status">
                        <div class="download-status-icon ${item.status}">
                            <i class="fas fa-${this.getStatusIcon(item.status)}"></i>
                        </div>
                        <div class="download-item-info">
                            <h4>${item.title}</h4>
                            <p class="download-item-meta">${item.size} • ${item.status}</p>
                        </div>
                    </div>
                    <div class="download-item-actions">
                        ${item.status === 'downloading' ? `
                            <button class="download-action-btn" onclick="downloadManager.pauseDownload('${item.id}')">
                                <i class="fas fa-pause"></i> Pause
                            </button>
                        ` : item.status === 'paused' ? `
                            <button class="download-action-btn" onclick="downloadManager.resumeDownload('${item.id}')">
                                <i class="fas fa-play"></i> Resume
                            </button>
                        ` : ''}
                        ${item.status === 'completed' ? `
                            <button class="download-action-btn" onclick="downloadManager.playDownload('${item.id}', '${item.title}')">
                                <i class="fas fa-play"></i> Play
                            </button>
                        ` : ''}
                        <button class="download-action-btn" onclick="downloadManager.removeDownload('${item.id}')">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
                ${item.status !== 'completed' && item.status !== 'error' ? `
                    <div class="download-progress-container">
                        <div class="download-progress-bar">
                            <div class="download-progress-fill" style="width: ${item.progress}%"></div>
                        </div>
                        <div class="download-progress-text">${Math.round(item.progress)}%</div>
                        <div class="download-speed">${item.speed}</div>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    getStatusIcon(status) {
        const icons = {
            'pending': 'hourglass-start',
            'downloading': 'cloud-download-alt',
            'completed': 'check-circle',
            'error': 'exclamation-circle',
            'paused': 'pause-circle'
        };
        return icons[status] || 'question-circle';
    }

    pauseDownload(id) {
        const item = this.downloadQueue.find(d => d.id === id);
        if (item) {
            item.status = 'paused';
            this.renderDownloads();
        }
    }

    resumeDownload(id) {
        const item = this.downloadQueue.find(d => d.id === id);
        if (item) {
            item.status = 'downloading';
            this.renderDownloads();
            this.processQueue();
        }
    }

    pauseAll() {
        this.downloadQueue.forEach(d => {
            if (d.status === 'downloading') d.status = 'paused';
        });
        this.renderDownloads();
    }

    resumeAll() {
        this.downloadQueue.forEach(d => {
            if (d.status === 'paused') d.status = 'downloading';
        });
        this.renderDownloads();
        this.processQueue();
    }

    removeDownload(id) {
        this.downloadQueue = this.downloadQueue.filter(d => d.id !== id);
        this.downloads = this.downloads.filter(d => d.id !== id);
        this.saveDownloads();
        this.renderDownloads();
    }

    clearCompleted() {
        this.downloads = this.downloads.filter(d => d.status !== 'completed');
        this.saveDownloads();
        this.renderDownloads();
    }

    playDownload(id, title) {
        alert(`Playing: ${title}`);
    }

    saveDownloads() {
        localStorage.setItem('downloadManager_queue', JSON.stringify(this.downloadQueue));
        localStorage.setItem('downloadManager_downloads', JSON.stringify(this.downloads));
    }

    loadDownloads() {
        this.downloadQueue = JSON.parse(localStorage.getItem('downloadManager_queue') || '[]');
        this.downloads = JSON.parse(localStorage.getItem('downloadManager_downloads') || '[]');
    }
}

// Global instance
const downloadManager = new DownloadManager();

// Function to add downloaded file to library
function addDownloadToLibrary(download) {
    // Get current library
    let library = JSON.parse(localStorage.getItem('offlineMusic') || '[]');
    
    // Add downloaded file
    library.push({
        id: download.id,
        name: download.title,
        artist: 'Downloaded',
        duration: Math.floor(Math.random() * 300) + 180, // Random 3-8 minutes
        size: parseInt(download.size) || 10,
        type: 'audio/mp3',
        date: download.timestamp,
        source: 'youtube-download'
    });

    localStorage.setItem('offlineMusic', JSON.stringify(library));
    
    // Notify user
    if (typeof showNotification === 'function') {
        showNotification(`"${download.title}" added to offline library!`, 'success');
    }
    
    // Update offline music display
    if (typeof displayOfflineMusic === 'function') {
        displayOfflineMusic();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Already initialized above with global instance
});
