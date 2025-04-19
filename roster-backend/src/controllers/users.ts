import express from 'express';
import { AuthenticatedRequest } from '../middlewares/userPermissions';
import { UserModel, getUsers, getUserById, deleteUserById } from '../db/users'
import { random, authentication } from '../helpers/encryptedPassword';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const convertToBase64 = (image: any) =>
    image && image.data
        ? `data:${image.contentType};base64,${image.data.toString('base64')}`
        : null;

export const getUserProfile = async (req: AuthenticatedRequest, res: express.Response) => {
    console.log("@@ getUserProfile called")
    console.log("Request params:", req.params); 
    console.log("Request user:", req.user); 

    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: "Unauthorized request" });
    }

    try {
        const user = await getUserById(req.user._id); // @@ user from token
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User retrieved:", user.id);
        res.status(200).json({
            ...user.toObject(),
            profileImage: convertToBase64(user.profileImage),
            idFile: convertToBase64(user.idFile),
            visaFile: convertToBase64(user.visaFile)
        });
    } catch (error) {
        console.error("Error in getUserProfile:", error);
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

export const updateUser = async (req: AuthenticatedRequest, res: express.Response) => {
    console.log("@@ updateUser called");
    console.log("Headers:", req.headers);
    console.log("Raw request body:", req.body);
    if (!req.user) { return res.status(401).json({ message: "Unauthorized request" }); }

    const userId = req.params.id;     // @@ Get user ID from request params 

    const user = await getUserById(userId);  // @@ Get user ID from database
    if (!user) return res.status(404).json({ message: "User not found" });

    // @@ Get new values from request body
    const { name, email, phoneNumber, DOB, address, nationality, idNumber, visaExpiryDate, roleType } = req.body;
    user.name = name || user.name;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber ? phoneNumber.replace(/\D/g, '') : user.phoneNumber;
    user.DOB = DOB || user.DOB;
    user.address = address || user.address;
    user.nationality = nationality || user.nationality;
    user.idNumber = idNumber || user.idNumber;
    user.visaExpiryDate = visaExpiryDate || user.visaExpiryDate;
    user.roleType = roleType || user.roleType;

    if (req.body.password) {
        const newSalt = random();
        const hashedPassword = authentication(newSalt, req.body.password);
        user.authentication.salt = newSalt;
        user.authentication.password = hashedPassword;
    }

    if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const maxSize = 5 * 1024 * 1024; // @@ 5MB
        const allowedTypes = ['image/jpeg', 'image/png'];

        if (files['profileImage'] && files['profileImage'].length > 0) {
            const file = files['profileImage'][0];
  
            if (!allowedTypes.includes(file.mimetype)) {
              return res.status(400).json({ message: 'Invalid file type for profile image.' });
            }
          
            if (file.size > maxSize) {
              return res.status(400).json({ message: 'Profile image file is too large.' });
            }          
            user.profileImage = {
                data: file.buffer,
                contentType: file.mimetype,
            };
        }
        if (files['idFile'] && files['idFile'].length > 0) {
            const file = files['idFile'][0];
  
            if (!allowedTypes.includes(file.mimetype)) {
                return res.status(400).json({ message: 'Invalid file type for ID file.' });
            }
          
            if (file.size > maxSize) {
                return res.status(400).json({ message: 'ID file is too large.' });
            }          
            user.idFile = {
                data: file.buffer,
                contentType: file.mimetype,
            };
        }
        if (files['visaFile'] && files['visaFile'].length > 0) {
            const file = files['visaFile'][0];
  
            if (!allowedTypes.includes(file.mimetype)) {
                return res.status(400).json({ message: 'Invalid file type for visa file.' });
            }
          
            if (file.size > maxSize) {
                return res.status(400).json({ message: 'Visa file is too large.' });
            }          
            user.visaFile = {
                data: file.buffer,
                contentType: file.mimetype,
            };
        }
    }
    
    // @@ Save updated user
    await user.save();        
    const updatedUser = user.toObject();

    return res.status(200).json({
        message: "User updated successfully",
        user: {
            ...updatedUser,
            profileImage: convertToBase64(updatedUser.profileImage),
            idFile: convertToBase64(updatedUser.idFile),
            visaFile: convertToBase64(updatedUser.visaFile)
        }
    });
};

export const searchUsers = async (req: express.Request, res: express.Response) => {
    try {
        const searchQuery = req.query.searchQuery  || req.query.search;
        console.log("Searching.. : ",searchQuery );

        if (!searchQuery ) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const users = await UserModel.find({
            $or: [
                { name: { $regex: searchQuery , $options: "i" } }, 
                { email: { $regex: searchQuery , $options: "i" } },
                { phoneNumber: { $regex: searchQuery , $options: "i" } },
                { idNumber: { $regex: searchQuery , $options: "i" } },
                { roleType: { $regex: searchQuery , $options: "i" } },
                { nationality: { $regex: searchQuery , $options: "i" } },
            ]
        });

        console.log('Found users:', users); 
        res.status(200).json({ users });
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ message: "Internal server error" });
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