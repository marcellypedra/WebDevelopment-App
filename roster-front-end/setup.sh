#!/bin/bash

echo "========================================"
echo "@@ 🔧 Starting Frontend Setup Script..."
echo "========================================"

# Create assets directories
echo "========================================"
echo "@@ 🔧 Creating assets directories..."
echo "========================================"
mkdir -p src/assets/logo src/assets/icons src/assets/img

# Create types directory and add a type definition
echo "========================================"
echo "@@ 🔧 Creating types directory..."
echo "========================================"
mkdir -p src/app/types
echo -e 'export type UserResponse = { \n     token: string, \n     name: string \n }' > src/app/types/login-response.type.ts

# Create styles directory and add variables.scss
echo "========================================"
echo "@@ 🔧 Creating styles directory..."
echo "========================================"
mkdir -p src/styles
cat > src/styles/variables.scss << EOL
$primary-color: #168777; // Primary color
$secondary-color: #0BCEB2; // Secondary color
$title-color: #000000; // Title color
$color2: #2D4356; // Additional color
EOL
echo "@@ Created src/styles/variables.scss"

# Generate components
echo "========================================"
echo "@@ 🔧 Creating components..."
echo "========================================"
ng g c components/layout  --style=scss
ng g c components/input  --style=scss
ng g c components/password  --style=scss

# Generate pages
echo "========================================"
echo "@@ 🔧 Creating pages..."
echo "========================================"
ng g c pages/dashboard  --style=scss
ng g c pages/login  --style=scss
ng g c pages/profile  --style=scss
ng g c pages/register  --style=scss
ng g c pages/users  --style=scss

# Generate services
echo "========================================"
echo "@@ 🔧 Creating services..."
echo "========================================"
ng g s services/auth 

# Convert global styles file to SCSS
if [ -f "src/styles.css" ]; then
    echo "@@ Converting global styles.css to styles.scss..."
    mv src/styles.css src/styles.scss
else
    echo "@@ ⚠️ WARNING: Global styles.css not found!"
fi

# List all files in the src directory for verification
echo "========================================"
echo "@@ 🔧 Listing all files in src ..."
ls -R src

# Completion message
echo "========================================"
echo "@@ ✅ Frontend Setup Script Execution Completed!"
echo "========================================"
