import { Request, Response } from 'express';
import { UserModel, getUsers, getUserById, deleteUserById } from '../db/users'
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const convertToBase64 = (image: any) =>
    image && image.data
        ? `data:${image.contentType};base64,${image.data.toString('base64')}`
        : null;

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    console.log("@@ getUserProfile called")
    console.log("Request params:", req.params);

    const { id } = req.params;

    if (!id || id === "undefined") {
        console.log("Invalid or missing ID in request!");
        res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        const user = await getUserById(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }

        console.log("User retrieved:", user.id);
        res.status(200).json({
            ...user.toObject(),
            profileImage: convertToBase64(user.profileImage),
            idFile: convertToBase64(user.idFile),
            visaFile: convertToBase64(user.visaFile)
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        } else {
            res.status(500).json({ message: "Unknown error occurred" });
        }
    }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    console.log(' @@ getAllUsers called');
    try {
        const users = await getUsers();
        console.log("Retrieved users:", users);
        res.status(200).json({ message: "Users retrieved successfully", users });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        } else {
            res.status(500).json({ message: "Unknown error occurred" });
        }
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    console.log("@@ updateUser called");
    console.log("Headers:", req.headers);
    console.log("Raw request body:", req.body);
    if (!req.body.user) { res.status(401).json({ message: "Unauthorized request" }); }

    const userId = req.params.id;     // @@ Get user ID from request params 

    const user = await getUserById(userId);  // @@ Get user ID from database
    if (!user) res.status(404).json({ message: "User not found" });

    let userData;
    try {
        userData = req.body.data ? JSON.parse(req.body.data) : req.body;
    } catch (error) {
        res.status(400).json({ message: "Invalid JSON format in request body" });
    }

    // @@ Get new values from request body
    const { name, phoneNumber, address } = req.body;
    user.name = name || user.name;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.address = address || user.address;

    if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (files['profileImage'] && files['profileImage'].length > 0) {
            user.profileImage = {
                data: files['profileImage'][0].buffer,
                contentType: files['profileImage'][0].mimetype,
            };
        }
        if (files['idFile'] && files['idFile'].length > 0) {
            user.idFile = {
                data: files['idFile'][0].buffer,
                contentType: files['idFile'][0].mimetype,
            };
        }
        if (files['visaFile'] && files['visaFile'].length > 0) {
            user.visaFile = {
                data: files['visaFile'][0].buffer,
                contentType: files['visaFile'][0].mimetype,
            };
        }
    }

    //@@ Save updated user
    await user.save();
    const updatedUser = user.toObject();

    res.status(200).json({
        message: "User updated successfully",
        user: {
            ...updatedUser,
            profileImage: convertToBase64(updatedUser.profileImage),
            idFile: convertToBase64(updatedUser.idFile),
            visaFile: convertToBase64(updatedUser.visaFile)
        }
    });
};

export const searchUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const search = req.query.search || req.query.search;
        console.log("Searching.. : ", search);

        if (!search) {
            res.status(400).json({ message: "Search query is required" });
        }

        const users = await UserModel.find({
            $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ]
        });

        res.status(200).json({ users });
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    console.log("@@ deleteUser called");
    try {
        const { id } = req.params;
        const deletedUser = await deleteUserById(id);

        if (!deletedUser) {
            res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully", deletedUser });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        } else {
            res.status(500).json({ message: "Unknown error occurred" });
        }
    }
}