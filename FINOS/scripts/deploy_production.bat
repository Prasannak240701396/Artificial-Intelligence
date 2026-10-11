@echo off
echo ===================================================
echo FINOS Production Deployment Pipeline
echo ===================================================

cd /d %~dp0\..

echo [1/3] Running Automated Validation Test Suite...
python -m pytest -q
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Tests failed! Aborting deployment.
    pause
    exit /b %ERRORLEVEL%
)
echo [PASS] All test suites passed successfully.

echo.
echo [2/3] Building Optimized Frontend Production Bundle...
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Production frontend build failed!
    pause
    exit /b %ERRORLEVEL%
)
cd ..
echo [PASS] Production assets compiled into frontend/dist.

echo.
echo [3/3] Starting Production Services...
echo - Starting Production Backend (FastAPI on Port 8000)...
start "FINOS Backend Production" cmd /k "cd /d %~dp0\..\backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"

echo - Starting Production Frontend (Port 3000)...
start "FINOS Frontend Production" cmd /k "cd /d %~dp0\..\frontend && npm run preview"

echo.
echo ===================================================
echo FINOS Production Deployment Active!
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo Swagger:  http://localhost:8000/docs
echo ===================================================
