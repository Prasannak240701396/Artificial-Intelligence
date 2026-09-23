Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "FINOS Setup & Initialization Script (Windows)" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# 1. Backend Setup
Set-Location "$PSScriptRoot\..\backend"
Write-Host "Installing Python Backend dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# 2. Database Initialization & Seeding
Set-Location "$PSScriptRoot\.."
Write-Host "Seeding database..." -ForegroundColor Yellow
python database\seed_db.py

# 3. Frontend Setup
Set-Location "$PSScriptRoot\..\frontend"
Write-Host "Installing Frontend dependencies..." -ForegroundColor Yellow
npm install

Write-Host "===================================================" -ForegroundColor Green
Write-Host "FINOS Setup Successfully Completed!" -ForegroundColor Green
Write-Host "Run .\scripts\run_all.bat to start all services." -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
