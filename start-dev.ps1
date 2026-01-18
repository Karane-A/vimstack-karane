# Vimstack SaaS - Start Development Servers
# This script starts both Laravel and Vite servers

Write-Host "Starting Vimstack SaaS Development Servers..." -ForegroundColor Cyan
Write-Host ""

# Check if PHP is available
try {
    php --version | Out-Null
} catch {
    Write-Host "✗ PHP not found! Please install PHP first." -ForegroundColor Red
    exit 1
}

# Check if Node.js is available
try {
    node --version | Out-Null
} catch {
    Write-Host "✗ Node.js not found! Please install Node.js first." -ForegroundColor Red
    exit 1
}

Write-Host "Starting servers..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Laravel Server: http://localhost:8000" -ForegroundColor Green
Write-Host "Vite Dev Server: Running on port 5173" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Start both servers concurrently
Start-Process powershell -ArgumentList "-NoExit", "-Command", "php artisan serve" -WindowStyle Normal
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Write-Host "Servers started in separate windows" -ForegroundColor Green
Write-Host ""
Write-Host "Visit: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
