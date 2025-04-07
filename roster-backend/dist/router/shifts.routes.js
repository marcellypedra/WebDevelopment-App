"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const express_1 = require("express");
const userPermissions_1 = require("../middlewares/userPermissions");
const users_1 = require("../db/users");
const shifts_1 = require("../db/shifts");
const shiftsRouter = (0, express_1.Router)();
shiftsRouter.get("/user", userPermissions_1.authenticateUser, async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!mongodb_1.ObjectId.isValid(userId)) {
            res.status(400).json({ message: "User Id is not valid" });
            return;
        }
        const user = await (0, users_1.getUserById)(userId);
        if (!user || user === null) {
            res.status(404).json({ message: "User not found" });
            return;
            /*We dont return the response because express handles
             the return on its own. But we still write return because we
             want the execution of the program to stop once the error message is returned*/
        }
        const shiftsForUser = await shifts_1.ShiftModel.find({
            userId: user._id
        });
        if (!(shiftsForUser === null || shiftsForUser === void 0 ? void 0 : shiftsForUser.length)) {
            res.status(404).json({ message: "Shifts not found for user" });
            return;
        }
        return res.status(200).json({ user, shiftsForUser });
    }
    catch (error) {
        console.error("There was an error while fetching the shifts for user");
        res.status(500).json({ message: "Server error" });
    }
});
shiftsRouter.get("/date/:dateSelected", userPermissions_1.authenticateUser, async (req, res) => {
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
        const allShiftsForDateSelected = await shifts_1.ShiftModel.find({
            shiftDate: { $gte: startOfDay, $lt: endOfDay },
        }).populate({ path: 'nonExistentField', strictPopulate: false });
        if (!allShiftsForDateSelected.length) {
            res.status(404).json({ message: "No shifts found for the selected date" });
            return;
        }
        const shiftsAndUserDetails = await Promise.all(allShiftsForDateSelected.map(async (shift) => {
            const user = await (0, users_1.getUserById)(shift.userId._id.toString());
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
        }));
        res.status(200).json({ shifts: shiftsAndUserDetails });
    }
    catch (error) {
        console.error("❌ Error in fetching shifts by date:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.default = shiftsRouter;
