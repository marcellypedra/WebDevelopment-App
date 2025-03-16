import * as mongodb from "mongodb";

export interface Shifts {
  _id?: mongodb.ObjectId;
  userId?: mongodb.ObjectId;
  shiftDate: Date;
  startTime: "string";
  endTime: "string";
}
