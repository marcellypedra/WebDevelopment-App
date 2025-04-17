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
    }).exec() as any[];  
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
export const createShifts = async (req: Request, res: Response) => {
  console.log("@@ createShifts called");
  try {
    const rawshiftData = req.body;

    if (!Array.isArray(rawshiftData) || rawshiftData.length === 0) {
      return res.status(400).json({ message: "Shift data must be a non-empty array" });
    }
     
    console.log("Incoming shift data:", rawshiftData);
    // Validate each shift entry
    const shiftData = rawshiftData.map((shift: any, index: number) => {
      const { userId, shiftDate, startTime, endTime } = shift;

      if (!userId || !ObjectId.isValid(userId)) {
        console.error(`Invalid or missing userId in shift at index ${index}`, shift);
        throw new Error(`Invalid or missing userId in shift at index ${index}`);
      }
      let parsedShiftDate = new Date(shiftDate);
      if (isNaN(parsedShiftDate.getTime())) {
        console.error(`Invalid shiftDate in shift at index ${index}`, shift);
        throw new Error(`Invalid shiftDate in shift at index ${index}`);
      }
      console.log("Parsed shift date:", parsedShiftDate);
      if(!parsedShiftDate){
          throw new Error(`parsedShiftDate is null`);
      }

      if (!startTime || !endTime) {
        console.error(`Missing startTime or endTime in shift at index ${index}`, shift);
        throw new Error(`Missing startTime or endTime in shift at index ${index}`);
      }

      return {
        userId: new ObjectId(userId),
        shiftDate: parsedShiftDate,
        startTime: String(startTime),
        endTime: String(endTime),
      };
    });


    console.log("Shift payload to insert:", shiftData);

    // Remove __v before insert.
    const cleanShiftData = shiftData.map((shift)=>{
      const {__v, ...cleanedShift} = shift as { [key: string]: any };;
      return cleanedShift;
  })


    const result = await collections.Shifts?.insertMany(shiftData);
    console.log("Shift data inserted successfully:", result);

    res.status(201).json({ message: "Shifts created successfully", data: result });
  } catch (error) {
    console.error("Error creating shifts:", error);
    if (error.writeErrors) {
      console.log("Write Errors:");
      console.log(JSON.stringify(error.writeErrors, null, 2)); // Stringify for better readability
    }
    res.status(500).json({ message: "Server error", error });
  }
};
export const getTeamShifts = async (req: Request, res: Response) => {
  try {
    const allShiftsDocs = await collections.Shifts?.find({}).exec();

    if (!allShiftsDocs || allShiftsDocs.length === 0) {
      return res.status(404).json({ message: "No shifts found for the team" });
    }

    // Convert Mongoose documents to plain objects
    const allShifts = allShiftsDocs.map(doc => doc.toObject());

    // Get unique userIds from shifts
    const uniqueIdsSet = new Set<string>();
    allShifts.forEach(shift => uniqueIdsSet.add(shift.userId.toString()));
    const userIds = Array.from(uniqueIdsSet).map(id => new ObjectId(id));


    const users = await collections.Users?.find({
      _id: { $in: userIds },
    }).exec() as User[];

    const shiftsWithUserDetails = allShifts.map(shift => {
      const user = users.find(u => u._id.toString() === shift.userId.toString());
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

    res.status(200).json({ shifts: shiftsWithUserDetails });
  } catch (error) {
    console.error("Error fetching team shifts:", error);
    res.status(500).json({ message: "Server error" });
  }
};