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
router.get('/mentalResources', getAllResources);

// Route to create a new mental resource
// This route uses the POST method to create a new mental resource
// The controller function createResource is called when this route is accessed
router.post('/mentalResources', createResource);