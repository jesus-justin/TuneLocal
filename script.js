// IndexedDB Setup for Offline Music
let db;
let currentPlaylist = [];
let currentTrackIndex = 0;
let isShuffling = false;
let isRepeating = false;

function initDB() {
    const request = indexedDB.open('TuneLocalDB', 1);
    
    request.onerror = function() {
        console.error('Database failed to open');
    };
    
    request.onsuccess = function() {
        db = request.result;
        loadOfflineMusic();
    };
    
    request.onupgradeneeded = function(e) {
        db = e.target.result;
        
        if (!db.objectStoreNames.contains('music')) {
            const objectStore = db.objectStore = db.createObjectStore('music', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('name', 'name', { unique: false });
            objectStore.createIndex('dateAdded', 'dateAdded', { unique: false });
        }
    };
}

// Navigation & Section Management
document.addEventListener('DOMContentLoaded', function() {
    // Initialize
    initDB();
    loadSavedPlaylists();
    loadSavedSongs();
    setupEventListeners();
    setupOfflineMusicListeners();
    
    // Smooth scroll for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
}

// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('light-theme');
    const icon = this.querySelector('i');
    
    if (document.body.classList.contains('light-theme')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

// Spotify Functions
function loadSpotify() {
    const url = document.getElementById('spotifyUrl').value.trim();
    const playerDiv = document.getElementById('spotifyPlayer');
    
    if (!url) {
        showNotification('Please enter a Spotify URL', 'error');
        return;
    }
    
    const embedUrl = convertToSpotifyEmbed(url);
    
    if (embedUrl) {
        playerDiv.innerHTML = `
            <iframe 
                style="border-radius:12px" 
                src="${embedUrl}" 
                width="100%" 
                height="400" 
                frameBorder="0" 
                allowfullscreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy">
            </iframe>
        `;
        
        // Save to saved songs
        saveSongToHistory(url, 'spotify');
        
        showNotification('Spotify content loaded successfully!', 'success');
    } else {
        showNotification('Invalid Spotify URL. Please check and try again.', 'error');
    }
}

function convertToSpotifyEmbed(url) {
    // Extract Spotify ID from various URL formats
    let match;
    
    // Standard Spotify URL: https://open.spotify.com/playlist/ID
    match = url.match(/spotify\.com\/(playlist|album|track|artist)\/([a-zA-Z0-9]+)/);
    if (match) {
        return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator`;
    }
    
    // Spotify URI: spotify:playlist:ID
    match = url.match(/spotify:(playlist|album|track|artist):([a-zA-Z0-9]+)/);
    if (match) {
        return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator`;
    }
    
    return null;
}

function loadPresetSpotify(path) {
    const playerDiv = document.getElementById('spotifyPlayer');
    const embedUrl = `https://open.spotify.com/embed/${path}?utm_source=generator`;
    
    playerDiv.innerHTML = `
        <iframe 
            style="border-radius:12px" 
            src="${embedUrl}" 
            width="100%" 
            height="400" 
            frameBorder="0" 
            allowfullscreen="" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy">
        </iframe>
    `;
    
    // Switch to Spotify section
    showSection('spotify');
    showNotification('Preset playlist loaded!', 'success');
}

// YouTube Functions
function loadYouTube() {
    const url = document.getElementById('youtubeUrl').value.trim();
    const playerDiv = document.getElementById('youtubePlayer');
    
    if (!url) {
        showNotification('Please enter a YouTube URL', 'error');
        return;
    }
    
    const embedUrl = convertToYouTubeEmbed(url);
    
    if (embedUrl) {
        playerDiv.innerHTML = `
            <iframe 
                width="100%" 
                height="500" 
                src="${embedUrl}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
                style="border-radius: 16px;">
            </iframe>
        `;
        
        // Save to saved songs
        saveSongToHistory(url, 'youtube');
        
        showNotification('YouTube video loaded successfully!', 'success');
    } else {
        showNotification('Invalid YouTube URL. Please check and try again.', 'error');
    }
}

function convertToYouTubeEmbed(url) {
    let videoId = null;
    let playlistId = null;
    
    // Extract video ID
    const videoMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (videoMatch) {
        videoId = videoMatch[1];
    }
    
    // Extract playlist ID
    const playlistMatch = url.match(/[?&]list=([^&]+)/);
    if (playlistMatch) {
        playlistId = playlistMatch[1];
    }
    
    // Build embed URL
    if (videoId) {
        let embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        if (playlistId) {
            embedUrl += `&list=${playlistId}`;
        }
        return embedUrl;
    } else if (playlistId) {
        return `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1`;
    }
    
    return null;
}

function loadPresetYouTube(url) {
    const embedUrl = convertToYouTubeEmbed(url);
    const playerDiv = document.getElementById('youtubePlayer');
    
    if (embedUrl) {
        playerDiv.innerHTML = `
            <iframe 
                width="100%" 
                height="500" 
                src="${embedUrl}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
                style="border-radius: 16px;">
            </iframe>
        `;
        
        // Switch to YouTube section
        showSection('youtube');
        showNotification('Preset video loaded!', 'success');
    }
}

// Playlist Management
function togglePlaylistForm() {
    const form = document.getElementById('playlistForm');
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        form.style.animation = 'fadeIn 0.3s ease-in-out';
    } else {
        form.style.display = 'none';
    }
}

function savePlaylist() {
    const name = document.getElementById('playlistName').value.trim();
    const url = document.getElementById('playlistUrl').value.trim();
    const type = document.getElementById('playlistType').value;
    
    if (!name || !url) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Get existing playlists
    let playlists = JSON.parse(localStorage.getItem('tunelocal_playlists') || '[]');
    
    // Add new playlist
    const playlist = {
        id: Date.now(),
        name: name,
        url: url,
        type: type,
        dateAdded: new Date().toLocaleDateString()
    };
    
    playlists.push(playlist);
    localStorage.setItem('tunelocal_playlists', JSON.stringify(playlists));
    
    // Clear form
    document.getElementById('playlistName').value = '';
    document.getElementById('playlistUrl').value = '';
    togglePlaylistForm();
    
    // Reload playlists
    loadSavedPlaylists();
    showNotification('Playlist saved successfully!', 'success');
}

function loadSavedPlaylists() {
    const playlists = JSON.parse(localStorage.getItem('tunelocal_playlists') || '[]');
    const container = document.getElementById('savedPlaylists');
    
    if (playlists.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <i class="fas fa-music" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No saved playlists yet. Add your first playlist above!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = playlists.map(playlist => `
        <div class="playlist-item" data-id="${playlist.id}">
            <div class="playlist-info">
                <i class="fab fa-${playlist.type}"></i>
                <div class="playlist-details">
                    <h4>${playlist.name}</h4>
                    <p>Added on ${playlist.dateAdded}</p>
                </div>
            </div>
            <div class="playlist-actions">
                <button class="icon-btn" onclick="playPlaylist('${playlist.url}', '${playlist.type}')" title="Play">
                    <i class="fas fa-play"></i>
                </button>
                <button class="icon-btn delete" onclick="deletePlaylist(${playlist.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function playPlaylist(url, type) {
    if (type === 'spotify') {
        document.getElementById('spotifyUrl').value = url;
        loadSpotify();
        showSection('spotify');
    } else if (type === 'youtube') {
        document.getElementById('youtubeUrl').value = url;
        loadYouTube();
        showSection('youtube');
    }
}

function deletePlaylist(id) {
    if (!confirm('Are you sure you want to delete this playlist?')) {
        return;
    }
    
    let playlists = JSON.parse(localStorage.getItem('tunelocal_playlists') || '[]');
    playlists = playlists.filter(p => p.id !== id);
    localStorage.setItem('tunelocal_playlists', JSON.stringify(playlists));
    
    loadSavedPlaylists();
    showNotification('Playlist deleted', 'success');
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#1db954' : type === 'error' ? '#ff0050' : '#667eea'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Setup Event Listeners
function setupEventListeners() {
    // Enter key support for URL inputs
    document.getElementById('spotifyUrl').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loadSpotify();
        }
    });
    
    document.getElementById('youtubeUrl').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loadYouTube();
        }
    });
    
    document.getElementById('downloadUrl').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchForDownload();
        }
    });
    
    // Form input validation
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = 'var(--primary-color)';
        });
        
        input.addEventListener('blur', function() {
            this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        });
    });
}

// Offline Music Functions
function setupOfflineMusicListeners() {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const audioPlayer = document.getElementById('audioPlayer');
    
    // File input change
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });
    
    // Audio player events
    audioPlayer.addEventListener('ended', () => {
        if (isRepeating) {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        } else {
            nextTrack();
        }
    });
    
    audioPlayer.addEventListener('play', () => {
        document.getElementById('playIcon').className = 'fas fa-pause';
    });
    
    audioPlayer.addEventListener('pause', () => {
        document.getElementById('playIcon').className = 'fas fa-play';
    });
}

function handleFileSelect(e) {
    handleFiles(e.target.files);
}

function handleFiles(files) {
    if (files.length === 0) return;
    
    Array.from(files).forEach(file => {
        if (file.type.startsWith('audio/')) {
            saveOfflineMusic(file);
        } else {
            showNotification(`${file.name} is not an audio file`, 'error');
        }
    });
}

function saveOfflineMusic(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const transaction = db.transaction(['music'], 'readwrite');
        const objectStore = transaction.objectStore('music');
        
        const musicData = {
            name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
            fileName: file.name,
            type: file.type,
            size: file.size,
            data: e.target.result,
            dateAdded: new Date().toISOString()
        };
        
        const request = objectStore.add(musicData);
        
        request.onsuccess = function() {
            showNotification(`${file.name} uploaded successfully!`, 'success');
            loadOfflineMusic();
        };
        
        request.onerror = function() {
            showNotification(`Failed to upload ${file.name}`, 'error');
        };
    };
    
    reader.readAsDataURL(file);
}

function loadOfflineMusic() {
    const transaction = db.transaction(['music'], 'readonly');
    const objectStore = transaction.objectStore('music');
    const request = objectStore.getAll();
    
    request.onsuccess = function() {
        const tracks = request.result;
        currentPlaylist = tracks;
        displayOfflineMusic(tracks);
    };
}

function displayOfflineMusic(tracks) {
    const container = document.getElementById('musicTracks');
    const trackCount = document.getElementById('trackCount');
    
    trackCount.textContent = tracks.length;
    
    if (tracks.length === 0) {
        container.innerHTML = `
            <div class="empty-library">
                <i class="fas fa-music"></i>
                <h3>Your Library is Empty</h3>
                <p>Upload your music files to start listening offline!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = tracks.map((track, index) => `
        <div class="track-item" onclick="playOfflineTrack(${track.id}, ${index})">
            <div class="track-number">${index + 1}</div>
            <i class="fas fa-music track-icon"></i>
            <div class="track-details">
                <div class="track-name">${track.name}</div>
                <div class="track-meta">
                    ${formatFileSize(track.size)} • ${new Date(track.dateAdded).toLocaleDateString()}
                </div>
            </div>
            <div class="track-actions">
                <button class="icon-btn delete" onclick="event.stopPropagation(); deleteOfflineTrack(${track.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function playOfflineTrack(id, index) {
    const transaction = db.transaction(['music'], 'readonly');
    const objectStore = transaction.objectStore('music');
    const request = objectStore.get(id);
    
    request.onsuccess = function() {
        const track = request.result;
        const audioPlayer = document.getElementById('audioPlayer');
        const nowPlayingSection = document.getElementById('nowPlayingSection');
        
        audioPlayer.src = track.data;
        audioPlayer.play();
        
        currentTrackIndex = index;
        
        // Update UI
        document.getElementById('currentTrackName').textContent = track.name;
        document.getElementById('currentTrackArtist').textContent = track.fileName;
        nowPlayingSection.style.display = 'block';
        
        // Update playing state
        document.querySelectorAll('.track-item').forEach((item, i) => {
            if (i === index) {
                item.classList.add('playing');
            } else {
                item.classList.remove('playing');
            }
        });
        
        showNotification(`Now playing: ${track.name}`, 'success');
    };
}

function togglePlay() {
    const audioPlayer = document.getElementById('audioPlayer');
    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
}

function nextTrack() {
    if (currentPlaylist.length === 0) return;
    
    if (isShuffling) {
        currentTrackIndex = Math.floor(Math.random() * currentPlaylist.length);
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % currentPlaylist.length;
    }
    
    playOfflineTrack(currentPlaylist[currentTrackIndex].id, currentTrackIndex);
}

function previousTrack() {
    if (currentPlaylist.length === 0) return;
    
    currentTrackIndex = (currentTrackIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    playOfflineTrack(currentPlaylist[currentTrackIndex].id, currentTrackIndex);
}

function toggleShuffle() {
    isShuffling = !isShuffling;
    const btn = document.getElementById('shuffleBtn');
    
    if (isShuffling) {
        btn.classList.add('active');
        showNotification('Shuffle enabled', 'success');
    } else {
        btn.classList.remove('active');
        showNotification('Shuffle disabled', 'success');
    }
}

function toggleRepeat() {
    isRepeating = !isRepeating;
    const btn = document.getElementById('repeatBtn');
    
    if (isRepeating) {
        btn.classList.add('active');
        showNotification('Repeat enabled', 'success');
    } else {
        btn.classList.remove('active');
        showNotification('Repeat disabled', 'success');
    }
}

function deleteOfflineTrack(id) {
    if (!confirm('Delete this track from your offline library?')) {
        return;
    }
    
    const transaction = db.transaction(['music'], 'readwrite');
    const objectStore = transaction.objectStore('music');
    const request = objectStore.delete(id);
    
    request.onsuccess = function() {
        showNotification('Track deleted', 'success');
        loadOfflineMusic();
        
        // Stop playback if this was the current track
        const audioPlayer = document.getElementById('audioPlayer');
        if (currentPlaylist[currentTrackIndex]?.id === id) {
            audioPlayer.pause();
            audioPlayer.src = '';
            document.getElementById('currentTrackName').textContent = 'No track playing';
            document.getElementById('currentTrackArtist').textContent = 'Select a song to play';
        }
    };
}

function clearAllOfflineMusic() {
    if (!confirm('Delete ALL tracks from your offline library? This cannot be undone!')) {
        return;
    }
    
    const transaction = db.transaction(['music'], 'readwrite');
    const objectStore = transaction.objectStore('music');
    const request = objectStore.clear();
    
    request.onsuccess = function() {
        showNotification('All tracks deleted', 'success');
        loadOfflineMusic();
        
        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.pause();
        audioPlayer.src = '';
        document.getElementById('currentTrackName').textContent = 'No track playing';
        document.getElementById('currentTrackArtist').textContent = 'Select a song to play';
        document.getElementById('nowPlayingSection').style.display = 'none';
    };
}

// Music Downloader Functions
let currentVideoUrl = '';

function searchForDownload() {
    const url = document.getElementById('downloadUrl').value.trim();
    
    if (!url) {
        showNotification('Please enter a YouTube URL', 'error');
        return;
    }
    
    // Validate YouTube URL
    const videoId = extractYouTubeVideoId(url);
    
    if (!videoId) {
        showNotification('Invalid YouTube URL. Please check and try again.', 'error');
        return;
    }
    
    currentVideoUrl = url;
    
    // Show video info section
    const videoInfoSection = document.getElementById('videoInfoSection');
    videoInfoSection.style.display = 'block';
    
    // Set thumbnail
    const thumbnail = document.getElementById('videoThumbnail');
    thumbnail.innerHTML = `<img src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" alt="Video Thumbnail" onerror="this.src='https://img.youtube.com/vi/${videoId}/hqdefault.jpg'">`;
    
    // Enable download buttons
    enableDownloadButtons();
    
    // Update UI
    document.getElementById('videoTitle').textContent = 'YouTube Video';
    document.getElementById('videoChannel').textContent = 'Video ID: ' + videoId;
    document.getElementById('videoDuration').textContent = 'Ready to download';
    
    showNotification('Video loaded! Choose a download service below.', 'success');
    
    // Scroll to download services
    document.querySelector('.download-services').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function extractYouTubeVideoId(url) {
    // Extract video ID from various YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
        /youtube\.com\/embed\/([^&\n?#]+)/,
        /youtube\.com\/v\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    
    return null;
}

function enableDownloadButtons() {
    const buttons = [
        'ytmp3Btn', 'y2mateBtn', 'loaderBtn', 
        'savefromBtn', 'mp3juiceBtn', 'yt5sBtn'
    ];
    
    buttons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) btn.disabled = false;
    });
}

function openDownloadService(service) {
    if (!currentVideoUrl) {
        showNotification('Please search for a video first', 'error');
        return;
    }
    
    const videoId = extractYouTubeVideoId(currentVideoUrl);
    let downloadUrl = '';
    
    switch(service) {
        case 'ytmp3':
            // YTBmp3 - paste URL manually
            downloadUrl = `https://ytbmp3.com/`;
            showNotification('Opening YTBmp3... Paste your YouTube URL there to download!', 'success');
            break;
        case 'y2mate':
            // YTMP3.nu
            downloadUrl = `https://ytmp3.nu/`;
            showNotification('Opening YTMP3.nu... Paste your YouTube URL there to download!', 'success');
            break;
        case 'loader':
            // Loader.to with direct URL
            downloadUrl = `https://loader.to/api/button/?url=${encodeURIComponent(currentVideoUrl)}`;
            showNotification('Opening Loader.to...', 'success');
            break;
        case 'savefrom':
            // SaveFrom.net with URL parameter
            downloadUrl = `https://en.savefrom.net/#url=${encodeURIComponent(currentVideoUrl)}`;
            showNotification('Opening SaveFrom.net...', 'success');
            break;
        case 'mp3juice':
            // MP3 Juice - search with video title or URL
            downloadUrl = `https://mp3juices.cc/`;
            showNotification('Opening MP3 Juice... Search for your song there!', 'success');
            break;
        case 'yt5s':
            // YTMP3s
            downloadUrl = `https://ytmp3s.nu/`;
            showNotification('Opening YTMP3s... Paste your YouTube URL there to download!', 'success');
            break;
        default:
            showNotification('Service not available', 'error');
            return;
    }
    
    // Open in new tab
    window.open(downloadUrl, '_blank');
    
    // Copy URL to clipboard for easy pasting
    if (navigator.clipboard) {
        navigator.clipboard.writeText(currentVideoUrl).then(() => {
            setTimeout(() => {
                showNotification('YouTube URL copied to clipboard! Paste it in the download site.', 'success');
            }, 1000);
        }).catch(() => {
            // Clipboard API failed, that's okay
        });
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + 1-7 for quick navigation
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '7') {
        e.preventDefault();
        const sections = ['home', 'spotify', 'youtube', 'saved-songs', 'offline-music', 'downloader', 'playlists'];
        showSection(sections[parseInt(e.key) - 1]);
    }
    
    // Space bar for play/pause (when not in input field)
    if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        togglePlay();
    }
});

// Easter egg - Konami code
let konamiCode = [];
const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konami.join(',')) {
        activatePartyMode();
    }
});

