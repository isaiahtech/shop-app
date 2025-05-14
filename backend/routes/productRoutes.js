// ~/shop-project/backend/routes/productRoutes.js
import express from 'express';
// Import controller functions using ES module syntax
// Note the .js extension for local module imports is crucial when "type": "module" is in package.json
import {
  getProducts,
  seedProducts,
  getProductById,
} from '../controllers/productController.js';

const router = express.Router();

// --- Define Product Routes ---

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.route('/').get(getProducts);

// @desc    Seed sample products (for development/testing)
// @route   POST /api/products/seed
// @access  Public (should be Admin only in a real app)
router.route('/seed').post(seedProducts);

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
router.route('/:id').get(getProductById);

// Add more routes later for creating, updating, deleting products (admin only)

export default router; // Changed from module.exports

