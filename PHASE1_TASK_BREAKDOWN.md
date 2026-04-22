# TuneLocal Enterprise Upgrade - Implementation Tracker

**Project**: TuneLocal Enterprise-Grade Quality Upgrade  
**Version**: 2.0.0  
**Started**: April 22, 2026  
**Target Completion**: August 2026 (16 weeks with 2-3 devs)

---

## Current Status

| Phase | Status | Progress | Owner |
|---|---|---|---|
| Phase 0: Audit | ✓ COMPLETE | 100% | Lead (Copilot) |
| Phase 1: Consolidation | ⏳ PENDING | 0% | TBD |
| Phase 2: UX/Design | ⏳ PENDING | 0% | TBD |
| Phase 3: Security | ⏳ PENDING | 0% | TBD |
| Phase 4: Offline | ⏳ PENDING | 0% | TBD |
| Phase 5: Verification | ⏳ PENDING | 0% | TBD |

---

## Phase 1: Domain Consolidation - DETAILED TASK BREAKDOWN

### Task 1.1: Player Module Consolidation
**Current Modules**: 8 files (enhanced-player.js, mini-player.js, floating-mini-player.js, offline-player-enhanced.js, mobile-player.js, etc.)  
**Target**: `js/core/player.js` + `css/core/player.css`  
**Approach**:
1. Create `js/core/player.js` with single class: `MusicPlayer`
2. Detect viewport size; render appropriate UI (full/mini/floating/mobile)
3. Merge controls: play/pause, volume, speed, progress
4. Support offline mode detection
5. Unit tests: play, pause, seek, volume, offline fallback
6. Backward compat shim: keep old files but delegate to new module
7. Update index.html to load only `player.js`

**Files to Create**: `js/core/player.js`, `css/core/player.css`  
**Files to Deprecate**: enhanced-player.js, mini-player.js, floating-mini-player.js, offline-player-enhanced.js, mobile-player.js, mobile-player.css (keep stubs)  
**Duration**: 3-4 days  
**Priority**: CRITICAL  

### Task 1.2: Queue Management Consolidation
**Current Modules**: 4 files (queue-manager.js, advanced-queue-manager.js, collaborative-queue.js, music-queue-visualizer.js)  
**Target**: `js/core/queue.js` + `css/core/queue.css`  
**Approach**:
1. Create `js/core/queue.js` with class: `QueueManager`
2. Single queue store (localStorage + in-memory)
3. Add/remove/reorder/shuffle/clear operations
4. Drag-drop reordering UI
5. Save/load queue from storage
6. Visualizer as internal rendering (not separate module)
7. Unit tests: add, remove, reorder, shuffle, save/load
8. Backward compat shims

**Files to Create**: `js/core/queue.js`, `css/core/queue.css`  
**Files to Deprecate**: queue-manager.js, advanced-queue-manager.js, collaborative-queue.js, music-queue-visualizer.js  
**Duration**: 3 days  
**Dependency**: Requires Task 1.1 (player integration)  
**Priority**: CRITICAL  

### Task 1.3: Search Module Consolidation
**Current Modules**: 4+ files (advanced-search.js, ai-search-engine.js, search-dropdown.js, voice-search.js, search-history.js)  
**Target**: `js/core/search.js`  
**Approach**:
1. Create `js/core/search.js` with class: `SearchEngine`
2. Remove AI/voice; use fuzzy matching (fuse.js or simple indexOf)
3. Search across: local library, history, playlists
4. Suggest completions based on history
5. Keep simple keyword search (no NLP)
6. Unit tests: keyword match, history tracking, suggestions
7. Backward compat shims for old modules

**Files to Create**: `js/core/search.js`  
**Files to Remove**: ai-search-engine.js, voice-search.js, voice-control.js  
**Files to Consolidate**: advanced-search.js, search-dropdown.js, search-history.js → search.js  
**Duration**: 2-3 days  
**Priority**: HIGH  

