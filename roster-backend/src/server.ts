import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from "./database";
import router from './users.routes';

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
  console.error(
    "No ATLAS_URI environment variable has been defined in config.env"
  );
  process.exit(1);
}

connectToDatabase(ATLAS_URI)
  .then(() => {
    const app = express();
    app.use(cors({
      origin: "http://localhost:4200", //@@ frontend PORT
      credentials: true
    }));

    app.use(express.json());
    app.use(cookieParser());
    
    app.use(compression());
    app.use(bodyParser.json());

    app.use("/", router());

    const server = http.createServer(app);

    // start the Express server
    const PORT = process.env.PORT || 5200;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });

    app.use("/", router());
  })
  .catch((error) => console.error(error));