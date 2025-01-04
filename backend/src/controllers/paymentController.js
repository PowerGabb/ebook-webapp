import db from "../config/db.js";
import midtransClient from "midtrans-client";
import { addMonths } from 'date-fns';

// Inisialisasi Snap Midtrans
let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

export const createPayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { duration } = req.body; // duration in months

        // Validasi duration
        if (!duration || duration < 1) {
            return res.status(400).json({
                status: false,
                message: 'Durasi berlangganan tidak valid',
                error: ['Durasi berlangganan tidak valid'],
                data: null
            });
        }

        // Hitung harga
        const pricePerMonth = 50000; // Rp 50.000/bulan
        const amount = pricePerMonth * duration;

        // Buat order ID unik
        const orderId = `${userId}-${Date.now()}`;

        // Buat payment record
        const payment = await db.payment.create({
            data: {
                userId,
                amount,
                orderId,
                duration,
                status: 'pending'
            }
        });

        // Get user data
        const user = await db.user.findUnique({
            where: { id: userId },
            include: { profile: true }
        });

        // Create Midtrans transaction
        const transaction = {
            transaction_details: {
                order_id: orderId,
                gross_amount: amount
            },
            customer_details: {
                first_name: user.profile?.firstName || user.email,
                last_name: user.profile?.lastName || '',
                email: user.email,
                phone: user.profile?.phone || ''
            },
            item_details: [{
                id: 'PREMIUM_SUBSCRIPTION',
                price: pricePerMonth,
                quantity: duration,
                name: `Premium ${duration} Bulan`
            }],
            callbacks: {
                finish: `${process.env.FRONTEND_URL}/payment/finish`,
                error: `${process.env.FRONTEND_URL}/payment/error`,
                pending: `${process.env.FRONTEND_URL}/payment/pending`
            }
        };

        const midtransResponse = await snap.createTransaction(transaction);

        // Update payment dengan token dan URL dari Midtrans
        await db.payment.update({
            where: { id: payment.id },
            data: {
                snapToken: midtransResponse.token,
                paymentUrl: midtransResponse.redirect_url
            }
        });

        res.status(201).json({
            status: true,
            message: 'Payment created successfully',
            error: [],
            data: {
                orderId,
                amount,
                snapToken: midtransResponse.token,
                paymentUrl: midtransResponse.redirect_url
            }
        });
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({
            status: false,
            message: 'Failed to create payment',
            error: [error.message],
            data: null
        });
    }
};

export const handlePaymentNotification = async (req, res) => {
    try {
        const notification = req.body;

        const statusResponse = await snap.transaction.notification(notification);
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        let paymentStatus;
        if (transactionStatus === 'capture') {
            if (fraudStatus === 'challenge') {
                paymentStatus = 'pending';
            } else if (fraudStatus === 'accept') {
                paymentStatus = 'success';
            }
        } else if (transactionStatus === 'settlement') {
            paymentStatus = 'success';
        } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
            paymentStatus = 'failed';
        } else if (transactionStatus === 'pending') {
            paymentStatus = 'pending';
        }

        // Update payment status
        const payment = await db.payment.findUnique({
            where: { orderId }
        });

        if (!payment) {
            throw new Error('Payment not found');
        }

        // Jika pembayaran berhasil
        if (paymentStatus === 'success') {
            const paidAt = new Date();
            const expiredAt = addMonths(paidAt, payment.duration);

            // Update payment
            await db.payment.update({
                where: { orderId },
                data: {
                    status: paymentStatus,
                    paidAt,
                    expiredAt,
                    paymentType: statusResponse.payment_type
                }
            });

            // Update user premium status
            await db.user.update({
                where: { id: payment.userId },
                data: {
                    isPremium: true,
                    premiumExpiry: expiredAt
                }
            });
        } else {
            // Update payment status only
            await db.payment.update({
                where: { orderId },
                data: {
                    status: paymentStatus,
                    paymentType: statusResponse.payment_type
                }
            });
        }

        res.status(200).json({
            status: true,
            message: 'Payment notification handled successfully',
            error: [],
            data: null
        });
    } catch (error) {
        console.error('Error handling payment notification:', error);
        res.status(500).json({
            status: false,
            message: 'Failed to handle payment notification',
            error: [error.message],
            data: null
        });
    }
};

export const getPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const payment = await db.payment.findUnique({
            where: { orderId }
        });

        if (!payment) {
            return res.status(404).json({
                status: false,
                message: 'Payment not found',
                error: ['Payment not found'],
                data: null
            });
        }

        res.status(200).json({
            status: true,
            message: 'Payment status retrieved successfully',
            error: [],
            data: payment
        });
    } catch (error) {
        console.error('Error getting payment status:', error);
        res.status(500).json({
            status: false,
            message: 'Failed to get payment status',
            error: [error.message],
            data: null
        });
    }
};
