// src/router/shifts.ts
import express from "express";
import { getShiftsByUser, getShiftsByDate, createShifts } from "../controllers/shifts";
import { authenticateUser } from "../middlewares/userPermissions";

const shiftsRouter = express.Router();

//shiftsRouter.use(authenticateUser);

shiftsRouter.get("/user/:id", getShiftsByUser);
shiftsRouter.get("/date/:dateSelected", getShiftsByDate);

shiftsRouter.post("/", createShifts);

export default shiftsRouter;
