// Import express
const express = require('express');

// Import the router from express
const router = express.Router();

// Import the journal controller functions
// These functions handle the logic for each route
// They are defined in the journal controller file
//const { getAllEntries, createEntry, updateEntry, deleteEntry } = require('../controllers/journal');

// Route to get all journal entries
// This route uses the GET method to retrieve all journal entries
// The controller function getAllEntries is called when this route is accessed
router.get('/journals', getAllEntries);

// Route to create a new journal entry
// This route uses the POST method to create a new journal entry
// The controller function createEntry is called when this route is accessed
router.post('/create', createEntry);

// Route to update an existing journal entry
// This route uses the PUT method to update an existing journal entry
// The controller function updateEntry is called when this route is accessed
router.put('/update/:id', updateEntry);

// Route to delete a journal entry
// This route uses the DELETE method to delete a journal entry
// The controller function deleteEntry is called when this route is accessed
// The :id parameter is used to specify which journal entry to delete
// The id of the journal entry is passed to the controller function
router.delete('/delete/:id', deleteEntry);

// Export the router
module.exports = router;