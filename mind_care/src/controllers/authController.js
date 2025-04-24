// Import getDB from the config file
const { getDB } = require('../config/db');

// Import bycrypt for hashing passwords
const bcrypt = require('bcrypt');

// Import jwt from jsonwebtoken
const jwt = require('jsonwebtoken');

// Import dotenv to load environment variables
require('dotenv').config();

// Import JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET;

// Import JWT_EXPIRATION
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

// Import validator
const validator = require('validator');

// Import ObjectId from mongodb.
const { ObjectId } = require('mongodb');

// Function to handle user registration
const registerUser = async (req, res) => {
    try {
        // Get username, email, and password from the request body
        const { username, email, password } = req.body;

        // Check if username, email, and password are provided
        // If any of them is missing, return an error response
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Please fill in all fields' });
        }

        // Validate the email format
        // If the email format is invalid, return an error response
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check if the password is at least 6 characters long
        // If the password is less than 6 characters, return an error response
        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        // Hash the password
        // Use bcrypt to hash the password with a salt rounds of 10
        const hashedPassword = await bcrypt.hash(password, 10);

        // Get the database connection
        const db = getDB();

        // Check if a user with the same email already exists in the database
        const existUser = await db.collection('Users').findOne({ email });

        // If a user with the same email exists, return an error response
        if (existUser) {
            return res.status(400).json({ error: 'User with this email already exist'})
        }

        // Create a new user object with the provided username, email, and hashed password
        const newUser = {
            username,
            email,
            password: hashedPassword,
            createdAt: new Date(),
        };

        // Insert the new user into the database
        await db.collection('Users').insertOne(newUser);
        // Generate a JWT token for the new user
        // Use jwt.sign to create a token with the user's ID and a secret key
        const userToken = jwt.sign(
            { id: newUser._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        // Set the token as a cookie in the response
        // Use the res.cookie method to set the token cookie.
        res.cookie('token', userToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000
        })
        // Return a success response with the user's username
        res.status(201).json({ message: `Welcome to Mind Care ${username}`})
    // Catch any errors that occur during the registration process
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    };
};

// Function to handle user login
const loginUser = async (req, res) => {
    try {
        // Get email and password from the request body
        const { email, password } = req.body;

        // Check if email and password are provided
        // If any of them is missing, return an error response
        if (!email || !password) {
            return res.status(400).json({ error: 'Please fill in all fields' });
        }
        // Validate the email format
        // If the email format is invalid, return an error response
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        // Check if the password is at least 6 characters long
        // If the password is less than 6 characters, return an error response
        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        // Connect to the database
        const db = getDB();

        // Check if the user exists in the database
        const user = await db.collection('Users').findOne({ email });

        // If the user does not exist, return an error response
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Check if the password is correct
        // Use bcrypt to compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        // If the password does not match, return an error response
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate a JWT token for the user
        // Use jwt.sign to create a token with the user's ID and a secret key
        // The token will expire after the specified expiration time
        const userToken = jwt.sign(
            { id: user._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        )

        // Set the token as a cookie in the response
        // Use the res.cookie method to set the token cookie
        res.cookie('token', userToken, {
            hrrpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000
        })
        res.status(200).json({ message: `Welcome back ${user.username}` });
    // Catch any errors that occur during the login process
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to handle user logout
const logoutUser = async (req, res) => {
    try {
        // Clear the token cookie to log out the user
        // Use the res.clearCookie method to remove the token cookie
        // The cookie is cleared by setting the same options used when it was created
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
        })
        // Return a success response
        res.status(200).json({ message: 'Logged out successfully' });
    // Catch any errors that occur during the logout process
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Export the controller functions
module.exports = {
    registerUser,
    loginUser,
    logoutUser,
};