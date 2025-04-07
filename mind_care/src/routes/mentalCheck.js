// Import express
const express = require('express');

// Import the router from express
const router = express.Router();

// Import the mental check controller functions
// These functions handle the logic for each route 
// They are defined in the mental check controller file
// These functions are responsible for handling the requests and responses
const { createMentalCheck, getAllMentalCheck } = require('../controllers/mentalCheck');

// Route to create a new mental check
// This route uses the POST method to create a new mental check
// The controller function mentalCheck is called when this route is accessed
router.post('/mentalCheck', createMentalCheck);

// Route to get all mental checks.
// This route uses the GET method to retrieve all mental checks.
// The controller function getAllMentalCheck is called when this route is accessed
router.get('/mentalCheck', getAllMentalCheck);

// Export the router
module.exports = router;