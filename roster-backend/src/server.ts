import dotenv from "dotenv";
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import { connectToDatabase } from "./db/database";
import router from "./users.routes";

dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
  console.error("No ATLAS_URI environment variable has been defined in config.env");
  process.exit(1);
}

const app = express();
app.use(cors({
  origin: [
    "http://localhost:4200",
    "https://webdevelopment-vmck.onrender.com",
    "https://roster-jte4.onrender.com"
  ],
  credentials: true
}));

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

app.use(bodyParser.json({ limit: "50mb" }));  
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const server = http.createServer(app);
server.listen(5200, () => {
  console.log("Server running at http://localhost:5200/");
});

connectToDatabase(ATLAS_URI)
  .then(() => {
    mongoose.Promise = Promise;
    mongoose.connection.on("error", (error: Error) => console.log(error));

    app.use("/", router);
  
  })
  .catch((error) => console.error(error));