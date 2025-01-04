import express from "express";
import { createUser, deleteUser, getAllUser, getUserById, updateUser, getMyProfile, updateMyProfile } from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdmin.js";

const userRoutes = express.Router();

userRoutes.use(authenticateToken);

// Profile routes
userRoutes.get('/profile/me', getMyProfile);
userRoutes.put('/profile/me', updateMyProfile);

// Admin routes
userRoutes.get('/:id', getUserById);
userRoutes.get('/', isAdmin, getAllUser);
userRoutes.delete('/:id', isAdmin, deleteUser);
userRoutes.put('/:id', updateUser);
userRoutes.post('/', isAdmin, createUser);

export default userRoutes;