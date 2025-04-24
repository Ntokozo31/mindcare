const { getDB } = require('../db/db');

// Import jwt
const jwt = require('jsonwebtoken');

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
        const decoded = jwt.verify(userId, JWT_SECRET);

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
        const entries = await db.collection('Journals').find({ _id: objectId }).toArray();

        // If entries are found, return them
        if (entries.length > 0) {
            return res.status(200).json(entries);
        } else {
            return res.status(404).json({ message: 'No journal entries found' });
        }
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
        const { title, content } = req.body;

        // Check if title and content are provided
        // If any of them is missing, return an error response
        if (!title || !content) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        // Validate the title and content
        // Check if the title and content are at least 6 characters long
        // If the title or content is less than 6 characters, return an error response 
        if (!title || title.length < 6) {
            return res.status(400).json({ message: 'Title must be at least 6 characters long' });
        }
        if (!content || content.length < 6) {
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
            title: req.body.title,
            content: req.body.content,
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

// Export the journal controller functions
module.exports = {
    getAllEntries,
    createEntry
}