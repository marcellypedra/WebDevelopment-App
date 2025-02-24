import * as mongodb from "mongodb";

export interface Users {
    name: string;
    phoneNumber: number;
    email: string;
    address: string;
    DOB: Date;
    nationality: string;
    visaexpirydate: Date;
    idnumber: string;
    profileImage: mongodb.Binary;
    idFile: mongodb.Binary;
    visaFile?:mongodb.Binary;
    _id?: mongodb.ObjectId;

}