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

// Import validator for validating email format
const validator = require('validator');

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

const updateUserProfile = async (req, res) => {
    try {
        // Get token from cookies
        const userToken = req.cookies.token;

        // Check if the user is authenticated
        // If the user is not authenticated, return an error response
        if (req.params.id !== req.userId) {
            return res.status(403).json({ message: 'Acces denied' });
        }

        // If the token is not provided, return an error response
        if (!userToken) {
            return res.status(401).json({ message: 'Sorry please try to login again' });
        }

        // Decode the token to get the user ID
        // Use jwt.verify to decode the token using the JWT_SECRET
        const decode = jwt.verify(userToken, JWT_SECRET);

        // Get the user ID from the decoded token
        const userId = decode.id;

        // Connect to the database
        const db = getDB();

        // Convert the user ID to ObjectId
        // Use the ObjectId constructor to convert the user ID string to ObjectId
        // This is necessary to query the database for the user
        const objectId = new ObjectId(userId);

        // Get the updated user data from the request body
        const { username, email } = req.body;

        // Validate the updated user data
        // Check if the username and email are provided
        if (!username || !email) {
            return res.status(400).json({ message: 'Username and email are required' });
        }

        // Check if email is valid
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Update the user in the database using the ObjectId
        // Use the updateOne method to update the user in the Users collection
        // Use the $set operator to update the username and email fields
        const result = await db.collection('Users').updateOne(
            { _id: objectId },
            { $set: { username, email } }
        );

        // If the user is updated, return a success response
        // Else, return an error response
        if (result.modifiedCount > 0) {
            return res.status(200).json({ message: 'User profile updated successfully' });
        } else {
            return res.status(404).json({ message: 'User not found or no changes made' });
        }
        // Catch any errors that occur during the process
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// Function to handle user profile deletion
const deleteUserProfile = async (req, res) => {
    try {
        // Get token from cookies
        const userToken = req.cookies.token;

        // Check if the user is authenticated
        // If the user is not authenticated, return an error response
        if (req.params.id !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // If token is not provided, return an error response
        if (!userToken) {
            return res.status(401).json({ message: 'Sorry please try to login again' });
        }

        // Decode the token to get the user ID
        // Use jwt.verify to decode the token using the JWT_SECRET
        const decode = jwt.verify(userToken, JWT_SECRET);

        // Get the user ID from the decoded token
        const userId = decode.id;
        // Connect to database
        const db = getDB();

        // Convert the user ID to ObjectId
        // Use the ObjectId constructor to convert the user ID string to ObjectId
        // This is necessary to query the database for the user
        const objectId = new ObjectId(userId);

        // Delete the user from the database using the ObjectId
        // Use the deleteOne method to delete the user from the Users collection
        const result = await db.collection('Users').deleteOne({ _id: objectId });
        
        // If the user is deleted, return a success response
        // Else, return an error response
        if (result.deletedCount > 0) {
            return res.status(200).json({ message: 'User profile deleted successfully' });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
        // Catch any errors that occur during the process
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// Export the user controller functions
module.exports = {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
}