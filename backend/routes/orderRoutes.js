// ~/shop-project/backend/routes/orderRoutes.js
import express from 'express';
import { addOrderItems } from '../controllers/orderController.js';
import protect from '../middleware/authMiddleware.js'; // To protect the route

const router = express.Router();

// --- Define Order Routes ---

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (logged-in users only)
router.route('/').post(protect, addOrderItems);

// Add more routes later:
// router.route('/myorders').get(protect, getMyOrders);
// router.route('/:id').get(protect, getOrderById);
// router.route('/:id/pay').put(protect, updateOrderToPaid);
// router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered); // Example with admin middleware

export default router;

