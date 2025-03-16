import * as dotenv from "dotenv";
import * as express from "express";
import * as cors from "cors";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}
import * as session from "express-session";
import * as cookieParser from "cookie-parser";
import { MongoClient } from "mongodb";
import { connectToDatabase } from "./database";
import { usersRouter } from "./users.routes";
import { shiftsRouter } from "./shifts.routes";

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const { ATLAS_URI, SESSION_SECRET } = process.env;

if (!ATLAS_URI || !SESSION_SECRET) {
  console.error(
    "No ATLAS_URI environment variable has been defined in config.env"
  );
  process.exit(1);
}

connectToDatabase(ATLAS_URI)
  .then(() => {
    const app = express();
    app.use(
      cors({
        origin: "http://localhost:4200",
        credentials: true,
      })
    );
    app.use(express.json());
    app.use(cookieParser());

    app.use(
      session({
        secret: SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 1000 * 60 * 60,
        },
      })
    );
    app.use("/users", usersRouter);
    app.use("/shifts", shiftsRouter);

    // start the Express server
    app.listen(5200, () => {
      console.log(`Server running at http://localhost:5200...`);
    });
  })
  .catch((error) => console.error(error));
