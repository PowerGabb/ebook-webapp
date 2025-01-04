import db from '../config/db.js';
import { verifyAccessToken } from '../config/jwt.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Token tidak ditemukan' 
      });
    }

    const decoded = verifyAccessToken(token);

    const findUser = await db.user.findUnique({
      where: {
        id: decoded.userId
      }
    })
    req.user = findUser;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        status: 'error',
        message: 'Token telah kadaluarsa' 
      });
    }
    return res.status(403).json({ 
      status: 'error',
      message: 'Token tidak valid' 
    });
  }
};

export const authorizeAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Akses ditolak' });
    }
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }
}; 