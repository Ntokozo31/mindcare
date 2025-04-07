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
const register = async (req, res) => {
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
    }