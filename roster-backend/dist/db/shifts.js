"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShiftById = exports.deleteShiftById = exports.createShift = exports.getShiftsByUserId = exports.getShiftById = exports.getShifts = exports.ShiftModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ShiftSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    shiftDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
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
}, {
    versionKey: false,
});
exports.ShiftModel = mongoose_1.default.model("Shift", ShiftSchema);
const getShifts = () => exports.ShiftModel.find();
exports.getShifts = getShifts;
const getShiftById = (id) => exports.ShiftModel.findById(id);
exports.getShiftById = getShiftById;
const getShiftsByUserId = (userId) => exports.ShiftModel.find({ userIds: userId });
exports.getShiftsByUserId = getShiftsByUserId;
const createShift = async (shiftData) => {
    const shift = new exports.ShiftModel(shiftData);
    return await shift.save();
};
exports.createShift = createShift;
const deleteShiftById = (id) => exports.ShiftModel.findOneAndDelete({ _id: id });
exports.deleteShiftById = deleteShiftById;
const updateShiftById = (id, values) => exports.ShiftModel.findByIdAndUpdate(id, values, { new: true });
exports.updateShiftById = updateShiftById;
