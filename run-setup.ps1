# Vimstack SaaS - Complete Setup Script
# Run this AFTER PHP and Composer are installed

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Vimstack SaaS - Complete Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check PHP
Write-Host "Checking PHP..." -ForegroundColor Yellow
try {
    $phpVersion = php --version 2>&1 | Select-Object -First 1
    Write-Host "✓ PHP found: $phpVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ PHP not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install PHP 8.2+ first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://windows.php.net/download/" -ForegroundColor White
    Write-Host "2. Extract to C:\php" -ForegroundColor White
    Write-Host "3. Add C:\php to System PATH" -ForegroundColor White
    Write-Host "4. Restart this terminal" -ForegroundColor White
    Write-Host ""
    Write-Host "Or use XAMPP: https://www.apachefriends.org/" -ForegroundColor Cyan
    exit 1
}

# Check Composer
Write-Host "Checking Composer..." -ForegroundColor Yellow
try {
    $composerVersion = composer --version 2>&1 | Select-Object -First 1
    Write-Host "✓ Composer found: $composerVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Composer not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Composer:" -ForegroundColor Yellow
    Write-Host "Download from: https://getcomposer.org/download/" -ForegroundColor White
    exit 1
}

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "All prerequisites found!" -ForegroundColor Green
Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    if (Test-Path env.template) {
        Copy-Item env.template .env
        Write-Host "✓ .env file created" -ForegroundColor Green
    } else {
        Write-Host "✗ env.template not found" -ForegroundColor Red
    }
} else {
    Write-Host "✓ .env file exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "Installing PHP dependencies (this may take a few minutes)..." -ForegroundColor Yellow
composer install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ PHP dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install PHP dependencies" -ForegroundColor Red
    Write-Host "Try: composer install --no-cache" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Checking Node.js dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✓ Node.js dependencies already installed" -ForegroundColor Green
} else {
    Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Node.js dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install Node.js dependencies" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Generating application key..." -ForegroundColor Yellow
php artisan key:generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Application key generated" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to generate application key" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Configure Database:" -ForegroundColor White
Write-Host "   Edit .env file and set your database credentials" -ForegroundColor Gray
Write-Host "   Example for MySQL:" -ForegroundColor Gray
Write-Host "   DB_CONNECTION=mysql" -ForegroundColor DarkGray
Write-Host "   DB_HOST=127.0.0.1" -ForegroundColor DarkGray
Write-Host "   DB_DATABASE=vimstack" -ForegroundColor DarkGray
Write-Host "   DB_USERNAME=root" -ForegroundColor DarkGray
Write-Host "   DB_PASSWORD=your_password" -ForegroundColor DarkGray
Write-Host ""
Write-Host "2. Start Development Servers:" -ForegroundColor White
Write-Host "   Terminal 1: php artisan serve" -ForegroundColor Cyan
Write-Host "   Terminal 2: npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Visit: http://localhost:8000" -ForegroundColor White
Write-Host "   (You'll be redirected to the web installer)" -ForegroundColor Gray
Write-Host ""
Write-Host "OR use manual setup:" -ForegroundColor White
Write-Host "   php artisan migrate" -ForegroundColor Cyan
Write-Host "   php artisan db:seed" -ForegroundColor Cyan
Write-Host ""
Write-Host "Default Login (after seeding):" -ForegroundColor Yellow
Write-Host "   Email: superadmin@example.com" -ForegroundColor White
Write-Host "   Password: password" -ForegroundColor White
Write-Host ""
