import express from "express";
import mongoose from "mongoose";
import { createUser, getUserByEmail } from "../db/userModel";
import { random, authentication } from "../helpers/encryptedPassword";

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password){             
            return res.status(400);
        }

        const user = await getUserByEmail(email).select('authentication.salt authentication.password');
        if (!user) { return res.sendStatus(400); }

        const expectedHash = authentication(user.authentication.salt, password);
        if (user.authentication.password !== expectedHash){
            return res.sendStatus(403);
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString())
        
        await user.save();

        res.cookie('ROSTER-AUTH', user.authentication.sessionToken, { 
                                httpOnly: true, 
                                sameSite: 'lax',
                                secure: process.env.NODE_ENV === 'production', 
                                domain: 'localhost', path: '/'
                            });
        return res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { name, email, password, phoneNumber, address, DOB, nationality, roleType,visaExpiryDate, idNumber } = req.body;
        if (!name || !email || !password){
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existingEmail = await getUserByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const existingIdNumber = await getUserByEmail(idNumber);
        if (existingIdNumber) {
            return res.status(400).json({ message: "idNumber already exists" });
        }

        const salt = random();
        const user = await createUser({
            name, email, phoneNumber,  address, DOB, nationality, visaExpiryDate, idNumber, roleType,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        })

        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}