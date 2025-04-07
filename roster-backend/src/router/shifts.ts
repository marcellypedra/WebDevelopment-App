// src/router/shifts.ts
import express from "express";
import { getShiftsByUser, getShiftsByDate } from "../controllers/shifts";
import { authenticateUser } from "../middlewares/userPermissions";

const shiftsRouter = express.Router();

//shiftsRouter.use(authenticateUser);

shiftsRouter.get("/user/:id", getShiftsByUser);
shiftsRouter.get("/date/:dateSelected", getShiftsByDate);

export default shiftsRouter;
