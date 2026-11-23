@echo off
title 3-Year Anniversary Experience - Kyan & Alin
echo ========================================================
echo   Launching 3-Year Anniversary Experience...
echo   Surabaya to Bandung • November 24, 2026
echo ========================================================
cd /d "%~dp0"
start "" http://localhost:3000
python -m http.server 3000
pause
