import express from 'express';
import { getUsers, deleteUserById, getUserById, getUserByEmail } from '../db/users'

export const getUserProfile = async (req: express.Request, res: express.Response) => {
    console.log("@@ getUserProfile called");

    console.log("Request params:", req.params); 
    try {
        const { id } = req.params;
        const user = await getUserById(id);
        console.log("User retrieved:", user);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userObject = user.toObject();
        let profileImage = null;

        if (userObject.profileImage && Buffer.isBuffer(userObject.profileImage.data)) {
            profileImage = 
            `data:${userObject.profileImage.contentType};base64,${userObject.profileImage.data.toString('base64')}`;
        }               

        // Return the user object with the base64 encoded image
        return res.status(200).json({
            ...userObject,
            profileImage
        });
    } catch (error) {
        console.error("Error in getUserProfile function:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    console.log(' @@ getAllUsers called');
    try {
        const users = await getUsers();
        console.log("Retrieved users:", users);
        return res.status(200).json({ message: "Users retrieved successfully", users });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const partiallyUpdateUser = async (req: express.Request, res: express.Response) => {
    console.log('@@ partiallyUpdateUser called');
    console.log("Raw request body:", req.body);
    console.log("Raw request file:", req.file ? req.file.originalname : "No file uploaded");

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
    console.log('@@ updateUser called');
    console.log("Raw request body:", req.body);
    console.log("Raw request file:", req.file ? req.file.originalname : "No file uploaded");

    try {
        const { email, name, phoneNumber, address } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required for update" });

        const user = await getUserByEmail(email);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = name || user.name;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.address = address || user.address;

        if (req.file) {
            user.profileImage = { data: Buffer.from(req.file.buffer), contentType: req.file.mimetype };
        }

        await user.save();
        return res.status(200).json({ message: "User updated successfully", user });

    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


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