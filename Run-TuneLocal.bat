@echo off
setlocal

set "APP_NAME=TuneLocal"
set "SRC_DIR=%~dp0"
set "XAMPP_DIR=C:\xampp"
set "HTDOCS_DIR=%XAMPP_DIR%\htdocs"
set "TARGET_DIR=%HTDOCS_DIR%\%APP_NAME%"
set "LOCAL_URL=http://localhost/%APP_NAME%/"

echo ==========================================
echo   TuneLocal One-Click Launcher
    echo ==========================================

echo [1/5] Checking XAMPP installation...
if not exist "%XAMPP_DIR%\apache_start.bat" (
  echo ERROR: XAMPP not found at %XAMPP_DIR%
  echo.
  echo Install XAMPP first, then run this launcher again.
  echo Download: https://www.apachefriends.org/
  pause
  exit /b 1
)

echo [2/5] Preparing app folder in htdocs...
if /I not "%SRC_DIR:~-1%"=="\" set "SRC_DIR=%SRC_DIR%\"

if /I "%SRC_DIR%"=="%TARGET_DIR%\" (
  echo App is already in %TARGET_DIR%
) else (
  if not exist "%HTDOCS_DIR%" (
    echo ERROR: htdocs directory not found at %HTDOCS_DIR%
    pause
    exit /b 1
  )

  if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"

  echo Copying files to %TARGET_DIR% ...
  xcopy "%SRC_DIR%*" "%TARGET_DIR%\" /E /I /Y /Q >nul
  if errorlevel 1 (
    echo ERROR: Failed to copy files into htdocs.
    pause
    exit /b 1
  )
)

echo [3/5] Starting Apache...
start "" "%XAMPP_DIR%\apache_start.bat"

echo [4/5] Starting MySQL...
start "" "%XAMPP_DIR%\mysql_start.bat"

echo [5/5] Opening TuneLocal in browser...
timeout /t 4 /nobreak >nul
start "" "%LOCAL_URL%"

echo.
echo TuneLocal should now be running at:
echo %LOCAL_URL%
echo.
echo If login/database fails, import:
echo %TARGET_DIR%\database\tunelocal.sql
echo.
pause
