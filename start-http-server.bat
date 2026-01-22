@echo off
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python interpreter not found or not executable.
    exit /b 1
)

REM --- Python is available; continue your work below ---
echo Python is ready. Proceeding...
:: Start HTTP Server
echo [%date% %time%] [INFO] Starting HTTP Server...
python -m http.server 8080
pause
