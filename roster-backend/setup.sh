#!/bin/bash

# Clear the terminal
clear
echo "@@ Starting setup script..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "@@ Node.js is required. Installing..."
    sudo apt update && sudo apt install -y nodejs
else
    echo "@@ Node.js is already installed."
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "@@ NPM is required. Installing..."
    sudo apt update && sudo apt install -y npm
else
    echo "@@ NPM is already installed."
fi

# Install nodemon globally if not installed
if ! command -v nodemon &> /dev/null; then
    echo "@@ Installing nodemon globally..."
    sudo npm install -g nodemon
else
    echo "@@ Nodemon is already installed globally."
fi

# Remove existing package-lock.json and node_modules
echo "@@ Cleaning up old dependencies..."
rm -f package-lock.json
rm -rf node_modules

# Create or update package.json
echo "@@ Updating package.json..."
cat > package.json << EOL
{
  "name": "roster-backend",
  "version": "1.0.0",
  "main": "dist/server.js",
  "scripts": {
    "start": "node dist/server.js",
    "dev": "nodemon src/server.ts",
    "build": "tsc"
  },
  "devDependencies": {
    "@types/compression": "^1.7.5",
    "@types/cookie-parser": "^1.4.8",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.14",
    "@types/jsonwebtoken": "^9.0.9",
    "@types/lodash": "^4.14.202",
    "@types/multer": "^1.4.12",
    "@types/node": "^20.11.24",
    "ts-node": "^10.9.2",
    "typescript": "^4.9.5"
  },
  "dependencies": {
    "compression": "^1.7.4",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "lodash": "^4.17.21",
    "mongoose": "^8.2.0",
    "multer": "^1.4.5-lts.2"
  }
}
EOL

# Install dependencies from package.json
echo "@@ Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "@@ ERROR: Failed to install dependencies!"
    exit 1
fi

echo "@@ Dependencies installed successfully."

# Compile TypeScript files if tsconfig.json exists
if [ -f "tsconfig.json" ]; then
    echo "@@ Compiling TypeScript files..."
    npx tsc

    if [ $? -ne 0 ]; then
        echo "@@ ERROR: TypeScript compilation failed!"
        exit 1
    fi

    echo "@@ TypeScript compilation complete."
else
    echo "@@ WARNING: tsconfig.json not found! Skipping TypeScript compilation."
fi

# Generate secure JWT secret key
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# Check and create .env file if not exists
if [ ! -f ".env" ]; then
    echo "@@ Creating .env file with secure JWT_SECRET..."
    cat > .env << EOL
PORT=5000

JWT_SECRET="$JWT_SECRET"
JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET"

ATLAS_URI="mongodb+srv://<USER_ID>:<PASSWORD>@cluster0.tki7t.mongodb.net/<DATA_BASE>"


EOL
else
    echo "@@ .env file already exists."
fi

# Start Backend application using nodemon if src/server.ts exists
if [ -f "src/server.ts" ]; then
    echo "@@ Running Backend with Nodemon..."
    nodemon src/server.ts
else
    echo "@@ ERROR: src/server.ts not found! Ensure your backend entry file exists."
fi

echo "@@ Setup script complete."
