import * as express from "express";
import { ObjectId } from "mongodb";

export const shiftsRouter = express.Router();
shiftsRouter.use(express.json());
