const { logEvent } = require("./requestLogger");

// Handle routes that do not exist
const notFound = (req, res, next) => {
    res.status(404).json({
        message: "Route not found"
    });
};

// Centralized error handler
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    // Profile picture validation error
    if (err.code === "INVALID_PROFILE_PICTURE") {
        logEvent("Invalid profile picture upload", "WARN");

        return res.status(400).json({
            message: err.message
        });
    }

    // Multer file upload errors
    if (err.name === "MulterError") {
        logEvent("File upload rejected", "WARN");

        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({
                message: "Profile picture must not exceed 2 MB"
            });
        }

        if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                message: "Only one profile_picture file is allowed"
            });
        }

        return res.status(400).json({
            message: "Invalid file upload request"
        });
    }

    // Invalid JSON
    if (err.type === "entity.parse.failed") {
        logEvent("Invalid JSON request", "WARN");

        return res.status(400).json({
            message: "Invalid JSON format"
        });
    }

    // Duplicate user
    if (err.code === 11000) {
        logEvent("Duplicate database entry", "WARN");

        return res.status(409).json({
            message: "Duplicate value already exists"
        });
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        logEvent("Database validation failed", "WARN");

        return res.status(400).json({
            message: "Invalid data provided"
        });
    }

    // Invalid MongoDB ID
    if (err.name === "CastError") {
        logEvent("Invalid database ID", "WARN");

        return res.status(400).json({
            message: "Invalid ID format"
        });
    }

    // Unexpected errors
    logEvent(
        `Server error: ${req.method} ${req.path} (${err.name || "Error"})`,
        "ERROR"
    );

    res.status(500).json({
        message: "Internal server error"
    });
};

module.exports = { notFound, errorHandler };