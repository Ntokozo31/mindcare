// Import the express module
const express = require('express');

// Import the router from express
const router = express.Router();

// Import the support controller functions
// These functions handle the logic for each route
// They are defined in the support controller file
// These functions are responsible for handling the requests and responses
const { getSupportResources, createSupportResource, updateSupportResource, deleteSupportResource } = require('../controllers/support');

// Route to get all support resources
// This route uses the GET method to retrieve all support resources
// The controller function getSupportResources is called when this route is accessed
router.get('/all', getSupportResources);

// Route to create a new support resource
// This route uses the POST method to create a new support resource.
// The controller function createSupportResource is called when this route is accessed
router.post('/create', createSupportResource);

// Route to update an existing support resource
// This route uses the PUT method to update an existing support resource
// The controller function updateSupportResource is called when this route is accessed
router.put('/update/:id', updateSupportResource);

// Route to delete a support resource
// This route uses the DELETE method to delete a support resource
// The controller function deleteSupportResource is called when this route is accessed
// The :id parameter is used to specify which support resource to delete
// The id of the support resource is passed to the controller function
router.delete('/delete/:id', deleteSupportResource);

// Export the router
module.exports = router;