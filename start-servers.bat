@echo off
echo Starting Vimstack Development Servers...
echo.
echo Starting Laravel Server...
start cmd /k "cd /d %~dp0 && php artisan serve"
timeout /t 2 /nobreak >nul
echo Starting Vite Dev Server...
start cmd /k "cd /d %~dp0 && npm run dev"
echo.
echo Both servers started!
echo Laravel: http://localhost:8000
echo Vite: http://localhost:5173
echo.
echo Press any key to exit this window...
pause >nul
