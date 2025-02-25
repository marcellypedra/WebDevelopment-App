#!/bin/bash

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

# Initialize npm project if package.json does not exist
if [ ! -f package.json ]; then
    echo "@@ Initializing npm project."
    npm init -y
else
    echo "@@ package.json already exists."
fi

# Install backend dependencies
echo "@@ Setting up backend dependencies..."
cd roster-backend || exit 1
install_package express
install_package cors
install_package dotenv
install_package mongodb

# Install TypeScript and related types
npm install -D typescript @types/cors @types/express @types/node ts-node
if [ $? -ne 0 ]; then
    echo "@@ Error installing TypeScript dependencies. Exiting."
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
echo "@@ Setting up Angular frontend..."
cd roster-front-end || exit 1
if [ ! -f package.json ]; then
    echo "@@ Initializing Angular project."
    ng new . --skip-install
fi

# Install Angular Material
ng add @angular/material --defaults

# Start Angular application
echo "@@ Running Angular..."
ng serve

echo "@@ Environment setup complete."
