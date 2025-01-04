import express from 'express';
import { getAllBooks, getBookById, createBook, updateBook, deleteBook, addRead } from '../controllers/bookController.js';
import { addToFavorites, getFavorites, checkFavorite } from '../controllers/favoriteController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { upload } from '../config/multerConfig.js';
import isAdmin from '../middlewares/isAdmin.js';

const bookRoutes = express.Router();

bookRoutes.get('/', getAllBooks);
bookRoutes.get('/:id', getBookById);
bookRoutes.get('/read/:bookId', authenticateToken, addRead);

// Favorite routes
bookRoutes.get('/favorites/list', authenticateToken, getFavorites);
bookRoutes.get('/favorites/check/:bookId', authenticateToken, checkFavorite);
bookRoutes.post('/favorites/:bookId', authenticateToken, addToFavorites);

bookRoutes.delete('/:id', isAdmin, deleteBook);
bookRoutes.post('/', isAdmin, upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'epubFile', maxCount: 1 }
]), createBook);
bookRoutes.put('/:id', isAdmin, upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'epubFile', maxCount: 1 }
]), updateBook);

export default bookRoutes;