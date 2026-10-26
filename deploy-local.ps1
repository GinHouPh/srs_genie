param(
  [string]$Message = "build: update frontend assets",
  [string]$SshKey = "",
  [string]$DeployTarget = "tongdon.com@ssh.gb.stackcp.com",
  [switch]$SkipDeploy
)
cd $PSScriptRoot

Write-Host "[1/5] Building frontend assets..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
  Write-Host "Build failed!" -ForegroundColor Red
  exit $LASTEXITCODE
}

Write-Host "[2/5] Force-adding public/build..." -ForegroundColor Cyan
git add -f public/build

Write-Host "[3/5] Committing..." -ForegroundColor Cyan
git commit -m $Message

Write-Host "[4/5] Pushing to origin main..." -ForegroundColor Cyan
git push origin main
if ($LASTEXITCODE -ne 0) {
  Write-Host "Push failed!" -ForegroundColor Red
  exit $LASTEXITCODE
}

if ($SkipDeploy) {
  Write-Host "Pushed only (deploy skipped)." -ForegroundColor Green
  exit 0
}

# Step 5: pull the latest commit on the server and run its deploy script.
# StackCP cannot auto-run deploy.sh on push, so this does it over SSH.
$key = $SshKey
if (-not $key) {
  $key = @(
    "$PSScriptRoot\.deploy_key",
    "$env:TEMP\opencode\agapeinfosys_key"
  ) | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1
}

if (-not $key) {
  Write-Host "[5/5] No SSH key found - deploy manually in Serverbyt (Repository > Deploy)." -ForegroundColor Yellow
  exit 0
}

Write-Host "[5/5] Deploying to the server..." -ForegroundColor Cyan
ssh -i $key -o StrictHostKeyChecking=no $DeployTarget "cd ~/agapeinfosys && git fetch origin main && git reset --hard origin/main && bash deploy.sh"
if ($LASTEXITCODE -ne 0) {
  Write-Host "Deploy failed!" -ForegroundColor Red
  exit $LASTEXITCODE
}

Write-Host "Deployed." -ForegroundColor Green