### Task 1.4: Discovery Module Consolidation
**Current Modules**: 4 files (advanced-discover.js, music-discovery.js, music-discovery-feed.js, trending-tracks.js)  
**Target**: `js/core/discover.js`  
**Approach**:
1. Create `js/core/discover.js` with class: `DiscoveryEngine`
2. Keep: category filters (mood, genre), trending tracks, static recommendations
3. Remove: AI recommendations, external API calls
4. Discovery categories: happy, chill, sad, energetic, anime, workout, pop, rock, jazz, indie
5. Each category has ~5-10 pre-curated local tracks (no external call)
6. Trending = most-played tracks from local library
7. Unit tests: filter logic, category load

**Files to Create**: `js/core/discover.js`  
**Files to Remove**: ai-recommendations.js, recommendation-engine.js, song-recommender-ai.js (too complex offline)  
**Files to Consolidate**: advanced-discover.js, music-discovery.js, music-discovery-feed.js, trending-tracks.js  
**Duration**: 2-3 days  
**Priority**: HIGH  

### Task 1.5: Playlist Management Consolidation
**Current Modules**: 6+ files (playlist-import-export.js, playlist-reorder-manager.js, auto-playlist-generator.js, playlist-analytics.js, etc.)  
**Target**: `js/core/playlist.js`  
**Approach**:
1. Create `js/core/playlist.js` with class: `PlaylistManager`
2. CRUD: create, list, load, rename, delete, add track, remove track
3. Reorder tracks (drag-drop)
4. Export as JSON
5. Import from JSON
6. Smart shuffle (shuffle + repeat logic)
7. No collaboration; no auto-generation
8. Unit tests: CRUD, reorder, import/export, shuffle

**Files to Create**: `js/core/playlist.js`  
**Files to Remove**: auto-playlist-generator.js, playlist-analytics.js, playlist-collaboration.js, collaborative-playlists.js, playlist-scheduler.js  
**Files to Consolidate**: playlist-import-export.js, playlist-reorder-manager.js, playlist-smart-shuffle.js → playlist.js  
**Duration**: 2-3 days  
**Dependency**: Requires Task 1.1 (player integration)  
**Priority**: HIGH  

### Task 1.6: Offline & Cache Consolidation
**Current Modules**: 3+ files (offline-sync.js, cache-manager.js, cache-optimizer.js, offline-player-enhanced.js)  
**Target**: `js/core/offline.js`  
**Approach**:
1. Create `js/core/offline.js` with class: `OfflineManager`
2. Manage localStorage for offline data:
   - Downloaded tracks (metadata + blob references)
   - Queue state
   - Playlists
   - Settings
3. Detect online/offline status; manage UI state
4. Sync when online (upload library changes, fetch new data)
5. Storage quota management (warn at 90%, fail at 100%)
6. Clear cache / purge operations
7. Unit tests: storage, sync, quota

**Files to Create**: `js/core/offline.js`  
**Files to Remove**: backup-manager.js, backup-manager-enhanced.js (use storage sync instead)  
**Files to Consolidate**: offline-sync.js, cache-manager.js, cache-optimizer.js  
**Duration**: 3 days  
**Dependency**: Requires library module (Task 1.12)  
**Priority**: CRITICAL (offline is a hard requirement)  

### Task 1.7: Downloader Module Consolidation
**Current Modules**: 3 files (download-manager.js, batch-download-manager.js, download-progress-tracker.js)  
**Target**: `js/core/downloader.js`  
**Approach**:
1. Create `js/core/downloader.js` with class: `Downloader`
2. Single download queue management
3. Batch operations (download multiple)
4. Progress tracking per file + overall
5. Pause/resume
6. Save metadata (title, artist, duration)
7. Integration with offline module (stores to offline cache)
8. Unit tests: single, batch, progress, pause/resume

