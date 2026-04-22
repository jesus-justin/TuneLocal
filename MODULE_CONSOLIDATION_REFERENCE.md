# TuneLocal Module Consolidation - Quick Reference Card

**Use this to quickly see what happens to each of the 155+ JS files.**

---

## KEEP: 15 Canonical Modules (to be created)

| # | Module | Purpose | Merge FROM | Status |
|---|---|---|---|---|
| 1 | `js/core/player.js` | Playback control | enhanced-player, mini-player, floating-mini-player, offline-player-enhanced, mobile-player | ⏳ TODO |
| 2 | `js/core/queue.js` | Queue management | queue-manager, advanced-queue-manager, collaborative-queue, music-queue-visualizer | ⏳ TODO |
| 3 | `js/core/search.js` | Music search | advanced-search, advanced-search-autocomplete, search-dropdown, search-history, search-history-tracker | ⏳ TODO |
| 4 | `js/core/discover.js` | Discovery & recommendations | advanced-discover, music-discovery, music-discovery-feed, trending-tracks | ⏳ TODO |
| 5 | `js/core/playlist.js` | Playlist CRUD | playlist-import-export, playlist-reorder-manager, playlist-smart-shuffle | ⏳ TODO |
| 6 | `js/core/offline.js` | Offline sync & cache | offline-sync, cache-manager, cache-optimizer | ⏳ TODO |
| 7 | `js/core/downloader.js` | Download manager | download-manager, batch-download-manager, download-progress-tracker | ⏳ TODO |
| 8 | `js/core/audio.js` | Equalizer & effects | equalizer, enhanced-equalizer, music-equalizer, equalizer-presets-manager, audio-effects, audio-quality-selector | ⏳ TODO |
| 9 | `js/core/notifications.js` | User notifications | notification-system, smart-notification-system, toast-notifications, notification-audio-cues | ⏳ TODO |
| 10 | `js/core/lyrics.js` | Lyrics display & sync | lyrics-display, lyrics-enhancer, realtime-lyrics-sync | ⏳ TODO |
| 11 | `js/core/visualizer.js` | Audio visualization | visualizer, advanced-visualizer, sound-visualization, waveform-visualizer | ⏳ TODO |
| 12 | `js/core/library.js` | Music library | music-database, library-manager, music-history, favorites, recently-played | ⏳ TODO |
| 13 | `js/core/auth.js` | Auth & preferences | session-manager, preferences, settings-manager | ⏳ TODO |
| 14 | `js/core/accessibility.js` | A11y & keyboard | keyboard-shortcuts, global-keyboard-shortcuts, accessibility-features | ⏳ TODO |
| 15 | `js/core/errors.js` | Error handling | error-handler, error-recovery | ⏳ TODO |
| **KEEP** | `js/utils.js` | Helper utilities | quick-actions + existing utils | ✓ MERGE |

---

## REMOVE: 100+ Modules (categorized)

### 🗑️ Tier 3: Remove Entirely

#### AI & Recommendations (offline-incompatible)
- ❌ `ai-search-engine.js` - AI search (no offline backend)
- ❌ `ai-recommendations.js` - AI suggestions
- ❌ `song-recommender-ai.js` - AI recommendations
- ❌ `recommendation-engine.js` - Base recommendations
- ❌ `recommendations.js` - Recommendations variant
- ❌ `voice-search.js` - Voice input (niche, offline-incompatible)
- ❌ `voice-control.js` - Voice commands (niche, offline-incompatible)

#### Analytics & Tracking (non-core, bloated)
- ❌ `stats-dashboard.js` - Statistics dashboard
- ❌ `analytics-dashboard.js` - Analytics view
- ❌ `listening-time-tracker.js` - Time tracking
- ❌ `listening-heatmap.js` - Heatmap calendar
- ❌ `listening-stats-calendar.js` - Calendar view
- ❌ `listening-stats-exporter.js` - Export stats
- ❌ `statistics-export.js` - General export
- ❌ `activity-dashboard.js` - Activity feed
- ❌ `weekly-digest.js` - Weekly summary
- ❌ `listening-mood-analyzer.js` - Mood tracking
- ❌ `mood-detector.js` - Mood detection

#### Social & Collaboration (offline-incompatible, requires backend)
- ❌ `collaborative-playlists.js` - Shared playlists
- ❌ `playlist-collaboration.js` - Collaborative editing
- ❌ `collaborative-queue.js` - Multi-user queue
- ❌ `user-profiles.js` - User profile pages
- ❌ `social-share-manager.js` - Social media sharing
- ❌ `social-sharing.js` - Sharing UI
- ❌ `share-manager.js` - Share functionality
- ❌ `user-badges-achievements.js` - Achievement system

