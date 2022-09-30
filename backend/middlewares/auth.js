// Import of "jsonwebtoken" to create random and unique tokens
const jwt = require("jsonwebtoken");

// Import environment variables
require("dotenv").config();

// Exporting the token module
module.exports = (req, res, next) => {
    try {
        // Split function that retrieves all the header after space
        const token = req.headers.authorization.split(" ")[1];
        // Decoding token with the verify() function
        const decodedToken = jwt.verify(token, process.env.SECRET);
        const userId = decodedToken.userId;
        // Extracting the user ID of the token and adding to the Request object so that my different routes can exploit it
        req.auth = {
        userId: userId,
        };
        next();
    } 
    catch (error) {
        res.status(401).json({ error });
    }
};