**Files to Create**: `js/core/downloader.js`, `css/core/downloader.css`  
**Files to Consolidate**: download-manager.js, batch-download-manager.js, download-progress-tracker.js  
**Duration**: 2 days  
**Dependency**: Requires Task 1.6 (offline)  
**Priority**: HIGH  

### Task 1.8: Audio Control Module (Equalizer + Effects + Quality)
**Current Modules**: 6 files (equalizer.js, enhanced-equalizer.js, music-equalizer.js, equalizer-presets-manager.js, audio-effects.js, audio-quality-selector.js)  
**Target**: `js/core/audio.js`  
**Approach**:
1. Create `js/core/audio.js` with class: `AudioController`
2. Equalizer:
   - 10-band EQ with presets (flat, bass boost, treble boost, vocal, etc.)
   - Frequency sliders: 60Hz, 150Hz, 400Hz, 1kHz, 2.5kHz, 4kHz, 6kHz, 8kHz, 10kHz, 12kHz
   - Save/load user presets
3. Playback speed: 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x
4. Volume normalization (loudness compensation)
5. Audio effects: fade in/out, crossfade (if time allows)
6. Unit tests: preset load, frequency adjustment, speed change

**Files to Create**: `js/core/audio.js`, `css/core/audio.css`  
**Files to Remove**: audio-fingerprinting.js, bpm-detector.js, mood-detector.js, listening-mood-analyzer.js, color-palette-extractor.js (too offline-incompatible)  
**Files to Consolidate**: equalizer.js, enhanced-equalizer.js, music-equalizer.js, equalizer-presets-manager.js, audio-effects.js, audio-quality-selector.js  
**Duration**: 3 days  
**Dependency**: Requires Task 1.1 (player integration)  
**Priority**: MEDIUM  

### Task 1.9: Notification System Consolidation
**Current Modules**: 3 files (notification-system.js, smart-notification-system.js, toast-notifications.js, notification-audio-cues.js)  
**Target**: `js/core/notifications.js`  
**Approach**:
1. Create `js/core/notifications.js` with class: `NotificationManager`
2. Unified toast-based system
3. Types: info, success, warning, error
4. Auto-dismiss after 4 seconds (or manual close)
5. Queue multiple notifications (max 3 on screen)
6. Optional audio cue (single success beep, error beep)
7. Integration point for all modules: `showNotification(msg, type)`
8. Unit tests: show, queue, auto-dismiss, audio toggle

**Files to Create**: `js/core/notifications.js`, `css/core/notifications.css`  
**Files to Consolidate**: notification-system.js, smart-notification-system.js, toast-notifications.js, notification-audio-cues.js  
**Duration**: 1-2 days  
**Priority**: MEDIUM  

### Task 1.10: Lyrics Module Consolidation
**Current Modules**: 4 files (lyrics-display.js, lyrics-enhancer.js, realtime-lyrics-sync.js, lyrics-translation.js)  
**Target**: `js/core/lyrics.js`  
**Approach**:
1. Create `js/core/lyrics.js` with class: `LyricsManager`
2. Display lyrics (if available locally)
3. Sync lyrics with playback (highlight current line)
4. No translation feature (offline incompatible)
5. No enhancement (keep simple)
6. Fallback: show "No lyrics available"
7. Unit tests: display, sync, fallback

**Files to Create**: `js/core/lyrics.js`, `css/core/lyrics.css`  
**Files to Remove**: lyrics-translation.js (offline incompatible)  
**Files to Consolidate**: lyrics-display.js, lyrics-enhancer.js, realtime-lyrics-sync.js  
**Duration**: 1-2 days  
**Priority**: MEDIUM  

### Task 1.11: Visualizer Module Consolidation
**Current Modules**: 4 files (visualizer.js, advanced-visualizer.js, sound-visualization.js, waveform-visualizer.js)  
**Target**: `js/core/visualizer.js`  
**Approach**:
1. Create `js/core/visualizer.js` with class: `Visualizer`
2. Single visualizer with mode toggle:
   - Bar mode (10-20 bars, frequency-reactive)
   - Waveform mode (canvas-based)
