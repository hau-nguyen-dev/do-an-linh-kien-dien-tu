@echo off
title NET Backend Server (Express + SQLite)
cd /d "%~dp0backend"
echo ========================================================
echo   NET. Tech Store Backend (Express + SQLite)
echo   Chay bang Node.js Portable: tools\node-v26.12.1-win-x64
echo ========================================================
echo.
..\tools\node-v26.12.1-win-x64\node.exe server.js
pause

