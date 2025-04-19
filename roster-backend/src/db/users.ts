import mongoose, { Document } from "mongoose";

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
export interface UserDocument extends Document, User {}

export const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    DOB: { type: Date, required: true },
    nationality: { type: String, required: true },
    visaExpiryDate: { type: Date, required: false },
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
        sessionToken: { type: String, required: false }
    }
});
const AuthSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    sessionToken: { type: String }, // @@ Store session tokens here
});
  
export const AuthModel = mongoose.model('Auth', AuthSchema);
  
export const UserModel = mongoose.model<UserDocument>('User', UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByName = (name: string) => UserModel.findOne({ name });
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({ 'authentication.sessionToken': sessionToken });
export const getUserById = async (id: string) => {
    const user = await UserModel.findById(id);
    return user || null; 
}
export const createUser = (values: Record<string, any>) => new UserModel(values)
    .save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id});
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);