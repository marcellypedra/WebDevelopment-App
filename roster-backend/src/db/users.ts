import { Document } from "mongoose";

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
    profileImage: { type: Buffer }, 
    idFile: { type: Buffer }, 
    visaFile?:{ type: Buffer }, 
}