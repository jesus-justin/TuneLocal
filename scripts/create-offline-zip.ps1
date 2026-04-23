param(
    [string]$Version = "offline-2026.04.22",
    [string]$OutputDir = "release"
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$stagingRoot = Join-Path $repoRoot "release\_staging"
$packageRoot = Join-Path $stagingRoot "TuneLocal-offline-$Version"
$appFolder = Join-Path $packageRoot "TuneLocal"
$engineFolder = Join-Path $packageRoot "Engine"
$zipName = "TuneLocal-offline-$Version-desktop.zip"
$zipPath = Join-Path $repoRoot (Join-Path $OutputDir $zipName)

if (Test-Path $stagingRoot) {
    Remove-Item -Recurse -Force $stagingRoot
}

if (-not (Test-Path (Join-Path $repoRoot $OutputDir))) {
    New-Item -ItemType Directory -Path (Join-Path $repoRoot $OutputDir) | Out-Null
}

New-Item -ItemType Directory -Path $packageRoot -Force | Out-Null
New-Item -ItemType Directory -Path $appFolder -Force | Out-Null
New-Item -ItemType Directory -Path $engineFolder -Force | Out-Null

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
    Copy-Item -Recurse -Force -Path $_.FullName -Destination $appFolder
}

$engineBat = @"
@echo off
setlocal

set "APP_NAME=TuneLocal"
set "PKG_DIR=%~dp0..\TuneLocal"
set "XAMPP_DIR=C:\xampp"
set "HTDOCS_DIR=%XAMPP_DIR%\htdocs"
set "TARGET_DIR=%HTDOCS_DIR%\%APP_NAME%"
set "LOCAL_URL=http://localhost/%APP_NAME%/"

echo ==========================================
echo   TuneLocal Launcher
echo ==========================================

if not exist "%XAMPP_DIR%\apache_start.bat" (
  echo ERROR: XAMPP not found at %XAMPP_DIR%
  echo Install XAMPP first: https://www.apachefriends.org/
  pause
  exit /b 1
)

if not exist "%PKG_DIR%\index.php" (
  echo ERROR: App files not found in package path:
  echo %PKG_DIR%
  pause
  exit /b 1
)

if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"

echo Copying TuneLocal files to %TARGET_DIR% ...
xcopy "%PKG_DIR%\*" "%TARGET_DIR%\" /E /I /Y /Q >nul
if errorlevel 1 (
  echo ERROR: Failed to copy app files into htdocs.
  pause
  exit /b 1
)

start "" "%XAMPP_DIR%\apache_start.bat"
start "" "%XAMPP_DIR%\mysql_start.bat"

echo Starting app in browser...
timeout /t 4 /nobreak >nul
start "" "%LOCAL_URL%"

echo.
echo TuneLocal is running at: %LOCAL_URL%
echo If login/database fails, import:
echo %TARGET_DIR%\database\tunelocal.sql
echo.
pause
"@

$engineBatPath = Join-Path $engineFolder "Start-TuneLocal.bat"
Set-Content -Path $engineBatPath -Value $engineBat -Encoding Ascii

$rootBat = @"
@echo off
setlocal
call "%~dp0Engine\Start-TuneLocal.bat"
"@
Set-Content -Path (Join-Path $packageRoot "TuneLocal.bat") -Value $rootBat -Encoding Ascii

$launcherCode = @"
using System;
using System.Drawing;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Threading;
using System.Windows.Forms;

public static class Program
{
    private const string AppName = "TuneLocal";

    private static void CopyDirectory(string sourceDir, string targetDir)
    {
        Directory.CreateDirectory(targetDir);

        foreach (var file in Directory.GetFiles(sourceDir))
        {
            var targetFile = Path.Combine(targetDir, Path.GetFileName(file));
            File.Copy(file, targetFile, true);
        }

        foreach (var dir in Directory.GetDirectories(sourceDir))
        {
            var targetSubDir = Path.Combine(targetDir, Path.GetFileName(dir));
            CopyDirectory(dir, targetSubDir);
        }
    }

    private static void StartProcessIfExists(string filePath)
    {
        if (!File.Exists(filePath))
        {
            return;
        }

        Process.Start(new ProcessStartInfo
        {
            FileName = filePath,
            UseShellExecute = true,
            WindowStyle = ProcessWindowStyle.Minimized
        });
    }

    private static bool WaitForUrl(string url, int attempts, int delayMs)
    {
        for (int i = 0; i < attempts; i++)
        {
            try
            {
                var request = WebRequest.Create(url);
                request.Timeout = 2000;
                using (var response = request.GetResponse())
                {
                    return true;
                }
            }
            catch
            {
                Thread.Sleep(delayMs);
            }
        }

        return false;
    }

    [STAThread]
    public static void Main()
    {
        string baseDir = AppDomain.CurrentDomain.BaseDirectory;
        string packageAppDir = Path.Combine(baseDir, "TuneLocal");
        string xamppDir = @"C:\xampp";
        string htdocsDir = Path.Combine(xamppDir, "htdocs");
        string targetDir = Path.Combine(htdocsDir, AppName);
        string apacheStart = Path.Combine(xamppDir, "apache_start.bat");
        string mysqlStart = Path.Combine(xamppDir, "mysql_start.bat");
        string appUrl = "http://localhost/" + AppName + "/";

        if (!File.Exists(apacheStart))
        {
            MessageBox.Show(
                "XAMPP not found at C:\\xampp.\nInstall XAMPP first from https://www.apachefriends.org/",
                "TuneLocal",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error
            );
            return;
        }

        if (!Directory.Exists(packageAppDir) || !File.Exists(Path.Combine(packageAppDir, "index.php")))
        {
            MessageBox.Show(
                "Packaged app files were not found. Expected folder: " + packageAppDir,
                "TuneLocal",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error
            );
            return;
        }

        try
        {
            CopyDirectory(packageAppDir, targetDir);
        }
        catch (Exception ex)
        {
            MessageBox.Show(
                "Could not copy app files to htdocs:\n" + ex.Message,
                "TuneLocal",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error
            );
            return;
        }

        StartProcessIfExists(apacheStart);
        StartProcessIfExists(mysqlStart);

        WaitForUrl(appUrl, 15, 1000);

        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);

        Form form = new Form
        {
            Text = "TuneLocal Desktop",
            Width = 1280,
            Height = 820,
            StartPosition = FormStartPosition.CenterScreen,
            MinimumSize = new Size(980, 640)
        };

        WebBrowser browser = new WebBrowser
        {
            Dock = DockStyle.Fill,
            ScriptErrorsSuppressed = true,
            Url = new Uri(appUrl)
        };

        form.Controls.Add(browser);
        Application.Run(form);
    }
}
"@

$exePath = Join-Path $packageRoot "TuneLocal.exe"
$compiled = $false

try {
    Add-Type -TypeDefinition $launcherCode -Language CSharp -ReferencedAssemblies "System.Windows.Forms.dll", "System.Drawing.dll" -OutputType WindowsApplication -OutputAssembly $exePath
    $compiled = Test-Path $exePath
} catch {
    $compiled = $false
}

if (-not $compiled) {
    Write-Warning "Could not compile TuneLocal.exe launcher. Falling back to TuneLocal.bat only."
}

if (Test-Path $zipPath) {
    Remove-Item -Force $zipPath
}

Compress-Archive -Path "$packageRoot\*" -DestinationPath $zipPath -CompressionLevel Optimal

Remove-Item -Recurse -Force $stagingRoot

Write-Host "Created offline release ZIP: $zipPath"
