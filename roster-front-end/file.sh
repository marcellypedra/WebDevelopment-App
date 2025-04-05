#!/bin/bash
clear
echo "@@ Starting setup script..."

# Install Angular CLI globally if not installed
if ! command -v ng &> /dev/null; then
    echo "@@ Angular CLI is required. Installing..."
    sudo npm install -g @angular/cli
else
    echo "@@ Angular CLI is already installed."
fi

# Delete files to be added correctly. 
rm -rf node_modules package-lock.json package.json angular.json

# Check if package.json exists, if not create it
if [ ! -f package.json ]; then
    echo "@@ package.json not found. Creating package.json..."
    cat <<EOL > package.json
{
  "name": "roster-front-end",
  "version": "1.0.0",
  "description": "Angular CLI: 15.1.6\r Node: 18.20.6\r Package Manager: npm 10.8.2",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@angular/animations": "^15.2.10",
    "@angular/cdk": "^15.2.9",
    "@angular/common": "^15.2.10",
    "@angular/core": "^15.2.10",
    "@angular/forms": "^15.2.10",
    "@angular/material": "^15.2.9",
    "@angular/platform-browser-dynamic": "^15.2.10",
    "@angular/router": "^15.2.10",
    "@fullcalendar/angular": "^6.1.17",
    "@fullcalendar/daygrid": "^6.1.17",
    "bootstrap": "^5.3.5",
    "jwt-decode": "^4.0.0",
    "ngx-mask": "^14.3.3"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^15.2.11",
    "@types/node": "^22.14.0",
    "typescript": "^4.9.5"
  }
}
EOL
    echo "@@ package.json created."
else
    echo "@@ package.json detected."
fi

# Check if angular.json exists, if not create it
if [ ! -f angular.json ]; then
    echo "@@ angular.json not found. Creating angular.json..."
    cat <<EOL > angular.json
{
  "\$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "roster-management-app": {
      "projectType": "application",
      "schematics": {},
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/roster-management-app",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.app.json",
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": [
              "@angular/material/prebuilt-themes/purple-green.css",
              "node_modules/bootstrap/dist/css/bootstrap.min.css",
              "src/styles.scss"
            ],
            "scripts": [
              "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
            ]
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "2kb",
                  "maximumError": "4kb"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "buildOptimizer": false,
              "optimization": false,
              "vendorChunk": true,
              "extractLicenses": false,
              "sourceMap": true,
              "namedChunks": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "browserTarget": "roster-management-app:build:production"
            },
            "development": {
              "browserTarget": "roster-management-app:build:development"
            }
          },
          "defaultConfiguration": "development"
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "browserTarget": "roster-management-app:build"
          }
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "polyfills": ["zone.js", "zone.js/testing"],
            "tsConfig": "tsconfig.spec.json",
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": [
              "@angular/material/prebuilt-themes/purple-green.css",
              "src/styles.css"
            ],
            "scripts": []
          }
        }
      }
    }
  },
  "cli": {
    "analytics": "4738848a-0dd7-44d0-bfcf-43180aca0fd8"
  }
}
EOL
    echo "@@ angular.json created."
else
    echo "@@ angular.json detected."
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

echo "@@ Environment setup complete."

# Start Angular application
echo "@@ Running Angular..."
ng serve
