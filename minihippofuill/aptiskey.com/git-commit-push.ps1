# PowerShell script to commit and push changes to Git
# Usage: .\git-commit-push.ps1 "Commit message"

param(
    [Parameter(Mandatory=$false)]
    [string]$CommitMessage = "Update admin lessons management features"
)

# Get the root directory of the repository
$RepoRoot = git rev-parse --show-toplevel
if (-not $RepoRoot) {
    Write-Host "Error: Not in a Git repository" -ForegroundColor Red
    exit 1
}

# Change to repository root
Set-Location $RepoRoot

# Check if there are any changes
$Status = git status --porcelain
if (-not $Status) {
    Write-Host "No changes to commit" -ForegroundColor Yellow
    exit 0
}

# Show status
Write-Host "`nChanges to be committed:" -ForegroundColor Cyan
git status --short

# Add all changes
Write-Host "`nAdding all changes..." -ForegroundColor Cyan
git add .

# Commit
Write-Host "Committing with message: $CommitMessage" -ForegroundColor Cyan
git commit -m $CommitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Commit failed" -ForegroundColor Red
    exit 1
}

# Push to remote
Write-Host "`nPushing to remote..." -ForegroundColor Cyan
git push

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Push failed" -ForegroundColor Red
    exit 1
}

Write-Host "`nSuccessfully committed and pushed changes!" -ForegroundColor Green

