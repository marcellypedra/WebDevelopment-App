export interface Users {
  _id?: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  DOB: Date;
  nationality: string;
  visaExpiryDate: Date;
  idNumber: string;
  roleType: string;
  profileImage?: string;
  idFile?: string;
  visaFile?: string;
}
