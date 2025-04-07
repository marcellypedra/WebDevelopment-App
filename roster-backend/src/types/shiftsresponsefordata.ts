import { ObjectId, Types } from "mongoose";


export interface ShiftsResponseForDate {
  shifts: {
    _id: Types.ObjectId;
    shiftDate: Date;
    startTime: string;
    endTime: string;
    user: {
      _id: Types.ObjectId;
      name: string;
      roleType: "BarStaff" | "FloorStaff" | "Manager";
    } | null;
  }[];
}