@echo off
echo ===================================================
echo Starting FINOS Financial Intelligence Platform
echo ===================================================

echo Starting Backend Server on http://localhost:8000 ...
start "FINOS Backend" cmd /k "cd /d %~dp0\..\backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo Starting Frontend Dev Server on http://localhost:3000 ...
start "FINOS Frontend" cmd /k "cd /d %~dp0\..\frontend && npm run dev"

echo FINOS services launched!