#### Games & Entertainment (bloat, niche)
- ❌ `music-memory-game.js` - Memory game
- ❌ `music-trivia.js` - Trivia game
- ❌ `music-karaoke.js` - Karaoke mode
- ❌ `music-journal.js` - Music diary
- ❌ `music-podcast-integration.js` - Podcast support
- ❌ `concert-event-finder.js` - Concert finder (requires API)
- ❌ `artist-radio-stations.js` - Artist radio

#### Backup & Duplicate Managers
- ❌ `backup-manager.js` - Backup creation
- ❌ `backup-manager-enhanced.js` - Enhanced backup (use offline sync instead)

#### Audio Analysis (weak offline, specialized)
- ❌ `audio-fingerprinting.js` - Audio identification (requires API)
- ❌ `bpm-detector.js` - Tempo detection
- ❌ `color-palette-extractor.js` - Color extraction (cosmetic)
- ❌ `music-taste-profile.js` - Taste analysis

#### Batch Operations
- ❌ `batch-operations.js` - Batch processing (merge into downloader/playlist)

#### Scheduled/Timer Features
- ❌ `playlist-scheduler.js` - Scheduled playback
- ❌ `smart-wake-alarm.js` - Wake alarm (niche)
- ❌ `sleep-timer-widget.js` - Sleep timer (niche, can be settings option)
- ❌ `sleep-timer.js` - Sleep timer (duplicate)

#### Misc Special Purpose
- ❌ `setlist-creator.js` - Setlist creation
- ❌ `music-timeline.js` - Timeline visualization
- ❌ `playlist-analytics.js` - Playlist stats (merge into library)
- ❌ `playlist-quick-preview.js` - Quick preview (merge into playlist UI)
- ❌ `auto-playlist-generator.js` - Auto-generated playlists (no backend)

#### Gesture & Touch
- ❌ `gesture-controls.js` - Touch gestures (handle via CSS/accessibility)

---

### 🎨 Tier 3: Animation/Effect Spam (Remove 15+ modules)

**Remove entire category** (gratuitous visual polish, accessibility issues, performance cost):

- ❌ `cursor-particle-trail.js` - Particle cursor trail (distraction, performance)
- ❌ `cursor-trail.js` - Cursor trail (duplicate)
- ❌ `card-3d-effects.js` - 3D card transforms (gimmick)
- ❌ `card-parallax.js` - Parallax cards (janky on mobile)
- ❌ `card-tilt-3d.js` - Card tilt (gimmick)
- ❌ `floating-music-notes.js` - Animated notes (distraction)
- ❌ `particle-system.js` - General particles (used only for effects)
- ❌ `glassmorphism-ui.js` - Glassmorphic design (trendy, inconsistent)
- ❌ `morphing-menu-icon.js` - Animated menu (nice but not essential)
- ❌ `parallax-scrolling.js` - Parallax scroll (jank on mobile, a11y issue)
- ❌ `animated-gradients.js` - Gradient animations (use CSS only)
- ❌ `animated-counters.js` - Counter animations (cosmetic)
- ❌ `animated-svg-icons.js` - SVG animations (use FA icons as-is)
- ❌ `enhanced-animated-tooltips.js` - Animated tooltips (use plain tooltips)

**Keep** (essential UX):
- ✓ `button-ripple-effects.js` - Material design ripple
- ✓ `page-transitions.js` + `section-transitions.js` + `smooth-mode-transitions.js` → merged to animations
- ✓ `scroll-animations.js` - Fade-in on scroll (good UX)
- ✓ `scroll-progress-indicator.js` - Scroll progress bar (useful)
- ✓ `top-progress-bar.js` - Loading bar (shows state)
- ✓ `skeleton-loaders.js` - Loading skeletons (perceived performance)
- ✓ `stagger-animations.js` - List load animation (helps perception)

---

### 🔧 Module Status Legend

| Symbol | Meaning |
|--------|---------|
| ✓ | Keep (no changes) |
| ⏳ | TODO - Need to create/consolidate |
| ❌ | Remove entirely |
| ⚠️ | Deprecate (keep stub for compat, plan removal) |

---

## Migration Checklist: Files to Create

