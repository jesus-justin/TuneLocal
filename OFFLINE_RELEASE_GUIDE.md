# TuneLocal Offline Release Guide

This guide explains how to run TuneLocal completely offline from a GitHub Release ZIP.

## What Was Localized

- Font Awesome moved from CDN to local: `assets/vendor/fontawesome/`
- SweetAlert2 moved from CDN to local: `assets/vendor/sweetalert2/`
- External avatar images replaced with local SVG files in `assets/images/avatars/`
- Remote Google Fonts import removed from runtime pages and `css/styles.css`

## Build the Release ZIP

From repository root:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\create-offline-zip.ps1 -Version offline-2026.04.22
```

Output ZIP:

- `release/TuneLocal-offline-2026.04.22-desktop.zip`

## Deploy Locally (XAMPP)

1. Extract the ZIP.
2. Open the extracted folder.
3. Double-click `TuneLocal.exe`.
4. If `TuneLocal.exe` is unavailable, double-click `TuneLocal.bat`.
5. Wait for Apache/MySQL to start and browser to open automatically.
6. If Windows asks for permission, allow it.

Package layout:

- `Engine/` (launcher internals)
- `TuneLocal/` (app files)
- `TuneLocal.exe` (click-to-run launcher)
- `TuneLocal.bat` (fallback launcher)

### Manual Setup (Alternative)

1. Copy extracted `TuneLocal` folder to:
   - `C:\xampp\htdocs\TuneLocal`
2. Start Apache and MySQL in XAMPP.
3. Import database:
   - Open `http://localhost/phpmyadmin`
   - Create database `tunelocal`
   - Import `database/tunelocal.sql`
4. Open app:
   - `http://localhost/TuneLocal/`

## Offline Validation Checklist

Disconnect internet and verify:

- Login page loads
- Dashboard loads without missing CSS/JS errors
- Profile page loads
- Widgets page loads
- Local library and saved data features work
- Queue and settings interactions work

## Expected Offline Behavior

- Core app UI and local features work offline.
- Online embeds (Spotify/YouTube URLs) naturally require internet and may be unavailable when disconnected.

## GitHub Release Upload

Upload this file to your release:

- `release/TuneLocal-offline-2026.04.22-desktop.zip`

Recommended release notes snippet:

- "This artifact is offline-ready for local/XAMPP deployment. CDN runtime dependencies are vendorized."
