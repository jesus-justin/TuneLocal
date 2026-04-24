# TuneLocal Enterprise Overlap Audit

## Scope
- Main application interface: pages/index.html
- Widgets hub interface: pages/widgets.html
- Core runtime: js/main.js

## Objective
Reduce overlapping runtime modules, prevent duplicate initialization domains, and keep core functions stable for offline application use.

## Findings
- Main interface previously loaded many modules from the same functional domains (theme, queue, search, notifications, player enhancements).
- Mixed script path styles on main page caused invalid relative paths for multiple modules.
- Widgets page loaded main dashboard runtime, creating cross-page overlap and side-effect initialization.
- Core theme handling in main runtime referenced an out-of-scope variable and could throw at runtime.

## Remediation Applied
- Canonicalized main module list in pages/index.html to a deterministic, non-overlapping runtime profile.
- Standardized index script paths to ../js/* for correct page-relative loading.
- Isolated widgets page from dashboard runtime by replacing main.js with widgets-hub.js.
- Added js/widgets-hub.js to provide minimal hub-safe runtime (theme toggle + notifications).
- Fixed theme application resilience in js/main.js to avoid out-of-scope failures.

## Canonical Ownership (Main UI)
- Core runtime and navigation: js/main.js
- Queue domain: js/queue-manager.js
- Theme scheduling: js/theme-scheduler.js
- Preferences persistence: js/preferences.js
- Discover and search domain: js/advanced-discover.js + js/music-database.js
- Offline/download domain: js/download-manager.js + js/offline-player-enhanced.js + js/offline-sync.js
- Notifications: js/main.js showNotification

## Validation Checklist
- [x] Main page uses canonical module set.
- [x] Main page script paths are page-relative and consistent.
- [x] Widgets page is isolated from main dashboard runtime.
- [x] Theme toggle logic does not throw on missing elements.
- [ ] Manual smoke test in browser for all sections (home/spotify/youtube/discover/offline/downloader/playlists/widgets).

## Residual Risk
- Some optional enhancement modules are intentionally not loaded in main runtime to avoid overlap.
- Widgets hub still contains many independent widgets; each should remain self-contained.
