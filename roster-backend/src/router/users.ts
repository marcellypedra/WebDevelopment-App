import { Request, Response, Router } from 'express';
import multer from 'multer';
// import 
const upload = multer({ storage: multer.memoryStorage() });

import {
    login,
    refreshToken,
    logout,
    register,
    MulterRequest
} from '../controllers/auth';

import {
    getUserProfile,
    getAllUsers,
    searchUsers,
    updateUser,
    deleteUser
} from '../controllers/users';

import { authenticateUser, isManager } from '../middlewares/userPermissions';
import { authentication, random } from '../helpers/encryptedPassword';
import { createUser, getUserById } from '../db/users';
import { createShift } from '../db/shifts';
import mongoose from 'mongoose';

const userRouter = Router();

// ---------- Authentication Routes ----------
userRouter.post('/login', login);
userRouter.post('/refresh-token', refreshToken);
userRouter.post('/logout', logout);
userRouter.post('/register', upload.single('profileImage'), register);
// ---------- User Routes ----------
userRouter.get('/', getAllUsers);
userRouter.get('/search', authenticateUser, isManager, searchUsers);
userRouter.get('/:id', authenticateUser, getUserProfile);

userRouter.put('/:id', authenticateUser, upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'idFile', maxCount: 1 },
    { name: 'visaFile', maxCount: 1 }
]), updateUser);

userRouter.delete('/:id', authenticateUser, isManager, deleteUser);

export default userRouter;