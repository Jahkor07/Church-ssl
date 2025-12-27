@echo off
REM Open browser with a slight delay to ensure server starts
start "" http://localhost:3000
ping -n 3 127.0.0.1 > nul
npm run dev-server