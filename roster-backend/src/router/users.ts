import express from 'express';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

import { getUserProfile, getAllUsers, searchUsers, updateUser, deleteUser } from '../controllers/users';
import { authenticateUser, isManager } from '../middlewares/userPermissions';

const usersRouter = express.Router();

usersRouter.use(authenticateUser);

usersRouter.get('/', isManager, getAllUsers);

usersRouter.get('/search', isManager, searchUsers); 

usersRouter.get('/profile', authenticateUser, getUserProfile);
usersRouter.get('/:id', getUserProfile); 

usersRouter.put('/:id', upload.fields([
    { name: 'profileImage' }, { name: 'idFile' }, { name: 'visaFile' }
]), updateUser);

usersRouter.delete('/:id', isManager, deleteUser);

export default usersRouter;
