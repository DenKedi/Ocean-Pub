#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Starting Deployment Process${NC}"
echo -e "${BLUE}========================================${NC}"

# Get commit message from user
if [ -z "$1" ]; then
    echo -e "${RED}Error: Please provide a commit message${NC}"
    echo "Usage: ./deploy.sh \"Your commit message\""
    exit 1
fi

COMMIT_MESSAGE="$1"

# Step 1: Deploy root directory to main branch
echo -e "\n${GREEN}[1/4] Adding changes in root directory...${NC}"
git add .

echo -e "${GREEN}[2/4] Committing changes to root repository...${NC}"
git commit -m "$COMMIT_MESSAGE"

echo -e "${GREEN}[3/4] Pushing to origin main...${NC}"
git push origin main

# Step 2: Deploy api directory to Heroku
echo -e "\n${GREEN}[4/4] Deploying API to Heroku...${NC}"
cd api

echo -e "${BLUE}Adding changes in api directory...${NC}"
git add .

echo -e "${BLUE}Committing changes to api repository...${NC}"
git commit -m "$COMMIT_MESSAGE"

echo -e "${BLUE}Pushing to Heroku master...${NC}"
git push heroku master

# Return to root directory
cd ..

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "✓ Root pushed to origin/main"
echo -e "✓ API pushed to Heroku"
