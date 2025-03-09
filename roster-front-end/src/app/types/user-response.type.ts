import { Buffer } from 'buffer';

export type UserResponse = { 
    token: string, 
    _id: string,
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
    profileImage: string, 
    idFile: string, 
    visaFile?: string, 
}