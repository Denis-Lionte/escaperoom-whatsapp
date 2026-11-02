@echo off
title Escape Room WhatsApp Server
echo ========================================================
echo   Starting WhatsApp Web Escape Room Server for iPad...
echo ========================================================
echo.
cd /d "%~dp0"

echo Finding your computer's local IP address...
for /f "tokens=4" %%a in ('route print^|findstr 0.0.0.0.*0.0.0.0') do (
    set LOCAL_IP=%%a
)

echo.
echo ========================================================
echo   OPEN THIS ON YOUR IPAD IN SAFARI:
echo   http://%LOCAL_IP%:5000
echo ========================================================
echo.
echo Tip: In iPad Safari, tap [Share] -^> [Add to Home Screen]
echo Then triple-click power button for Guided Access (Kiosk).
echo.
echo Press Ctrl+C in this window anytime to stop the server.
echo.

npx --yes serve dist -l 5000
pause

