// ~/shop-project/backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Make sure the path to User.js is correct
import dotenv from 'dotenv';

// Load environment variables from the .env file located in the parent (backend) directory
dotenv.config({ path: '../.env' });

const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the JWT_SECRET from your .env file
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID embedded in the token
      // .select('-password') ensures the password is not fetched
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        // If user associated with token is not found (e.g., deleted)
        res.status(401); // Unauthorized
        throw new Error('Not authorized, user not found for this token');
      }

      next(); // Token is valid, user is found, proceed to the protected route
    } catch (error) {
      console.error('Token verification error:', error.message);
      res.status(401); // Unauthorized
      let errorMessage = 'Not authorized, token failed';
      if (error.name === 'JsonWebTokenError') {
        errorMessage = 'Not authorized, token is invalid';
      } else if (error.name === 'TokenExpiredError') {
        errorMessage = 'Not authorized, token has expired';
      }
      // It's good practice to throw an error that can be caught by an error handling middleware
      // For now, we'll send the response directly.
      // throw new Error(errorMessage); // If you have a global error handler
      return res.status(401).json({ message: errorMessage }); // Send response immediately
    }
  }

  if (!token) {
    res.status(401); // Unauthorized
    // throw new Error('Not authorized, no token provided');
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export default protect;

