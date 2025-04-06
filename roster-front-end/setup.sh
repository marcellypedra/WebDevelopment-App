#!/bin/bash

echo "@@ Starting setup script..."

# Install Angular CLI globally if not installed
if ! command -v ng &> /dev/null; then
    echo "@@ Angular CLI is required. Installing..."
    sudo npm install -g @angular/cli
else
    echo "@@ Angular CLI is already installed."
fi

# Check if package.json exists
if [ ! -f package.json ]; then
    echo "@@ ERROR: Angular project not initialized!"
    exit 1
else
    echo "@@ Angular project detected."
fi

# Install frontend dependencies
echo "@@ Installing frontend dependencies..."
npm install

# Install required packages that might be missing
echo "@@ Installing missing dependencies..."
npm install typescript @angular-devkit/build-angular --save-dev

# Install Bootstrap if not installed
if ! npm list bootstrap --depth=0 &> /dev/null; then
    echo "@@ Installing Bootstrap..."
    npm install bootstrap --save
else
    echo "@@ Bootstrap is already installed."
fi

# Install Angular Material if not installed
if ! npm list @angular/material @angular/cdk --depth=0 &> /dev/null; then
    echo "@@ Installing Angular Material..."
    ng add @angular/material @angular/cdk --defaults
else
    echo "@@ Angular Material is already installed."
fi

# Check and update angular.json if necessary
echo "@@ Checking angular.json for Bootstrap setup..."

# Add Bootstrap CSS and JS to angular.json if not already present
if ! grep -q "node_modules/bootstrap/dist/css/bootstrap.min.css" src/angular.json; then
    echo "@@ Adding Bootstrap CSS to angular.json..."
    jq '.projects["roster-management-app"].architect.build.options.styles += ["node_modules/bootstrap/dist/css/bootstrap.min.css"]' src/angular.json > tmp.json && mv tmp.json src/angular.json
fi

if ! grep -q "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js" src/angular.json; then
    echo "@@ Adding Bootstrap JS to angular.json..."
    jq '.projects["roster-management-app"].architect.build.options.scripts += ["node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"]' src/angular.json > tmp.json && mv tmp.json src/angular.json
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
clear
# Start Angular application
echo "@@ Running Angular..."
ng serve
