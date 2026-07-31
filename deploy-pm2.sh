#!/usr/bin/env bash

# ==============================================================================
# Skyward Automated Deployment Script for PM2 + Nginx + MongoDB (Pure Mongoose)
# ==============================================================================

set -e

echo "🚀 Starting Skyward Deployment Pipeline..."

# 1. Pull latest changes from git
echo "📥 Pulling latest code from main..."
git pull origin main

# 2. Deploy Backend
echo "⚙️ Building Backend..."
cd backend
npm install --production=false
echo "🔨 Compiling Express Backend..."
npm run build
cd ..

# 3. Deploy Frontend
echo "🌐 Building Next.js Frontend..."
cd frontend
npm install --production=false
echo "🏗️ Generating Next.js Production Bundle..."
npm run build
cd ..

# 4. Reload PM2 Application Processes
echo "🔄 Reloading PM2 Processes..."
if pm2 desc skyward-backend > /dev/null 2>&1; then
    pm2 reload ecosystem.config.js
else
    pm2 start ecosystem.config.js
fi

# Save PM2 state to survive server reboots
pm2 save

echo "=============================================================================="
echo "✅ Skyward deployed successfully!"
echo "=============================================================================="
pm2 status
