#!/bin/bash
set -e

# ==============================================================================
# SRS Genie - StackCP / Serverbyt Deployment Script
# ==============================================================================
# This script runs on Serverbyt (StackCP) when code is pushed to your Git repo.
# ==============================================================================

echo "=========================================="
echo "🚀 Starting SRS Genie Deployment on Serverbyt"
echo "Date: $(date)"
echo "=========================================="

# Ensure we are in the script's directory
cd "$(dirname "$0")" || exit 1

DEPLOY_TARGET="../public_html"
if [ ! -d "$DEPLOY_TARGET" ]; then
    DEPLOY_TARGET="./public_html"
fi

# Detect Node.js / npm
if command -v npm &> /dev/null || [ -f "$HOME/.nvm/nvm.sh" ]; then
    if [ -f "$HOME/.nvm/nvm.sh" ]; then
        source "$HOME/.nvm/nvm.sh"
    fi

    echo "==> Node.js detected: $(node -v 2>/dev/null || echo 'Unknown')"
    echo "==> Installing dependencies..."
    npm ci --prefer-offline --no-audit || npm install --production=false

    echo "==> Building Vite React production bundle..."
    npm run build
else
    echo "==> Note: npm/Node.js is not present in this shell environment."
    echo "==> Checking for pre-built 'dist' directory..."
fi

# Deploy built files to public_html
if [ -d "dist" ]; then
    echo "==> Copying build artifacts from dist/ to $DEPLOY_TARGET..."
    mkdir -p "$DEPLOY_TARGET"
    cp -r dist/* "$DEPLOY_TARGET"/
    
    # Ensure hidden files (.htaccess) are copied
    if [ -f "dist/.htaccess" ]; then
        cp dist/.htaccess "$DEPLOY_TARGET/.htaccess"
    fi

    # Ensure Cashfree PHP API directory is present
    if [ -d "dist/api" ]; then
        mkdir -p "$DEPLOY_TARGET/api"
        cp -r dist/api/* "$DEPLOY_TARGET/api"/
    fi

    echo "✅ Application successfully deployed to $DEPLOY_TARGET!"
else
    echo "⚠️ Error: 'dist' folder not found. Please build locally or configure GitHub Actions."
    exit 1
fi

echo "=========================================="
echo "🎉 SRS Genie is LIVE on Serverbyt!"
echo "=========================================="
