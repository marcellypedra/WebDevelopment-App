"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var express = require("express");
var cors = require("cors");
var database_1 = require("./database");
var users_routes_1 = require("./users.routes");
// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();
var ATLAS_URI = process.env.ATLAS_URI;
if (!ATLAS_URI) {
    console.error("No ATLAS_URI environment variable has been defined in config.env");
    process.exit(1);
}
(0, database_1.connectToDatabase)(ATLAS_URI)
    .then(function () {
    var app = express();
    app.use(cors());
    app.use("/users", users_routes_1.usersRouter);
    // start the Express server
    app.listen(5200, function () {
        console.log("Server running at http://localhost:5200...");
    });
})
    .catch(function (error) { return console.error(error); });
