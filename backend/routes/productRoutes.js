// ~/shop-project/backend/routes/productRoutes.js
import express from 'express';
import {
  getProducts,
  getProductById,
  seedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import protect from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js';

const router = express.Router();

// --- Public Routes for fetching products ---
// Anyone can view all products or a single product.
router.route('/').get(getProducts);        // <<< REMOVED protect
router.route('/:id').get(getProductById); // <<< REMOVED protect

// --- Admin Only Routes for Product Management ---
// To create a new product (requires login and admin status)
router.route('/').post(protect, admin, createProduct);

// To update or delete a specific product (requires login and admin status)
router.route('/:id')
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

// Seed products route (requires login and admin status)
router.route('/seed').post(protect, admin, seedProducts);

export default router;

