const rateLimit = require("express-rate-limit");

// Limit authentication requests
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: process.env.NODE_ENV === "test" ? 100 : 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        message: "Too many requests. Please try again after 15 minutes."
    }
});

module.exports = authLimiter;
