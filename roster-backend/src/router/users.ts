import express from 'express';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

import { getUserProfile, getAllUsers, searchUsers, updateUser, deleteUser } from '../controllers/users';
import { authenticateUser, isManager } from '../middlewares/userPermissions';

const usersRouter = express.Router();

usersRouter.use(authenticateUser);

usersRouter.get('/', isManager, getAllUsers);

usersRouter.get('/search', isManager, searchUsers); 
usersRouter.get('/:id', getUserProfile); 

usersRouter.put('/:id', upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'idFile', maxCount: 1 },
    { name: 'visaFile', maxCount: 1 }
]), updateUser);

usersRouter.delete('/:id', isManager, deleteUser);

export default usersRouter;
