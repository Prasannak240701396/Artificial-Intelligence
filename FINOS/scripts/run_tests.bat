@echo off
echo ===================================================
echo FINOS Automated Test Suite Execution
echo ===================================================

cd /d %~dp0\..
python -m pytest -v --tb=short

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================
    echo [SUCCESS] All algorithm, agent, and API tests passed!
    echo ===================================================
) else (
    echo.
    echo ===================================================
    echo [FAILURE] Test suite encountered errors.
    echo ===================================================
)