function activatePartyMode() {
    showNotification('🎉 Party Mode Activated! 🎉', 'success');
    document.body.style.animation = 'rainbow 2s infinite';
    
    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(rainbowStyle);
    
    setTimeout(() => {
        document.body.style.animation = '';
        rainbowStyle.remove();
    }, 10000);
}

// Saved Songs Management
function saveSongToHistory(url, type) {
    let savedSongs = JSON.parse(localStorage.getItem('tunelocal_saved_songs') || '[]');
    
    // Check if URL already exists
    const existingIndex = savedSongs.findIndex(song => song.url === url);
    
    if (existingIndex !== -1) {
        // Update timestamp and move to top
        savedSongs.splice(existingIndex, 1);
    }
    
    // Extract title from URL
    let title = extractTitleFromUrl(url, type);
    
    const savedSong = {
        id: Date.now(),
        url: url,
        type: type,
        title: title,
        dateAdded: new Date().toLocaleString()
    };
    
    // Add to beginning of array
    savedSongs.unshift(savedSong);
    
    // Keep only last 50 songs
    if (savedSongs.length > 50) {
        savedSongs = savedSongs.slice(0, 50);
    }
    
    localStorage.setItem('tunelocal_saved_songs', JSON.stringify(savedSongs));
    loadSavedSongs();
}

