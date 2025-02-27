import * as mongodb from "mongodb";

export interface Users {
    _id?: mongodb.ObjectId;
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
    DOB: Date;
    nationality: string;
    visaExpiryDate: Date;
    idNumber: string;
    roleType: string;
    profileImage: mongodb.Binary;
    idFile: mongodb.Binary;
    visaFile?:mongodb.Binary;
    

}