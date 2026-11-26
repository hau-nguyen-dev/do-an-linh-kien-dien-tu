@echo off
title NET Backend Server (Express + SQLite)
cd /d "%~dp0backend"
echo ========================================================
echo   NET. Tech Store Backend (Express + SQLite)
echo ========================================================
echo.

if exist "%~dp0tools\node-v26.12.1-win-x64\node.exe" goto :run_portable
where node >nul 2>nul
if %errorlevel% equ 0 goto :run_system

echo [LOI] Khong tim thay Node.js tren he thong!
echo Vui long cai dat Node.js phien ban 22.13+ hoac 24 LTS tu https://nodejs.org/
echo Hoac xem muc 2 trong file README.md de duoc huong dan chi tiet.
goto :end

:run_portable
echo [Thong bao] Dang chay bang Node.js Portable tai tools\...
"%~dp0tools\node-v26.12.1-win-x64\node.exe" server.js
goto :end

:run_system
echo [Thong bao] Dang chay bang Node.js da cai dat tren may...
node server.js

:end
pause

