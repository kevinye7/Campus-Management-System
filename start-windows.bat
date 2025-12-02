@echo off
REM Campus Management System - Docker Startup Script for Windows
REM This script starts all services using Docker Compose

echo Starting Campus Management System with Docker...
echo ========================================
echo.

REM Enable delayed expansion
setlocal enabledelayedexpansion

REM Get the directory where the script is located
cd /d "%~dp0"

REM Check if Docker is installed
where docker >nul 2>nul
if errorlevel 1 (
    echo Docker is not installed. Please install Docker Desktop from https://www.docker.com/get-started
    pause
    exit /b 1
)

REM Check if Docker Desktop is running
docker info >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Docker Desktop is not running!
    echo.
    echo Please start Docker Desktop and wait for it to fully initialize.
    echo You can start Docker Desktop from the Start menu or system tray.
    echo.
    echo Once Docker Desktop is running, you can run this script again.
    echo.
    set /p START_DOCKER="Would you like to open Docker Desktop now? (y/n): "
    if /i "!START_DOCKER!"=="y" (
        start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe" 2>nul
        if errorlevel 1 (
            start "" "%LOCALAPPDATA%\Docker\Docker Desktop.exe" 2>nul
        )
        echo.
        echo Please wait for Docker Desktop to start, then run this script again.
    )
    pause
    exit /b 1
)

REM Check if docker-compose is available (try v2 first, then v1)
docker compose version >nul 2>&1
if errorlevel 1 (
    docker-compose --version >nul 2>&1
    if errorlevel 1 (
        echo Docker Compose is not installed. Please install Docker Compose.
        pause
        exit /b 1
    ) else (
        set DOCKER_COMPOSE=docker-compose
    )
) else (
    set DOCKER_COMPOSE=docker compose
)

REM Check if docker-compose.yml exists
if not exist "docker-compose.yml" (
    echo Error: docker-compose.yml not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

REM Function to cleanup on exit
goto :main

:cleanup
echo.
echo Shutting down Docker containers...
%DOCKER_COMPOSE% down
echo Cleanup complete
exit /b 0

:main
REM Check if containers are already running
%DOCKER_COMPOSE% ps | findstr "Up" >nul 2>&1
if not errorlevel 1 (
    echo Some containers are already running.
    echo Stopping existing containers...
    %DOCKER_COMPOSE% down
    echo.
)

REM Build and start services
echo Building and starting Docker containers...
echo This may take a few minutes on first run...
echo.

%DOCKER_COMPOSE% up --build -d

REM Check if docker-compose up was successful
if errorlevel 1 (
    echo Failed to start Docker containers.
    echo Check the output above for errors.
    pause
    exit /b 1
)

REM Wait for services to be ready
echo.
echo Waiting for services to start...
timeout /t 5 /nobreak >nul

REM Check if services are running
%DOCKER_COMPOSE% ps | findstr "Up" >nul 2>&1
if errorlevel 1 (
    echo Some services failed to start.
    echo Checking logs...
    %DOCKER_COMPOSE% logs --tail=50
    call :cleanup
    pause
    exit /b 1
)

REM Show service status
echo.
echo ========================================
echo Campus Management System is running!
echo ========================================
echo.
echo Service Status:
%DOCKER_COMPOSE% ps
echo.

REM Get port information (use defaults if not set)
set FRONTEND_PORT=3000
set BACKEND_PORT=5001

echo Access the application:
echo    Frontend: http://localhost:%FRONTEND_PORT%
echo    Backend API: http://localhost:%BACKEND_PORT%/api
echo.
echo Useful commands:
echo    View logs:        %DOCKER_COMPOSE% logs -f
echo    View backend:     %DOCKER_COMPOSE% logs -f backend
echo    View frontend:    %DOCKER_COMPOSE% logs -f frontend
echo    View database:    %DOCKER_COMPOSE% logs -f db
echo    Stop services:    %DOCKER_COMPOSE% down
echo    Stop ^& cleanup:   %DOCKER_COMPOSE% down -v
echo.

REM Wait a moment for services to fully initialize
timeout /t 3 /nobreak >nul

REM Open browser
echo Opening browser...
start http://localhost:%FRONTEND_PORT%

echo.
echo Press Ctrl+C to stop all services
echo.

REM Follow logs and wait
%DOCKER_COMPOSE% logs -f

REM If we get here, user pressed Ctrl+C
call :cleanup
