param(
    [string]$Version = "offline-2026.04.22",
    [string]$OutputDir = "release"
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$stagingRoot = Join-Path $repoRoot "release\_staging"
$packageRoot = Join-Path $stagingRoot "TuneLocal"
$zipName = "TuneLocal-$Version.zip"
$zipPath = Join-Path $repoRoot (Join-Path $OutputDir $zipName)

if (Test-Path $stagingRoot) {
    Remove-Item -Recurse -Force $stagingRoot
}

if (-not (Test-Path (Join-Path $repoRoot $OutputDir))) {
    New-Item -ItemType Directory -Path (Join-Path $repoRoot $OutputDir) | Out-Null
}

New-Item -ItemType Directory -Path $packageRoot -Force | Out-Null

$exclude = @(
    ".git",
    ".qodo",
    "release",
    "scripts",
    "node_modules"
)

Get-ChildItem -Path $repoRoot -Force | Where-Object {
    $name = $_.Name
    -not ($exclude -contains $name)
} | ForEach-Object {
    Copy-Item -Recurse -Force -Path $_.FullName -Destination $packageRoot
}

if (Test-Path $zipPath) {
    Remove-Item -Force $zipPath
}

Compress-Archive -Path "$packageRoot\*" -DestinationPath $zipPath -CompressionLevel Optimal

Remove-Item -Recurse -Force $stagingRoot

Write-Host "Created offline release ZIP: $zipPath"
