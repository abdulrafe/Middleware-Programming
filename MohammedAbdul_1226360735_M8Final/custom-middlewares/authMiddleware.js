const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware for authenticating users
const authenticate = async (req, res, next) => {
    try {
        // Retrieve the JWT token from cookies
        const token = req.cookies.jwt;

        // Verify the token using the JWT_SECRET
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Extract user ID from the decoded token
        const userId = decodedToken.id || decodedToken._id;

        // Find the authenticated user in the database
        const authenticatedUser = await User.findById(userId);

        if (!authenticatedUser) {
            // Redirect to the login page if the user is not found
            res.render(`./login/loginForm`, { title: " You are redirected as you are not Authenticated", user: undefined });
        } else {
            // Set the authenticated user in the request object
            req.user = authenticatedUser;
            next();
        }
    } catch {
        // Redirect to the login page if there's an error in authentication
        res.render(`./login/loginForm`, { title: " You are redirected as you are not Authenticated", user: undefined });
    }
};

// Middleware for authorization based on user roles
const authorize = async (req, res, next) => {
    const currentUser = req.user;
    const userRole = currentUser.role;

    if (userRole) {
        // User is authorized, proceed to the next middleware or route handler
        next();
    } else {
        // User is forbidden from accessing the resource
        res.status(403).json({ message: 'Forbidden' });
    }
};

// Function to fetch a user by ID
async function fetchUserById(userId) {
    try {
        const user = await User.findById(userId);

        if (user) {
            console.log('Found user:', user);
        } else {
            console.log('No user found with the provided ID.');
        }
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}

// Export the authentication and authorization middleware
module.exports = { authenticate, authorize };
