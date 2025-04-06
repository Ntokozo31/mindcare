// Import express
const express = require('express');

// Import cookie-parser for parsing cookies
const cookieParser = require('cookie-parser');

// Initialize the express application
const app = express();

// Body parser for parsing JSON requests
app.use(express.json());

// Use cookie-parser to parse cookies
app.use(cookieParser());