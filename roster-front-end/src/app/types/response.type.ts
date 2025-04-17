export type UserResponse = { //ShiftResponse
    accessToken: string,  
    id: string;
    user: {
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
        profileImage?: string, 
        idFile?: string, 
        visaFile?: string, 
    };
};
export interface User {
    id: string;
    name: string;
    email: string;
    roleType: string;
}
export interface ShiftsResponse {
    user: User; 
    shiftsForUser: Shift[];
}
export interface TeamShiftsResponse {
    shiftsForTeam: Shift[];
}  

export interface Shift {
    _id?: string;
    userId?: string;
    shiftDate: string;
    startTime: string;
    endTime: string;
}
