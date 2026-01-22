# Requires PowerShell 3.0+
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Error "Error: Python interpreter not found or not executable."
    exit 1
}

# --- Python is available; continue your work below ---
Write-Output "Python is ready. Proceeding..."
# Start HTTP Server
Write-Host "[$(Get-Date -Format "yyyy-MM-dd HH:mm:ss")] [INFO] Starting HTTP Server..."
python -m http.server 8080
pause