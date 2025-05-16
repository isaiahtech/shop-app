// ~/shop-project/backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userFromDB = await User.findById(decoded.id).select('name email isAdmin');

      console.log('--- Inside PROTECT middleware ---');
      if (userFromDB) {
        // Convert Mongoose document to a plain JavaScript object
        const plainUserObject = userFromDB.toObject(); // <<< KEY CHANGE HERE

        console.log('User document fetched from DB (userFromDB):', JSON.stringify(userFromDB, null, 2));
        console.log('Value of userFromDB.isAdmin directly (before .toObject()):', userFromDB.isAdmin);
        console.log('Plain user object (plainUserObject):', JSON.stringify(plainUserObject, null, 2));
        console.log('Value of plainUserObject.isAdmin directly:', plainUserObject.isAdmin);

        req.user = plainUserObject; // Assign the plain object to req.user

      } else {
        console.log('User NOT found by token ID in DB after decoding token.');
        req.user = null;
      }

      if (!req.user) {
        res.status(401);
        return res.status(401).json({ message: 'Not authorized, user not found for this token' });
      }
      
      console.log('Final req.user before next():', JSON.stringify(req.user, null, 2));

      next();
    } catch (error) {
      console.error('Token verification error in PROTECT middleware:', error.message);
      res.status(401);
      let errorMessage = 'Not authorized, token failed';
      if (error.name === 'JsonWebTokenError') {
        errorMessage = 'Not authorized, token is invalid';
      } else if (error.name === 'TokenExpiredError') {
        errorMessage = 'Not authorized, token has expired';
      }
      return res.status(401).json({ message: errorMessage });
    }
  }

  if (!token) {
    res.status(401);
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export default protect;

