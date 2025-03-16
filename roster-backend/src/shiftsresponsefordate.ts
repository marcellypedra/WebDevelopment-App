import { ObjectId } from "mongodb";

export interface ShiftsResponseForDate {
  shifts: {
    _id?: ObjectId;
    shiftDate: Date;
    startTime: string;
    endTime: string;
    user: {
      _id?: ObjectId;
      name: string;
      roleType: string;
    } | null;
  }[];
}
