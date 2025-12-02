@echo off
REM Campus Management System - Startup Script for Windows
REM This script starts both backend and frontend servers and opens the browser

echo 🚀 Starting Campus Management System...
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b 1
)

REM Enable delayed expansion after initial checks
setlocal enabledelayedexpansion

REM Get the directory where the script is located
cd /d "%~dp0"

REM Check Node.js version if .nvmrc exists
if exist .nvmrc (
    echo 📦 Checking Node.js version...
    set REQUESTED_VERSION=
    for /f "usebackq delims=" %%i in (.nvmrc) do (
        set "LINE=%%i"
        set "LINE=!LINE: =!"
        if not "!LINE!"=="" (
            if "!REQUESTED_VERSION!"=="" set REQUESTED_VERSION=!LINE!
        )
    )
    
    REM Remove any leading/trailing whitespace and "v" prefix if present
    set REQUESTED_VERSION=!REQUESTED_VERSION: =!
    set REQUESTED_VERSION=!REQUESTED_VERSION:v=!
    
    if "!REQUESTED_VERSION!"=="" (
        echo ⚠️  Warning: Could not read version from .nvmrc file
        goto :skip_version_check
    )
    
    for /f "tokens=*" %%v in ('node --version 2^>nul') do set CURRENT_VERSION=%%v
    echo    Current: !CURRENT_VERSION!
    echo    Required: v!REQUESTED_VERSION!.x.x ^(from .nvmrc^)
    
    REM Extract major version number from current version (e.g., "v24.0.0" -> "24")
    set CURRENT_MAJOR=
    set "TEMP_VERSION=!CURRENT_VERSION!"
    set "TEMP_VERSION=!TEMP_VERSION:v=!"
    for /f "tokens=1 delims=." %%a in ("!TEMP_VERSION!") do (
        set CURRENT_MAJOR=%%a
    )
    
    REM Validate that we got a version number
    if "!CURRENT_MAJOR!"=="" (
        echo ⚠️  Warning: Could not extract major version from !CURRENT_VERSION!
        goto :skip_version_check
    )
    
    if "!REQUESTED_VERSION!"=="" (
        echo ⚠️  Warning: Could not read version from .nvmrc file
        goto :skip_version_check
    )
    
    REM Compare versions - use a temporary variable to avoid expansion issues
    set "VER_COMPARE=!CURRENT_MAJOR!"
    if "!VER_COMPARE!"=="!REQUESTED_VERSION!" (
        echo ✅ Using correct Node.js version
        goto :skip_version_check
    )
    
    REM If we get here, versions don't match
    echo ⚠️  Wrong Node.js version detected
    echo    .nvmrc requires Node.js v!REQUESTED_VERSION!.x.x
    echo.
    
    REM Check if nvm-windows is installed
    where nvm >nul 2>nul
    set NVM_AVAILABLE=!ERRORLEVEL!
    
    REM Also check common nvm-windows installation paths
    if !NVM_AVAILABLE! NEQ 0 (
        if exist "%ProgramFiles%\nvm\nvm.exe" (
            set "PATH=%ProgramFiles%\nvm;%PATH%"
            set NVM_AVAILABLE=0
        ) else if exist "%LOCALAPPDATA%\nvm-windows\nvm.exe" (
            set "PATH=%LOCALAPPDATA%\nvm-windows;%PATH%"
            set NVM_AVAILABLE=0
        ) else if exist "%ProgramFiles(x86)%\nvm\nvm.exe" (
            set "PATH=%ProgramFiles(x86)%\nvm;%PATH%"
            set NVM_AVAILABLE=0
        )
    )
    
    if !NVM_AVAILABLE! NEQ 0 (
            echo 🔧 nvm-windows is not installed. Installing...
            echo.
            
            REM Create temp directory for installer
            set TEMP_DIR=%TEMP%\nvm-installer
            if not exist "%TEMP_DIR%" mkdir "%TEMP_DIR%"
            
            REM Download nvm-windows installer
            echo 📥 Downloading nvm-windows installer...
            powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://github.com/coreybutler/nvm-windows/releases/latest/download/nvm-setup.exe' -OutFile '%TEMP_DIR%\nvm-setup.exe'}" 2>nul
            
            if not exist "%TEMP_DIR%\nvm-setup.exe" (
                echo ❌ Failed to download nvm-windows installer.
                echo    Please download and install manually from:
                echo    https://github.com/coreybutler/nvm-windows/releases
                echo.
                set /p CONTINUE="Continue with current Node.js version? (y/n): "
                if /i not "%CONTINUE%"=="y" (
                    echo Installation cancelled.
                    pause
                    exit /b 1
                )
                goto :skip_nvm
            )
            
            echo 🔄 Installing nvm-windows (this may require administrator privileges)...
            echo    Please follow the installation wizard...
            start /wait "" "%TEMP_DIR%\nvm-setup.exe"
            
            REM Clean up installer
            del "%TEMP_DIR%\nvm-setup.exe" >nul 2>&1
            rmdir "%TEMP_DIR%" >nul 2>&1
            
            REM Refresh PATH by checking common nvm-windows installation locations
            REM nvm-windows is typically installed to ProgramFiles or ProgramFiles(x86)
            if exist "%ProgramFiles%\nvm\nvm.exe" (
                set "PATH=%ProgramFiles%\nvm;%PATH%"
            ) else if exist "%ProgramFiles(x86)%\nvm\nvm.exe" (
                set "PATH=%ProgramFiles(x86)%\nvm;%PATH%"
            ) else if exist "%LOCALAPPDATA%\nvm-windows\nvm.exe" (
                set "PATH=%LOCALAPPDATA%\nvm-windows;%PATH%"
            )
            
            REM Verify nvm is now available
            where nvm >nul 2>nul
            if %ERRORLEVEL% NEQ 0 (
                echo ⚠️  nvm-windows installation completed, but nvm command not found in PATH.
                echo    You may need to restart this script or your terminal.
                echo    Alternatively, restart your computer to ensure PATH is updated.
                echo.
                set /p CONTINUE="Continue with current Node.js version? (y/n): "
                if /i not "%CONTINUE%"=="y" (
                    echo Please restart this script after installation completes.
                    pause
                    exit /b 1
                )
                goto :skip_nvm
            )
            
            echo ✅ nvm-windows installed successfully
            echo.
        )
        
        REM Use nvm to install and switch to the required version
        echo 🔄 Checking Node.js v!REQUESTED_VERSION! installation...
        
        REM Check if version is already installed by checking nvm list output
        nvm list >nul 2>&1
        nvm list | findstr /C:"!REQUESTED_VERSION!" >nul 2>&1
        if !ERRORLEVEL! EQU 0 (
            echo    Node.js v!REQUESTED_VERSION! is already installed
        ) else (
            echo 📥 Installing Node.js v!REQUESTED_VERSION!...
            nvm install !REQUESTED_VERSION!
            if !ERRORLEVEL! NEQ 0 (
                echo ❌ Failed to install Node.js v!REQUESTED_VERSION!
                echo    Please install manually: nvm install !REQUESTED_VERSION!
                pause
                exit /b 1
            )
        )
        
        REM Switch to the version
        echo 🔄 Activating Node.js v!REQUESTED_VERSION!...
        nvm use !REQUESTED_VERSION!
        if !ERRORLEVEL! NEQ 0 (
            echo ❌ Failed to switch to Node.js v!REQUESTED_VERSION!
            pause
            exit /b 1
        )
        
        REM Verify the switch worked
        for /f "tokens=*" %%v in ('node --version 2^>nul') do set NEW_VERSION=%%v
        for /f "tokens=1 delims=." %%a in ("!NEW_VERSION:v=!") do set NEW_MAJOR=%%a
        
        if "!NEW_MAJOR!"=="!REQUESTED_VERSION!" (
            echo ✅ Successfully switched to Node.js !NEW_VERSION!
        ) else (
            echo ⚠️  Warning: Switched to Node.js !NEW_VERSION!, but expected v!REQUESTED_VERSION!
        )
        echo.
        goto :version_check_done
        
        :skip_nvm
        REM Check if version is too high (Node 24+ may have compatibility issues with react-scripts 5.0.1)
        if !CURRENT_MAJOR! GTR 20 (
            echo ⚠️  Warning: You're using Node.js !CURRENT_VERSION!
            echo    react-scripts 5.0.1 works best with Node.js 14-20
            echo    Node.js 24+ may have compatibility issues
            echo.
        )
        :version_check_done
    :skip_version_check
    echo.
)

