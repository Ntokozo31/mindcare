const { getDB } = require('../config/db');

// Import dotenv to load environment variables  
require('dotenv').config();

// Import JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET;

// Import ObjectId from mongodb
const { ObjectId } = require('mongodb');

// Import jwt from jsonwebtoken
const jwt = require('jsonwebtoken');

// Function to handle journal entry retrieval
const getAllEntries = async (req, res) => {
    try {

        // Get user token from cookies
        const userToken = req.cookies.token;

        // Check if the user is authenticated
        // If the user is not authenticated, return an error response
        if (req.params.id !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // If the user ID is not provided, return an error response
        if (!userToken) {
            return res.status(401).json({ message: 'Sorry please try to login again.' });
        }
        // Decode the token to get the user ID
        // Use jwt.verify to decode the token using the JWT_SECRET
        const decoded = jwt.verify(userToken, JWT_SECRET);

        // Get the user ID from the decoded token
        const userId = decoded.id;
        // Check if the user ID is valid
        if (!userId) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Connect to the database
        const db = getDB();

        // Convert the user ID to ObjectId
        const objectId = new ObjectId(userId);

        // Find all journal entries for the user in the database
        const entries = await db.collection('Journals').find(
            {userId: objectId },
            {
                projection: {
                    _id: 0,
                    name: 1,
                    prompt: 1,
                    date: 1,
                }
            }
        ).toArray();

        // If entries are not found, return an error response.
        if (entries.length === 0) {
            return res.status(404).json({ message: 'No journal entries found' });
        }
        // Return the journal entries
        return res.status(200).json(entries);
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error retrieving journal entries:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// Function to handle journal entry creation
const createEntry = async (req, res) => {
    try {
        // Get title and content from the request body
        const { name, prompt } = req.body;

        // Check if title and content are provided
        // If any of them is missing, return an error response
        if (!name|| !prompt) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        // Validate the title and content
        // Check if the title and content are at least 6 characters long
        // If the title or content is less than 6 characters, return an error response 
        if (!name || name.length < 6) {
            return res.status(400).json({ message: 'Title must be at least 6 characters long' });
        }
        if (!prompt || prompt.length < 6) {
            return res.status(400).json({ message: 'Content must be at least 6 characters long' });
        }

        // Get user token from cookies
        const userToken = req.cookies.token;
        // Check if the user is authenticated
        // If the user is not authenticated, return an error response
        if (req.params.id !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // If the userToken is not provided, return an error response
        if (!userToken) {
            return res.status(401).json({ message: 'Sorry please try to login again.' });
        }

        // Decode the token to get the user ID
        // Use jwt.verify to decode the token using the JWT_SECRET
        const decoded = jwt.verify(userToken, JWT_SECRET);

        // Get the user ID from the decoded token
        const userId = decoded.id;

        // Check if the user ID is valid
        if (!userId) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Connect to database
        const db = getDB();
        // Convert the user ID to ObjectId
        const objectId = new ObjectId(userId);
        // Create a new journal entry
        const newEntry = {
            userId: objectId,
            name: req.body.name,
            prompt: req.body.prompt,
            date: new Date()
        };
        // Insert the new entry into the database
        const result = await db.collection('Journals').insertOne(newEntry);
        
        // If the entry is created successfully, return a success response
        if (result.insertedId) {
            return res.status(201).json({ message: 'Journal entry created successfully' });
        } else {
            return res.status(500).json({ message: 'Failed to create journal entry' });
        }
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error creating journal entry:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// Function to handle journal entry type retrieval
const getJournalTypes = async (req, res) => {
    try {
        // Get token from cookies
        const userToken = req.cookies.token;
        // Check if the user is authenticated
        // If the user is not authenticated, return an error response
        if (req.params.id !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // If the userToken is not provided, return an error response
        if (!userToken) {
            return res.status(401).json({ message: 'Sorry please try to login again.' });
        }

        // Decode the token to get the user ID
        // Use jwt.verify to decode the token using the JWT_SECRET
        const decoded = jwt.verify(userToken, JWT_SECRET);

        // Get the user ID from the decoded token
        const userId = decoded.id;

        // Connect to the database
        const db = getDB();

        // Find all journal types in the database
        const types = await db.collection('JournalsType').find({}, { projection: {_id: 0} }).toArray();

        // If types are not found, return an error response
        if (types.length === 0) {
            return res.status(404).json({ message: 'No journal types found' });
        }
        // Return the journal types
        return res.status(200).json(types);
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error retrieving journal types:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// Function to handle journal entry update
const updateEntry = async (req, res) => {
    try {
        // Get token from cookies
        const userToken = req.cookies.token;

        // Check if the user is aunthenticated
        // If the user is not authenticated, return an error response
        if (req.params.id !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // If the userToken is not provided, return an error response
        if (!userToken) {
            return res.status(401).json({ message: 'Sorry please try to login again.' });
        }

        // Decode the token to get the user ID
        // Use jwt.verify to decode the token using the JWT_SECRET
        const decoded = jwt.verify(userToken, JWT_SECRET);

        // Get the user ID from the decoded token
        const userId = decoded.id;

        // Connect to the database
        const db = getDB();

        // Convert the user ID to ObjectId
        const objectId = new ObjectId(userId);
        // Get the journal entry ID from the request parameters
        const entryId = req.params.id;
        // Check if the entry ID is valid
        if (!entryId) {
            return res.status(400).json({ message: 'Invalid entry ID' });
        }
        // Get the updated entry data from the request body
        const { name, prompt } = req.body;

        // Check if the updated entry data is provided
        // If any of them is missing, return an error response
        if (!name || !prompt) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        // Validate the updated entry data
        // Check if the name and content are at least 6 characters long
        // If the name or prompt is less than 6 characters, return an error response
        if (!name || name.length < 6) {
            return res.status(400).json({ message: 'Title must be at least 6 characters long' });
        }
        if (!prompt || prompt.length < 6) {
            return res.status(400).json({ message: 'Content must be at least 6 characters long' });
        }
        // Create an updated entry object
        const updatedEntry = {
            name: req.body.name,
            prompt: req.body.prompt,
            date: new Date()
        }
        // Update the journal entry in the database
        const result = await db.collection('Journals').updateOne(
            { _id: new ObjectId(entryId) },
            { $set: updatedEntry }
        );
    }
}

// Export the journal controller functions
module.exports = {
    getAllEntries,
    createEntry,
    getJournalTypes
}