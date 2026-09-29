# AI Debate Arena - Local Quickstart Script
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Starting AI Debate Arena Full-Stack App " -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Start Python FastAPI Backend in background
Write-Host "`n[1/2] Launching FastAPI Backend on http://localhost:8000..." -ForegroundColor Green
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\activate; uvicorn app.main:app --reload --port 8000"

# 2. Start Next.js Frontend
Write-Host "[2/2] Launching Next.js Frontend on http://localhost:3000..." -ForegroundColor Green
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "`nAll services launched!" -ForegroundColor Cyan
Write-Host "• Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "• Backend API Docs: http://localhost:8000/docs" -ForegroundColor White
