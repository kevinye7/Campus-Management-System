@echo off
REM Campus Management System - Startup Script for Windows
REM This script starts both backend and frontend servers and opens the browser

echo 🚀 Starting Campus Management System...
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b 1
)

REM Get the directory where the script is located
cd /d "%~dp0"

REM Check if backend and frontend directories exist
if not exist "backend" (
    echo ❌ Error: backend directory not found!
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ❌ Error: frontend directory not found!
    pause
    exit /b 1
)

REM Check if node_modules exist and install if needed
if not exist "backend\node_modules" (
    echo ⚠️  Backend dependencies not installed. Installing...
    cd backend
    call npm install
    cd ..
    echo.
)

if not exist "frontend\node_modules" (
    echo ⚠️  Frontend dependencies not installed. Installing...
    cd frontend
    call npm install
    cd ..
    echo.
)

REM Start backend server in a new window
echo 🔧 Starting backend server on port 5001...
start "Campus Management System - Backend" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul

REM Start frontend server in a new window
echo ⚛️  Starting frontend server on port 3000...
start "Campus Management System - Frontend" cmd /k "cd frontend && set BROWSER=none && npm start"
timeout /t 5 /nobreak >nul

REM Wait a moment for servers to initialize
timeout /t 2 /nobreak >nul

REM Open browser
echo 🌐 Opening browser...
start http://localhost:3000

echo.
echo ✅ ========================================
echo ✅ Campus Management System is running!
echo ✅ ========================================
echo.
echo 📍 Frontend: http://localhost:3000
echo 📍 Backend API: http://localhost:5001/api
echo.
echo ℹ️  Two command windows will stay open - one for backend, one for frontend
echo ℹ️  Close those windows or press Ctrl+C to stop the servers
echo.
pause

