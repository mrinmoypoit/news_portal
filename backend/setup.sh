#!/bin/bash

# News Portal Backend - Automated Setup Script
# This script will set up your backend environment

set -e  # Exit on any error

echo "🚀 News Portal Backend Setup"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Please run this script from the backend directory${NC}"
    exit 1
fi

# Step 1: Check Node.js
echo "📦 Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js v18 or higher.${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js $NODE_VERSION found${NC}"

# Step 2: Check PostgreSQL
echo ""
echo "🐘 Checking PostgreSQL installation..."
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠ PostgreSQL CLI not found. Make sure PostgreSQL is installed and running.${NC}"
else
    POSTGRES_VERSION=$(psql --version)
    echo -e "${GREEN}✓ $POSTGRES_VERSION found${NC}"
fi

# Step 3: Install dependencies
echo ""
echo "📥 Installing dependencies..."
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Step 4: Check .env file
echo ""
echo "🔧 Checking environment configuration..."
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠ .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠ Please edit .env file with your PostgreSQL credentials!${NC}"
    echo ""
    echo "Required changes in .env:"
    echo "  DATABASE_URL=\"postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/news_portal?schema=public\""
    echo ""
    read -p "Press Enter after you've updated .env file..."
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi

# Step 5: Test database connection
echo ""
echo "🔌 Testing database connection..."
if npm run prisma:generate > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Prisma client generated${NC}"
else
    echo -e "${RED}✗ Failed to generate Prisma client${NC}"
    echo "Please check your DATABASE_URL in .env file"
    exit 1
fi

# Step 6: Ask about database setup
echo ""
echo "📊 Database Setup"
read -p "Do you want to create database tables now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running database migrations..."
    npm run prisma:migrate
    echo -e "${GREEN}✓ Database tables created${NC}"
    
    # Step 7: Ask about seeding
    echo ""
    read -p "Do you want to seed the database with sample data? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Seeding database..."
        npm run prisma:seed
        echo -e "${GREEN}✓ Database seeded${NC}"
    fi
fi

# Step 8: Summary
echo ""
echo "=============================="
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "=============================="
echo ""
echo "📝 Next steps:"
echo "  1. Start the server: npm run dev"
echo "  2. Server will run at: http://localhost:5000"
echo ""
echo "📚 Documentation:"
echo "  - README.md         : Full documentation"
echo "  - API_REFERENCE.md  : API endpoints"
echo "  - ARCHITECTURE.md   : System design"
echo ""
echo "🧪 Test credentials (after seeding):"
echo "  Email: alice@example.com     | Password: password123"
echo "  Email: karim@example.com     | Password: password123"
echo "  Email: nusrat@example.com    | Password: password123 (ADMIN)"
echo "  Email: mrinmoy@gmail.com     | Password: password123"
echo ""
echo "🚀 Ready to start? Run: npm run dev"
echo ""
