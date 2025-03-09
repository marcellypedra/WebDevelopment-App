import express from 'express';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

import { login, logout, register } from '../controllers/auth';

const authenticationRouter = express.Router();

authenticationRouter.post('/login', login);
//authenticationRouter.post('/authenticateUser', authenticateUser);
authenticationRouter.post('/logout', logout);
authenticationRouter.post('/register', upload.single('profileImage'), register);

export default authenticationRouter;
