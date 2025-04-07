import { ObjectId } from "mongodb";
import { Request, Response, Router } from "express";
import { ShiftsResponseForDate } from "../types/shiftsresponsefordata";
import { authenticateUser } from "../middlewares/userPermissions";
import { getUserById, UserModel } from "../db/users";
import { ShiftModel } from "../db/shifts";
import { Types } from "mongoose";

const shiftsRouter = Router();

shiftsRouter.get(
  "/user",
  authenticateUser,
  async (
    req: Request,
    res: Response
  ): Promise<any> => {
    try {
      const userId = req.user?._id as string;

      if (!ObjectId.isValid(userId)) {
        res.status(400).json({ message: "User Id is not valid" });
        return;
      }

      const user = await getUserById(userId);

      if (!user || user === null) {
        res.status(404).json({ message: "User not found" });
        return;
        /*We dont return the response because express handles
         the return on its own. But we still write return because we 
         want the execution of the program to stop once the error message is returned*/
      }

      const shiftsForUser = await ShiftModel.find({
        userId: user._id
      });

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
);

shiftsRouter.get(
  "/date/:dateSelected",
  authenticateUser,
  async (
    req: Request,
    res: Response<ShiftsResponseForDate | { message: string }>
  ): Promise<void> => {
    try {
      const { dateSelected } = req.params;

      const shiftDate = new Date(dateSelected);
      if (isNaN(shiftDate.getTime())) {
        res.status(400).json({ message: "Invalid date format" });
        return;
      }

      // Define start and end of the selected day
      const startOfDay = new Date(shiftDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(shiftDate);
      endOfDay.setHours(23, 59, 59, 999);

      // Fetch shifts for the selected date
      const allShiftsForDateSelected = await ShiftModel.find({
        shiftDate: { $gte: startOfDay, $lt: endOfDay },
      }).populate({ path: 'nonExistentField', strictPopulate: false });

      if (!allShiftsForDateSelected.length) {
        res.status(404).json({ message: "No shifts found for the selected date" });
        return;
      }

      const shiftsAndUserDetails = await Promise.all(
        allShiftsForDateSelected.map(async (shift): Promise<ShiftsResponseForDate["shifts"][number]> => {
          const user = await getUserById(shift.userId._id.toString());

          return {
            _id: shift._id as Types.ObjectId,
            shiftDate: shift.shiftDate,
            startTime: shift.startTime,
            endTime: shift.endTime,
            user: user
              ? {
                _id: user._id as Types.ObjectId,
                name: user.name,
                roleType: user.roleType,
              }
              : null,
          };
        })
      );

      res.status(200).json({ shifts: shiftsAndUserDetails });
    } catch (error) {
      console.error("❌ Error in fetching shifts by date:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);


export default shiftsRouter;