function extractTitleFromUrl(url, type) {
    if (type === 'spotify') {
        // Extract Spotify type and ID
        const match = url.match(/spotify\.com\/(playlist|album|track|artist)\/([a-zA-Z0-9]+)/);
        if (match) {
            const contentType = match[1].charAt(0).toUpperCase() + match[1].slice(1);
            return `Spotify ${contentType}`;
        }
    } else if (type === 'youtube') {
        // For YouTube, just indicate it's a video/playlist
        if (url.includes('list=')) {
            return 'YouTube Playlist';
        }
        return 'YouTube Video';
    }
    return `${type.charAt(0).toUpperCase() + type.slice(1)} Content`;
}

function loadSavedSongs(filter = 'all') {
    const savedSongs = JSON.parse(localStorage.getItem('tunelocal_saved_songs') || '[]');
    const container = document.getElementById('savedSongsGrid');
    
    let filteredSongs = savedSongs;
    if (filter !== 'all') {
        filteredSongs = savedSongs.filter(song => song.type === filter);
    }
    
    if (filteredSongs.length === 0) {
        container.innerHTML = `
            <div class="empty-saved-songs" style="grid-column: 1 / -1;">
                <i class="fas fa-music"></i>
                <h3>No Saved Songs Yet</h3>
                <p>Load songs from Spotify or YouTube and they'll automatically appear here!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredSongs.map(song => `
        <div class="saved-song-card" data-type="${song.type}">
            <div class="saved-song-header">
                <div class="saved-song-info">
                    <div class="saved-song-type ${song.type}">
                        <i class="fab fa-${song.type}"></i>
                        <span>${song.type.charAt(0).toUpperCase() + song.type.slice(1)}</span>
                    </div>
                    <div class="saved-song-title">${song.title}</div>
                    <div class="saved-song-date">
                        <i class="fas fa-clock"></i> ${song.dateAdded}
                    </div>
                </div>
            </div>
            <div class="saved-song-url">${truncateUrl(song.url)}</div>
            <div class="saved-song-actions">
                <button class="btn btn-primary" onclick="playSavedSong('${song.url}', '${song.type}')" style="flex: 1; justify-content: center;">
                    <i class="fas fa-play"></i> Play
                </button>
                <button class="icon-btn delete" onclick="deleteSavedSong(${song.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function truncateUrl(url) {
    if (url.length > 60) {
        return url.substring(0, 57) + '...';
    }
    return url;
}

function filterSavedSongs(filter) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.filter-btn').classList.add('active');
    
    loadSavedSongs(filter);
}

