#!/bin/bash

# Fix Frontend Dependencies Script
# This script cleans and reinstalls frontend dependencies with the correct Node.js version

echo "🔧 Fixing Frontend Dependencies..."
echo "==================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Load nvm if available
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    source "$NVM_DIR/nvm.sh"
elif [ -s "/usr/local/opt/nvm/nvm.sh" ]; then
    source "/usr/local/opt/nvm/nvm.sh"
fi

# Switch to Node.js 18 if .nvmrc exists
if [ -f ".nvmrc" ] && command -v nvm &> /dev/null; then
    REQUESTED_VERSION=$(cat .nvmrc | tr -d '[:space:]')
    echo -e "${YELLOW}📦 Switching to Node.js ${REQUESTED_VERSION}...${NC}"
    nvm use ${REQUESTED_VERSION}
    echo -e "${GREEN}✅ Using Node.js $(node --version)${NC}"
    echo ""
fi

# Check current Node version
echo "Current Node.js version: $(node --version)"
echo ""

# Navigate to frontend directory
if [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Error: frontend directory not found!${NC}"
    exit 1
fi

cd frontend

echo -e "${YELLOW}🧹 Cleaning existing dependencies...${NC}"
rm -rf node_modules package-lock.json
echo -e "${GREEN}✅ Cleaned${NC}"
echo ""

echo -e "${YELLOW}📥 Installing dependencies with Node.js $(node --version)...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Dependencies installed successfully!${NC}"
    echo ""
    echo "You can now start the frontend with:"
    echo "  npm start"
    echo ""
    echo "Or use the start script from the project root:"
    echo "  ./start.sh"
else
    echo ""
    echo -e "${RED}❌ Installation failed. Please check the errors above.${NC}"
    exit 1
fi

