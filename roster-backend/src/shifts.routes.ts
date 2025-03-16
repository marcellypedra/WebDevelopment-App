import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";
import session from "express-session";

import { Request, Response, NextFunction } from "express";
import { ShiftsResponse } from "./shiftsresponse";
import { ShiftsResponseForDate } from "./shiftsresponsefordate";
import { isAuthenticated } from "./middlewares/authMiddleware";
import { AuthenticatedRequest } from "./authenticatereqinterface";

export const shiftsRouter = express.Router();
shiftsRouter.use(express.json());

shiftsRouter.get(
  "/user",
  isAuthenticated,
  async (
    req: Request & { session: { userId?: string } },
    res: Response<ShiftsResponse | { message: string }>
  ): Promise<any> => {
    try {
      const userId = req?.session.userId as string;

      if (!ObjectId.isValid(userId)) {
        res.status(400).json({ message: "User Id is not valid" });
        return;
      }

      const user = await collections.Users?.findOne({
        _id: new ObjectId(userId),
      });

      if (!user || user === null) {
        res.status(404).json({ message: "User not found" });
        return;
        /*We dont return the response because express handles
         the return on its own. But we still write return because we 
         want the execution of the program to stop once the error message is returned*/
      }

      const shiftsForUser = await collections.Shifts?.find({
        userId: new ObjectId(userId),
      }).toArray();

      if (!shiftsForUser?.length) {
        res.status(404).json({ message: "Shifts not found for user" });
        return;
      }

      return res.status(200).json({ user, shiftsForUser });
    } catch (error) {
      console.error("There was an error while fetching the shifts for user");
      res.status(500).json({ message: "Server error" });
    }
  }
); //shiftsROuter for user:userId route

shiftsRouter.get(
  "/date/:dateSelected",
  async (
    req: Request,
    res: Response<ShiftsResponseForDate | { message: string }>
  ): Promise<any> => {
    try {
      const dateSelected = req.params.dateSelected;
      const shiftDateSelected = new Date(dateSelected);
      const allShiftsForDateSelected = await collections.Shifts?.find({
        shiftDateSelected,
      }).toArray();

      if (!allShiftsForDateSelected?.length) {
        res
          .status(404)
          .json({ message: "No shifts found for the date selected" });
        return;
      }

      const userIds = allShiftsForDateSelected
        .map((shift) => {
          return shift.userId;
        })
        .filter((id) => {
          return id instanceof ObjectId;
        });

      const users = await collections.Users?.find({
        _id: { $in: userIds },
      }).toArray();

      const shiftsAndUserDetials = allShiftsForDateSelected.map((shift) => {
        const user = users?.find((usr) => {
          return usr._id?.equals(shift.userId);
        });

        return {
          _id: shift._id,
          shiftDate: shift.shiftDate,
          startTime: shift.startTime,
          endTime: shift.endTime,
          user: user
            ? {
                _id: user._id,
                name: user.name,
                roleType: user.roleType,
              }
            : null,
        };
      });

      res.status(200).json({ shifts: shiftsAndUserDetials });
      return;
    } catch (error) {
      console.error("Error in fetching shifts by date:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);
