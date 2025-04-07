"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserById = exports.deleteUserById = exports.createUser = exports.getUserById = exports.getUserBySessionToken = exports.getUserByEmail = exports.getUserByName = exports.getUsers = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    DOB: { type: Date, required: true },
    nationality: { type: String, required: true },
    visaExpiryDate: { type: Date },
    idNumber: { type: String, required: true, unique: true },
    roleType: { type: String, required: true, enum: ['BarStaff', 'FloorStaff', 'Manager'] },
    profileImage: {
        data: Buffer,
        contentType: String
    },
    visaFile: {
        data: Buffer,
        contentType: String
    },
    idFile: {
        data: Buffer,
        contentType: String
    },
    authentication: {
        salt: { type: String, required: true },
        password: { type: String, required: true },
        sessionToken: { type: String }
    }
}, {
    versionKey: false
});
exports.UserModel = mongoose_1.default.model('User', UserSchema);
const getUsers = () => exports.UserModel.find();
exports.getUsers = getUsers;
const getUserByName = (name) => exports.UserModel.findOne({ name });
exports.getUserByName = getUserByName;
const getUserByEmail = (email) => exports.UserModel.findOne({ email });
exports.getUserByEmail = getUserByEmail;
const getUserBySessionToken = (sessionToken) => exports.UserModel.findOne({ 'authentication.sessionToken': sessionToken });
exports.getUserBySessionToken = getUserBySessionToken;
const getUserById = async (id) => {
    const user = await exports.UserModel.findById(id).select('-authentication');
    if (!user) {
        throw new Error(`User with id ${id} not found`);
    }
    return user;
};
exports.getUserById = getUserById;
const createUser = (values) => new exports.UserModel(values)
    .save().then((user) => user.toObject());
exports.createUser = createUser;
const deleteUserById = (id) => exports.UserModel.findOneAndDelete({ _id: id });
exports.deleteUserById = deleteUserById;
const updateUserById = (id, values) => exports.UserModel.findByIdAndUpdate(id, values);
exports.updateUserById = updateUserById;