3. Auto-pause animation if browser tab not visible (save CPU)
4. Disable visualizer option (accessibility + performance)
5. Unit tests: render, mode toggle, visibility detection

**Files to Create**: `js/core/visualizer.js`, `css/core/visualizer.css`  
**Files to Consolidate**: visualizer.js, advanced-visualizer.js, sound-visualization.js, waveform-visualizer.js  
**Duration**: 2 days  
**Priority**: LOW (cosmetic)  

### Task 1.12: Library & History Module Consolidation
**Current Modules**: 4 files (music-database.js, library-manager.js, music-history.js, favorites.js, recently-played.js)  
**Target**: `js/core/library.js`  
**Approach**:
1. Create `js/core/library.js` with class: `LibraryManager`
2. Manage user library:
   - Uploaded tracks
   - Downloaded tracks
   - Favorites (star/heart)
   - Play history (last 100 plays)
   - Recently played (last 10 unique tracks)
3. CRUD: add track metadata, remove, search, filter
4. Export library as JSON
5. Import library from JSON
6. Unit tests: add, remove, favorite, history, export/import

**Files to Create**: `js/core/library.js`  
**Files to Consolidate**: music-database.js, library-manager.js, music-history.js, favorites.js, recently-played.js  
**Files to Remove**: recently-played-widget.js (merge into library UI)  
**Duration**: 2 days  
**Dependency**: Requires Task 1.6 (offline integration)  
**Priority**: CRITICAL  

### Task 1.13: Auth & Session Management Consolidation
**Current Modules**: 2-3 files (session-manager.js, preferences.js, settings-manager.js)  
**Target**: `js/core/auth.js`  
**Approach**:
1. Create `js/core/auth.js` with class: `AuthManager`
2. Session handling:
   - Check auth on load
   - Store auth token (from cookie or localStorage)
   - Refresh token if expired
   - Logout → clear all data
3. User preferences:
   - Theme (light/dark)
   - Accent color
   - Language (future i18n)
   - Accessibility toggles
   - Volume/speed defaults
4. Persist preferences to localStorage
5. Unit tests: login, logout, token refresh, preference save/load

**Files to Create**: `js/core/auth.js`  
**Files to Consolidate**: session-manager.js, preferences.js, settings-manager.js  
**Duration**: 1-2 days  
**Dependency**: Requires Task 1.11 (theme consolidation)  
**Priority**: CRITICAL  

### Task 1.14: Accessibility & Keyboard Module Consolidation
**Current Modules**: 3 files (keyboard-shortcuts.js, global-keyboard-shortcuts.js, accessibility-features.js, gesture-controls.js)  
**Target**: `js/core/accessibility.js`  
**Approach**:
1. Create `js/core/accessibility.js` with class: `AccessibilityManager`
2. Keyboard shortcuts:
   - Space: play/pause
   - ← / → : prev/next track
   - ↑ / ↓ : volume up/down
   - M : mute
   - Q : toggle queue
   - S : toggle search
   - T : toggle theme
   - ? : show help
3. A11y toggles:
   - Reduce motion (respect CSS media query)
   - High contrast mode
   - Focus outlines
   - Screen reader friendly (ARIA)
4. Skip link (already in HTML)
5. Unit tests: keyboard events, toggle persistence

**Files to Create**: `js/core/accessibility.js`  
**Files to Consolidate**: keyboard-shortcuts.js, global-keyboard-shortcuts.js, accessibility-features.js  
**Files to Remove**: gesture-controls.js (touch support handled by CSS media queries)  
**Duration**: 2 days  
**Priority**: HIGH  

