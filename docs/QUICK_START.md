# TuneLocal - Quick Start Guide

## 🎯 New Features Overview

### ⌨️ Keyboard Shortcuts (Press `?` for help)
```
/ = Focus search
? = Show help
N = Home
S = Spotify
Y = YouTube  
D = Discover
O = Offline Music
P = Playlists
ESC = Close modals
SPACE = Play/Pause
```

### 🔍 Search Your Music Library
- Open "Offline Music" section
- Use the search bar to filter tracks
- Search by song name or filename
- Results appear in real-time

### 💾 Features Added
- **Error Handling** - Better error messages and logging
- **Smart Caching** - Faster responses, less server load
- **Keyboard Navigation** - Navigate with hotkeys
- **Search & Filter** - Find music quickly
- **User Preferences** - Settings saved automatically
- **API Logging** - Better debugging

### 📊 What's Different?
- ✅ No breaking changes - all existing features work
- ✅ Faster performance with caching
- ✅ Better error messages
- ✅ More keyboard shortcuts
- ✅ Search functionality
- ✅ Better code organization

## 🚀 Getting Started

1. **Access TuneLocal**
   ```
   http://localhost/TuneLocal/
   ```

2. **Try Keyboard Shortcuts**
   - Press `?` to see all shortcuts
   - Press `N` to go home
   - Press `D` to discover music

3. **Search Your Music**
   - Go to "Offline Music"
   - Type in the search bar
   - Find tracks instantly

4. **Check Error Logs** (Troubleshooting)
   - Press F12 to open DevTools
   - Open Console tab
   - Errors are logged automatically

## 💡 Tips & Tricks

### Performance
- Keyboard shortcuts are faster than clicking
- Search caches results for speed
- API responses are cached (1 hour)

### Preferences
- Your theme preference is saved
- Volume settings persist
- Other settings available in preferences manager

### Debugging
- Check browser console (F12) for error logs
- Error logs are saved in localStorage
- Export logs for troubleshooting

## 📱 Mobile Support
- All features work on mobile
- Keyboard shortcuts on physical keyboards
- Touch-friendly interface
- Responsive design

## ⚡ Performance Tips
1. Use keyboard shortcuts for faster navigation
2. Search instead of scrolling
3. Clear browser cache if having issues
4. Check localStorage usage: ~50MB max

## 🔧 Configuration

### Keyboard Shortcuts
Edit `js/keyboard-shortcuts.js` to customize

### Preferences
View current preferences:
```javascript
preferencesManager.get('theme');
```

### Cache Settings
Check cache status:
```javascript
cacheManager.getStats();
```

## 🆘 Need Help?

1. **Check the README.md** - Full documentation
2. **Read IMPROVEMENTS.md** - What's new
3. **Press F12** - Check console for errors
4. **Visit /api/test.php** - Database diagnostics
5. **Review error logs** in DevTools

## 📝 Recent Changes

### Added Files
- `js/error-handler.js` - Error tracking
- `js/cache-manager.js` - Response caching
- `js/utils.js` - Utility functions
- `js/preferences.js` - User preferences
- `js/keyboard-shortcuts.js` - Hotkeys
- `api/logger.php` - API logging
- `IMPROVEMENTS.md` - Detailed report

### Updated Files
- `index.html` - Added new scripts
- `script.js` - Search functionality
- `styles.css` - Search styling
- `README.md` - Better documentation

## 🎉 What's Next?

- Try all keyboard shortcuts
- Use search to find music
- Check error logs if needed
- Customize your preferences
- Enjoy TuneLocal! 🎶

---

**Version**: 1.1.0 (Enhanced)  
**Last Updated**: December 10, 2025

For more details, see **README.md** and **IMPROVEMENTS.md**
