import express from "express";
import { getShiftsByUser, getShiftsByDate, createShifts, getTeamShifts } from "../controllers/shifts";
import { authenticateUser } from "../middlewares/userPermissions";

const shiftsRouter = express.Router();

shiftsRouter.use(authenticateUser);

shiftsRouter.get("/user/:id", getShiftsByUser);
shiftsRouter.get("/date/:dateSelected", getShiftsByDate);
shiftsRouter.get('/team', getTeamShifts);

shiftsRouter.post("/", createShifts);

export default shiftsRouter;
