const express = require('express');

const router = express.Router();

const { registerUser, loginUser, logoutUser } = require('../controllers/auth');

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Route for user logout
router.post('/logout', logoutUser);

// Export the router
module.exports = router;