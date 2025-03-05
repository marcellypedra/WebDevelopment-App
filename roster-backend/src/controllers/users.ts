import express from 'express';
import { getUsers, updateUserById, deleteUserById, getUserById } from '../db/userModel'

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();

        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const partiallyUpdateUser = async (req: express.Request, res: express.Response) => {
    console.log("Partially update user function called");    
    try {
        const { id } = req.params;
        const { email, phoneNumber, password, address } = req.body;
        
        console.log("Request body:", req.body);

        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No update fields provided" });
        }
        
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update only the fields that are provided
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        //if (password) user.authentication.password = password; // Assuming password hashing is handled elsewhere
        if (address) user.address = address;

        await user.save();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    console.log("Update user function called");    
    try {
        const { id } = req.params;
        const { name, DOB, email, phoneNumber, password, address, nationality, visaExpiryDate, idNumber, roleType } = req.body;
        console.log("Request body:", req.body);

        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No update fields provided" });
        }

        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });        
        }
        //user.name = name;
        if (name) user.name = name;
        if (DOB) user.DOB = DOB;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        //if (password) user.password = password;
        if (address) user.address = address;
        if (nationality) user.nationality = nationality;
        if (visaExpiryDate) user.visaExpiryDate = visaExpiryDate;
        if (idNumber) user.idNumber = idNumber;
        if (roleType) user.roleType = roleType;

        await user.save();
        console.log("User updated successfully:", user);
        return res.status(200).json(user).end();
    } catch (error) {
        console.error("Error in update user function:", error);
        return res.status(400).json({ message: "Bad Request", error: error.message });
}
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    console.log("Delete user function called");    
    try {
        const { id } = req.params;
        const deletedUser = await deleteUserById(id);

        return res.status(200).json(deletedUser);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}