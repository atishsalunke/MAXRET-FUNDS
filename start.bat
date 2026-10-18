@echo off
title MAXRET FUNDS Launcher
echo ===================================================
echo           Starting MAXRET FUNDS Suite
echo ===================================================
echo.
echo Launching Backend (Node.js/Express) on port 5000...
start "MAXRET API Backend" cmd /k "cd /d "%~dp0backend" && node server.js"

echo Launching Frontend (React) on port 3000...
start "MAXRET Web App" cmd /k "cd /d "%~dp0frontend" && npm start"

echo.
echo ===================================================
echo Backend API : http://localhost:5000/api/health
echo Frontend App: http://localhost:3000
echo ===================================================
echo Both services are starting up in separate windows.
pause
