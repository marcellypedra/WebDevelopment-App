import mongoose, { Document, ObjectId } from "mongoose";
import { User } from "./users";

export const ShiftsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shiftDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },

}, { versionKey: false } );

export interface Shifts extends Document {
    _id: ObjectId;
    userId: ObjectId;
    shiftDate: Date,
    startTime: string,
    endTime: string,
    __v?: number; // Add __v as an optional number property
  };


export interface ShiftsResponse {
  user: User;
  shiftsForUser: Shifts[];
}

export interface ShiftsResponseForDate {
  shifts: {
    shiftDate: Date;
    startTime: string;
    endTime: string;
    user: {
      name: string;
      roleType: string;
    }
  };
}

    
