// ~/shop-project/backend/controllers/authController.js
// Ensure "type": "module" is in your backend/package.json or change imports/exports to CommonJS

import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables from .env file located in the parent (backend) directory
dotenv.config({ path: '../.env' });

// --- Utility Function ---
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
      console.error('Error: JWT_SECRET is not defined in .env file');
      return null;
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
  }
  if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with that email' });
    }
    const user = await User.create({ name, email, password });
    if (user) {
      const token = generateToken(user._id);
      if (!token) {
          return res.status(500).json({ message: 'Server Error: Could not generate token' });
      }
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data - user creation failed' });
    }
  } catch (error) {
    console.error(`Register User Error: ${error.message}`);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email }).select('+password'); // Include password for comparison
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
       if (!token) {
          return res.status(500).json({ message: 'Server Error: Could not generate token' });
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(`Login User Error: ${error.message}`);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private (requires token, handled by 'protect' middleware)
const getUserProfile = async (req, res) => {
  // The 'protect' middleware (if used correctly in the route)
  // will have already verified the token and attached 'req.user'.
  if (req.user) {
    // Send back the user details (password is already excluded by .select('-password') in middleware)
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      // Add any other non-sensitive fields you want to return for the profile
    });
  } else {
    // This case should ideally not be reached if 'protect' middleware is working,
    // as it would have sent a 401 response already.
    res.status(404).json({ message: 'User not found' });
  }
};

// Export the controller functions
export {
  registerUser,
  loginUser,
  getUserProfile, // <<< EXPORT THE NEW FUNCTION
};

