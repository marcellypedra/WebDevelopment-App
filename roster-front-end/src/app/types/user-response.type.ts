export type UserResponse = { 
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
        profileImage: string, 
        idFile: string, 
        visaFile?: string, 
    };
};