function playSavedSong(url, type) {
    if (type === 'spotify') {
        document.getElementById('spotifyUrl').value = url;
        showSection('spotify');
        
        // Load without saving again
        const embedUrl = convertToSpotifyEmbed(url);
        const playerDiv = document.getElementById('spotifyPlayer');
        playerDiv.innerHTML = `
            <iframe 
                style="border-radius:12px" 
                src="${embedUrl}" 
                width="100%" 
                height="400" 
                frameBorder="0" 
                allowfullscreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy">
            </iframe>
        `;
    } else if (type === 'youtube') {
        document.getElementById('youtubeUrl').value = url;
        showSection('youtube');
        
        // Load without saving again
        const embedUrl = convertToYouTubeEmbed(url);
        const playerDiv = document.getElementById('youtubePlayer');
        playerDiv.innerHTML = `
            <iframe 
                width="100%" 
                height="500" 
                src="${embedUrl}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
                style="border-radius: 16px;">
            </iframe>
        `;
    }
    
    showNotification('Playing saved song!', 'success');
}

function deleteSavedSong(id) {
    if (!confirm('Remove this song from saved songs?')) {
        return;
    }
    
    let savedSongs = JSON.parse(localStorage.getItem('tunelocal_saved_songs') || '[]');
    savedSongs = savedSongs.filter(song => song.id !== id);
    localStorage.setItem('tunelocal_saved_songs', JSON.stringify(savedSongs));
    
    loadSavedSongs();
    showNotification('Song removed from saved songs', 'success');
}

// Console welcome message
console.log('%c🎵 Welcome to TuneLocal! 🎵', 'color: #1db954; font-size: 20px; font-weight: bold;');
console.log('%cEnjoy your music streaming experience!', 'color: #667eea; font-size: 14px;');
console.log('%cKeyboard shortcuts: Ctrl/Cmd + 1-7 to navigate | Space to play/pause', 'color: #b3b3b3; font-size: 12px;');
