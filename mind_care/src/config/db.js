// Import the MongoClient from the mongodb package
const { MongoClient } = require('mongodb');

// Initialize a variable to hold the database connection
let dbClient;

// Import dotenv to load environment variables
require('dotenv').config();

// Get the MongoDB URI from environment variables
const uri = process.env.MONGO_URI;

// Connect to the MongoDB database
module.exports = { 
    connectToDb: (callback) => {
        MongoClient.connect(uri)
        .then((client) => {
            dbConnection = client.db()
            return callback();
        })
        .catch((err) => {
            console.log('Sorry, there was an error connecting to the database');
        })
    },
    getDB: () => dbConnection
};