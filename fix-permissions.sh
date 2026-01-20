#!/bin/bash

# Fix Laravel Storage Permissions Script
# Run this on your VPS server

echo "🔐 Fixing Laravel storage permissions..."

# Get the web server user (usually www-data for Nginx/Apache)
WEB_USER="www-data"

# Get current user
CURRENT_USER=$(whoami)

echo "Current user: $CURRENT_USER"
echo "Web server user: $WEB_USER"

# Set proper ownership
echo "📁 Setting ownership..."
sudo chown -R $WEB_USER:$WEB_USER storage
sudo chown -R $WEB_USER:$WEB_USER bootstrap/cache

# Set proper permissions
echo "🔑 Setting permissions..."
sudo chmod -R 775 storage
sudo chmod -R 775 bootstrap/cache

# Add current user to web server group
echo "👥 Adding $CURRENT_USER to $WEB_USER group..."
sudo usermod -a -G $WEB_USER $CURRENT_USER

# Set sticky bit to maintain group ownership
sudo find storage -type d -exec chmod g+s {} \;
sudo find bootstrap/cache -type d -exec chmod g+s {} \;

echo "✅ Permissions fixed!"
echo ""
echo "⚠️  Note: You may need to log out and back in for group changes to take effect."
echo "Or run: newgrp $WEB_USER"
