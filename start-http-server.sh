#!/bin/bash
#!/usr/bin/env sh
if ! python --version >/dev/null 2>&1; then
    echo "Error: Python interpreter not found or not executable." >&2
    exit 1
fi

# --- Python is available; continue your work below ---
echo "Python is ready. Proceeding..."
# Start HTTP Server
echo "[$(date +"%Y-%m-%d %H:%M:%S")] [INFO] Starting HTTP Server..."
python -m http.server 8080
exit 0