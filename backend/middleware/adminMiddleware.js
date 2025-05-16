// ~/shop-project/backend/middleware/adminMiddleware.js
// This middleware assumes the 'protect' middleware (authMiddleware.js)
// has already run and successfully attached the user object to req.user.

const admin = (req, res, next) => {
  // --- DEBUG LOGGING ---
  console.log('--- Inside ADMIN middleware ---');
  if (req.user) {
    console.log('User object received in ADMIN middleware (req.user):', JSON.stringify({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email, // Log email for verification
      isAdmin: req.user.isAdmin // Crucial value to check in logs
    }, null, 2));
  } else {
    // This case should ideally not be reached if 'protect' runs first and requires a user.
    // If it is reached, it means 'protect' middleware didn't set req.user or wasn't run.
    console.log('No req.user object found in ADMIN middleware. This indicates an issue with the "protect" middleware or route setup.');
  }
  // --- END DEBUG LOGGING ---

  // Explicitly check if req.user exists and if req.user.isAdmin is strictly true
  if (req.user && req.user.isAdmin === true) {
    console.log('Admin check PASSED. User is admin.');
    next(); // User is an admin, proceed to the next middleware or route handler
  } else {
    if (req.user) {
        console.log(`Admin check FAILED. req.user.isAdmin is: ${req.user.isAdmin} (Type: ${typeof req.user.isAdmin})`);
    } else {
        console.log('Admin check FAILED because req.user is not defined.');
    }
    res.status(403); // 403 Forbidden status for non-admin users or if req.user is missing
    return res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

export default admin;

