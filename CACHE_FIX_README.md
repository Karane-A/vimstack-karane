# Cache Permission Fix Guide

## Problem
Windows file permission errors preventing access to admin settings:
```
Symfony\Component\Finder\Exception\AccessDeniedException
RecursiveDirectoryIterator::__construct(...\storage\framework\cache\data\5a): Access is denied
```

## Solutions

### Option 1: Use Array Cache (Recommended for Development)
Temporarily switch to array cache to bypass file system permissions:

1. Open `.env` file
2. Add or update:
   ```
   CACHE_DRIVER=array
   CACHE_STORE=array
   ```
3. Clear config cache (if you can access artisan):
   ```bash
   php artisan config:clear
   ```

### Option 2: Fix File Permissions (Permanent Fix)
Run the PowerShell script:
```powershell
powershell -ExecutionPolicy Bypass -File fix-cache-permissions.ps1
```

Or manually:
1. Open Command Prompt as Administrator
2. Navigate to project directory
3. Run:
   ```cmd
   takeown /F storage\framework\cache\data /R /D Y
   icacls storage\framework\cache\data /grant %USERNAME%:(OI)(CI)F /T /C
   ```

### Option 3: Use Database Cache
Switch to database cache:

1. Run migration (if not already done):
   ```bash
   php artisan cache:table
   php artisan migrate
   ```

2. Update `.env`:
   ```
   CACHE_DRIVER=database
   CACHE_STORE=database
   ```

3. Clear config:
   ```bash
   php artisan config:clear
   ```

## Quick Fix Script
The `fix-cache-permissions.ps1` script will:
- Take ownership of cache directories
- Grant full permissions to your user
- Remove and recreate directories with correct permissions

## After Fixing
1. Clear Laravel cache:
   ```bash
   php artisan cache:clear
   php artisan config:clear
   php artisan view:clear
   ```

2. Restart your web server

3. Try accessing admin settings again
