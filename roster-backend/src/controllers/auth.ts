import express from "express";
import { Document } from 'mongoose';
import { UserDocument, UserModel, createUser, getUserByEmail } from "../db/users";
import { random, authentication } from "../helpers/encryptedPassword";

export const login = async (req: express.Request, res: express.Response) => {
    console.log('@@ Login called');
    try {
        const { email, password } = req.body;
        if (!email || !password){             
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await getUserByEmail(email).select('authentication.salt authentication.password name email phoneNumber roleType DOB address nationality visaExpiryDate idNumber profileImage');
        console.log("Found User:", user);
        if (!user) { 
            return res.status(404).json({ message: "User not found" }); 
        }

        const expectedHash = authentication(user.authentication.salt, password);
        if (user.authentication.password !== expectedHash){
            return res.status(403).json({ message: "Invalid credentials" });
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString())
        await user.save();

        res.cookie('ROSTER-AUTH', user.authentication.sessionToken, { 
            httpOnly: true,
            sameSite: 'lax',
            //secure: process.env.NODE_ENV === 'production',
            secure: true,
            domain: 'localhost',
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 // 1-day expiry for session token
        });
        console.log('Profile image type:', typeof user.profileImage);

        return res.status(200).json({
            message: "Login successful",
            token: user.authentication.sessionToken,
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            roleType: user.roleType,
            address: user.address,
            DOB: user.DOB,
            nationality: user.nationality,
            visaExpiryDate: user.visaExpiryDate,
            idNumber: user.idNumber,
            profileImage: user.profileImage && user.profileImage.data 
            ? `data:${user.profileImage.contentType};base64,${user.profileImage.data.toString('base64')}`
            : null
        });        
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
};
export const logout = async (req: express.Request, res: express.Response) => {
    try {
      res.clearCookie('ROSTER-AUTH', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        domain: 'localhost',
        path: '/'
      });
  
      const user = await getUserByEmail(req.body.email);
      if (user) {
        user.authentication.sessionToken = null; 
        await user.save();
      }
  
      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({ message: 'Failed to log out' });
    }
};
export const register = async (req: express.Request, res: express.Response) => {
    console.log('@@ Register called');
    try {
        console.log("@@@ Incoming request body:", req.body);
        console.log("@@@ Incoming request file:", req.file ? req.file.originalname : "No file uploaded");
        
        const { name, email, password, phoneNumber, address, DOB, nationality, roleType, visaExpiryDate, idNumber } = req.body;

        const requiredFields = ['name', 'email', 'password', 'phoneNumber', 'address', 'DOB', 'nationality', 'roleType', 'idNumber'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({ message: "Missing required information", missingFields });
        }

        const existingUser = await UserModel.findOne({ 
            $or: [{ email }, { idNumber }]
        });
        if (existingUser) {
            return res.status(400).json({ 
                message: existingUser.email === email ? "Email already exists" : "ID Number already exists" 
            });
        }
        
        const salt = random();
        const newUser = await createUser({
            name,
            email,
            phoneNumber,
            address,
            DOB: new Date(DOB),
            nationality,
            visaExpiryDate: visaExpiryDate ? new Date(visaExpiryDate) : undefined,
            idNumber,
            roleType,
            profileImage: req.file ? { 
                data: req.file.buffer, 
                contentType: req.file.mimetype
            } : null,            
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        });
        
        console.log("@@@ User created successfully:", newUser);

        return res.status(201).json({ message: "User created successfully", newUser });
    } catch (error) {
        console.error("@@@ Error during registration:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
