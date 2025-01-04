import express from "express";
import {refreshToken, register } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { login } from "../controllers/authController.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/refresh-token",refreshToken);

export default authRoutes;
