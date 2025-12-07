@echo off
REM Open browser with a slight delay to ensure server starts
start "" http://localhost:3000
timeout /t 2 /nobreak >nul
npm run dev-server