### Task 1.15: Settings & Theme Module Consolidation
**Current Modules**: 3 files (custom-themes.js, theme-scheduler.js, theme-preset-selector.js, accent-picker.js)  
**Target**: `js/core/settings.js` (merges with Task 1.13)  
**Approach**:
1. Add theme system to Auth module (Task 1.13)
2. Create unified settings UI: `pages/settings.html`
3. Sections:
   - Display: theme, accent, animations, reduce motion
   - Audio: volume default, speed default, EQ preset
   - Playback: repeat mode, shuffle, crossfade
   - Offline: storage quota, cache clear
   - Accessibility: keyboard help, a11y options
4. All settings persist to localStorage
5. Theme colors:
   - Light: white bg, dark text
   - Dark: #1a1a1a bg, light text
   - Accent: Spotify green (default), blue, purple, red, orange
6. Time-based switching (if requested): auto to dark at sunset
7. Unit tests: theme load, settings save, accent change

**Files to Create**: `pages/settings.html`, update `js/core/settings.js` in auth module  
**Files to Consolidate**: custom-themes.js, theme-scheduler.js, theme-preset-selector.js, accent-picker.js → settings in auth  
**Duration**: 2-3 days  
**Dependency**: Requires Tasks 1.1, 1.8, 1.13  
**Priority**: MEDIUM  

### Task 1.16: Error Handling Module Consolidation
**Current Modules**: 2 files (error-handler.js, error-recovery.js)  
**Target**: `js/core/errors.js`  
**Approach**:
1. Create `js/core/errors.js` with class: `ErrorManager`
2. Global error handler (uncaught exceptions)
3. Promise rejection handler
4. Network error handler (retry logic)
5. User-friendly error messages (not stack traces)
6. Log to console for debugging; no external logging
7. Graceful fallback (e.g., offline mode on network failure)
8. Unit tests: error capture, recovery, messaging

**Files to Create**: `js/core/errors.js`  
**Files to Consolidate**: error-handler.js, error-recovery.js  
**Duration**: 1 day  
**Priority**: MEDIUM  

### Task 1.17: Utility & Helpers Module
**Current Modules**: 1-2 files (utils.js, quick-actions.js)  
**Approach**:
1. Keep `js/utils.js` as-is
2. Merge `quick-actions.js` into utils
3. Export common functions:
   - formatTime(ms) → "3:45"
   - formatBytes(bytes) → "1.5 MB"
   - debounce/throttle
   - deepClone
   - findInArray
   - etc.
4. Unit tests: all helpers

**Files to Keep**: `js/utils.js` (updated)  
**Files to Consolidate**: quick-actions.js → utils.js  
**Duration**: 1 day  
**Priority**: LOW  

---

## Task Dependency Graph

```
Task 1.1 (Player) ─→ Task 1.2 (Queue) ─→ Task 1.5 (Playlist)
                  ├→ Task 1.8 (Audio)
                  └→ Task 1.11 (Visualizer)

Task 1.6 (Offline) ← Task 1.12 (Library)
                  ← Task 1.7 (Downloader)

Task 1.13 (Auth) ← Task 1.14 (Accessibility)
               ← Task 1.15 (Settings)

Task 1.3 (Search) → Task 1.4 (Discover) [independent]

Task 1.9 (Notifications) [independent, used by all]
Task 1.10 (Lyrics) [independent]
Task 1.16 (Errors) [independent]
Task 1.17 (Utils) [foundation]
```

**Critical Path**:
- Start Task 1.1 immediately
- Tasks 1.2, 1.5 depend on 1.1 (run sequentially)
- Tasks 1.12, 1.7 depend on each other (run after 1.6)
- Tasks 1.3, 1.4, 1.9, 1.10, 1.16, 1.17 can run in parallel with main path

**Recommended Parallelization** (2-3 developers):
- Dev 1: Tasks 1.1 → 1.2 → 1.5 (Player, Queue, Playlist)
- Dev 2: Tasks 1.6 → 1.12 → 1.7 (Offline, Library, Download)
- Dev 3: Tasks 1.3, 1.4, 1.9, 1.10, 1.16, 1.17 (Search, Discover, Notifications, Lyrics, Errors, Utils)
- Dev 1+2: Task 1.8 (Audio) + Task 1.13 (Auth) + Task 1.14 (Accessibility) + Task 1.15 (Settings) together

