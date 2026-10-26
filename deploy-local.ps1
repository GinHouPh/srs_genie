param(
  [string]$Message = "build: update frontend and production assets",
  [string]$SshKey = "",
  [string]$DeployTarget = "tongdon.com@ssh.gb.stackcp.com",
  [string]$RemoteDir = "~/srsgenie",
  [switch]$SkipDeploy
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "🚀 SRS Genie - Production Build & Deploy" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Step 1: Build the Vite production bundle
Write-Host "[1/5] Building production bundle (npm run build)..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
  Write-Host "❌ Build failed!" -ForegroundColor Red
  exit $LASTEXITCODE
}

# Step 2: Stage changed files, including dist/ and public/
Write-Host "[2/5] Staging changes (including dist/)..." -ForegroundColor Cyan
git add .

# Step 3: Commit if there are changes
Write-Host "[3/5] Committing..." -ForegroundColor Cyan
$gitStatus = git status --porcelain
if ($gitStatus) {
  git commit -m $Message
} else {
  Write-Host "  No uncommitted changes." -ForegroundColor Yellow
}

# Step 4: Push to GitHub origin main
Write-Host "[4/5] Pushing to GitHub (origin main)..." -ForegroundColor Cyan
git push origin main
if ($LASTEXITCODE -ne 0) {
  Write-Host "❌ Git push failed!" -ForegroundColor Red
  exit $LASTEXITCODE
}

if ($SkipDeploy) {
  Write-Host "✅ Pushed to GitHub only (deploy skipped)." -ForegroundColor Green
  exit 0
}

# Step 5: Deploy directly to Serverbyt over SSH
Write-Host "[5/5] Connecting to Serverbyt via SSH to deploy..." -ForegroundColor Cyan
$key = $SshKey
if (-not $key) {
  $key = @(
    "$env:TEMP\opencode\agapeinfosys_key",
    "$PSScriptRoot\.deploy_key",
    "$HOME\.ssh\id_rsa"
  ) | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1
}

if (-not $key) {
  Write-Host "⚠️ No SSH key found. Please deploy manually via Serverbyt StackCP." -ForegroundColor Yellow
  exit 0
}

Write-Host "  Using SSH key: $key" -ForegroundColor DarkGray
Write-Host "  Target: $DeployTarget -> $RemoteDir" -ForegroundColor DarkGray

ssh -i $key -o StrictHostKeyChecking=no $DeployTarget "cd $RemoteDir && git fetch origin main && git reset --hard origin/main && bash deploy.sh"
if ($LASTEXITCODE -ne 0) {
  Write-Host "❌ Remote deployment script failed!" -ForegroundColor Red
  exit $LASTEXITCODE
}

Write-Host "==========================================" -ForegroundColor Green
Write-Host "🎉 SUCCESS: SRS Genie is LIVE at https://srsgenie.agapeinfosys.com/" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
