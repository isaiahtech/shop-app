// ~/shop-project/backend/routes/authRoutes.js
// Ensure "type": "module" is in your backend/package.json or change imports/exports to CommonJS

import express from 'express';
// Import controller functions, including the new getUserProfile
import { registerUser, loginUser, getUserProfile } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js'; // Import the protect middleware

const router = express.Router();

// --- Define Authentication Routes ---

// Public routes for registration and login
router.post('/register', registerUser);
router.post('/login', loginUser);

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private (this route is now protected by the 'protect' middleware)
router.route('/profile').get(protect, getUserProfile); // <<< ADD THIS NEW PROTECTED ROUTE

export default router;

