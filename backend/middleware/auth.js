const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; 
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET); 
        const userId = decodedToken.userId;
        req.auth = { userId: userId };
        next(); // Call next() to pass control to the next middleware
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized request!' });
    }
};