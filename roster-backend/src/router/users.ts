import express from 'express';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

import { getUserProfile, getAllUsers, partiallyUpdateUser, updateUser, deleteUser } from '../controllers/users';
import { isAuthenticated, isManager, canUpdateUser } from '../middlewares/userPermissions';

const usersRouter = express.Router();

usersRouter.get('/:id', isAuthenticated, getUserProfile);
usersRouter.get('/', isAuthenticated, isManager, getAllUsers);

usersRouter.put('/:id', upload.single('profileImage'), updateUser);
usersRouter.put('/:id', updateUser);

usersRouter.patch('/:id', upload.single('profileImage'), partiallyUpdateUser);
usersRouter.patch('/:id', partiallyUpdateUser);

usersRouter.delete('/:id', deleteUser);

export default usersRouter;
