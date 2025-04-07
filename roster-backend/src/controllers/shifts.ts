// src/controllers/shifts.ts
import { Request, Response } from "express";
import { collections } from "../db/database";
import { ObjectId } from "mongodb";
import { User } from "db/users";
import { Shifts } from "../db/shifts";

export const getShiftsByUser = async (req: Request, res: Response) => {
  console.log("@@ getShiftsByUser called")
  console.log("Request params:", req.params); 
  try {
    const userId = req.params.id;

    if (!userId || !ObjectId.isValid(userId)) {
      res.status(400).json({ message: "User Id is not valid" });
      return;
    }

    const user = await collections.Users?.findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const shiftsForUser = await collections.Shifts?.find({
      userId: new ObjectId(userId),
    }).exec() as any[];
    const shiftsForUserTyped = shiftsForUser as Shifts[];

    if (!shiftsForUserTyped?.length) {
      res.status(404).json({ message: "Shifts not found for user" });
      return;
    }

    const responseData = {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roleType: user.roleType,
      },
      shiftsForUser: shiftsForUser.map((shift) => ({
        _id: shift._id,
        shiftDate: shift.shiftDate,
        startTime: shift.startTime,
        endTime: shift.endTime,
      }),
    ),
  };
    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error while fetching the shifts for user", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getShiftsByDate = async (req: Request, res: Response) => {
  console.log("@@ getShiftsByDate called")
  console.log("Request params:", req.params); 
  
  try {
    const dateSelected = req.params.dateSelected;
    const shiftDateSelected = new Date(dateSelected);

    const allShiftsForDateSelected = await collections.Shifts?.find({
      shiftDate: shiftDateSelected,
    }).exec() as any[];  // Cast to `any[]` first
    // Now it can cast to Shifts[]
    const allShiftsForDateSelectedTyped = allShiftsForDateSelected as Shifts[];

    if (!allShiftsForDateSelectedTyped?.length) {
      res.status(404).json({ message: "No shifts found for the date selected" });
      return;
    }

    const userIds = allShiftsForDateSelected.map((shift) => shift.userId);

    const users = ( await collections.Users?.find({
        _id: { $in: userIds },
    }).exec()) as User[];

    const shiftsAndUserDetials = allShiftsForDateSelected.map((shift) => {
      const user = users.find((usr) => usr._id?.toString() 
                === shift.userId.toString());

      return {
        _id: shift._id,
        shiftDate: shift.shiftDate,
        startTime: shift.startTime,
        endTime: shift.endTime,
        user: user ? {
                      _id: user._id,
                      name: user.name,
                      roleType: user.roleType,
                    } : null,
      };
    });

    res.status(200).json({ shifts: shiftsAndUserDetials });
  } catch (error) {
    console.error("Error in fetching shifts by date:", error);
    res.status(500).json({ message: "Server error" });
  }
};