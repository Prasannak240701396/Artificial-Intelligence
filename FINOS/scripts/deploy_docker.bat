@echo off
echo ===================================================
echo FINOS Docker Multi-Container Production Deployment
echo ===================================================

cd /d %~dp0\..

echo Checking Docker daemon...
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker is not installed or not in PATH.
    echo Please install Docker Desktop or run .\scripts\deploy_production.bat instead.
    pause
    exit /b 1
)

echo Building and starting full-stack containers...
docker compose up --build -d

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================
    echo FINOS Docker Services Deployed!
    echo Frontend: http://localhost:3000
    echo Backend:  http://localhost:8000
    echo Swagger:  http://localhost:8000/docs
    echo ===================================================
) else (
    echo [ERROR] Docker Compose failed to start services.
)
