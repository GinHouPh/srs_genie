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

# If dist is present, deployment is ready!
if [ -d "dist" ]; then
    echo "==> Production build 'dist' is ready."
    
    # If Apache is pointing to an external public_html directory outside this repo:
    if [ -d "../public_html" ] && [ "$(pwd)" != "$(readlink -f ../public_html 2>/dev/null || echo '')" ]; then
        echo "==> Syncing files to ../public_html..."
        cp -r dist/* ../public_html/
        cp .htaccess ../public_html/.htaccess 2>/dev/null || true
    fi

    echo "✅ Application successfully prepared for Serverbyt Apache!"
else
    echo "⚠️ Error: 'dist' folder not found. Please build locally or configure GitHub Actions."
    exit 1
fi

echo "=========================================="
echo "🎉 SRS Genie is LIVE on Serverbyt!"
echo "=========================================="
