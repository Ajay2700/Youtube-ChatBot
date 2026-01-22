# PowerShell script to push project to GitHub
# Run this script from the project root directory

Write-Host "=== Pushing Project to GitHub ===" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
}

# Check if .gitignore exists
if (-not (Test-Path .gitignore)) {
    Write-Host "[WARNING] .gitignore not found!" -ForegroundColor Red
    Write-Host "Creating .gitignore..." -ForegroundColor Yellow
    # .gitignore should already exist, but just in case
}

# Add all files
Write-Host "Adding files to git..." -ForegroundColor Yellow
git add .

# Check status
Write-Host "`nFiles to be committed:" -ForegroundColor Cyan
git status --short

# Create commit
Write-Host "`nCreating commit..." -ForegroundColor Yellow
$commitMessage = Read-Host "Enter commit message (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Initial commit: YouTube Transcript Chatbot - Full Stack RAG Application"
}
git commit -m $commitMessage

# Check if remote exists
$remoteExists = git remote -v 2>$null
if (-not $remoteExists) {
    Write-Host "`nNo remote repository configured." -ForegroundColor Yellow
    Write-Host "Please create a repository on GitHub first:" -ForegroundColor White
    Write-Host "  1. Go to https://github.com/new" -ForegroundColor Cyan
    Write-Host "  2. Create a new repository" -ForegroundColor Cyan
    Write-Host "  3. Copy the repository URL" -ForegroundColor Cyan
    Write-Host ""
    $repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git)"
    
    if (-not [string]::IsNullOrWhiteSpace($repoUrl)) {
        git remote add origin $repoUrl
        Write-Host "[OK] Remote added" -ForegroundColor Green
    } else {
        Write-Host "[SKIP] No remote URL provided" -ForegroundColor Yellow
        Write-Host "You can add it later with: git remote add origin <URL>" -ForegroundColor Gray
        exit
    }
}

# Push to GitHub
Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[SUCCESS] Code pushed to GitHub!" -ForegroundColor Green
    Write-Host "Visit your repository to verify" -ForegroundColor Cyan
} else {
    Write-Host "`n[ERROR] Push failed. Check the error messages above." -ForegroundColor Red
}
