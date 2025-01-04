import express from 'express';
import { getDashboardData } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';


const dashboardRoutes = express.Router();
dashboardRoutes.get('/', getDashboardData);

export default dashboardRoutes;                                                                     