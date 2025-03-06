import express from 'express';
import { getUsers, updateUserById, deleteUserById, getUserById } from '../db/userModel'

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    console.log(' @@ getAllUsers called');
    try {
        const users = await getUsers();
        return res.status(200).json({ message: "Users retrieved successfully", users });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const partiallyUpdateUser = async (req: express.Request, res: express.Response) => {
    console.log(" @@ partiallyUpdateUser called");    
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

        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (password) user.authentication.password = password; 
        if (address) user.address = address;

        await user.save();
        return res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    console.log(" @@ updateUser called");    
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
        if (name) user.name = name;
        if (DOB) user.DOB = DOB;
        if (email) user.email = email;
        if (password) user.authentication.password = password; 
        if (phoneNumber) user.phoneNumber = phoneNumber;
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
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    console.log("@@ deleteUser called");    
    try {
        const { id } = req.params;
        const deletedUser = await deleteUserById(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}