# WebDevelopment-App

# Please install the following versions of the softwares on your machine

Angular CLI: 15.1.6
Node: 18.20.6
Package Manager: npm 10.8.2

Run the following command to install bootstrap-> npm install bootstrap

# RosterManagementApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.3. and  use as database MongoDB Atlas.

## Environment Setup

1. Make the script executable by giving it the correct permissions.

   chmod +x init.sh 

2. Run init.sh to install all necessary dependencies for setup the environment



## Run Backend

1. Create an .env inside roster-backend with your MongoDB Atlas Credentials following the example below:

ATLAS_URI= "[PASTE HERE YOUR ATLAS URI WITH YOUR CREDENTIALS]"

2. Convert .ts files into .js files by running the following commands:

   cd roster-backend

   npx tsc src/server.ts

3. Start the backend by running the command:

   node src/server.js


## Development Angular Project

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.



## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

 
