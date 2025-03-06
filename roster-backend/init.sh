#!/bin/bash
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
  "devDependencies": {
    "@types/compression": "^1.7.5",
    "@types/cookie-parser": "^1.4.8",
    "@types/cors": "^2.8.17",
    "@types/dotenv": "^8.2.0",
    "@types/express": "4.17.17",
    "@types/lodash": "^4.14.202",
    "@types/mongoose": "^5.11.97",
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
    "lodash": "^4.17.21",
    "mongoose": "^8.2.0"
  }
}
EOL

# Install dependencies
echo "@@ Installing dependencies..."
npm install

# Check for installation errors
if [ $? -ne 0 ]; then
    echo "@@ ERROR: Failed to install dependencies!"
    exit 1
fi

echo "@@ Environment setup complete."

# Start Backend application using nodemon if src/server.ts exists, otherwise show error.
if [ -f "src/server.ts" ]; then
    echo "@@ Running Backend with Nodemon..."
    nodemon 
else
    echo "@@ ERROR: src/server.ts not found! Ensure your backend entry file exists."
fi