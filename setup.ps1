# Vimstack SaaS - Windows Setup Script
# This script helps set up the development environment

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Vimstack SaaS - Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check PHP
Write-Host "Checking PHP..." -ForegroundColor Yellow
try {
    $phpVersion = php --version 2>&1 | Select-Object -First 1
    Write-Host "✓ PHP found: $phpVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ PHP not found. Please install PHP 8.2+ and add it to PATH." -ForegroundColor Red
    Write-Host "  Download from: https://windows.php.net/download/" -ForegroundColor Yellow
    exit 1
}

# Check Composer
Write-Host "Checking Composer..." -ForegroundColor Yellow
try {
    $composerVersion = composer --version 2>&1 | Select-Object -First 1
    Write-Host "✓ Composer found: $composerVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Composer not found. Please install Composer." -ForegroundColor Red
    Write-Host "  Download from: https://getcomposer.org/download/" -ForegroundColor Yellow
    exit 1
}

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 18+." -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm found: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found." -ForegroundColor Red
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
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "Installing PHP dependencies..." -ForegroundColor Yellow
composer install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ PHP dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install PHP dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install Node.js dependencies" -ForegroundColor Red
    exit 1
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
Write-Host "1. Edit .env file and configure your database" -ForegroundColor White
Write-Host "2. Run: php artisan migrate" -ForegroundColor White
Write-Host "3. Run: php artisan db:seed" -ForegroundColor White
Write-Host "4. Start servers:" -ForegroundColor White
Write-Host "   Terminal 1: php artisan serve" -ForegroundColor White
Write-Host "   Terminal 2: npm run dev" -ForegroundColor White
Write-Host "5. Visit: http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "Or use the web installer at: http://localhost:8000/setup" -ForegroundColor Cyan
Write-Host ""
