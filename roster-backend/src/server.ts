import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import cookieParser from "cookie-parser";
import { connectToDatabase } from "./db/database";
import usersRouter from "./router/users";
import shiftsRouter from "./router/shifts.routes";

dotenv.config();

const { ATLAS_URI, SESSION_SECRET } = process.env;

if (!ATLAS_URI || !SESSION_SECRET) {
  console.error("Missing required environment variables.");
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:4200", credentials: true }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Session middleware
// app.use(
  // session({
  //   secret: SESSION_SECRET as string,
  //   resave: false,
  //   saveUninitialized: false,
  //   cookie: {
  //     httpOnly: true,
  //     secure: false,
  //     sameSite: "lax",
  //     maxAge: 1000 * 60 * 60,
  //   },
  // })
// );

// Routes
app.use("/users", usersRouter);
app.use("/shifts", shiftsRouter);

// Start the server only after a successful database connection
connectToDatabase(ATLAS_URI)
  .then(() => {
    const server = http.createServer(app);
    server.listen(5200, () => {
      console.log("Server running at http://localhost:5200/");
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
