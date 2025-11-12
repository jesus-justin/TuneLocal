// Navigation & Section Management
document.addEventListener('DOMContentLoaded', function() {
    // Initialize
    loadSavedPlaylists();
    setupEventListeners();
    
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

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + 1-4 for quick navigation
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        const sections = ['home', 'spotify', 'youtube', 'playlists'];
        showSection(sections[parseInt(e.key) - 1]);
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

// Console welcome message
console.log('%c🎵 Welcome to TuneLocal! 🎵', 'color: #1db954; font-size: 20px; font-weight: bold;');
console.log('%cEnjoy your music streaming experience!', 'color: #667eea; font-size: 14px;');
console.log('%cKeyboard shortcuts: Ctrl/Cmd + 1-4 to navigate sections', 'color: #b3b3b3; font-size: 12px;');
