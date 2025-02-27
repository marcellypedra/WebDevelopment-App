#!/bin/bash

echo "========================================"
echo "@@ 🔧 Creating assets directories..."
echo "========================================"
mkdir -p src/assets/logo src/assets/icons src/assets/img

echo "========================================"
echo "@@ 🔧 Creating types directory..."
echo "========================================"
mkdir -p src/app/types
echo -e 'export type LoginResponse = { \n     token: string, \n     name: string \n }' > src/app/types/login-response.type.ts

echo "========================================"
echo "@@ 🔧 Creating styles directory..."
echo "========================================"
mkdir -p src/styles
echo -e '$primary-color: #168777; //168777  \n$secondary-color: #0BCEB2; //0BCEB230 \n$title-color: #000000; \n$color2: #2D4356;' > src/styles/variables.scss
echo "@@ Created src/styles/variables.scss"

echo "========================================"
echo "@@ 🔧 Creating components..."
echo "========================================"
ng g c app/components/layout 
ng g c app/components/input 
ng g c components/password-input

echo "========================================"
echo "@@ 🔧 Creating pages..."
echo "========================================"
ng g c app/pages/login
ng g c app/pages/signup
ng g c app/pages/dashboard

echo "========================================"
echo "@@ 🔧 Creating services..."
echo "========================================"
ng g s app/services/login

echo "========================================"
echo "@@ 🔧 Converting CSS files to SCSS..."
echo "========================================"
convert_css_to_scss() {
    local component_path=$1
    local component_name=$2

    if [ -f "$component_path/$component_name.component.css" ]; then
        echo "@@ Converting $component_name.component.css to SCSS..."
        mv "$component_path/$component_name.component.css" "$component_path/$component_name.component.scss"
    else
        echo "@@ ⚠️ WARNING: $component_name.component.css not found in $component_path"
    fi
}

# Convert CSS to SCSS for pages
convert_css_to_scss "src/app/pages/login" "login"
convert_css_to_scss "src/app/pages/signup" "signup"
convert_css_to_scss "src/app/pages/dashboard" "dashboard"

# Convert CSS to SCSS for components
convert_css_to_scss "src/app/components/layout" "layout"
convert_css_to_scss "src/app/components/input" "input"

echo "========================================"
echo "@@ 🔧 Converting style file..."
echo "========================================"
ls 
mv "src/styles.css" "src/styles.scss"

echo "========================================"
echo "@@ 🔧 Listing all files in src ..."
echo "========================================"
ls

echo "========================================"
echo "@@ ✅ Script execution completed!"
echo "========================================"