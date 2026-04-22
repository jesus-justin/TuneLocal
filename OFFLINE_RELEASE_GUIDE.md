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

- `release/TuneLocal-offline-2026.04.22.zip`

## Deploy Locally (XAMPP)

1. Extract the ZIP.
2. Copy extracted `TuneLocal` folder to:
   - `C:\xampp\htdocs\TuneLocal`
3. Start Apache and MySQL in XAMPP.
4. Import database:
   - Open `http://localhost/phpmyadmin`
   - Create database `tunelocal`
   - Import `database/tunelocal.sql`
5. Open app:
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

- `release/TuneLocal-offline-2026.04.22.zip`

Recommended release notes snippet:

- "This artifact is offline-ready for local/XAMPP deployment. CDN runtime dependencies are vendorized."
