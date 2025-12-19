# TuneLocal - Your Personal Music Hub

A feature-rich, self-hosted music streaming platform with offline capabilities, multiple music sources, and unlimited storage via MySQL.

## 🎉 NEW in 2025! - 10 Powerful Features Added
- 🎤 **Lyrics Display** - Synchronized lyrics with auto-scroll
- 📋 **Queue Management** - Drag-and-drop queue with full control
- 🌓 **Theme Scheduler** - Auto dark/light mode by time
- 📊 **Music Analytics** - Listening history & insights
- 🎚️ **Crossfade** - Smooth transitions between tracks
- ⭐ **Favorites System** - Bookmark your best tracks
- 🎯 **Mini Player** - Floating compact player
- 🎙️ **Voice Search** - Hands-free voice commands
- 💾 **Playlist Import/Export** - JSON & M3U support
- 🎛️ **Audio Effects** - Bass boost, echo, 3D sound

See [NEW_FEATURES_2025.md](NEW_FEATURES_2025.md) for complete documentation!

## ✨ Core Features

### 🎵 Music Streaming
- **Spotify Integration** - Stream playlists, albums, and tracks from Spotify
- **YouTube Music** - Watch and listen to music videos from YouTube  
- **Music Discovery** - Browse 30+ curated playlists by mood and genre
  - Happy, Chill, Sad, Energetic, Anime, Phonk, Lo-Fi, Rock, Electronic

### 📥 Offline Music
- **Upload & Store** - Upload MP3, MP4, WAV, OGG, M4A, WEBM files
- **MySQL Storage** - Unlimited storage capacity for your music library
- **Search & Filter** - Quickly find tracks in your library
- **Play Statistics** - Track play counts and last played time
- **Export** - Export individual tracks or entire library

### 🎚️ Music Management
- **Playlists** - Create and organize custom playlists
- **Saved Songs** - Auto-save recently loaded content
- **Music Downloader** - Download from YouTube using multiple services

### 🎮 User Experience
- **Dark/Light Theme** - Toggle between dark and light modes
- **Keyboard Shortcuts** - Navigate with keyboard for efficiency
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Advanced Animations** - Smooth transitions and visual effects
- **Error Handling** - Comprehensive error logging

### 🛠️ Performance
- **API Caching** - Reduces server load with intelligent caching
- **Lazy Loading** - Optimized image and content loading
- **Error Recovery** - Graceful handling of network errors
- **User Preferences** - Store and sync user settings

## 🚀 Installation

### Prerequisites
- XAMPP (Apache, PHP 7+, MySQL 8.0+)
- Modern web browser

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/jesus-justin/TuneLocal.git
cd TuneLocal
```

2. **Copy to XAMPP**
```bash
cp -r TuneLocal C:\xampp\htdocs\
```

3. **Create MySQL Database**
   - Open http://localhost/phpmyadmin
   - Click "New" to create database: `tunelocal`
   - Go to "Import" tab
   - Select `database/tunelocal.sql`
   - Click "Go"

4. **Access TuneLocal**
```
http://localhost/TuneLocal/
```

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Esc | Close modals |
| / | Focus search |
| ? | Show help |
| N | Home |
| S | Spotify |
| Y | YouTube |
| D | Discover |
| O | Offline Music |
| P | Playlists |
| Space | Play/Pause |

## 📈 Performance Tips

1. **Database Maintenance** - Optimize tables regularly
2. **Cache Management** - Responses cached for 1 hour
3. **File Management** - Max 100MB per file recommended

## 🔐 Security

- Database credentials in `api/config.php`
- Use strong passwords in production
- Implement authentication for public deployment

## 🐛 Troubleshooting

### Database connection failed
- Ensure MySQL is running
- Check database `tunelocal` exists
- Verify `api/config.php` settings
- Visit `api/test.php` for diagnostics

### Upload errors
- Check PHP upload limits
- Verify MySQL max_allowed_packet
- Check browser console (F12)

---

**Enjoy your music! 🎶**

Made with ❤️ by TuneLocal
