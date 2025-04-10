// Import getDB from the database configuration file
const { getDB } = require('../config/db');

// Import jwt
const jwt = require('jsonwebtoken');

// Import ObjectId from mongodb
const { ObjectId } = require('mongodb');

// Import dotenv to load environment variables
require('dotenv').config();

// Import JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET;

// Function to handle user profile retrieval
const getUserProfile = async (req, res) => {
    try {
        // Get token from cookies
        const userToken = req.cookies.token;

        // Check if the user is authenticated
        // If the user is not authenticated, return an error response
        if (req.params.id !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // If the token is not provided, return an error response
        if (!userToken) {
            return res.status(401).json({ message: 'Sorry Please try to login again' });
        }

        // Decode the token to get the user ID
        // Use jwt.verify to decode the token using the JWT_SECRET
        const decoded = jwt.verify(userToken, JWT_SECRET);

        // Get the user ID from the decoded token
        const userId = decoded.id;

        // Connect to the database
        const db = getDB();

        // Convert the user ID to ObjectId
        // Use the ObjectId constructor to convert the user ID string to ObjectId
        // This is necessary to query the database for the user
        const objectId = new ObjectId(userId);

        // Find the user in the database using the ObjectId
        // Use the findOne method to search for the user in the Users collection
        // Use projection to only return the username, email, and createdAt fields
        const user = await db.collection('Users').findOne({ _id: objectId }, {
            projection: { username: 1, email: 1, createdAt: 1 }
        });

        // If the user is found, return the user profile
        // Else, return an error response
        if (user) {
            return res.status(200).json({
                username: user.username,
                email: user.email,
                joined_MindCare: user.createdAt,
            })
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
        // Catch any errors that occur during the process
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// Export the getUserProfile function
module.exports = {
    getUserProfile
}