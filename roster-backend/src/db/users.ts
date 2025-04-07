import mongoose, { Document, ObjectId } from "mongoose";

export interface User extends Document {
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
    DOB: Date;
    nationality: string;
    visaExpiryDate?: Date;
    idNumber: string;
    roleType: 'BarStaff' | 'FloorStaff' | 'Manager';
    authentication: {
        password: string;
        salt: string;
        sessionToken?: string;
    };
    profileImage?: {
        data: Buffer,
        contentType: String
    },
    idFile?: {
        data: Buffer,
        contentType: String
    },
    visaFile?: {
        data: Buffer,
        contentType: String
    }
}
export interface UserDocument extends Document, User {
    _id: mongoose.Types.ObjectId
 }

const UserSchema = new mongoose.Schema({
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

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByName = (name: string) => UserModel.findOne({ name });
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({ 'authentication.sessionToken': sessionToken });
export const getUserById = async (id: string): Promise<UserDocument> => {
    const user = await UserModel.findById(id).select('-authentication');
    if (!user) {
        throw new Error(`User with id ${id} not found`);
    }

    return user;
};
export const createUser = (values: Record<string, any>) => new UserModel(values)
    .save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);