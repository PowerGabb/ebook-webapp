import express from 'express';
import { listCategories, createCategory, updateCategory, deleteCategory, getCategoryById } from '../controllers/categoryController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/isAdmin.js';
const categoryRoutes = express.Router();

categoryRoutes.get('/', listCategories);
categoryRoutes.get('/:id', getCategoryById);
categoryRoutes.post('/', isAdmin, createCategory);
categoryRoutes.put('/:id', isAdmin, updateCategory);
categoryRoutes.delete('/:id', isAdmin, deleteCategory);

export default categoryRoutes;