REM Check if backend and frontend directories exist
if not exist "backend" (
    echo ❌ Error: backend directory not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ❌ Error: frontend directory not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

REM Check if node_modules exist and install if needed
if not exist "backend\node_modules" (
    echo ⚠️  Backend dependencies not installed. Installing...
    cd backend
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install backend dependencies
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo.
)

if not exist "frontend\node_modules" (
    echo ⚠️  Frontend dependencies not installed. Installing...
    cd frontend
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install frontend dependencies
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo.
)

REM Function to cleanup on exit
goto :main

:cleanup
echo.
echo 🛑 Shutting down servers...
REM Kill backend process if PID file exists
if exist "backend.pid" (
    for /f %%i in (backend.pid) do (
        taskkill /F /PID %%i >nul 2>&1
        if %ERRORLEVEL% EQU 0 (
            echo    Backend server stopped
        )
    )
    del backend.pid >nul 2>&1
)
REM Kill frontend process if PID file exists
if exist "frontend.pid" (
    for /f %%i in (frontend.pid) do (
        taskkill /F /PID %%i >nul 2>&1
        if %ERRORLEVEL% EQU 0 (
            echo    Frontend server stopped
        )
    )
    del frontend.pid >nul 2>&1
)
echo ✅ Cleanup complete
exit /b 0

:main
REM Set up cleanup on script exit
REM Note: delayed expansion is already enabled at the top of the script

REM Start backend server
echo 🔧 Starting backend server on port 5001...
cd backend
start /B npm start > ..\backend.log 2>&1
cd ..

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Try to find backend process by checking if port 5001 is in use
REM Use netstat to find process using port 5001
set BACKEND_PID=
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":5001" ^| findstr "LISTENING"') do (
    if "!BACKEND_PID!"=="" set BACKEND_PID=%%a
)

