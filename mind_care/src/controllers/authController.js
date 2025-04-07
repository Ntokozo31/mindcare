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