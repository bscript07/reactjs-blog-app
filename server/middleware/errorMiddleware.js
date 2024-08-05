// Middleware to handle 404 Not Found errors
const notFound = (req, res, next) => {
    const error = new Error(`Not found: ${req.originalUrl}`);
    error.statusCode = 404; // Set a custom status code for not found errors
    next(error); // Pass the error to the error handler middleware
};

// Middleware to handle errors
const errorHandler = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error); // Delegate to the default Express error handler if headers are already sent
    }

    // Log the error for debugging
    console.error('Error:', error);

    // Set status code and send JSON response
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        message: error.message || 'An unknown error occurred',
    });
};

module.exports = { notFound, errorHandler };
