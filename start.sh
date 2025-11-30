#!/bin/bash

# Campus Management System - Startup Script
# This script starts both backend and frontend servers and opens the browser

echo "🚀 Starting Campus Management System..."
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load nvm if available
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    source "$NVM_DIR/nvm.sh"
    NVM_AVAILABLE=true
elif [ -s "/usr/local/opt/nvm/nvm.sh" ]; then
    source "/usr/local/opt/nvm/nvm.sh"
    NVM_AVAILABLE=true
else
    NVM_AVAILABLE=false
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install it from https://nodejs.org/${NC}"
    exit 1
fi

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Use nvm to switch to correct Node version if .nvmrc exists
cd "$SCRIPT_DIR"
if [ "$NVM_AVAILABLE" = true ] && [ -f ".nvmrc" ]; then
    REQUESTED_VERSION=$(cat .nvmrc | tr -d '[:space:]')
    CURRENT_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    
    echo -e "${BLUE}📦 Checking Node.js version...${NC}"
    echo "   Current: $(node --version)"
    echo "   Required: v${REQUESTED_VERSION}.x.x (from .nvmrc)"
    
    # Check if we need to switch versions
    if [ "$CURRENT_VERSION" != "$REQUESTED_VERSION" ]; then
        echo -e "${YELLOW}🔄 Switching to Node.js ${REQUESTED_VERSION} using nvm...${NC}"
        nvm use ${REQUESTED_VERSION} 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Switched to Node.js $(node --version)${NC}"
        else
            echo -e "${YELLOW}⚠️  Node.js ${REQUESTED_VERSION} not installed. Installing...${NC}"
            nvm install ${REQUESTED_VERSION}
            nvm use ${REQUESTED_VERSION}
            echo -e "${GREEN}✅ Installed and switched to Node.js $(node --version)${NC}"
        fi
    else
        echo -e "${GREEN}✅ Using correct Node.js version${NC}"
    fi
    echo ""
elif [ "$NVM_AVAILABLE" = false ] && [ -f ".nvmrc" ]; then
    REQUESTED_VERSION=$(cat .nvmrc | tr -d '[:space:]')
    CURRENT_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    
    echo -e "${YELLOW}⚠️  nvm is not installed. Current Node.js: $(node --version)${NC}"
    echo -e "${YELLOW}   .nvmrc requires Node.js v${REQUESTED_VERSION}.x.x${NC}"
    echo -e "${YELLOW}   For best compatibility, install nvm and use: nvm install ${REQUESTED_VERSION}${NC}"
    echo ""
    
    if [ "$CURRENT_VERSION" -gt 20 ]; then
        echo -e "${YELLOW}⚠️  Warning: You're using Node.js $(node --version)${NC}"
        echo -e "${YELLOW}   react-scripts 5.0.1 works best with Node.js 14-20${NC}"
        echo -e "${YELLOW}   Node.js 24+ may have compatibility issues${NC}"
        echo ""
        read -p "Continue anyway? (y/n) " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}Install nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash${NC}"
            exit 1
        fi
    fi
fi

# Check if backend and frontend directories exist
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Error: backend or frontend directory not found!${NC}"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Check if node_modules exist
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Backend dependencies not installed. Installing...${NC}"
    cd backend
    npm install
    cd ..
    echo ""
fi

if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Frontend dependencies not installed. Installing...${NC}"
    cd frontend
    npm install
    cd ..
    echo ""
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down servers...${NC}"
    # Kill backend process
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "   Backend server stopped"
    fi
    # Kill frontend process
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "   Frontend server stopped"
    fi
    echo -e "${GREEN}✅ Cleanup complete${NC}"
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup SIGINT SIGTERM

# Start backend server
echo -e "${GREEN}🔧 Starting backend server on port 5001...${NC}"
cd backend
npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Check if backend started successfully
if ! ps -p $BACKEND_PID > /dev/null; then
    echo -e "${RED}❌ Backend server failed to start. Check backend.log for errors.${NC}"
    echo "Common issues:"
    echo "  - PostgreSQL not running"
    echo "  - Wrong database password in backend/database/utils/configDB.js"
    echo "  - Port 5001 already in use"
    exit 1
fi

echo -e "${GREEN}✅ Backend server started (PID: $BACKEND_PID)${NC}"
echo ""

# Start frontend server
echo -e "${GREEN}⚛️  Starting frontend server on port 3000...${NC}"
cd frontend

# Set BROWSER environment variable to 'none' to prevent auto-open (we'll do it manually)
BROWSER=none npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait a bit for frontend to start
sleep 5

# Check if frontend started successfully
if ! ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${RED}❌ Frontend server failed to start. Check frontend.log for errors.${NC}"
    cleanup
    exit 1
fi

echo -e "${GREEN}✅ Frontend server started (PID: $FRONTEND_PID)${NC}"
echo ""

# Wait a moment for servers to fully initialize
sleep 2

# Open browser based on OS
echo -e "${GREEN}🌐 Opening browser...${NC}"
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open http://localhost:3000
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open http://localhost:3000 2>/dev/null || sensible-browser http://localhost:3000 2>/dev/null || echo "Please open http://localhost:3000 manually"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows (Git Bash)
    start http://localhost:3000
else
    echo "Please open http://localhost:3000 in your browser"
fi

echo ""
echo -e "${GREEN}✅ ========================================${NC}"
echo -e "${GREEN}✅ Campus Management System is running!${NC}"
echo -e "${GREEN}✅ ========================================${NC}"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend API: http://localhost:5001/api"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo ""

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID

