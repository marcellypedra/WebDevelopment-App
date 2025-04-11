# WebDevelopment-App

# Please install the following versions of the softwares on your machine

Angular CLI: 15.1.6
Node: 18.20.6
Package Manager: npm 10.8.2

Run the following command to install bootstrap-> npm install bootstrap

# RosterManagementApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.3. and  use as database MongoDB Atlas.

## Run Backend

1. Navigate to Backend folder:
   `cd roster-backend`

2. Make the scripts executable by giving them the correct permissions.

   `chmod +x setup.sh`

3. Run `setup.sh` to install all necessary dependencies for setup the environment

4. In the .env file include your credentials where it is necessary

4. Start the backend by running the command:

   `nodemon src/server.ts`

## Run Frontend

1. Open a new terminal to run the frontend separately from the backend and run the command:
  
   `ng serve`

BOTH ENVIRONMENTS (BACKEND AND FRONTEND) SHOULD BE RUNNING SIMULTANEOUSLY FOR THE APP PROPERLY WORKS.


## Environment Setup Frontend (IF NECESSARY)

1. Navigate to Frontend folder:
   `cd roster-front-end`

2. Make the scripts executable by giving them the correct permissions.

   `chmod +x setup.sh` 
   `chmod +x file.sh`

3. Run `setup.sh` to install all necessary dependencies for setup the environment

4. Try to run the frontend `ng serve`, if it doesn't work, run `file.sh` and then try again.

5. Repeat steps 1 to 3 but in the roster-backend folder ( except for the `file.sh`)



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

 
