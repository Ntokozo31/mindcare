// Import express
const express = require('express');

// Import the router from express
const router = express.Router();

// Import the mental resources controller functions
// These functions handle the logic for each route
// They are defined in the mental resources controller file
const { getAllResources, createResource, updateResource, deleteResource } = require('../controllers/mentalResources');

// Route to get all mental resources
// This route uses the GET method to retrieve all mental resources
// The controller function getAllResources is called when this route is accessed
router.get('/all', getAllResources);

// Route to create a new mental resource
// This route uses the POST method to create a new mental resource
// The controller function createResource is called when this route is accessed
router.post('/create', createResource);

// Route to update an existing mental resource
// This route uses the PUT method to update an existing mental resource
// The controller function updateResource is called when this route is accessed
// The :id parameter is used to specify which mental resource to update
router.put('/update/:id', updateResource);

// Route to delete a mental resource
// This route uses the DELETE method to delete a mental resource
// The controller function deleteResource is called when this route is accessed
router.delete('/delete/:id', deleteResource);


// Export the router
module.exports = router;