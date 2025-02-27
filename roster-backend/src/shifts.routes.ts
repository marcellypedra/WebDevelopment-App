import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";

export const shiftsRouter = express.Router();
shiftsRouter.use(express.json());