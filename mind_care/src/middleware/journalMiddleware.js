const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const authorizeJournalUpdate = (req, res, next) => {
    try {
        // Get the token from cookies
        const token = req.cookies.token;

        // if not token is provided, return an error response
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        // Attach the user ID to the request object
        req.userId = decoded.id;

        // Call the next middleware or route handler
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Export the middleware function
module.exports = {
    authorizeJournalUpdate,
}