```
js/
├── core/                    ← NEW FOLDER
│   ├── player.js           ⏳ Consolidate 8 player files
│   ├── queue.js            ⏳ Consolidate 4 queue files
│   ├── search.js           ⏳ Consolidate 4+ search files
│   ├── discover.js         ⏳ Consolidate 4 discover files
│   ├── playlist.js         ⏳ Consolidate 6+ playlist files
│   ├── offline.js          ⏳ Consolidate 3+ offline files
│   ├── downloader.js       ⏳ Consolidate 3 download files
│   ├── audio.js            ⏳ Consolidate 6 audio files
│   ├── notifications.js    ⏳ Consolidate 3 notification files
│   ├── lyrics.js           ⏳ Consolidate 4 lyrics files
│   ├── visualizer.js       ⏳ Consolidate 4 visualizer files
│   ├── library.js          ⏳ Consolidate 5 library files
│   ├── auth.js             ⏳ Consolidate 3 auth files
│   ├── accessibility.js    ⏳ Consolidate 3+ a11y files
│   └── errors.js           ⏳ Consolidate 2 error files
├── utils.js                ✓ Keep (merge quick-actions.js)
├── animations.js           ⏳ NEW - consolidated animations
├── components.js           ⏳ NEW - component library
├── main.js                 ✓ Keep (update to load core modules)
└── [ALL OTHER FILES]       ❌ DELETE after backward compat validation
```

---

## CSS Files: Consolidation

### Keep & Merge Into Design System

```
css/
├── core/                   ← NEW FOLDER
│   ├── design-system.css   ⏳ NEW - tokens, colors, typography
│   ├── player.css          ⏳ From mobile-player.css, enhanced-player styles
│   ├── queue.css           ⏳ Consolidated queue styles
│   ├── downloader.css      ⏳ Download UI
│   ├── audio.css           ⏳ Equalizer + effects UI
│   ├── notifications.css   ⏳ Toast + alert styles
│   ├── lyrics.css          ⏳ Lyrics display
│   ├── visualizer.css      ⏳ Visualizer UI
│   ├── animations.css      ⏳ Transitions + scroll animations
│   └── components.css      ⏳ Button, input, modal, card styles
├── theme-scheduler.css     ⚠️ Merge theme logic into settings
├── custom-scrollbar.css    ⚠️ Merge into design-system.css
├── music-animations.css    ⚠️ Merge into animations.css
├── progress-bar.css        ⚠️ Merge into components.css
└── styles.css              ✓ Keep (main styles, reference design-system)
```

---

## Timeline: What Gets Done When

### Week 1-2: Foundation (Critical Path)
- [ ] Create `js/core/player.js` → test playback
- [ ] Create `js/core/queue.js` → test queue ops
- [ ] Create `js/core/offline.js` → test sync
- [ ] Create `js/core/library.js` → test library ops

### Week 2-3: Search & Discovery (Parallel)
- [ ] Create `js/core/search.js` → test keyword search
- [ ] Create `js/core/discover.js` → test categories
- [ ] Create `js/core/playlist.js` → test CRUD

### Week 3-4: Support Modules (Parallel)
- [ ] Create `js/core/audio.js` → test EQ
- [ ] Create `js/core/downloader.js` → test downloads
- [ ] Create `js/core/notifications.js` → test toasts
- [ ] Create `js/core/lyrics.js` → test lyrics
- [ ] Create `js/core/visualizer.js` → test viz
- [ ] Create `js/core/auth.js` → test auth
- [ ] Create `js/core/accessibility.js` → test a11y
- [ ] Create `js/core/errors.js` → test error handling

### Week 4-5: Cleanup (Sequential)
- [ ] Create deprecation shims (backward compat)
- [ ] Test all pages with new modules
- [ ] Fix cross-module dependencies
- [ ] Delete old files only after validation

---

## Integration Checklist (Before Deletion)

Before **deleting** any old file, ensure:
- [ ] Corresponding canonical module created
- [ ] Unit tests written and passing
- [ ] Backward compat shim created (optional)
- [ ] No references in HTML or other JS
- [ ] DevTools network tab shows no 404s
- [ ] Feature works end-to-end
- [ ] No console errors

Only **then** safe to delete:
- [ ] Remove shim
- [ ] Delete old file
- [ ] Commit as "cleanup: remove $oldModule"

---

## Questions to Ask During Migration

1. **Scope creep**: Any modules in the "REMOVE" list that should actually stay?
2. **Backward compat**: Do we need deprecation period, or hard break?
3. **Testing**: Should we write unit tests during consolidation or after?
4. **Documentation**: Keep detailed migration notes for future reference?

---

**Print this reference. Update as you consolidate each module.**

Last Updated: April 22, 2026
