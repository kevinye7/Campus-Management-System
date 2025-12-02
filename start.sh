#!/bin/bash

# Campus Management System - Docker Startup Script
# This script starts all services using Docker Compose

echo "Starting Campus Management System with Docker..."
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker from https://www.docker.com/get-started${NC}"
    exit 1
fi

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    echo -e "${RED}ERROR: Docker daemon is not running!${NC}"
    echo ""
    echo "Please start Docker Desktop (or Docker daemon) and wait for it to fully initialize."
    echo "Once Docker is running, you can run this script again."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose.${NC}"
    exit 1
fi

# Use 'docker compose' (v2) if available, otherwise 'docker-compose' (v1)
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}Error: docker-compose.yml not found!${NC}"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down Docker containers...${NC}"
    $DOCKER_COMPOSE down
    echo -e "${GREEN}Cleanup complete${NC}"
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup SIGINT SIGTERM

# Check if containers are already running
if $DOCKER_COMPOSE ps | grep -q "Up"; then
    echo -e "${YELLOW}Some containers are already running.${NC}"
    echo -e "${YELLOW}Stopping existing containers...${NC}"
    $DOCKER_COMPOSE down
    echo ""
fi

# Build and start services
echo -e "${BLUE}Building and starting Docker containers...${NC}"
echo "This may take a few minutes on first run..."
echo ""

$DOCKER_COMPOSE up --build -d

# Check if docker-compose up was successful
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to start Docker containers.${NC}"
    echo "Check the output above for errors."
    exit 1
fi

# Wait for services to be ready
echo ""
echo -e "${BLUE}Waiting for services to start...${NC}"
sleep 5

# Check if services are running
if ! $DOCKER_COMPOSE ps | grep -q "Up"; then
    echo -e "${RED}Some services failed to start.${NC}"
    echo -e "${YELLOW}Checking logs...${NC}"
    $DOCKER_COMPOSE logs --tail=50
    cleanup
    exit 1
fi

# Show service status
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Campus Management System is running!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Service Status:${NC}"
$DOCKER_COMPOSE ps
echo ""

# Get port information from docker-compose or use defaults
FRONTEND_PORT=${FRONTEND_PORT:-3000}
BACKEND_PORT=${BACKEND_PORT:-5001}

echo -e "${GREEN}Access the application:${NC}"
echo "   Frontend: http://localhost:${FRONTEND_PORT}"
echo "   Backend API: http://localhost:${BACKEND_PORT}/api"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo "   View logs:        $DOCKER_COMPOSE logs -f"
echo "   View backend:     $DOCKER_COMPOSE logs -f backend"
echo "   View frontend:    $DOCKER_COMPOSE logs -f frontend"
echo "   View database:    $DOCKER_COMPOSE logs -f db"
echo "   Stop services:    $DOCKER_COMPOSE down"
echo "   Stop & cleanup:   $DOCKER_COMPOSE down -v"
echo ""

# Wait a moment for services to fully initialize
sleep 3

# Open browser based on OS
echo -e "${GREEN}Opening browser...${NC}"
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open http://localhost:${FRONTEND_PORT}
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open http://localhost:${FRONTEND_PORT} 2>/dev/null || sensible-browser http://localhost:${FRONTEND_PORT} 2>/dev/null || echo "Please open http://localhost:${FRONTEND_PORT} manually"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows (Git Bash)
    start http://localhost:${FRONTEND_PORT}
else
    echo "Please open http://localhost:${FRONTEND_PORT} in your browser"
fi

echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Follow logs and wait
$DOCKER_COMPOSE logs -f
