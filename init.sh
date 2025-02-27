#!/bin/bash

echo "@@ Starting setup script..."

# Navigate to backend and install dependencies
if [ -d "roster-backend" ]; then
    echo "@@ Moving into roster-backend..."
    cd roster-backend || exit 1
    echo "@@ Running npm install for backend..."
    npm install
    cd ..
else
    echo "@@ ERROR: roster-backend directory not found!"
    exit 1
fi

# Function to install npm packages if not already installed
install_package() {
    if ! npm list "$1" --depth=0 &> /dev/null; then
        echo "@@ Installing $1..."
        npm install "$1"
    else
        echo "@@ $1 is already installed."
    fi
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "@@ Node.js is required. Installing..."
    sudo apt install -y nodejs
else
    echo "@@ Node.js is already installed."
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "@@ NPM is required. Installing..."
    sudo apt install -y npm
else
    echo "@@ NPM is already installed."
fi

# Install backend dependencies
echo "@@ Setting up backend dependencies..."
cd roster-backend || exit 1
install_package express
install_package cors
install_package dotenv
install_package mongodb

# Install TypeScript and related types
echo "@@ Installing TypeScript dependencies..."
npm install -D typescript @types/cors @types/express @types/node ts-node
if [ $? -ne 0 ]; then
    echo "@@ ERROR: Failed to install TypeScript dependencies!"
    exit 1
fi
cd ..

# Install Angular CLI globally if not installed
if ! command -v ng &> /dev/null; then
    echo "@@ Angular CLI is required. Installing..."
    sudo npm install -g @angular/cli
else
    echo "@@ Angular CLI is already installed."
fi

# Setup Angular frontend
if [ -d "roster-front-end" ]; then
    echo "@@ Moving into roster-front-end..."
    cd roster-front-end || exit 1
else
    echo "@@ ERROR: roster-front-end directory not found!"
    exit 1
fi

if [ ! -f package.json ]; then
    echo "@@ ERROR: Angular project not initialized!"
    exit 1
else
    echo "@@ Angular project detected."
fi

# Install Angular dependencies
echo "@@ Installing frontend dependencies..."
npm install

# Install Angular Material if not installed
if ! npm list @angular/material @angular/cdk --depth=0 &> /dev/null; then
    echo "@@ Installing Angular Material..."
    ng add @angular/material @angular/cdk --defaults
else
    echo "@@ Angular Material is already installed."
fi

echo "@@ Environment setup complete."

# Check if start.sh exists before running it
if [ -f "./start.sh" ]; then
    echo "@@ Running start.sh script..."
    chmod +x start.sh
    ./start.sh
else
    echo "@@ WARNING: start.sh script not found. Skipping."
fi

# Start Angular application
echo "@@ Running Angular..."
ng serve
