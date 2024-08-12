const jwt = require('jsonwebtoken');
const HttpError = require('../models/errorModel');

const authMiddleware = async (req, res, next) => {
    const Authorization = req.headers.Authorization || req.headers.authorization;

    if (Authorization && Authorization.startsWith('Bearer ')) {
        const token = Authorization.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);
            
            req.user = decoded; // Set the decoded user info to req.user
            next();
        } catch (err) {
            return next(new HttpError('Unauthorized. Invalid token', 403));
        }
    } else {
        return next(new HttpError('Unauthorized. No token provided', 401));
    }
};

module.exports = authMiddleware;
