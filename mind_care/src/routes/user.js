// Import express
const express = require('express');

// Import the router from express
const router = express.Router();

// Import the user controller functions
const { getUserProfile, updateUserProfile, deleteUserProfile } = require('../controllers/user');

// Route to get user profile
router.get('/profile', getUserProfile);

// Route to update user profile
router.put('/profile', updateUserProfile);

// Route to delete user profile
router.delete('/profile', deleteUserProfile);

// Export the router
module.exports = router;