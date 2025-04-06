// Import express
const express = require('express');

// Import cookie-parser for parsing cookies
const cookieParser = require('cookie-parser');

const { connectToDb, getDB } = require('./src/config/db');

// Import dotenv to load environment variables
require('dotenv').config();

// Initialize the express application
const app = express();

// Body parser for parsing JSON requests
app.use(express.json());

// Use cookie-parser to parse cookies
app.use(cookieParser());

// Port number for the server
// Default to 3000 if not specified in environment variables
const PORT = process.env.PORT || 3000;

// Import authentication routes
const authRoutes = require('./src/routes/auth');

// Import user routes
const userRoutes = require('./src/routes/user');

// Import journal routes
const journalRoutes = require('./src/routes/journal');

// Import mental resources routes
const mentalResourcesRoutes = require('./src/routes/mentalResources');

// Import support routes
const supportRoutes = require('./src/routes/support');

// Import mental check routes
const mentalCheckRoutes = require('./src/routes/mentalCheck');

// Authenticate the user
app.use('/api/v1/auth', authRoutes);

// User routes
app.use('/api/v1/user', userRoutes);

// Journal routes
app.use('/api/v1/journal', journalRoutes);

// Mental resources routes
app.use('/api/v1/mentalResources', mentalResourcesRoutes);

// Support routes
app.use('/api/v1/support', supportRoutes);

// Mental check routes
app.use('/api/v1/mentalCheck', mentalCheckRoutes);

let db;
connectToDb((err) => {
    if (!err) {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } else {
        console.log('Failed to connect to the database');
    }
    db = getDB();
});

// Export app
module.exports = app;