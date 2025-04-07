"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const database_1 = require("./db/database");
const users_1 = __importDefault(require("./router/users"));
const shifts_routes_1 = __importDefault(require("./router/shifts.routes"));
dotenv.config();
const { ATLAS_URI, SESSION_SECRET } = process.env;
if (!ATLAS_URI || !SESSION_SECRET) {
    console.error("Missing required environment variables.");
    process.exit(1);
}
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({ origin: "http://localhost:4200", credentials: true }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json({ limit: "50mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "50mb", extended: true }));
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
app.use("/users", users_1.default);
app.use("/shifts", shifts_routes_1.default);
// Start the server only after a successful database connection
(0, database_1.connectToDatabase)(ATLAS_URI)
    .then(() => {
    const server = http_1.default.createServer(app);
    server.listen(5200, () => {
        console.log("Server running at http://localhost:5200/");
    });
})
    .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
});
