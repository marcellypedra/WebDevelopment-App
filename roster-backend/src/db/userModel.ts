import mongoose, { Document } from "mongoose";
import { User } from "./users";

const UserSchema = new mongoose.Schema<User>({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    DOB: { type: Date, required: true },
    nationality: { type: String, required: true },
    visaExpiryDate: { type: Date, required: false },
    idNumber: { type: String, required: true, unique: true },
    roleType: { type: String, enum: ['BarStaff', 'FloorStaff', 'Manager'], required: true
    },
    //idFile: { type: Buffer }, 
    //visaFile: { type: Buffer },
    //profileImage: { type: Buffer }, 
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, required: true, select: false },
        sessionToken: { type: String, select: false }
    }
})

export const UserModel = mongoose.model<User>('User', UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({ 'authentication.sessionToken': sessionToken });
export const getUserById = async (id: string) => {
    const user = await UserModel.findById(id);
    return user || null; 
}
export const createUser = (values: Record<string, any>) => new UserModel(values)
    .save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id});
//export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);
export const updateUserById = (id: string, values: Record<string, any>) =>     UserModel.findByIdAndUpdate(id, values, { new: true }).lean().exec();

