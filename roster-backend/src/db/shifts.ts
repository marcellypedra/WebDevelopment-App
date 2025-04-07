import mongoose, { Document } from "mongoose";

export interface Shift extends Document {
  userId: mongoose.Types.ObjectId;
  shiftDate: Date;
  startTime: string;
  endTime: string;
}

export interface ShiftDocument extends Shift {}

const ShiftSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shiftDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value: Date) {
          return value > new Date();
        },
        message: "Shift date must be in the future",
      },
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export const ShiftModel = mongoose.model<ShiftDocument>("Shift", ShiftSchema);

export const getShifts = () => ShiftModel.find();
export const getShiftById = (id: string) => ShiftModel.findById(id);
export const getShiftsByUserId = (userId: string) =>
  ShiftModel.find({ userIds: userId });

export const createShift = async (shiftData: {
  userIds: mongoose.Types.ObjectId;
  shiftDate: Date;
  startTime: string;
  endTime: string;
}) => {
  const shift = new ShiftModel(shiftData);
  return await shift.save();
};

export const deleteShiftById = (id: string) =>
  ShiftModel.findOneAndDelete({ _id: id });
export const updateShiftById = (id: string, values: Record<string, any>) =>
  ShiftModel.findByIdAndUpdate(id, values, { new: true });
