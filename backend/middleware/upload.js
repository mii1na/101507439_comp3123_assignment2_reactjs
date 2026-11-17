const multer = require("multer");
const sharp = require("sharp");

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const allowedTypes = {
    "image/jpeg": "jpeg",
    "image/png": "png",
    "image/webp": "webp"
};

const uploadError = (message) => {
    const error = new Error(message);
    error.code = "INVALID_PROFILE_PICTURE";
    error.status = 400;
    return error;
};

// Configure Multer
const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1,
        fields: 7,
        fieldSize: 16 * 1024
    },

    fileFilter: (req, file, callback) => {
        if (!Object.hasOwn(allowedTypes, file.mimetype)) {
            return callback(
                uploadError("Only JPEG, PNG and WebP images are allowed")
            );
        }

        callback(null, true);
    }
});

// Accept a single profile picture
const uploadProfilePicture = upload.single("profile_picture");

// Validate actual image content
const validateProfilePicture = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        const image = sharp(req.file.buffer, {
            limitInputPixels: 16000000
        });

        const metadata = await image.metadata();

        if (metadata.format !== allowedTypes[req.file.mimetype]) {
            return next(
                uploadError("Invalid image content")
            );
        }

        req.file.buffer = await image
            .rotate()
            .resize(1024, 1024, {
                fit: "inside",
                withoutEnlargement: true
            })
            .webp({ quality: 85 })
            .toBuffer();

        req.file.mimetype = "image/webp";
        req.file.size = req.file.buffer.length;

        next();
    } catch (error) {
        next(uploadError("Invalid or corrupted image file"));
    }
};

module.exports = {
    uploadProfilePicture,
    validateProfilePicture
};