import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";

export const usersRouter = express.Router();
usersRouter.use(express.json());

