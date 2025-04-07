"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
// import 
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const auth_1 = require("../controllers/auth");
const users_1 = require("../controllers/users");
const userPermissions_1 = require("../middlewares/userPermissions");
const userRouter = (0, express_1.Router)();
// ---------- Authentication Routes ----------
userRouter.post('/login', auth_1.login);
userRouter.post('/refresh-token', auth_1.refreshToken);
userRouter.post('/logout', auth_1.logout);
userRouter.post('/register', upload.single('profileImage'), auth_1.register);
// ---------- User Routes ----------
userRouter.get('/', users_1.getAllUsers);
userRouter.get('/search', userPermissions_1.authenticateUser, userPermissions_1.isManager, users_1.searchUsers);
userRouter.get('/:id', userPermissions_1.authenticateUser, users_1.getUserProfile);
userRouter.put('/:id', userPermissions_1.authenticateUser, upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'idFile', maxCount: 1 },
    { name: 'visaFile', maxCount: 1 }
]), users_1.updateUser);
userRouter.delete('/:id', userPermissions_1.authenticateUser, userPermissions_1.isManager, users_1.deleteUser);
exports.default = userRouter;
