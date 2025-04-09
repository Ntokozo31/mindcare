// Import the express module
const express = require('express');

// Import the router from express
const router = express.Router();

// Import the controller functions for authentication
// These functions handle the logic for each route
// They are defined in the auth controller file
// These functions are responsible for handling the requests and responses
const { registerUser, loginUser } = require('../controllers/authController');

// Route for user registration
// This route uses the POST method to register a new user
// The controller function registerUser is called when this route is accessed
// It handles the registration logic, including validating the input data
router.post('/register', registerUser);

// Route for user login
// This route uses the POST method to log in a user
// The controller function loginUser is called when this route is accessed
// It verifies the user's credentials and returns a token if successful
// The token is used for authentication in subsequent requests
// The token is sent in the Authorization header of the request
router.post('/login', loginUser);

// Route for user logout
// This route uses the POST method to log out a user
// The controller function logoutUser is called when this route is accessed
// It invalidates the user's token and ends the session
// The token is sent in the Authorization header of the request
// The server verifies the token and logs out the user
//router.post('/logout', logoutUser);

// Export the router
module.exports = router;