# Vimstack SaaS - PHP & Composer Auto-Installer
# This script helps download and set up PHP and Composer

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PHP & Composer Auto-Installer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "Warning: This script may need Administrator rights for some operations" -ForegroundColor Yellow
    Write-Host ""
}

# Check for existing PHP
Write-Host "Checking for PHP..." -ForegroundColor Yellow
$phpFound = $false
try {
    $phpVersion = php --version 2>&1 | Select-Object -First 1
    if ($phpVersion -match "PHP") {
        Write-Host "PHP already installed: $phpVersion" -ForegroundColor Green
        $phpFound = $true
    }
} catch {
    Write-Host "✗ PHP not found in PATH" -ForegroundColor Red
}

# Check for existing Composer
Write-Host "Checking for Composer..." -ForegroundColor Yellow
$composerFound = $false
try {
    $composerVersion = composer --version 2>&1 | Select-Object -First 1
    if ($composerVersion -match "Composer") {
        Write-Host "Composer already installed: $composerVersion" -ForegroundColor Green
        $composerFound = $true
    }
} catch {
    Write-Host "✗ Composer not found in PATH" -ForegroundColor Red
}

Write-Host ""

if ($phpFound -and $composerFound) {
    Write-Host "PHP and Composer are already installed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run: .\run-setup.ps1" -ForegroundColor Cyan
    exit 0
}

# Installation options
Write-Host "Installation Options:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option 1: XAMPP (Recommended for beginners)" -ForegroundColor Yellow
Write-Host "  - Includes PHP, MySQL, Apache" -ForegroundColor Gray
Write-Host "  - Easy to install and use" -ForegroundColor Gray
Write-Host "  - Download: https://www.apachefriends.org/" -ForegroundColor White
Write-Host ""
Write-Host "Option 2: Laragon (Recommended for Laravel)" -ForegroundColor Yellow
Write-Host "  - Includes PHP, MySQL, Composer" -ForegroundColor Gray
Write-Host "  - Great for Laravel development" -ForegroundColor Gray
Write-Host "  - Download: https://laragon.org/" -ForegroundColor White
Write-Host ""
Write-Host "Option 3: Manual PHP Installation" -ForegroundColor Yellow
Write-Host "  - Download PHP: https://windows.php.net/download/" -ForegroundColor White
Write-Host "  - Download Composer: https://getcomposer.org/download/" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Choose option (1/2/3) or press Enter to open download pages"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Opening XAMPP download page..." -ForegroundColor Yellow
        Start-Process "https://www.apachefriends.org/download.html"
        Write-Host ""
        Write-Host "After installing XAMPP:" -ForegroundColor Cyan
        Write-Host "1. Add C:\xampp\php to your System PATH" -ForegroundColor White
        Write-Host "2. Restart this terminal" -ForegroundColor White
        Write-Host "3. Run: .\run-setup.ps1" -ForegroundColor White
    }
    "2" {
        Write-Host ""
        Write-Host "Opening Laragon download page..." -ForegroundColor Yellow
        Start-Process "https://laragon.org/download/"
        Write-Host ""
        Write-Host "After installing Laragon:" -ForegroundColor Cyan
        Write-Host "1. Start Laragon" -ForegroundColor White
        Write-Host "2. PHP and Composer will be in PATH automatically" -ForegroundColor White
        Write-Host "3. Run: .\run-setup.ps1" -ForegroundColor White
    }
    "3" {
        Write-Host ""
        Write-Host "Opening PHP download page..." -ForegroundColor Yellow
        Start-Process "https://windows.php.net/download/"
        Write-Host ""
        Write-Host "Opening Composer download page..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
        Start-Process "https://getcomposer.org/download/"
        Write-Host ""
        Write-Host "Manual Installation Steps:" -ForegroundColor Cyan
        Write-Host "1. Download PHP 8.2+ Thread Safe ZIP" -ForegroundColor White
        Write-Host "2. Extract to C:\php" -ForegroundColor White
        Write-Host "3. Add C:\php to System PATH" -ForegroundColor White
        Write-Host "4. Download and install Composer-Setup.exe" -ForegroundColor White
        Write-Host "5. Restart terminal and run: .\run-setup.ps1" -ForegroundColor White
    }
    default {
        Write-Host ""
        Write-Host "Opening all download pages..." -ForegroundColor Yellow
        Start-Process "https://www.apachefriends.org/download.html"
        Start-Sleep -Seconds 1
        Start-Process "https://laragon.org/download/"
        Start-Sleep -Seconds 1
        Start-Process "https://windows.php.net/download/"
        Start-Sleep -Seconds 1
        Start-Process "https://getcomposer.org/download/"
        Write-Host ""
        Write-Host "Download pages opened. Choose one of the options above." -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "After installation, run: .\run-setup.ps1" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
