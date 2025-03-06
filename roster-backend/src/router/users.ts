import express from 'express';

import { getAllUsers, partiallyUpdateUser, updateUser, deleteUser } from '../controllers/users';
import { isAuthenticated, isManager, canUpdateUser } from '../middlewares/userPermissions';

export default (router: express.Router) => {
    router.get('/users', isAuthenticated, isManager, getAllUsers);
    router.put('/users/:id', isAuthenticated, isManager, updateUser);
    router.patch('/users/:id', isAuthenticated, canUpdateUser, partiallyUpdateUser);
    router.delete('/users/:id', isAuthenticated, isManager, deleteUser);
}