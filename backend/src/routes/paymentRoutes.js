import express from 'express';
import { createPayment, handlePaymentNotification, getPaymentStatus } from '../controllers/paymentController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const paymentRoutes = express.Router();

// Protected routes (memerlukan login)
paymentRoutes.post('/create', authenticateToken, createPayment);
paymentRoutes.get('/status/:orderId', authenticateToken, getPaymentStatus);

// Webhook dari Midtrans (tidak memerlukan auth)
paymentRoutes.post('/notification', handlePaymentNotification);

export default paymentRoutes;