**Timeline with 2-3 devs**:
- Week 1-2: Tasks 1.1, 1.3, 1.6, 1.9 (foundation)
- Week 2-3: Tasks 1.2, 1.4, 1.7, 1.10, 1.16 (dependent modules)
- Week 3-4: Tasks 1.5, 1.8, 1.12, 1.13, 1.14 (integration)
- Week 4: Task 1.15 (Settings + Theme)
- Week 4-5: Task 1.17 (Cleanup) + Testing

---

## Quality Gates - Phase 1 Exit Criteria

Before proceeding to Phase 2, ALL of these must pass:

### Compilation & Loading
- [ ] No JavaScript syntax errors in console
- [ ] All 15 canonical modules load without errors
- [ ] No undefined function/variable references
- [ ] All backward-compat shims functional

### Functional Testing
**Player**:
- [ ] Play/pause works
- [ ] Seek works
- [ ] Volume control works
- [ ] Speed control works (0.5x - 2x)
- [ ] Offline playback works

**Queue**:
- [ ] Add track to queue
- [ ] Remove track from queue
- [ ] Reorder tracks (drag-drop)
- [ ] Clear queue
- [ ] Shuffle queue
- [ ] Save/load queue

**Search**:
- [ ] Search by song title
- [ ] Search by artist
- [ ] Search history populated
- [ ] Autocomplete works

**Discover**:
- [ ] Category filters work (mood, genre)
- [ ] Trending tracks display
- [ ] Play from discover

**Playlist**:
- [ ] Create playlist
- [ ] Add track to playlist
- [ ] Remove track from playlist
- [ ] Delete playlist
- [ ] Export playlist as JSON
- [ ] Import playlist from JSON

**Offline**:
- [ ] Offline mode detected (no network)
- [ ] App works offline (core UI loads)
- [ ] Download functionality works
- [ ] Downloaded tracks play offline

**Download**:
- [ ] Single file download
- [ ] Batch download
- [ ] Progress tracking
- [ ] Downloaded files stored locally

**Settings**:
- [ ] Theme change (light/dark)
- [ ] Accent color change
- [ ] Keyboard shortcuts work
- [ ] Settings persist across page reload

**Notifications**:
- [ ] Toast appears on action
- [ ] Toast auto-dismisses after 4s
- [ ] Multiple toasts queue
- [ ] Error toast displays

### Console & Debugging
- [ ] Zero console errors (warnings OK)
- [ ] Zero unhandled Promise rejections
- [ ] Network tab shows only expected API calls
- [ ] LocalStorage quota under 90% for test data

### Documentation
- [ ] Module source code documented (JSDoc comments)
- [ ] Phase 1 completion report generated
- [ ] Breaking changes documented
- [ ] Backward-compat shims documented

---

## Files to Delete (after Phase 1 Validation)

Once all gate criteria pass, safely remove:
- All module files listed in "Files to Consolidate" above (entire list of 100+)
- All CSS files that were merged into core CSS

**Approach**:
1. Keep deprecated shims in place for 1-2 weeks
2. Monitor error logs for deprecated module references
3. Only delete after confirming no runtime references
4. Commit deletion as separate PR

---

## Success Metrics - Phase 1

| Metric | Target | Current | Status |
|---|---|---|---|
| Modules reduced | From 155 to 15 canonical + utilities | 155 | ⏳ |
| Dead code removed | 95%+ of deprecated modules gone | 0% | ⏳ |
| File size reduction | ~40-50% JS/CSS reduction | 0% | ⏳ |
| Startup time | < 2 sec (from 3+ sec) | ~3-4s | ⏳ |
| Test coverage | 80%+ for canonical modules | 0% | ⏳ |
| Breaking changes | Clearly documented, backward compatible | - | ⏳ |

---

**Next Update**: After Task 1.1 (Player) completion