REM Check if backend started successfully by checking if process exists
if "!BACKEND_PID!"=="" (
    echo ❌ Backend server failed to start. Check backend.log for errors.
    echo Common issues:
    echo   - PostgreSQL not running
    echo   - Wrong database password in backend/database/utils/configDB.js
    echo   - Port 5001 already in use
    pause
    exit /b 1
)

REM Verify the process is actually running
tasklist /FI "PID eq !BACKEND_PID!" 2>nul | find /I "node.exe" >nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Backend server failed to start. Check backend.log for errors.
    echo Common issues:
    echo   - PostgreSQL not running
    echo   - Wrong database password in backend/database/utils/configDB.js
    echo   - Port 5001 already in use
    pause
    exit /b 1
)

echo !BACKEND_PID!> backend.pid
echo ✅ Backend server started (PID: !BACKEND_PID!^)
echo.

REM Start frontend server
echo ⚛️  Starting frontend server on port 3000...
cd frontend
set BROWSER=none
start /B npm start > ..\frontend.log 2>&1
cd ..

REM Wait a bit for frontend to start
timeout /t 5 /nobreak >nul

REM Try to find frontend process by checking if port 3000 is in use
set FRONTEND_PID=
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":3000" ^| findstr "LISTENING"') do (
    if "!FRONTEND_PID!"=="" set FRONTEND_PID=%%a
)

REM Check if frontend started successfully
if "!FRONTEND_PID!"=="" (
    echo ❌ Frontend server failed to start. Check frontend.log for errors.
    call :cleanup
    pause
    exit /b 1
)

REM Verify the process is actually running
tasklist /FI "PID eq !FRONTEND_PID!" 2>nul | find /I "node.exe" >nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Frontend server failed to start. Check frontend.log for errors.
    call :cleanup
    pause
    exit /b 1
)

echo !FRONTEND_PID!> frontend.pid
echo ✅ Frontend server started (PID: !FRONTEND_PID!^)
echo.

REM Wait a moment for servers to fully initialize
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
echo 📋 Logs:
echo    Backend:  type backend.log
echo    Frontend: type frontend.log
echo.
echo ℹ️  Press Ctrl+C to stop all servers
echo.

REM Wait for user to stop servers
:wait_loop
timeout /t 1 /nobreak >nul
REM Check if processes are still running
tasklist /FI "PID eq !BACKEND_PID!" 2>nul | find /I "node.exe" >nul
if !ERRORLEVEL! NEQ 0 (
    echo Backend server stopped
    goto :cleanup
)
tasklist /FI "PID eq !FRONTEND_PID!" 2>nul | find /I "node.exe" >nul
if %ERRORLEVEL% NEQ 0 (
    echo Frontend server stopped
    goto :cleanup
)
goto :wait_loop

