#!/bin/bash
# Vimstack Live VPS Update Script (CyberPanel)
# Use this to sync the latest changes from GitHub to the live server

# Exit on any error
set -e

# Configuration
PROJECT_ROOT="/home/yourdomain.com/public_html" # UPDATE THIS if different

# Move to project root
cd "$PROJECT_ROOT"

echo "------------------------------------------"
echo "🚀 Starting Live Sync..."
echo "------------------------------------------"

# 1. Pull latest changes
echo "📦 Pulling latest changes from GitHub..."
git pull origin main

# 2. Update dependencies
echo "📝 Updating PHP dependencies..."
composer install --no-dev --optimize-autoloader

echo "🏗️ Updating Node dependencies..."
npm install

# 3. Build production assets
echo "✨ Building production assets..."
npm run build

# 4. Clear/Reset Caches
echo "🧹 Clearing and resetting Laravel caches..."
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 5. Run Migrations (if any)
echo "🗄️ Running database migrations..."
php artisan migrate --force

echo "------------------------------------------"
echo "✅ Live Sync Complete!"
echo "------------------------------------------"
